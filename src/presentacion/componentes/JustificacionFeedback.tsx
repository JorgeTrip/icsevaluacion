/**
 * @file JustificacionFeedback.tsx
 * @description Panel interactivo que despliega la justificación teórica y el botón de avance.
 */

import React from 'react';
import { EstadoResultado } from '../../dominio/modelos/tiposPregunta.ts';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface PropsJustificacionFeedback {
  estado: EstadoResultado;
  puntajeObtenido: number;
  justificacion: string;
  esUltimaPregunta: boolean;
  alAvanzar: () => void;
}

export const JustificacionFeedback: React.FC<PropsJustificacionFeedback> = ({
  estado,
  puntajeObtenido,
  justificacion,
  esUltimaPregunta,
  alAvanzar,
}) => {
  // Configuración visual según el resultado
  const config = {
    CORRECTA: {
      borde: 'border-emerald-500/40',
      fondo: 'bg-emerald-500/10',
      texto: 'text-emerald-400',
      titulo: '¡Correcto!',
      icono: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    },
    PARCIAL: {
      borde: 'border-amber-500/40',
      fondo: 'bg-amber-500/10',
      texto: 'text-amber-400',
      titulo: 'Parcialmente correcto',
      icono: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    },
    INCORRECTA: {
      borde: 'border-red-500/40',
      fondo: 'bg-red-500/10',
      texto: 'text-red-400',
      titulo: 'Incorrecto',
      icono: <XCircle className="w-5 h-5 text-red-400" />,
    },
  }[estado];

  return (
    <div className={`rounded-2xl p-4 sm:p-5 border ${config.borde} ${config.fondo} space-y-4 animate-fadeIn shadow-lg`}>
      {/* Cabecera con estado y puntaje */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {config.icono}
          <span className={`font-semibold text-sm sm:text-base ${config.texto}`}>
            {config.titulo}
          </span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#3A3A3C] text-[#F2F2F7]">
          +{puntajeObtenido.toFixed(2)} pt
        </span>
      </div>

      {/* Justificación Teórica de Cátedra */}
      <div className="space-y-1.5 pt-1 border-t border-[#3A3A3C]/40">
        <div className="flex items-center gap-1.5 text-xs text-[#AEAEB2] font-medium">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Fundamento oficial de cátedra:</span>
        </div>
        <p className="text-xs sm:text-sm text-[#F2F2F7] leading-relaxed">
          {justificacion}
        </p>
      </div>

      {/* Botón de Avance */}
      <button
        onClick={alAvanzar}
        className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm sm:text-base transition-all duration-150 flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
      >
        <span>{esUltimaPregunta ? 'Ver Resultados de la Sesión' : 'Siguiente Pregunta'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
