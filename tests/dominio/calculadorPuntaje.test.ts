import { describe, it, expect } from 'vitest';
import { calcularPuntajeRespuesta } from '../../src/dominio/servicios/calculadorPuntaje.ts';
import { TipoPregunta } from '../../src/dominio/modelos/tiposPregunta.ts';

describe('Servicio de Dominio: calculadorPuntaje', () => {
  describe('Preguntas Verdadero / Falso', () => {
    it('debe otorgar 1.0 punto cuando la respuesta coincide', () => {
      const resultado = calcularPuntajeRespuesta({
        tipo: TipoPregunta.VERDADERO_FALSO,
        respuestasCorrectas: ['v'],
        opcionesSeleccionadas: ['v'],
      });

      expect(resultado.puntaje).toBe(1.0);
      expect(resultado.estado).toBe('CORRECTA');
    });

    it('debe otorgar 0.0 puntos cuando la respuesta no coincide', () => {
      const resultado = calcularPuntajeRespuesta({
        tipo: TipoPregunta.VERDADERO_FALSO,
        respuestasCorrectas: ['v'],
        opcionesSeleccionadas: ['f'],
      });

      expect(resultado.puntaje).toBe(0.0);
      expect(resultado.estado).toBe('INCORRECTA');
    });
  });

  describe('Preguntas de Opción Única', () => {
    it('debe otorgar 1.0 punto cuando se selecciona la única opción correcta', () => {
      const resultado = calcularPuntajeRespuesta({
        tipo: TipoPregunta.OPCION_UNICA,
        respuestasCorrectas: ['b'],
        opcionesSeleccionadas: ['b'],
      });

      expect(resultado.puntaje).toBe(1.0);
      expect(resultado.estado).toBe('CORRECTA');
    });

    it('debe otorgar 0.0 puntos cuando se selecciona una opción incorrecta', () => {
      const resultado = calcularPuntajeRespuesta({
        tipo: TipoPregunta.OPCION_UNICA,
        respuestasCorrectas: ['b'],
        opcionesSeleccionadas: ['a'],
      });

      expect(resultado.puntaje).toBe(0.0);
      expect(resultado.estado).toBe('INCORRECTA');
    });
  });

  describe('Preguntas de Selección Múltiple con Penalización Proporcional', () => {
    // Escenario: 3 respuestas correctas ('a', 'b', 'c'), 2 incorrectas ('d', 'e')
    const correctas = ['a', 'b', 'c'];

    it('debe otorgar 1.0 punto si selecciona exactamente todas las correctas y ninguna incorrecta', () => {
      const resultado = calcularPuntajeRespuesta({
        tipo: TipoPregunta.SELECCION_MULTIPLE,
        respuestasCorrectas: correctas,
        opcionesSeleccionadas: ['a', 'b', 'c'],
      });

      expect(resultado.puntaje).toBe(1.0);
      expect(resultado.estado).toBe('CORRECTA');
    });

    it('debe otorgar puntaje proporcional sin penalización cuando marca menos correctas pero 0 incorrectas', () => {
      // 2 correctas de 3 => 2/3 = 0.67
      const resultado = calcularPuntajeRespuesta({
        tipo: TipoPregunta.SELECCION_MULTIPLE,
        respuestasCorrectas: correctas,
        opcionesSeleccionadas: ['a', 'b'],
      });

      expect(resultado.puntaje).toBeCloseTo(2 / 3, 2);
      expect(resultado.estado).toBe('PARCIAL');
    });

    it('debe penalizar por opciones incorrectas marcadas: (Aciertos - Errores) / TotalCorrectas', () => {
      // 2 correctas ('a', 'b') y 1 incorrecta ('d') de 3 correctas => (2 - 1) / 3 = 0.33
      const resultado = calcularPuntajeRespuesta({
        tipo: TipoPregunta.SELECCION_MULTIPLE,
        respuestasCorrectas: correctas,
        opcionesSeleccionadas: ['a', 'b', 'd'],
      });

      expect(resultado.puntaje).toBeCloseTo(1 / 3, 2);
      expect(resultado.estado).toBe('PARCIAL');
    });

    it('debe acotar a 0.0 puntos (no negatividad) cuando los errores superan a los aciertos', () => {
      // 1 correcta ('a') y 2 incorrectas ('d', 'e') => (1 - 2) / 3 = -0.33 -> 0.0
      const resultado = calcularPuntajeRespuesta({
        tipo: TipoPregunta.SELECCION_MULTIPLE,
        respuestasCorrectas: correctas,
        opcionesSeleccionadas: ['a', 'd', 'e'],
      });

      expect(resultado.puntaje).toBe(0.0);
      expect(resultado.estado).toBe('INCORRECTA');
    });

    it('debe otorgar 0.0 puntos si no seleccionó ninguna opción', () => {
      const resultado = calcularPuntajeRespuesta({
        tipo: TipoPregunta.SELECCION_MULTIPLE,
        respuestasCorrectas: correctas,
        opcionesSeleccionadas: [],
      });

      expect(resultado.puntaje).toBe(0.0);
      expect(resultado.estado).toBe('INCORRECTA');
    });
  });
});
