/**
 * @file ModalPista.test.tsx
 * @description Pruebas unitarias de presentación para el modal accesible de pistas (hints) y diagramas SVG.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalPista } from '../../src/presentacion/componentes/ModalPista.tsx';

describe('Presentación: ModalPista', () => {
  it('renderiza el texto de la pista, el aviso académico y el diagrama SVG cuando está abierto', () => {
    const alCerrar = vi.fn();
    render(
      <ModalPista
        abierto={true}
        pista={{
          texto: 'Pensá en el sentido causa → efecto del diagrama.',
          diagramaId: 'ishikawa',
        }}
        yaEvaluada={false}
        alCerrar={alCerrar}
      />,
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText(/Pensá en el sentido causa/i)).toBeTruthy();
    expect(screen.getByText(/no sumará puntos/i)).toBeTruthy();
    expect(screen.getByRole('img', { name: /Ishikawa/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Entendido/i }));
    expect(alCerrar).toHaveBeenCalledTimes(1);
  });

  it('se cierra al presionar Escape y oculta el aviso si la pregunta ya fue evaluada', () => {
    const alCerrar = vi.fn();
    render(
      <ModalPista
        abierto={true}
        pista={{ texto: 'Pista consultiva posterior.' }}
        yaEvaluada={true}
        alCerrar={alCerrar}
      />,
    );

    expect(screen.queryByText(/no sumará puntos/i)).toBeNull();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(alCerrar).toHaveBeenCalledTimes(1);
  });
});
