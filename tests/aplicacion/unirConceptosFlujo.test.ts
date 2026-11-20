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

describe('Capa de Aplicación: Flujo de Unir Conceptos', () => {
  const preguntaUnirMock: Pregunta = {
    id: 'u3-unir-test',
    cuatrimestre: Cuatrimestre.PRIMERO,
    unidad: UnidadTematica.U3,
    tipo: TipoPregunta.UNIR_CONCEPTOS,
    enunciado: 'Empareje cada ceremonia de Scrum con su propósito:',
    opciones: [
      { id: 'review', texto: 'Sprint Review' },
      { id: 'retro', texto: 'Retrospectiva' },
    ],
    opcionesDestino: [
      { id: 'def-review', texto: 'Inspeccionar el incremento' },
      { id: 'def-retro', texto: 'Mejora continua del equipo' },
    ],
    respuestasCorrectas: [
      'review:def-review',
      'retro:def-retro',
    ],
    justificacion: 'La review inspecciona el producto y la retro el proceso.',
  };

  it('debe permitir formar pares y evaluar con éxito 100% de acierto', () => {
    const { result } = renderHook(() => useSesionEvaluacion());
    const config: ConfiguracionSesion = {
      cuatrimestre: '1C',
      unidadesFiltro: [UnidadTematica.U3],
      tipoFiltro: 'UNIR',
      tamanoTanda: 10,
      modo: 'INMEDIATO',
    };

    act(() => {
      result.current.iniciarEvaluacion(config, [preguntaUnirMock], []);
    });

    expect(result.current.preguntaActual?.tipo).toBe(TipoPregunta.UNIR_CONCEPTOS);

    // Formar las parejas
    act(() => {
      result.current.establecerOpcionesSeleccionadas([
        'review:def-review',
        'retro:def-retro',
      ]);
    });

    // Confirmar emparejamientos
    act(() => {
      result.current.confirmarRespuestaMultiple();
    });

    expect(result.current.estadoPregunta).toBe('EVALUADA');
    expect(result.current.resultadoActual?.estado).toBe('CORRECTA');
    expect(result.current.resultadoActual?.puntajeObtenido).toBe(1.0);
  });

  it('debe otorgar puntaje parcial 0.5 cuando se acierta 1 de 2 pares', () => {
    const { result } = renderHook(() => useSesionEvaluacion());
    const config: ConfiguracionSesion = {
      cuatrimestre: '1C',
      unidadesFiltro: [UnidadTematica.U3],
      tipoFiltro: 'UNIR',
      tamanoTanda: 10,
      modo: 'INMEDIATO',
    };

    act(() => {
      result.current.iniciarEvaluacion(config, [preguntaUnirMock], []);
    });

    // Formar 1 pareja bien y 1 mal
    act(() => {
      result.current.establecerOpcionesSeleccionadas([
        'review:def-review', // Acierto
        'retro:def-review',  // Error
      ]);
    });

    act(() => {
      result.current.confirmarRespuestaMultiple();
    });

    expect(result.current.estadoPregunta).toBe('EVALUADA');
    expect(result.current.resultadoActual?.estado).toBe('PARCIAL');
    expect(result.current.resultadoActual?.puntajeObtenido).toBe(0.5);
  });
});
