# Especificación de Requisitos de Software (SDD)
## Proyecto: Evaluador de Ingeniería y Calidad de Software (UTN FRBA)
### Repositorio: `icsevaluacion`

---

## 1. Visión y Objetivos
- **Propósito**: Web App Mobile-First para evaluar conocimientos de Ingeniería y Calidad de Software (UTN FRBA, Cátedra: Marcelo Dalceggio y Diego Mansilla).
- **Principios**: Mobile-First (targets > 44px), paleta Grises Pro (sin negro ni blanco puro), feedback inmediato con justificación teórica, soberanía de datos (LocalStorage y JSON) y despliegue en GitHub Pages.

---

## 2. Requerimientos Funcionales (Casos de Uso)

### CU-01: Configuración de la Sesión
- **Alcance**: 1er Cuatrimestre (U1 a U4), 2do Cuatrimestre (U5 y U6) o Toda la Materia.
- **Unidades Específicas**: U1 (Intro), U2 (Calidad), U3 (Approaches), U4 (Estimaciones), U5 (SCM), U6 (Testing).
- **Formatos**: Todos, Solo Verdadero/Falso o Solo Multiple Choice.
- **Tamaños**: 10, 20, 30 preguntas o Modo Infinito.
- **Modos**: Evaluación Inmediata o Repaso de Fallos.

### CU-02: Respuesta y Retroalimentación Inmediata
- **V/F y Opción Única**: Selección directa con calificación instantánea.
- **Selección Múltiple**: Checkboxes con botón "Comprobar Respuesta".
- **Retroalimentación Visual**: Opciones correctas en verde (✓), incorrectas en rojo (✗), justificación de cátedra y botón para avanzar.

### CU-03: Cálculo de Puntuación Proporcional
- V/F y Única: 1.0 (Acierto) o 0.0 (Fallo).
- Selección Múltiple con penalización: $P = \max\left(0, \frac{A - E}{C}\right)$.

### CU-04: Informe de Resultados
- Puntaje final, porcentaje, desglose (correctas, parciales, falladas) y rendimiento por unidad temática.

### CU-05: Modo Repaso de Fallos
- Práctica dirigida de preguntas falladas previamente en LocalStorage. Si se acierta al 100%, se remueve del historial de fallos.

### CU-06: Persistencia y Soberanía de Datos
- LocalStorage automático, exportación e importación de JSON validado con Zod y reseteo a cero.

### CU-07: Unir Conceptos mediante Flechas Interactivas (Emparejamiento)
- Dos columnas paralelas (Origen A y Destino B). El alumno toca origen y luego destino para trazar una flecha SVG interactiva.
- Tocar un par permite desvincular o reasignar flechas antes de finalizar.
- Botón "Comprobar Respuestas" evalúa los pares: flechas verdes (aciertos), flechas rojas (errores) y líneas punteadas para la solución correcta.
- Puntaje proporcional sin penalización: $P = \frac{\text{Aciertos}}{\text{Total Pares}}$.

---

## 3. Escenarios de Aceptación (Gherkin)

### Escenario 1: Responder pregunta Verdadero / Falso (Happy Path)
```gherkin
Dado que el estudiante inició una tanda de preguntas
Y la pregunta actual es de tipo "Verdadero o Falso"
Cuando el estudiante presiona el botón "Falso"
Entonces el sistema evalúa inmediatamente la respuesta sin requerir botón adicional de confirmación
Y resalta visualmente en verde la opción correcta y en rojo la errónea si falló
Y despliega la justificación teórica de la cátedra
Y habilita el botón "Siguiente Pregunta"
```

### Escenario 2: Responder pregunta de Selección Múltiple con penalización (Parcialmente Correcta)
```gherkin
Dado que la pregunta actual tiene 3 opciones correctas ("A", "B", "C") y 2 incorrectas ("D", "E")
Cuando el estudiante selecciona "A", "B" y "D"
Y presiona el botón "Comprobar Respuesta"
Entonces el puntaje otorgado se calcula como (2 aciertos - 1 error) / 3 = 0.33 puntos
Y el estado visual se etiqueta como "Parcialmente Correcto"
Y la opción "D" se resalta con indicador de fallo y "A", "B", "C" se señalan como correctas
Y se muestra la justificación detallada de por qué "D" es incorrecta
```

### Escenario 3: Penalización que excede aciertos (Edge Case de Puntaje Negativo)
```gherkin
Dado que la pregunta tiene 1 opción correcta ("A") y 3 incorrectas ("B", "C", "D")
Cuando el estudiante selecciona erróneamente solo "B" y "C"
Y presiona "Comprobar Respuesta"
Entonces el cálculo (0 - 2) / 1 resulta menor a 0
Y el sistema acota el puntaje resultante exactamente a 0.0 puntos (invariante de no negatividad)
Y la pregunta queda registrada como "Fallada" para el Modo Repaso de Fallos
```

### Escenario 4: Tanda en Modo Infinito con detención voluntaria por el alumno
```gherkin
Dado que el estudiante seleccionó una tanda en tamaño "Infinito"
Cuando ha respondido 7 preguntas consecutivas
Y presiona el botón "Terminar Evaluación"
Entonces el sistema detiene la sesión de inmediato
Y calcula el puntaje final basado exclusivamente en las 7 preguntas contestadas
Y presenta la pantalla de resultados con el desglose correspondiente
```

### Escenario 5: Carga de respaldo JSON inválido o corrupto (Failure Mode)
```gherkin
Dado que el usuario accede a la sección de configuración y presiona "Importar Historial"
Cuando selecciona un archivo JSON alterado, mal formado o con datos que no cumplen el esquema Zod
Entonces el sistema rechaza la importación de manera segura
Y no modifica el LocalStorage preexistente
Y muestra un mensaje de alerta legible: "El archivo de respaldo no tiene un formato válido"
```

---

### Escenario 6: Unir conceptos de Scrum con sus definiciones mediante flechas interactivas
```gherkin
Dado que el estudiante recibe una pregunta de tipo "Unir Conceptos" con 4 ceremonias en la Columna A y 4 definiciones en la Columna B
Cuando el estudiante toca "Sprint Review" en la Columna A
Y luego toca "Revisa el éxito o no del sprint" en la Columna B
Entonces el sistema traza una flecha SVG visible entre ambos elementos y los asocia como par
Cuando el estudiante presiona "Comprobar Respuestas"
Entonces el sistema evalúa la correspondencia de todos los pares
Y resalta las flechas acertadas en verde y las equivocadas en rojo
Y muestra la justificación oficial del material de Scrum
```

---

## 4. Requerimientos No Funcionales

1. **Rendimiento**: Carga inicial < 1.5 segundos en redes móviles 4G. Transición instantánea entre preguntas (< 16ms, 60fps).
2. **Compatibilidad**: Navegadores modernos móviles y de escritorio (Chrome, Safari iOS, Firefox, Edge).
3. **Responsive Mobile-First**:
   - Diseñado prioritariamente para viewports móviles (360px a 430px de ancho).
   - En pantallas de escritorio (≥768px), centrado elegante con ancho máximo controlado (`max-w-2xl` o `max-w-3xl`) con estética tipo app nativa.
4. **Accesibilidad (WCAG 2.1 AA)**:
   - Contraste tipográfico de al menos 4.5:1.
   - Tamaños de fuente mínimos legibles (16px base para evitar zoom involuntario en iOS).
   - Soporte total de teclado (tabulación y barra espaciadora / Enter).
5. **Modularidad**: Ningún archivo fuente superará las 200 líneas de código (Regla de Hierro de Jorge).
