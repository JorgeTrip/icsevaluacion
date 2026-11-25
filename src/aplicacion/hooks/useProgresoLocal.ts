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

/**
 * Depura registros de fallos y práctica cuyos IDs ya no existan en el banco vigente.
 */
function sanearProgresoConBanco(
  progreso: ProgresoEstudiante,
  idsValidos?: Set<string>
): { saneado: ProgresoEstudiante; huboCambios: boolean } {
  if (!idsValidos) return { saneado: progreso, huboCambios: false };

  const fallosVigentes = progreso.historialFallos.filter((f) => idsValidos.has(f.idPregunta));
  const practicaVigente = (progreso.historialPractica || []).filter((f) => idsValidos.has(f.idPregunta));
  const huboCambios =
    fallosVigentes.length !== progreso.historialFallos.length ||
    practicaVigente.length !== (progreso.historialPractica || []).length;

  if (!huboCambios) return { saneado: progreso, huboCambios: false };

  return {
    saneado: {
      ...progreso,
      historialFallos: fallosVigentes,
      historialPractica: practicaVigente,
    },
    huboCambios: true,
  };
}

export function useProgresoLocal(idsValidos?: Set<string>) {
  const [progreso, setProgreso] = useState<ProgresoEstudiante>(() => {
    const guardado = obtenerProgresoGuardado();
    const { saneado, huboCambios } = sanearProgresoConBanco(guardado, idsValidos);
    if (huboCambios) {
      guardarProgreso(saneado);
    }
    return saneado;
  });

  const idsFallosPendientes = useMemo(() => {
    return progreso.historialFallos.map((f) => f.idPregunta);
  }, [progreso.historialFallos]);

  const idsPracticaPendientes = useMemo(() => {
    return (progreso.historialPractica || []).map((f) => f.idPregunta);
  }, [progreso.historialPractica]);

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
      const { saneado } = sanearProgresoConBanco(resultado.datos, idsValidos);
      setProgreso(saneado);
      guardarProgreso(saneado);
    }
    return resultado;
  }, [idsValidos]);

  const borrarHistorial = useCallback(() => {
    const inicial = crearProgresoInicial();
    limpiarProgresoGuardado();
    setProgreso(inicial);
  }, []);

  return {
    progreso,
    idsFallosPendientes,
    idsPracticaPendientes,
    registrarRespuesta,
    exportarHistorial,
    importarHistorial,
    borrarHistorial,
  };
}
