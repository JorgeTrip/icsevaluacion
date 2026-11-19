# Especificación de Requisitos de Software (SDD)
## Proyecto: Evaluador de Ingeniería y Calidad de Software (UTN FRBA)
### Repositorio: `icsevaluacion`

---

## 1. Visión y Objetivos del Sistema

### 1.1 Propósito
Desarrollar una aplicación web interactiva, optimizada con enfoque **Mobile-First** (y adaptable a escritorio), destinada a que los estudiantes de la materia **Ingeniería y Calidad de Software** de la **UTN - Facultad Regional Buenos Aires** (Cátedra: Marcelo Dalceggio, Diego Mansilla) evalúen sus conocimientos teóricos y prácticos mediante preguntas de parciales reales y bibliografía de la materia.

### 1.2 Principios Clave de Diseño y Experiencia de Usuario
- **Mobile-First Real**: Navegación ágil con pocos toques, botones táctiles grandes (>44px de área de contacto), tipografía legible y transiciones fluidas.
- **Estética Grises Pro**: Modo oscuro por defecto con escala de grises profundos (sin negro puro `#000000` ni blanco puro), bordes suaves, microinteracciones cuidadas y retroalimentación táctil/visual inmediata.
- **Feedback Inmediato**: Al seleccionar o confirmar la respuesta, el alumno ve de inmediato si acertó, cuáles eran las opciones correctas y la justificación técnica fundamentada en la bibliografía oficial (SWEBoK, ISO 25010, McConell, Wiegers, etc.).
- **Soberanía y Privacidad de Datos**: Funcionamiento 100% cliente (SPA) sin backend obligatorio; estadísticas guardadas en LocalStorage con capacidad de exportar e importar historial completo en formato JSON.
- **Despliegue Continuo**: Alojamiento estático en GitHub Pages desde el repositorio `icsevaluacion`.

---

## 2. Requerimientos Funcionales (Casos de Uso)

### CU-01: Configuración de la Sesión de Evaluación
- **Actor**: Estudiante / Alumno.
- **Descripción**: El alumno define los parámetros del lote de preguntas a responder antes de comenzar la sesión.
- **Criterios de Entrada**:
  - **Alcance / Cuatrimestre**:
    - Primer Cuatrimestre (1C / Parcial 1: Unidades 1 a 4).
    - Segundo Cuatrimestre (2C / Parcial 2: Unidades 5 y 6).
    - Toda la Materia (1C + 2C).
  - **Unidades Temáticas Específicas** (filtro opcional o acumulativo):
    - U1: Introducción a la Ingeniería de Software (SWEBoK, McConnell, Ishikawa).
    - U2: Modelos de Calidad de Software (ISO 25000 / 25010, Costos de calidad, McCall, CMMI).
    - U3: Software Engineering Approaches (Cynefin, Scrum, Kanban, Lean, Timebox).
    - U4: Estimaciones de Software (FP, UCP, Object Points, Planning Poker, Leyes de Brooks/Parkinson).
    - U5: Software Configuration Management (SCM, Baselines, SCCB, Git Branching, CI/CD).
    - U6: Testing de Software (Niveles, Caja Negra/Blanca, McCabe, Equivalencias, Exploratory).
  - **Tipo de Preguntas**:
    - Todas (Verdadero/Falso + Multiple Choice).
    - Solo Verdadero o Falso (V/F).
    - Solo Multiple Choice (Opción Única y Selección Múltiple).
  - **Tamaño de la Tanda**:
    - 10 preguntas.
    - 20 preguntas.
    - 30 preguntas.
    - Modo Infinito (hasta que el alumno decida finalizar manualmente o se agoten las preguntas disponibles).
  - **Modo de Operación**:
    - Modo Feedback Inmediato (estándar).
    - Modo Repaso de Fallos (preguntas previamente falladas y guardadas en el historial).

---

### CU-02: Respuesta y Retroalimentación Inmediata
- **Actor**: Estudiante.
- **Descripción**: El estudiante visualiza una pregunta por pantalla (presentación de tarjeta limpia y minimalista) y emite su respuesta.
- **Reglas de Interacción**:
  - En preguntas **Verdadero/Falso**: Dos botones directos táctiles ("Verdadero" y "Falso"). Al presionar uno, se califica al instante.
  - En preguntas de **Opción Única**: Lista de alternativas tipo radio. Al tocar una opción, se confirma y califica de inmediato.
  - En preguntas de **Selección Múltiple** (varias respuestas correctas): Casillas de verificación (checkboxes). El alumno selecciona las opciones que considera correctas y presiona un botón táctil flotante "Comprobar Respuesta".
  - **Retroalimentación Visual**:
    - Opciones correctas: Resaltado verde esmeralda suave con ícono de check (✓).
    - Opciones incorrectas seleccionadas: Resaltado rojo apagado con ícono de cruz (✗).
    - Estado de la respuesta: Mensaje de "¡Correcto!", "Parcialmente correcto" o "Incorrecto".
    - Tarjeta expansible de **Justificación Teórica**: Explica la razón respaldada en el material de cátedra.
  - Botón táctil para avanzar a la siguiente pregunta: "Siguiente Pregunta ➔" o "Finalizar Evaluación".

---

### CU-03: Cálculo de Puntuación Proporcional con Penalización
- **Actor**: Sistema.
- **Fórmula de Calificación**:
  - **Pregunta V/F y Opción Única**:
    - Acierto: 1.0 punto.
    - Error: 0.0 puntos.
  - **Pregunta de Selección Múltiple** con $C$ opciones correctas totales y $N$ opciones del enunciado:
    - Sea $A$ la cantidad de opciones correctas marcadas por el alumno.
    - Sea $E$ la cantidad de opciones incorrectas marcadas por el alumno.
    - Puntaje obtenido:
      $$P = \max\left(0, \frac{A - E}{C}\right)$$
    - Si $P = 1.0 \implies$ Resultado: **Correcto**.
    - Si $0 < P < 1.0 \implies$ Resultado: **Parcialmente Correcto**.
    - Si $P = 0.0 \implies$ Resultado: **Incorrecto**.

---

### CU-04: Finalización de Sesión e Informe de Resultados
- **Actor**: Estudiante.
- **Descripción**: Al completarse la tanda o al presionar "Finalizar Evaluación" en modo infinito, se despliega una pantalla de cierre con métricas claras.
- **Contenido del Informe**:
  - Calificación total (Puntos obtenidos / Puntos posibles) y porcentaje de efectividad.
  - Desglose de preguntas: Acertadas, Parciales, Falladas.
  - Desglose por Unidad Temática (gráfico de barras táctil con tasa de acierto por unidad).
  - Listado de preguntas respondidas para revisión rápida.
  - Botones de acción:
    - "Practicar Fallos" (inicia de inmediato una tanda con los errores cometidos).
    - "Nueva Evaluación" (vuelve al configurador de sesión).
    - "Exportar Resultados" (guarda el resumen de la sesión).

---

### CU-05: Modo Repaso de Fallos
- **Actor**: Estudiante.
- **Descripción**: Permite reintentar las preguntas que el estudiante ha contestado de forma errónea o parcial en sesiones previas.
- **Reglas**:
  - El sistema extrae los identificadores de preguntas con fallos registrados en `LocalStorage`.
  - Si una pregunta es respondida de forma 100% correcta durante el repaso, se remueve de la lista de fallos pendientes (o reduce su contador de fallos).
  - Si el alumno no tiene fallos registrados, la opción se deshabilita con un mensaje explicativo ("¡No tienes preguntas pendientes de repaso!").

---

### CU-06: Persistencia y Soberanía de Datos (LocalStorage y JSON)
- **Actor**: Estudiante.
- **Descripción**: El alumno controla totalmente su historial y estadísticas sin depender de servidores externos.
- **Reglas**:
  - Guardado automático en `LocalStorage` bajo una clave única (`ics_evaluacion_datos_v1`).
  - Funcionalidad de **Exportar Historial**: Descarga un archivo `ics-historial-[fecha].json`.
  - Funcionalidad de **Importar Historial**: Permite cargar un archivo JSON previamente exportado, validando su esquema estricto mediante Zod antes de escribir en el almacenamiento.
  - Funcionalidad de **Borrar Historial**: Confirmación en dos pasos para restablecer estadísticas a cero.

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
