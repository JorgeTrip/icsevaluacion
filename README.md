# ICS Evaluación · UTN FRBA

Aplicación web interactiva optimizada con enfoque **Mobile-First** (y adaptable a escritorio) para la autoevaluación de conocimientos de la materia **Ingeniería y Calidad de Software** (UTN Facultad Regional Buenos Aires, Cátedra: Marcelo Dalceggio y Diego Mansilla).

---

## 🚀 Características Principales

- **Banco Oficial de Más de 200 Preguntas**: Reactivos extraídos de exámenes de parciales reales y bibliografía de cátedra.
- **Feedback Inmediato**: Calificación instantánea al responder, señalización visual de aciertos/errores y justificación conceptual fundamentada en la bibliografía oficial (SWEBoK, ISO 25010, McConell, etc.).
- **Filtros Personalizados**:
  - **Por Cuatrimestre**: Toda la materia (1C + 2C), Solo 1er Cuatrimestre (U1 a U4) o Solo 2do Cuatrimestre (U5 y U6).
  - **Por Unidades Curriculares**: U1 (Intro), U2 (Modelos de Calidad), U3 (Approaches), U4 (Estimaciones), U5 (SCM), U6 (Testing).
  - **Por Formato**: Todos, Solo Verdadero/Falso o Solo Multiple Choice.
  - **Tamaño de Tanda**: 10, 20, 30 preguntas o Modo Infinito con detención voluntaria.
- **Puntuación Proporcional con Penalización**: Suma proporcional por aciertos y descuenta por errores en preguntas de opciones múltiples, con cota inferior en cero.
- **Modo Repaso de Fallos**: Permite ejercitar específicamente las preguntas respondidas incorrectamente en sesiones previas.
- **Soberanía y Privacidad de Datos**: 100% ejecutado en el cliente; almacenamiento en LocalStorage con capacidad de exportar e importar el historial completo en formato JSON.
- **Diseño Apple / Grises Pro**: Modo oscuro por defecto con paleta de grises profundos (sin negro puro `#000000` ni blanco puro), bordes suaves y targets táctiles accesibles (>48px).

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
- **Validación en Frontera**: Zod (para contratos de preguntas y respaldos JSON).
- **Pruebas**: Vitest (Pruebas unitarias y de integración de dominio), Playwright (Pruebas E2E en navegadores reales).
- **CI/CD**: GitHub Actions para despliegue automatizado en GitHub Pages.

---

## 📦 Scripts Disponibles

```bash
# Iniciar entorno de desarrollo
npm run dev

# Ejecutar pruebas unitarias en modo TDD
npm run test

# Ejecutar pruebas End-to-End con Playwright
npm run e2e

# Compilar para producción
npm run build

# Ejecutar suite de auditoría global (líneas, SAST y arquitectura)
npm run auditar
```

---

## 🌐 Despliegue en GitHub Pages

El repositorio incluye el flujo de GitHub Actions en `.github/workflows/deploy.yml`. Al realizar `git push` a la rama `main`, la aplicación se compila y se publica automáticamente en GitHub Pages.
