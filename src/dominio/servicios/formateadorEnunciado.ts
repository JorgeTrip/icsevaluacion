/**
 * @file formateadorEnunciado.ts
 * @description Servicio puro de dominio para estructurar enunciados con subítems numerados, viñetas y bloques de código.
 */

export type BloqueEnunciado =
  | { tipo: 'texto'; contenido: string }
  | { tipo: 'lista'; items: { etiqueta: string; texto: string }[] }
  | { tipo: 'codigo'; contenido: string };

const REGEX_CODIGO_CERCADO = /```[a-zA-Z]*\n([\s\S]*?)```/g;
const REGEX_CODIGO_INLINE = /^(.*?\bsiguiente\s+código):?\s+((?:if|int|while|switch|for)\s*\b[\s\S]+)$/i;
const REGEX_INSTRUCCION_FINAL = /\s+(Seleccione\s+(?:la\s+opción\s+correcta|una(?:\s+o\s+más\s+de\s+una)?)\s*:?)\s*$/i;

/**
 * Formatea un enunciado plano en bloques semánticos para su renderizado estructurado en la UI.
 */
export function formatearEnunciado(enunciado: string): BloqueEnunciado[] {
  const texto = enunciado.trim();
  if (!texto) return [];

  const bloques: BloqueEnunciado[] = [];
  let ultimoIndice = 0;

  for (const match of texto.matchAll(REGEX_CODIGO_CERCADO)) {
    const inicio = match.index ?? 0;
    const previo = texto.slice(ultimoIndice, inicio).trim();
    if (previo) bloques.push(...procesarSegmentoTexto(previo));
    bloques.push({ tipo: 'codigo', contenido: match[1].trim() });
    ultimoIndice = inicio + match[0].length;
  }

  const restante = texto.slice(ultimoIndice).trim();
  if (restante) bloques.push(...procesarSegmentoTexto(restante));

  return bloques;
}

function procesarSegmentoTexto(segmento: string): BloqueEnunciado[] {
  const matchInline = segmento.match(REGEX_CODIGO_INLINE);
  if (matchInline) {
    const intro = matchInline[1].trim().replace(/:?$/, ':');
    return [
      { tipo: 'texto', contenido: intro },
      { tipo: 'codigo', contenido: matchInline[2].trim() },
    ];
  }

  const conVinetas = intentarSepararVinetas(segmento);
  if (conVinetas) return conVinetas;

  const conNumerados = intentarSepararNumerados(segmento);
  if (conNumerados) return conNumerados;

  return segmento
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((contenido) => ({ tipo: 'texto', contenido }));
}

function intentarSepararVinetas(texto: string): BloqueEnunciado[] | null {
  const partes = texto.split(/(?:^|\n|\s+)[•●]\s+/);
  if (partes.length < 3) return null;

  const bloques: BloqueEnunciado[] = [];
  const intro = partes[0].trim();
  if (intro) bloques.push({ tipo: 'texto', contenido: intro });

  const items: { etiqueta: string; texto: string }[] = [];
  let cola = '';

  partes.slice(1).forEach((raw, idx, arr) => {
    let limpio = raw.trim();
    if (idx === arr.length - 1) {
      const idxPregunta = limpio.search(/\s+(¿[^?]+\?|\bSeleccione\s+[^:]+:)/i);
      if (idxPregunta > 0) {
        cola = limpio.slice(idxPregunta).trim();
        limpio = limpio.slice(0, idxPregunta).trim();
      }
    }
    if (limpio) items.push({ etiqueta: '•', texto: limpio });
  });

  if (items.length > 0) bloques.push({ tipo: 'lista', items });
  if (cola) bloques.push(...procesarSegmentoTexto(cola));
  return bloques;
}

function intentarSepararNumerados(texto: string): BloqueEnunciado[] | null {
  const marcadores = Array.from(texto.matchAll(/(?:^|\n|\s)([1-9])\s*(?:[\.\-\)]|\s-\s)\s*(?=[A-ZÁÉÍÓÚÑa-záéíóúñ"'¿])/g));
  const secuencia: RegExpMatchArray[] = [];
  let esperado = 1;

  for (const m of marcadores) {
    if (Number(m[1]) === esperado) {
      secuencia.push(m);
      esperado += 1;
    }
  }

  if (secuencia.length < 2) return null;

  const bloques: BloqueEnunciado[] = [];
  const primerInicio = secuencia[0].index ?? 0;
  const intro = texto.slice(0, primerInicio).trim();
  if (intro) {
    for (const linea of intro.split(/\n+/).map((l) => l.trim()).filter(Boolean)) {
      bloques.push({ tipo: 'texto', contenido: linea });
    }
  }

  const items: { etiqueta: string; texto: string }[] = [];
  let instruccionFinal = '';

  for (let i = 0; i < secuencia.length; i++) {
    const actual = secuencia[i];
    const inicioContenido = (actual.index ?? 0) + actual[0].length;
    const finContenido = i + 1 < secuencia.length ? (secuencia[i + 1].index ?? texto.length) : texto.length;
    let contenidoItem = texto.slice(inicioContenido, finContenido).trim();

    if (i === secuencia.length - 1) {
      const matchCola = contenidoItem.match(REGEX_INSTRUCCION_FINAL);
      if (matchCola) {
        instruccionFinal = matchCola[1].trim();
        contenidoItem = contenidoItem.slice(0, matchCola.index).trim();
      }
    }

    items.push({ etiqueta: actual[1], texto: contenidoItem });
  }

  bloques.push({ tipo: 'lista', items });
  if (instruccionFinal) bloques.push({ tipo: 'texto', contenido: instruccionFinal });
  return bloques;
}
