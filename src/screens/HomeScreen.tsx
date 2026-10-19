import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Trecho, NivelCriticidade } from '../mock/dadosMock';
import { cores } from '../theme/cores';

type Filtro = 'todos' | NivelCriticidade;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    trechos,
    ocorrencias,
    modoOffline,
    filaOffline,
    sincronizando,
    ultimaSincronizacao,
    alternarModoOffline,
    sincronizarComCentral,
  } = useApp();

  const [busca, setBusca] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState<Filtro>('todos');

  // KPIs em tempo real da malha SP-021
  const totalCriticos = trechos.filter((t) => t.status === 'critico').length;
  const totalConformes = trechos.filter((t) => t.status !== 'critico').length;
  const taxaConformidade = Math.round((totalConformes / Math.max(1, trechos.length)) * 100);
  const ocorrenciasAbertas = ocorrencias.filter((o) => o.statusOcorrencia === 'Aberta').length;

  const trechosFiltrados = trechos.filter((t) => {
    const matchFiltro = filtroAtivo === 'todos' ? true : t.status === filtroAtivo;
    const matchBusca =
      busca.trim() === '' ||
      t.rodovia.toLowerCase().includes(busca.toLowerCase()) ||
      t.sentido.toLowerCase().includes(busca.toLowerCase()) ||
      t.kmInicial.toString().includes(busca) ||
      t.kmFinal.toString().includes(busca) ||
      `km ${t.kmInicial}`.toLowerCase().includes(busca.toLowerCase());
    return matchFiltro && matchBusca;
  });

  const getBadgeStyle = (status: NivelCriticidade) => {
    switch (status) {
      case 'critico':
        return {
          bg: cores.status.critico.fundo,
          text: cores.status.critico.texto,
          borda: cores.status.critico.borda,
          label: 'CRÍTICO (>30cm)',
        };
      case 'atencao':
        return {
          bg: cores.status.atencao.fundo,
          text: cores.status.atencao.texto,
          borda: cores.status.atencao.borda,
          label: 'ATENÇÃO (10-30cm)',
        };
      default:
        return {
          bg: cores.status.normal.fundo,
          text: cores.status.normal.texto,
          borda: cores.status.normal.borda,
          label: 'NORMAL (<10cm)',
        };
    }
  };

  const renderCard = ({ item }: { item: Trecho }) => {
    const badge = getBadgeStyle(item.status);
    const ocorrenciasDoTrecho = ocorrencias.filter(
      (oc) => oc.trechoId === item.id && oc.statusOcorrencia === 'Aberta'
    ).length;

    return (
      <TouchableOpacity
        style={[styles.card, item.status === 'critico' && styles.cardCriticoBorda]}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('DetalhesTrecho', { trechoId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitulo}>{item.rodovia}</Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeTexto, { color: badge.text }]}>{badge.label}</Text>
          </View>
        </View>

        <View style={styles.subtituloRow}>
          <Text style={styles.cardSubtitulo}>
            KM {item.kmInicial.toFixed(1)} ao {item.kmFinal.toFixed(1)} • {item.sentido}
          </Text>
          {ocorrenciasDoTrecho > 0 && (
            <View style={styles.ocorrenciaTag}>
              <Text style={styles.ocorrenciaTagTexto}>
                ⚠️ {ocorrenciasDoTrecho} {ocorrenciasDoTrecho === 1 ? 'ocorrência' : 'ocorrências'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.metricasContainer}>
          <View style={styles.metricaItem}>
            <Text style={styles.metricaRotulo}>Altura Vegetação</Text>
            <Text style={[styles.metricaValor, { color: badge.text }]}>
              {item.alturaVegetacao.toFixed(1)} cm
            </Text>
          </View>

          <View style={styles.metricaItem}>
            <Text style={styles.metricaRotulo}>Ritmo IA / Dia</Text>
            <Text style={styles.metricaValor}>+{item.taxaCrescimentoDia.toFixed(2)} cm</Text>
          </View>

          <View style={styles.metricaItem}>
            <Text style={styles.metricaRotulo}>Previsão Limite</Text>
            <Text
              style={[
                styles.metricaValor,
                item.diasParaLimite === 0 && { color: cores.status.critico.texto },
              ]}
            >
              {item.diasParaLimite === 0 ? 'Excedido' : `${item.diasParaLimite} dias`}
            </Text>
          </View>

          <View style={styles.metricaItem}>
            <Text style={styles.metricaRotulo}>Inspeção</Text>
            <Text style={styles.metricaValor}>{item.ultimaInspecao.slice(0, 5)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={cores.fundo} />

      {/* Header com Logo e Ações Principais */}
      <View style={styles.header}>
        <View style={styles.headerMarca}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.headerTitulo}>ROÇA.AI Viário</Text>
            <Text style={styles.headerSubtitulo}>CCR Motiva • SP-021 (Rodoanel)</Text>
          </View>
        </View>

        <View style={styles.headerBotoes}>
          <TouchableOpacity
            style={styles.btnExecutivo}
            onPress={() => navigation.navigate('PainelExecutivo')}
          >
            <Text style={styles.btnExecutivoTexto}>📊 ROI & SLA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnNovaOcorrencia}
            onPress={() => navigation.navigate('NovaOcorrencia')}
          >
            <Text style={styles.btnNovaOcorrenciaTexto}>+ Ocorrência</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra Offline-First e Sincronização com Central CCR */}
      <View style={[styles.syncBar, modoOffline && styles.syncBarOffline]}>
        <TouchableOpacity style={styles.syncStatusBtn} onPress={alternarModoOffline}>
          <Text style={styles.syncStatusTexto}>
            {modoOffline
              ? `🟠 Modo Campo Offline (${filaOffline.length} na fila)`
              : `🟢 Online • Sync: ${ultimaSincronizacao}`}
          </Text>
          <Text style={styles.syncAlternarDica}>
            {modoOffline ? 'Toque p/ conectar' : 'Simular Offline'}
          </Text>
        </TouchableOpacity>

        {(modoOffline || filaOffline.length > 0) && (
          <TouchableOpacity
            style={styles.btnSincronizarAgora}
            onPress={sincronizarComCentral}
            disabled={sincronizando}
          >
            {sincronizando ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.btnSincronizarTexto}>🔄 Sincronizar</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Cards de Resumo Operacional (KPIs Rápidos) */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValor}>{taxaConformidade}%</Text>
          <Text style={styles.kpiLabel}>SLA ARTESP</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={[styles.kpiValor, totalCriticos > 0 && { color: cores.status.critico.texto }]}>
            {totalCriticos}
          </Text>
          <Text style={styles.kpiLabel}>Trechos Críticos</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={[styles.kpiValor, { color: '#B45309' }]}>{ocorrenciasAbertas}</Text>
          <Text style={styles.kpiLabel}>Ocorrências</Text>
        </View>
      </View>

      {/* Barra de Busca */}
      <View style={styles.buscaContainer}>
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar por KM, sentido ou rodovia (ex: 14)"
          placeholderTextColor={cores.texto.secundario}
          value={busca}
          onChangeText={setBusca}
        />
        {busca !== '' && (
          <TouchableOpacity onPress={() => setBusca('')} style={styles.btnLimparBusca}>
            <Text style={styles.btnLimparTexto}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Chips de Filtro */}
      <View style={styles.filtrosContainer}>
        {(['todos', 'critico', 'atencao', 'normal'] as Filtro[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chipFiltro, filtroAtivo === f && styles.chipFiltroAtivo]}
            onPress={() => setFiltroAtivo(f)}
          >
            <Text style={[styles.chipTexto, filtroAtivo === f && styles.chipTextoAtivo]}>
              {f === 'todos'
                ? `Todos (${trechos.length})`
                : f === 'critico'
                ? 'Críticos'
                : f === 'atencao'
                ? 'Atenção'
                : 'Normais'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Listagem com Empty State */}
      <FlatList
        data={trechosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listaConteudo}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcone}>🔍</Text>
            <Text style={styles.emptyTitulo}>Nenhum trecho encontrado</Text>
            <Text style={styles.emptyDescricao}>
              Não foram localizados trechos para os filtros e busca aplicados.
            </Text>
            <TouchableOpacity
              style={styles.btnResetarFiltros}
              onPress={() => {
                setBusca('');
                setFiltroAtivo('todos');
              }}
            >
              <Text style={styles.btnResetarTexto}>Limpar Filtros</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderBottomWidth: 1,
    borderColor: cores.borda,
  },
  headerMarca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  headerTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: cores.primaria,
  },
  headerSubtitulo: {
    fontSize: 11,
    color: cores.texto.secundario,
  },
  headerBotoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnExecutivo: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: cores.primaria,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnExecutivoTexto: {
    color: cores.primaria,
    fontWeight: 'bold',
    fontSize: 12,
  },
  btnNovaOcorrencia: {
    backgroundColor: cores.primaria,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnNovaOcorrenciaTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  syncBar: {
    backgroundColor: '#ECFDF5',
    borderBottomWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  syncBarOffline: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  syncStatusBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 8,
  },
  syncStatusTexto: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
  },
  syncAlternarDica: {
    fontSize: 10,
    color: cores.texto.secundario,
    textDecorationLine: 'underline',
  },
  btnSincronizarAgora: {
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnSincronizarTexto: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  kpiRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: cores.superficie,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: 'center',
  },
  kpiValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.primaria,
  },
  kpiLabel: {
    fontSize: 10,
    color: cores.texto.secundario,
    marginTop: 2,
  },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: cores.superficie,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.borda,
    paddingHorizontal: 12,
  },
  buscaInput: {
    flex: 1,
    height: 40,
    color: cores.texto.primario,
    fontSize: 13,
  },
  btnLimparBusca: {
    padding: 4,
  },
  btnLimparTexto: {
    fontSize: 14,
    color: cores.texto.secundario,
  },
  filtrosContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chipFiltro: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  chipFiltroAtivo: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  chipTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: cores.texto.secundario,
  },
  chipTextoAtivo: {
    color: '#FFFFFF',
  },
  listaConteudo: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: cores.superficie,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardCriticoBorda: {
    borderLeftWidth: 4,
    borderLeftColor: cores.status.critico.borda,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: cores.texto.primario,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeTexto: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  subtituloRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardSubtitulo: {
    fontSize: 12,
    color: cores.texto.secundario,
  },
  ocorrenciaTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ocorrenciaTagTexto: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400E',
  },
  metricasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: cores.borda,
  },
  metricaItem: {
    alignItems: 'center',
  },
  metricaRotulo: {
    fontSize: 10,
    color: cores.texto.secundario,
  },
  metricaValor: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
    color: cores.texto.primario,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIcone: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto.primario,
  },
  emptyDescricao: {
    fontSize: 13,
    color: cores.texto.secundario,
    textAlign: 'center',
    marginTop: 6,
  },
  btnResetarFiltros: {
    marginTop: 16,
    backgroundColor: cores.primaria,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnResetarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});