/**
 * @file PantallaHistorial.tsx
 * @description Pantalla de estadísticas globales, soberanía de datos (JSON) y novedades.
 */

import React, { useState } from 'react';
import { ProgresoEstudiante } from '../../dominio/modelos/tiposProgreso.ts';
import { MetricasResumen } from '../componentes/MetricasResumen.tsx';
import { Download, Upload, Trash2, ArrowLeft, Info, Check } from 'lucide-react';
import changelogData from '../../../changelog.json';

interface PropsPantallaHistorial {
  progreso: ProgresoEstudiante;
  alExportar: () => string;
  alImportar: (json: string) => { exito: boolean; error?: string };
  alBorrar: () => void;
  alVolverAInicio: () => void;
}

export const PantallaHistorial: React.FC<PropsPantallaHistorial> = ({
  progreso,
  alExportar,
  alImportar,
  alBorrar,
  alVolverAInicio,
}) => {
  const [mensajeEstado, setMensajeEstado] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const [mostrarNovedades, setMostrarNovedades] = useState(false);

  const manejarExportar = () => {
    const contenido = alExportar();
    const blob = new Blob([contenido], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ics-evaluacion-historial-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMensajeEstado({ tipo: 'ok', texto: 'Historial exportado exitosamente.' });
  };

  const manejarImportarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lector = new FileReader();
    lector.onload = (evento) => {
      const texto = evento.target?.result as string;
      const res = alImportar(texto);
      if (res.exito) {
        setMensajeEstado({ tipo: 'ok', texto: 'Historial importado y validado correctamente.' });
      } else {
        setMensajeEstado({ tipo: 'error', texto: res.error || 'Error al importar archivo.' });
      }
    };
    lector.readAsText(file);
    e.target.value = '';
  };

  const confirmarBorrado = () => {
    if (window.confirm('¿Deseas reiniciar todas tus estadísticas a cero? Esta acción no se puede deshacer.')) {
      alBorrar();
      setMensajeEstado({ tipo: 'ok', texto: 'Estadísticas reiniciadas a cero.' });
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <button
          onClick={alVolverAInicio}
          className="flex items-center gap-1.5 text-xs text-[#AEAEB2] hover:text-[#F2F2F7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </button>
        <button
          onClick={() => setMostrarNovedades(!mostrarNovedades)}
          className="flex items-center gap-1 text-xs text-emerald-400 font-medium hover:underline"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Novedades v1.0.0</span>
        </button>
      </div>

      {/* Alerta de notificación si existe */}
      {mensajeEstado && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            mensajeEstado.tipo === 'ok'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border-red-500/30 text-red-300'
          }`}
        >
          <Check className="w-4 h-4 shrink-0" />
          <span>{mensajeEstado.texto}</span>
        </div>
      )}

      {/* Modal / Sección de Novedades (Changelog) */}
      {mostrarNovedades && (
        <div className="rounded-2xl p-4 bg-[#2C2C2E] border border-[#3A3A3C] text-xs space-y-2">
          <h4 className="font-semibold text-[#F2F2F7]">Historial de Versiones (Changelog)</h4>
          {changelogData.map((item) => (
            <div key={item.version} className="space-y-1 pt-1 border-t border-[#3A3A3C]">
              <span className="font-medium text-emerald-400">Versión {item.version} ({item.fecha})</span>
              <ul className="list-disc list-inside text-[#AEAEB2] space-y-0.5">
                {item.cambios.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Métricas Globales */}
      <MetricasResumen
        puntajeTotal={progreso.estadisticas.puntajeAcumulado}
        totalPreguntas={progreso.estadisticas.totalRespondidas}
        correctas={progreso.estadisticas.totalCorrectas}
        parciales={progreso.estadisticas.totalParciales}
        incorrectas={progreso.estadisticas.totalIncorrectas}
        rendimientoPorUnidad={progreso.rendimientoPorUnidad}
      />

      {/* Soberanía de Datos */}
      <div className="rounded-2xl p-5 bg-[#2C2C2E] border border-[#3A3A3C] shadow-lg space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#AEAEB2]">
          Soberanía y Portabilidad de Datos
        </h3>
        <p className="text-xs text-[#8E8E93]">
          Tus datos residen 100% en tu navegador. Puedes exportar o importar tu progreso en formato JSON sin servidores externos.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={manejarExportar}
            className="py-2.5 px-3 rounded-xl bg-[#3A3A3C] hover:bg-[#48484A] text-[#F2F2F7] text-xs font-medium border border-[#48484A] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar JSON</span>
          </button>

          <label className="py-2.5 px-3 rounded-xl bg-[#3A3A3C] hover:bg-[#48484A] text-[#F2F2F7] text-xs font-medium border border-[#48484A] flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
            <Upload className="w-3.5 h-3.5" />
            <span>Importar JSON</span>
            <input type="file" accept=".json" onChange={manejarImportarArchivo} className="hidden" />
          </label>
        </div>

        <button
          onClick={confirmarBorrado}
          className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 mt-2"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reiniciar Historial a Cero</span>
        </button>
      </div>
    </div>
  );
};
