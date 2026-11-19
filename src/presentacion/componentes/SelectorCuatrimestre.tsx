/**
 * @file SelectorCuatrimestre.tsx
 * @description Selector segmentado táctil para elegir el cuatrimestre o alcance de estudio.
 */

import React from 'react';
import { FiltroCuatrimestre } from '../../dominio/modelos/tiposSesion.ts';

interface PropsSelectorCuatrimestre {
  cuatrimestre: FiltroCuatrimestre;
  alSeleccionar: (valor: FiltroCuatrimestre) => void;
}

const opciones = [
  { id: 'AMBOS', label: 'Toda la Materia' },
  { id: '1C', label: '1er Cuatrimestre' },
  { id: '2C', label: '2do Cuatrimestre' },
];

export const SelectorCuatrimestre: React.FC<PropsSelectorCuatrimestre> = ({
  cuatrimestre,
  alSeleccionar,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-[#AEAEB2] uppercase tracking-wider">
        1. Cuatrimestre / Alcance
      </label>
      <div className="grid grid-cols-3 gap-2">
        {opciones.map((op) => (
          <button
            key={op.id}
            type="button"
            onClick={() => alSeleccionar(op.id as FiltroCuatrimestre)}
            className={`p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
              cuatrimestre === op.id
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-[#2C2C2E] border-[#3A3A3C] text-[#AEAEB2] hover:border-[#48484A]'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>
    </div>
  );
};
