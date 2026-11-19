/**
 * @file generadorTanda.ts
 * @description Servicio de dominio encargado de filtrar y barajar las preguntas
 * del banco de acuerdo a la configuración de la sesión elegida por el alumno.
 */

import {
  Pregunta,
  TipoPregunta,
} from '../modelos/tiposPregunta.ts';
import {
  ConfiguracionSesion,
} from '../modelos/tiposSesion.ts';

/**
 * Baraja una copia del arreglo utilizando el algoritmo de Fisher-Yates.
 * Garantiza una distribución uniforme e impredecible de preguntas.
 */
function barajarPreguntas<T>(elementos: T[]): T[] {
  const copia = [...elementos];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temporal = copia[i];
    copia[i] = copia[j];
    copia[j] = temporal;
  }
  return copia;
}

/**
 * Genera el lote de preguntas para una tanda según los filtros aplicados.
 *
 * @param bancoCompleto Lista íntegra de preguntas disponibles
 * @param configuracion Parámetros de cuatrimestre, unidades, tipo y tamaño
 * @param idsFallosPendientes Identificadores de preguntas para el modo de repaso
 * @returns Preguntas filtradas y barajadas listas para la sesión
 */
export function generarTandaPreguntas(
  bancoCompleto: Pregunta[],
  configuracion: ConfiguracionSesion,
  idsFallosPendientes: string[] = []
): Pregunta[] {
  let preguntasFiltradas = [...bancoCompleto];

  // 1. Filtro por Modo Repaso de Fallos
  if (configuracion.modo === 'REPASO_FALLOS') {
    const conjuntoFallos = new Set(idsFallosPendientes);
    preguntasFiltradas = preguntasFiltradas.filter((p) =>
      conjuntoFallos.has(p.id)
    );
  }

  // 2. Filtro por Cuatrimestre
  if (configuracion.cuatrimestre !== 'AMBOS') {
    preguntasFiltradas = preguntasFiltradas.filter(
      (p) => p.cuatrimestre === configuracion.cuatrimestre
    );
  }

  // 3. Filtro por Unidades Temáticas Específicas
  if (
    configuracion.unidadesFiltro &&
    configuracion.unidadesFiltro.length > 0
  ) {
    const conjuntoUnidades = new Set(configuracion.unidadesFiltro);
    preguntasFiltradas = preguntasFiltradas.filter((p) =>
      conjuntoUnidades.has(p.unidad)
    );
  }

  // 4. Filtro por Tipo de Pregunta
  if (configuracion.tipoFiltro === 'VF') {
    preguntasFiltradas = preguntasFiltradas.filter(
      (p) => p.tipo === TipoPregunta.VERDADERO_FALSO
    );
  } else if (configuracion.tipoFiltro === 'CHOICE') {
    preguntasFiltradas = preguntasFiltradas.filter(
      (p) =>
        p.tipo === TipoPregunta.OPCION_UNICA ||
        p.tipo === TipoPregunta.SELECCION_MULTIPLE
    );
  }

  // 5. Barajado aleatorio para evitar orden predecible
  const preguntasBarajadas = barajarPreguntas(preguntasFiltradas);

  // 6. Recorte según tamaño de tanda
  if (configuracion.tamanoTanda === 'INFINITA') {
    return preguntasBarajadas;
  }

  return preguntasBarajadas.slice(0, configuracion.tamanoTanda);
}
