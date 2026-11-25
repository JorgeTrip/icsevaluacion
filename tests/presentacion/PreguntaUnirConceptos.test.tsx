import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreguntaUnirConceptos } from '../../src/presentacion/componentes/PreguntaUnirConceptos.tsx';

describe('Presentación: PreguntaUnirConceptos (Cardinalidad N:1)', () => {
  it('permite conectar múltiples conceptos de la izquierda a una misma categoría destino cuando hay más orígenes que destinos', () => {
    const alCambiarPares = vi.fn();
    const opcionesOrigen = [
      { id: '1', texto: 'Auditoría de Proceso' },
      { id: '2', texto: 'Auditoría Lógica' },
      { id: '3', texto: 'Auditoría de Requerimientos' },
    ];
    const opcionesDestino = [
      { id: 'a', texto: 'Cumplimiento del proceso SCM' },
      { id: 'b', texto: 'No Aplica (N/A)' },
    ];

    const { rerender } = render(
      <PreguntaUnirConceptos
        opcionesOrigen={opcionesOrigen}
        opcionesDestino={opcionesDestino}
        opcionesSeleccionadas={[]}
        respuestasCorrectas={['1:a', '2:b', '3:b']}
        estaEvaluada={false}
        alCambiarPares={alCambiarPares}
        alConfirmar={vi.fn()}
      />
    );

    expect(screen.getByText(/varios pueden compartir destino/i)).toBeTruthy();

    // Conectar '2' -> 'b'
    fireEvent.click(screen.getByText('Auditoría Lógica'));
    fireEvent.click(screen.getByText('No Aplica (N/A)'));
    expect(alCambiarPares).toHaveBeenLastCalledWith(['2:b']);

    // Simular estado actualizado y conectar '3' -> 'b' (mismo destino)
    rerender(
      <PreguntaUnirConceptos
        opcionesOrigen={opcionesOrigen}
        opcionesDestino={opcionesDestino}
        opcionesSeleccionadas={['2:b']}
        respuestasCorrectas={['1:a', '2:b', '3:b']}
        estaEvaluada={false}
        alCambiarPares={alCambiarPares}
        alConfirmar={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Auditoría de Requerimientos'));
    fireEvent.click(screen.getByText('No Aplica (N/A)'));
    expect(alCambiarPares).toHaveBeenLastCalledWith(['2:b', '3:b']);
  });
});
