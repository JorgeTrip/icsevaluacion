/**
 * @file esquemaProgreso.ts
 * @description Esquemas Zod para la persistencia e importación segura de estadísticas
 * y progreso del alumno en formato JSON (soberanía de datos).
 */

import { z } from 'zod';

export const EsquemaRegistroFallo = z.object({
  idPregunta: z.string().min(1),
  contadorFallos: z.number().int().min(1),
  ultimoFallo: z.string(),
});

export const EsquemaEstadisticas = z.object({
  totalRespondidas: z.number().int().min(0),
  totalCorrectas: z.number().int().min(0),
  totalParciales: z.number().int().min(0),
  totalIncorrectas: z.number().int().min(0),
  puntajeAcumulado: z.number().min(0),
});

export const EsquemaRendimientoUnidad = z.object({
  respondidas: z.number().int().min(0),
  correctas: z.number().int().min(0),
});

export const EsquemaRespaldoProgreso = z.object({
  version: z.number().int().min(1),
  fechaExportacion: z.string(),
  historialFallos: z.array(EsquemaRegistroFallo),
  historialPractica: z.array(EsquemaRegistroFallo).default([]),
  estadisticas: EsquemaEstadisticas,
  rendimientoPorUnidad: z.record(z.string(), EsquemaRendimientoUnidad),
});

export type RespaldoProgreso = z.infer<typeof EsquemaRespaldoProgreso>;
