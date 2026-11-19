import { describe, it, expect } from 'vitest';
import {
  crearProgresoInicial,
  actualizarProgresoConRespuesta,
} from '../../src/dominio/servicios/gestorProgreso.ts';
import {
  Cuatrimestre,
  Pregunta,
  TipoPregunta,
  UnidadTematica,
} from '../../src/dominio/modelos/tiposPregunta.ts';
import { ResultadoEvaluacionPregunta } from '../../src/dominio/modelos/tiposSesion.ts';

describe('Servicio de Dominio: gestorProgreso', () => {
  const preguntaTest: Pregunta = {
    id: 'u1-01',
    cuatrimestre: Cuatrimestre.PRIMERO,
    unidad: UnidadTematica.U1,
    tipo: TipoPregunta.VERDADERO_FALSO,
    enunciado: 'Test Enunciado',
    opciones: [],
    respuestasCorrectas: ['v'],
    justificacion: 'Test Justificación',
  };

  it('debe inicializar un progreso con contadores en cero para todas las unidades', () => {
    const progreso = crearProgresoInicial();

    expect(progreso.estadisticas.totalRespondidas).toBe(0);
    expect(progreso.estadisticas.totalCorrectas).toBe(0);
    expect(progreso.historialFallos).toEqual([]);
    expect(progreso.rendimientoPorUnidad.U1.respondidas).toBe(0);
    expect(progreso.rendimientoPorUnidad.U6.respondidas).toBe(0);
  });

  it('debe registrar un fallo en historialFallos e incrementar contadores cuando se responde incorrectamente', () => {
    const progresoInicial = crearProgresoInicial();
    const resultadoIncorrecto: ResultadoEvaluacionPregunta = {
      idPregunta: 'u1-01',
      opcionesSeleccionadas: ['f'],
      puntajeObtenido: 0.0,
      estado: 'INCORRECTA',
      fechaRespuesta: new Date().toISOString(),
    };

    const nuevoProgreso = actualizarProgresoConRespuesta(
      progresoInicial,
      preguntaTest,
      resultadoIncorrecto
    );

    expect(nuevoProgreso.estadisticas.totalRespondidas).toBe(1);
    expect(nuevoProgreso.estadisticas.totalIncorrectas).toBe(1);
    expect(nuevoProgreso.estadisticas.totalCorrectas).toBe(0);
    expect(nuevoProgreso.rendimientoPorUnidad.U1.respondidas).toBe(1);
    expect(nuevoProgreso.rendimientoPorUnidad.U1.correctas).toBe(0);

    // Debe existir en el historial de fallos
    expect(nuevoProgreso.historialFallos.length).toBe(1);
    expect(nuevoProgreso.historialFallos[0].idPregunta).toBe('u1-01');
    expect(nuevoProgreso.historialFallos[0].contadorFallos).toBe(1);
  });

  it('debe remover la pregunta de historialFallos cuando se responde correctamente', () => {
    const progresoConFallo = {
      ...crearProgresoInicial(),
      historialFallos: [
        {
          idPregunta: 'u1-01',
          contadorFallos: 1,
          ultimoFallo: new Date().toISOString(),
        },
      ],
    };

    const resultadoCorrecto: ResultadoEvaluacionPregunta = {
      idPregunta: 'u1-01',
      opcionesSeleccionadas: ['v'],
      puntajeObtenido: 1.0,
      estado: 'CORRECTA',
      fechaRespuesta: new Date().toISOString(),
    };

    const progresoSuperado = actualizarProgresoConRespuesta(
      progresoConFallo,
      preguntaTest,
      resultadoCorrecto
    );

    expect(progresoSuperado.estadisticas.totalCorrectas).toBe(1);
    expect(progresoSuperado.rendimientoPorUnidad.U1.correctas).toBe(1);
    // Ya no debe estar en fallos pendientes
    expect(progresoSuperado.historialFallos.length).toBe(0);
  });
});
