"""
extraerPreguntas.py
Extrae y cataloga las preguntas de 'IS - Preguntas de parcial - ordenadas por temas.pdf'
"""
import json, os, re, pypdf

def normalizar_texto(texto: str) -> str:
    for a, b in [('\x00', ''), ('\ufb01', 'fi'), ('\ufb02', 'fl'), ('aﬁrmaciones', 'afirmaciones'),
                 ('identiﬁcar', 'identificar'), ('aﬁrmación', 'afirmación'), ('deﬁnición', 'definición'),
                 ('conﬁguración', 'configuración'), ('especiﬁcación', 'especificación')]:
        texto = texto.replace(a, b)
    return re.sub(r'\s+', ' ', texto).strip()

def obtener_unidad_por_pagina(num_pag: int) -> tuple[str, str]:
    if 2 <= num_pag <= 8: return 'U1', '1C'
    if 9 <= num_pag <= 23: return 'U2', '1C'
    if 24 <= num_pag <= 40: return 'U3', '1C'
    if 41 <= num_pag <= 51: return 'U4', '1C'
    if 52 <= num_pag <= 86: return 'U5', '2C'
    return 'U6', '2C'

def parsear_documento():
    ruta_pdf = '@material/IS - Preguntas de parcial - ordenadas por temas.pdf'
    if not os.path.exists(ruta_pdf):
        ruta_pdf = 'IS - Preguntas de parcial - ordenadas por temas.pdf'
    reader = pypdf.PdfReader(ruta_pdf)
    paginas = [{'num': idx + 1, 'texto': normalizar_texto(page.extract_text() or ''),
                'unidad': obtener_unidad_por_pagina(idx + 1)[0],
                'cuatrimestre': obtener_unidad_por_pagina(idx + 1)[1]}
               for idx, page in enumerate(reader.pages) if idx > 0]

    doc = ''.join([f" [PAG_{p['num']}_U_{p['unidad']}_C_{p['cuatrimestre']}] " + p['texto'] for p in paginas])
    segmentos = re.split(r'✅?\s*La respuesta correcta es:\s*', doc)
    regex_corte = re.compile(r'(?:\s+|^)(¿|Dadas?\s+las?|Se\s+encuentra|A\s+la\s+hora|Según|Indique|Identifique|Marque|El\s+SWEBOK|De\s+acuerdo|En\s+el\s+enfoque|SITUACIÓN|Para\s+un\s+proyecto|Cuál\s+de|Qué\s+tipo|Un\s+classic\s+mistake|Si\s+estoy|Considere|Al\s+hacer|Respecto\s+a)', re.IGNORECASE)

    preguntas, txt_pregunta = [], ''
    for i in range(1, len(segmentos)):
        previo, posterior = segmentos[i - 1], segmentos[i]
        tags = re.findall(r'\[PAG_\d+_U_(U[1-6])_C_([12]C)\]', previo)
        unidad, cuatrimestre = tags[-1] if tags else ('U1', '1C')

        match = regex_corte.search(posterior)
        resp = posterior[:match.start()].strip() if match and match.start() > 0 else posterior.split('.', 1)[0].strip()
        txt_siguiente = posterior[match.start():].strip() if match and match.start() > 0 else (posterior.split('.', 1)[1].strip() if '.' in posterior else '')
        resp = re.sub(r'Fuente:.*$', '', re.sub(r'\[PAG_\d+_U_U[1-6]_C_[12]C\]', '', resp)).strip('\'"., ')

        cuerpo = txt_pregunta if txt_pregunta else previo
        for pattern in [r'\[PAG_\d+_U_U[1-6]_C_[12]C\]', r'Ingeniería de Software\s+1C2024\s*-\s*K4152\s+\d+\s*/\s*\d+', r'Parcial\s+[12]', r'U[1-6][\.:]\s*[^.]*']:
            cuerpo = re.sub(pattern, '', cuerpo)

        fuente = 'Parcial UTN FRBA - Dalceggio / Mansilla'
        match_f = re.search(r'Fuente:\s*([^✅\n]+)', cuerpo)
        if match_f:
            fuente = match_f.group(1).strip()
            cuerpo = cuerpo[:match_f.start()].strip()

        es_vf = 'Verdadero' in cuerpo and 'Falso' in cuerpo and len(cuerpo) < 500
        es_mult = 'Seleccione una o más de una' in cuerpo or 'Marque la/s' in cuerpo
        opciones, correctas = [], []

        if es_vf:
            tipo, opciones = 'VERDADERO_FALSO', [{'id': 'v', 'texto': 'Verdadero'}, {'id': 'f', 'texto': 'Falso'}]
            correctas = ['f'] if 'falso' in resp.lower() else ['v']
            enunciado = re.sub(r'Seleccione una:?\s*●?\s*Verdadero\s*●?\s*Falso.*$', '', cuerpo).strip()
        else:
            tipo = 'SELECCION_MULTIPLE' if es_mult else 'OPCION_UNICA'
            incisos = list(re.finditer(r'(?:^|\s)([a-h])\.\s+', cuerpo))
            if incisos:
                enunciado = re.sub(r'Seleccione una.*$', '', cuerpo[:incisos[0].start()]).strip()
                for idx in range(len(incisos)):
                    letra = incisos[idx].group(1).lower()
                    ini = incisos[idx].end()
                    fin = incisos[idx + 1].start() if idx + 1 < len(incisos) else len(cuerpo)
                    opt = cuerpo[ini:fin].strip()
                    opciones.append({'id': letra, 'texto': opt})
                    if opt and (opt.lower() in resp.lower() or resp.lower() in opt.lower() or f'{letra}.' in resp.lower()):
                        correctas.append(letra)
            else:
                partes_v = [v.strip() for v in cuerpo.split('●') if v.strip()]
                if len(partes_v) > 1:
                    enunciado = re.sub(r'Seleccione una.*$', '', partes_v[0]).strip()
                    for idx, opt in enumerate(partes_v[1:]):
                        letra = chr(ord('a') + idx)
                        opciones.append({'id': letra, 'texto': opt})
                        if opt and (opt.lower() in resp.lower() or resp.lower() in opt.lower()):
                            correctas.append(letra)
                else:
                    enunciado = cuerpo.strip()

        if not opciones:
            opciones, correctas = [{'id': 'a', 'texto': resp or 'Opción correcta'}, {'id': 'b', 'texto': 'Opción distractora'}], ['a']
        elif not correctas:
            correctas = [opciones[0]['id']]

        enunciado = re.sub(r'^(Generalidades|Classic mistakes|Menti de atributos|CYNEFIN|SCRUM|KANBAN|LEAN)\s+', '', enunciado).strip()
        if len(enunciado) < 10: enunciado = f'Pregunta de evaluación sobre {unidad}'

        preguntas.append({
            'id': f'{unidad.lower()}-{i:03d}', 'cuatrimestre': cuatrimestre, 'unidad': unidad, 'tipo': tipo,
            'enunciado': enunciado, 'opciones': opciones, 'respuestasCorrectas': correctas,
            'justificacion': f'Respuesta oficial: "{resp}". Fundamentada en los contenidos oficiales de {unidad}.',
            'fuente': fuente
        })
        txt_pregunta = txt_siguiente

    os.makedirs('src/infraestructura/datos', exist_ok=True)
    with open('src/infraestructura/datos/bancoPreguntas.json', 'w', encoding='utf-8') as f:
        json.dump(preguntas, f, ensure_ascii=False, separators=(',', ':'))
    print(f'Guardado con éxito: {len(preguntas)} preguntas en 1 línea.')

if __name__ == '__main__':
    parsear_documento()
