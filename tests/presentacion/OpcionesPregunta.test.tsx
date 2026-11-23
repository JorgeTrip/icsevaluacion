/**
 * @file OpcionesPregunta.test.tsx
 * @description Pruebas TDD de retroalimentación visual en selección múltiple para distinguir aciertos de opciones faltantes.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OpcionesPregunta } from '../../src/presentacion/componentes/OpcionesPregunta.tsx';
import { TipoPregunta } from '../../src/dominio/modelos/tiposPregunta.ts';

describe('Presentación: OpcionesPregunta (Selección Múltiple Evaluada)', () => {
  it('distingue visualmente las opciones acertadas de las opciones correctas que faltaron marcar', () => {
    render(
      <OpcionesPregunta
        opciones={[
          { id: 'a', texto: 'Opción A correcta y marcada' },
          { id: 'b', texto: 'Opción B correcta pero olvidada' },
          { id: 'c', texto: 'Opción C incorrecta y marcada' },
          { id: 'd', texto: 'Opción D incorrecta sin marcar' },
        ]}
        tipo={TipoPregunta.SELECCION_MULTIPLE}
        opcionesSeleccionadas={['a', 'c']}
        respuestasCorrectas={['a', 'b']}
        estaEvaluada={true}
        alSeleccionar={vi.fn()}
        alConfirmarMultiple={vi.fn()}
      />,
    );

    const btnA = screen.getByRole('button', { name: /Opción A correcta y marcada/i });
    const btnB = screen.getByRole('button', { name: /Opción B correcta pero olvidada/i });
    const btnC = screen.getByRole('button', { name: /Opción C incorrecta y marcada/i });

    expect(btnA.className).toContain('emerald');
    expect(btnB.className).toContain('amber');
    expect(btnB.textContent).toContain('Faltó marcar');
    expect(btnC.className).toContain('red');
    expect(btnA.textContent).not.toContain('Faltó marcar');
  });
});
