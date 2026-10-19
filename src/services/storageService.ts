import { Trecho, Ocorrencia, trechosIniciais, ocorrenciasIniciais } from '../mock/dadosMock';

const CHAVE_TRECHOS = '@roca_ai_motiva:trechos_v4';
const CHAVE_OCORRENCIAS = '@roca_ai_motiva:ocorrencias_v4';
const CHAVE_FILA_SYNC = '@roca_ai_motiva:fila_sync_v4';
const CHAVE_ULTIMA_SYNC = '@roca_ai_motiva:ultima_sync_v4';

export interface AcaoOffline {
  id: string;
  tipo: 'NOVA_OCORRENCIA' | 'BAIXA_ROCADA' | 'RESOLVER_OCORRENCIA';
  payloadResumo: string;
  timestamp: string;
}

// Cache em memória resiliente para ambientes nativos sem localStorage global
const memoriaLocal: Record<string, string> = {};

function lerStorage(chave: string): string | null {
  try {
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis && globalThis.localStorage) {
      return globalThis.localStorage.getItem(chave);
    }
  } catch {
    // Fallback silencioso para memória local
  }
  return memoriaLocal[chave] ?? null;
}

function gravarStorage(chave: string, valor: string): void {
  memoriaLocal[chave] = valor;
  try {
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis && globalThis.localStorage) {
      globalThis.localStorage.setItem(chave, valor);
    }
  } catch {
    // Fallback silencioso para memória local
  }
}

export const storageService = {
  carregarEstadoInicial(): {
    trechos: Trecho[];
    ocorrencias: Ocorrencia[];
    filaOffline: AcaoOffline[];
    ultimaSincronizacao: string;
  } {
    const rawTrechos = lerStorage(CHAVE_TRECHOS);
    const rawOcorrencias = lerStorage(CHAVE_OCORRENCIAS);
    const rawFila = lerStorage(CHAVE_FILA_SYNC);
    const rawSync = lerStorage(CHAVE_ULTIMA_SYNC);

    return {
      trechos: rawTrechos ? JSON.parse(rawTrechos) : trechosIniciais,
      ocorrencias: rawOcorrencias ? JSON.parse(rawOcorrencias) : ocorrenciasIniciais,
      filaOffline: rawFila ? JSON.parse(rawFila) : [],
      ultimaSincronizacao: rawSync || '19/10/2026 às 18:30',
    };
  },

  salvarTrechos(trechos: Trecho[]): void {
    gravarStorage(CHAVE_TRECHOS, JSON.stringify(trechos));
  },

  salvarOcorrencias(ocorrencias: Ocorrencia[]): void {
    gravarStorage(CHAVE_OCORRENCIAS, JSON.stringify(ocorrencias));
  },

  salvarFilaOffline(fila: AcaoOffline[]): void {
    gravarStorage(CHAVE_FILA_SYNC, JSON.stringify(fila));
  },

  salvarUltimaSincronizacao(dataHora: string): void {
    gravarStorage(CHAVE_ULTIMA_SYNC, dataHora);
  },

  limparTudo(): void {
    gravarStorage(CHAVE_TRECHOS, JSON.stringify(trechosIniciais));
    gravarStorage(CHAVE_OCORRENCIAS, JSON.stringify(ocorrenciasIniciais));
    gravarStorage(CHAVE_FILA_SYNC, JSON.stringify([]));
    const agora = new Date();
    const formatado = `${agora.toLocaleDateString('pt-BR')} às ${agora.toTimeString().slice(0, 5)}`;
    gravarStorage(CHAVE_ULTIMA_SYNC, formatado);
  },

  async sincronizarComApiCentral(
    trechos: Trecho[],
    ocorrencias: Ocorrencia[],
    fila: AcaoOffline[]
  ): Promise<{ ocorrenciasAtualizadas: Ocorrencia[]; horarioSync: string }> {
    // Simula latência de rede com API REST / PostGIS da Central CCR Motiva
    await new Promise((resolve) => setTimeout(resolve, 650));

    const ocorrenciasAtualizadas = ocorrencias.map((oc) => ({
      ...oc,
      sincronizado: true,
    }));

    const agora = new Date();
    const horarioSync = `${agora.toLocaleDateString('pt-BR')} às ${agora.toTimeString().slice(0, 5)}`;

    this.salvarTrechos(trechos);
    this.salvarOcorrencias(ocorrenciasAtualizadas);
    this.salvarFilaOffline([]);
    this.salvarUltimaSincronizacao(horarioSync);

    return { ocorrenciasAtualizadas, horarioSync };
  },
};
