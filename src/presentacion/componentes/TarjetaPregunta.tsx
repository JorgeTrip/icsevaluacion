/**
 * @file TarjetaPregunta.tsx
 * @description Componente presentacional del enunciado de la pregunta y metadatos.
 */

import React from 'react';
import { TipoPregunta } from '../../dominio/modelos/tiposPregunta.ts';
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

      {/* Enunciado */}
      <h2 className="text-base sm:text-lg font-medium text-[#F2F2F7] leading-relaxed select-text">
        {enunciado}
      </h2>
    </article>
  );
};
