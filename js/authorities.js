/* ============================================================
   PilotAssistante — Authority Profile System
   v0.6 — EASA showApproaches: false (not required by Part-FCL)

   Para adicionar nova autoridade:
   1. Copia o template UK CAA no final
   2. Remove os comentários de bloco
   3. Preenche os campos
   ============================================================ */

const AUTHORITIES = {

  EASA: {
    name: 'EASA',
    flag: '🇪🇺',
    description: 'European Union Aviation Safety Agency',
    showOperations:   true,   // SP/MP toggle (Part-FCL)
    engineWhenSP:     true,   // SE/ME só aparece quando SP selected
    showCrossCountry: false,  // XC hours — FAA only
    showSolo:         false,  // Solo hours — FAA only
    showApproaches:   false,  // Approaches — não obrigatório Part-FCL (registar em Remarks)
    roles: [
      { value: 'PIC',        label: 'PIC'            },
      { value: 'PICUS',      label: 'PICUS'          },
      { value: 'CO_PILOT',   label: 'Co-Pilot (F/O)' },
      { value: 'SPIC',       label: 'SPIC'           },
      { value: 'DUAL',       label: 'Dual'           },
      { value: 'INSTRUCTOR', label: 'Instructor'     },
      { value: 'FE',         label: 'FE'             },
    ],
    simTypes: ['FFS', 'FTD', 'FNPT I', 'FNPT II', 'BITD'],
    approachTypes: ['ILS CAT I', 'ILS CAT II', 'ILS CAT III', 'RNP', 'RNAV', 'VOR', 'NDB', 'Visual'],
    exportFormats: ['EASA Official', 'PDF Generic', 'CSV Universal'],
  },

  FAA: {
    name: 'FAA',
    flag: '🇺🇸',
    description: 'Federal Aviation Administration',
    showOperations:   false,  // FAA não usa SP/MP no logbook
    engineWhenSP:     false,  // SE/ME sempre visível
    showCrossCountry: true,   // Obrigatório FAA
    showSolo:         true,   // Obrigatório FAA
    showApproaches:   true,   // Obrigatório FAA — currency IFR (6 em 6 meses)
    roles: [
      { value: 'PIC',        label: 'PIC'        },
      { value: 'SIC',        label: 'SIC'        },
      { value: 'DUAL',       label: 'Dual'       },
      { value: 'INSTRUCTOR', label: 'Instructor' },
    ],
    simTypes: ['FFS', 'FTD', 'ATD', 'AATD', 'BATD'],
    approachTypes: ['ILS', 'LOC', 'LDA', 'SDF', 'VOR', 'NDB', 'RNAV (GPS)', 'RNP', 'Visual'],
    exportFormats: ['FAA Official', 'PDF Generic', 'CSV Universal'],
  },

  /* ── TEMPLATE: UK CAA ──────────────────────────────────────

  UK_CAA: {
    name: 'UK CAA',
    flag: '🇬🇧',
    description: 'UK Civil Aviation Authority',
    showOperations:   true,
    engineWhenSP:     true,
    showCrossCountry: false,
    showSolo:         false,
    showApproaches:   false,
    roles: [
      { value: 'PIC',        label: 'PIC'            },
      { value: 'CO_PILOT',   label: 'Co-Pilot (F/O)' },
      { value: 'DUAL',       label: 'Dual'            },
      { value: 'INSTRUCTOR', label: 'Instructor'      },
    ],
    simTypes: ['FFS', 'FTD', 'FNPT I', 'FNPT II', 'BITD'],
    approachTypes: ['ILS CAT I', 'ILS CAT II', 'ILS CAT III', 'RNP', 'RNAV', 'VOR', 'NDB', 'Visual'],
    exportFormats: ['EASA Official', 'PDF Generic', 'CSV Universal'],
  },

  ─────────────────────────────────────────────────────────── */

};

/* ── Helpers ──────────────────────────────────────────────── */

function getAuthority() {
  const key = localStorage.getItem('pa_authority') || 'EASA';
  return AUTHORITIES[key] || AUTHORITIES.EASA;
}

function getAuthorityKey() {
  return localStorage.getItem('pa_authority') || 'EASA';
}
