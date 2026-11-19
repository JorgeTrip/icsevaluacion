/**
 * @file variablesTema.ts
 * @description Tokens de diseño y variables globales de la paleta "Grises Pro" (Estilo Apple),
 * respetando la prohibición de negro puro (#000000) y blanco puro de fondo.
 */

export const temaColores = {
  oscuro: {
    fondo: 'bg-[#1C1C1E]',
    fondoTranslucido: 'bg-[#1C1C1E]/80 backdrop-blur-md',
    superficie: 'bg-[#2C2C2E]',
    superficieElevada: 'bg-[#3A3A3C]',
    borde: 'border-[#48484A]',
    bordeSuave: 'border-[#3A3A3C]',
    textoPrincipal: 'text-[#F2F2F7]',
    textoSecundario: 'text-[#AEAEB2]',
    textoAtenuado: 'text-[#8E8E93]',
    acentoExito: 'text-[#30D158]',
    fondoExito: 'bg-[#30D158]/15 border-[#30D158]/30',
    acentoError: 'text-[#FF453A]',
    fondoError: 'bg-[#FF453A]/15 border-[#FF453A]/30',
    acentoAdvertencia: 'text-[#FFD60A]',
    fondoAdvertencia: 'bg-[#FFD60A]/15 border-[#FFD60A]/30',
  },
  claro: {
    fondo: 'bg-[#F5F5F7]',
    fondoTranslucido: 'bg-[#F5F5F7]/80 backdrop-blur-md',
    superficie: 'bg-[#FFFFFF]',
    superficieElevada: 'bg-[#E5E5EA]',
    borde: 'border-[#D1D1D6]',
    bordeSuave: 'border-[#E5E5EA]',
    textoPrincipal: 'text-[#1C1C1E]',
    textoSecundario: 'text-[#636366]',
    textoAtenuado: 'text-[#8E8E93]',
    acentoExito: 'text-[#34C759]',
    fondoExito: 'bg-[#34C759]/15 border-[#34C759]/30',
    acentoError: 'text-[#FF3B30]',
    fondoError: 'bg-[#FF3B30]/15 border-[#FF3B30]/30',
    acentoAdvertencia: 'text-[#FFCC00]',
    fondoAdvertencia: 'bg-[#FFCC00]/15 border-[#FFCC00]/30',
  },
  botones: {
    minimoTactil: 'min-h-[48px] min-w-[48px]',
    transicionSuave: 'transition-all duration-200 ease-out active:scale-[0.98]',
  },
};
