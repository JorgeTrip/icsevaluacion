/**
 * @file CabeceraApp.tsx
 * @description Barra superior de navegación mobile-first con accesos directos e indicador de cátedra.
 */

import React from 'react';
import { BookOpen, BarChart2, Moon, Sun, Home } from 'lucide-react';
import { EstadoFlujoSesion } from '../../aplicacion/hooks/useSesionEvaluacion.ts';

interface PropsCabeceraApp {
  estadoSesion: EstadoFlujoSesion;
  esModoOscuro: boolean;
  alAlternarTema: () => void;
  alIrAInicio: () => void;
  alIrAHistorial: () => void;
}

export const CabeceraApp: React.FC<PropsCabeceraApp> = ({
  estadoSesion,
  esModoOscuro,
  alAlternarTema,
  alIrAInicio,
  alIrAHistorial,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#1C1C1E]/80 dark:bg-[#1C1C1E]/80 border-b border-[#3A3A3C]">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Marca y cátedra */}
        <button
          onClick={alIrAInicio}
          className="flex items-center gap-2 text-left active:opacity-80 transition-opacity"
          aria-label="Ir a pantalla de inicio"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-semibold tracking-tight text-[#F2F2F7]">
                ICS Evaluación
              </h1>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 py-0.5 rounded font-mono">
                v1.1.3
              </span>
            </div>
            <p className="text-[10px] text-[#8E8E93] leading-none">
              UTN FRBA · Dalceggio / Mansilla
            </p>
          </div>
        </button>

        {/* Acciones */}
        <div className="flex items-center gap-1">
          {estadoSesion !== 'CONFIGURACION' && (
            <button
              onClick={alIrAInicio}
              className="p-2 rounded-lg text-[#AEAEB2] hover:text-[#F2F2F7] hover:bg-[#2C2C2E] transition-colors"
              title="Volver a inicio"
              aria-label="Inicio"
            >
              <Home className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={alIrAHistorial}
            className={`p-2 rounded-lg transition-colors ${
              estadoSesion === 'HISTORIAL'
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                : 'text-[#AEAEB2] hover:text-[#F2F2F7] hover:bg-[#2C2C2E]'
            }`}
            title="Ver estadísticas e historial"
            aria-label="Historial"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          <button
            onClick={alAlternarTema}
            className="p-2 rounded-lg text-[#AEAEB2] hover:text-[#F2F2F7] hover:bg-[#2C2C2E] transition-colors"
            title={esModoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label="Alternar tema visual"
          >
            {esModoOscuro ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
