/**
 * @file TarjetaPregunta.tsx
 * @description Componente presentacional del enunciado de la pregunta y metadatos.
 */

import React, { useMemo } from 'react';
import { TipoPregunta } from '../../dominio/modelos/tiposPregunta.ts';
import { formatearEnunciado } from '../../dominio/servicios/formateadorEnunciado.ts';
import { HelpCircle } from 'lucide-react';

interface PropsTarjetaPregunta {
  enunciado: string;
  tipo: TipoPregunta;
  fuente?: string;
}

const etiquetasTipo: Record<TipoPregunta, string> = {
  [TipoPregunta.VERDADERO_FALSO]: 'Verdadero o Falso',
  [TipoPregunta.OPCION_UNICA]: 'Opción Única',
  [TipoPregunta.SELECCION_MULTIPLE]: 'Selección Múltiple (una o varias)',
  [TipoPregunta.UNIR_CONCEPTOS]: 'Unir Conceptos con Flechas',
};

export const TarjetaPregunta: React.FC<PropsTarjetaPregunta> = ({
  enunciado,
  tipo,
  fuente,
}) => {
  const bloques = useMemo(() => formatearEnunciado(enunciado), [enunciado]);

  return (
    <article className="rounded-2xl p-5 bg-[#2C2C2E] border border-[#3A3A3C] shadow-lg space-y-3">
      {/* Encabezado con tipo de reactivo */}
      <div className="flex items-center justify-between text-xs text-[#AEAEB2]">
        <span className="flex items-center gap-1 font-medium text-emerald-400">
          <HelpCircle className="w-3.5 h-3.5" />
          {etiquetasTipo[tipo]}
        </span>
        {fuente && (
          <span className="text-[10px] text-[#8E8E93] truncate max-w-[180px]" title={fuente}>
            {fuente}
          </span>
        )}
      </div>

      {/* Enunciado estructurado con subítems y bloques de código */}
      <div className="space-y-3 select-text">
        {bloques.map((bloque, idx) => {
          if (bloque.tipo === 'codigo') {
            return (
              <pre
                key={idx}
                className="rounded-xl bg-[#1C1C1E] border border-[#3A3A3C] p-3.5 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed"
              >
                <code>{bloque.contenido}</code>
              </pre>
            );
          }

          if (bloque.tipo === 'lista') {
            return (
              <ul key={idx} className="space-y-2 pt-0.5" aria-label="Afirmaciones o elementos del enunciado">
                {bloque.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-2.5 rounded-xl bg-[#1C1C1E]/75 border border-[#3A3A3C]/70 px-3.5 py-2.5 text-sm sm:text-base text-[#E5E5EA] leading-relaxed"
                  >
                    <span className="mt-0.5 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold shrink-0">
                      {item.etiqueta}
                    </span>
                    <span>{item.texto}</span>
                  </li>
                ))}
              </ul>
            );
          }

          const esInstruccionPosterior = idx > 0 && bloques[idx - 1]?.tipo === 'lista';
          return idx === 0 ? (
            <h2 key={idx} className="text-base sm:text-lg font-medium text-[#F2F2F7] leading-relaxed">
              {bloque.contenido}
            </h2>
          ) : (
            <p
              key={idx}
              className={
                esInstruccionPosterior
                  ? 'text-sm sm:text-base font-medium text-[#AEAEB2] leading-relaxed pt-1'
                  : 'text-base sm:text-lg font-medium text-[#F2F2F7] leading-relaxed'
              }
            >
              {bloque.contenido}
            </p>
          );
        })}
      </div>
    </article>
  );
};
