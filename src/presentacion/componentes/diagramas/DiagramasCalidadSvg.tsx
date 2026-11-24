/**
 * @file DiagramasCalidadSvg.tsx
 * @description Esquemas vectoriales didácticos de calidad (Ishikawa, Costos, CMMI y Visiones de Garvin).
 */

import React from 'react';

export const DiagramaIshikawaSvg: React.FC = () => (
  <svg viewBox="0 0 420 175" className="w-full h-auto" role="img" aria-label="Diagrama de Ishikawa causa-efecto">
    <line x1="25" y1="90" x2="310" y2="90" stroke="#34d399" strokeWidth="2.5" />
    <polygon points="310,84 322,90 310,96" fill="#34d399" />
    <rect x="324" y="68" width="84" height="44" rx="8" fill="#1C1C1E" stroke="#f59e0b" strokeWidth="1.5" />
    <text x="366" y="87" textAnchor="middle" fill="#fcd34d" fontSize="11" fontWeight="700">PROBLEMA</text>
    <text x="366" y="102" textAnchor="middle" fill="#AEAEB2" fontSize="9.5">(Efecto)</text>
    {[
      { x1: 65, y1: 28, x2: 105, y2: 90, label: 'Métodos' },
      { x1: 155, y1: 28, x2: 195, y2: 90, label: 'Personas' },
      { x1: 245, y1: 28, x2: 285, y2: 90, label: 'Herramientas' },
      { x1: 65, y1: 152, x2: 105, y2: 90, label: 'Procesos' },
      { x1: 155, y1: 152, x2: 195, y2: 90, label: 'Medición' },
      { x1: 245, y1: 152, x2: 285, y2: 90, label: 'Entorno' },
    ].map((e, i) => (
      <g key={i}>
        <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#38bdf8" strokeWidth="1.6" />
        <text x={e.x1} y={e.y1 < 90 ? e.y1 - 6 : e.y1 + 13} textAnchor="middle" fill="#e5e5ea" fontSize="10">{e.label}</text>
      </g>
    ))}
    <text x="165" y="170" textAnchor="middle" fill="#8E8E93" fontSize="9">Espinas: posibles causas → Cabeza: efecto observado</text>
  </svg>
);

export const DiagramaCostoCalidadSvg: React.FC = () => (
  <svg viewBox="0 0 420 180" className="w-full h-auto" role="img" aria-label="Curvas de Costo de Calidad y No Calidad">
    <line x1="45" y1="145" x2="395" y2="145" stroke="#636366" strokeWidth="1.5" />
    <line x1="45" y1="20" x2="45" y2="145" stroke="#636366" strokeWidth="1.5" />
    <path d="M 55 136 Q 210 128 370 34" fill="none" stroke="#34d399" strokeWidth="2.2" />
    <path d="M 55 30 Q 170 122 375 138" fill="none" stroke="#f87171" strokeWidth="2.2" />
    <path d="M 55 24 Q 205 112 370 26" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="5 4" />
    <text x="20" y="85" fill="#AEAEB2" fontSize="10" transform="rotate(-90 20 85)" textAnchor="middle">Costo ($)</text>
    <text x="220" y="164" textAnchor="middle" fill="#AEAEB2" fontSize="10">Nivel de Calidad (Prevención + Evaluación)</text>
    <text x="330" y="24" fill="#34d399" fontSize="9.5" fontWeight="600">Costo Calidad</text>
    <text x="65" y="25" fill="#f87171" fontSize="9.5" fontWeight="600">No Calidad (Fallas)</text>
    <text x="215" y="64" textAnchor="middle" fill="#fbbf24" fontSize="9.5">Costo Total</text>
  </svg>
);

export const DiagramaCmmiSvg: React.FC = () => (
  <svg viewBox="0 0 420 170" className="w-full h-auto" role="img" aria-label="Niveles de Madurez CMMI del 1 al 5">
    {[
      { n: '1', t: 'Inicial', d: 'Ad-hoc', x: 18, y: 118, c: '#f87171' },
      { n: '2', t: 'Gestionado', d: 'Proyectos', x: 96, y: 96, c: '#fb923c' },
      { n: '3', t: 'Definido', d: 'Estándar', x: 174, y: 74, c: '#fbbf24' },
      { n: '4', t: 'Cuantitativo', d: 'Métricas', x: 252, y: 52, c: '#38bdf8' },
      { n: '5', t: 'Optimizado', d: 'Mejora cont.', x: 330, y: 30, c: '#34d399' },
    ].map((s) => (
      <g key={s.n}>
        <rect x={s.x} y={s.y} width="72" height={152 - s.y} rx="6" fill="#1C1C1E" stroke={s.c} strokeWidth="1.5" />
        <text x={s.x + 36} y={s.y + 16} textAnchor="middle" fill={s.c} fontSize="11" fontWeight="700">Nv. {s.n}</text>
        <text x={s.x + 36} y={s.y + 30} textAnchor="middle" fill="#F2F2F7" fontSize="9">{s.t}</text>
        <text x={s.x + 36} y={s.y + 42} textAnchor="middle" fill="#8E8E93" fontSize="8">{s.d}</text>
      </g>
    ))}
    <text x="210" y="166" textAnchor="middle" fill="#8E8E93" fontSize="9">Evalúa madurez de procesos ("el qué"), no impone herramientas ("el cómo")</text>
  </svg>
);

export const DiagramaGarvinSvg: React.FC = () => (
  <svg viewBox="0 0 420 155" className="w-full h-auto" role="img" aria-label="Las 5 Visiones de Calidad de David Garvin">
    {[
      { t: 'Trascendental', d: 'Reconocible, no medible', x: 15, y: 14, c: '#c084fc' },
      { t: 'Del Usuario', d: 'Adecuación al propósito', x: 148, y: 14, c: '#38bdf8' },
      { t: 'Del Producto', d: 'Atributos internos (ISO)', x: 281, y: 14, c: '#34d399' },
      { t: 'Manufactura', d: 'Conformidad c/ especif.', x: 80, y: 84, c: '#fbbf24' },
      { t: 'Basada en Valor', d: 'Relación costo / beneficio', x: 222, y: 84, c: '#fb7185' },
    ].map((v) => (
      <g key={v.t}>
        <rect x={v.x} y={v.y} width="124" height="54" rx="9" fill="#1C1C1E" stroke={v.c} strokeWidth="1.4" />
        <text x={v.x + 62} y={v.y + 22} textAnchor="middle" fill={v.c} fontSize="10.5" fontWeight="700">{v.t}</text>
        <text x={v.x + 62} y={v.y + 39} textAnchor="middle" fill="#AEAEB2" fontSize="8.8">{v.d}</text>
      </g>
    ))}
  </svg>
);
