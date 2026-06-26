# ✈️ PilotAssistante — Ficheiro de Contexto & Memória do Projecto

> **Memória viva do projecto.** Lido automaticamente pelo Claude Code (raiz do repo) e carregado no Project do claude.ai. Actualizar no final de cada sessão.

---

## ⚡ Estado Rápido — Lê isto primeiro

| | |
|---|---|
| **Versão actual** | v0.14 |
| **Última sessão** | Sessão 17 — 26 Junho 2026 |
| **Módulo em construção** | Agenda FTL básica (Módulo 1) — a iniciar |
| **Próxima tarefa** | Construir Módulo 1: Agenda & Legalidades EASA (FTL/DP/RP limits, calendário de turnos) |
| **Deploy activo** | GitHub Pages ✅ |
| **Linguagem da app** | Inglês |

### Estado dos 15 Módulos

| # | Módulo | Estado |
|---|---|---|
| 1 | Agenda & Legalidades EASA | 🔜 A iniciar |
| 2 | Logbook Inteligente | 🟡 Em progresso (v0.14 + dark theme redesign) |
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
| 17 | 26 Jun 2026 | Logbook redesign dark theme: cards com data/aeroportos/pills, 3 gauges FTL circulares na tab Stats, recency bars, FAB azul, nav bar escura (PR #42 merged) |
| 16 | 24 Jun 2026 | Logbook: tab Statistics com totais de horas, gráfico SVG mensal, currency EASA 90 dias, breakdown por tipo/role e insights (PR #40 merged) |
| 15 | 24 Jun 2026 | Dashboard Menu: ícones SVG de aviação em cada card de módulo (substituem número), header sticky com avião no logo, fonte maior |
| 14 | 19 Jun 2026 | Dashboard / Home Menu UI shell — conceito e estrutura aprovados |
| 1–13 | anteriores | Logbook v0.13, PWA base, navegação, estilos globais |

---

## 🏗️ Arquitectura Actual

| Ficheiro | Função |
|---|---|
| `index.html` | Dashboard principal (home menu dos 15 módulos) — tema claro |
| `logbook.html` | Módulo 2 — Logbook (tabs: Flights + Stats) — tema escuro |
| `js/dashboard.js` | Lógica do dashboard: grid de módulos, gauges, ICONS SVG |
| `js/app.js` | Lógica do logbook: entradas, filtros, renderFlightCard, renderSimCard, renderStatsContent (gauges circulares) |
| `js/nav.js` | Barra de navegação inferior (bottom nav) |
| `css/dashboard.css` | Estilos do dashboard — tema claro (#F6F5FC) |
| `css/style.css` | Estilos do logbook — tema escuro (#0B1525), entry cards, gauges, FAB |
| `css/nav.css` | Estilos da nav bar — escura (#111D2F) |
| `manifest.json` | PWA manifest |

## 🎨 Tema Visual

### Logbook (escuro)
- **Fundo:** `#0B1525`
- **Cards:** `#131F33`
- **Accent laranja:** `#E8900A` (role pills, duração, gauges)
- **Accent azul:** `#1B3AA8` (tipo aeronave pill)
- **FAB:** `#2563EB`
- **Texto:** `#FFFFFF` / muted `#7A8FA6`

### Dashboard (claro)
- **Fonte principal:** Space Grotesk
- **Fonte mono:** Space Mono
- **Cor accent:** `#2825A0` (índigo)
- **Cor crítico:** `#D03030`
- **Cor fundo:** `#F6F5FC`
