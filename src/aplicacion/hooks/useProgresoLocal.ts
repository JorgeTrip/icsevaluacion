/**
 * @file useProgresoLocal.ts
 * @description Hook de aplicación que sincroniza el progreso del alumno con
 * el adaptador de persistencia en LocalStorage y serializador JSON.
 */

import { useState, useCallback, useMemo } from 'react';
import { Pregunta } from '../../dominio/modelos/tiposPregunta.ts';
import { ResultadoEvaluacionPregunta } from '../../dominio/modelos/tiposSesion.ts';
import { ProgresoEstudiante } from '../../dominio/modelos/tiposProgreso.ts';
import { actualizarProgresoConRespuesta, crearProgresoInicial } from '../../dominio/servicios/gestorProgreso.ts';
import {
  obtenerProgresoGuardado,
  guardarProgreso,
  limpiarProgresoGuardado,
} from '../../infraestructura/persistencia/almacenamientoLocal.ts';
import {
  exportarProgresoAJson,
  importarProgresoDesdeJson,
  ResultadoImportacion,
} from '../../infraestructura/persistencia/serializadorJson.ts';

export function useProgresoLocal() {
  const [progreso, setProgreso] = useState<ProgresoEstudiante>(() => obtenerProgresoGuardado());

  const idsFallosPendientes = useMemo(() => {
    return progreso.historialFallos.map((f) => f.idPregunta);
  }, [progreso.historialFallos]);

  const registrarRespuesta = useCallback(
    (pregunta: Pregunta, resultado: ResultadoEvaluacionPregunta) => {
      setProgreso((prev) => {
        const actualizado = actualizarProgresoConRespuesta(prev, pregunta, resultado);
        guardarProgreso(actualizado);
        return actualizado;
      });
    },
    []
  );

  const exportarHistorial = useCallback((): string => {
    return exportarProgresoAJson(progreso);
  }, [progreso]);

  const importarHistorial = useCallback((contenidoJson: string): ResultadoImportacion => {
    const resultado = importarProgresoDesdeJson(contenidoJson);
    if (resultado.exito && resultado.datos) {
      setProgreso(resultado.datos);
      guardarProgreso(resultado.datos);
    }
    return resultado;
  }, []);

  const borrarHistorial = useCallback(() => {
    const inicial = crearProgresoInicial();
    limpiarProgresoGuardado();
    setProgreso(inicial);
  }, []);

  return {
    progreso,
    idsFallosPendientes,
    registrarRespuesta,
    exportarHistorial,
    importarHistorial,
    borrarHistorial,
  };
}
