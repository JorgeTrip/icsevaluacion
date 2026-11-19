/**
 * @file SelectorUnidades.tsx
 * @description Píldoras interactivas para filtrar preguntas por unidades temáticas.
 */

import React from 'react';
import { UnidadTematica } from '../../dominio/modelos/tiposPregunta.ts';

interface PropsSelectorUnidades {
  unidadesVisibles: { id: UnidadTematica; etiqueta: string }[];
  unidadesFiltro: UnidadTematica[];
  alAlternar: (u: UnidadTematica) => void;
}

export const SelectorUnidades: React.FC<PropsSelectorUnidades> = ({
  unidadesVisibles,
  unidadesFiltro,
  alAlternar,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-[#AEAEB2] uppercase tracking-wider">
        2. Unidades Específicas (opcional)
      </label>
      <div className="flex flex-wrap gap-2">
        {unidadesVisibles.map((u) => {
          const activa = unidadesFiltro.includes(u.id);
          return (
            <button
              key={u.id}
              type="button"
              onClick={() => alAlternar(u.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                activa
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-[#2C2C2E] border-[#3A3A3C] text-[#AEAEB2] hover:border-[#48484A]'
              }`}
            >
              {u.etiqueta}
            </button>
          );
        })}
      </div>
    </div>
  );
};
