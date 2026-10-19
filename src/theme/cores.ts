export const cores = {
  primaria: '#1E3A8A',       // Azul institucional CCR
  primariaHover: '#1D4ED8',
  fundo: '#F3F4F6',          // Fundo cinza claro
  superficie: '#FFFFFF',     // Fundo de cards e modais
  borda: '#E5E7EB',
  
  texto: {
    primario: '#111827',
    secundario: '#6B7280',
    claro: '#FFFFFF',
  },

  // Níveis regulatórios ARTESP / SP-021
  status: {
    normal: {
      fundo: '#D1FAE5',
      texto: '#065F46',
      borda: '#10B981',      // Verde: < 10 cm
    },
    atencao: {
      fundo: '#FEF3C7',
      texto: '#92400E',
      borda: '#F59E0B',      // Amarelo: 10 a 30 cm
    },
    critico: {
      fundo: '#FEE2E2',
      texto: '#991B1B',
      borda: '#EF4444',      // Vermelho: > 30 cm (Multa ARTESP)
    },
  },
};