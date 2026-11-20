/**
 * @file calculadorPuntaje.ts
 * @description Servicio de dominio que implementa el cálculo determinista
 * de puntuación y penalizaciones según el tipo de reactivo.
 */

import {
  TipoPregunta,
  EntradaEvaluacion,
  ResultadoEvaluacionPuntaje,
} from '../modelos/tiposPregunta.ts';

/**
 * Calcula la calificación obtenida por el estudiante en una pregunta según su tipo
 * y las respuestas seleccionadas.
 */
export function calcularPuntajeRespuesta(
  entrada: EntradaEvaluacion
): ResultadoEvaluacionPuntaje {
  const { tipo, respuestasCorrectas, opcionesSeleccionadas } = entrada;

  // Validación de frontera: si no hay selecciones, el puntaje es nulo
  if (!opcionesSeleccionadas || opcionesSeleccionadas.length === 0) {
    return { puntaje: 0.0, estado: 'INCORRECTA' };
  }

  // 1. Verdadero / Falso y Opción Única: Todo o nada
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

  // 2. Unir Conceptos: Proporcional sin penalización
  if (tipo === TipoPregunta.UNIR_CONCEPTOS) {
    const totalPares = respuestasCorrectas.length;
    if (totalPares === 0) return { puntaje: 0.0, estado: 'INCORRECTA' };

    const setCorrectas = new Set(respuestasCorrectas);
    let aciertos = 0;
    for (const seleccion of opcionesSeleccionadas) {
      if (setCorrectas.has(seleccion)) {
        aciertos++;
      }
    }

    const puntaje = Math.min(1.0, Math.max(0.0, aciertos / totalPares));
    if (puntaje === 1.0) return { puntaje: 1.0, estado: 'CORRECTA' };
    if (puntaje > 0.0) return { puntaje, estado: 'PARCIAL' };
    return { puntaje: 0.0, estado: 'INCORRECTA' };
  }

  // 3. Selección Múltiple con penalización: P = (Aciertos - Errores) / TotalCorrectas
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
  const puntajeFinal = Math.max(0.0, Math.min(1.0, puntajeBruto));

  if (puntajeFinal === 1.0) {
    return { puntaje: 1.0, estado: 'CORRECTA' };
  }
  if (puntajeFinal > 0.0) {
    return { puntaje: puntajeFinal, estado: 'PARCIAL' };
  }
  return { puntaje: 0.0, estado: 'INCORRECTA' };
}
