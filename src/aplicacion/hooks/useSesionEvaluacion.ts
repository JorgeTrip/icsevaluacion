/**
 * @file useSesionEvaluacion.ts
 * @description Hook de aplicación que orquesta el ciclo de vida y la máquina de estados
 * de una tanda de evaluación (configuración -> evaluación -> resultados).
 */

import { useState, useCallback } from 'react';
import { Pregunta, TipoPregunta } from '../../dominio/modelos/tiposPregunta.ts';
import {
  ConfiguracionSesion,
  ResultadoEvaluacionPregunta,
} from '../../dominio/modelos/tiposSesion.ts';
import { generarTandaPreguntas } from '../../dominio/servicios/generadorTanda.ts';
import { evaluarPregunta } from '../../dominio/servicios/evaluadorRespuesta.ts';

export type EstadoFlujoSesion = 'CONFIGURACION' | 'EVALUANDO' | 'RESULTADOS' | 'HISTORIAL';
export type EstadoPreguntaActiva = 'PENDIENTE' | 'EVALUADA';

export function useSesionEvaluacion() {
  const [estadoSesion, setEstadoSesion] = useState<EstadoFlujoSesion>('CONFIGURACION');
  const [configuracion, setConfiguracion] = useState<ConfiguracionSesion | null>(null);
  const [tanda, setTanda] = useState<Pregunta[]>([]);
  const [indiceActual, setIndiceActual] = useState<number>(0);
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<string[]>([]);
  const [resultadoActual, setResultadoActual] = useState<ResultadoEvaluacionPregunta | null>(null);
  const [estadoPregunta, setEstadoPregunta] = useState<EstadoPreguntaActiva>('PENDIENTE');
  const [usoPistaActual, setUsoPistaActual] = useState<boolean>(false);
  const [respuestasRegistradas, setRespuestasRegistradas] = useState<ResultadoEvaluacionPregunta[]>([]);

  const preguntaActual = tanda[indiceActual] || null;
  const totalPreguntas = tanda.length;

  const iniciarEvaluacion = useCallback(
    (
      config: ConfiguracionSesion,
      bancoCompleto: Pregunta[],
      idsFallos: string[] = [],
      idsPractica: string[] = []
    ) => {
      const preguntasFiltradas = generarTandaPreguntas(
        bancoCompleto,
        config,
        idsFallos,
        idsPractica
      );
      setConfiguracion(config);
      setTanda(preguntasFiltradas);
      setIndiceActual(0);
      setOpcionesSeleccionadas([]);
      setResultadoActual(null);
      setEstadoPregunta('PENDIENTE');
      setUsoPistaActual(false);
      setRespuestasRegistradas([]);
      setEstadoSesion('EVALUANDO');
    },
    []
  );

  const registrarUsoPista = useCallback(() => {
    if (estadoPregunta === 'PENDIENTE') {
      setUsoPistaActual(true);
    }
  }, [estadoPregunta]);

  const calificarSeleccion = useCallback(
    (nuevasOpciones: string[], pregunta: Pregunta, onRegistrar?: (p: Pregunta, r: ResultadoEvaluacionPregunta) => void) => {
      const evaluacion = evaluarPregunta(pregunta, nuevasOpciones, usoPistaActual);
      setResultadoActual(evaluacion);
      setEstadoPregunta('EVALUADA');
      setRespuestasRegistradas((prev) => [...prev, evaluacion]);
      if (onRegistrar) {
        onRegistrar(pregunta, evaluacion);
      }
    },
    [usoPistaActual]
  );

  const seleccionarOpcion = useCallback(
    (idOpcion: string, onRegistrar?: (p: Pregunta, r: ResultadoEvaluacionPregunta) => void) => {
      if (!preguntaActual || estadoPregunta === 'EVALUADA') return;

      if (preguntaActual.tipo === TipoPregunta.SELECCION_MULTIPLE) {
        setOpcionesSeleccionadas((prev) =>
          prev.includes(idOpcion) ? prev.filter((id) => id !== idOpcion) : [...prev, idOpcion]
        );
      } else {
        // En V/F u Opción Única: se califica inmediatamente al tocar
        const seleccionUnica = [idOpcion];
        setOpcionesSeleccionadas(seleccionUnica);
        calificarSeleccion(seleccionUnica, preguntaActual, onRegistrar);
      }
    },
    [preguntaActual, estadoPregunta, calificarSeleccion]
  );

  const confirmarRespuestaMultiple = useCallback(
    (onRegistrar?: (p: Pregunta, r: ResultadoEvaluacionPregunta) => void) => {
      if (!preguntaActual || estadoPregunta === 'EVALUADA') return;
      calificarSeleccion(opcionesSeleccionadas, preguntaActual, onRegistrar);
    },
    [preguntaActual, estadoPregunta, opcionesSeleccionadas, calificarSeleccion]
  );

  const avanzarSiguiente = useCallback(() => {
    if (indiceActual + 1 < totalPreguntas) {
      setIndiceActual((prev) => prev + 1);
      setOpcionesSeleccionadas([]);
      setResultadoActual(null);
      setEstadoPregunta('PENDIENTE');
      setUsoPistaActual(false);
    } else {
      setEstadoSesion('RESULTADOS');
    }
  }, [indiceActual, totalPreguntas]);

  const finalizarEvaluacion = useCallback(() => {
    setEstadoSesion('RESULTADOS');
  }, []);

  const volverAConfiguracion = useCallback(() => {
    setEstadoSesion('CONFIGURACION');
    setTanda([]);
    setIndiceActual(0);
    setResultadoActual(null);
    setOpcionesSeleccionadas([]);
    setEstadoPregunta('PENDIENTE');
    setUsoPistaActual(false);
  }, []);

  const irAHistorial = useCallback(() => {
    setEstadoSesion('HISTORIAL');
  }, []);

  return {
    estadoSesion,
    configuracion,
    tanda,
    indiceActual,
    preguntaActual,
    totalPreguntas,
    opcionesSeleccionadas,
    resultadoActual,
    estadoPregunta,
    usoPistaActual,
    respuestasRegistradas,
    iniciarEvaluacion,
    registrarUsoPista,
    seleccionarOpcion,
    establecerOpcionesSeleccionadas: setOpcionesSeleccionadas,
    confirmarRespuestaMultiple,
    avanzarSiguiente,
    finalizarEvaluacion,
    volverAConfiguracion,
    irAHistorial,
  };
}
