import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { cores } from '../theme/cores';

export const DetalhesTrechoScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { trechoId } = route.params || {};
  const { trechos, ocorrencias, registrarRocadaConcluida, resolverOcorrencia } = useApp();

  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  const trecho = trechos.find((t) => t.id === trechoId);
  const ocorrenciasTrecho = ocorrencias.filter((oc) => oc.trechoId === trechoId);

  if (!trecho) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.erroTexto}>Trecho não localizado.</Text>
      </SafeAreaView>
    );
  }

  const handleConcluirRocada = () => {
    registrarRocadaConcluida(trecho.id, 'Equipe de Campo CCR Motiva');
    setMensagemSucesso(true);
  };

  const isCritico = trecho.status === 'critico';
  const isAtencao = trecho.status === 'atencao';
  const isConforme = trecho.status === 'normal';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollConteudo}>
        {/* Banner de Sucesso Imediato */}
        {mensagemSucesso && (
          <View style={styles.sucessoBanner}>
            <Text style={styles.sucessoBannerTitulo}>🎉 Baixa Operacional Sincronizada!</Text>
            <Text style={styles.sucessoBannerTexto}>
              A vegetação foi reduzida para 5.0 cm, o risco de autuação ARTESP foi zerado e as ocorrências abertas deste trecho foram encerradas.
            </Text>
          </View>
        )}

        {/* Card Regulatório ARTESP */}
        <View
          style={[
            styles.alertaCard,
            isCritico && styles.alertaCritico,
            isAtencao && styles.alertaAtencao,
            isConforme && styles.alertaNormal,
          ]}
        >
          <Text style={styles.alertaTitulo}>
            {isCritico
              ? '⚠️ RISCO REGULATÓRIO ARTESP (> 30 cm)'
              : isAtencao
              ? '⚡ PONTO DE ATENÇÃO PREDITIVO (10 a 30 cm)'
              : '✅ EM CONFORMIDADE CONTRATUAL (< 10 cm)'}
          </Text>
          <Text style={styles.alertaDescricao}>
            {isCritico
              ? `Vegetação acima de 30 cm sujeita a penalidade contratual estimada em R$ ${trecho.riscoMultaArtesp.toLocaleString('pt-BR')}. Despacho imediato requerido.`
              : isAtencao
              ? `Crescimento de +${trecho.taxaCrescimentoDia.toFixed(2)} cm/dia. Projeção preditiva de atingir o limite de 30 cm em ${trecho.diasParaLimite} dias.`
              : 'Trecho dentro dos padrões de segurança viária e visibilidade exigidos pela ARTESP e CCR Motiva.'}
          </Text>
        </View>

        {/* Informações Gerais e Georreferenciamento */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Identificação e Georreferenciamento</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Código Operacional:</Text>
            <Text style={styles.infoValor}>{trecho.id} • {trecho.rodovia}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Extensão Quilométrica:</Text>
            <Text style={styles.infoValor}>
              KM {trecho.kmInicial.toFixed(1)} ao KM {trecho.kmFinal.toFixed(1)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sentido / Pista:</Text>
            <Text style={styles.infoValor}>{trecho.sentido}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Coordenadas GPS (Marco):</Text>
            <Text style={styles.infoValor}>
              {trecho.coordenadas.latitude.toFixed(4)}, {trecho.coordenadas.longitude.toFixed(4)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Última Vistoria:</Text>
            <Text style={styles.infoValor}>{trecho.ultimaInspecao}</Text>
          </View>
        </View>

        {/* Telemetria e Predição IA */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Telemetria Preditiva da Vegetação</Text>
          <View style={styles.metricasBox}>
            <View style={styles.metricaBloco}>
              <Text
                style={[
                  styles.metricaNumero,
                  isCritico && { color: cores.status.critico.texto },
                  isConforme && { color: cores.status.normal.texto },
                ]}
              >
                {trecho.alturaVegetacao.toFixed(1)} cm
              </Text>
              <Text style={styles.metricaSub}>Altura Atual</Text>
            </View>
            <View style={styles.metricaBloco}>
              <Text style={styles.metricaNumero}>+{trecho.taxaCrescimentoDia.toFixed(2)}</Text>
              <Text style={styles.metricaSub}>Taxa (cm/dia)</Text>
            </View>
            <View style={styles.metricaBloco}>
              <Text
                style={[
                  styles.metricaNumero,
                  trecho.diasParaLimite === 0 && { color: cores.status.critico.texto },
                ]}
              >
                {trecho.diasParaLimite === 0 ? 'Excedido' : `${trecho.diasParaLimite} d`}
              </Text>
              <Text style={styles.metricaSub}>Janela até 30cm</Text>
            </View>
          </View>
        </View>

        {/* Botões de Ação em Campo */}
        <View style={styles.acoesContainer}>
          {isConforme ? (
            <View style={styles.btnDesabilitado}>
              <Text style={styles.btnDesabilitadoTexto}>{'✅ Trecho Regularizado (< 10 cm)'}</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.btnConcluir}
              activeOpacity={0.8}
              onPress={handleConcluirRocada}
            >
              <Text style={styles.btnConcluirTexto}>✂️ Registrar Roçada Concluída</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.btnNovaOcorrenciaTrecho}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('NovaOcorrencia', { trechoIdPreSelecionado: trecho.id })
            }
          >
            <Text style={styles.btnNovaOcorrenciaTrechoTexto}>
              📍 Registrar Nova Ocorrência neste Trecho
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ocorrências Registradas no Trecho */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>
            Ocorrências de Campo no Trecho ({ocorrenciasTrecho.length})
          </Text>
          {ocorrenciasTrecho.length === 0 ? (
            <Text style={styles.historicoVazio}>
              Nenhuma ocorrência registrada para este segmento.
            </Text>
          ) : (
            ocorrenciasTrecho.map((oc) => (
              <View key={oc.id} style={styles.ocorrenciaItem}>
                <View style={styles.historicoHeader}>
                  <Text style={styles.historicoServico}>
                    KM {oc.km.toFixed(1)} • {oc.tipo}
                  </Text>
                  <View
                    style={[
                      styles.statusPill,
                      oc.statusOcorrencia === 'Aberta'
                        ? styles.statusPillAberta
                        : styles.statusPillResolvida,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillTexto,
                        oc.statusOcorrencia === 'Aberta'
                          ? { color: '#991B1B' }
                          : { color: '#065F46' },
                      ]}
                    >
                      {oc.statusOcorrencia}
                    </Text>
                  </View>
                </View>
                <Text style={styles.ocorrenciaDesc}>{oc.descricao}</Text>
                <Text style={styles.historicoDetalhe}>
                  {oc.data} • {oc.responsavel}
                  {oc.coordenadas
                    ? ` • GPS (${oc.coordenadas.latitude.toFixed(4)}, ${oc.coordenadas.longitude.toFixed(4)})`
                    : ''}
                  {oc.sincronizado ? ' • ☁️ Sincronizado' : ' • 💾 Salvo Offline'}
                </Text>

                {oc.statusOcorrencia === 'Aberta' && (
                  <TouchableOpacity
                    style={styles.btnResolverOc}
                    onPress={() => resolverOcorrencia(oc.id)}
                  >
                    <Text style={styles.btnResolverOcTexto}>✓ Dar Baixa na Ocorrência</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>

        {/* Histórico de Intervenções */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Histórico Auditável de Intervenções</Text>
          {trecho.historico.length === 0 ? (
            <Text style={styles.historicoVazio}>Nenhuma intervenção registrada recentemente.</Text>
          ) : (
            trecho.historico.map((h) => (
              <View key={h.id} style={styles.historicoItem}>
                <View style={styles.historicoHeader}>
                  <Text style={styles.historicoServico}>{h.servico}</Text>
                  <Text style={styles.historicoData}>{h.data}</Text>
                </View>
                <Text style={styles.historicoDetalhe}>
                  Responsável: {h.responsavel} • Altura aferida: {h.alturaApos.toFixed(1)} cm
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Botão para Retornar ao Painel */}
        <TouchableOpacity
          style={styles.btnVoltar}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.btnVoltarTexto}>← Voltar ao Painel Geral</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetalhesTrechoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  scrollConteudo: { padding: 16, gap: 14, paddingBottom: 32 },
  erroTexto: { textAlign: 'center', marginTop: 40, color: cores.texto.secundario },

  sucessoBanner: {
    backgroundColor: '#DEF7EC',
    borderColor: '#31C48D',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 14,
  },
  sucessoBannerTitulo: { fontSize: 14, fontWeight: 'bold', color: '#03543F' },
  sucessoBannerTexto: { fontSize: 12, color: '#046C4E', marginTop: 4, lineHeight: 17 },

  alertaCard: { padding: 14, borderRadius: 10, borderWidth: 1 },
  alertaCritico: {
    backgroundColor: cores.status.critico.fundo,
    borderColor: cores.status.critico.borda,
  },
  alertaAtencao: {
    backgroundColor: cores.status.atencao.fundo,
    borderColor: cores.status.atencao.borda,
  },
  alertaNormal: {
    backgroundColor: cores.status.normal.fundo,
    borderColor: cores.status.normal.borda,
  },
  alertaTitulo: { fontSize: 13, fontWeight: 'bold', marginBottom: 4, color: cores.texto.primario },
  alertaDescricao: { fontSize: 12, color: cores.texto.primario, lineHeight: 17 },
  secao: {
    backgroundColor: cores.superficie,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: cores.texto.primario,
    marginBottom: 12,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  infoLabel: { fontSize: 12, color: cores.texto.secundario },
  infoValor: { fontSize: 12, fontWeight: '600', color: cores.texto.primario },
  metricasBox: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 6 },
  metricaBloco: { alignItems: 'center' },
  metricaNumero: { fontSize: 20, fontWeight: 'bold', color: cores.primaria },
  metricaSub: { fontSize: 11, color: cores.texto.secundario, marginTop: 2 },

  acoesContainer: { gap: 10 },
  btnConcluir: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnConcluirTexto: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  btnNovaOcorrenciaTrecho: {
    backgroundColor: cores.primaria,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnNovaOcorrenciaTrechoTexto: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },

  btnDesabilitado: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnDesabilitadoTexto: { color: '#065F46', fontWeight: 'bold', fontSize: 14 },

  btnVoltar: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnVoltarTexto: { color: cores.primaria, fontWeight: '600', fontSize: 13 },

  historicoVazio: { fontSize: 12, color: cores.texto.secundario, fontStyle: 'italic' },
  ocorrenciaItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: cores.borda,
    gap: 4,
  },
  ocorrenciaDesc: {
    fontSize: 12,
    color: cores.texto.primario,
    lineHeight: 16,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusPillAberta: {
    backgroundColor: '#FEE2E2',
  },
  statusPillResolvida: {
    backgroundColor: '#D1FAE5',
  },
  statusPillTexto: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  btnResolverOc: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: cores.primaria,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnResolverOcTexto: {
    fontSize: 11,
    fontWeight: 'bold',
    color: cores.primaria,
  },
  historicoItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: cores.borda,
  },
  historicoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historicoServico: { fontSize: 13, fontWeight: 'bold', color: cores.texto.primario, flex: 1 },
  historicoData: { fontSize: 11, color: cores.texto.secundario },
  historicoDetalhe: { fontSize: 11, color: cores.texto.secundario, marginTop: 2 },
});