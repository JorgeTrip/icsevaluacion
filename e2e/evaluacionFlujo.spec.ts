import { test, expect } from '@playwright/test';

test.describe('Flujo E2E de Evaluación de Ingeniería y Calidad de Software', () => {
  test.beforeEach(async ({ page }) => {
    // Iniciar desde la app compilada en preview o servidor local
    await page.goto('http://localhost:4173/');
  });

  test('debe cargar la pantalla de bienvenida y configurar una tanda de 10 preguntas', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('ICS Evaluación');
    await expect(page.locator('h2')).toContainText('Ingeniería y Calidad de Software');

    // Botón para comenzar
    const botonComenzar = page.getByRole('button', { name: /Comenzar Evaluación/i });
    await expect(botonComenzar).toBeVisible();
    await botonComenzar.click();

    // Debe pasar a la pantalla de evaluación
    await expect(page.getByText(/de 10/i)).toBeVisible();
  });

  test('debe responder una pregunta y mostrar el feedback inmediato con justificación de cátedra', async ({ page }) => {
    await page.getByRole('button', { name: /Comenzar Evaluación/i }).click();

    // Seleccionar la primera opción táctil disponible
    const primeraOpcion = page.locator('button.min-h-\\[52px\\]').first();
    await expect(primeraOpcion).toBeVisible();
    await primeraOpcion.click();

    // Si es múltiple opción, presionar "Comprobar Respuesta" si está presente
    const botonComprobar = page.getByRole('button', { name: /Comprobar Respuesta/i });
    if (await botonComprobar.isVisible()) {
      await botonComprobar.click();
    }

    // Verificar que aparece el feedback inmediato y la justificación
    await expect(page.getByText(/Fundamento oficial de cátedra:/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Siguiente Pregunta|Ver Resultados/i })).toBeVisible();
  });
});
