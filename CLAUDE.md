# ✈️ PilotAssistante — Ficheiro de Contexto & Memória do Projecto

> **Memória viva do projecto.** Lido automaticamente pelo Claude Code (raiz do repo) e carregado no Project do claude.ai. Actualizar no final de cada sessão.

---

## ⚡ Estado Rápido — Lê isto primeiro

| | |
|---|---|
| **Versão actual** | v0.5 |
| **Última sessão** | Sessão 3 — 15 Junho 2026 |
| **Módulo em construção** | Módulo 2 — Logbook Inteligente |
| **Próxima tarefa** | Filtros + pesquisa (por mês, rota, aeronave) |
| **Deploy activo** | GitHub Pages ✅ |
| **Linguagem da app** | Inglês |

### Estado dos 15 Módulos

| # | Módulo | Estado |
|---|---|---|
| 1 | Agenda & Legalidades EASA | ⬜ Por fazer |
| 2 | Logbook Inteligente | 🟡 Em progresso (v0.5) |
| 3 | Documentos & Validades | ⬜ Por fazer |
| 4 | Centro de Treino | ⬜ Por fazer |
| 5 | Memórias & Diário | ⬜ Por fazer |
| 6 | Oportunidades de Emprego | ⬜ Por fazer |
| 7 | Notícias de Aviação | ⬜ Por fazer |
| 8 | Briefing Inteligente | ⬜ Por fazer |
| 9 | Calculadora Salário & Per Diem | ⬜ Por fazer |
| 10 | Preparação de Entrevistas | ⬜ Por fazer |
| 11 | Diário de Fadiga | ⬜ Por fazer |
| 12 | Widget Ecrã Principal | ⬜ Por fazer |
| 13 | Relatório Anual Automático | ⬜ Por fazer |
| 14 | Interface de Voz 🔴 CRÍTICO | ⬜ Por fazer |
| 15 | Wellbeing: Sono & Jet Lag 🔴 CRÍTICO | ⬜ Por fazer |

---

## 🤝 Regras de Colaboração — OBRIGATÓRIO LER

> Estas regras existem para proteger o trabalho já feito. Seguir sempre, sem excepções.

1. **NUNCA gerar ficheiros completos do zero.** Editar apenas o bloco específico que precisa de mudar.
2. **SEMPRE pedir o ficheiro actual** antes de editar. Se o utilizador não o partilhar, pedi-lo explicitamente.
3. **Indicar claramente o que muda:** "substitui as linhas X a Y por este código" ou "adiciona esta função após a linha X".
4. **NUNCA sobrescrever trabalho já feito.** Se não tens o ficheiro actual, não editas.
5. **Confirmar sempre** o que está implementado antes de sugerir algo — pode já existir.
6. **No final de cada sessão**, gerar automaticamente o bloco de actualização deste ficheiro, mesmo que o utilizador não peça.
7. **Avisar sempre:** "Não te esqueças de actualizar o CLAUDE.md no GitHub e no Project."

---

## 🗂️ Estrutura do Repositório (v0.5)

```
pilotassistante/
├── CLAUDE.md              ← este ficheiro (memória do projecto)
├── index.html             ← estrutura HTML + authority overlay
├── manifest.json          ← PWA manifest (theme-color: #2825A0)
├── css/
│   └── style.css          ← design Índigo Profundo + ícones + mobile
└── js/
    ├── app.js             ← lógica completa: authority-aware, edit, block time
    └── authorities.js     ← perfis EASA e FAA (escalável para novas autoridades)
```

**O que está implementado em cada ficheiro:**

`index.html` — formulário de voo/simulador, drawer lateral, painel de estatísticas, lista de entradas, authority overlay (primeiro uso), estrutura de navegação bottom bar

`css/style.css` — paleta Índigo Profundo, tipografia Space Grotesk + Space Mono, drawer, cards, badges de autoridade, responsive mobile (empilha abaixo 500px), `.hidden { display: none !important }`

`js/app.js` — CRUD completo de entradas, toggle Flight/Simulator, auto-cálculo block times (overnight incluído), validação Off-Block/On-Block obrigatórios, edição via drawer, eliminação com confirmação, localStorage, lógica SP/MP→SE/ME, campos contextuais PIC Name/Instructor

`js/authorities.js` — perfis EASA e FAA completos, template UK CAA comentado, sistema de activação por localStorage

---

## 🎨 Identidade Visual

**Estilo:** Minimal Elegant | **Paleta:** Índigo Profundo

| Token CSS | Valor | Uso |
|---|---|---|
| `--accent` | `#2825A0` | Cor principal — botões, nav activo |
| `--accent-bg` | `#EEEDF8` | Fundo de badges e highlights |
| `--accent-border` | `#B8B6E0` | Bordas de elementos activos |
| `--text` | `#0B0929` | Texto principal |
| `--text-muted` | `#8A88B0` | Labels, texto secundário |
| `--border` | `#DDDAF2` | Bordas gerais |
| `--border-subtle` | `#ECEBF8` | Separadores entre linhas |

**Tipografia:** `Space Grotesk` (UI) + `Space Mono` (dados, horas, ICAO codes)
**Icons:** Tabler Icons 3.11.0 via CDN jsdelivr

---

## 🛠️ Stack Tecnológica

| Camada | Ferramenta | Custo | Notas |
|---|---|---|---|
| Frontend | PWA (HTML + CSS + JS puro) | Grátis | Sem frameworks |
| Hospedagem | GitHub Pages → Netlify | Grátis | URL activo |
| Backend / Auth | Supabase | Grátis (início) | Fase 2 — ainda não implementado |
| Pagamentos | Stripe | 2,9%/transacção | Fase 3 |
| IA | Claude API (Anthropic) | Por uso | Haiku geral, Sonnet para FTL |
| App nativa | Capacitor (Ionic) | Grátis | Fase 3 — mesmo código PWA |
| Icons | Tabler Icons 3.11.0 | Grátis | CDN jsdelivr |
| Controlo de versão | GitHub | Grátis | Repo: pilotassistante (Private) |

---

## 📦 Módulo 2 — Logbook Inteligente (detalhe)

### O que está feito (v0.5) ✅

- Formulário completo com todos os campos EASA e FAA
- Toggle Flight / Simulator (campos mudam automaticamente)
- Simulador: só Date + FSTD Type + Session Duration + Remarks (Part-FCL correcto)
- Painel de estatísticas: Total HRS, PIC HRS, IFR HRS, Night HRS, Simulator, This Month
- Lista de entradas com linhas detalhadas e ícones Tabler
- Edição de entradas (clicar na linha abre drawer preenchido)
- Eliminar entrada com confirmação
- Armazenamento localStorage (offline, sem servidor)
- Deploy no GitHub Pages ✅
- Design Minimal Elegant + Índigo Profundo
- Authority Profile System: EASA + FAA, escalável
- Off-Block e On-Block obrigatórios — validação impede submissão sem eles
- Total auto-calculado dos block times (overnight incluído), editável manualmente
- SP/MP → SE/ME aparece só quando Single Pilot (lógica EASA correcta)
- Responsive mobile (drawer full-width, form-row empilha abaixo de 500px)
- T/O e LDG default = 1

### O que falta ⬜

- Filtro por mês / pesquisa por rota ou aeronave ← **próxima tarefa**
- Exportação CSV / PDF
- Importação via IA (foto, PDF, CSV)
- Consulta em linguagem natural (Claude API)

### Formato Universal Interno (campos)

Date, Origin (ICAO), Destination (ICAO), Off-block, On-block, Aircraft Type, Registration, SE/ME, SP/MP, Total Hours, Day Hours, Night Hours, IFR, VFR, XC Hours (FAA), Solo Hours (FAA), Role (PIC/Co-Pilot/SIC/Dual/Instructor), PIC Name, Instructor Name, Take-offs Day, Take-offs Night, Landings Day, Landings Night, Instrument Approaches (number + type), FSTD Type, FSTD Hours, Remarks, Authority (EASA/FAA/etc.)

### Diferenças EASA vs FAA

| Campo | EASA | FAA |
|---|---|---|
| Operations (MP/SP) | ✅ | ❌ escondido |
| SE/ME | só quando SP | sempre visível |
| Cross-Country (XC) | ❌ | ✅ |
| Solo Hours | ❌ | ✅ |
| Co-Pilot | "Co-Pilot (F/O)" | "SIC" |
| Simulador | FFS/FTD/FNPT/BITD | FFS/FTD/ATD/AATD/BATD |
| Approaches | ILS CAT I/II/III… | ILS/LOC/LDA… |

### Authority Profile System

Ficheiro `js/authorities.js` — adicionar nova autoridade = acrescentar um objecto.
Template UK CAA incluído comentado. Primeiro uso: ecrã de selecção. Badge no header para mudar a qualquer momento.

---

## 🗺️ Plano de Desenvolvimento

### FASE 1 — Versão Pessoal (Mês 1-3)

| Semanas | Objectivo | Estado |
|---|---|---|
| 1-2 | Logbook básico | ✅ Concluído (v0.5) |
| 3-4 | Filtros + Exportação CSV + Agenda FTL básica | 🟡 A seguir |
| 5-6 | Integrar Claude API | ⬜ Por fazer |
| 7-8 | Meteorologia + NOTAMs | ⬜ Por fazer |
| 9-12 | Polir, testar, corrigir bugs | ⬜ Por fazer |

### FASE 2 — Beta com Pilotos (Mês 4-6)

- Adicionar Supabase (logins + cloud sync — substituir localStorage)
- Partilhar link da PWA com 10-20 pilotos amigos
- Criar grupo de feedback (WhatsApp ou Discord)
- Activar Notificações Push
- Interface de Voz + Wellbeing (módulos críticos)

### FASE 3 — Produto Comercial (Mês 7-12)

- Implementar Stripe (Free vs Premium €9,99/mês)
- Publicar pilotassistante.com
- Converter para app nativa com Capacitor
- Submeter à App Store (99€/ano) e Google Play (25€ único)
- GDPR & Privacidade completos

---

## 💰 Modelo de Negócio

**Grátis:** Logbook 50 voos, meteorologia simples, agenda básica, 5 perguntas IA/dia

**Premium €9,99/mês:** Logbook ilimitado + IA, FTL automático, treino completo, NOTAMs, emprego, memórias, IA ilimitada

| Ano | Subscribers | Receita/mês | Lucro/ano |
|---|---|---|---|
| Ano 1 | 0-20 | €0-200 | Investimento |
| Ano 2 | 20-200 | €200-2.000 | ~€10.000 |
| Ano 3 | 200-1.000 | €2.000-9.990 | ~€60.000 |
| Ano 4 | 1.000-2.500 | €9.990-24.975 | ~€170.000 |
| Ano 5 | 2.500-3.500 | €24.975-34.965 | ~€300.000 |

**Meta:** 1% dos ~350.000 pilotos comerciais mundiais = ~3.500 subscribers (Ano 5)

---

## 💶 Custos Claude API (2026)

| Modelo | Input/MTok | Output/MTok | Uso |
|---|---|---|---|
| Haiku 4.5 | $1,00 | $5,00 | Maioria das funções |
| Sonnet 4.6 | $3,00 | $15,00 | FTL, briefing complexo |

Fase 1 < $1/mês · Fase 2 ~$5-10/mês · 100 subs ~$6 · 1k subs ~$60 · 3.5k subs ~$210
*Com prompt caching: até -90% nos custos de input.*

---

## 🐛 Bugs Conhecidos

*Nenhum activo.*

Resolvidos na Sessão 3:
- ~~`.hidden` sobrescrito por `.sim-only { display: flex }` → fix com `!important`~~
- ~~app.js antigo no repositório impedia o drawer de abrir~~
- ~~FSTD Type aparecia em modo Flight~~

---

## ✅ Decisões de Produto (resumo por sessão)

### Sessão 1
GitHub Pages (hospedagem) · Supabase (auth + BD, Fase 2) · RLS nativo · PWA primeiro, App Store na Fase 3 via Capacitor · Roster via IA não via API (piloto não tem acesso) · 4 métodos importação roster · Logbook formato universal interno · 4 templates exportação (EASA/FAA/PDF/CSV) · Offline obrigatório desde início · GDPR antes do lançamento · Push Notifications na Fase 2 · Comunidade Pilotos REJEITADO · 15 módulos definidos e completos

### Sessão 2
localStorage na Fase 1 · Estrutura css/ e js/ desde o início · App em inglês · Aceita horas em "2:30" e "2.5" · Toggle Flight/Simulator · Campos contextuais PIC Name/Instructor · Horas simulador separadas do voo real · 4 funções: PIC/Co-Pilot/Dual/Instructor

### Sessão 3
Minimal Elegant + Índigo Profundo (#2825A0) definitivo · Space Grotesk + Space Mono definitivos · Drawer lateral para formulário · Tabler Icons 3.11.0 CDN · `authorities.js` único para novas autoridades · Block times opcionais mas auto-calculam Total · Off-Block e On-Block obrigatórios (Part-FCL) · Simulador só 4 campos · T/O e LDG default = 1 · Edição via drawer · `.hidden !important` evita conflitos CSS

### Sessão 4
Nunca gerar ficheiros completos do zero — editar apenas blocos específicos · Sempre pedir ficheiro actual antes de editar

---

## 📝 Registo de Sessões

### Sessão 1 — Junho 2026
Definição completa do produto, stack, 15 módulos, modelo de negócio, projecções, CLAUDE.md criado.

### Sessão 2 — 14 Junho 2026
Logbook v0.1→v0.2: index.html, css/style.css, js/app.js, manifest.json. Formulário EASA, toggle Flight/Simulator, localStorage, GitHub Pages.

### Sessão 3 — 15 Junho 2026
Logbook v0.3→v0.5: identidade visual definitiva (Minimal Elegant + Índigo Profundo), Authority Profile System (EASA+FAA), edição de entradas, Off-Block/On-Block obrigatórios, fix bugs CSS e drawer, responsive mobile.

### Sessão 4 — 16 Junho 2026
Discussão sobre Claude Code vs claude.ai Project — como o CLAUDE.md funciona como memória partilhada. Regra estabelecida: nunca gerar ficheiros completos, editar sempre blocos específicos. CLAUDE.md melhorado e reestruturado.

**Próxima sessão:**
- Filtros por mês / pesquisa por rota ou aeronave
- Exportação CSV simples
- Início do Módulo 1 — Agenda FTL básica

---

## 🚀 Próximos Passos

1. **Agora** → Testar com voos reais — adicionar os primeiros voos ao logbook v0.5
2. **Próxima sessão** → Filtros + pesquisa (mês, rota, aeronave) no Logbook
3. **Semana 3-4** → Exportação CSV + início Agenda FTL (Módulo 1 básico)
4. **Mês 2** → Claude API: primeira pergunta em linguagem natural ao logbook
5. **Mês 2-3** → Beta com pilotos amigos

---

## 📋 Como usar este ficheiro

1. **Claude Code** → na raiz do repo como `CLAUDE.md` — lido automaticamente
2. **Claude.ai Project** → upload nos Ficheiros do Project
3. **Fim de cada sessão** → Claude gera bloco de update → copias → commit GitHub → upload no Project
4. **Início de cada sessão** → Claude lê e confirma o estado actual antes de começar

---

*Última actualização: Sessão 4 — 16 Junho 2026 (v0.5)*
