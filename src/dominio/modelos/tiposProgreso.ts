/**
 * @file tiposProgreso.ts
 * @description Interfaces para el seguimiento histórico del estudiante y estadísticas.
 */

import { UnidadTematica } from './tiposPregunta.ts';

export interface RegistroFallo {
  idPregunta: string;
  contadorFallos: number;
  ultimoFallo: string;
}

export interface EstadisticasGlobales {
  totalRespondidas: number;
  totalCorrectas: number;
  totalParciales: number;
  totalIncorrectas: number;
  puntajeAcumulado: number;
}

export type RendimientoPorUnidad = Record<
  UnidadTematica,
  {
    respondidas: number;
    correctas: number;
  }
>;

export interface ProgresoEstudiante {
  historialFallos: RegistroFallo[];
  estadisticas: EstadisticasGlobales;
  rendimientoPorUnidad: RendimientoPorUnidad;
}
