export type NivelCriticidade = 'normal' | 'atencao' | 'critico';

export interface CoordenadasGPS {
  latitude: number;
  longitude: number;
  precisaoMetros?: number;
}

export interface HistoricoInspecao {
  id: string;
  data: string;
  servico: string;
  alturaApos: number;
  responsavel: string;
}

export interface Trecho {
  id: string;
  rodovia: string;
  kmInicial: number;
  kmFinal: number;
  sentido: string;
  alturaVegetacao: number; // em cm
  taxaCrescimentoDia: number; // cm/dia estimado por IA / NDVI
  status: NivelCriticidade;
  diasParaLimite: number; // Projeção preditiva até atingir 30cm
  ultimaInspecao: string;
  coordenadas: CoordenadasGPS;
  riscoMultaArtesp: number; // Valor estimado de autuação/penalidade contratual (R$)
  historico: HistoricoInspecao[];
}

export interface Ocorrencia {
  id: string;
  trechoId: string;
  km: number;
  tipo: string;
  descricao: string;
  data: string;
  severidade: NivelCriticidade;
  alturaEstimadaCm?: number;
  responsavel: string;
  coordenadas?: CoordenadasGPS;
  statusOcorrencia: 'Aberta' | 'Resolvida';
  sincronizado: boolean;
}

export const trechosIniciais: Trecho[] = [
  {
    id: 'TR-01',
    rodovia: 'SP-021 (Rodoanel Mário Covas)',
    kmInicial: 12.0,
    kmFinal: 14.5,
    sentido: 'Pista Externa (Oeste)',
    alturaVegetacao: 36.5,
    taxaCrescimentoDia: 0.85,
    status: 'critico',
    diasParaLimite: 0,
    ultimaInspecao: '18/10/2026',
    coordenadas: { latitude: -23.5284, longitude: -46.7912, precisaoMetros: 4 },
    riscoMultaArtesp: 48500,
    historico: [
      { id: 'H1', data: '10/09/2026', servico: 'Roçada Mecanizada', alturaApos: 6.0, responsavel: 'Equipe Alfa' },
      { id: 'H2', data: '05/10/2026', servico: 'Vistoria com Drone / IA', alturaApos: 28.0, responsavel: 'Fiscal Davi Xavier' },
    ],
  },
  {
    id: 'TR-02',
    rodovia: 'SP-021 (Rodoanel Mário Covas)',
    kmInicial: 14.5,
    kmFinal: 17.0,
    sentido: 'Pista Externa (Oeste)',
    alturaVegetacao: 22.0,
    taxaCrescimentoDia: 1.1,
    status: 'atencao',
    diasParaLimite: 6,
    ultimaInspecao: '17/10/2026',
    coordenadas: { latitude: -23.5491, longitude: -46.8045, precisaoMetros: 5 },
    riscoMultaArtesp: 24250,
    historico: [
      { id: 'H3', data: '15/09/2026', servico: 'Roçada Manual em Talude', alturaApos: 7.0, responsavel: 'Equipe Beta' },
    ],
  },
  {
    id: 'TR-03',
    rodovia: 'SP-021 (Rodoanel Mário Covas)',
    kmInicial: 18.0,
    kmFinal: 21.0,
    sentido: 'Pista Interna (Oeste)',
    alturaVegetacao: 8.5,
    taxaCrescimentoDia: 0.65,
    status: 'normal',
    diasParaLimite: 24,
    ultimaInspecao: '16/10/2026',
    coordenadas: { latitude: -23.5718, longitude: -46.8129, precisaoMetros: 3 },
    riscoMultaArtesp: 0,
    historico: [
      { id: 'H4', data: '08/10/2026', servico: 'Roçada Mecanizada Tratorizada', alturaApos: 5.0, responsavel: 'Equipe Alfa' },
    ],
  },
  {
    id: 'TR-04',
    rodovia: 'SP-021 (Rodoanel Mário Covas)',
    kmInicial: 22.5,
    kmFinal: 25.0,
    sentido: 'Pista Externa (Oeste)',
    alturaVegetacao: 33.0,
    taxaCrescimentoDia: 0.9,
    status: 'critico',
    diasParaLimite: 0,
    ultimaInspecao: '18/10/2026',
    coordenadas: { latitude: -23.5964, longitude: -46.8231, precisaoMetros: 4 },
    riscoMultaArtesp: 48500,
    historico: [
      { id: 'H5', data: '01/09/2026', servico: 'Roçada Manual', alturaApos: 6.5, responsavel: 'Equipe Gamma' },
    ],
  },
  {
    id: 'TR-05',
    rodovia: 'SP-021 (Rodoanel Mário Covas)',
    kmInicial: 26.0,
    kmFinal: 29.3,
    sentido: 'Pista Interna (Sul)',
    alturaVegetacao: 15.0,
    taxaCrescimentoDia: 0.75,
    status: 'atencao',
    diasParaLimite: 12,
    ultimaInspecao: '15/10/2026',
    coordenadas: { latitude: -23.6215, longitude: -46.8190, precisaoMetros: 6 },
    riscoMultaArtesp: 24250,
    historico: [
      { id: 'H6', data: '25/09/2026', servico: 'Poda Seletiva e Roçada', alturaApos: 6.0, responsavel: 'Equipe Delta' },
    ],
  },
  {
    id: 'TR-06',
    rodovia: 'SP-021 (Rodoanel Mário Covas)',
    kmInicial: 30.0,
    kmFinal: 33.5,
    sentido: 'Pista Externa (Sul)',
    alturaVegetacao: 6.2,
    taxaCrescimentoDia: 0.55,
    status: 'normal',
    diasParaLimite: 28,
    ultimaInspecao: '19/10/2026',
    coordenadas: { latitude: -23.6480, longitude: -46.7982, precisaoMetros: 3 },
    riscoMultaArtesp: 0,
    historico: [
      { id: 'H7', data: '14/10/2026', servico: 'Roçada Mecanizada de Faixa de Domínio', alturaApos: 5.0, responsavel: 'Equipe Alfa' },
    ],
  },
];

export const ocorrenciasIniciais: Ocorrencia[] = [
  {
    id: 'OC-101',
    trechoId: 'TR-01',
    km: 13.4,
    tipo: 'Obstrução de Sinalização (>30cm)',
    descricao: 'Capim colonião com 36.5cm encobrindo placa de regulamentação R-19 (80 km/h) e refletor de defensa metálica.',
    data: '18/10/2026',
    severidade: 'critico',
    alturaEstimadaCm: 36.5,
    responsavel: 'Fiscal Davi Xavier',
    coordenadas: { latitude: -23.5312, longitude: -46.7945, precisaoMetros: 4 },
    statusOcorrencia: 'Aberta',
    sincronizado: true,
  },
  {
    id: 'OC-102',
    trechoId: 'TR-04',
    km: 23.8,
    tipo: 'Vegetação Invadindo Acostamento',
    descricao: 'Avanço de vegetação densa sobre a linha de bordo e sarjeta de drenagem, exigindo despacho prioritário.',
    data: '18/10/2026',
    severidade: 'critico',
    alturaEstimadaCm: 33.0,
    responsavel: 'Fiscal Felipe Ramalho',
    coordenadas: { latitude: -23.6010, longitude: -46.8211, precisaoMetros: 5 },
    statusOcorrencia: 'Aberta',
    sincronizado: true,
  },
  {
    id: 'OC-103',
    trechoId: 'TR-02',
    km: 15.9,
    tipo: 'Crescimento Acelerado em Talude',
    descricao: 'Crescimento pós-chuvas atingindo 22cm próximo ao acesso de retorno operacional.',
    data: '17/10/2026',
    severidade: 'atencao',
    alturaEstimadaCm: 22.0,
    responsavel: 'Fiscal Gabriel Pereira',
    coordenadas: { latitude: -23.5534, longitude: -46.8071, precisaoMetros: 4 },
    statusOcorrencia: 'Aberta',
    sincronizado: true,
  },
];