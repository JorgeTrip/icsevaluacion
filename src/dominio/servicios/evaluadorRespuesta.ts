/**
 * @file evaluadorRespuesta.ts
 * @description Servicio de dominio encargado de evaluar una pregunta individual
 * y generar la traza inmutable del resultado.
 */

import { Pregunta } from '../modelos/tiposPregunta.ts';
import { ResultadoEvaluacionPregunta } from '../modelos/tiposSesion.ts';
import { calcularPuntajeRespuesta } from './calculadorPuntaje.ts';

/**
 * Evalúa la respuesta del estudiante sobre una pregunta específica.
 *
 * @param pregunta Entidad de la pregunta evaluada
 * @param opcionesSeleccionadas Identificadores de las opciones elegidas por el estudiante
 * @returns Registro inmutable con puntaje, estado y timestamp
 */
export function evaluarPregunta(
  pregunta: Pregunta,
  opcionesSeleccionadas: string[]
): ResultadoEvaluacionPregunta {
  if (!opcionesSeleccionadas || !Array.isArray(opcionesSeleccionadas)) {
    throw new Error('Las opciones seleccionadas deben ser un arreglo válido.');
  }

  const { puntaje, estado } = calcularPuntajeRespuesta({
    tipo: pregunta.tipo,
    respuestasCorrectas: pregunta.respuestasCorrectas,
    opcionesSeleccionadas,
  });

  return {
    idPregunta: pregunta.id,
    opcionesSeleccionadas: [...opcionesSeleccionadas],
    puntajeObtenido: puntaje,
    estado,
    fechaRespuesta: new Date().toISOString(),
  };
}
