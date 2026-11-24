/**
 * @file DiagramasGestionSvg.tsx
 * @description Esquemas vectoriales de gestión y estimación (Cynefin, Triángulo de Hierro, Cono de Incertidumbre y EVM).
 */

import React from 'react';

export const DiagramaCynefinSvg: React.FC = () => (
  <svg viewBox="0 0 420 165" className="w-full h-auto" role="img" aria-label="Cuadrantes del marco Cynefin">
    {[
      { x: 14, y: 12, t: 'COMPLEJO', a: 'Probe → Sense → Respond', d: 'Prácticas emergentes (Scrum)', c: '#38bdf8' },
      { x: 214, y: 12, t: 'COMPLICADO', a: 'Sense → Analyze → Respond', d: 'Buenas prácticas (Expertos)', c: '#34d399' },
      { x: 14, y: 88, t: 'CAÓTICO', a: 'Act → Sense → Respond', d: 'Estabilizar primero (Kanban)', c: '#f87171' },
      { x: 214, y: 88, t: 'SIMPLE / CLARO', a: 'Sense → Categorize → Respond', d: 'Mejores prácticas', c: '#fbbf24' },
    ].map((q) => (
      <g key={q.t}>
        <rect x={q.x} y={q.y} width="192" height="66" rx="9" fill="#1C1C1E" stroke={q.c} strokeWidth="1.4" />
        <text x={q.x + 96} y={q.y + 20} textAnchor="middle" fill={q.c} fontSize="10.5" fontWeight="700">{q.t}</text>
        <text x={q.x + 96} y={q.y + 37} textAnchor="middle" fill="#F2F2F7" fontSize="9.2">{q.a}</text>
        <text x={q.x + 96} y={q.y + 53} textAnchor="middle" fill="#8E8E93" fontSize="8.5">{q.d}</text>
      </g>
    ))}
  </svg>
);

export const DiagramaTrianguloHierroSvg: React.FC = () => (
  <svg viewBox="0 0 420 165" className="w-full h-auto" role="img" aria-label="Dimensiones de proyecto: Costo, Tiempo y Alcance">
    <polygon points="210,22 105,138 315,138" fill="#34d39915" stroke="#34d399" strokeWidth="2" />
    <text x="210" y="16" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="700">ALCANCE (Funcionalidad)</text>
    <text x="82" y="152" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="700">TIEMPO</text>
    <text x="338" y="152" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="700">COSTO</text>
    <text x="210" y="88" textAnchor="middle" fill="#F2F2F7" fontSize="10" fontWeight="600">Driver / Restricción</text>
    <text x="210" y="104" textAnchor="middle" fill="#AEAEB2" fontSize="9.5">y Grado de Libertad</text>
  </svg>
);

export const DiagramaConoIncertidumbreSvg: React.FC = () => (
  <svg viewBox="0 0 420 165" className="w-full h-auto" role="img" aria-label="Cono de la Incertidumbre de Steve McConnell">
    <line x1="40" y1="82" x2="385" y2="82" stroke="#636366" strokeDasharray="4 3" strokeWidth="1.2" />
    <path d="M 45 20 Q 190 62 375 82 Q 190 102 45 144 Z" fill="#38bdf818" stroke="#38bdf8" strokeWidth="1.8" />
    <text x="45" y="14" fill="#fbbf24" fontSize="10" fontWeight="700">4x</text>
    <text x="45" y="158" fill="#fbbf24" fontSize="10" fontWeight="700">0.25x</text>
    <text x="378" y="75" textAnchor="end" fill="#34d399" fontSize="10" fontWeight="700">1.0x (Fin)</text>
    <text x="210" y="158" textAnchor="middle" fill="#8E8E93" fontSize="9.2">La variabilidad estadística se reduce al avanzar las fases</text>
  </svg>
);

export const DiagramaEvmSvg: React.FC = () => (
  <svg viewBox="0 0 420 155" className="w-full h-auto" role="img" aria-label="Fórmulas clave de Valor Ganado EVM">
    <rect x="16" y="14" width="186" height="62" rx="9" fill="#1C1C1E" stroke="#38bdf8" strokeWidth="1.4" />
    <text x="109" y="34" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="700">SPI = EV / PV</text>
    <text x="109" y="50" textAnchor="middle" fill="#34d399" fontSize="9">&gt; 1: Adelantado</text>
    <text x="109" y="64" textAnchor="middle" fill="#f87171" fontSize="9">&lt; 1: Atrasado</text>

    <rect x="218" y="14" width="186" height="62" rx="9" fill="#1C1C1E" stroke="#fbbf24" strokeWidth="1.4" />
    <text x="311" y="34" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="700">CPI = EV / AC</text>
    <text x="311" y="50" textAnchor="middle" fill="#34d399" fontSize="9">&gt; 1: Más barato</text>
    <text x="311" y="64" textAnchor="middle" fill="#f87171" fontSize="9">&lt; 1: Más caro (sobrecosto)</text>

    <rect x="16" y="90" width="388" height="50" rx="9" fill="#1C1C1E" stroke="#3A3A3C" strokeWidth="1.2" />
    <text x="210" y="111" textAnchor="middle" fill="#F2F2F7" fontSize="9.5">PV: Planificado · EV: Valor Ganado (hecho) · AC: Costo Real</text>
    <text x="210" y="128" textAnchor="middle" fill="#AEAEB2" fontSize="9">SV = EV - PV (Cronograma)  |  CV = EV - AC (Costo)</text>
  </svg>
);
