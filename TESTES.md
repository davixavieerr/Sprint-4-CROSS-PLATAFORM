# Documento de Testes e Validação Final — Sprint 4

**Projeto:** ROÇA.AI Viário — Monitoramento e Manutenção Preditiva (SP-021 • CCR Motiva)  
**Versão da Build:** `2.0.0` (Expo SDK 53 / Android / Web)  
**Ambiente de Teste:** Android (Expo) / Emulador Android / Web  

**Integrantes / Responsáveis:**
* Davi Xavier — RM563572
* Felipe Ramalho — RM565073
* Gabriel Pereira — RM563571
* Gabriel Simioni — RM563475
* Guilherme Vega — RM562655
* Luiz Henrique — RM563795

---

## 1. Correções e Evoluções Implementadas da Sprint 3 para a Sprint 4

| Item / Pendência da Sprint 3 | Solução Implementada na Sprint 4 | Status |
| :--- | :--- | :---: |
| **Persistência Local e Modo Offline-First** | Implementado `storageService.ts` com persistência em disco via `AsyncStorage` (os dados sobrevivem ao fechamento do app e são carregados na inicialização), alternador de modo `Offline / Online` na Home e fila de sincronização (`filaOffline`) para zonas sem sinal na SP-021. | **Concluído** |
| **Integração com geolocalização nativa (`expo-location`)** | Adicionado botão `📍 Capturar GPS` em `NovaOcorrenciaScreen` usando `expo-location` com fallback automático para o marco quilométrico da SP-021. | **Concluído** |
| **Vínculo entre Ocorrências e Estado do Trecho** | Ocorrências abertas agora aparecem vinculadas em `DetalhesTrechoScreen`, exibem contador no card da `HomeScreen`, atualizam a severidade do trecho e podem ser baixadas individualmente ou junto com a roçada. | **Concluído** |
| **Correção de Bug de Duplo `navigation.goBack()`** | Corrigido o fluxo de salvamento em `NovaOcorrenciaScreen.tsx` que chamava `goBack()` duas vezes ao confirmar o alerta. | **Concluído** |
| **Configuração de Build APK (`eas.json` e `app.json`)** | Criado `eas.json` com perfil `preview`/`production` gerando `.apk` e corrigido `app.json` com pacote `br.com.ccrmotiva.rocaai` e ícones 1024x1024 (`icon.png` e `adaptive-icon.png`). | **Concluído** |
| **Painel Executivo de SLA ARTESP e ROI Motiva** | Criada a tela `PainelExecutivoScreen.tsx` com cálculo em tempo real de conformidade SLA (%), exposição a multas, penalidades mitigadas e botão de reset da demonstração. | **Concluído** |

---

## 2. Tabela de Casos de Teste (Regressão + Novos Fluxos Sprint 4)

| ID | Fluxo / Funcionalidade | Cenário / Procedimento Testado | Resultado Esperado | Resultado Obtido | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **CT-01** | **Filtragem por Criticidade** (Home) | 1. Acessar a tela inicial.<br>2. Clicar no filtro "Críticos".<br>3. Alternar para "Normais" e "Todos". | A lista deve exibir exclusivamente os trechos com a severidade selecionada e atualizar contadores. | Filtros aplicados instantaneamente sem engasgos visuais. | **Passou** |
| **CT-02** | **Tratamento de Lista Vazia** (Empty State) | 1. Digitar "KM 999" na barra de busca.<br>2. Clicar no botão "Limpar Filtros". | Exibir layout amigável de lista vazia sem quebra visual e restaurar os 6 trechos ao limpar. | Mensagem ilustrada exibida corretamente com restauração imediata. | **Passou** |
| **CT-03** | **Inspeção, Telemetria e Ocorrências do Trecho** | 1. Selecionar o trecho "KM 12.0 ao 14.5".<br>2. Conferir coordenadas GPS, taxa `cm/dia`, risco de multa R$ e ocorrências vinculadas. | Exibir telemetria completa, alerta regulatório ARTESP (>30cm) e lista de ocorrências do trecho. | Dados georreferenciados e ocorrências carregados fielmente. | **Passou** |
| **CT-04** | **Validação de Erro em Formulário** | 1. Abrir "+ Ocorrência".<br>2. Tentar salvar com campos obrigatórios vazios. | Bloquear envio e exibir mensagens de erro em vermelho nos campos KM e Observações. | Envio bloqueado com feedback visual claro nos campos inválidos. | **Passou** |
| **CT-05** | **Baixa Operacional de Roçada e Ocorrências** | 1. No trecho crítico, clicar em "Registrar Roçada Concluída".<br>2. Verificar ocorrências do trecho e voltar à Home. | A altura cai para 5.0 cm, o status muda para Verde (Normal), ocorrências abertas do trecho são resolvidas e o SLA na Home sobe. | Estado global, ocorrências e KPIs de SLA atualizados em tempo real. | **Passou** |
| **CT-06** | **Captura de GPS em Campo (`expo-location`)** | 1. Abrir "+ Ocorrência".<br>2. Clicar em "📍 Capturar GPS".<br>3. Salvar ocorrência e verificar retorno à tela anterior. | Capturar Latitude/Longitude (nativa ou marco SP-021), anexar ao registro e retornar 1 nível na pilha de navegação sem erro. | Coordenadas registradas com precisão e navegação fluida corrigida. | **Passou** |
| **CT-07** | **Operação Offline-First e Sincronização** | 1. Na Home, tocar na barra de status para ativar "Modo Campo Offline".<br>2. Registrar nova ocorrência.<br>3. Clicar em "🔄 Sincronizar". | Ocorrência deve entrar na fila offline (`1 na fila`) e, ao sincronizar, atualizar o status para `☁️ Sincronizado` e voltar para Online. | Fila offline e sincronização simulada com a Central CCR funcionando sem perda de dados. | **Passou** |
| **CT-08** | **Painel Executivo & Reset de Demonstração** | 1. Clicar em "📊 ROI & SLA" no topo da Home.<br>2. Conferir KPIs financeiros.<br>3. Clicar em "Restaurar Dados Iniciais". | Exibir SLA ARTESP, multas mitigadas, síntese do modelo SaaS e restaurar os dados originais ao acionar o reset. | Painel executivo renderizado com precisão e reset restaurando o estado inicial. | **Passou** |
| **CT-09** | **Persistência de Dados em Disco** | 1. Registrar uma nova ocorrência.<br>2. Fechar o aplicativo por completo.<br>3. Abrir o aplicativo novamente. | A ocorrência registrada deve continuar disponível após reabrir o app (dados carregados do `AsyncStorage`). | Ocorrência mantida após fechar e reabrir o aplicativo. | **Passou** |

---

## 3. Conclusão da Qualidade (QA)
* **Total de Cenários Executados:** 9
* **Aprovados:** 9
* **Falhas:** 0
* **Taxa de Sucesso:** 100% — Aplicação aprovada para geração de APK e apresentação final.