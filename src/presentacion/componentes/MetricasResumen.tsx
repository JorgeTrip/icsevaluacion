/**
 * @file MetricasResumen.tsx
 * @description Tarjetas de desempeño y desglose visual de rendimiento por unidad temática.
 */

import React from 'react';
import { RendimientoPorUnidad } from '../../dominio/modelos/tiposProgreso.ts';
import { UnidadTematica } from '../../dominio/modelos/tiposPregunta.ts';
import { Award, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface PropsMetricasResumen {
  puntajeTotal: number;
  totalPreguntas: number;
  correctas: number;
  parciales: number;
  incorrectas: number;
  rendimientoPorUnidad?: RendimientoPorUnidad;
}

const etiquetasUnidades: Record<UnidadTematica, string> = {
  U1: 'U1 · Introducción',
  U2: 'U2 · Calidad',
  U3: 'U3 · Approaches',
  U4: 'U4 · Estimaciones',
  U5: 'U5 · SCM',
  U6: 'U6 · Testing',
};

export const MetricasResumen: React.FC<PropsMetricasResumen> = ({
  puntajeTotal,
  totalPreguntas,
  correctas,
  parciales,
  incorrectas,
  rendimientoPorUnidad,
}) => {
  const porcentaje = totalPreguntas > 0 ? Math.round((puntajeTotal / totalPreguntas) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Tarjeta de Calificación Principal */}
      <div className="rounded-2xl p-6 bg-[#2C2C2E] border border-[#3A3A3C] shadow-lg text-center space-y-3">
        <div className="inline-flex p-3 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
          <Award className="w-8 h-8" />
        </div>
        <div>
          <div className="text-4xl font-bold tracking-tight text-[#F2F2F7]">
            {porcentaje}%
          </div>
          <p className="text-xs sm:text-sm text-[#AEAEB2] mt-1">
            {puntajeTotal.toFixed(2)} de {totalPreguntas} puntos posibles
          </p>
        </div>

        {/* Desglose de aciertos / parciales / fallos */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#3A3A3C]">
          <div className="p-2 rounded-xl bg-[#1C1C1E] border border-[#3A3A3C]">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{correctas}</span>
            </div>
            <span className="text-[10px] text-[#8E8E93]">Correctas</span>
          </div>

          <div className="p-2 rounded-xl bg-[#1C1C1E] border border-[#3A3A3C]">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{parciales}</span>
            </div>
            <span className="text-[10px] text-[#8E8E93]">Parciales</span>
          </div>

          <div className="p-2 rounded-xl bg-[#1C1C1E] border border-[#3A3A3C]">
            <div className="flex items-center justify-center gap-1 text-red-400 text-xs font-semibold">
              <XCircle className="w-3.5 h-3.5" />
              <span>{incorrectas}</span>
            </div>
            <span className="text-[10px] text-[#8E8E93]">Falladas</span>
          </div>
        </div>
      </div>

      {/* Desglose por Unidad si está disponible */}
      {rendimientoPorUnidad && (
        <div className="rounded-2xl p-5 bg-[#2C2C2E] border border-[#3A3A3C] shadow-lg space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#AEAEB2]">
            Efectividad por Unidad Temática
          </h3>
          <div className="space-y-2.5">
            {(Object.keys(etiquetasUnidades) as UnidadTematica[]).map((u) => {
              const info = rendimientoPorUnidad[u] || { respondidas: 0, correctas: 0 };
              const tasa = info.respondidas > 0 ? Math.round((info.correctas / info.respondidas) * 100) : 0;

              return (
                <div key={u} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#F2F2F7] font-medium">{etiquetasUnidades[u]}</span>
                    <span className="text-[#8E8E93]">
                      {info.correctas}/{info.respondidas} ({tasa}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#1C1C1E] overflow-hidden border border-[#3A3A3C]">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${tasa}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
