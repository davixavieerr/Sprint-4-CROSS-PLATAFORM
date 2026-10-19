# Roteiro de Pitch e Demonstração Final (Até 5 Minutos) — Sprint 4

> **Observação Importante da Avaliadora:** O vídeo deve ter até **5 minutos**, com **protagonismo real dos integrantes do grupo** (sem narração gerada por IA) e mostrando o **app instalado e rodando no dispositivo/emulador**.

---

## ⏱️ Divisão de Tempo Sugerida (Total: ~4m30s a 4m50s)

| Bloco | Tempo | Responsável Sugerido | Tópico Principal |
| :---: | :---: | :--- | :--- |
| **1. Abertura & Problema** | `0:00 – 0:50` | **Davi Xavier** (RM563572) | Apresentação do grupo e dor real da Motiva / ARTESP na SP-021 |
| **2. Proposta de Valor & Stack** | `0:50 – 1:30` | **Felipe Ramalho** (RM565073) | O que é o ROÇA.AI Viário e evolução ao longo das 4 Sprints |
| **3. Demo no App (Parte 1)** | `1:30 – 2:35` | **Gabriel Pereira** (RM563571) | Home, KPIs de SLA, Filtros, Detalhes do Trecho e Baixa de Roçada |
| **4. Demo no App (Parte 2)** | `2:35 – 3:30` | **Gabriel Simioni** (RM563475) | Modo Offline-First, Nova Ocorrência com GPS Nativo e Sincronização |
| **5. Plano de Negócio** | `3:30 – 4:15` | **Guilherme Vega** (RM562655) | Modelo de receita SaaS por KM, custos operacionais e margem |
| **6. Impacto Motiva & Fechamento** | `4:15 – 4:50` | **Luiz Henrique** (RM563795) | Tela de ROI Executivo no app, impacto para a Motiva e encerramento |

---

## 🎙️ Falas Sugeridas Passo a Passo

### Bloco 1 — Apresentação do Grupo e Problema (0:00 a 0:50)
**Davi Xavier:**
> "Olá! Nós somos a equipe do **ROÇA.AI Viário**, formada por mim, Davi Xavier, junto com o Felipe Ramalho, Gabriel Pereira, Gabriel Simioni, Guilherme Vega e Luiz Henrique.
> Hoje, um dos maiores gargalos operacionais nas rodovias concessionadas da **Motiva**, como o **Rodoanel Mário Covas (SP-021)**, é o controle da vegetação na faixa de domínio. Pela regulamentação da **ARTESP**, o mato nunca pode ultrapassar **30 centímetros** nem encobrir placas ou defensas.
> O problema é que o modelo tradicional é reativo e linear: equipes cortam grama seguindo planilhas fixas ou alertas soltos no WhatsApp. No verão chuvoso, trechos críticos passam de 30 cm antes da equipe chegar — gerando risco de multas pesadas —, enquanto na seca gasta-se diesel deslocando tratores para onde a grama ainda está baixa."

---

### Bloco 2 — A Solução e Evolução nas 4 Sprints (0:50 a 1:30)
**Felipe Ramalho:**
> "Para resolver isso, desenvolvemos o **ROÇA.AI Viário**, uma plataforma mobile construída em **React Native com Expo e TypeScript**, agora empacotada em versão final **APK para Android**.
> Ao longo das quatro Sprints, evoluímos da concepção regulatória na Sprint 1 e estrutura de rotas na Sprint 2, para o protótipo funcional na Sprint 3, e agora na **Sprint 4** entregamos o produto completo: implementamos persistência **Offline-First** com fila de sincronização para trechos sem sinal na rodovia, captura de **GPS nativo** em campo e um **Painel Executivo de SLA e ROI** integrado ao app."

---

### Bloco 3 — Demonstração do App Instalado: Monitoramento e Baixa (1:30 a 2:35)
**Gabriel Pereira (Mostrando a tela do celular/emulador com o APK rodando):**
> "Aqui no aplicativo instalado no Android, já vemos na tela inicial o **SLA da ARTESP em tempo real**, o total de trechos críticos e as ocorrências abertas na SP-021.
> Posso filtrar rapidamente pelos trechos **Críticos** — acima de 30 cm — ou buscar por um quilômetro específico, inclusive contando com tratamento de lista vazia caso o trecho não exista.
> Entrando no trecho **KM 12.0 ao 14.5**, vemos o alerta vermelho de risco regulatório ARTESP, a exposição estimada a multa, as coordenadas GPS do marco e o ritmo de crescimento de `0,85 cm por dia`.
> Abaixo, temos as ocorrências vinculadas a este trecho. Quando a equipe de campo finaliza o corte, basta tocar em **'Registrar Roçada Concluída'**: imediatamente a altura cai para `5,0 cm`, o trecho entra em conformidade verde, as ocorrências do trecho são baixadas e o histórico auditável é atualizado."

---

### Bloco 4 — Demonstração: Offline-First e Registro com GPS Nativo (2:35 a 3:30)
**Gabriel Simioni (Continuando a demonstração no app):**
> "Sabemos que na rodovia o sinal 4G oscila muito. Por isso, implementamos na barra superior o modo **Offline-First**. Ao simular que o fiscal entrou em uma zona sem sinal na SP-021, o app passa a operar localmente.
> Vou tocar em **'+ Ocorrência'** para registrar uma nova vistoria. Se eu tentar salvar em branco, o formulário valida e bloqueia o envio.
> Agora toco em **'Capturar GPS'**: o app aciona o módulo nativo de geolocalização e preenche a latitude, longitude e precisão em metros. Preencho o KM `16.2`, altura estimada de `34 cm`, severidade crítica e a descrição da placa encoberta, e salvo.
> Veja na Home que a ação entrou na **Fila Offline** e o trecho já subiu para Crítico. Assim que o fiscal retoma sinal e toca em **'Sincronizar'**, os dados sobem para a central da Motiva."

---

### Bloco 5 — Plano de Negócio para a Motiva (3:30 a 4:15)
**Guilherme Vega:**
> "Nosso modelo de negócio foi desenhado especificamente para o orçamento de OPEX das concessionárias do grupo **Motiva**:
> Operamos no modelo **B2B SaaS licenciado por quilômetro concessionado**, cobrando **R$ 85 por km ao mês**, mais uma taxa única de implantação e integração com o ERP/Maximo de **R$ 45 mil**.
> No piloto do Rodoanel SP-021, de 177 km, a assinatura mensal é de apenas **R$ 15 mil por mês**. Como nossa infraestrutura em nuvem com banco geoespacial PostGIS e suporte custa cerca de **R$ 11,4 mil mensais**, o projeto já é superavitário desde o primeiro contrato e atinge **72% de margem bruta** ao escalar para os mais de 4.400 km da malha Motiva, representando um potencial de **R$ 4,5 milhões em receita anual recorrente**."

---

### Bloco 6 — Impacto Esperado e Encerramento (4:15 a 4:50)
**Luiz Henrique (Abrindo a tela '📊 ROI & SLA' no app):**
> "Abrindo o **Painel Executivo de ROI** dentro do próprio app, o gestor da Motiva acompanha o impacto direto na operação:
> Com o ROÇA.AI Viário, projetamos uma **redução de até 85% nas notificações e multas da ARTESP**, além de uma **economia de 22% a 30% em diesel e deslocamento improdutivo** de equipes.
> Na prática, evitar uma única multa contratual já paga mais de 3 meses de uso da plataforma em toda a rodovia, além de reduzir emissões de CO2 e aumentar a segurança viária.
> Muito obrigado!"
