/**
 * @file App.tsx
 * @description Orquestador principal de la aplicación web ICS Evaluación.
 */

import { useState, useEffect } from 'react';
import { useSesionEvaluacion } from './aplicacion/hooks/useSesionEvaluacion.ts';
import { useProgresoLocal } from './aplicacion/hooks/useProgresoLocal.ts';
import bancoPreguntasRaw from './infraestructura/datos/bancoPreguntas.json';
import { Pregunta } from './dominio/modelos/tiposPregunta.ts';
import { CabeceraApp } from './presentacion/componentes/CabeceraApp.tsx';
import { PantallaInicio } from './presentacion/paginas/PantallaInicio.tsx';
import { PantallaEvaluacion } from './presentacion/paginas/PantallaEvaluacion.tsx';
import { PantallaResultados } from './presentacion/paginas/PantallaResultados.tsx';
import { PantallaHistorial } from './presentacion/paginas/PantallaHistorial.tsx';

const bancoPreguntas = bancoPreguntasRaw as Pregunta[];

export function App() {
  const [esModoOscuro, setEsModoOscuro] = useState<boolean>(true);

  // Sincronizar clase 'dark' en el elemento html
  useEffect(() => {
    if (esModoOscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [esModoOscuro]);

  const {
    progreso,
    idsFallosPendientes,
    idsPracticaPendientes,
    registrarRespuesta,
    exportarHistorial,
    importarHistorial,
    borrarHistorial,
  } = useProgresoLocal();

  const {
    estadoSesion,
    configuracion,
    tanda,
    indiceActual,
    preguntaActual,
    totalPreguntas,
    opcionesSeleccionadas,
    resultadoActual,
    estadoPregunta,
    usoPistaActual,
    respuestasRegistradas,
    iniciarEvaluacion,
    registrarUsoPista,
    seleccionarOpcion,
    establecerOpcionesSeleccionadas,
    confirmarRespuestaMultiple,
    avanzarSiguiente,
    finalizarEvaluacion,
    volverAConfiguracion,
    irAHistorial,
  } = useSesionEvaluacion();

  return (
    <div className={`min-h-screen flex flex-col ${esModoOscuro ? 'bg-[#1C1C1E] text-[#F2F2F7]' : 'bg-[#F5F5F7] text-[#1C1C1E]'}`}>
      <CabeceraApp
        estadoSesion={estadoSesion}
        esModoOscuro={esModoOscuro}
        alAlternarTema={() => setEsModoOscuro((prev) => !prev)}
        alIrAInicio={volverAConfiguracion}
        alIrAHistorial={irAHistorial}
      />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-5">
        {estadoSesion === 'CONFIGURACION' && (
          <PantallaInicio
            totalPreguntasBanco={bancoPreguntas.length}
            totalFallosPendientes={idsFallosPendientes.length}
            totalPracticaPendiente={idsPracticaPendientes.length}
            alIniciar={(config) =>
              iniciarEvaluacion(config, bancoPreguntas, idsFallosPendientes, idsPracticaPendientes)
            }
          />
        )}

        {estadoSesion === 'EVALUANDO' && (
          <PantallaEvaluacion
            pregunta={preguntaActual}
            indiceActual={indiceActual}
            totalPreguntas={totalPreguntas}
            configuracion={configuracion}
            opcionesSeleccionadas={opcionesSeleccionadas}
            resultadoActual={resultadoActual}
            estadoPregunta={estadoPregunta}
            usoPistaActual={usoPistaActual}
            alRegistrarUsoPista={registrarUsoPista}
            alSeleccionarOpcion={(idOpcion) =>
              seleccionarOpcion(idOpcion, registrarRespuesta)
            }
            alCambiarSeleccionadas={establecerOpcionesSeleccionadas}
            alConfirmarMultiple={() =>
              confirmarRespuestaMultiple(registrarRespuesta)
            }
            alAvanzarSiguiente={avanzarSiguiente}
            alFinalizarSesion={finalizarEvaluacion}
            alVolverAInicio={volverAConfiguracion}
          />
        )}

        {estadoSesion === 'RESULTADOS' && (
          <PantallaResultados
            tanda={tanda}
            respuestas={respuestasRegistradas}
            alReiniciar={volverAConfiguracion}
            alPracticarFallos={(ids) =>
              iniciarEvaluacion(
                {
                  cuatrimestre: 'AMBOS',
                  unidadesFiltro: [],
                  tipoFiltro: 'TODOS',
                  tamanoTanda: 20,
                  modo: 'REPASO_FALLOS',
                },
                bancoPreguntas,
                ids
              )
            }
            alPracticarConPista={(ids) =>
              iniciarEvaluacion(
                {
                  cuatrimestre: 'AMBOS',
                  unidadesFiltro: [],
                  tipoFiltro: 'TODOS',
                  tamanoTanda: 20,
                  modo: 'REPASO_PRACTICA',
                },
                bancoPreguntas,
                [],
                ids
              )
            }
            alIrAHistorial={irAHistorial}
          />
        )}

        {estadoSesion === 'HISTORIAL' && (
          <PantallaHistorial
            progreso={progreso}
            alExportar={exportarHistorial}
            alImportar={importarHistorial}
            alBorrar={borrarHistorial}
            alVolverAInicio={volverAConfiguracion}
          />
        )}
      </main>

      <footer className="w-full border-t border-[#3A3A3C]/40 py-4 text-center text-xs text-[#8E8E93]">
        <div className="max-w-2xl mx-auto px-4">
          Ingeniería y Calidad de Software · UTN Facultad Regional Buenos Aires
        </div>
      </footer>
    </div>
  );
}
export default App;
