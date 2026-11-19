/**
 * @file tiposSesion.ts
 * @description Interfaces y tipos para la sesión de evaluación activa y su configuración.
 */

import { Cuatrimestre, UnidadTematica, TipoPregunta, EstadoResultado, Pregunta } from './tiposPregunta.ts';

export type FiltroCuatrimestre = Cuatrimestre | 'AMBOS';
export type FiltroTipoPregunta = 'TODOS' | 'VF' | 'CHOICE';
export type TamanoTanda = 10 | 20 | 30 | 'INFINITA';
export type ModoEvaluacion = 'INMEDIATO' | 'REPASO_FALLOS';

export interface ConfiguracionSesion {
  cuatrimestre: FiltroCuatrimestre;
  unidadesFiltro: UnidadTematica[];
  tipoFiltro: FiltroTipoPregunta;
  tamanoTanda: TamanoTanda;
  modo: ModoEvaluacion;
}

export interface ResultadoEvaluacionPregunta {
  idPregunta: string;
  opcionesSeleccionadas: string[];
  puntajeObtenido: number;
  estado: EstadoResultado;
  fechaRespuesta: string;
}

export interface ResumenSesionFinalizada {
  idSesion: string;
  fechaInicio: string;
  fechaFin: string;
  totalPreguntas: number;
  correctas: number;
  parciales: number;
  incorrectas: number;
  puntajeTotalObtenido: number;
  puntajeMaximoPosible: number;
  porcentajeEfectividad: number;
  respuestas: ResultadoEvaluacionPregunta[];
  preguntasRespondidas: Pregunta[];
}
