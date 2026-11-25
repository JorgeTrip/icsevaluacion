import { describe, it, expect } from 'vitest';
import bancoPreguntasRaw from '../../src/infraestructura/datos/bancoPreguntas.json';
import { EsquemaBancoPreguntas } from '../../src/dominio/esquemas/esquemaPregunta.ts';
import { Pregunta } from '../../dominio/modelos/tiposPregunta.ts';

const bancoPreguntas = bancoPreguntasRaw as Pregunta[];

describe('Infraestructura: Validación del Dataset de Preguntas', () => {
  it('debe contener al menos 200 preguntas extraídas de los exámenes reales', () => {
    expect(bancoPreguntas.length).toBeGreaterThanOrEqual(200);
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
        // Ninguna pregunta de opción única o V/F puede tener más de 1 respuesta correcta
        if (preg.tipo === 'OPCION_UNICA' || preg.tipo === 'VERDADERO_FALSO') {
          expect(preg.respuestasCorrectas).toHaveLength(1);
        }
        // Ninguna pregunta de opción única o múltiple puede tener saltos o ausencia de opción 'a'
        if (preg.tipo !== 'VERDADERO_FALSO') {
          const esperados = preg.opciones.map((_, idx) => String.fromCharCode(97 + idx));
          expect(preg.opciones.map((o) => o.id)).toEqual(esperados);
        }
      }
    }
  });

  it('no debe contener enunciados u opciones con respuestas filtradas o residuos de Moodle', () => {
    for (const preg of bancoPreguntas) {
      // Ningún enunciado debe iniciar con comillas, V/F, minúsculas o viñetas
      expect(preg.enunciado).not.toMatch(/^['"]?(?:Verdadero|Falso)['"]?/i);
      expect(preg.enunciado).not.toMatch(/^['"✅👇•\-\.]/);
      expect(preg.enunciado).not.toMatch(/^[a-záéíóúñ]/);
      expect(preg.enunciado).not.toMatch(/\b(?:Marque|Seleccione|Indique)\s+(?:la|el|las|los)\s*:/i);
      expect(preg.enunciado).not.toMatch(/\bMarque\s+la\s*:?$/i);
      expect(preg.enunciado).not.toContain('Sin contestar');
      expect(preg.enunciado).not.toContain('Respuesta incorrecta');
      expect(preg.enunciado).not.toContain('La respuesta correcta es');
      expect(preg.fuente.length).toBeLessThan(120);
      expect(preg.justificacion).not.toContain('principios de calidad de la cátedra');
      expect(preg.justificacion).not.toContain('Respuesta oficial');

      // Ningún texto debe contener expansiones de siglas duplicadas ') (' ni paréntesis desbalanceados
      expect(preg.enunciado).not.toContain(') (');
      expect(preg.justificacion).not.toContain(') (');
      const validarBalance = (txt: string) => {
        const limpio = txt.replace(/(?:^|\n)\s*[1-9]\)\s+/g, ' ');
        expect((limpio.match(/\(/g) || []).length).toBe((limpio.match(/\)/g) || []).length);
      };
      validarBalance(preg.enunciado);
      validarBalance(preg.justificacion);

      // Las opciones no deben tener cadenas espurias, duplicados ni placeholders
      const textosOpciones = new Set<string>();
      for (const opt of preg.opciones) {
        const normalizado = opt.texto.trim().toLowerCase();
        expect(textosOpciones.has(normalizado)).toBe(false);
        textosOpciones.add(normalizado);
        expect(opt.texto).not.toContain('Respuesta incorrecta');
        expect(opt.texto).not.toContain('Respuesta correcta');
        expect(opt.texto).not.toContain('Sin contestar');
        expect(opt.texto).not.toContain('Opción alternativa de evaluación');
        expect(opt.texto).not.toContain(') (');
        expect(opt.texto).not.toMatch(/\s[2-9]\.$/);
        expect(opt.texto).not.toMatch(/\s[i-k]\.\s+(?:Solo|Todas|Las)\b/i);
        validarBalance(opt.texto);
      }

      if (preg.opcionesDestino) {
        for (const optDest of preg.opcionesDestino) {
          expect(optDest.texto).not.toContain('Respuesta incorrecta');
          expect(optDest.texto).not.toContain('Respuesta correcta');
          expect(optDest.texto).not.toContain('Sin contestar');
          expect(optDest.texto).not.toContain(') (');
          validarBalance(optDest.texto);
        }
      }
    }
  });
});
