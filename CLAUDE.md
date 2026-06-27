# ✈️ PilotAssistante — Ficheiro de Contexto & Memória do Projecto

> **Memória viva do projecto.** Lido automaticamente pelo Claude Code (raiz do repo) e carregado no Project do claude.ai. Actualizar no final de cada sessão.

---

## ⚡ Estado Rápido — Lê isto primeiro

| | |
|---|---|
| **Versão actual** | v0.15 |
| **Última sessão** | Sessão 18 — 27 Junho 2026 |
| **Módulo em construção** | Agenda FTL básica (Módulo 1) — a iniciar |
| **Próxima tarefa** | Construir Módulo 1: Agenda & Legalidades EASA (FTL/DP/RP limits, calendário de turnos) |
| **Deploy activo** | GitHub Pages ✅ |
| **Linguagem da app** | Inglês |

### Estado dos 15 Módulos

| # | Módulo | Estado |
|---|---|---|
| 1 | Agenda & Legalidades EASA | 🔜 A iniciar |
| 2 | Logbook Inteligente | 🟡 Em progresso (v0.15 — nav dinâmica, settings page, tema claro/escuro) |
| 3 | Documentos & Validades | ⬜ Por fazer |
| 4 | Centro de Treino | ⬜ Por fazer |
| 5 | Memórias & Diário | ⬜ Por fazer |
| 6 | Oportunidades de Emprego | ⬜ Por fazer |
| 7 | Notícias de Aviação | ⬜ Por fazer |
| 8 | Briefing Inteligente | ⬜ Por fazer |
| 9 | Calculadora Salário & Per Diem | ⬜ Por fazer |
| 10 | Preparação de Entrevistas | ⬜ Por fazer |
| 11 | Registo de Fadiga (FRMS) | ⬜ Por fazer |
| 12 | Home Widget | ⬜ Por fazer |
| 13 | Relatório Anual | ⬜ Por fazer |
| 14 | Assistente de Voz IA | ⬜ Por fazer |
| 15 | Wellbeing & Sono | ⬜ Por fazer |

---

## 🗂️ Historial de Sessões

| Sessão | Data | O que foi feito |
|---|---|---|
| 18 | 27 Jun 2026 | Nav dinâmica no logbook (Flights/Home/Stats no rodapé), search removido, quick-stats removido da tab Flights, Settings movido para header (link para settings.html), settings.html com autoridade + tema claro/escuro, entry card hover e gauges adaptam-se ao tema, fix label "Year 2026" (PRs #44–#48 merged) |
| 17 | 26 Jun 2026 | Logbook redesign dark theme: cards com data/aeroportos/pills, 3 gauges FTL circulares na tab Stats, recency bars, FAB azul, nav bar escura (PR #42 merged) |
| 16 | 24 Jun 2026 | Logbook: tab Statistics com totais de horas, gráfico SVG mensal, currency EASA 90 dias, breakdown por tipo/role e insights (PR #40 merged) |
| 15 | 24 Jun 2026 | Dashboard Menu: ícones SVG de aviação em cada card de módulo (substituem número), header sticky com avião no logo, fonte maior |
| 14 | 19 Jun 2026 | Dashboard / Home Menu UI shell — conceito e estrutura aprovados |
| 1–13 | anteriores | Logbook v0.13, PWA base, navegação, estilos globais |

---

## 🏗️ Arquitectura Actual

| Ficheiro | Função |
|---|---|
| `index.html` | Dashboard principal (home menu dos 15 módulos) |
| `logbook.html` | Módulo 2 — Logbook (tabs: Flights + Stats via nav dinâmica no rodapé) |
| `settings.html` | Página de definições: autoridade (EASA/FAA) + tema (Dark/Light) |
| `js/dashboard.js` | Lógica do dashboard: grid de módulos, gauges, ICONS SVG |
| `js/app.js` | Lógica do logbook: entradas, filtros, renderFlightCard, renderSimCard, renderStatsContent (gauges circulares), showTab() |
| `js/nav.js` | Nav bar dinâmica: logbook → Flights/Home/Stats; outras páginas → Logbook/Home/Settings. Aplica data-theme ao body. |
| `js/authorities.js` | Configuração de autoridades (EASA/FAA): campos, roles, formatos |
| `css/dashboard.css` | Estilos do dashboard |
| `css/style.css` | Estilos do logbook — variáveis CSS para tema dark e light (`body[data-theme]`) |
| `css/nav.css` | Estilos da nav bar — variáveis `--nav-bg/border/text/active` para ambos os temas |
| `manifest.json` | PWA manifest |

## 🎨 Tema Visual

### Sistema de Temas (Dark / Light)
- O tema é guardado em `localStorage` com a chave `pa_theme` (`'dark'` ou `'light'`)
- `nav.js` aplica `data-theme` ao `<body>` imediatamente ao carregar (evita flash)
- `css/style.css` e `css/nav.css` definem variáveis CSS para cada tema via `body[data-theme="dark/light"]`
- Componentes JS que geram SVG (ex: gauges) lêem as cores via `getComputedStyle(document.body)`

### Tema Dark (padrão)
- **Fundo:** `#0B1525` — **Cards:** `#131F33` — **Surface:** `#111D2F`
- **Accent laranja:** `#E8900A` — **Accent azul:** `#1B3AA8`
- **Texto:** `#FFFFFF` / muted `#7A8FA6`
- **Nav:** fundo `#111D2F`, activo `#FFFFFF`

### Tema Light
- **Fundo:** `#F6F5FC` — **Cards/Surface:** `#FFFFFF`
- **Accent índigo:** `#2825A0`
- **Texto:** `#12113A` / muted `#6B6898`
- **Nav:** fundo `#FFFFFF`, activo `#2825A0`

### Header do Logbook
- Ordem: título | [Export] | bandeira autoridade | ⚙️ Settings (link para settings.html)
- A bandeira é apenas visual (não clicável); a autoridade muda-se em Settings

### Nav Bar — Comportamento Dinâmico
- **Em logbook.html:** `Flights` (showTab log) | `Home` | `Stats` (showTab stats)
- **Noutras páginas:** `Logbook` | `Home` | `Settings`
