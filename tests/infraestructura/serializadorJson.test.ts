import { describe, it, expect } from 'vitest';
import {
  exportarProgresoAJson,
  importarProgresoDesdeJson,
} from '../../src/infraestructura/persistencia/serializadorJson.ts';
import { crearProgresoInicial } from '../../src/dominio/servicios/gestorProgreso.ts';

describe('Infraestructura: serializadorJson (Soberanía de Datos)', () => {
  it('debe exportar el progreso a un string JSON válido con versión y fecha', () => {
    const progreso = crearProgresoInicial();
    const jsonString = exportarProgresoAJson(progreso);

    expect(typeof jsonString).toBe('string');
    const parseado = JSON.parse(jsonString);
    expect(parseado.version).toBe(1);
    expect(parseado.fechaExportacion).toBeDefined();
    expect(parseado.estadisticas.totalRespondidas).toBe(0);
  });

  it('debe importar satisfactoriamente un JSON válido y restaurar el progreso', () => {
    const progreso = crearProgresoInicial();
    progreso.estadisticas.totalRespondidas = 15;
    progreso.estadisticas.totalCorrectas = 12;

    const jsonString = exportarProgresoAJson(progreso);
    const resultadoImportacion = importarProgresoDesdeJson(jsonString);

    expect(resultadoImportacion.exito).toBe(true);
    expect(resultadoImportacion.datos?.estadisticas.totalRespondidas).toBe(15);
    expect(resultadoImportacion.datos?.estadisticas.totalCorrectas).toBe(12);
  });

  it('debe rechazar un JSON corrupto o con datos alterados', () => {
    const jsonInvalido = JSON.stringify({
      version: 'invalida',
      estadisticas: { totalRespondidas: 'muchas' },
    });

    const resultadoImportacion = importarProgresoDesdeJson(jsonInvalido);
    expect(resultadoImportacion.exito).toBe(false);
    expect(resultadoImportacion.error).toBeDefined();
  });
});
