/**
 * @file gestorProgreso.ts
 * @description Servicio de dominio que administra de forma inmutable el cálculo
 * de estadísticas, fallos pendientes y rendimiento por unidad temática.
 */

import { Pregunta, UnidadTematica } from '../modelos/tiposPregunta.ts';
import {
  ProgresoEstudiante,
  RegistroFallo,
  RendimientoPorUnidad,
} from '../modelos/tiposProgreso.ts';
import { ResultadoEvaluacionPregunta } from '../modelos/tiposSesion.ts';

/**
 * Crea la estructura inicial de progreso con valores neutros en cero.
 */
export function crearProgresoInicial(): ProgresoEstudiante {
  const rendimientoInicial: RendimientoPorUnidad = {
    [UnidadTematica.U1]: { respondidas: 0, correctas: 0 },
    [UnidadTematica.U2]: { respondidas: 0, correctas: 0 },
    [UnidadTematica.U3]: { respondidas: 0, correctas: 0 },
    [UnidadTematica.U4]: { respondidas: 0, correctas: 0 },
    [UnidadTematica.U5]: { respondidas: 0, correctas: 0 },
    [UnidadTematica.U6]: { respondidas: 0, correctas: 0 },
  };

  return {
    historialFallos: [],
    estadisticas: {
      totalRespondidas: 0,
      totalCorrectas: 0,
      totalParciales: 0,
      totalIncorrectas: 0,
      puntajeAcumulado: 0,
    },
    rendimientoPorUnidad: rendimientoInicial,
  };
}

/**
 * Actualiza el progreso de forma inmutable a partir de una nueva respuesta evaluada.
 *
 * @param progresoActual Estado vigente del progreso del alumno
 * @param pregunta Pregunta que fue contestada
 * @param resultado Resultado de la evaluación
 * @returns Nuevo estado inmutable de progreso
 */
export function actualizarProgresoConRespuesta(
  progresoActual: ProgresoEstudiante,
  pregunta: Pregunta,
  resultado: ResultadoEvaluacionPregunta
): ProgresoEstudiante {
  const { estado, puntajeObtenido, fechaRespuesta } = resultado;
  const esAciertoTotal = estado === 'CORRECTA';

  // 1. Actualizar Estadísticas Globales
  const nuevasEstadisticas = {
    ...progresoActual.estadisticas,
    totalRespondidas: progresoActual.estadisticas.totalRespondidas + 1,
    totalCorrectas:
      progresoActual.estadisticas.totalCorrectas + (esAciertoTotal ? 1 : 0),
    totalParciales:
      progresoActual.estadisticas.totalParciales +
      (estado === 'PARCIAL' ? 1 : 0),
    totalIncorrectas:
      progresoActual.estadisticas.totalIncorrectas +
      (estado === 'INCORRECTA' ? 1 : 0),
    puntajeAcumulado:
      progresoActual.estadisticas.puntajeAcumulado + puntajeObtenido,
  };

  // 2. Actualizar Rendimiento por Unidad
  const rendimientoUnidadActual =
    progresoActual.rendimientoPorUnidad[pregunta.unidad] || {
      respondidas: 0,
      correctas: 0,
    };

  const nuevoRendimientoPorUnidad: RendimientoPorUnidad = {
    ...progresoActual.rendimientoPorUnidad,
    [pregunta.unidad]: {
      respondidas: rendimientoUnidadActual.respondidas + 1,
      correctas:
        rendimientoUnidadActual.correctas + (esAciertoTotal ? 1 : 0),
    },
  };

  // 3. Gestionar Historial de Fallos
  let nuevoHistorialFallos = [...progresoActual.historialFallos];

  if (esAciertoTotal) {
    // Si respondió 100% bien, se remueve de la lista de fallos pendientes
    nuevoHistorialFallos = nuevoHistorialFallos.filter(
      (f) => f.idPregunta !== pregunta.id
    );
  } else {
    // Si falló o fue parcial, se agrega o incrementa el contador
    const indiceExistente = nuevoHistorialFallos.findIndex(
      (f) => f.idPregunta !== pregunta.id
    );

    const falloPrevio = nuevoHistorialFallos.find(
      (f) => f.idPregunta === pregunta.id
    );

    if (falloPrevio) {
      nuevoHistorialFallos = nuevoHistorialFallos.map((f) =>
        f.idPregunta === pregunta.id
          ? {
              ...f,
              contadorFallos: f.contadorFallos + 1,
              ultimoFallo: fechaRespuesta,
            }
          : f
      );
    } else {
      const nuevoFallo: RegistroFallo = {
        idPregunta: pregunta.id,
        contadorFallos: 1,
        ultimoFallo: fechaRespuesta,
      };
      nuevoHistorialFallos.push(nuevoFallo);
    }
  }

  return {
    historialFallos: nuevoHistorialFallos,
    estadisticas: nuevasEstadisticas,
    rendimientoPorUnidad: nuevoRendimientoPorUnidad,
  };
}
