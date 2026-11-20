import { describe, it, expect } from 'vitest';
import bancoPreguntasRaw from '../../src/infraestructura/datos/bancoPreguntas.json';
import { EsquemaBancoPreguntas } from '../../src/dominio/esquemas/esquemaPregunta.ts';
import { Pregunta } from '../../dominio/modelos/tiposPregunta.ts';

const bancoPreguntas = bancoPreguntasRaw as Pregunta[];

describe('Infraestructura: Validación del Dataset de Preguntas', () => {
  it('debe contener más de 200 preguntas extraídas de los exámenes reales', () => {
    expect(bancoPreguntas.length).toBeGreaterThan(200);
  });

  it('debe validar la totalidad del banco contra el esquema Zod sin errores', () => {
    const validacion = EsquemaBancoPreguntas.safeParse(bancoPreguntas);
    expect(validacion.success).toBe(true);
  });

  it('debe contener preguntas de ambos cuatrimestres (1C y 2C)', () => {
    const cuatrimestres = new Set(bancoPreguntas.map((p) => p.cuatrimestre));
    expect(cuatrimestres.has('1C')).toBe(true);
    expect(cuatrimestres.has('2C')).toBe(true);
  });

  it('debe contener preguntas de todas las unidades (U1 a U6)', () => {
    const unidades = new Set(bancoPreguntas.map((p) => p.unidad));
    for (const u of ['U1', 'U2', 'U3', 'U4', 'U5', 'U6']) {
      expect(unidades.has(u as any)).toBe(true);
    }
  });

  it('debe asegurar la consistencia referencial de las respuestas correctas', () => {
    for (const preg of bancoPreguntas) {
      const idsOrigen = new Set(preg.opciones.map((o) => o.id));

      if (preg.tipo === 'UNIR_CONCEPTOS') {
        const idsDestino = new Set(preg.opcionesDestino?.map((o) => o.id) || []);
        for (const par of preg.respuestasCorrectas) {
          const [origen, destino] = par.split(':');
          expect(idsOrigen.has(origen)).toBe(true);
          expect(idsDestino.has(destino)).toBe(true);
        }
      } else {
        for (const idCorrecta of preg.respuestasCorrectas) {
          expect(idsOrigen.has(idCorrecta)).toBe(true);
        }
      }
    }
  });
});
