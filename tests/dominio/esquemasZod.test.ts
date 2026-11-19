import { describe, it, expect } from 'vitest';
import {
  EsquemaPregunta,
  EsquemaBancoPreguntas,
} from '../../src/dominio/esquemas/esquemaPregunta.ts';
import { EsquemaRespaldoProgreso } from '../../src/dominio/esquemas/esquemaProgreso.ts';
import {
  Cuatrimestre,
  TipoPregunta,
  UnidadTematica,
} from '../../src/dominio/modelos/tiposPregunta.ts';

describe('Esquemas de Validación Zod (Frontera de Datos)', () => {
  describe('Esquema de Pregunta', () => {
    it('debe validar satisfactoriamente una pregunta bien formada', () => {
      const datos = {
        id: 'u1-01',
        cuatrimestre: Cuatrimestre.PRIMERO,
        unidad: UnidadTematica.U1,
        tipo: TipoPregunta.VERDADERO_FALSO,
        enunciado: '¿El software es inmaterial?',
        opciones: [
          { id: 'v', texto: 'Verdadero' },
          { id: 'f', texto: 'Falso' },
        ],
        respuestasCorrectas: ['v'],
        justificacion: 'La inmaterialidad es una de las características clave según Brooks.',
        fuente: 'Unidad 1 PPT',
      };

      const resultado = EsquemaPregunta.safeParse(datos);
      expect(resultado.success).toBe(true);
    });

    it('debe rechazar una pregunta con tipo de cuatrimestre o unidad inválida', () => {
      const datosInvalido = {
        id: 'bad-01',
        cuatrimestre: '3C', // Inválido
        unidad: 'U99', // Inválido
        tipo: 'OTRO',
        enunciado: '',
        opciones: [],
        respuestasCorrectas: [],
        justificacion: '',
      };

      const resultado = EsquemaPregunta.safeParse(datosInvalido);
      expect(resultado.success).toBe(false);
    });
  });

  describe('Esquema de Respaldo de Progreso (Import/Export JSON)', () => {
    it('debe validar un archivo JSON de respaldo de progreso correcto', () => {
      const respaldoValido = {
        version: 1,
        fechaExportacion: new Date().toISOString(),
        historialFallos: [
          {
            idPregunta: 'u1-01',
            contadorFallos: 2,
            ultimoFallo: new Date().toISOString(),
          },
        ],
        estadisticas: {
          totalRespondidas: 10,
          totalCorrectas: 7,
          totalParciales: 1,
          totalIncorrectas: 2,
          puntajeAcumulado: 7.5,
        },
        rendimientoPorUnidad: {
          U1: { respondidas: 5, correctas: 4 },
          U2: { respondidas: 5, correctas: 3 },
          U3: { respondidas: 0, correctas: 0 },
          U4: { respondidas: 0, correctas: 0 },
          U5: { respondidas: 0, correctas: 0 },
          U6: { respondidas: 0, correctas: 0 },
        },
      };

      const resultado = EsquemaRespaldoProgreso.safeParse(respaldoValido);
      expect(resultado.success).toBe(true);
    });

    it('debe rechazar un JSON corrupto o con tipos incompatibles', () => {
      const respaldoCorrupto = {
        version: 'una_cadena', // Debe ser número
        estadisticas: null,
      };

      const resultado = EsquemaRespaldoProgreso.safeParse(respaldoCorrupto);
      expect(resultado.success).toBe(false);
    });
  });
});
