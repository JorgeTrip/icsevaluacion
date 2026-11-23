/**
 * @file formateadorEnunciado.test.ts
 * @description Pruebas unitarias TDD para la estructuración visual de enunciados con subítems y bloques de código.
 */

import { describe, it, expect } from 'vitest';
import { formatearEnunciado } from '../../src/dominio/servicios/formateadorEnunciado.ts';

describe('Dominio: Formateador de Enunciados con Subítems', () => {
  it('mantiene como texto simple los párrafos sin subítems aunque contengan números o versiones', () => {
    const res = formatearEnunciado(
      'Si una aplicación soporta 1.000 transacciones bajo ISO 25000 con SPI 1,25, ¿es estable?',
    );
    expect(res).toEqual([
      {
        tipo: 'texto',
        contenido: 'Si una aplicación soporta 1.000 transacciones bajo ISO 25000 con SPI 1,25, ¿es estable?',
      },
    ]);
  });

  it('separa subítems numerados en línea con guion o punto (ej. 1- ... 2- ... 3- ...)', () => {
    const res = formatearEnunciado(
      'Dadas las siguientes definiciones, seleccione la opción correcta: 1- Define los procesos de Build y de releases 2- Define cuándo y cómo se realizan las auditorías. 3- Define las políticas de Branching y Merging.',
    );

    expect(res).toHaveLength(2);
    expect(res[0]).toEqual({
      tipo: 'texto',
      contenido: 'Dadas las siguientes definiciones, seleccione la opción correcta:',
    });
    expect(res[1]).toEqual({
      tipo: 'lista',
      items: [
        { etiqueta: '1', texto: 'Define los procesos de Build y de releases' },
        { etiqueta: '2', texto: 'Define cuándo y cómo se realizan las auditorías.' },
        { etiqueta: '3', texto: 'Define las políticas de Branching y Merging.' },
      ],
    });
  });

  it('extrae instrucción final posterior a una lista numerada en línea (ej. Seleccione la opción correcta:)', () => {
    const res = formatearEnunciado(
      'Afirmaciones sobre calidad: 1. Primera afirmación 2. Segunda afirmación 3. Tercera afirmación. Seleccione la opción correcta:',
    );

    expect(res).toEqual([
      { tipo: 'texto', contenido: 'Afirmaciones sobre calidad:' },
      {
        tipo: 'lista',
        items: [
          { etiqueta: '1', texto: 'Primera afirmación' },
          { etiqueta: '2', texto: 'Segunda afirmación' },
          { etiqueta: '3', texto: 'Tercera afirmación.' },
        ],
      },
      { tipo: 'texto', contenido: 'Seleccione la opción correcta:' },
    ]);
  });

  it('separa subítems por saltos de línea y viñetas (• o ●)', () => {
    const res = formatearEnunciado(
      'Marque la declaración incorrecta:\n• Ítem uno del listado\n• Ítem dos del listado',
    );

    expect(res).toEqual([
      { tipo: 'texto', contenido: 'Marque la declaración incorrecta:' },
      {
        tipo: 'lista',
        items: [
          { etiqueta: '•', texto: 'Ítem uno del listado' },
          { etiqueta: '•', texto: 'Ítem dos del listado' },
        ],
      },
    ]);
  });

  it('separa bloques de código cercados con backticks y fragmentos inline', () => {
    const conBackticks = formatearEnunciado(
      "Dado el pseudocódigo:\n```text\nswitch (x) {\n  case 1: break;\n}\n```\n¿Cuántos casos requiere?",
    );
    expect(conBackticks).toEqual([
      { tipo: 'texto', contenido: 'Dado el pseudocódigo:' },
      { tipo: 'codigo', contenido: 'switch (x) {\n  case 1: break;\n}' },
      { tipo: 'texto', contenido: '¿Cuántos casos requiere?' },
    ]);

    const conInline = formatearEnunciado(
      'Indique la complejidad ciclomática para el siguiente código if (a == true) { return 1; }',
    );
    expect(conInline).toEqual([
      { tipo: 'texto', contenido: 'Indique la complejidad ciclomática para el siguiente código:' },
      { tipo: 'codigo', contenido: 'if (a == true) { return 1; }' },
    ]);
  });

  it('separa viñetas previas, pregunta intermedia y subítems numerados en casos combinados', () => {
    const combinado = formatearEnunciado(
      'Situación de planning: ● Pedro: 8 pts ● Carolina: 2 pts ¿Cuál sería el próximo paso? 1. Promediar 2. Elegir máximo 3. Debatir criterios',
    );
    expect(combinado[0]).toEqual({ tipo: 'texto', contenido: 'Situación de planning:' });
    expect(combinado[1]).toEqual({
      tipo: 'lista',
      items: [
        { etiqueta: '•', texto: 'Pedro: 8 pts' },
        { etiqueta: '•', texto: 'Carolina: 2 pts' },
      ],
    });
    expect(combinado[2]).toEqual({ tipo: 'texto', contenido: '¿Cuál sería el próximo paso?' });
    expect(combinado[3]).toEqual({
      tipo: 'lista',
      items: [
        { etiqueta: '1', texto: 'Promediar' },
        { etiqueta: '2', texto: 'Elegir máximo' },
        { etiqueta: '3', texto: 'Debatir criterios' },
      ],
    });
  });
});
