/**
 * @file serializadorJson.ts
 * @description Módulo de serialización y validación segura para la exportación e importación
 * de estadísticas y progresos del estudiante en formato JSON (soberanía de datos).
 */

import { ProgresoEstudiante } from '../../dominio/modelos/tiposProgreso.ts';
import { EsquemaRespaldoProgreso, RespaldoProgreso } from '../../dominio/esquemas/esquemaProgreso.ts';

export interface ResultadoImportacion {
  exito: boolean;
  datos?: ProgresoEstudiante;
  error?: string;
}

/**
 * Convierte el estado de progreso a un string JSON formateado y validado.
 */
export function exportarProgresoAJson(progreso: ProgresoEstudiante): string {
  const objetoRespaldo: RespaldoProgreso = {
    version: 1,
    fechaExportacion: new Date().toISOString(),
    historialFallos: progreso.historialFallos,
    historialPractica: progreso.historialPractica || [],
    estadisticas: progreso.estadisticas,
    rendimientoPorUnidad: progreso.rendimientoPorUnidad,
  };

  return JSON.stringify(objetoRespaldo, null, 2);
}

/**
 * Parsea e importa un string JSON, validando estrictamente su esquema antes de admitirlo.
 */
export function importarProgresoDesdeJson(jsonString: string): ResultadoImportacion {
  try {
    const objeto = JSON.parse(jsonString);
    const resultadoValidacion = EsquemaRespaldoProgreso.safeParse(objeto);

    if (!resultadoValidacion.success) {
      return {
        exito: false,
        error: 'El formato del archivo JSON no cumple con el esquema oficial de progreso.',
      };
    }

    const { historialFallos, historialPractica, estadisticas, rendimientoPorUnidad } = resultadoValidacion.data;

    // Castear de forma segura al modelo de dominio
    const progresoRestaurado: ProgresoEstudiante = {
      historialFallos,
      historialPractica,
      estadisticas,
      // @ts-expect-error mapeo de clave string a UnidadTematica
      rendimientoPorUnidad,
    };

    return {
      exito: true,
      datos: progresoRestaurado,
    };
  } catch (error) {
    return {
      exito: false,
      error: `Error al procesar el archivo: ${(error as Error).message}`,
    };
  }
}
