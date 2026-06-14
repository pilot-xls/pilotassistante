# ✈️ PilotAssistante — Ficheiro de Contexto & Memória do Projecto

> Este ficheiro é a memória viva do projecto. É lido automaticamente pelo Claude Code e carregado no Project do claude.ai. Actualiza-o no final de cada sessão de trabalho.

---

## 🧭 O que é o PilotAssistante

Uma **Progressive Web App (PWA)** alimentada por IA, desenhada exclusivamente para pilotos de aviação comercial e privada. O objectivo é centralizar numa única plataforma inteligente todas as ferramentas que um piloto usa no seu dia a dia — com uma assistente de IA que conhece o piloto, aprende com ele e o ajuda a ser mais eficiente, seguro e informado.

**Nome comercial:** PilotAssistante
**Domínio futuro:** pilotassistante.com
**Fundador:** Piloto de aviação (utilizador desta sessão)

---

## 👤 Perfil do Fundador

- Piloto de aviação comercial activo
- Conhecimentos técnicos: HTML, CSS, JavaScript — experiência com PWAs
- Sem equipa — desenvolvimento solo, com assistência do Claude
- Sem orçamento inicial — stack escolhida para custo zero no início
- Objectivo pessoal: testar a app para uso próprio antes de lançar comercialmente

---

## 🛠️ Stack Tecnológica

| Camada | Ferramenta | Notas |
|---|---|---|
| Frontend | PWA (HTML + CSS + JS puro) | Sem frameworks por agora |
| Hospedagem | GitHub Pages → Netlify | URL gratuito desde o dia 1 |
| Backend / Auth | Supabase | Logins + base de dados + storage |
| Pagamentos | Stripe | Apenas na Fase 3 |
| IA | Claude API — Anthropic | Haiku para geral, Sonnet para FTL |
| App nativa | Capacitor (Ionic) | Apenas quando produto validado |
| Controlo de versão | GitHub | Repositório: pilotassistante |

**Decisões tomadas:**
- Escolhemos Supabase em vez de Firebase (mais simples, open source, RLS nativo)
- Haiku 4.5 para a maioria das funções ($1/$5 por MTok)
- Sonnet 4.6 para análises complexas como FTL e briefing ($3/$15 por MTok)
- PWA primeiro — App Store apenas quando produto estiver validado

---

## 📦 Módulos do Produto

### Módulo 1 — Agenda & Legalidades EASA ⬜ Por fazer
- Integração com calendário pessoal
- Cálculo automático FTL segundo EASA ORO.FTL
- Alertas de ilegalidades antes que aconteçam
- Ex: "Tens voo amanhã às 06:00. Já fizeste 85h este mês — atenção ao limite."

**Métodos de importação de roster (sem depender da empresa):**
- Screenshot ou foto do roster → IA lê e extrai dados automaticamente
- Upload de PDF exportado de qualquer software (LEON, Flica, AIMS, etc.)
- Link iCal/CalDAV → sincronização automática e contínua
- Email automático → app detecta e lê roster enviado por email
- Funciona com qualquer software de qualquer empresa de qualquer país

### Módulo 2 — Logbook Inteligente 🟡 Em progresso
- Registo de voos (manual ou importação)
- Totais automáticos: diurnas, noturnas, IFR, VFR, PIC, Co-Pilot, Dual, Instructor, simulador
- Consulta em linguagem natural: "How many night hours in the last 90 days?"
- Exportação para PDF oficial
- Relatórios gerados pela IA

**Formato Universal Interno (campos completos — implementados na Sessão 2):**
Date, Origin (ICAO), Destination (ICAO), Off-block, On-block, Aircraft Type, Registration, SE/ME, SP/MP, Total Hours, Day Hours, Night Hours, IFR, VFR, Role (PIC/Co-Pilot/Dual/Instructor), PIC Name, Instructor Name, Take-offs Day, Take-offs Night, Landings Day, Landings Night, Instrument Approaches (number + type), FSTD Type, FSTD Hours, Remarks

**Estado actual:**
- ✅ Formulário completo com todos os campos EASA
- ✅ Toggle Flight / Simulator (campos mudam automaticamente)
- ✅ Painel de estatísticas: Total HRS, PIC HRS, IFR HRS, Night HRS, Simulator, This Month
- ✅ Lista de entradas com cartões detalhados
- ✅ Armazenamento localStorage (offline, sem servidor)
- ✅ App em inglês
- ✅ Deploy no GitHub Pages
- ⬜ Edição de entradas existentes
- ⬜ Filtro por mês / pesquisa
- ⬜ Exportação CSV / PDF
- ⬜ Importação via IA (foto, PDF, CSV)
- ⬜ Consulta em linguagem natural (Claude API)

**Métodos de importação (a implementar):**
- Foto/screenshot de qualquer logbook (papel ou digital) → IA extrai dados
- Upload de PDF exportado de qualquer app → IA processa
- CSV de apps como LogTen Pro, MyFlightbook, Safelog → IA mapeia colunas
- Introdução manual campo a campo ✅ (já implementado)

**Templates de exportação (apenas 4):**
- EASA (formato oficial europeu) — prioritário
- FAA (formato oficial americano)
- PDF genérico profissional
- CSV universal (para migrar para outra app)

### Módulo 3 — Documentos & Validades ⬜ Por fazer (CRÍTICO — adicionado Sessão 1)
- Licença ATPL/CPL/PPL — data de validade + alertas
- Medical Classe 1/2 — validade + lembrete para marcar consulta
- Type Rating — validade + data de renovação
- IR (Instrument Rating) — validade
- Currency de aterragens (3 em 90 dias) — calculado automaticamente pelo logbook
- English Language Proficiency — validade
- Currency nocturna — calculada automaticamente
- Alertas automáticos: 90 dias, 60 dias, 30 dias, 7 dias antes do vencimento
- Ex: "Your Medical expires in 47 days. Time to book your appointment."

### Módulo 4 — Centro de Treino ⬜ Por fazer
- Base de conhecimento ATPL/CPL/PPL
- Documentação do type rating (introduzida pelo piloto)
- Modo quiz, flashcards, revisão por voz
- IA que adapta o estudo ao historial do piloto

### Módulo 5 — Memórias & Diário ⬜ Por fazer
- Álbum de fotos ligado a voos específicos
- Diário de bordo pessoal
- Consulta: "Show me photos from my first solo flight"

### Módulo 6 — Oportunidades de Emprego ⬜ Por fazer
- Feed de ofertas filtrado por type rating e localização
- Alertas de novas oportunidades relevantes

### Módulo 7 — Notícias de Aviação ⬜ Por fazer
- Feed personalizado de notícias do setor
- Resumo diário pela IA

### Módulo 8 — Briefing Inteligente ⬜ Por fazer

### Módulo 9 — Calculadora de Salário & Per Diem ⬜ Por fazer (Fase 2)
- Cálculo automático de horas extra com base no logbook
- Per diem por país/destino configurável
- Total a receber no mês actual
- Histórico mensal e anual
- "How much will I earn this month?" → resposta imediata

### Módulo 10 — Preparação de Entrevistas ⬜ Por fazer (Fase 2)
- IA prepara o piloto com perguntas reais por companhia
- Simulação de sim check por type rating
- Dicas específicas do processo de cada companhia
- Ligado ao módulo de emprego — vaga detectada → preparação automática

### Módulo 11 — Diário de Fadiga ⬜ Por fazer (Fase 2)
- Registo de fadiga após cada duty (escala simples 1-5)
- Histórico correlacionado com tipo de duties
- Insights da IA: "Your fatigue is higher after night standby followed by early starts"
- Alinhado com requisitos de reporte EASA

### Módulo 12 — Widget Ecrã Principal ⬜ Por fazer (Fase 3)
- Próximo voo (hora, rota, aeronave)
- Alertas de validades urgentes
- Horas voadas no mês
- Visível sem abrir a app

### Módulo 13 — Relatório Anual Automático ⬜ Por fazer (Fase 2)
- Gerado pela IA no final de cada ano
- Total de horas, países, aterragens, melhor mês
- Comparação com ano anterior
- Partilhável nas redes sociais (marketing orgânico)

### Módulo 14 — Interface de Voz ⬜ Por fazer (Fase 2) 🔴 CRÍTICO
- Controlo total da app por voz
- "PilotAssistante, what's my duty time tomorrow?"
- "PilotAssistante, add a flight Lisbon London 4h30"
- "PilotAssistante, what's the weather at Heathrow?"
- Perfeito no carro a caminho do aeroporto — sem tocar no telemóvel

### Módulo 15 — Wellbeing: Sono & Jet Lag ⬜ Por fazer (Fase 2) 🔴 CRÍTICO
- Análise automática do roster para calcular jet lag previsto
- Recomendações de sono personalizadas por rota e fuso horário
- Índice de alerta previsto para cada fase do voo
- "You're crossing 5 time zones — sleep between 14:00 and 22:00 today"
- Diferenciador enorme — segurança aérea real, nenhuma app faz isto

---

## 🔮 Funcionalidades Futuras — Ano 3+

*Boas ideias mas fora do âmbito das Fases 1 e 2. Reavaliar quando o produto estiver validado.*

- Progressão de Carreira — trajectory de horas até Captain, widebody, etc.
- Apple Watch integration
- Calculadoras de performance de aeronave
- QRH digital por type rating
- Gestão fiscal multi-país (per diem, impostos)
- White-label para companhias aéreas
- METAR, TAF, SIGMET em linguagem natural
- NOTAMs automáticos com resumo inteligente
- Sugestão de alternates baseada nas condições

---

## 🗺️ Plano de Desenvolvimento

### FASE 1 — Versão Pessoal (Mês 1-3)
**Objectivo:** Construir para uso próprio. Aprender. Testar na vida real.

| Semanas | Objectivo | Estado |
|---|---|---|
| 1-2 | Logbook básico | ✅ Concluído |
| 3-4 | Agenda + cálculo FTL simples | ⬜ Por fazer |
| 5-6 | Integrar Claude API | ⬜ Por fazer |
| 7-8 | Meteorologia + NOTAMs | ⬜ Por fazer |
| 9-12 | Polir, testar, corrigir bugs | ⬜ Por fazer |

### FASE 2 — Beta com Pilotos (Mês 4-6)
**Objectivo:** Validar com 10-20 pilotos amigos. Recolher feedback real.
- Adicionar Supabase (logins + cloud sync)
- Partilhar link da PWA com pilotos amigos
- Criar grupo de feedback (WhatsApp ou Discord)
- Iterar semanalmente com base no feedback

### FASE 3 — Produto Comercial (Mês 7-12)
**Objectivo:** Lançar o PilotAssistante como produto pago.
- Implementar Stripe para subscrições
- Lançar plano Free vs Premium
- Publicar domínio: pilotassistante.com
- Converter para app nativa com Capacitor
- Submeter à App Store e Google Play

---

## 💰 Modelo de Negócio

**Plano Grátis:**
- Logbook até 50 voos
- Meteorologia simples
- Agenda básica
- 5 perguntas/dia à assistente IA

**Plano Premium — €9,99/mês:**
- Logbook ilimitado + relatórios IA
- Verificação legalidades EASA automática
- Centro de treino completo + type rating
- NOTAMs + Meteorologia avançada
- Oportunidades de emprego
- Memórias e diário
- Assistente IA ilimitada

---

## 📊 Projecção de Mercado

| Ano | Subscribers | Receita/mês | Lucro estimado/ano |
|---|---|---|---|
| Ano 1 | 0-20 | €0-200 | Investimento |
| Ano 2 | 20-200 | €200-2.000 | ~€10.000 |
| Ano 3 | 200-1.000 | €2.000-9.990 | ~€60.000 |
| Ano 4 | 1.000-2.500 | €9.990-24.975 | ~€170.000 |
| Ano 5 | 2.500-3.500 | €24.975-34.965 | ~€300.000 |

**Meta:** 1% dos ~350.000 pilotos comerciais mundiais = ~3.500 subscribers no Ano 5

---

## 💶 Custos da Claude API (2026)

| Modelo | Input/MTok | Output/MTok | Uso |
|---|---|---|---|
| Haiku 4.5 | $1,00 | $5,00 | Maioria das funções |
| Sonnet 4.6 | $3,00 | $15,00 | FTL, briefing complexo |

**Custo real estimado por fase:**
- Só tu (Fase 1): < $1/mês
- Beta 10-20 pilotos (Fase 2): ~$5-10/mês
- 100 subscribers: ~$6/mês
- 1.000 subscribers: ~$60/mês
- 3.500 subscribers (meta): ~$210/mês

*Com prompt caching activo: redução de até 90% nos custos de input.*

---

## 🐛 Bugs Conhecidos

*Nenhum ainda.*

---

## ✅ Decisões de Produto

| Data | Decisão | Motivo |
|---|---|---|
| Sessão 1 | GitHub Pages para hospedagem | Grátis, integrado com repositório, simples |
| Sessão 1 | Supabase para autenticação e base de dados | Grátis até 50.000 utilizadores, RLS nativo, JS simples |
| Sessão 1 | Supabase Auth para logins | Email+password + OAuth Google/Apple, sessões JWT automáticas |
| Sessão 1 | GitHub Pages NÃO gere acessos sozinho | Só serve ficheiros estáticos — Supabase trata de tudo o resto |
| Sessão 1 | Netlify apenas na Fase 3 | Necessário só para funções serverless (ex: Stripe seguro) |
| Sessão 1 | Row Level Security (RLS) no Supabase | Cada piloto só vê os seus dados — configurado uma vez, funciona sempre |
| Sessão 1 | PWA "Adicionar ao ecrã" apenas nas Fases 1 e 2 | Aceitável para uso pessoal e beta, mas não profissional para escalar |
| Sessão 1 | App Store + Google Play via Capacitor na Fase 3 | Produto profissional, pesquisável na loja, credível para utilizadores pagos |
| Sessão 1 | Capacitor não reescreve código | Pega no código PWA existente e embrulha em app nativa — mesmo código, duas lojas |
| Sessão 1 | Apple Developer Account (99€/ano) só na Fase 3 | Não faz sentido pagar antes de ter utilizadores reais e produto validado |
| Sessão 1 | Integração com roster via IA (não via API) | APIs de LEON/Flica/AIMS dependem da empresa — piloto não tem acesso directo |
| Sessão 1 | 4 métodos de importação de roster | Screenshot/foto, upload PDF, link iCal, email automático — funciona com qualquer software |
| Sessão 1 | Solução universal: IA lê qualquer formato de roster | Funciona com LEON, Flica, AIMS, papel, qualquer software, qualquer país |
| Sessão 1 | Logbook com formato universal interno | Um único formato interno com todos os campos possíveis — importa de qualquer fonte |
| Sessão 1 | Importação de logbook via IA | Foto de papel, PDF, CSV, screenshot — IA converte tudo para formato interno |
| Sessão 1 | Apenas 4 templates de exportação de logbook | EASA (oficial europeu), FAA (oficial americano), PDF genérico, CSV universal |
| Sessão 1 | Grande valor: reunir logbooks dispersos | Papel + LogTen + MyFlightbook + outros → tudo num sítio só via IA |
| Sessão 1 | Modo Offline obrigatório desde o início | Pilotos sem internet no cockpit, aeroportos remotos, roaming — app tem de funcionar sempre |
| Sessão 1 | Módulo Documentos & Validades adicionado (crítico) | Dor real para todos os pilotos — Medical, Type Rating, IR, currency — alertas automáticos |
| Sessão 1 | GDPR & Privacidade — implementar antes do lançamento | Dados profissionais sensíveis, obrigatório na Europa — exportação e apagamento de dados |
| Sessão 1 | Notificações Push — activar na Fase 2 | Sem push, os alertas FTL e validades perdem 80% do valor |
| Sessão 1 | Módulo Calculadora Per Diem adicionado | Dor real — pilotos calculam isto manualmente, nenhuma app faz bem |
| Sessão 1 | Módulo Preparação de Entrevistas adicionado | IA faz tudo, baixo esforço, alto valor — ligado ao módulo de emprego |
| Sessão 1 | Módulo Diário de Fadiga adicionado | Segurança aérea + dados pessoais valiosos + alinhado com EASA |
| Sessão 1 | Módulo Widget Ecrã Principal adicionado | Lembra o piloto da app todos os dias sem abrir |
| Sessão 1 | Módulo Relatório Anual Automático adicionado | IA gera, partilhável nas redes — marketing orgânico gratuito |
| Sessão 1 | Comunidade de Pilotos — REJEITADO | Decisão do fundador — fora do âmbito do produto |
| Sessão 1 | Módulo Interface de Voz adicionado (crítico) | Natural para pilotos, inovador, perfeito para uso no carro |
| Sessão 1 | Módulo Wellbeing Sono & Jet Lag adicionado (crítico) | Maior dor real do piloto, nenhuma app trata isto seriamente |
| Sessão 1 | Funcionalidades Ano 3+ definidas e arquivadas | Apple Watch, QRH, fiscal, white-label — fora do âmbito actual |
| Sessão 1 | Produto considerado completo para início de desenvolvimento | 15 módulos definidos, produto inovador sem equivalente no mercado |
| Sessão 2 | localStorage na Fase 1 | Sem servidor, custo zero, funciona offline desde o primeiro dia |
| Sessão 2 | Estrutura de pastas css/ e js/ desde o início | Projecto vai crescer — organização correcta desde já evita reorganização futura |
| Sessão 2 | App em inglês | Produto para pilotos internacionais — brand name "PilotAssistante" mantido |
| Sessão 2 | Aceita horas em "2:30" e "2.5" | Flexível para uso real — pilotos usam ambos os formatos |
| Sessão 2 | Toggle Flight / Simulator no formulário | Formulário não mostra campos irrelevantes — UX mais limpa |
| Sessão 2 | Campos contextuais PIC Name / Instructor Name | Só aparecem quando a função seleccionada é relevante |
| Sessão 2 | Horas de simulador separadas do tempo de voo real | Não contamina os totais de voo — correcto para EASA Part-FCL |
| Sessão 2 | 4 tipos de função: PIC / Co-Pilot / Dual / Instructor | Cobre todos os casos EASA Part-FCL |
| Sessão 2 | Tema visual: cockpit escuro tipo EFIS | Space Grotesk + Space Mono, paleta navy/cyan — identidade visual definida |

---

## 📝 Registo de Sessões

### Sessão 1 — Junho 2026
**O que fizemos:**
- Discussão completa sobre como funciona a IA (redes neurais, LLMs, história)
- Definição do produto PilotAssistante e todos os seus módulos
- Escolha da stack tecnológica completa
- Definição do modelo de negócio (freemium + €9,99/mês)
- Projecção financeira até ao Ano 5 (1% do mercado)
- Criação do documento Word completo (PilotAssistante_PlanoCompleto.docx)
- Criação deste ficheiro CLAUDE.md
- Discussão sobre GitHub, PWA, App Store (Capacitor), Supabase, Stripe
- Clarificação sobre acessos: GitHub Pages só serve ficheiros, Supabase trata logins e dados
- Clarificação sobre instalação PWA vs App Store — "Adicionar ao ecrã" não é profissional para escalar
- Decisão: Capacitor na Fase 3 para publicar na App Store e Google Play com o mesmo código PWA
- Solução de roster: IA lê screenshot/foto/PDF/iCal/email — funciona com qualquer software de qualquer empresa
- Solução de logbook: formato universal interno + importação via IA de qualquer fonte + 4 templates de exportação (EASA, FAA, PDF, CSV)

---

### Sessão 2 — 14 Junho 2026
**O que fizemos:**
- Construção do Logbook — Módulo 2, Fase 1, Semanas 1-2
- Criados 4 ficheiros: index.html, css/style.css, js/app.js, manifest.json
- v0.1 — base funcional:
  - Painel com 6 estatísticas (Total HRS, PIC HRS, IFR HRS, Night HRS, Simulator, This Month)
  - Formulário para adicionar voos com campos essenciais
  - Lista de entradas ordenada do mais recente para o mais antigo
  - Eliminar entrada com confirmação
  - Armazenamento em localStorage (offline, sem servidor)
  - Aceita horas em "2:30" ou "2.5"
- v0.2 — formulário expandido com todos os campos EASA:
  - Toggle Flight / Simulator (mostra/oculta campos automaticamente)
  - Off-block / On-block (departure and arrival times)
  - SE / ME (Single Engine / Multi Engine)
  - SP / MP (Single Pilot / Multi-Pilot)
  - Funções: PIC, Co-Pilot, Dual, Instructor
  - PIC Name (aparece quando função = Co-Pilot ou Dual)
  - Instructor Name (aparece quando função = Dual)
  - Take-offs day e night (separadas das landings)
  - Instrument Approaches (número + tipo: ILS CAT I/II/III, RNAV, VOR, NDB…)
  - FSTD Type (FFS, FTD, FNPT II MCC, FNPT II, FNPT I, BITD) + session duration
  - Horas de simulador separadas do tempo de voo real no painel
- Tradução completa para inglês (UI, labels, mensagens, datas, cartões)
- Estrutura de pastas css/ e js/ definida para escalar com o projecto
- Deploy no GitHub Pages

**Próxima sessão:**
- Testar com voos reais do logbook pessoal
- Adicionar edição de entradas (clicar num cartão abre o formulário preenchido)
- Adicionar filtro por mês / pesquisa por rota ou aeronave
- Considerar exportação CSV simples

---

## 🚀 Próximos Passos Imediatos

1. **Agora** → Testar o logbook com voos reais — adicionar os primeiros voos reais
2. **Semana 2** → Adicionar edição de entradas + filtro por mês
3. **Semana 3-4** → Agenda + cálculo FTL simples (Módulo 1 básico)
4. **Mês 2** → Integrar Claude API: primeira pergunta em linguagem natural ao logbook
5. **Mês 2-3** → Mostrar a pilotos amigos e recolher feedback honesto

---

## 📋 Como usar este ficheiro

1. **Claude Code:** coloca este ficheiro na raiz do repositório como `CLAUDE.md` — é lido automaticamente
2. **Claude.ai Project:** faz upload deste ficheiro ao teu Project "PilotAssistante"
3. **Fim de cada sessão:** pede ao Claude para gerar o resumo da sessão e adiciona aqui em "Registo de Sessões"
4. **Início de cada sessão:** o Claude já sabe tudo — basta abrir o Project e continuar

---

*Última actualização: Sessão 2 — 14 Junho 2026*
