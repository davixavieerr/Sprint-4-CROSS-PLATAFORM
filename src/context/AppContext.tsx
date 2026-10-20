import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Trecho, Ocorrencia, trechosIniciais, ocorrenciasIniciais } from '../mock/dadosMock';
import { storageService, AcaoOffline } from '../services/storageService';

interface NovaOcorrenciaInput {
  trechoId: string;
  km: number;
  tipo: string;
  descricao: string;
  severidade: Trecho['status'];
  alturaEstimadaCm?: number;
  responsavel?: string;
  coordenadas?: Trecho['coordenadas'];
}

interface AppContextData {
  trechos: Trecho[];
  ocorrencias: Ocorrencia[];
  modoOffline: boolean;
  filaOffline: AcaoOffline[];
  sincronizando: boolean;
  ultimaSincronizacao: string;
  alternarModoOffline: () => void;
  sincronizarComCentral: () => Promise<void>;
  adicionarOcorrencia: (ocorrencia: NovaOcorrenciaInput) => void;
  registrarRocadaConcluida: (trechoId: string, responsavel?: string) => void;
  resolverOcorrencia: (ocorrenciaId: string) => void;
  obterTrechoPorId: (id: string) => Trecho | undefined;
  resetarDadosDemo: () => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hidratado, setHidratado] = useState<boolean>(false);
  const [trechos, setTrechos] = useState<Trecho[]>(trechosIniciais);
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(ocorrenciasIniciais);
  const [modoOffline, setModoOffline] = useState<boolean>(false);
  const [filaOffline, setFilaOffline] = useState<AcaoOffline[]>([]);
  const [sincronizando, setSincronizando] = useState<boolean>(false);
  const [ultimaSincronizacao, setUltimaSincronizacao] = useState<string>('');

  // Hidratação: carrega do disco (AsyncStorage) o estado salvo na última sessão
  useEffect(() => {
    let ativo = true;
    storageService.carregarEstadoInicial().then((estado) => {
      if (!ativo) return;
      setTrechos(estado.trechos);
      setOcorrencias(estado.ocorrencias);
      setFilaOffline(estado.filaOffline);
      setUltimaSincronizacao(estado.ultimaSincronizacao);
      setHidratado(true);
    });
    return () => {
      ativo = false;
    };
  }, []);

  const registrarAcaoNaFilaOuSync = (
    tipo: AcaoOffline['tipo'],
    payloadResumo: string,
    novosTrechos: Trecho[],
    novasOcorrencias: Ocorrencia[]
  ) => {
    storageService.salvarTrechos(novosTrechos);
    storageService.salvarOcorrencias(novasOcorrencias);

    if (modoOffline) {
      const novaAcao: AcaoOffline = {
        id: `SYNC-${Date.now()}`,
        tipo,
        payloadResumo,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      const filaAtualizada = [novaAcao, ...filaOffline];
      setFilaOffline(filaAtualizada);
      storageService.salvarFilaOffline(filaAtualizada);
    } else {
      const agora = new Date();
      const formatado = `${agora.toLocaleDateString('pt-BR')} às ${agora.toTimeString().slice(0, 5)}`;
      setUltimaSincronizacao(formatado);
      storageService.salvarUltimaSincronizacao(formatado);
    }
  };

  const alternarModoOffline = () => {
    setModoOffline((anterior) => !anterior);
  };

  const sincronizarComCentral = async () => {
    if (sincronizando) return;
    setSincronizando(true);
    try {
      const { ocorrenciasAtualizadas, horarioSync } =
        await storageService.sincronizarComApiCentral(trechos, ocorrencias, filaOffline);
      setOcorrencias(ocorrenciasAtualizadas);
      setFilaOffline([]);
      setUltimaSincronizacao(horarioSync);
      setModoOffline(false);
    } finally {
      setSincronizando(false);
    }
  };

  const adicionarOcorrencia = (nova: NovaOcorrenciaInput) => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const responsavelFinal = nova.responsavel?.trim() || 'Fiscal em Campo';

    const item: Ocorrencia = {
      id: `OC-${Date.now().toString().slice(-4)}`,
      trechoId: nova.trechoId,
      km: nova.km,
      tipo: nova.tipo,
      descricao: nova.descricao,
      data: dataAtual,
      severidade: nova.severidade,
      alturaEstimadaCm: nova.alturaEstimadaCm,
      responsavel: responsavelFinal,
      coordenadas: nova.coordenadas,
      statusOcorrencia: 'Aberta',
      sincronizado: !modoOffline,
    };

    const novasOcorrencias = [item, ...ocorrencias];
    setOcorrencias(novasOcorrencias);

    // Atualiza o trecho correspondente se a severidade ou altura reportada agravar o estado
    const pesoStatus: Record<Trecho['status'], number> = {
      normal: 1,
      atencao: 2,
      critico: 3,
    };

    const novosTrechos = trechos.map((t) => {
      if (t.id !== nova.trechoId) return t;

      const novoStatus =
        pesoStatus[nova.severidade] > pesoStatus[t.status] ? nova.severidade : t.status;
      const novaAltura =
        nova.alturaEstimadaCm && nova.alturaEstimadaCm > t.alturaVegetacao
          ? nova.alturaEstimadaCm
          : novoStatus === 'critico' && t.alturaVegetacao <= 30
            ? 32.0
            : t.alturaVegetacao;

      const novosDiasLimite =
        novoStatus === 'critico' || novaAltura >= 30
          ? 0
          : Math.max(1, Math.round((30 - novaAltura) / (t.taxaCrescimentoDia || 0.8)));

      return {
        ...t,
        status: novoStatus,
        alturaVegetacao: novaAltura,
        diasParaLimite: novosDiasLimite,
        ultimaInspecao: dataAtual,
        riscoMultaArtesp:
          novoStatus === 'critico' ? 48500 : novoStatus === 'atencao' ? 24250 : 0,
        historico: [
          {
            id: `H-${Date.now()}`,
            data: dataAtual,
            servico: `Vistoria: ${nova.tipo}`,
            alturaApos: novaAltura,
            responsavel: responsavelFinal,
          },
          ...t.historico,
        ],
      };
    });

    setTrechos(novosTrechos);
    registrarAcaoNaFilaOuSync(
      'NOVA_OCORRENCIA',
      `Ocorrência KM ${nova.km} (${nova.trechoId})`,
      novosTrechos,
      novasOcorrencias
    );
  };

  const registrarRocadaConcluida = (trechoId: string, responsavel = 'Equipe Operacional Motiva') => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    const novosTrechos = trechos.map((t) => {
      if (t.id === trechoId) {
        return {
          ...t,
          alturaVegetacao: 5.0,
          status: 'normal' as const,
          diasParaLimite: 30,
          riscoMultaArtesp: 0,
          ultimaInspecao: dataAtual,
          historico: [
            {
              id: `H-${Date.now()}`,
              data: dataAtual,
              servico: 'Roçada Concluída (Baixa em Campo)',
              alturaApos: 5.0,
              responsavel,
            },
            ...t.historico,
          ],
        };
      }
      return t;
    });

    // Resolve automaticamente as ocorrências abertas vinculadas ao trecho roçado
    const novasOcorrencias = ocorrencias.map((oc) =>
      oc.trechoId === trechoId && oc.statusOcorrencia === 'Aberta'
        ? { ...oc, statusOcorrencia: 'Resolvida' as const, sincronizado: !modoOffline }
        : oc
    );

    setTrechos(novosTrechos);
    setOcorrencias(novasOcorrencias);
    registrarAcaoNaFilaOuSync(
      'BAIXA_ROCADA',
      `Baixa de roçada no trecho ${trechoId}`,
      novosTrechos,
      novasOcorrencias
    );
  };

  const resolverOcorrencia = (ocorrenciaId: string) => {
    const novasOcorrencias = ocorrencias.map((oc) =>
      oc.id === ocorrenciaId
        ? { ...oc, statusOcorrencia: 'Resolvida' as const, sincronizado: !modoOffline }
        : oc
    );
    setOcorrencias(novasOcorrencias);
    registrarAcaoNaFilaOuSync(
      'RESOLVER_OCORRENCIA',
      `Ocorrência ${ocorrenciaId} resolvida`,
      trechos,
      novasOcorrencias
    );
  };

  const obterTrechoPorId = (id: string) => {
    return trechos.find((t) => t.id === id);
  };

  const resetarDadosDemo = () => {
    setTrechos(trechosIniciais);
    setOcorrencias(ocorrenciasIniciais);
    setFilaOffline([]);
    setModoOffline(false);
    storageService.limparTudo().then((formatado) => setUltimaSincronizacao(formatado));
  };

  if (!hidratado) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B1F3A' }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <AppContext.Provider
      value={{
        trechos,
        ocorrencias,
        modoOffline,
        filaOffline,
        sincronizando,
        ultimaSincronizacao,
        alternarModoOffline,
        sincronizarComCentral,
        adicionarOcorrencia,
        registrarRocadaConcluida,
        resolverOcorrencia,
        obterTrechoPorId,
        resetarDadosDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);