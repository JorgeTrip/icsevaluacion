/**
 * @file DiagramaPistaSvg.tsx
 * @description Selector presentacional que renderiza el esquema SVG didáctico asociado a una pista.
 */

import React from 'react';
import { TipoDiagramaPista } from '../../dominio/modelos/tiposPregunta.ts';
import {
  DiagramaIshikawaSvg,
  DiagramaCostoCalidadSvg,
  DiagramaCmmiSvg,
  DiagramaGarvinSvg,
} from './diagramas/DiagramasCalidadSvg.tsx';
import {
  DiagramaCynefinSvg,
  DiagramaTrianguloHierroSvg,
  DiagramaConoIncertidumbreSvg,
  DiagramaEvmSvg,
} from './diagramas/DiagramasGestionSvg.tsx';
import {
  DiagramaScmAuditoriasSvg,
  DiagramaPiramideCohnSvg,
} from './diagramas/DiagramasIngenieriaSvg.tsx';

interface PropsDiagramaPistaSvg {
  diagramaId: TipoDiagramaPista;
}

const mapaDiagramas: Record<TipoDiagramaPista, React.FC> = {
  ishikawa: DiagramaIshikawaSvg,
  costo_calidad: DiagramaCostoCalidadSvg,
  cmmi: DiagramaCmmiSvg,
  garvin: DiagramaGarvinSvg,
  cynefin: DiagramaCynefinSvg,
  triangulo_hierro: DiagramaTrianguloHierroSvg,
  cono_incertidumbre: DiagramaConoIncertidumbreSvg,
  evm: DiagramaEvmSvg,
  scm_auditorias: DiagramaScmAuditoriasSvg,
  piramide_cohn: DiagramaPiramideCohnSvg,
};

export const DiagramaPistaSvg: React.FC<PropsDiagramaPistaSvg> = ({ diagramaId }) => {
  const Componente = mapaDiagramas[diagramaId];
  if (!Componente) return null;

  return (
    <div className="rounded-xl bg-[#1C1C1E] border border-[#3A3A3C] p-3">
      <Componente />
    </div>
  );
};
