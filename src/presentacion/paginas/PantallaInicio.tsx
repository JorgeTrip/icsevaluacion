/**
 * @file PantallaInicio.tsx
 * @description Pantalla de configuración y arranque de sesiones de evaluación.
 */

import React, { useState } from 'react';
import {
  FiltroCuatrimestre,
  FiltroTipoPregunta,
  TamanoTanda,
  ModoEvaluacion,
  ConfiguracionSesion,
} from '../../dominio/modelos/tiposSesion.ts';
import { UnidadTematica } from '../../dominio/modelos/tiposPregunta.ts';
import { SelectorCuatrimestre } from '../componentes/SelectorCuatrimestre.tsx';
import { SelectorUnidades } from '../componentes/SelectorUnidades.tsx';
import { Play, RotateCcw, Sparkles, Lightbulb } from 'lucide-react';

interface PropsPantallaInicio {
  totalPreguntasBanco: number;
  totalFallosPendientes: number;
  totalPracticaPendiente: number;
  alIniciar: (config: ConfiguracionSesion) => void;
}

const catalogo = [
  { id: UnidadTematica.U1, etiqueta: 'U1 · Intro', cuatrimestre: '1C' },
  { id: UnidadTematica.U2, etiqueta: 'U2 · Calidad', cuatrimestre: '1C' },
  { id: UnidadTematica.U3, etiqueta: 'U3 · Approaches', cuatrimestre: '1C' },
  { id: UnidadTematica.U4, etiqueta: 'U4 · Estimaciones', cuatrimestre: '1C' },
  { id: UnidadTematica.U5, etiqueta: 'U5 · SCM', cuatrimestre: '2C' },
  { id: UnidadTematica.U6, etiqueta: 'U6 · Testing', cuatrimestre: '2C' },
];

export const PantallaInicio: React.FC<PropsPantallaInicio> = ({
  totalPreguntasBanco,
  totalFallosPendientes,
  totalPracticaPendiente,
  alIniciar,
}) => {
  const [cuatrimestre, setCuatrimestre] = useState<FiltroCuatrimestre>('AMBOS');
  const [unidadesFiltro, setUnidadesFiltro] = useState<UnidadTematica[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<FiltroTipoPregunta>('TODOS');
  const [tamanoTanda, setTamanoTanda] = useState<TamanoTanda>(10);
  const [modo, setModo] = useState<ModoEvaluacion>('INMEDIATO');

  const alternarUnidad = (u: UnidadTematica) => {
    setUnidadesFiltro((prev) =>
      prev.includes(u) ? prev.filter((item) => item !== u) : [...prev, u]
    );
  };

  const unidadesVisibles = catalogo.filter(
    (u) => cuatrimestre === 'AMBOS' || u.cuatrimestre === cuatrimestre
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alIniciar({ cuatrimestre, unidadesFiltro, tipoFiltro, tamanoTanda, modo });
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-2xl p-5 bg-gradient-to-br from-[#2C2C2E] to-[#1C1C1E] border border-[#3A3A3C] shadow-lg space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Simulador de Evaluación Oficial</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F2F2F7]">
          Ingeniería y Calidad de Software
        </h2>
        <p className="text-xs sm:text-sm text-[#AEAEB2] leading-relaxed">
          Practica con {totalPreguntasBanco} preguntas reales de parcial y bibliografía de cátedra con feedback inmediato.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <SelectorCuatrimestre cuatrimestre={cuatrimestre} alSeleccionar={setCuatrimestre} />
        <SelectorUnidades unidadesVisibles={unidadesVisibles} unidadesFiltro={unidadesFiltro} alAlternar={alternarUnidad} />

        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#AEAEB2] uppercase tracking-wider">
            3. Cantidad de Preguntas
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[10, 20, 30, 'INFINITA'].map((tam) => (
              <button
                key={tam}
                type="button"
                onClick={() => setTamanoTanda(tam as TamanoTanda)}
                className={`py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                  tamanoTanda === tam
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-[#2C2C2E] border-[#3A3A3C] text-[#AEAEB2]'
                }`}
              >
                {tam === 'INFINITA' ? 'Infinitas' : `${tam} pregs`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#AEAEB2] uppercase tracking-wider">
            4. Formato de Preguntas
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'TODOS', label: 'Todos' },
              { id: 'VF', label: 'Solo V/F' },
              { id: 'CHOICE', label: 'Solo Choice' },
              { id: 'UNIR', label: 'Solo Unir' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTipoFiltro(t.id as FiltroTipoPregunta)}
                className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                  tipoFiltro === t.id
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-[#2C2C2E] border-[#3A3A3C] text-[#AEAEB2]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {totalFallosPendientes > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-amber-300">
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>{totalFallosPendientes} fallo(s) para repasar</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setModo('REPASO_FALLOS');
                alIniciar({ cuatrimestre: 'AMBOS', unidadesFiltro: [], tipoFiltro: 'TODOS', tamanoTanda: 20, modo: 'REPASO_FALLOS' });
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-200 text-xs font-medium border border-amber-500/40"
            >
              Practicar Fallos
            </button>
          </div>
        )}

        {totalPracticaPendiente > 0 && (
          <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-sky-300">
              <Lightbulb className="w-4 h-4 shrink-0" />
              <span>{totalPracticaPendiente} pregunta(s) resuelta(s) con pista</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setModo('REPASO_PRACTICA');
                alIniciar({ cuatrimestre: 'AMBOS', unidadesFiltro: [], tipoFiltro: 'TODOS', tamanoTanda: 20, modo: 'REPASO_PRACTICA' });
              }}
              className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-200 text-xs font-medium border border-sky-500/40"
            >
              Practicar sin Pista
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 min-h-[54px]"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Comenzar Evaluación</span>
        </button>
      </form>
    </div>
  );
};
