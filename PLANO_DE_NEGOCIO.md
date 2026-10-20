# Plano de Negócio — ROÇA.AI Viário (CCR Motiva)

**Projeto:** ROÇA.AI Viário — Plataforma de Gestão Preditiva e Fiscalização Georreferenciada de Faixa de Domínio  
**Contexto Operacional:** Malha Rodoviária Concessionada CCR Motiva — Piloto SP-021 (Rodoanel Mário Covas)  
**Equipe Responsável:**
* Davi Xavier — RM563572
* Felipe Ramalho — RM565073
* Gabriel Pereira — RM563571
* Gabriel Simioni — RM563475
* Guilherme Vega — RM562655
* Luiz Henrique — RM563795

---

## 1. Problema de Negócio no Contexto da Motiva

A conservação da vegetação marginal (faixa de domínio, canteiros centrais, taludes e acessos) é um dos maiores desafios operacionais e financeiros das concessionárias rodoviárias do grupo **Motiva (CCR)**. Na rodovia **SP-021 (Rodoanel Mário Covas)**, regulada pela **ARTESP**, o contrato de concessão estabelece parâmetros rígidos de desempenho:

* **Limite Regulatório Crítico:** A vegetação na faixa de domínio e junto a dispositivos de sinalização/defensas não pode ultrapassar **30 cm de altura**, nem obstruir placas regulamentares ou sistemas de drenagem.
* **Ineficiência do Modelo Reativo/Linear:** Tradicionalmente, o corte de vegetação segue cronogramas lineares fixos (km a km) controlados por planilhas e mensagens informais (WhatsApp), sem considerar variações microclimáticas, índice pluviométrico, insolação ou tipo de solo.
* **Consequências Financeiras e Operacionais:**
  1. **Risco de Autuações e Multas Contratuais (ARTESP/ANTT):** Trechos com crescimento acelerado no verão ultrapassam os 30 cm antes da chegada da equipe programada, gerando notificações regulatórias e multas severas.
  2. **Desperdício de Recursos de Conservação:** Equipes mecanizadas e manuais são deslocadas para trechos onde a grama ainda está baixa (< 10 cm), desperdiçando diesel, horas-homem e sinalização de bloqueio de faixa.
  3. **Falta de Rastreabilidade Auditável:** Ausência de histórico georreferenciado unificado para comprovar tempestividade de atendimento perante órgãos fiscalizadores.

---

## 2. Proposta de Valor

O **ROÇA.AI Viário** transforma a manutenção de áreas verdes rodoviárias de um **custo fixo reativo** em uma **operação orientada por dados e predição de risco**:

1. **Predição de Janela de Corte (IA + Telemetria):** Combina histórico de vistorias e taxa diária de crescimento vegetativo (`cm/dia`) para estimar exatamente em quantos dias cada segmento quilométrico atingirá o limite de 30 cm da ARTESP.
2. **Despacho Priorizado por Criticidade:** Classifica toda a malha viária em três níveis acionáveis — **Normal (< 10 cm)**, **Atenção (10 a 30 cm)** e **Crítico (> 30 cm)** — direcionando as frentes de roçada apenas para onde há risco real.
3. **Operação Offline-First em Campo:** Permite que fiscais de tráfego e líderes de conservação registrem ocorrências georreferenciadas via GPS nativo (`expo-location`) e deem baixa operacional mesmo em trechos de serra ou túneis sem cobertura 4G/5G, sincronizando automaticamente ao retomar sinal.
4. **Governança e Blindagem Regulatória:** Gera trilha de auditoria rastreável (data, hora, coordenadas GPS, responsável e altura pós-corte) para defesa técnica junto à ARTESP.

---

## 3. Público-Alvo e Personas

### Mercado-Alvo (TAM / SAM / SOM)
* **SOM (Mercado Inicial — Piloto):** Concessão **SP-021 (Rodoanel Mário Covas — Trecho Oeste/Sul)** e unidades rodoviárias paulistas da **CCR Motiva** (AutoBAn, ViaOeste, SPVias, RioSP).
* **SAM (Expansão Grupo Motiva):** Totalidade da malha rodoviária administrada pelo grupo Motiva no Brasil (~4.475 km de rodovias concessionadas).
* **TAM (Mercado Nacional):** Mais de 25.000 km de rodovias federais e estaduais concedidas à iniciativa privada no Brasil (EcoRodovias, Arteris, Pátria, EPR, Vinci).

### Personas Principais

| Persona | Cargo / Papel | Dores Principais | Como o ROÇA.AI Resolve |
| :--- | :--- | :--- | :--- |
| **Ricardo Mendes** | **Coordenador de Conservação Viária (Motiva)** | Sofre pressão por redução de OPEX de roçada e precisa evitar multas da ARTESP no verão chuvoso. | Painel executivo com previsão de dias até o limite de 30 cm e priorização de despacho das equipes. |
| **Carlos Eduardo** | **Fiscal de Campo / Inspetor de Tráfego** | Preenche fichas em papel ou envia fotos soltas no WhatsApp que se perdem; sofre com falta de sinal na rodovia. | App mobile ágil com captura de GPS em 1 toque, formulário validado e fila de sincronização Offline-First. |
| **Fernanda Costa** | **Gerente de Compliance Regulatório e Qualidade** | Dificuldade em reunir evidências rápidas de baixa de serviço quando a ARTESP emite notificação de fiscalização. | Histórico auditável por trecho com timestamp, coordenadas GPS e evolução do SLA da rodovia em tempo real. |

---

## 4. Modelo de Receita

A comercialização segue o modelo **B2B Enterprise SaaS (Software as a Service) + Licenciamento por Quilômetro Concessionado**, alinhado à estrutura orçamentária de OPEX das concessionárias rodoviárias:

| Fonte de Receita | Formato de Cobrança | Valor de Referência (R$) | Detalhamento |
| :--- | :--- | :---: | :--- |
| **1. Assinatura SaaS por KM** | Mensalidade recorrente por km monitorado | **R$ 85,00 / km / mês** | Inclui licenças ilimitadas do app mobile (Android/iOS/Web), motor preditivo e painel de SLA. |
| **2. Taxa de Setup & Integração (Onboarding)** | Pagamento único por concessão | **R$ 45.000,00** | Cadastro georreferenciado da malha (KMs/sentidos), integração via API com ERP (SAP/IBM Maximo) e treinamento. |
| **3. Módulo Avançado Satélite NDVI (Add-on)** | Assinatura adicional opcional | **R$ 25,00 / km / mês** | Ingestão automatizada de imagens multiespectrais de satélite (Sentinel-2/Planet) para calibração da IA. |

### Projeção de Receita por Escala de Implantação
* **Cenário 1 — Piloto Rodoanel SP-021 (177 km):**
  * Receita Recorrente Mensal (MRR): `177 km × R$ 85,00` = **R$ 15.045,00 / mês**
  * Receita Anual no 1º Ano (ARR + Setup): `R$ 180.540,00 + R$ 45.000,00` = **R$ 225.540,00 / ano**
* **Cenário 2 — Expansão Regional Motiva SP (1.600 km — Rodoanel, AutoBAn, ViaOeste, SPVias):**
  * Receita Recorrente Mensal (MRR): **R$ 136.000,00 / mês**
  * Receita Anual Recorrente (ARR): **R$ 1.632.000,00 / ano**
* **Cenário 3 — Malha Completa Grupo Motiva (~4.475 km):**
  * Receita Anual Recorrente (ARR): **R$ 4.564.500,00 / ano**

---

## 5. Estimativa de Custos Operacionais

Estrutura de custos enxuta baseada em arquitetura Cloud-Native escalável (para operação do contrato inicial de até 500 km de rodovias):

| Categoria de Custo | Descrição Técnica | Custo Mensal Estimado (R$) | Custo Anual Estimado (R$) |
| :--- | :--- | :---: | :---: |
| **Infraestrutura Cloud & Banco Geoespacial** | Instâncias AWS EC2/ECS, banco PostgreSQL + PostGIS gerenciado (RDS), storage S3 para evidências e CDN | R$ 1.650,00 | R$ 19.800,00 |
| **APIs de Mapas, Satélite e Build Mobile** | Consumo de APIs de geocodificação, ingestão meteorológica (INMET) e conta Expo EAS / Play Console | R$ 850,00 | R$ 10.200,00 |
| **Sustentação Técnica e Suporte N2/N3** | Equipe enxuta de manutenção evolutiva, monitoramento de SLA 99,5% e suporte às equipes de conservação | R$ 6.500,00 | R$ 78.000,00 |
| **Comercial, Compliance e Impostos (Simples/Lucro Presumido)** | Despesas administrativas, certificações de segurança de dados (LGPD) e tributos sobre faturamento | R$ 2.400,00 | R$ 28.800,00 |
| **TOTAL DE CUSTOS OPERACIONAIS** | **Operação Base (Piloto SP-021 a 500 km)** | **R$ 11.400,00 / mês** | **R$ 136.800,00 / ano** |

* **Viabilidade Econômica no Piloto (177 km):** Mesmo em um único ativo (SP-021), a operação já atinge **breakeven operacional imediato** (Faturamento de R$ 225,5 mil no Ano 1 contra R$ 136,8 mil de custo anual, gerando superávit de **R$ 88,7 mil** já no primeiro contrato).
* **Escalabilidade de Margem:** O custo base de R$ 11.400/mês comporta até 500 km. No piloto (177 km), o MRR de R$ 15.045 cobre os custos com margem operacional de ~24% (o superávit do Ano 1 vem principalmente da taxa de setup). Ao chegar a 500 km, o MRR sobe para R$ 42.500/mês e a margem operacional atinge ~73% (R$ 31.100 de resultado mensal). Acima de 500 km, assume-se que a infraestrutura cresce de forma incremental, não proporcional ao número de km (premissa do grupo, a validar com a Motiva).

---

## 6. Diferenciais Competitivos

| Critério | Planilhas / WhatsApp (Atual) | ERPs Genéricos (SAP / Maximo puro) | **ROÇA.AI Viário** |
| :--- | :---: | :---: | :---: |
| **Foco em Normas ARTESP (Limite 30 cm)** | ❌ Manual e sujeito a falhas | ⚠️ Requer customização cara | ✅ **Nativo com alertas automáticos** |
| **Predição de Crescimento (`cm/dia`)** | ❌ Inexistente (corte cego) | ❌ Baseado apenas em calendário fixo | ✅ **Projeção dinâmica de janela de corte** |
| **Uso em Campo por Equipe Operacional** | ⚠️ Mensagens despadronizadas | ❌ Interface complexa e lenta | ✅ **UX Mobile em 3 toques + GPS nativo** |
| **Operação em Zonas sem Sinal (Offline)** | ⚠️ Perda de contexto e localização | ❌ Exige conexão constante | ✅ **Arquitetura Offline-First com fila local** |
| **Tempo de Implantação** | Imediato (porém sem governança) | 6 a 12 meses | ✅ **Menos de 2 semanas por rodovia** |

---

## 7. Principais Riscos e Matriz de Mitigação

| Risco Identificado | Probabilidade | Impacto | Estratégia de Mitigação Implementada |
| :--- | :---: | :---: | :--- |
| **1. Zonas de sombra de conectividade 4G/5G ao longo do Rodoanel e trechos de serra** | Alta | Alto | Arquitetura **Offline-First** implementada no app (`storageService`), armazenando ocorrências e baixas localmente com fila de sincronização em 1 toque. |
| **2. Baixa adesão de equipes operacionais terceirizadas em campo** | Média | Alto | Interface projetada com alto contraste para uso sob luz solar intensa, botões amplos, preenchimento automático de GPS e fluxo concluído em menos de 30 segundos. |
| **3. Divergência entre estimativa preditiva e surtos climáticos (chuvas extremas)** | Média | Médio | Calibração contínua do modelo toda vez que um fiscal registra uma vistoria real em campo (`NovaOcorrenciaScreen`), ajustando imediatamente a altura e criticidade do trecho. |
| **4. Restrições de segurança da informação para integração com sistemas internos da Motiva** | Baixa | Médio | Comunicação via API REST padronizada (JSON/HTTPS) desacoplada do core bancário/financeiro, exportando relatórios auditáveis sem expor dados sensíveis (conformidade LGPD). |

---

## 8. Impacto Esperado para a Motiva e Rodovias Concessionadas

1. **Meta de redução de até 85% no risco de penalidades regulatórias (ARTESP)** *(estimativa do grupo)*: Antecipação de todos os pontos que se aproximam de 30 cm (status *Atenção*), eliminando autuações por obstrução de placas ou excesso vegetativo. Evitar apenas **uma única multa contratual (valor ilustrativo de ~R$ 48,5 mil, a validar com o histórico de autuações da Motiva)** já paga mais de 3 meses de assinatura do sistema para toda a SP-021.
2. **Meta de redução de 22% a 30% no custo de deslocamento (diesel e H/H)** *(estimativa do grupo, a validar em piloto)*: Eliminação de viagens improdutivas de tratores e caminhões de apoio para trechos que permanecem abaixo de 10 cm em períodos de estiagem.
3. **Aumento da Segurança Viária e Drenagem:** Visibilidade integral de placas de velocidade/regulamentação, defensas metálicas e sarjetas desobstruídas, reduzindo o risco de aquaplanagem e sinistros na SP-021.
4. **Sustentabilidade e ESG:** Menor consumo de combustível fóssil pela frota pesada de conservação (redução direta de emissões de $\text{CO}_2$ no Escopo 1 da Motiva) e gestão inteligente da biomassa nas margens rodoviárias.