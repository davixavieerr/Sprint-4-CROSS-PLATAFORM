import AsyncStorage from '@react-native-async-storage/async-storage';
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

export interface EstadoPersistido {
  trechos: Trecho[];
  ocorrencias: Ocorrencia[];
  filaOffline: AcaoOffline[];
  ultimaSincronizacao: string;
}

function agoraFormatado(): string {
  const agora = new Date();
  return `${agora.toLocaleDateString('pt-BR')} às ${agora.toTimeString().slice(0, 5)}`;
}

// Persistência real em disco (AsyncStorage): sobrevive ao fechamento do app no Android/iOS
// e usa localStorage automaticamente na versão Web.
async function gravar(chave: string, valor: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(chave, typeof valor === 'string' ? valor : JSON.stringify(valor));
  } catch (erro) {
    console.warn('[storageService] Falha ao gravar', chave, erro);
  }
}

async function lerJson<T>(chave: string, padrao: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(chave);
    return raw ? (JSON.parse(raw) as T) : padrao;
  } catch (erro) {
    // Dado corrompido ou storage indisponível: volta ao cenário padrão sem derrubar o app
    console.warn('[storageService] Falha ao ler', chave, erro);
    return padrao;
  }
}

export const storageService = {
  async carregarEstadoInicial(): Promise<EstadoPersistido> {
    const [trechos, ocorrencias, filaOffline] = await Promise.all([
      lerJson<Trecho[]>(CHAVE_TRECHOS, trechosIniciais),
      lerJson<Ocorrencia[]>(CHAVE_OCORRENCIAS, ocorrenciasIniciais),
      lerJson<AcaoOffline[]>(CHAVE_FILA_SYNC, []),
    ]);

    let ultimaSincronizacao = '19/10/2026 às 18:30';
    try {
      ultimaSincronizacao = (await AsyncStorage.getItem(CHAVE_ULTIMA_SYNC)) || ultimaSincronizacao;
    } catch {
      // mantém o valor padrão
    }

    return { trechos, ocorrencias, filaOffline, ultimaSincronizacao };
  },

  async salvarTrechos(trechos: Trecho[]): Promise<void> {
    await gravar(CHAVE_TRECHOS, trechos);
  },

  async salvarOcorrencias(ocorrencias: Ocorrencia[]): Promise<void> {
    await gravar(CHAVE_OCORRENCIAS, ocorrencias);
  },

  async salvarFilaOffline(fila: AcaoOffline[]): Promise<void> {
    await gravar(CHAVE_FILA_SYNC, fila);
  },

  async salvarUltimaSincronizacao(dataHora: string): Promise<void> {
    await gravar(CHAVE_ULTIMA_SYNC, dataHora);
  },

  async limparTudo(): Promise<string> {
    const formatado = agoraFormatado();
    await Promise.all([
      gravar(CHAVE_TRECHOS, trechosIniciais),
      gravar(CHAVE_OCORRENCIAS, ocorrenciasIniciais),
      gravar(CHAVE_FILA_SYNC, []),
      gravar(CHAVE_ULTIMA_SYNC, formatado),
    ]);
    return formatado;
  },

  // Sincronização SIMULADA: não há backend real nesta versão acadêmica.
  // A latência de rede é emulada e a "Central CCR Motiva" é representada pelo próprio armazenamento local.
  async sincronizarComApiCentral(
    trechos: Trecho[],
    ocorrencias: Ocorrencia[],
    _fila: AcaoOffline[]
  ): Promise<{ ocorrenciasAtualizadas: Ocorrencia[]; horarioSync: string }> {
    await new Promise((resolve) => setTimeout(resolve, 650));

    const ocorrenciasAtualizadas = ocorrencias.map((oc) => ({ ...oc, sincronizado: true }));
    const horarioSync = agoraFormatado();

    await Promise.all([
      this.salvarTrechos(trechos),
      this.salvarOcorrencias(ocorrenciasAtualizadas),
      this.salvarFilaOffline([]),
      this.salvarUltimaSincronizacao(horarioSync),
    ]);

    return { ocorrenciasAtualizadas, horarioSync };
  },
};
