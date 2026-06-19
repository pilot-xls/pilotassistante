# ✈️ PilotAssistante — Ficheiro de Contexto & Memória do Projecto

> **Memória viva do projecto.** Lido automaticamente pelo Claude Code (raiz do repo) e carregado no Project do claude.ai. Actualizar no final de cada sessão.

---

## ⚡ Estado Rápido — Lê isto primeiro

| | |
|---|---|
| **Versão actual** | v0.15 |
| **Última sessão** | Sessão 15 — 19 Junho 2026 |
| **Módulo em construção** | Agenda & Legalidades EASA (Módulo 1) |
| **Próxima tarefa** | Agenda FTL básica (Módulo 1) |
| **Deploy activo** | GitHub Pages ✅ |
| **Linguagem da app** | Inglês |

### Estado dos 15 Módulos

| # | Módulo | Estado |
|---|---|---|
| 1 | Agenda & Legalidades EASA | ⬜ Por fazer |
| 2 | Logbook Inteligente | ✅ Completo (v0.15) |
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

## 📱 Regras Mobile / iOS Safari — OBRIGATÓRIO RESPEITAR

> Regras descobertas em produção. Violar qualquer uma destas causa bugs visuais graves no Safari mobile.

1. **`font-size` mínimo 16px em todos os inputs no mobile.**
   iOS Safari faz zoom automático ao focar qualquer input com `font-size < 16px`, deslocando toda a página lateralmente. Sempre adicionar ao `@media (max-width: 500px)`:
   ```css
   .form-group input, .form-group select, .form-group textarea { font-size: 16px; }
   ```

2. **Drawers/modais full-screen: usar `left: 0; right: 0; width: 100%` — nunca `100vw`.**
   `100vw` no iOS inclui a largura da scrollbar e pode causar overflow. Usar sempre:
   ```css
   .drawer { left: 0; right: 0; width: 100%; max-width: 100%; height: 100dvh; }
   ```

3. **Popups absolutamente posicionados: nunca `right` negativo no mobile.**
   `right: -Xpx` empurra o popup para fora do ecrã. No mobile usar sempre `right: 0` ou `left: 0`.

4. **Sempre `overflow-x: hidden` em `html` e `body`.**
   Previne scroll horizontal acidental causado por qualquer elemento que ultrapasse o viewport.

5. **Bloquear scroll do body quando um drawer está aberto.**
   ```js
   // ao abrir:  document.body.style.overflow = 'hidden';
   // ao fechar: document.body.style.overflow = '';
   ```

6. **Inputs `type="time"` e `type="date"` no iOS: normalizar com:**
   ```css
   -webkit-appearance: none; min-width: 0; width: 100%;
   ```
   Sem isto, os pickers iOS têm tamanhos intrínsecos diferentes e quebram layouts de grid.

---

## 🗂️ Estrutura do Repositório (v0.7)

```
pilotassistante/
├── CLAUDE.md              ← este ficheiro (memória do projecto)
├── index.html             ← Dashboard (ecrã de entrada da PWA)
├── logbook.html           ← Logbook completo (renomeado de index.html)
├── dashboard_minimal.html ← protótipo histórico (pode ser apagado)
├── manifest.json          ← PWA manifest (theme-color: #2825A0, start_url: "/")
├── css/
│   ├── style.css          ← design Índigo Profundo + ícones + mobile (Logbook)
│   ├── dashboard.css      ← estilos do Dashboard
│   └── nav.css            ← bottom navigation bar + settings modal
├── js/
│   ├── app.js             ← lógica completa do Logbook: CRUD, validação, import/export
│   ├── authorities.js     ← perfis EASA e FAA (escalável para novas autoridades)
│   ├── dashboard.js       ← lógica do Dashboard: grid, gauges, MODULE_LINKS
│   └── nav.js             ← bottom nav injectada em todas as páginas
└── icons/
    ├── icon-192.png       ← PWA icon (cor #2825A0)
    └── icon-512.png       ← PWA icon (cor #2825A0)
```

> **Nota Sessão 15:** `dashboard_minimal.html` permanece no repo como referência histórica (pode ser apagado). O Dashboard está integrado e em produção.

**O que está implementado em cada ficheiro:**

`index.html` — Dashboard: top bar, painel de detalhe (status pill + nome + subtítulo + manómetros + botão Open), grid 5×3 de módulos, barra de progresso, navegação por teclado

`logbook.html` — formulário de voo/simulador, drawer lateral, painel de estatísticas, lista de entradas, authority overlay (primeiro uso), barra de filtros (search + popup avançado), import/export CSV

`css/style.css` — paleta Índigo Profundo, tipografia Space Grotesk + Space Mono, drawer, cards, badges de autoridade, filter bar + popup, responsive mobile (empilha abaixo 500px), `.hidden { display: none !important }`

`css/dashboard.css` — estilos do Dashboard: shell, top bar, detail panel, gauge zone (min-height fixo), module grid, progress bar

`css/nav.css` — bottom navigation bar (3 itens: Logbook · Home · Settings) + settings sheet modal

`js/app.js` — CRUD completo de entradas, toggle Flight/Simulator, auto-cálculo block times (overnight incluído), validação Off-Block/On-Block + rota + aeronave + matrícula + role obrigatórios, Night HRS e IFR HRS opcionais (vazio = 00:00), Day HRS e VFR HRS auto-calculados, validações: Night≤Total, IFR≤Total, LDG=T/O, edição via drawer, eliminação com confirmação, localStorage, lógica SP/MP→SE/ME, campos contextuais, filtros, import/export CSV

`js/authorities.js` — perfis EASA e FAA completos; template UK CAA comentado; sistema de activação por localStorage

`js/dashboard.js` — grid de módulos, gauges (lê dados reais do `pa_entries` no localStorage para Logbook), MODULE_LINKS, navegação por teclado, GAUGE_DATA

`js/nav.js` — injeta bottom nav em qualquer página, detecta item activo por URL, settings modal standalone (EASA/FAA sem depender do app.js)

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

## 🧭 Dashboard / Home Menu (UI Shell) — NOVO Sessão 14

> Não é um dos 15 módulos numerados — é o ecrã de navegação/entrada da app, o ponto de partida para todos os módulos.

### O que foi explorado e rejeitado

- **Engine fan menu (motor a jacto rotativo)** — três iterações (SVG → Canvas 2D com lighting/OGVs/inlet lip 3D → tentativa Three.js/WebGL). Visualmente ambicioso mas:
  - Three.js sem HDRI real fica pior do que Canvas 2D
  - Canvas 2D fotorrealista tem tecto de qualidade sem assets externos (foto IA ou HDRI)
  - **Decisão:** abandonado por agora. Pode voltar-se a explorar na Fase 2/3 com uma foto gerada por IA como base.
- **Navigation Display (compass rose EFIS), MCDU/FMS, Glass Cockpit Cards, PFD Tape** — 4 conceitos "cockpit-themed" mostrados lado a lado. **Rejeitados** — utilizador não queria estética de instrumentos de cockpit.
- **Dashboard minimalista em fundo preto** — **Rejeitado**, utilizador não gosta de fundo preto.

### O que foi aprovado ✅

**Dashboard minimalista moderno, paleta do projecto (Índigo Profundo, fundo claro)** — ficheiro de protótipo: `dashboard_minimal.html`

**Layout:**
- Top bar: logo + versão
- **Painel de detalhe** (topo) — mostra o módulo seleccionado: status pill, nome grande, subtítulo, **zona de manómetros**, posição (X/15) + botão "Open module"
- **Grid 5×3** — todos os 15 módulos visíveis sem scroll, cada card com número + código de 3 letras
- Barra de progresso fina (posição no conjunto de módulos)
- ~~Dica de atalhos de teclado~~ — **removida** (Sessão 14, pedido explícito do utilizador). Navegação por teclado (setas + Enter) continua activa, só a dica visual desapareceu.

**Interacção:**
- Toca num card → painel de detalhe actualiza (fade transition)
- Setas do teclado + Enter → navegação completa sem rato
- "Open module" → navega para a página real do módulo (ver `MODULE_LINKS` abaixo)

**Sistema de Manómetros (gauges) — núcleo da Sessão 14:**
- Gauge semicircular SVG (arco 180°), cores por threshold: índigo normal → âmbar ≥75% → vermelho ≥92%
- `GAUGE_DATA` no script define que módulos têm métricas e quais:
  - **Logbook (LOG):** Total Hours, PIC Hours, Night Hours, IFR Hours
  - **FTL Schedule (FTL):** 7 Dias (/60h), 28 Dias (/110h), 12 Meses (/1000h), FDP Hoje (/13h) — limites EASA Part-FCL reais
  - **Todos os outros módulos:** estado "Métricas em breve" em vez de inventar dados — nunca mostra gauges falsos para módulos sem lógica implementada
- Tag visual no canto do painel: "dados reais" vs "dados de exemplo" — para nunca confundir mock data com dados a sério depois de ligar ao localStorage real
- **Os valores actuais dos gauges são dados de EXEMPLO** (hardcoded no JS) — ainda não lêem o `localStorage` real do Logbook

**Sistema de Links (`MODULE_LINKS`):**
```js
const MODULE_LINKS={
  LOG:'logbook.html',   // ← placeholder, ajustar ao path real
  FTL:'#', DOC:'#', ... // '#' = sem página própria ainda
};
```
- Se houver link real definido → `doOpen()` navega via `window.location.href`
- Se não houver (`'#'`) → fallback dispara `sendPrompt()` (placeholder de desenvolvimento)

### O que falta ⬜

1. **Confirmar o path real da página do Logbook** — utilizador mencionou que já a tem feita e "lavamos" (testada). Falta o nome/path exacto do ficheiro para preencher `MODULE_LINKS.LOG` correctamente.
2. **Ligar os gauges do Logbook a dados reais** — substituir os valores de exemplo por leitura real do `localStorage` (precisa do `js/app.js` actual para saber a estrutura exacta das entries gravadas).
3. **Decidir se o Dashboard substitui ou complementa a bottom nav bar** já existente no `index.html`.
4. **Integrar `dashboard_minimal.html` na estrutura do repo** (`pilotassistante/`) — está como protótipo standalone fora do projecto.
5. Eventualmente, gauges definidos para mais módulos à medida que forem sendo implementados (Documents, Fatigue Log, etc.).

---

## 📦 Módulo 2 — Logbook Inteligente (detalhe)

### O que está feito (v0.13) ✅

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
- Off-Block e On-Block obrigatórios — labels "Off-Block UTC" / "On-Block UTC" (texto simples)
- Total auto-calculado dos block times (overnight incluído), editável manualmente
- **Day HRS e VFR HRS auto-calculados** (Day = Total − Night, VFR = Total − IFR)
- **Night HRS e IFR HRS opcionais** — vazio tratado como 00:00
- **Todos os inputs de horas usam `type="time"`** (picker nativo HH:MM, igual ao Off/On-Block)
- SP/MP → SE/ME aparece só quando Single Pilot (lógica EASA correcta)
- Responsive mobile (drawer full-width, form-row empilha abaixo de 500px)
- T/O e LDG default = 1
- **Validações completas:** Night ≤ Total, IFR ≤ Total, LDG total = T/O total (aplicam em new + edit)
- **Campos obrigatórios no submit:** Date, Off-Block, On-Block, Origin, Destination, Aircraft Type, Registration, Role
- **EASA roles:** PIC, PICUS (mostra PIC supervisor), Co-Pilot (F/O), SPIC (mostra Instructor), Dual, Instructor, FE (mostra examinando)
- PWA icons: `icons/icon-192.png` e `icons/icon-512.png`
- **Filtros:** barra com pesquisa de texto (rota, AC, reg, role) + ícone de filtros avançados
- **Popup de filtros avançados:** date range From/To, Role dropdown, Entry type (All/Flight/Sim)
- Ícone de filtro fica accent quando há filtros activos; × limpa tudo

- **Exportação CSV** — botão "Export CSV" na lista; exporta entradas filtradas (ou todas se sem filtro); UTF-8 BOM para Excel; 30 colunas (universal EASA+FAA); `getFilteredEntries()` partilhada com render

- **Importação CSV/Excel** — modal 3 passos: upload (drag&drop), mapeamento de 36 campos com auto-detecção por aliases, preview 5 entradas, confirmação. Suporte CSV (delimitador auto-detectado, BOM UTF-8) e .xlsx/.xls via SheetJS CDN. **Formato EASA físico coberto na íntegra:**
  - **Colunas de role por horas** — `picHours`, `picusHours`, `copilotHours`, `dualHours`, `instructorHours`, `spicHours`, `feHours`: role inferido da coluna com valor; horas usadas como `totalTime` fallback
  - **Colunas SP SE / SP ME / MP** — `spseHours`, `spmeHours`, `mpHours`: `operations` + `engine` inferidos da coluna com valor; horas usadas como `totalTime` fallback
  - **SIM Date separada** — `simDate`: usado como fallback de data quando a coluna "Date" está vazia (linhas de simulador em logbooks físicos)
  - **`normalizeImportRole()`** — converte texto livre ("Co-Pilot (F/O)", "F/O", "SIC", "CFI", "Dual Received"…) para valores internos correctos
  - **Atenção:** coluna "Instructor - Time" (com traço) não auto-detecta — mapear manualmente para "Instructor Hours" na UI

### O que falta ⬜

- Integração API apps externas: LEON, Aims, Crewlink (Fase 2)
- Foto → 1 voo: tirar foto à caderneta do avião, preenche uma entrada (Claude API, Fase 2+)
- Consulta em linguagem natural (Claude API)
- **Ligação ao Dashboard:** expor as 4 métricas-chave (Total/PIC/Night/IFR Hours) de forma fácil de ler a partir de fora do módulo, para os gauges do Dashboard usarem dados reais

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

### Autoridades de Aviação — Prioridade de Implementação

Apenas autoridades com formato de logbook distinto são relevantes.

**🔴 Prioridade 1 — Já implementadas ou imediatas**

| Sigla | Região/País | Cobertura |
|---|---|---|
| EASA | União Europeia + Suíça, Noruega, Islândia... | ~50 países |
| FAA | Estados Unidos | EUA |
| UK CAA | Reino Unido | GB (pós-Brexit) |

**🟡 Prioridade 2 — Grande mercado, formato próprio**

| Sigla | Nome completo | País |
|---|---|---|
| TCCA | Transport Canada Civil Aviation | Canadá |
| CASA | Civil Aviation Safety Authority | Austrália |
| CAA-NZ | Civil Aviation Authority | Nova Zelândia |
| DGCA | Directorate General of Civil Aviation | Índia |
| GCAA | General Civil Aviation Authority | UAE / Dubai |
| ANAC | Agência Nacional de Aviação Civil | Brasil |

**🟢 Prioridade 3 — Mercados emergentes / nicho**

| Sigla | País |
|---|---|
| CAAC | China |
| JCAB | Japão |
| SACAA | África do Sul |
| DGAC | México |
| GACA | Arábia Saudita |

---

## 🗺️ Plano de Desenvolvimento

### FASE 1 — Versão Pessoal (Mês 1-3)

| Semanas | Objectivo | Estado |
|---|---|---|
| 1-2 | Logbook básico | ✅ Concluído (v0.6) |
| 3 | Filtros + pesquisa (mês, rota, aeronave) | ✅ Concluído (v0.7) |
| 4 | Exportação CSV + Importação CSV/Excel | ✅ Concluído (v0.13) |
| 4.5 | Dashboard / Home Menu (UI shell) | 🟡 Conceito aprovado, por integrar |
| 5 | Agenda FTL básica (Módulo 1) | ⬜ Por fazer |
| 6-7 | Integrar Claude API (consulta linguagem natural + foto→1 voo) | ⬜ Por fazer |
| 8-9 | Meteorologia + NOTAMs | ⬜ Por fazer |
| 10-12 | Polir, testar, corrigir bugs | ⬜ Por fazer |

### FASE 2 — Beta com Pilotos (Mês 4-6)

- Adicionar Supabase (logins + cloud sync — substituir localStorage)
- Partilhar link da PWA com 10-20 pilotos amigos
- Criar grupo de feedback (WhatsApp ou Discord)
- Activar Notificações Push
- Interface de Voz + Wellbeing (módulos críticos)
- Integração API apps externas: LEON, Aims, Crewlink (sync automático de rosters/logbook)
- Foto → 1 voo via Claude API (caderneta do avião)
- Possível revisita ao Engine Fan Menu com foto IA de alta resolução como fundo (se fizer sentido nessa altura)

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

Resolvidos na Sessão 5:
- ~~`/* e */` no comentário de cabeçalho do `authorities.js` fechava prematuramente o bloco `/* */`, causando `SyntaxError: Unexpected identifier 'Preenche'` e `getAuthority is not defined`~~
- ~~`document.getElementById('f-day').value` e `f-vfr` causavam `TypeError` após os campos serem removidos do HTML~~

Resolvidos na Sessão 8:
- ~~Drawer "New Entry" flutuava no iOS Safari (não ficava justo às laterais) → fix: `left:0; right:0; width:100%; height:100dvh`~~
- ~~Popup de filtro avançado saía fora do ecrã no mobile com `right:-36px` → fix: `right:0`~~
- ~~Inputs no drawer desalinhados e página a deslocar lateralmente no iOS Safari → fix: `font-size:16px` em todos os inputs no mobile (iOS faz zoom automático abaixo de 16px)~~

Resolvidos na Sessão 12:
- ~~`entries-header` com título "Flight Log" e dois botões (Import + Export CSV) ficava squished no mobile → fix: `flex-direction:column` na `.entries-header` em mobile, botões empilham abaixo do título~~

Resolvidos na Sessão 11:
- ~~inputs `type="time"` no drawer (Off-Block, On-Block, Night, IFR) com altura quase nula no iOS Safari → fix: `min-height: 40px` via `.is-ios` e `@media (max-width:500px)`~~
- ~~Radio buttons MP/SP em Operations empilhados verticalmente no iOS Safari → fix: `width:auto` em `input[type="radio"]` e `input[type="checkbox"]` dentro de `.form-group` (override do `width:100%` geral)~~
- ~~Header a fazer scroll com a página (position:sticky quebrado pelo overflow-x:hidden no body) → fix: `position:fixed` + `padding-top:64px` no `#app`~~
- ~~Badge da autoridade no header mostrava texto ("EASA"/"FAA") → fix: mostra agora o emoji da bandeira (`auth.flag`), tooltip com nome completo~~

Resolvidos na Sessão 10:
- ~~Dashboard de estatísticas não actualizava com filtros → fix: `renderStats()` usa `getFilteredEntries()`, chamado dentro de `renderEntries()`~~
- ~~Export CSV não respeitava filtros activos → fix: `getFilteredEntries()` extraída como helper partilhado~~
- ~~Export CSV universal (todas as colunas) → fix: colunas dinâmicas baseadas na autoridade activa (EASA/FAA); filename inclui autoridade~~
- ~~Filtros avançados limitados → fix: popup expandido com Airport, Aircraft Type, Registration, Operations SP/MP (EASA), Engine SE/ME, Night, IFR~~
- ~~Popup de filtro com scroll lateral no mobile → fix: `position:fixed` + `left:14px; right:14px`; top/max-height calculados via JS (`getBoundingClientRect`)~~
- ~~Inputs date no popup overflow no iOS → fix: `overflow-x:hidden`, `font-size:16px`, `-webkit-appearance:none`, `min-width:0`, `max-width:100%` nos inputs do popup~~
- ~~`input[type="date"]` no popup vazio sem altura no iOS → fix: `min-height:40px` via classe `.is-ios` detectada por JS (`navigator.userAgent`)~~
- ~~Date inputs no filtro popup muito grandes no desktop → fix: `fp-date-row` passa a `flex-direction:column`~~

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

### Sessão 5
`type="time"` para todos os campos de horas · Day HRS e VFR HRS auto-calculados (não inseridos) · Night HRS e IFR HRS tornaram-se obrigatórios (00:00 se nenhum) · Validações: Night≤Total, IFR≤Total, LDG=T/O · Badge UTC no Off-Block/On-Block · EASA roles: PICUS + SPIC + FE adicionados · PWA icons criados

### Sessão 6
Estratégia de importação redefinida: importação CSV/Excel em JS puro (sem IA) vem logo a seguir à exportação CSV · Importação via foto REJEITADA para logbook completo · Foto via Claude API aceite apenas para 1 voo (caderneta do avião) · Integração API apps externas (LEON, Aims, Crewlink) planeada para Fase 2 · Lista de autoridades de aviação estratificada em 3 prioridades: P1 (EASA, FAA, UK CAA), P2 (TCCA, CASA, CAA-NZ, DGCA, GCAA, ANAC), P3 (CAAC, JCAB, SACAA, DGAC, GACA)

### Sessão 7
Filtros implementados: pesquisa de texto (rota/AC/reg/role) + popup de filtros avançados (date range, role dropdown, Flight/Sim toggle) · Month dropdown removido a favor do popup · Off-Block/On-Block labels simplificados (sem badge UTC) · Origin, Destination, Aircraft Type, Registration, Role passaram a ser obrigatórios no submit · Night HRS e IFR HRS passaram a ser opcionais (vazio = 00:00)

### Sessão 8
iOS Safari fixes: drawer flush às laterais (left/right/width 100%, 100dvh, body scroll lock) · filter popup corrigido (right:0 em vez de right:-36px) · inputs normalizados a font-size 16px no mobile (previne zoom automático iOS) · Secção "Regras Mobile / iOS Safari" adicionada ao CLAUDE.md como referência permanente

### Sessão 13
Import EASA físico: roles como colunas de horas (não campo de texto) · SP SE / SP ME / MP como colunas de horas · SIM Date separada da Date dos voos · `normalizeImportRole()` para texto livre · coluna "Instructor - Time" (com traço) NÃO auto-detecta — mapear manualmente · totalTime fallback: roleInferredTime → opsInferredTime → simDurVal (por ordem de prioridade)

### Sessão 14
Engine fan menu (motor a jacto rotativo) explorado em 3 iterações (SVG, Canvas 2D fotorrealista, Three.js/WebGL) — **abandonado**: Three.js sem HDRI fica pior que Canvas 2D; tecto de qualidade atingido sem assets externos · 4 conceitos cockpit-themed (Navigation Display, MCDU/FMS, Glass Cockpit Cards, PFD Tape) mostrados lado a lado — **rejeitados**, utilizador não quer estética de instrumentos · Dashboard minimalista em preto — **rejeitado**, sem fundo preto · **Dashboard aprovado:** minimalista moderno, paleta do projecto (fundo claro + índigo), grid 5×3 + painel de detalhe com manómetros (gauges) por módulo · Sistema de gauges: só mostra métricas para módulos com lógica definida (Logbook, FTL), restantes mostram "em breve" honesto em vez de dados falsos · Sistema `MODULE_LINKS` para navegação real para páginas de módulo já desenvolvidas · Dica de atalhos de teclado removida do rodapé do dashboard (mantém-se funcional, só a UI visual saiu)

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

### Sessão 5 — 16 Junho 2026
Logbook v0.5→v0.6: fix SyntaxError no authorities.js, PWA icons, todos os inputs de horas passaram a `type="time"`, Day HRS e VFR HRS tornaram-se auto-calculados, Night HRS e IFR HRS tornaram-se obrigatórios, validações completas (Night/IFR≤Total, LDG=T/O), badge UTC nos block times, roles EASA expandidos (PICUS, SPIC, FE).

### Sessão 6 — 16 Junho 2026
Redefinição da estratégia de importação: CSV/Excel em JS puro (sem IA) logo a seguir à exportação · Foto para 1 voo via Claude API na Fase 2+ · Integração API LEON/Aims/Crewlink na Fase 2 · CLAUDE.md actualizado com novo plano.

### Sessão 7 — 16 Junho 2026
Logbook v0.6→v0.7: filtros de pesquisa implementados (texto + popup avançado com date range/role/tipo), month dropdown removido, Off-Block/On-Block labels simplificados, origin/destination/aircraftType/registration/role tornaram-se obrigatórios, Night/IFR tornaram-se opcionais.

### Sessão 8 — 16 Junho 2026
Logbook v0.7→v0.8: iOS Safari fixes — drawer flush às laterais, filter popup dentro do viewport, font-size 16px em inputs no mobile (previne zoom automático iOS). Regras Mobile iOS Safari adicionadas ao CLAUDE.md como referência permanente.

### Sessão 9 — 16 Junho 2026
Logbook v0.8→v0.9: Exportação CSV implementada — botão "Export CSV" no header da lista, exporta entradas filtradas (respeita filtros activos), UTF-8 BOM para Excel, 30 colunas universais EASA+FAA, `getFilteredEntries()` extraída como helper partilhado.

### Sessão 10 — 16 Junho 2026
Logbook v0.9→v0.10: Dashboard de estatísticas agora filtra com os filtros activos · Export CSV authority-aware (colunas dinâmicas por autoridade, filename inclui autoridade) · Popup de filtros avançados expandido: Airport, Aircraft Type, Registration, Operations SP/MP, Engine SE/ME, Night, IFR · Múltiplos fixes iOS Safari no popup de filtros: `position:fixed` + JS positioning, `overflow-x:hidden`, normalização de inputs, `min-height:40px` em date inputs via classe `.is-ios` detectada por JS · `fp-date-row` vertical (sem overflow no desktop)

### Sessão 11 — 16 Junho 2026
Logbook v0.10→v0.11: Quatro iOS Safari / mobile fixes — inputs `type="time"` no drawer com altura mínima; radio buttons Operations empilhados corrigidos (`width:auto`); header fixo ao topo (`position:fixed` + `padding-top:64px`); badge de autoridade passa a mostrar emoji da bandeira em vez de texto.

### Sessão 12 — 17 Junho 2026
Logbook v0.11→v0.12: Importação CSV/Excel implementada — modal 3 passos (upload com drag&drop, mapeamento de colunas com auto-detecção de 25 campos por aliases, preview das primeiras 5 entradas, confirmação). Suporte a CSV (delimitador auto-detectado, BOM UTF-8 handled) e .xlsx/.xls via SheetJS CDN. Fix mobile: `entries-header` em coluna no mobile (título "Flight Log" acima dos botões Import/Export).

### Sessão 13 — 17 Junho 2026
Logbook v0.12→v0.13: Import melhorado para cobrir formato EASA físico (logbooks em papel digitalizados). Três PRs:
- **PR #29** — 7 campos de role-por-horas (picHours, picusHours, copilotHours, dualHours, instructorHours, spicHours, feHours): role inferido da coluna com valor; `normalizeImportRole()` converte texto livre ("F/O", "Co-Pilot (F/O)", "CFI", "Dual Received"…) para valores internos correctos
- **PR #30** — campo `simDate`: SIM Date separada como fallback de data quando coluna "Date" está vazia nas linhas de simulador
- **PR #31** — 3 campos de operações-por-horas (spseHours, spmeHours, mpHours): `operations` + `engine` inferidos da coluna com valor; horas como `totalTime` fallback. SP ME/SP SE sem distinção SE/ME em MP (correcto EASA)
Total: 36 campos no IMPORT_FIELDS (era 25 na v0.12)

### Sessão 15 — 19 Junho 2026
Dashboard integrado na estrutura do projecto como ecrã de entrada da PWA (v0.13→v0.15). PRs #33–#37:
- **PR #33** — `index.html` passa a ser o Dashboard; `logbook.html` é o Logbook renomeado; `css/dashboard.css` e `js/dashboard.js` extraídos do protótipo `dashboard_minimal.html`; `MODULE_LINKS.LOG = 'logbook.html'` correcto; botão "← Home" adicionado ao header do Logbook (depois substituído pela bottom nav)
- **PR #34** — Gauges do Logbook lêem dados reais do `localStorage` (`pa_entries`): Total, PIC, Night, IFR Hours calculados em tempo real; mensagem honesta quando logbook vazio; tag "dados reais" correcta
- **PR #35** — Bottom navigation bar (Logbook · Home · Settings): `css/nav.css` + `js/nav.js` injectado em todas as páginas; Settings modal standalone com selector EASA/FAA; btn-home removido do header do Logbook
- **PR #36** — Fix: ícone Logbook na bottom nav passa de lápis para livro; Dashboard full-width no mobile (separação `html`/`body` no flex)
- **PR #37** — Fix: `min-height: 210px` no `.gauge-zone` — painel de detalhe mantém altura fixa ao navegar entre módulos

### Sessão 14 — 19 Junho 2026
Exploração extensa de conceitos de Dashboard/Home Menu para a PWA:
- **Engine fan menu** (motor a jacto rotativo como navegação): 3 iterações — SVG simples → Canvas 2D fotorrealista (lighting por blade, motion blur via offscreen compositing, OGVs, inlet lip 3D, fan disc effect a alta rotação) → tentativa Three.js/WebGL com PBR materials, env map procedural, sombras reais. Three.js ficou pior sem HDRI de qualidade. **Conceito abandonado por agora** — tecto de qualidade do código puro atingido; precisaria de foto/HDRI gerado por IA para ir mais longe.
- **4 conceitos cockpit-themed** mostrados em showcase comparável: Navigation Display (compass rose EFIS), MCDU/FMS (interface FMC autêntica), Glass Cockpit Cards (grid com cores EFIS), PFD Tape (fita de velocidade/altitude). **Todos rejeitados** — utilizador não queria estética de instrumentos de cockpit.
- **Dashboard minimalista** (sem tema aviação) — primeira versão em fundo preto, **rejeitada**.
- **Dashboard final aprovado** — minimalista moderno, paleta oficial do projecto (fundo claro `#F6F5FC`, índigo `#2825A0`, Space Grotesk + Space Mono). Layout: top bar → painel de detalhe (status pill + nome + subtítulo + manómetros + botão Open) → grid 5×3 de todos os módulos → barra de progresso.
- **Sistema de manómetros (gauges):** arco semicircular SVG, cor por threshold (índigo/âmbar≥75%/vermelho≥92%). `GAUGE_DATA` define métricas reais só para Logbook (Total/PIC/Night/IFR Hours) e FTL (7 Dias/60h, 28 Dias/110h, 12 Meses/1000h, FDP Hoje/13h — limites EASA Part-FCL). Módulos sem lógica implementada mostram honestamente "métricas em breve" em vez de dados inventados. Tag "dados reais" vs "dados de exemplo" visível no painel.
- **Sistema `MODULE_LINKS`:** objecto de configuração para ligar "Open module" às páginas reais já desenvolvidas (ex.: Logbook). Navega via `window.location.href` quando definido, fallback `sendPrompt()` quando não.
- Removida a dica de atalhos de teclado (`.kbd-row`) do rodapé do dashboard a pedido do utilizador — navegação por teclado mantém-se funcional.
- Ficheiro de protótipo: `dashboard_minimal.html` (standalone, ainda fora da estrutura do repo).

**Resolvido na Sessão 15:** tudo o que estava pendente foi implementado — ver Sessão 15 no registo.

---

## 🚀 Próximos Passos

1. **Agora** → Agenda FTL básica (Módulo 1) — `ftl.html` + `css/ftl.css` + `js/ftl.js`; `MODULE_LINKS.FTL` actualizado
2. **A seguir** → Ligar gauges FTL a dados reais (depois do Módulo 1 implementado)
3. **Depois** → Apagar `dashboard_minimal.html` (protótipo histórico, já substituído)
4. **Semana 6-7** → Claude API: consulta em linguagem natural + foto → 1 voo
5. **Fase 2** → Supabase + beta com pilotos + integrações LEON/Aims/Crewlink

---

## 📋 Como usar este ficheiro

1. **Claude Code** → na raiz do repo como `CLAUDE.md` — lido automaticamente
2. **Claude.ai Project** → upload nos Ficheiros do Project
3. **Fim de cada sessão** → Claude gera bloco de update → copias → commit GitHub → upload no Project
4. **Início de cada sessão** → Claude lê e confirma o estado actual antes de começar

---

*Última actualização: Sessão 15 — 19 Junho 2026 (v0.15)*
