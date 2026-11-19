import { describe, it, expect } from 'vitest';
import { evaluarPregunta } from '../../src/dominio/servicios/evaluadorRespuesta.ts';
import {
  Cuatrimestre,
  Pregunta,
  TipoPregunta,
  UnidadTematica,
} from '../../src/dominio/modelos/tiposPregunta.ts';

describe('Servicio de Dominio: evaluadorRespuesta', () => {
  const preguntaEjemplo: Pregunta = {
    id: 'u1-001',
    cuatrimestre: Cuatrimestre.PRIMERO,
    unidad: UnidadTematica.U1,
    tipo: TipoPregunta.VERDADERO_FALSO,
    enunciado: 'SWEBoK v3 está formado por 15 Knowledge Areas.',
    opciones: [
      { id: 'v', texto: 'Verdadero' },
      { id: 'f', texto: 'Falso' },
    ],
    respuestasCorrectas: ['v'],
    justificacion: 'SWEBoK v3 define exactamente 15 KAs.',
  };

  it('debe evaluar correctamente una pregunta V/F y devolver el resultado completo', () => {
    const resultado = evaluarPregunta(preguntaEjemplo, ['v']);

    expect(resultado.idPregunta).toBe('u1-001');
    expect(resultado.opcionesSeleccionadas).toEqual(['v']);
    expect(resultado.puntajeObtenido).toBe(1.0);
    expect(resultado.estado).toBe('CORRECTA');
    expect(resultado.fechaRespuesta).toBeDefined();
  });

  it('debe registrar un resultado incorrecto cuando el estudiante se equivoca', () => {
    const resultado = evaluarPregunta(preguntaEjemplo, ['f']);

    expect(resultado.idPregunta).toBe('u1-001');
    expect(resultado.opcionesSeleccionadas).toEqual(['f']);
    expect(resultado.puntajeObtenido).toBe(0.0);
    expect(resultado.estado).toBe('INCORRECTA');
  });

  it('debe arrojar error si la lista de respuestas seleccionadas es nula o indefinida', () => {
    // @ts-expect-error probando robustez ante entradas inválidas
    expect(() => evaluarPregunta(preguntaEjemplo, null)).toThrow();
  });
});
