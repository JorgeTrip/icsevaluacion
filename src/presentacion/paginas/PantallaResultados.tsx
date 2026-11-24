/**
 * @file PantallaResultados.tsx
 * @description Pantalla de cierre de tanda con desglose de desempeño e informe conceptual.
 */

import React, { useMemo } from 'react';
import { Pregunta } from '../../dominio/modelos/tiposPregunta.ts';
import { ResultadoEvaluacionPregunta } from '../../dominio/modelos/tiposSesion.ts';
import { MetricasResumen } from '../componentes/MetricasResumen.tsx';
import { RotateCcw, ArrowLeft, BarChart2, Lightbulb } from 'lucide-react';

interface PropsPantallaResultados {
  tanda: Pregunta[];
  respuestas: ResultadoEvaluacionPregunta[];
  alReiniciar: () => void;
  alPracticarFallos: (idsFallos: string[]) => void;
  alPracticarConPista: (idsPractica: string[]) => void;
  alIrAHistorial: () => void;
}

export const PantallaResultados: React.FC<PropsPantallaResultados> = ({
  tanda,
  respuestas,
  alReiniciar,
  alPracticarFallos,
  alPracticarConPista,
  alIrAHistorial,
}) => {
  const { correctas, parciales, incorrectas, puntajeTotal, idsFallos, idsPractica } = useMemo(() => {
    let corr = 0;
    let parc = 0;
    let incorr = 0;
    let total = 0;
    const fallos: string[] = [];
    const practica: string[] = [];

    for (const r of respuestas) {
      total += r.puntajeObtenido;
      if (r.estado === 'CORRECTA' && r.usoPista) {
        practica.push(r.idPregunta);
      } else if (r.estado === 'CORRECTA') {
        corr++;
      } else if (r.estado === 'PARCIAL') {
        parc++;
        fallos.push(r.idPregunta);
      } else {
        incorr++;
        fallos.push(r.idPregunta);
      }
    }

    return {
      correctas: corr,
      parciales: parc,
      incorrectas: incorr,
      puntajeTotal: total,
      idsFallos: fallos,
      idsPractica: practica,
    };
  }, [respuestas]);

  const totalRespondidas = respuestas.length;

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">
      {/* Encabezado de Resultados */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-[#F2F2F7]">
          Sesión de Evaluación Finalizada
        </h2>
        <p className="text-xs sm:text-sm text-[#AEAEB2]">
          Aquí tienes el resumen detallado de tu desempeño
        </p>
      </div>

      {/* Tarjeta de métricas con desglose */}
      <MetricasResumen
        puntajeTotal={puntajeTotal}
        totalPreguntas={totalRespondidas}
        correctas={correctas}
        parciales={parciales}
        incorrectas={incorrectas}
      />

      {/* Botones de acción principales */}
      <div className="space-y-3 pt-2">
        {idsFallos.length > 0 && (
          <button
            onClick={() => alPracticarFallos(idsFallos)}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm sm:text-base transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repasar las {idsFallos.length} preguntas falladas</span>
          </button>
        )}

        {idsPractica.length > 0 && (
          <button
            onClick={() => alPracticarConPista(idsPractica)}
            className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm sm:text-base transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Practicar sin pista ({idsPractica.length})</span>
          </button>
        )}

        <button
          onClick={alReiniciar}
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm sm:text-base transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Iniciar Nueva Evaluación</span>
        </button>

        <button
          onClick={alIrAHistorial}
          className="w-full py-3 px-4 rounded-xl bg-[#2C2C2E] hover:bg-[#3A3A3C] text-[#F2F2F7] border border-[#3A3A3C] font-medium text-sm transition-all flex items-center justify-center gap-2"
        >
          <BarChart2 className="w-4 h-4 text-emerald-400" />
          <span>Ver Estadísticas Globales e Historial</span>
        </button>
      </div>
    </div>
  );
};
