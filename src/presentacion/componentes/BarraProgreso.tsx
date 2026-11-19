/**
 * @file BarraProgreso.tsx
 * @description Indicador visual de avance y métricas de la tanda activa.
 */

import React from 'react';
import { Cuatrimestre, UnidadTematica } from '../../dominio/modelos/tiposPregunta.ts';
import { LogOut } from 'lucide-react';

interface PropsBarraProgreso {
  indiceActual: number;
  totalPreguntas: number;
  cuatrimestre: Cuatrimestre;
  unidad: UnidadTematica;
  esInfinita: boolean;
  alFinalizar: () => void;
}

const nombresUnidades: Record<UnidadTematica, string> = {
  U1: 'U1 · Introducción',
  U2: 'U2 · Modelos Calidad',
  U3: 'U3 · Approaches',
  U4: 'U4 · Estimaciones',
  U5: 'U5 · SCM',
  U6: 'U6 · Testing',
};

export const BarraProgreso: React.FC<PropsBarraProgreso> = ({
  indiceActual,
  totalPreguntas,
  cuatrimestre,
  unidad,
  esInfinita,
  alFinalizar,
}) => {
  const porcentaje = esInfinita
    ? 100
    : Math.round(((indiceActual + 1) / Math.max(1, totalPreguntas)) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs text-[#AEAEB2]">
        {/* Badges de Unidad y Cuatrimestre */}
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium border border-emerald-500/25">
            {cuatrimestre}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#3A3A3C] text-[#F2F2F7] font-medium border border-[#48484A]">
            {nombresUnidades[unidad] || unidad}
          </span>
        </div>

        {/* Contador y botón de cierre */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#F2F2F7]">
            {esInfinita
              ? `Pregunta ${indiceActual + 1}`
              : `${indiceActual + 1} de ${totalPreguntas}`}
          </span>
          <button
            onClick={alFinalizar}
            className="p-1 rounded text-[#8E8E93] hover:text-[#FF453A] hover:bg-[#3A3A3C] transition-colors"
            title="Terminar evaluación"
            aria-label="Terminar evaluación"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Barra de progreso */}
      {!esInfinita && (
        <div className="w-full h-1.5 rounded-full bg-[#2C2C2E] overflow-hidden border border-[#3A3A3C]">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      )}
    </div>
  );
};
