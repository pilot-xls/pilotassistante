/* ─────────────────────────────────────────────────────────────
   PilotAssistante — Authority Profiles
   Adicionar nova autoridade = adicionar um objecto aqui.
   O formulário adapta-se automaticamente.
   ───────────────────────────────────────────────────────────── */

const AUTHORITIES = {

  EASA: {
    id:       'EASA',
    name:     'EASA',
    subtitle: 'Europe · ANAC · DGAC · LBA · ENAC · CAA',

    form: {
      showOperations:    true,   // campo MP / SP
      engineWhenSP:      true,   // SE/ME só aparece quando SP
      showCrossCountry:  false,  // horas XC (não é coluna EASA)
      showSolo:          false,  // horas solo (não é coluna EASA)
    },

    roles: [
      { value: 'PIC',        label: 'PIC — Pilot in Command' },
      { value: 'Co-Pilot',   label: 'Co-Pilot (F/O)' },
      { value: 'Dual',       label: 'Dual (Student)' },
      { value: 'Instructor', label: 'Instructor' },
    ],

    simTypes: [
      { value: 'FFS',          label: 'FFS — Full Flight Simulator' },
      { value: 'FTD',          label: 'FTD — Flight Training Device' },
      { value: 'FNPT II MCC',  label: 'FNPT II MCC' },
      { value: 'FNPT II',      label: 'FNPT II' },
      { value: 'FNPT I',       label: 'FNPT I' },
      { value: 'BITD',         label: 'BITD' },
    ],

    approachTypes: [
      'ILS CAT I', 'ILS CAT II', 'ILS CAT III',
      'RNAV (GNSS)', 'VOR', 'NDB', 'Visual',
    ],

    exportFormats: ['EASA Part-FCL', 'CSV Universal'],
  },

  FAA: {
    id:       'FAA',
    name:     'FAA',
    subtitle: 'United States of America',

    form: {
      showOperations:   false,  // FAA não usa coluna MP/SP no logbook
      engineWhenSP:     false,  // SE/ME sempre visível
      showCrossCountry: true,   // XC é obrigatório para certificados FAA
      showSolo:         true,   // horas solo também são relevantes
    },

    roles: [
      { value: 'PIC',        label: 'PIC — Pilot in Command' },
      { value: 'SIC',        label: 'SIC — Second in Command' },
      { value: 'Dual',       label: 'Dual Received' },
      { value: 'Instructor', label: 'CFI — Flight Instructor' },
    ],

    simTypes: [
      { value: 'FFS',  label: 'FFS — Full Flight Simulator' },
      { value: 'FTD',  label: 'FTD — Flight Training Device' },
      { value: 'ATD',  label: 'ATD — Aviation Training Device' },
      { value: 'AATD', label: 'AATD — Advanced ATD' },
      { value: 'BATD', label: 'BATD — Basic ATD' },
    ],

    approachTypes: [
      'ILS', 'LOC', 'LDA', 'SDF',
      'RNAV (GPS)', 'RNAV (RNP)',
      'VOR', 'VOR/DME', 'NDB', 'Visual',
    ],

    exportFormats: ['FAA 8710-1', 'CSV Universal'],
  },

  /* ── TEMPLATE PARA NOVAS AUTORIDADES ──────────────────────
  UK_CAA: {
    id:       'UK_CAA',
    name:     'UK CAA',
    subtitle: 'United Kingdom',
    form: { showOperations: true, engineWhenSP: true, showCrossCountry: false, showSolo: false },
    roles: [ ... ],
    simTypes: [ ... ],
    approachTypes: [ ... ],
    exportFormats: [ ... ],
  },
  ─────────────────────────────────────────────────────────── */

};
