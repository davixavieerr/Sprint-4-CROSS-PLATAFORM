import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { cores } from '../theme/cores';

export const PainelExecutivoScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { trechos, ocorrencias, resetarDadosDemo } = useApp();
  const [resetConfirmado, setResetConfirmado] = useState(false);

  const totalTrechos = trechos.length;
  const trechosCriticos = trechos.filter((t) => t.status === 'critico').length;
  const trechosAtencao = trechos.filter((t) => t.status === 'atencao').length;
  const trechosNormais = trechos.filter((t) => t.status === 'normal').length;

  const conformidadePct = Math.round(
    ((totalTrechos - trechosCriticos) / Math.max(1, totalTrechos)) * 100
  );

  // Risco financeiro atual vs multas evitadas
  const exposicaoMultaAtual = trechos
    .filter((t) => t.status === 'critico')
    .reduce((acc, t) => acc + t.riscoMultaArtesp, 0);

  const multasEvitadasMes = trechosNormais * 48500;
  const ocorrenciasResolvidas = ocorrencias.filter(
    (o) => o.statusOcorrencia === 'Resolvida'
  ).length;

  const handleResetDemo = () => {
    resetarDadosDemo();
    setResetConfirmado(true);
    setTimeout(() => setResetConfirmado(false), 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollConteudo}>
        <View style={styles.bannerTopo}>
          <Text style={styles.bannerTitulo}>Visão Executiva • CCR Motiva</Text>
          <Text style={styles.bannerSubtitulo}>
            Governança Regulatória ARTESP, Eficiência Operacional e Viabilidade Comercial (SP-021)
          </Text>
        </View>

        {resetConfirmado && (
          <View style={styles.resetBanner}>
            <Text style={styles.resetBannerTexto}>
              ✅ Dados de demonstração restaurados para o cenário padrão da Sprint 4!
            </Text>
          </View>
        )}

        {/* Indicadores de Impacto em Tempo Real */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>1. Indicadores de Conformidade & Risco (Tempo Real)</Text>
          <View style={styles.gridMetricas}>
            <View style={styles.cardMetrica}>
              <Text style={styles.metricaValor}>{conformidadePct}%</Text>
              <Text style={styles.metricaLabel}>Índice de Conformidade SLA</Text>
            </View>
            <View style={styles.cardMetrica}>
              <Text
                style={[
                  styles.metricaValor,
                  exposicaoMultaAtual > 0 ? { color: '#991B1B' } : { color: '#065F46' },
                ]}
              >
                R$ {(exposicaoMultaAtual / 1000).toFixed(1)}k
              </Text>
              <Text style={styles.metricaLabel}>Exposição Atual a Multas</Text>
            </View>
            <View style={styles.cardMetrica}>
              <Text style={[styles.metricaValor, { color: '#059669' }]}>
                R$ {(multasEvitadasMes / 1000).toFixed(0)}k
              </Text>
              <Text style={styles.metricaLabel}>Penalidades Mitigadas</Text>
            </View>
            <View style={styles.cardMetrica}>
              <Text style={styles.metricaValor}>
                {trechosNormais}/{totalTrechos}
              </Text>
              <Text style={styles.metricaLabel}>Trechos &lt; 10cm ({ocorrenciasResolvidas} baixas)</Text>
            </View>
          </View>
        </View>

        {/* Síntese do Plano de Negócio para a Motiva */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>2. Modelo de Negócio & Viabilidade (B2B Concessionárias)</Text>

          <View style={styles.itemPlano}>
            <Text style={styles.itemPlanoTitulo}>🎯 Proposta de Valor</Text>
            <Text style={styles.itemPlanoTexto}>
              Substituição do modelo reativo de roçada (cronograma fixo e planilhas) por despacho preditivo baseado em taxa de crescimento vegetativo, geolocalização offline-first e rastro auditável para fiscalização ARTESP/ANTT.
            </Text>
          </View>

          <View style={styles.itemPlano}>
            <Text style={styles.itemPlanoTitulo}>💰 Modelo de Receita (SaaS por KM Concessionado)</Text>
            <Text style={styles.itemPlanoTexto}>
              • Assinatura SaaS Enterprise: R$ 85,00 / km / mês (R$ 15.045/mês para os 177 km do Rodoanel SP-021).{'\n'}
              • Setup & Integração GIS/ERP (SAP/Maximo): R$ 45.000 (pagamento único).{'\n'}
              • Expansão para toda a malha Motiva (~4.475 km): ARR potencial de R$ 4,56 milhões/ano.
            </Text>
          </View>

          <View style={styles.itemPlano}>
            <Text style={styles.itemPlanoTitulo}>📉 Custos Operacionais & Margem</Text>
            <Text style={styles.itemPlanoTexto}>
              • Custo mensal por concessão (Cloud AWS, PostGIS, API Satélite Sentinel-2/NDVI e Suporte N2): ~R$ 4.200/mês.{'\n'}
              • Margem Bruta SaaS estimada: 72% (Payback para a concessionária no 1º mês ao evitar uma única autuação grave).
            </Text>
          </View>

          <View style={styles.itemPlano}>
            <Text style={styles.itemPlanoTitulo}>🚀 Impacto Esperado para a Motiva</Text>
            <Text style={styles.itemPlanoTexto}>
              • Redução de até 85% nas notificações e multas contratuais por vegetação alta (&gt;30 cm) ou placas encobertas.{'\n'}
              • Economia de 25% no custo de combustível e deslocamento de equipes de conservação (foco nos trechos críticos e em atenção: {trechosCriticos + trechosAtencao} ativos agora).
            </Text>
          </View>
        </View>

        {/* Utilitário de Demonstração */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>3. Controle de Ambiente de Demonstração</Text>
          <Text style={styles.itemPlanoTexto}>
            Caso tenha realizado baixas de roçada ou criado ocorrências durante o teste/pitch, você pode restaurar a base para o estado original de apresentação:
          </Text>
          <TouchableOpacity style={styles.btnReset} onPress={handleResetDemo}>
            <Text style={styles.btnResetTexto}>🔄 Restaurar Dados Iniciais da Demonstração</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.btnVoltar}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.btnVoltarTexto}>← Voltar ao Painel Operacional SP-021</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PainelExecutivoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  scrollConteudo: { padding: 16, gap: 14, paddingBottom: 32 },
  bannerTopo: {
    backgroundColor: cores.primaria,
    borderRadius: 12,
    padding: 16,
  },
  bannerTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bannerSubtitulo: {
    fontSize: 12,
    color: '#DBEAFE',
    marginTop: 4,
    lineHeight: 17,
  },
  resetBanner: {
    backgroundColor: '#DEF7EC',
    borderColor: '#31C48D',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
  },
  resetBannerTexto: {
    color: '#03543F',
    fontSize: 12,
    fontWeight: 'bold',
  },
  secao: {
    backgroundColor: cores.superficie,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    gap: 10,
  },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: cores.texto.primario,
  },
  gridMetricas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cardMetrica: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  metricaValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cores.primaria,
  },
  metricaLabel: {
    fontSize: 11,
    color: cores.texto.secundario,
    textAlign: 'center',
    marginTop: 4,
  },
  itemPlano: {
    borderTopWidth: 1,
    borderColor: cores.borda,
    paddingTop: 10,
    gap: 4,
  },
  itemPlanoTitulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: cores.primaria,
  },
  itemPlanoTexto: {
    fontSize: 12,
    color: cores.texto.primario,
    lineHeight: 18,
  },
  btnReset: {
    marginTop: 6,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnResetTexto: {
    color: '#92400E',
    fontWeight: 'bold',
    fontSize: 12,
  },
  btnVoltar: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnVoltarTexto: {
    color: cores.primaria,
    fontWeight: '600',
    fontSize: 13,
  },
});
