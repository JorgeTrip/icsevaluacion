import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSesionEvaluacion } from '../../src/aplicacion/hooks/useSesionEvaluacion.ts';
import {
  Cuatrimestre,
  Pregunta,
  TipoPregunta,
  UnidadTematica,
} from '../../src/dominio/modelos/tiposPregunta.ts';
import { ConfiguracionSesion } from '../../src/dominio/modelos/tiposSesion.ts';

describe('Capa de Aplicación: useSesionEvaluacion', () => {
  const bancoMock: Pregunta[] = [
    {
      id: 'p1',
      cuatrimestre: Cuatrimestre.PRIMERO,
      unidad: UnidadTematica.U1,
      tipo: TipoPregunta.VERDADERO_FALSO,
      enunciado: 'Enunciado 1',
      opciones: [
        { id: 'v', texto: 'Verdadero' },
        { id: 'f', texto: 'Falso' },
      ],
      respuestasCorrectas: ['v'],
      justificacion: 'J1',
    },
    {
      id: 'p2',
      cuatrimestre: Cuatrimestre.PRIMERO,
      unidad: UnidadTematica.U2,
      tipo: TipoPregunta.OPCION_UNICA,
      enunciado: 'Enunciado 2',
      opciones: [
        { id: 'a', texto: 'Opción A' },
        { id: 'b', texto: 'Opción B' },
      ],
      respuestasCorrectas: ['a'],
      justificacion: 'J2',
    },
  ];

  it('debe iniciar en estado CONFIGURACION con valores iniciales limpios', () => {
    const { result } = renderHook(() => useSesionEvaluacion());

    expect(result.current.estadoSesion).toBe('CONFIGURACION');
    expect(result.current.preguntaActual).toBeNull();
    expect(result.current.indiceActual).toBe(0);
    expect(result.current.opcionesSeleccionadas).toEqual([]);
  });

  it('debe iniciar la sesión de evaluación pasando a estado EVALUANDO', () => {
    const { result } = renderHook(() => useSesionEvaluacion());
    const config: ConfiguracionSesion = {
      cuatrimestre: '1C',
      unidadesFiltro: [],
      tipoFiltro: 'TODOS',
      tamanoTanda: 10,
      modo: 'INMEDIATO',
    };

    act(() => {
      result.current.iniciarEvaluacion(config, bancoMock, []);
    });

    expect(result.current.estadoSesion).toBe('EVALUANDO');
    expect(result.current.preguntaActual).not.toBeNull();
    expect(result.current.totalPreguntas).toBe(2);
  });

  it('debe registrar y evaluar la respuesta inmediatamente en pregunta V/F', () => {
    const { result } = renderHook(() => useSesionEvaluacion());
    const config: ConfiguracionSesion = {
      cuatrimestre: '1C',
      unidadesFiltro: [],
      tipoFiltro: 'VF',
      tamanoTanda: 10,
      modo: 'INMEDIATO',
    };

    act(() => {
      result.current.iniciarEvaluacion(config, bancoMock, []);
    });

    // En V/F, al tocar 'v' se selecciona y se autocalifica
    act(() => {
      result.current.seleccionarOpcion('v');
    });

    expect(result.current.estadoPregunta).toBe('EVALUADA');
    expect(result.current.resultadoActual?.estado).toBe('CORRECTA');
    expect(result.current.resultadoActual?.puntajeObtenido).toBe(1.0);
  });
});
