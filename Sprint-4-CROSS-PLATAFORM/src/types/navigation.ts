export type RootStackParamList = {
  Home: undefined;
  DetalhesTrecho: { trechoId: string };
  NovaOcorrencia: { trechoIdPreSelecionado?: string } | undefined;
  PainelExecutivo: undefined;
};