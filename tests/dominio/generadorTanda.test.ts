import { describe, it, expect } from 'vitest';
import { generarTandaPreguntas } from '../../src/dominio/servicios/generadorTanda.ts';
import {
  Cuatrimestre,
  Pregunta,
  TipoPregunta,
  UnidadTematica,
} from '../../src/dominio/modelos/tiposPregunta.ts';
import { ConfiguracionSesion } from '../../src/dominio/modelos/tiposSesion.ts';

describe('Servicio de Dominio: generadorTanda', () => {
  const bancoMock: Pregunta[] = [
    {
      id: 'p1',
      cuatrimestre: Cuatrimestre.PRIMERO,
      unidad: UnidadTematica.U1,
      tipo: TipoPregunta.VERDADERO_FALSO,
      enunciado: 'Pregunta 1',
      opciones: [],
      respuestasCorrectas: ['v'],
      justificacion: 'J1',
    },
    {
      id: 'p2',
      cuatrimestre: Cuatrimestre.PRIMERO,
      unidad: UnidadTematica.U2,
      tipo: TipoPregunta.OPCION_UNICA,
      enunciado: 'Pregunta 2',
      opciones: [],
      respuestasCorrectas: ['a'],
      justificacion: 'J2',
    },
    {
      id: 'p3',
      cuatrimestre: Cuatrimestre.PRIMERO,
      unidad: UnidadTematica.U3,
      tipo: TipoPregunta.SELECCION_MULTIPLE,
      enunciado: 'Pregunta 3',
      opciones: [],
      respuestasCorrectas: ['a', 'b'],
      justificacion: 'J3',
    },
    {
      id: 'p4',
      cuatrimestre: Cuatrimestre.SEGUNDO,
      unidad: UnidadTematica.U5,
      tipo: TipoPregunta.VERDADERO_FALSO,
      enunciado: 'Pregunta 4',
      opciones: [],
      respuestasCorrectas: ['f'],
      justificacion: 'J4',
    },
    {
      id: 'p5',
      cuatrimestre: Cuatrimestre.SEGUNDO,
      unidad: UnidadTematica.U6,
      tipo: TipoPregunta.OPCION_UNICA,
      enunciado: 'Pregunta 5',
      opciones: [],
      respuestasCorrectas: ['c'],
      justificacion: 'J5',
    },
  ];

  it('debe filtrar exclusivamente por 1er Cuatrimestre', () => {
    const config: ConfiguracionSesion = {
      cuatrimestre: Cuatrimestre.PRIMERO,
      unidadesFiltro: [],
      tipoFiltro: 'TODOS',
      tamanoTanda: 10,
      modo: 'INMEDIATO',
    };

    const tanda = generarTandaPreguntas(bancoMock, config);
    expect(tanda.length).toBe(3);
    expect(tanda.every((p) => p.cuatrimestre === Cuatrimestre.PRIMERO)).toBe(true);
  });

  it('debe filtrar exclusivamente por 2do Cuatrimestre', () => {
    const config: ConfiguracionSesion = {
      cuatrimestre: Cuatrimestre.SEGUNDO,
      unidadesFiltro: [],
      tipoFiltro: 'TODOS',
      tamanoTanda: 10,
      modo: 'INMEDIATO',
    };

    const tanda = generarTandaPreguntas(bancoMock, config);
    expect(tanda.length).toBe(2);
    expect(tanda.every((p) => p.cuatrimestre === Cuatrimestre.SEGUNDO)).toBe(true);
  });

  it('debe filtrar por unidades específicas seleccionadas', () => {
    const config: ConfiguracionSesion = {
      cuatrimestre: 'AMBOS',
      unidadesFiltro: [UnidadTematica.U1, UnidadTematica.U6],
      tipoFiltro: 'TODOS',
      tamanoTanda: 10,
      modo: 'INMEDIATO',
    };

    const tanda = generarTandaPreguntas(bancoMock, config);
    expect(tanda.length).toBe(2);
    const ids = tanda.map((p) => p.id);
    expect(ids).toContain('p1');
    expect(ids).toContain('p5');
  });

  it('debe filtrar por tipo de pregunta (solo Verdadero o Falso)', () => {
    const config: ConfiguracionSesion = {
      cuatrimestre: 'AMBOS',
      unidadesFiltro: [],
      tipoFiltro: 'VF',
      tamanoTanda: 10,
      modo: 'INMEDIATO',
    };

    const tanda = generarTandaPreguntas(bancoMock, config);
    expect(tanda.length).toBe(2);
    expect(tanda.every((p) => p.tipo === TipoPregunta.VERDADERO_FALSO)).toBe(true);
  });

  it('debe respetar el límite de tamaño de tanda solicitado', () => {
    const config: ConfiguracionSesion = {
      cuatrimestre: 'AMBOS',
      unidadesFiltro: [],
      tipoFiltro: 'TODOS',
      tamanoTanda: 10,
      modo: 'INMEDIATO',
    };

    const tanda = generarTandaPreguntas(bancoMock, { ...config, tamanoTanda: 2 });
    expect(tanda.length).toBe(2);
  });

  it('debe devolver todas las preguntas filtradas cuando se elige tanda INFINITA', () => {
    const config: ConfiguracionSesion = {
      cuatrimestre: 'AMBOS',
      unidadesFiltro: [],
      tipoFiltro: 'TODOS',
      tamanoTanda: 'INFINITA',
      modo: 'INMEDIATO',
    };

    const tanda = generarTandaPreguntas(bancoMock, config);
    expect(tanda.length).toBe(5);
  });

  it('debe filtrar solo las preguntas en la lista de fallos cuando está en modo REPASO_FALLOS', () => {
    const config: ConfiguracionSesion = {
      cuatrimestre: 'AMBOS',
      unidadesFiltro: [],
      tipoFiltro: 'TODOS',
      tamanoTanda: 10,
      modo: 'REPASO_FALLOS',
    };

    const tanda = generarTandaPreguntas(bancoMock, config, ['p2', 'p4']);
    expect(tanda.length).toBe(2);
    const ids = tanda.map((p) => p.id);
    expect(ids).toContain('p2');
    expect(ids).toContain('p4');
  });
});
