/**
 * @file CapaFlechasSvg.tsx
 * @description Capa SVG que dibuja curvas Bézier con marcadores para conectar conceptos emparejados.
 */

import React from 'react';

export interface LineaConexion {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  esCorrecta?: boolean;
}

interface PropsCapaFlechasSvg {
  lineas: LineaConexion[];
  estaEvaluada: boolean;
}

export const CapaFlechasSvg: React.FC<PropsCapaFlechasSvg> = ({ lineas, estaEvaluada }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" aria-hidden="true">
      <defs>
        <marker id="flecha-verde" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#30D158" />
        </marker>
        <marker id="flecha-roja" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#FF453A" />
        </marker>
        <marker id="flecha-neutra" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#AEAEB2" />
        </marker>
      </defs>
      {lineas.map((linea) => {
        const dx = Math.abs(linea.x2 - linea.x1) * 0.5;
        const d = `M ${linea.x1} ${linea.y1} C ${linea.x1 + dx} ${linea.y1}, ${linea.x2 - dx} ${linea.y2}, ${linea.x2} ${linea.y2}`;
        const marker =
          linea.esCorrecta === true
            ? 'url(#flecha-verde)'
            : linea.esCorrecta === false
            ? 'url(#flecha-roja)'
            : 'url(#flecha-neutra)';

        return (
          <path
            key={linea.id}
            d={d}
            fill="none"
            stroke={linea.color}
            strokeWidth={estaEvaluada ? '3' : '2.5'}
            markerEnd={marker}
            className="transition-all duration-200"
          />
        );
      })}
    </svg>
  );
};
