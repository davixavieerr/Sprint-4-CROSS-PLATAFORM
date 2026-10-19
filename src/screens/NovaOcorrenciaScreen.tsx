import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useApp } from '../context/AppContext';
import { NivelCriticidade, CoordenadasGPS } from '../mock/dadosMock';
import { cores } from '../theme/cores';

export const NovaOcorrenciaScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { trechos, adicionarOcorrencia, modoOffline } = useApp();

  const trechoPreSelecionado = route.params?.trechoIdPreSelecionado;
  const trechoInicial =
    trechos.find((t) => t.id === trechoPreSelecionado) || trechos[0];

  const [trechoId, setTrechoId] = useState(trechoInicial?.id || '');
  const [km, setKm] = useState(
    trechoPreSelecionado && trechoInicial ? trechoInicial.kmInicial.toFixed(1) : ''
  );
  const [alturaEstimada, setAlturaEstimada] = useState('');
  const [responsavel, setResponsavel] = useState('Fiscal em Campo (CCR Motiva)');
  const [tipo, setTipo] = useState('Obstrução de Sinalização (>30cm)');
  const [descricao, setDescricao] = useState('');
  const [severidade, setSeveridade] = useState<NivelCriticidade>('critico');

  // Geolocalização via expo-location
  const [coordenadas, setCoordenadas] = useState<CoordenadasGPS | undefined>(undefined);
  const [capturandoGps, setCapturandoGps] = useState(false);
  const [statusGps, setStatusGps] = useState('');

  // Estados de erro para validação
  const [erroKm, setErroKm] = useState('');
  const [erroDescricao, setErroDescricao] = useState('');

  const trechoSelecionadoObj = trechos.find((t) => t.id === trechoId);

  const tiposDisponiveis = [
    'Obstrução de Sinalização (>30cm)',
    'Vegetação Invadindo Acostamento',
    'Crescimento Acelerado em Talude',
    'Acúmulo de Resíduos na Faixa',
  ];

  const handleCapturarGps = async () => {
    setCapturandoGps(true);
    setStatusGps('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setCoordenadas({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          precisaoMetros: Math.round(pos.coords.accuracy || 5),
        });
        setStatusGps('Coordenadas GPS nativas capturadas com sucesso.');
      } else {
        // Fallback para marco georreferenciado da SP-021 caso permissão negada no emulador/web
        const fallback = trechoSelecionadoObj?.coordenadas || {
          latitude: -23.5284,
          longitude: -46.7912,
          precisaoMetros: 5,
        };
        setCoordenadas(fallback);
        setStatusGps('GPS simulado pelo marco georreferenciado da SP-021.');
      }
    } catch {
      const fallback = trechoSelecionadoObj?.coordenadas || {
        latitude: -23.5284,
        longitude: -46.7912,
        precisaoMetros: 5,
      };
      setCoordenadas(fallback);
      setStatusGps('Coordenada associada ao marco quilométrico da SP-021.');
    } finally {
      setCapturandoGps(false);
    }
  };

  const handleSalvar = () => {
    let temErro = false;

    const kmNumerico = Number(km.replace(',', '.'));
    if (!km.trim() || isNaN(kmNumerico) || kmNumerico <= 0) {
      setErroKm('Informe um quilômetro válido (ex: 13.5)');
      temErro = true;
    } else {
      setErroKm('');
    }

    if (descricao.trim().length < 5) {
      setErroDescricao('A descrição deve ter no mínimo 5 caracteres.');
      temErro = true;
    } else {
      setErroDescricao('');
    }

    if (temErro) {
      return;
    }

    const alturaNum = alturaEstimada.trim()
      ? Number(alturaEstimada.replace(',', '.'))
      : undefined;

    adicionarOcorrencia({
      trechoId,
      km: kmNumerico,
      tipo,
      descricao: descricao.trim(),
      severidade,
      alturaEstimadaCm: alturaNum && !isNaN(alturaNum) ? alturaNum : undefined,
      responsavel: responsavel.trim() || 'Fiscal em Campo',
      coordenadas: coordenadas || trechoSelecionadoObj?.coordenadas,
    });

    const msgConfirmacao = modoOffline
      ? 'Ocorrência armazenada no banco local (Fila Offline) e pronta para sincronização automática.'
      : 'Evidência georreferenciada e sincronizada em tempo real com a malha da SP-021.';

    if (Platform.OS === 'web') {
      (globalThis as any).alert(`Ocorrência Registrada com Sucesso!\n${msgConfirmacao}`);
      navigation.goBack();
      return;
    }

    Alert.alert('Ocorrência Registrada', msgConfirmacao, [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollConteudo}>
        <Text style={styles.titulo}>Registro de Vistoria em Campo</Text>
        <Text style={styles.subtitulo}>
          Preencha as evidências georreferenciadas para despacho da equipe de conservação.
        </Text>

        {/* Seleção do Trecho */}
        <View style={styles.campoGrupo}>
          <Text style={styles.rotulo}>Trecho da SP-021</Text>
          <View style={styles.opcoesContainer}>
            {trechos.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.opcaoBtn, trechoId === t.id && styles.opcaoBtnAtivo]}
                onPress={() => {
                  setTrechoId(t.id);
                  if (!km.trim()) setKm(t.kmInicial.toFixed(1));
                }}
              >
                <Text style={[styles.opcaoTexto, trechoId === t.id && styles.opcaoTextoAtivo]}>
                  KM {t.kmInicial} - {t.kmFinal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Captura de GPS Nativo (expo-location) */}
        <View style={styles.gpsBox}>
          <View style={styles.gpsHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.gpsTitulo}>Geolocalização do Ponto (GPS)</Text>
              <Text style={styles.gpsSubtitulo}>
                {coordenadas
                  ? `Lat: ${coordenadas.latitude.toFixed(5)} | Long: ${coordenadas.longitude.toFixed(5)} (±${coordenadas.precisaoMetros || 4}m)`
                  : 'Capture a coordenada exata do ponto inspecionado na rodovia'}
              </Text>
              {statusGps !== '' && <Text style={styles.gpsSucesso}>{statusGps}</Text>}
            </View>
            <TouchableOpacity
              style={styles.btnGps}
              onPress={handleCapturarGps}
              disabled={capturandoGps}
            >
              {capturandoGps ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.btnGpsTexto}>📍 Capturar GPS</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Linha Dupla: KM Exato e Altura Aferida */}
        <View style={styles.rowCampos}>
          <View style={[styles.campoGrupo, { flex: 1 }]}>
            <Text style={styles.rotulo}>Quilômetro Exato *</Text>
            <TextInput
              style={[styles.input, erroKm !== '' && styles.inputErro]}
              placeholder={
                trechoSelecionadoObj
                  ? `Ex: ${trechoSelecionadoObj.kmInicial}`
                  : 'Ex: 13.4'
              }
              placeholderTextColor={cores.texto.secundario}
              keyboardType="numeric"
              value={km}
              onChangeText={(v) => {
                setKm(v);
                if (erroKm) setErroKm('');
              }}
            />
            {erroKm !== '' && <Text style={styles.textoErro}>{erroKm}</Text>}
          </View>

          <View style={[styles.campoGrupo, { flex: 1 }]}>
            <Text style={styles.rotulo}>Altura Estimada (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 35.0"
              placeholderTextColor={cores.texto.secundario}
              keyboardType="numeric"
              value={alturaEstimada}
              onChangeText={setAlturaEstimada}
            />
          </View>
        </View>

        {/* Tipo de Ocorrência */}
        <View style={styles.campoGrupo}>
          <Text style={styles.rotulo}>Natureza da Anomalia</Text>
          <View style={styles.listaTipos}>
            {tiposDisponiveis.map((tp) => (
              <TouchableOpacity
                key={tp}
                style={[styles.tipoBtn, tipo === tp && styles.tipoBtnAtivo]}
                onPress={() => setTipo(tp)}
              >
                <Text style={[styles.tipoTexto, tipo === tp && styles.tipoTextoAtivo]}>{tp}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nível de Severidade */}
        <View style={styles.campoGrupo}>
          <Text style={styles.rotulo}>Severidade Regulamentar (ARTESP)</Text>
          <View style={styles.severidadeContainer}>
            {(['critico', 'atencao', 'normal'] as NivelCriticidade[]).map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.severidadeBtn, severidade === s && styles.severidadeBtnAtivo]}
                onPress={() => setSeveridade(s)}
              >
                <Text
                  style={[
                    styles.severidadeTexto,
                    severidade === s && styles.severidadeTextoAtivo,
                  ]}
                >
                  {s.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Identificação do Fiscal */}
        <View style={styles.campoGrupo}>
          <Text style={styles.rotulo}>Responsável pela Inspeção</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome ou matrícula do inspetor"
            placeholderTextColor={cores.texto.secundario}
            value={responsavel}
            onChangeText={setResponsavel}
          />
        </View>

        {/* Descrição com Validação */}
        <View style={styles.campoGrupo}>
          <Text style={styles.rotulo}>Observações e Evidências *</Text>
          <TextInput
            style={[styles.input, styles.textArea, erroDescricao !== '' && styles.inputErro]}
            placeholder="Detalhe a situação observada (ex: capim obstruindo placa regulamentar R-19 no acostamento)"
            placeholderTextColor={cores.texto.secundario}
            multiline
            numberOfLines={4}
            value={descricao}
            onChangeText={(v) => {
              setDescricao(v);
              if (erroDescricao) setErroDescricao('');
            }}
          />
          {erroDescricao !== '' && <Text style={styles.textoErro}>{erroDescricao}</Text>}
        </View>

        {/* Botão de Envio */}
        <TouchableOpacity style={styles.btnSalvar} activeOpacity={0.8} onPress={handleSalvar}>
          <Text style={styles.btnSalvarTexto}>
            {modoOffline
              ? '💾 Salvar na Fila Offline-First'
              : '☁️ Salvar e Sincronizar Ocorrência'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NovaOcorrenciaScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  scrollConteudo: { padding: 16, gap: 14, paddingBottom: 32 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: cores.texto.primario },
  subtitulo: { fontSize: 13, color: cores.texto.secundario },
  rowCampos: { flexDirection: 'row', gap: 10 },
  campoGrupo: { gap: 6 },
  rotulo: { fontSize: 13, fontWeight: '600', color: cores.texto.primario },
  input: {
    backgroundColor: cores.superficie,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.borda,
    paddingHorizontal: 12,
    height: 44,
    color: cores.texto.primario,
  },
  inputErro: { borderColor: cores.status.critico.borda, borderWidth: 1.5 },
  textoErro: { fontSize: 11, color: cores.status.critico.texto, fontWeight: '500' },
  textArea: { height: 90, textAlignVertical: 'top', paddingTop: 10 },
  opcoesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  opcaoBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  opcaoBtnAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  opcaoTexto: { fontSize: 12, color: cores.texto.secundario },
  opcaoTextoAtivo: { color: '#FFF', fontWeight: 'bold' },
  gpsBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    padding: 12,
  },
  gpsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  gpsTitulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: cores.primaria,
  },
  gpsSubtitulo: {
    fontSize: 11,
    color: cores.texto.secundario,
    marginTop: 2,
  },
  gpsSucesso: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
    marginTop: 4,
  },
  btnGps: {
    backgroundColor: cores.primaria,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnGpsTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  listaTipos: { gap: 6 },
  tipoBtn: {
    padding: 10,
    backgroundColor: cores.superficie,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  tipoBtnAtivo: { backgroundColor: '#EFF6FF', borderColor: cores.primaria },
  tipoTexto: { fontSize: 13, color: cores.texto.primario },
  tipoTextoAtivo: { fontWeight: 'bold', color: cores.primaria },
  severidadeContainer: { flexDirection: 'row', gap: 8 },
  severidadeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  severidadeBtnAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  severidadeTexto: { fontSize: 11, fontWeight: 'bold', color: cores.texto.secundario },
  severidadeTextoAtivo: { color: '#FFF' },
  btnSalvar: {
    backgroundColor: cores.primaria,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnSalvarTexto: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
});