/**
 * @file esquemaPregunta.ts
 * @description Esquemas Zod para la validación estricta de preguntas y banco de preguntas en frontera.
 */

import { z } from 'zod';
import {
  Cuatrimestre,
  TipoPregunta,
  UnidadTematica,
} from '../modelos/tiposPregunta.ts';

export const EsquemaOpcionPregunta = z.object({
  id: z.string().min(1, 'El ID de la opción no puede estar vacío.'),
  texto: z.string().min(1, 'El texto de la opción no puede estar vacío.'),
});

export const EsquemaPregunta = z.object({
  id: z.string().min(1, 'El ID de la pregunta es requerido.'),
  cuatrimestre: z.nativeEnum(Cuatrimestre),
  unidad: z.nativeEnum(UnidadTematica),
  tipo: z.nativeEnum(TipoPregunta),
  enunciado: z.string().min(1, 'El enunciado no puede estar vacío.'),
  opciones: z.array(EsquemaOpcionPregunta),
  respuestasCorrectas: z.array(z.string()).min(1, 'Debe existir al menos una respuesta correcta.'),
  justificacion: z.string().min(1, 'La justificación teórica es requerida.'),
  fuente: z.string().optional(),
});

export const EsquemaBancoPreguntas = z.array(EsquemaPregunta).min(1, 'El banco debe contener preguntas.');
