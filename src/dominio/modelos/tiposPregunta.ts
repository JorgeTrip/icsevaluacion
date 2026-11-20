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
  U1 = 'U1',
  U2 = 'U2',
  U3 = 'U3',
  U4 = 'U4',
  U5 = 'U5',
  U6 = 'U6',
}

export enum TipoPregunta {
  VERDADERO_FALSO = 'VERDADERO_FALSO',
  OPCION_UNICA = 'OPCION_UNICA',
  SELECCION_MULTIPLE = 'SELECCION_MULTIPLE',
  UNIR_CONCEPTOS = 'UNIR_CONCEPTOS',
}

export type EstadoResultado = 'CORRECTA' | 'PARCIAL' | 'INCORRECTA';

export interface OpcionPregunta {
  id: string;
  texto: string;
}

export interface ParEmparejamiento {
  origenId: string;
  destinoId: string;
}

export interface Pregunta {
  id: string;
  cuatrimestre: Cuatrimestre;
  unidad: UnidadTematica;
  tipo: TipoPregunta;
  enunciado: string;
  opciones: OpcionPregunta[]; // Conceptos Columna A (Origen)
  opcionesDestino?: OpcionPregunta[]; // Conceptos Columna B (Destino para UNIR_CONCEPTOS)
  respuestasCorrectas: string[]; // En UNIR_CONCEPTOS: ['origenId:destinoId', ...]
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
