/**
 * @file PantallaEvaluacion.tsx
 * @description Pantalla principal de respuesta interactiva y retroalimentación inmediata.
 */

import React from 'react';
import { Pregunta } from '../../dominio/modelos/tiposPregunta.ts';
import {
  ConfiguracionSesion,
  ResultadoEvaluacionPregunta,
} from '../../dominio/modelos/tiposSesion.ts';
import { EstadoPreguntaActiva } from '../../aplicacion/hooks/useSesionEvaluacion.ts';
import { BarraProgreso } from '../componentes/BarraProgreso.tsx';
import { TarjetaPregunta } from '../componentes/TarjetaPregunta.tsx';
import { OpcionesPregunta } from '../componentes/OpcionesPregunta.tsx';
import { JustificacionFeedback } from '../componentes/JustificacionFeedback.tsx';
import { AlertCircle } from 'lucide-react';

interface PropsPantallaEvaluacion {
  pregunta: Pregunta | null;
  indiceActual: number;
  totalPreguntas: number;
  configuracion: ConfiguracionSesion | null;
  opcionesSeleccionadas: string[];
  resultadoActual: ResultadoEvaluacionPregunta | null;
  estadoPregunta: EstadoPreguntaActiva;
  alSeleccionarOpcion: (idOpcion: string) => void;
  alConfirmarMultiple: () => void;
  alAvanzarSiguiente: () => void;
  alFinalizarSesion: () => void;
  alVolverAInicio: () => void;
}

export const PantallaEvaluacion: React.FC<PropsPantallaEvaluacion> = ({
  pregunta,
  indiceActual,
  totalPreguntas,
  configuracion,
  opcionesSeleccionadas,
  resultadoActual,
  estadoPregunta,
  alSeleccionarOpcion,
  alConfirmarMultiple,
  alAvanzarSiguiente,
  alFinalizarSesion,
  alVolverAInicio,
}) => {
  if (!pregunta) {
    return (
      <div className="rounded-2xl p-8 bg-[#2C2C2E] border border-[#3A3A3C] text-center space-y-4 my-8">
        <div className="inline-flex p-3 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-[#F2F2F7]">
          No hay preguntas disponibles con los filtros seleccionados
        </h3>
        <p className="text-xs sm:text-sm text-[#AEAEB2] max-w-sm mx-auto">
          Prueba ampliando los filtros de cuatrimestre o seleccionando más unidades temáticas.
        </p>
        <button
          onClick={alVolverAInicio}
          className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          Volver a Configuración
        </button>
      </div>
    );
  }

  const esInfinita = configuracion?.tamanoTanda === 'INFINITA';
  const esUltima = !esInfinita && indiceActual + 1 >= totalPreguntas;

  return (
    <div className="space-y-5 pb-8 animate-fadeIn">
      {/* Barra de progreso e indicadores de cuatrimestre/unidad */}
      <BarraProgreso
        indiceActual={indiceActual}
        totalPreguntas={totalPreguntas}
        cuatrimestre={pregunta.cuatrimestre}
        unidad={pregunta.unidad}
        esInfinita={esInfinita}
        alFinalizar={alFinalizarSesion}
      />

      {/* Tarjeta del reactivo */}
      <TarjetaPregunta
        enunciado={pregunta.enunciado}
        tipo={pregunta.tipo}
        fuente={pregunta.fuente}
      />

      {/* Opciones interactivas táctiles */}
      <OpcionesPregunta
        opciones={pregunta.opciones}
        tipo={pregunta.tipo}
        opcionesSeleccionadas={opcionesSeleccionadas}
        respuestasCorrectas={pregunta.respuestasCorrectas}
        estaEvaluada={estadoPregunta === 'EVALUADA'}
        alSeleccionar={alSeleccionarOpcion}
        alConfirmarMultiple={alConfirmarMultiple}
      />

      {/* Justificación y botón de avance cuando la respuesta está evaluada */}
      {estadoPregunta === 'EVALUADA' && resultadoActual && (
        <JustificacionFeedback
          estado={resultadoActual.estado}
          puntajeObtenido={resultadoActual.puntajeObtenido}
          justificacion={pregunta.justificacion}
          esUltimaPregunta={esUltima}
          alAvanzar={alAvanzarSiguiente}
        />
      )}
    </div>
  );
};
