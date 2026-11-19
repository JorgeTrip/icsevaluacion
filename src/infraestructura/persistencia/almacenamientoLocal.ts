/**
 * @file almacenamientoLocal.ts
 * @description Adaptador de persistencia para LocalStorage con degradación elegante a memoria.
 */

import { ProgresoEstudiante } from '../../dominio/modelos/tiposProgreso.ts';
import { crearProgresoInicial } from '../../dominio/servicios/gestorProgreso.ts';
import { EsquemaRespaldoProgreso } from '../../dominio/esquemas/esquemaProgreso.ts';

const CLAVE_ALMACENAMIENTO = 'ics_evaluacion_progreso_v1';
let memoriaVolatil: ProgresoEstudiante | null = null;

function esLocalStorageDisponible(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testClave = '__test_almacenamiento__';
    window.localStorage.setItem(testClave, '1');
    window.localStorage.removeItem(testClave);
    return true;
  } catch {
    return false;
  }
}

export function obtenerProgresoGuardado(): ProgresoEstudiante {
  if (!esLocalStorageDisponible()) {
    return memoriaVolatil || crearProgresoInicial();
  }

  try {
    const raw = window.localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (!raw) {
      const inicial = crearProgresoInicial();
      guardarProgreso(inicial);
      return inicial;
    }

    const parseado = JSON.parse(raw);
    const validacion = EsquemaRespaldoProgreso.safeParse(parseado);

    if (!validacion.success) {
      console.warn('Datos en LocalStorage corruptos. Se reestablece progreso inicial.');
      const inicial = crearProgresoInicial();
      guardarProgreso(inicial);
      return inicial;
    }

    const { historialFallos, estadisticas, rendimientoPorUnidad } = validacion.data;
    return {
      historialFallos,
      estadisticas,
      // @ts-expect-error mapeo seguro
      rendimientoPorUnidad,
    };
  } catch (error) {
    console.warn('Error al leer de LocalStorage:', error);
    return crearProgresoInicial();
  }
}

export function guardarProgreso(progreso: ProgresoEstudiante): void {
  memoriaVolatil = progreso;

  if (!esLocalStorageDisponible()) {
    return;
  }

  try {
    const objetoGuardar = {
      version: 1,
      fechaExportacion: new Date().toISOString(),
      historialFallos: progreso.historialFallos,
      estadisticas: progreso.estadisticas,
      rendimientoPorUnidad: progreso.rendimientoPorUnidad,
    };
    window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(objetoGuardar));
  } catch (error) {
    console.warn('Error al escribir en LocalStorage:', error);
  }
}

export function limpiarProgresoGuardado(): void {
  memoriaVolatil = null;
  if (esLocalStorageDisponible()) {
    try {
      window.localStorage.removeItem(CLAVE_ALMACENAMIENTO);
    } catch (error) {
      console.warn('Error al limpiar LocalStorage:', error);
    }
  }
}
