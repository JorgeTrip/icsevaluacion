/**
 * @file PreguntaUnirConceptos.tsx
 * @description Componente táctil interactivo para unir conceptos mediante flechas SVG y selección par a par.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { OpcionPregunta } from '../../dominio/modelos/tiposPregunta.ts';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { CapaFlechasSvg, LineaConexion } from './CapaFlechasSvg.tsx';

interface PropsPreguntaUnirConceptos {
  opcionesOrigen: OpcionPregunta[];
  opcionesDestino: OpcionPregunta[];
  opcionesSeleccionadas: string[];
  respuestasCorrectas: string[];
  estaEvaluada: boolean;
  alCambiarPares: (nuevosPares: string[]) => void;
  alConfirmar: () => void;
}

const paletaPares = [
  { borde: 'border-sky-500/60', fondo: 'bg-sky-500/15', texto: 'text-sky-300', linea: '#38bdf8' },
  { borde: 'border-violet-500/60', fondo: 'bg-violet-500/15', texto: 'text-violet-300', linea: '#a855f7' },
  { borde: 'border-amber-500/60', fondo: 'bg-amber-500/15', texto: 'text-amber-300', linea: '#f59e0b' },
  { borde: 'border-rose-500/60', fondo: 'bg-rose-500/15', texto: 'text-rose-300', linea: '#f43f5e' },
  { borde: 'border-teal-500/60', fondo: 'bg-teal-500/15', texto: 'text-teal-300', linea: '#14b8a6' },
];

export const PreguntaUnirConceptos: React.FC<PropsPreguntaUnirConceptos> = ({
  opcionesOrigen,
  opcionesDestino,
  opcionesSeleccionadas,
  respuestasCorrectas,
  estaEvaluada,
  alCambiarPares,
  alConfirmar,
}) => {
  const [origenSeleccionado, setOrigenSeleccionado] = useState<string | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const elementosRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [coordenadasLineas, setCoordenadasLineas] = useState<LineaConexion[]>([]);

  const mapaColores = new Map<string, (typeof paletaPares)[0]>();
  opcionesSeleccionadas.forEach((par, idx) => {
    const estilo = paletaPares[idx % paletaPares.length];
    const [orig, dest] = par.split(':');
    mapaColores.set(orig, estilo);
    mapaColores.set(dest, estilo);
  });

  const recalcularFlechas = useCallback(() => {
    if (!contenedorRef.current) return;
    const rectContenedor = contenedorRef.current.getBoundingClientRect();
    const nuevasLineas: LineaConexion[] = [];

    opcionesSeleccionadas.forEach((par, idx) => {
      const [origId, destId] = par.split(':');
      const elOrig = elementosRef.current.get(`orig-${origId}`);
      const elDest = elementosRef.current.get(`dest-${destId}`);

      if (elOrig && elDest) {
        const r1 = elOrig.getBoundingClientRect();
        const r2 = elDest.getBoundingClientRect();
        const esCorrecta = estaEvaluada ? respuestasCorrectas.includes(par) : undefined;
        const color = estaEvaluada
          ? esCorrecta
            ? '#30D158'
            : '#FF453A'
          : paletaPares[idx % paletaPares.length].linea;

        nuevasLineas.push({
          id: par,
          x1: r1.right - rectContenedor.left,
          y1: r1.top + r1.height / 2 - rectContenedor.top,
          x2: r2.left - rectContenedor.left,
          y2: r2.top + r2.height / 2 - rectContenedor.top,
          color,
          esCorrecta,
        });
      }
    });

    setCoordenadasLineas(nuevasLineas);
  }, [opcionesSeleccionadas, estaEvaluada, respuestasCorrectas]);

  useEffect(() => {
    recalcularFlechas();
    window.addEventListener('resize', recalcularFlechas);
    return () => window.removeEventListener('resize', recalcularFlechas);
  }, [recalcularFlechas]);

  const tocarOrigen = (id: string) => {
    if (estaEvaluada) return;
    const parExistente = opcionesSeleccionadas.find((p) => p.startsWith(`${id}:`));
    if (parExistente) {
      alCambiarPares(opcionesSeleccionadas.filter((p) => p !== parExistente));
      setOrigenSeleccionado(id);
    } else {
      setOrigenSeleccionado((prev) => (prev === id ? null : id));
    }
  };

  const tocarDestino = (id: string) => {
    if (estaEvaluada) return;
    if (origenSeleccionado) {
      const nuevoPar = `${origenSeleccionado}:${id}`;
      const sinOrigen = opcionesSeleccionadas.filter((p) => !p.startsWith(`${origenSeleccionado}:`));
      const sinDestino = sinOrigen.filter((p) => !p.endsWith(`:${id}`));
      alCambiarPares([...sinDestino, nuevoPar]);
      setOrigenSeleccionado(null);
    } else {
      const parExistente = opcionesSeleccionadas.find((p) => p.endsWith(`:${id}`));
      if (parExistente) {
        alCambiarPares(opcionesSeleccionadas.filter((p) => p !== parExistente));
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-[#AEAEB2]">
        <span>Toca un concepto de la izquierda y luego su correspondencia a la derecha</span>
        {opcionesSeleccionadas.length > 0 && !estaEvaluada && (
          <button
            onClick={() => alCambiarPares([])}
            className="flex items-center gap-1 text-[#8E8E93] hover:text-[#FF453A]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Deshacer todos</span>
          </button>
        )}
      </div>

      <div ref={contenedorRef} className="relative grid grid-cols-2 gap-6 sm:gap-12 py-2">
        <CapaFlechasSvg lineas={coordenadasLineas} estaEvaluada={estaEvaluada} />

        <div className="space-y-3 z-20">
          {opcionesOrigen.map((opt) => {
            const activo = origenSeleccionado === opt.id;
            const estilo = mapaColores.get(opt.id);
            return (
              <button
                key={opt.id}
                ref={(el) => { if (el) elementosRef.current.set(`orig-${opt.id}`, el); }}
                onClick={() => tocarOrigen(opt.id)}
                disabled={estaEvaluada}
                className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-medium text-left transition-all min-h-[52px] flex items-center justify-between ${
                  activo
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/50'
                    : estilo
                    ? `${estilo.fondo} ${estilo.borde} ${estilo.texto}`
                    : 'bg-[#2C2C2E] border-[#3A3A3C] text-[#F2F2F7] hover:border-[#48484A]'
                }`}
              >
                <span>{opt.texto}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-40 shrink-0 ml-1" />
              </button>
            );
          })}
        </div>

        <div className="space-y-3 z-20">
          {opcionesDestino.map((opt) => {
            const estilo = mapaColores.get(opt.id);
            return (
              <button
                key={opt.id}
                ref={(el) => { if (el) elementosRef.current.set(`dest-${opt.id}`, el); }}
                onClick={() => tocarDestino(opt.id)}
                disabled={estaEvaluada}
                className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-medium text-left transition-all min-h-[52px] flex items-center justify-between ${
                  estilo
                    ? `${estilo.fondo} ${estilo.borde} ${estilo.texto}`
                    : 'bg-[#2C2C2E] border-[#3A3A3C] text-[#F2F2F7] hover:border-[#48484A]'
                }`}
              >
                <span>{opt.texto}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!estaEvaluada && (
        <button
          onClick={alConfirmar}
          disabled={opcionesSeleccionadas.length === 0}
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white font-medium text-sm sm:text-base transition-all duration-150 shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>Finalizar y Comprobar Emparejamientos</span>
          <span className="text-xs bg-emerald-700/60 px-2 py-0.5 rounded-full">
            {opcionesSeleccionadas.length}/{opcionesOrigen.length} pares
          </span>
        </button>
      )}
    </div>
  );
};
