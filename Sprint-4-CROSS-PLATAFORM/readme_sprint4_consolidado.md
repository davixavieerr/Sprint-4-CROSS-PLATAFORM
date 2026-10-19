# ROÇA.AI Viário — Versão Final, APK e Plano de Negócio (Sprint 4)

Aplicativo mobile multiplataforma desenvolvido para **fiscalização georreferenciada, operação Offline-First e gestão preditiva de vegetação** na rodovia **SP-021 (Rodoanel Mário Covas)**, em atendimento às normas regulatórias da **ARTESP** e aos padrões operacionais de conservação viária da **CCR Motiva**.

---

## 👥 Integrantes do Grupo

* **Davi Xavier** — RM563572
* **Felipe Ramalho** — RM565073
* **Gabriel Pereira** — RM563571
* **Gabriel Simioni** — RM563475
* **Guilherme Vega** — RM562655
* **Luiz Henrique** — RM563795

---

## 🔗 Links Oficiais de Entrega (Sprint 4)

* **📦 Download do APK Final (Android):** [Baixar APK ROÇA.AI Viário v2.0.0 (Google Drive / GitHub Releases)](https://www.google.com/search?q=https%3A%2F%2Fgithub.com%2FSEU-USUARIO%2FSprint-4-CROSS-PLATAFORM%2Freleases%2Flatest) *(Substitua pelo link final do APK gerado)*
* **🎬 Vídeo Final de Pitch e Demonstração (Até 5 min — YouTube Não Listado):** [Assistir ao Pitch e Demonstração Final](https://www.google.com/search?q=https%3A%2F%2Fyoutu.be%2FSEU_LINK_DO_PITCH_SPRINT4) *(Substitua pelo link do vídeo da Sprint 4)*
* **📹 Vídeo de Demonstração Técnica da Sprint 3 (Histórico):** [Assistir à Demonstração da Sprint 3](https://www.google.com/search?q=https%3A%2F%2Fyoutu.be%2Fcqq3-ENDleY)
* **📄 Documento Completo do Plano de Negócio:** [PLANO\_DE\_NEGOCIO.md](https://www.google.com/search?q=.%2FPLANO_DE_NEGOCIO.md)
* **📋 Relatório de Testes Manuais e Regressão:** [TESTES.md](https://www.google.com/search?q=.%2FTESTES.md)

---

## 💡 Proposta de Solução

Nas rodovias concessionadas administradas pela **Motiva (CCR)**, como o **Rodoanel Mário Covas (SP-021)**, a vegetação marginal não pode ultrapassar o limite regulatório de **30 cm de altura** exigido pela **ARTESP**, sob pena de autuações contratuais severas e risco à segurança viária (obstrução de placas, defensas e drenagem).

O **ROÇA.AI Viário** substitui o modelo tradicional reativo (baseado em cronogramas fixos, planilhas e mensagens despadronizadas no WhatsApp) por uma plataforma mobile e preditiva que:
1. **Monitora a malha quilômetro a quilômetro**, classificando cada trecho em **Normal (< 10 cm)**, **Atenção (10 a 30 cm)** ou **Crítico (> 30 cm)**.
2. **Estima a janela preditiva de corte** com base na taxa diária de crescimento vegetativo (`cm/dia`), antecipando o despacho antes que o limite de 30 cm seja rompido.
3. **Opera em arquitetura Offline-First**, permitindo que fiscais em campo capturem coordenadas GPS (`expo-location`), registrem ocorrências e deem baixa em roçadas mesmo em zonas de sombra de sinal 4G/5G na rodovia.
4. **Oferece um Painel Executivo de SLA e ROI**, traduzindo os dados operacionais em indicadores financeiros de multas mitigadas e conformidade contratual.

---

## 🛠️ Stack Tecnológica e Justificativa Arquitetural

| Camada | Tecnologia Utilizada | Versão / Detalhes |
| :--- | :--- | :--- |
| **Framework Mobile & Web** | React Native + Expo SDK | `0.79.6` / `~53.0.0` |
| **Linguagem** | TypeScript | `~5.8.3` (Tipagem estática estrita) |
| **Navegação** | React Navigation (Native Stack) | `^7.2.0` (Rotas tipadas via `RootStackParamList`) |
| **Gerenciamento de Estado** | React Context API (`AppContext`) | Sincronização reativa global entre telas |
| **Persistência & Offline-First** | `storageService.ts` + Fila Local | Persistência local resiliente e fila de sincronização |
| **Geolocalização Nativa** | `expo-location` | `~18.1.6` (Captura de Latitude/Longitude em campo) |
| **Empacotamento Android** | Expo Application Services (EAS Build) | Perfil configurado em `eas.json` para geração de `.apk` |

### Justificativa da Decisão Tecnológica (Consolidação no Ecossistema React Native / Expo)
A equipe optou estrategicamente por **manter e evoluir a arquitetura em React Native com Expo e TypeScript** ao longo de todas as quatro Sprints, sem migrar para Flutter. Essa decisão garantiu:
* **100% de Reaproveitamento e Maturidade de Código:** Aproveitamento integral da identidade visual (`cores.ts`), tipagens de domínio (`dadosMock.ts`) e fluxos construídos desde as Sprints iniciais, permitindo focar a Sprint 4 em recursos avançados (Offline-First, GPS nativo e Painel Executivo de ROI).
* **Geração Nativa de APK via EAS Build:** O ecossistema Expo SDK 53 permite compilar o binário `.apk` assinado para Android (`eas.json`) mantendo compatibilidade simultânea com execução Web e dispositivos físicos.

---

## 📈 Evolução do Projeto: Resumo das Entregas por Sprint

| Sprint | Foco da Entrega | Principais Marcos Concluídos |
| :---: | :--- | :--- |
| **Sprint 1** | **Concepção, Descoberta e Prototipação** | Mapeamento das dores operacionais da CCR Motiva na SP-021, análise das regras de SLA da ARTESP (limite de 30 cm), definição das personas e protótipo navegável de interface. |
| **Sprint 2** | **Arquitetura Base e Estrutura de Navegação** | Configuração do projeto React Native + Expo com TypeScript, implementação da identidade visual institucional (`cores.ts`), modelagem de dados e listagem inicial de trechos. |
| **Sprint 3** | **Protótipo Funcional Completo e Testes** | Implementação dos 5 fluxos principais (filtros por criticidade, busca por KM, Empty State, detalhes com telemetria, baixa operacional de roçada e validação de formulário de ocorrência) + bateria de testes manuais (`TESTES.md`). |
| **Sprint 4** | **Versão Final, Build APK e Plano de Negócio** | Implementação das pendências da Sprint 3 (persistência **Offline-First** com fila de sincronização, captura de **GPS nativo** via `expo-location`, vínculo bidirecional entre ocorrências e trechos, **Painel Executivo de SLA & ROI**, correção do duplo `goBack`), configuração do **APK Android (`eas.json`)** e elaboração do **Plano de Negócio** para a Motiva. |

---

## 💼 Plano de Negócio Resumido (Contexto CCR Motiva)

> O documento detalhado encontra-se em [PLANO\_DE\_NEGOCIO.md](https://www.google.com/search?q=.%2FPLANO_DE_NEGOCIO.md). Abaixo está a síntese executiva da viabilidade comercial:

### 1. Proposta de Valor e Público-Alvo
* **Proposta de Valor:** Reduzir em até **85% o risco de penalidades regulatórias da ARTESP** por vegetação acima de 30 cm e economizar de **22% a 30% no custo operacional de deslocamento** de frentes de roçada por meio de despacho preditivo e registro georreferenciado Offline-First.
* **Público-Alvo (B2B Concessionárias Rodoviárias):**
  * **Cliente-Âncora:** Grupo **Motiva (CCR)** — iniciando pela SP-021 (Rodoanel, 177 km) com expansão para AutoBAn, ViaOeste, SPVias e RioSP (~4.475 km de malha total).
  * **Personas:** Coordenador de Conservação Viária, Fiscal de Campo / Inspetor de Tráfego e Gerente de Compliance Regulatório.

### 2. Modelo de Receita (B2B SaaS por KM Concessionado)
* **Assinatura Mensal Recorrente (SaaS):** **R$ 85,00 por km/mês** (inclui usuários ilimitados em campo, motor preditivo e painel executivo).
  * *Piloto Rodoanel SP-021 (177 km):* **R$ 15.045,00 / mês** (**R$ 180.540,00 / ano**).
  * *Potencial Malha Total Motiva (4.475 km):* **R$ 4,56 milhões / ano (ARR)**.
* **Taxa de Setup e Integração GIS/ERP (SAP/Maximo):** **R$ 45.000,00** (pagamento único de implantação por concessionária).
* **Add-on Satélite NDVI (Opcional):** **R$ 25,00 por km/mês** para calibração via imagens orbitais multiespectrais.

### 3. Custos Estimados de Operação (Escala até 500 km)
* **Infraestrutura Cloud (AWS + PostgreSQL/PostGIS + Storage):** R$ 1.650,00 / mês
* **APIs de Geocodificação, Clima (INMET) e Serviços Mobile:** R$ 850,00 / mês
* **Equipe de Sustentação Técnica e Suporte N2/N3:** R$ 6.500,00 / mês
* **Administrativo, Compliance LGPD e Tributos:** R$ 2.400,00 / mês
* **Custo Operacional Total:** **R$ 11.400,00 / mês** (**R$ 136.800,00 / ano**), proporcionando superávit já no primeiro contrato piloto e **margem bruta de 72%** na expansão para novas concessões.

### 4. Diferenciais Competitivos e Riscos Mitigados
* **Diferenciais:** Parametrização nativa das regras da ARTESP (gatilho de 30 cm), cálculo de ritmo diário de crescimento (`cm/dia`), operação em 3 toques sob sol intenso e funcionamento 100% **Offline-First**.
* **Payback Imediato para a Motiva:** Uma única multa contratual evitada (~R$ 48,5 mil) cobre mais de 3 meses de assinatura integral da plataforma para toda a SP-021.

---

## 📲 Instruções de Instalação do APK no Android

Para instalar a versão final do aplicativo diretamente em um smartphone ou emulador Android:

1. **Baixe o arquivo `.apk`** através do link oficial disponível no topo deste README.
2. No seu dispositivo Android, abra o arquivo `.apk` baixado através do gerenciador de arquivos ou navegador.
3. Caso solicitado pelo Android, autorize a opção **"Permitir instalação de fontes desconhecidas"** (necessário para instalação direta de APKs fora da Google Play Store).
4. Toque em **Instalar** e aguarde a conclusão.
5. Abra o aplicativo **ROÇA.AI Viário - Motiva** e, ao registrar uma ocorrência, conceda permissão de acesso à localização (GPS) para testar a captura georreferenciada em campo.

---

## 🚀 Como Executar o Código-Fonte e Gerar o APK

### 1. Executar em Ambiente de Desenvolvimento
```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Iniciar o servidor de desenvolvimento Expo
npx expo start
```
* Pressione **`a`** para abrir no Emulador Android.
* Pressione **`w`** para abrir na versão Web no navegador.
* Ou escaneie o QR Code com o aplicativo **Expo Go** no seu smartphone.

### 2. Gerar um Novo Build APK via Expo EAS Build
O repositório já possui os arquivos `eas.json` e `app.json` devidamente configurados com o pacote `br.com.ccrmotiva.rocaai` e perfil de empacotamento `.apk`:

```bash
# 1. Autenticar na sua conta Expo (caso ainda não esteja logado)
npx eas-cli login

# 2. Disparar a geração do APK instalável (perfil preview)
npm run build:apk
# (Equivalente a: npx eas-cli build -p android --profile preview)
```
Ao término do build na nuvem do Expo, o terminal fornecerá o link direto para download do arquivo `.apk`.
