/**
 * @file DiagramasIngenieriaSvg.tsx
 * @description Esquemas vectoriales de SCM (Auditorías y Funciones) y Testing (Pirámide de Cohn / Modelo en V).
 */

import React from 'react';

export const DiagramaScmAuditoriasSvg: React.FC = () => (
  <svg viewBox="0 0 420 165" className="w-full h-auto" role="img" aria-label="Funciones y Auditorías de SCM">
    {[
      { t: 'Aud. Funcional (FCA)', d: '¿Cumple requisitos?', x: 14, y: 14, c: '#34d399' },
      { t: 'Aud. Física (PCA)', d: '¿Artefactos completos?', x: 148, y: 14, c: '#38bdf8' },
      { t: 'Aud. de Proceso', d: '¿Se siguió SCM / CCB?', x: 282, y: 14, c: '#fbbf24' },
    ].map((a) => (
      <g key={a.t}>
        <rect x={a.x} y={a.y} width="124" height="56" rx="8" fill="#1C1C1E" stroke={a.c} strokeWidth="1.4" />
        <text x={a.x + 62} y={a.y + 23} textAnchor="middle" fill={a.c} fontSize="9.5" fontWeight="700">{a.t}</text>
        <text x={a.x + 62} y={a.y + 40} textAnchor="middle" fill="#AEAEB2" fontSize="8.8">{a.d}</text>
      </g>
    ))}
    <rect x="14" y="88" width="392" height="62" rx="9" fill="#1C1C1E" stroke="#3A3A3C" strokeWidth="1.2" />
    <text x="210" y="109" textAnchor="middle" fill="#F2F2F7" fontSize="9.5" fontWeight="600">Pilares SCM: Identificación · Control de Cambios (CCB) · Status &amp; Accounting</text>
    <text x="210" y="128" textAnchor="middle" fill="#8E8E93" fontSize="8.8">Status &amp; Accounting responde: quién, qué, cuándo y cuántas veces cambió un IC</text>
  </svg>
);

export const DiagramaPiramideCohnSvg: React.FC = () => (
  <svg viewBox="0 0 420 165" className="w-full h-auto" role="img" aria-label="Pirámide del Testing de Mike Cohn">
    <polygon points="210,16 155,62 265,62" fill="#f8717125" stroke="#f87171" strokeWidth="1.5" />
    <text x="210" y="50" textAnchor="middle" fill="#fca5a5" fontSize="9.5" fontWeight="700">UI / UAT</text>

    <polygon points="150,66 270,66 305,104 115,104" fill="#fbbf2420" stroke="#fbbf24" strokeWidth="1.5" />
    <text x="210" y="89" textAnchor="middle" fill="#fcd34d" fontSize="9.5" fontWeight="700">Integración / API / Servicios</text>

    <polygon points="110,108 310,108 345,146 75,146" fill="#34d39920" stroke="#34d399" strokeWidth="1.5" />
    <text x="210" y="131" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="700">Pruebas Unitarias (Base rápida y estable)</text>

    <text x="36" y="45" fill="#f87171" fontSize="8.5">↑ Más costo</text>
    <text x="36" y="134" fill="#34d399" fontSize="8.5">↓ Más volumen</text>
  </svg>
);
