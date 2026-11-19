/**
 * @file tiposPregunta.ts
 * @description Definiciones de tipos y enumeraciones para las preguntas de evaluación
 * de la cátedra de Ingeniería y Calidad de Software (UTN FRBA).
 */

export enum Cuatrimestre {
  PRIMERO = '1C',
  SEGUNDO = '2C',
}

export enum UnidadTematica {
  U1 = 'U1', // Introducción a la Ingeniería de Software
  U2 = 'U2', // Modelos de Calidad de Software
  U3 = 'U3', // Software Engineering Approaches
  U4 = 'U4', // Estimaciones de Software
  U5 = 'U5', // Software Configuration Management
  U6 = 'U6', // Testing de Software
}

export enum TipoPregunta {
  VERDADERO_FALSO = 'VERDADERO_FALSO',
  OPCION_UNICA = 'OPCION_UNICA',
  SELECCION_MULTIPLE = 'SELECCION_MULTIPLE',
}

export type EstadoResultado = 'CORRECTA' | 'PARCIAL' | 'INCORRECTA';

export interface OpcionPregunta {
  id: string;
  texto: string;
}

export interface Pregunta {
  id: string;
  cuatrimestre: Cuatrimestre;
  unidad: UnidadTematica;
  tipo: TipoPregunta;
  enunciado: string;
  opciones: OpcionPregunta[];
  respuestasCorrectas: string[];
  justificacion: string;
  fuente?: string;
}

export interface EntradaEvaluacion {
  tipo: TipoPregunta;
  respuestasCorrectas: string[];
  opcionesSeleccionadas: string[];
}

export interface ResultadoEvaluacionPuntaje {
  puntaje: number;
  estado: EstadoResultado;
}
