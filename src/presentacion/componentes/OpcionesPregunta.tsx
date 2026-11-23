/**
 * @file OpcionesPregunta.tsx
 * @description Listado táctil de alternativas con retroalimentación cromática inmediata.
 */

import React from 'react';
import { OpcionPregunta, TipoPregunta } from '../../dominio/modelos/tiposPregunta.ts';
import { Check, X, CheckSquare, Square } from 'lucide-react';

interface PropsOpcionesPregunta {
  opciones: OpcionPregunta[];
  tipo: TipoPregunta;
  opcionesSeleccionadas: string[];
  respuestasCorrectas: string[];
  estaEvaluada: boolean;
  alSeleccionar: (idOpcion: string) => void;
  alConfirmarMultiple: () => void;
}

export const OpcionesPregunta: React.FC<PropsOpcionesPregunta> = ({
  opciones,
  tipo,
  opcionesSeleccionadas,
  respuestasCorrectas,
  estaEvaluada,
  alSeleccionar,
  alConfirmarMultiple,
}) => {
  const esMultiple = tipo === TipoPregunta.SELECCION_MULTIPLE;

  return (
    <div className="space-y-3">
      {/* Listado de Opciones */}
      <div className={tipo === TipoPregunta.VERDADERO_FALSO ? 'grid grid-cols-2 gap-3' : 'space-y-2.5'}>
        {opciones.map((opcion) => {
          const estaSeleccionada = opcionesSeleccionadas.includes(opcion.id);
          const esCorrecta = respuestasCorrectas.includes(opcion.id);

          // Clases dinámicas según estado de evaluación
          let estilosTarjeta = 'bg-[#2C2C2E] border-[#3A3A3C] text-[#F2F2F7] hover:border-[#48484A]';
          let iconoEstado = null;

          if (estaEvaluada) {
            if (esCorrecta && (!esMultiple || estaSeleccionada)) {
              estilosTarjeta = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-medium';
              iconoEstado = <Check className="w-5 h-5 text-emerald-400 shrink-0" />;
            } else if (esCorrecta && esMultiple && !estaSeleccionada) {
              estilosTarjeta = 'bg-amber-500/10 border-amber-500/50 border-dashed text-amber-300 font-medium';
              iconoEstado = (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  Faltó marcar
                </span>
              );
            } else if (estaSeleccionada && !esCorrecta) {
              estilosTarjeta = 'bg-red-500/15 border-red-500/40 text-red-300 font-medium';
              iconoEstado = <X className="w-5 h-5 text-red-400 shrink-0" />;
            } else {
              estilosTarjeta = 'bg-[#2C2C2E]/60 border-[#3A3A3C]/40 text-[#8E8E93] opacity-60';
            }
          } else if (estaSeleccionada) {
            estilosTarjeta = 'bg-emerald-500/10 border-emerald-500/50 text-[#F2F2F7] shadow-sm';
          }

          return (
            <button
              key={opcion.id}
              onClick={() => alSeleccionar(opcion.id)}
              disabled={estaEvaluada}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-150 min-h-[52px] flex items-center justify-between gap-3 active:scale-[0.99] ${estilosTarjeta}`}
            >
              <div className="flex items-center gap-3">
                {esMultiple && (
                  <span className="text-[#AEAEB2] shrink-0">
                    {estaSeleccionada ? (
                      <CheckSquare className={`w-5 h-5 ${estaEvaluada && !esCorrecta ? 'text-red-400' : 'text-emerald-400'}`} />
                    ) : (
                      <Square className={`w-5 h-5 ${estaEvaluada && esCorrecta ? 'text-amber-400' : ''}`} />
                    )}
                  </span>
                )}
                <span className="text-sm sm:text-base leading-snug">{opcion.texto}</span>
              </div>
              {iconoEstado}
            </button>
          );
        })}
      </div>

      {/* Botón de Confirmación para Selección Múltiple */}
      {esMultiple && !estaEvaluada && (
        <button
          onClick={alConfirmarMultiple}
          disabled={opcionesSeleccionadas.length === 0}
          className="w-full mt-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white font-medium text-sm sm:text-base transition-all duration-150 shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>Comprobar Respuesta</span>
          <span className="text-xs bg-emerald-700/60 px-2 py-0.5 rounded-full">
            {opcionesSeleccionadas.length} marcada{opcionesSeleccionadas.length === 1 ? '' : 's'}
          </span>
        </button>
      )}
    </div>
  );
};
