import { describe, it, expect } from 'vitest';
import bancoPreguntas from '../../src/infraestructura/datos/bancoPreguntas.json';
import { EsquemaBancoPreguntas } from '../../src/dominio/esquemas/esquemaPregunta.ts';

describe('Infraestructura: Validación del Dataset de Preguntas', () => {
  it('debe contener más de 200 preguntas extraídas de los exámenes reales', () => {
    expect(bancoPreguntas.length).toBeGreaterThan(200);
  });

  it('debe validar la totalidad del banco contra el esquema Zod sin errores', () => {
    const validacion = EsquemaBancoPreguntas.safeParse(bancoPreguntas);
    if (!validacion.success) {
      console.error('Errores de validación:', validacion.error.format());
    }
    expect(validacion.success).toBe(true);
  });

  it('debe contener preguntas de ambos cuatrimestres (1C y 2C)', () => {
    const cuatrimestres = new Set(bancoPreguntas.map((p) => p.cuatrimestre));
    expect(cuatrimestres.has('1C')).toBe(true);
    expect(cuatrimestres.has('2C')).toBe(true);
  });

  it('debe contener preguntas de todas las unidades (U1 a U6)', () => {
    const unidades = new Set(bancoPreguntas.map((p) => p.unidad));
    expect(unidades.has('U1')).toBe(true);
    expect(unidades.has('U2')).toBe(true);
    expect(unidades.has('U3')).toBe(true);
    expect(unidades.has('U4')).toBe(true);
    expect(unidades.has('U5')).toBe(true);
    expect(unidades.has('U6')).toBe(true);
  });

  it('debe asegurar que toda opción en respuestasCorrectas existe en opciones de la pregunta', () => {
    for (const preg of bancoPreguntas) {
      const idsOpciones = new Set(preg.opciones.map((o) => o.id));
      for (const idCorrecta of preg.respuestasCorrectas) {
        expect(idsOpciones.has(idCorrecta)).toBe(true);
      }
    }
  });
});
