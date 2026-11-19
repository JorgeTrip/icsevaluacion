/**
 * @file calculadorPuntaje.ts
 * @description Servicio de dominio que implementa la lógica determinista de cálculo
 * de puntuación y penalización de acuerdo con las especificaciones de cátedra.
 */

import {
  TipoPregunta,
  EntradaEvaluacion,
  ResultadoEvaluacionPuntaje,
} from '../modelos/tiposPregunta.ts';

/**
 * Calcula la calificación obtenida por el estudiante en una pregunta según su tipo
 * y las respuestas seleccionadas, aplicando penalizaciones proporcionales con piso en cero.
 *
 * @param entrada Datos de la pregunta y selecciones del usuario
 * @returns Puntaje normalizado entre 0.0 y 1.0 junto con el estado del resultado
 */
export function calcularPuntajeRespuesta(
  entrada: EntradaEvaluacion
): ResultadoEvaluacionPuntaje {
  const { tipo, respuestasCorrectas, opcionesSeleccionadas } = entrada;

  // Validación de frontera: si no hay selecciones, el puntaje es nulo
  if (!opcionesSeleccionadas || opcionesSeleccionadas.length === 0) {
    return { puntaje: 0.0, estado: 'INCORRECTA' };
  }

  if (
    tipo === TipoPregunta.VERDADERO_FALSO ||
    tipo === TipoPregunta.OPCION_UNICA
  ) {
    const esCorrecta =
      opcionesSeleccionadas.length === 1 &&
      opcionesSeleccionadas[0] === respuestasCorrectas[0];

    return {
      puntaje: esCorrecta ? 1.0 : 0.0,
      estado: esCorrecta ? 'CORRECTA' : 'INCORRECTA',
    };
  }

  // Selección Múltiple con penalización: P = (Aciertos - Errores) / TotalCorrectas
  const conjuntoCorrectas = new Set(respuestasCorrectas);
  let aciertos = 0;
  let errores = 0;

  for (const seleccion of opcionesSeleccionadas) {
    if (conjuntoCorrectas.has(seleccion)) {
      aciertos++;
    } else {
      errores++;
    }
  }

  const divisor = respuestasCorrectas.length;
  if (divisor === 0) {
    return { puntaje: 0.0, estado: 'INCORRECTA' };
  }

  const puntajeBruto = (aciertos - errores) / divisor;
  // Regla de no negatividad: el puntaje nunca puede ser menor a 0.0
  const puntajeFinal = Math.max(0.0, Math.min(1.0, puntajeBruto));

  if (puntajeFinal === 1.0) {
    return { puntaje: 1.0, estado: 'CORRECTA' };
  }

  if (puntajeFinal > 0.0) {
    return { puntaje: puntajeFinal, estado: 'PARCIAL' };
  }

  return { puntaje: 0.0, estado: 'INCORRECTA' };
}
