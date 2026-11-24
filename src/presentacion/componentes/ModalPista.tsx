/**
 * @file ModalPista.tsx
 * @description Modal accesible estilo Apple que despliega la pista orientadora y su esquema visual.
 */

import React, { useEffect } from 'react';
import { PistaPregunta } from '../../dominio/modelos/tiposPregunta.ts';
import { DiagramaPistaSvg } from './DiagramaPistaSvg.tsx';
import { Lightbulb, X, AlertCircle } from 'lucide-react';

interface PropsModalPista {
  abierto: boolean;
  pista: PistaPregunta;
  yaEvaluada: boolean;
  alCerrar: () => void;
}

export const ModalPista: React.FC<PropsModalPista> = ({
  abierto,
  pista,
  yaEvaluada,
  alCerrar,
}) => {
  useEffect(() => {
    if (!abierto) return;
    const manejarTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') alCerrar();
    };
    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, [abierto, alCerrar]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-modal-pista"
      onClick={alCerrar}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-[#2C2C2E] border border-[#3A3A3C] shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-[#3A3A3C]/70 pb-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Lightbulb className="w-5 h-5" />
            <h3 id="titulo-modal-pista" className="text-sm sm:text-base font-semibold text-[#F2F2F7]">
              Pista de Estudio (Hint)
            </h3>
          </div>
          <button
            onClick={alCerrar}
            className="p-1.5 rounded-lg text-[#AEAEB2] hover:text-[#F2F2F7] hover:bg-[#3A3A3C] transition-colors"
            aria-label="Cerrar pista"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Aviso de regla académica */}
        {!yaEvaluada && (
          <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-200 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Al usar la pista, esta respuesta no sumará puntos. Si respondés bien pasará a tu lista de <strong>Práctica</strong> para volver a resolverla sin ayuda; si fallás, pasará a <strong>Fallos</strong>.
            </span>
          </div>
        )}

        {/* Texto orientador */}
        <p className="text-sm sm:text-base text-[#F2F2F7] leading-relaxed">
          {pista.texto}
        </p>

        {/* Diagrama SVG didáctico opcional */}
        {pista.diagramaId && <DiagramaPistaSvg diagramaId={pista.diagramaId} />}

        <button
          onClick={alCerrar}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          Entendido, volver a la pregunta
        </button>
      </div>
    </div>
  );
};
