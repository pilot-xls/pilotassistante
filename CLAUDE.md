# ✈️ PilotAssistante — Ficheiro de Contexto & Memória do Projecto

> **Memória viva do projecto.** Lido automaticamente pelo Claude Code (raiz do repo) e carregado no Project do claude.ai. Actualizar no final de cada sessão.

---

## ⚡ Estado Rápido — Lê isto primeiro

| | |
|---|---|
| **Versão actual** | v0.14 |
| **Última sessão** | Sessão 17 — 25 Junho 2026 |
| **Módulo em construção** | Agenda FTL básica (Módulo 1) — a iniciar |
| **Próxima tarefa** | Construir Módulo 1: Agenda & Legalidades EASA (FTL/DP/RP limits, calendário de turnos) |
| **Deploy activo** | GitHub Pages ✅ |
| **Linguagem da app** | Inglês |

### Estado dos 15 Módulos

| # | Módulo | Estado |
|---|---|---|
| 1 | Agenda & Legalidades EASA | 🔜 A iniciar |
| 2 | Logbook Inteligente | 🟡 Em progresso (v0.13 + Statistics tab) |
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
| 17 | 25 Jun 2026 | Dashboard redesign v0.14: hero azul com horas reais, EASA currency no home, voos recentes, botão Log flight — dados lidos do localStorage (PR #41 merged) |
| 16 | 24 Jun 2026 | Logbook: tab Statistics com totais de horas, gráfico SVG mensal, currency EASA 90 dias, breakdown por tipo/role e insights (PR #40 merged) |
| 15 | 24 Jun 2026 | Dashboard Menu: ícones SVG de aviação em cada card de módulo (substituem número), header sticky com avião no logo, fonte maior |
| 14 | 19 Jun 2026 | Dashboard / Home Menu UI shell — conceito e estrutura aprovados |
| 1–13 | anteriores | Logbook v0.13, PWA base, navegação, estilos globais |

---

## 🏗️ Arquitectura Actual

| Ficheiro | Função |
|---|---|
| `index.html` | Dashboard principal (home menu dos 15 módulos) |
| `logbook.html` | Módulo 2 — Logbook (tabs: Log + Statistics) |
| `js/dashboard.js` | Lógica do dashboard: renderHero, renderCurrency, renderRecent, renderQA, buildGrid — lê localStorage |
| `js/app.js` | Lógica do logbook: entradas, filtros, tab Statistics (showTab, renderStatsView, renderStatsContent) |
| `js/nav.js` | Barra de navegação inferior (bottom nav) |
| `css/dashboard.css` | Estilos do dashboard (inclui header sticky, card icons) |
| `css/style.css` | Estilos do logbook (inclui tab-bar, period-bar, sv-nums, gauges, currency, breakdown, insights) |
| `css/nav.css` | Estilos da nav bar |
| `manifest.json` | PWA manifest |

## 🎨 Tema Visual

- **Fonte principal:** Space Grotesk
- **Fonte mono:** Space Mono
- **Cor accent:** `#2825A0` (índigo)
- **Cor crítico:** `#D03030`
- **Cor fundo:** `#F6F5FC`
