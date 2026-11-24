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
    historialPractica: [],
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

function registrarEnLista(
  lista: RegistroFallo[],
  idPregunta: string,
  fechaRespuesta: string
): RegistroFallo[] {
  const existente = lista.find((f) => f.idPregunta === idPregunta);
  if (existente) {
    return lista.map((f) =>
      f.idPregunta === idPregunta
        ? { ...f, contadorFallos: f.contadorFallos + 1, ultimoFallo: fechaRespuesta }
        : f
    );
  }
  return [...lista, { idPregunta, contadorFallos: 1, ultimoFallo: fechaRespuesta }];
}

/**
 * Actualiza el progreso de forma inmutable a partir de una nueva respuesta evaluada.
 * Si se utilizó pista (hint), el acierto no suma puntaje ni aciertos y pasa a historialPractica.
 */
export function actualizarProgresoConRespuesta(
  progresoActual: ProgresoEstudiante,
  pregunta: Pregunta,
  resultado: ResultadoEvaluacionPregunta
): ProgresoEstudiante {
  const { estado, puntajeObtenido, fechaRespuesta, usoPista = false } = resultado;
  const esAciertoValido = estado === 'CORRECTA' && !usoPista;
  const esAciertoConPista = estado === 'CORRECTA' && usoPista;

  // 1. Actualizar Estadísticas Globales
  const nuevasEstadisticas = {
    ...progresoActual.estadisticas,
    totalRespondidas: progresoActual.estadisticas.totalRespondidas + 1,
    totalCorrectas:
      progresoActual.estadisticas.totalCorrectas + (esAciertoValido ? 1 : 0),
    totalParciales:
      progresoActual.estadisticas.totalParciales + (estado === 'PARCIAL' ? 1 : 0),
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
      correctas: rendimientoUnidadActual.correctas + (esAciertoValido ? 1 : 0),
    },
  };

  // 3. Gestionar Historial de Fallos y Lista de Práctica (aciertos con pista)
  let nuevoHistorialFallos = [...progresoActual.historialFallos];
  let nuevoHistorialPractica = [...(progresoActual.historialPractica || [])];

  if (esAciertoValido) {
    nuevoHistorialFallos = nuevoHistorialFallos.filter((f) => f.idPregunta !== pregunta.id);
    nuevoHistorialPractica = nuevoHistorialPractica.filter((f) => f.idPregunta !== pregunta.id);
  } else if (esAciertoConPista) {
    nuevoHistorialFallos = nuevoHistorialFallos.filter((f) => f.idPregunta !== pregunta.id);
    nuevoHistorialPractica = registrarEnLista(nuevoHistorialPractica, pregunta.id, fechaRespuesta);
  } else {
    nuevoHistorialPractica = nuevoHistorialPractica.filter((f) => f.idPregunta !== pregunta.id);
    nuevoHistorialFallos = registrarEnLista(nuevoHistorialFallos, pregunta.id, fechaRespuesta);
  }

  return {
    historialFallos: nuevoHistorialFallos,
    historialPractica: nuevoHistorialPractica,
    estadisticas: nuevasEstadisticas,
    rendimientoPorUnidad: nuevoRendimientoPorUnidad,
  };
}
