import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProgresoLocal } from '../../src/aplicacion/hooks/useProgresoLocal.ts';
import {
  Cuatrimestre,
  Pregunta,
  TipoPregunta,
  UnidadTematica,
} from '../../src/dominio/modelos/tiposPregunta.ts';
import { ResultadoEvaluacionPregunta } from '../../src/dominio/modelos/tiposSesion.ts';
import {
  guardarProgreso,
  limpiarProgresoGuardado,
} from '../../src/infraestructura/persistencia/almacenamientoLocal.ts';
import { crearProgresoInicial } from '../../src/dominio/servicios/gestorProgreso.ts';

describe('Capa de Aplicación: useProgresoLocal', () => {
  beforeEach(() => {
    limpiarProgresoGuardado();
  });

  const preguntaMock: Pregunta = {
    id: 'u1-01',
    cuatrimestre: Cuatrimestre.PRIMERO,
    unidad: UnidadTematica.U1,
    tipo: TipoPregunta.VERDADERO_FALSO,
    enunciado: 'Enunciado mock',
    opciones: [],
    respuestasCorrectas: ['v'],
    justificacion: 'J',
  };

  it('debe inicializarse con progreso en cero', () => {
    const { result } = renderHook(() => useProgresoLocal());
    expect(result.current.progreso.estadisticas.totalRespondidas).toBe(0);
    expect(result.current.idsFallosPendientes).toEqual([]);
  });

  it('debe registrar una respuesta errónea y reflejarla en los fallos pendientes', () => {
    const { result } = renderHook(() => useProgresoLocal());
    const resultadoFallo: ResultadoEvaluacionPregunta = {
      idPregunta: 'u1-01',
      opcionesSeleccionadas: ['f'],
      puntajeObtenido: 0.0,
      estado: 'INCORRECTA',
      fechaRespuesta: new Date().toISOString(),
    };

    act(() => {
      result.current.registrarRespuesta(preguntaMock, resultadoFallo);
    });

    expect(result.current.progreso.estadisticas.totalRespondidas).toBe(1);
    expect(result.current.progreso.estadisticas.totalIncorrectas).toBe(1);
    expect(result.current.idsFallosPendientes).toContain('u1-01');
  });

  it('debe depurar IDs obsoletos de historialFallos e historialPractica que ya no existan en el banco', () => {
    const progresoConHuerfanos = crearProgresoInicial();
    progresoConHuerfanos.historialFallos = [
      { idPregunta: 'u1-01', ultimoFallo: new Date().toISOString(), contadorFallos: 1 },
      { idPregunta: 'u1-071', ultimoFallo: new Date().toISOString(), contadorFallos: 2 },
    ];
    progresoConHuerfanos.historialPractica = [
      { idPregunta: 'u1-071', ultimoFallo: new Date().toISOString(), contadorFallos: 1 },
    ];
    guardarProgreso(progresoConHuerfanos);

    const idsValidos = new Set(['u1-01', 'u1-02']);
    const { result } = renderHook(() => useProgresoLocal(idsValidos));

    expect(result.current.idsFallosPendientes).toEqual(['u1-01']);
    expect(result.current.idsPracticaPendientes).toEqual([]);
  });
});
