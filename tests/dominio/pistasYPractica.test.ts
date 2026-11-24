/**
 * @file pistasYPractica.test.ts
 * @description Pruebas unitarias TDD para el flujo de Hints (Pistas), anulación de puntaje y lista de Práctica.
 */

import { describe, it, expect } from 'vitest';
import { Cuatrimestre, Pregunta, TipoPregunta, UnidadTematica } from '../../src/dominio/modelos/tiposPregunta.ts';
import { evaluarPregunta } from '../../src/dominio/servicios/evaluadorRespuesta.ts';
import { crearProgresoInicial, actualizarProgresoConRespuesta } from '../../src/dominio/servicios/gestorProgreso.ts';
import { generarTandaPreguntas } from '../../src/dominio/servicios/generadorTanda.ts';
import { EsquemaRespaldoProgreso } from '../../src/dominio/esquemas/esquemaProgreso.ts';

const preguntaEjemplo: Pregunta = {
  id: 'u1-test-hint',
  cuatrimestre: Cuatrimestre.PRIMERO,
  unidad: UnidadTematica.U1,
  tipo: TipoPregunta.OPCION_UNICA,
  enunciado: 'Pregunta de prueba para hint',
  opciones: [
    { id: 'a', texto: 'Correcta' },
    { id: 'b', texto: 'Incorrecta' },
  ],
  respuestasCorrectas: ['a'],
  justificacion: 'Justificación de prueba.',
  pista: {
    texto: 'Pensá en el propósito fundamental del concepto.',
    diagramaId: 'ishikawa',
  },
};

describe('Dominio: Sistema de Pistas (Hints) y Lista de Práctica', () => {
  it('mantiene estado CORRECTA para feedback pero asigna 0 puntos si se usó pista', () => {
    const res = evaluarPregunta(preguntaEjemplo, ['a'], true);
    expect(res.estado).toBe('CORRECTA');
    expect(res.puntajeObtenido).toBe(0);
    expect(res.usoPista).toBe(true);
  });

  it('envía a historialPractica (y no a historialFallos) cuando se acierta con pista, sin sumar acierto', () => {
    const inicial = crearProgresoInicial();
    const resConPista = evaluarPregunta(preguntaEjemplo, ['a'], true);
    const actualizado = actualizarProgresoConRespuesta(inicial, preguntaEjemplo, resConPista);

    expect(actualizado.historialPractica.map((r) => r.idPregunta)).toEqual(['u1-test-hint']);
    expect(actualizado.historialFallos).toHaveLength(0);
    expect(actualizado.estadisticas.totalCorrectas).toBe(0);
    expect(actualizado.estadisticas.puntajeAcumulado).toBe(0);
    expect(actualizado.rendimientoPorUnidad[UnidadTematica.U1].correctas).toBe(0);
  });

  it('envía a historialFallos si falla incluso habiendo usado pista', () => {
    const inicial = crearProgresoInicial();
    const resFallidaConPista = evaluarPregunta(preguntaEjemplo, ['b'], true);
    const actualizado = actualizarProgresoConRespuesta(inicial, preguntaEjemplo, resFallidaConPista);

    expect(actualizado.historialFallos.map((r) => r.idPregunta)).toEqual(['u1-test-hint']);
    expect(actualizado.historialPractica).toHaveLength(0);
  });

  it('remueve la pregunta de historialPractica al responderla correctamente SIN pista', () => {
    const inicial = crearProgresoInicial();
    const conPista = actualizarProgresoConRespuesta(
      inicial,
      preguntaEjemplo,
      evaluarPregunta(preguntaEjemplo, ['a'], true),
    );
    expect(conPista.historialPractica).toHaveLength(1);

    const sinPista = actualizarProgresoConRespuesta(
      conPista,
      preguntaEjemplo,
      evaluarPregunta(preguntaEjemplo, ['a'], false),
    );
    expect(sinPista.historialPractica).toHaveLength(0);
    expect(sinPista.estadisticas.totalCorrectas).toBe(1);
    expect(sinPista.estadisticas.puntajeAcumulado).toBe(1);
  });

  it('filtra correctamente en modo REPASO_PRACTICA usando idsPracticaPendientes', () => {
    const otra: Pregunta = { ...preguntaEjemplo, id: 'u1-otra' };
    const tanda = generarTandaPreguntas(
      [preguntaEjemplo, otra],
      {
        cuatrimestre: 'AMBOS',
        unidadesFiltro: [],
        tipoFiltro: 'TODOS',
        tamanoTanda: 10,
        modo: 'REPASO_PRACTICA',
      },
      [],
      ['u1-test-hint'],
    );
    expect(tanda.map((p) => p.id)).toEqual(['u1-test-hint']);
  });

  it('mantiene compatibilidad hacia atrás con respaldos JSON sin historialPractica', () => {
    const respaldoLegacy = {
      version: 1,
      fechaExportacion: new Date().toISOString(),
      historialFallos: [],
      estadisticas: {
        totalRespondidas: 1,
        totalCorrectas: 1,
        totalParciales: 0,
        totalIncorrectas: 0,
        puntajeAcumulado: 1,
      },
      rendimientoPorUnidad: { U1: { respondidas: 1, correctas: 1 } },
    };
    const valid = EsquemaRespaldoProgreso.safeParse(respaldoLegacy);
    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.historialPractica).toEqual([]);
    }
  });
});
