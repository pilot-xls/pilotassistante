/* ============================================================
   PilotAssistante — Logbook JS v0.2
   ============================================================ */

'use strict';

const STORAGE_KEY = 'pa_logbook_v1';

// ── ARMAZENAMENTO ─────────────────────────────────────────
function loadFlights() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveFlights(flights) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flights));
}

// ── UTILITÁRIOS DE TEMPO ──────────────────────────────────
function toDecimal(value) {
  if (value === null || value === undefined || value === '') return 0;
  const str = String(value).trim().replace(',', '.');
  if (/^\d+:\d{1,2}$/.test(str)) {
    const [h, m] = str.split(':').map(Number);
    return h + (m || 0) / 60;
  }
  const num = parseFloat(str);
  return isNaN(num) ? 0 : Math.max(0, num);
}

function toHHMM(decimal) {
  if (!decimal || isNaN(decimal) || decimal <= 0) return '0:00';
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  if (m >= 60) return `${h + 1}:00`;
  return `${h}:${String(m).padStart(2, '0')}`;
}

// ── DATA ──────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const [year, month, day] = dateStr.split('-').map(Number);
  return `${String(day).padStart(2,'0')} ${months[month-1]} ${year}`;
}

// ── ESTATÍSTICAS ──────────────────────────────────────────
function calculateStats(flights) {
  const now = new Date();
  const tm = now.getMonth(), ty = now.getFullYear();

  return flights.reduce((acc, f) => {
    if (f.tipoEntrada === 'simulator') {
      acc.sim += f.totalHoras || 0;
    } else {
      acc.total += f.totalHoras || 0;
      acc.pic   += f.pic        || 0;
      acc.ifr   += f.ifr        || 0;
      acc.night += f.horasNoite || 0;
    }
    if (f.data) {
      const [y, m] = f.data.split('-').map(Number);
      if (m-1 === tm && y === ty) acc.thisMonth += f.totalHoras || 0;
    }
    return acc;
  }, { total: 0, pic: 0, ifr: 0, night: 0, sim: 0, thisMonth: 0 });
}

function renderStats(stats) {
  document.getElementById('stat-total').textContent = toHHMM(stats.total);
  document.getElementById('stat-pic').textContent   = toHHMM(stats.pic);
  document.getElementById('stat-ifr').textContent   = toHHMM(stats.ifr);
  document.getElementById('stat-night').textContent = toHHMM(stats.night);
  document.getElementById('stat-sim').textContent   = toHHMM(stats.sim);
  document.getElementById('stat-month').textContent = toHHMM(stats.thisMonth);
}

// ── ESCAPE HTML ───────────────────────────────────────────
function esc(str) {
  return String(str ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ── RENDER — CARTÃO DE VOO ────────────────────────────────
function buildFlightCard(f) {
  const isSim = f.tipoEntrada === 'simulator';

  // Badges de função
  const funcaoBadge = {
    pic:        '<span class="badge badge-pic">PIC</span>',
    copilot:    '<span class="badge badge-copilot">Co-Pilot</span>',
    dual:       '<span class="badge badge-dual">Dual</span>',
    instructor: '<span class="badge badge-instr">Instructor</span>'
  }[f.funcao] || '<span class="badge badge-pic">PIC</span>';

  let cardBody = '';

  if (isSim) {
    // ── Cartão Simulador ──
    cardBody = `
      <div class="sim-title">Simulator Session</div>
      <div class="sim-type">${esc(f.fstdTipo || 'FSTD')}</div>
      <div class="flight-details">
        <span></span>
        <div class="flight-badges">${funcaoBadge}</div>
      </div>
    `;
  } else {
    // ── Cartão Voo ──
    const ifrBadge = f.ifr > 0
      ? '<span class="badge badge-ifr">IFR</span>'
      : '<span class="badge badge-vfr">VFR</span>';
    const meBadge = f.motores === 'me'
      ? '<span class="badge badge-me">ME</span>'
      : '<span class="badge badge-se">SE</span>';
    const mpBadge = f.operacao === 'mp'
      ? '<span class="badge badge-mp">MP</span>'
      : '<span class="badge badge-sp">SP</span>';

    // Horários off/on-block
    const routeTimes = (f.offBlock && f.onBlock)
      ? `<span class="route-times">${esc(f.offBlock)} → ${esc(f.onBlock)}</span>`
      : '';

    cardBody = `
      <div class="flight-route">
        <span class="icao">${esc(f.origem || '—')}</span>
        <span class="route-arrow">→</span>
        <span class="icao">${esc(f.destino || '—')}</span>
        ${routeTimes}
      </div>
      <div class="flight-details">
        <span class="aircraft">${esc([f.aeronave, f.matricula].filter(Boolean).join(' · ') || '—')}</span>
        <div class="flight-badges">
          ${funcaoBadge}${ifrBadge}${meBadge}${mpBadge}
        </div>
      </div>
    `;
  }

  // Sub-info: movimentos + abordagens
  const subItems = [];
  const descDia   = f.descolagensDia   || 0;
  const descNoite = f.descolagens_noite || 0;
  const atDia     = f.aterragensDia    || 0;
  const atNoite   = f.aterragensNoite  || 0;
  if (!isSim && (descDia + descNoite + atDia + atNoite > 0)) {
    if (descDia + descNoite > 0) {
      const parts = [];
      if (descDia   > 0) parts.push(`${descDia} day`);
      if (descNoite > 0) parts.push(`${descNoite} night`);
      subItems.push(`<span class="flight-sub-item">↑ T/O <strong>${parts.join(' + ')}</strong></span>`);
    }
    if (atDia + atNoite > 0) {
      const parts = [];
      if (atDia   > 0) parts.push(`${atDia} day`);
      if (atNoite > 0) parts.push(`${atNoite} night`);
      subItems.push(`<span class="flight-sub-item">↓ LDG <strong>${parts.join(' + ')}</strong></span>`);
    }
  }
  if (!isSim && f.numAbordagens > 0) {
    const tipo = f.tipoAbordagem ? ` ${esc(f.tipoAbordagem)}` : '';
    subItems.push(`<span class="flight-sub-item">◎ Appr. <strong>${f.numAbordagens}×${tipo}</strong></span>`);
  }
  const subHTML = subItems.length
    ? `<div class="flight-sub">${subItems.join('')}</div>` : '';

  // Tripulação
  const crewParts = [];
  if (f.nomePIC)      crewParts.push(`PIC: ${esc(f.nomePIC)}`);
  if (f.nomeInstrutor) crewParts.push(`Instr.: ${esc(f.nomeInstrutor)}`);
  const crewHTML = crewParts.length
    ? `<div class="flight-crew">${crewParts.join(' · ')}</div>` : '';

  const obsHTML = f.observacoes
    ? `<div class="flight-obs">${esc(f.observacoes)}</div>` : '';

  return `
    <div class="flight-card${isSim ? ' is-sim' : ''}" data-id="${esc(f.id)}">
      <div class="flight-top">
        <span class="flight-date">${formatDate(f.data)}</span>
        <span class="flight-time">${toHHMM(f.totalHoras)}</span>
      </div>
      ${cardBody}
      ${subHTML}
      ${crewHTML}
      ${obsHTML}
      <div class="flight-actions">
        <button class="btn-delete" onclick="confirmDeleteFlight('${esc(f.id)}')">🗑 Delete</button>
      </div>
    </div>
  `;
}

// ── RENDER — LISTA ────────────────────────────────────────
function renderFlights(flights) {
  const list  = document.getElementById('flight-list');
  const empty = document.getElementById('empty-state');
  const sorted = [...flights].sort((a, b) =>
    !a.data ? 1 : !b.data ? -1 : b.data.localeCompare(a.data)
  );
  if (!sorted.length) {
    empty.style.display = 'flex'; list.innerHTML = '';
  } else {
    empty.style.display = 'none';
    list.innerHTML = sorted.map(buildFlightCard).join('');
  }
}

function render() {
  const flights = loadFlights();
  renderStats(calculateStats(flights));
  renderFlights(flights);
}

// ── CRUD ──────────────────────────────────────────────────
function addEntry(fd) {
  const flights    = loadFlights();
  const isSim      = fd.tipoEntrada === 'simulator';
  const totalHoras = toDecimal(isSim ? fd.totalSim : fd.total);
  const horasNoite = Math.min(toDecimal(fd.noite), totalHoras);
  const ifr        = Math.min(toDecimal(fd.ifr), totalHoras);

  const entry = {
    id:               Date.now().toString(),
    tipoEntrada:      fd.tipoEntrada || 'flight',
    data:             fd.data,
    // Voo
    origem:           (fd.origem    || '').toUpperCase(),
    destino:          (fd.destino   || '').toUpperCase(),
    offBlock:         fd.offBlock   || '',
    onBlock:          fd.onBlock    || '',
    aeronave:         (fd.aeronave  || '').toUpperCase(),
    matricula:        (fd.matricula || '').toUpperCase(),
    motores:          fd.motores    || 'se',
    operacao:         fd.operacao   || 'sp',
    // Tempos
    totalHoras,
    horasDia:         Math.max(0, totalHoras - horasNoite),
    horasNoite,
    ifr,
    vfr:              isSim ? 0 : Math.max(0, totalHoras - ifr),
    // Função
    funcao:           fd.funcao     || 'pic',
    pic:              (!isSim && fd.funcao === 'pic')        ? totalHoras : 0,
    copilot:          (!isSim && fd.funcao === 'copilot')    ? totalHoras : 0,
    dual:             fd.funcao === 'dual'                   ? totalHoras : 0,
    instructor:       fd.funcao === 'instructor'             ? totalHoras : 0,
    nomePIC:          fd.nomePIC        || '',
    nomeInstrutor:    fd.nomeInstrutor  || '',
    // Movimentos
    descolagensDia:   parseInt(fd.descolagensDia)   || 0,
    descolagens_noite: parseInt(fd['descolagens_noite']) || 0,
    aterragensDia:    parseInt(fd.aterragensDia)    || 0,
    aterragensNoite:  parseInt(fd.aterragensNoite)  || 0,
    // Abordagens
    numAbordagens:    parseInt(fd.numAbordagens)    || 0,
    tipoAbordagem:    fd.tipoAbordagem  || '',
    // Simulador
    fstdTipo:         fd.fstdTipo       || '',
    // Observações
    observacoes:      fd.observacoes    || ''
  };

  flights.push(entry);
  saveFlights(flights);
  render();
}

function confirmDeleteFlight(id) {
  if (!confirm('Delete this entry? This action cannot be undone.')) return;
  saveFlights(loadFlights().filter(f => f.id !== id));
  render();
}

// ── MODAL ────────────────────────────────────────────────
let isModalOpen = false;

function openModal() {
  document.getElementById('modal-overlay').classList.add('active');
  document.getElementById('f-data').value = new Date().toISOString().split('T')[0];
  isModalOpen = true;
  document.body.style.overflow = 'hidden';
  // Reset para voo por defeito
  updateFormForType('flight');
  updateNameFields('pic');
  setTimeout(() => document.getElementById('f-origem').focus(), 100);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.getElementById('flight-form').reset();
  isModalOpen = false;
  document.body.style.overflow = '';
}

// ── LÓGICA DE SHOW/HIDE DO FORMULÁRIO ────────────────────
function updateFormForType(type) {
  const isSim = type === 'simulator';
  const show  = el => { if (el) el.style.display = ''; };
  const hide  = el => { if (el) el.style.display = 'none'; };

  isSim ? hide(document.getElementById('section-voo'))       : show(document.getElementById('section-voo'));
  isSim ? hide(document.getElementById('section-tempos-voo')): show(document.getElementById('section-tempos-voo'));
  isSim ? show(document.getElementById('section-tempos-sim')): hide(document.getElementById('section-tempos-sim'));
  isSim ? hide(document.getElementById('section-movimentos')): show(document.getElementById('section-movimentos'));
  isSim ? hide(document.getElementById('section-abordagens')): show(document.getElementById('section-abordagens'));
  isSim ? show(document.getElementById('section-fstd'))      : hide(document.getElementById('section-fstd'));
}

function updateNameFields(funcao) {
  const picGroup  = document.getElementById('group-nome-pic');
  const instrGroup = document.getElementById('group-nome-instr');
  // Mostra "Nome do PIC" quando é copiloto ou dual (tem um PIC acima)
  picGroup.style.display   = (funcao === 'copilot' || funcao === 'dual') ? '' : 'none';
  // Mostra "Nome do Instrutor" quando é dual
  instrGroup.style.display = (funcao === 'dual') ? '' : 'none';
}

// Inicializa com campos ocultos correctos
updateNameFields('pic');

// ── EVENT LISTENERS ───────────────────────────────────────
document.getElementById('btn-add-flight').addEventListener('click', openModal);
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('btn-cancel').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && isModalOpen) closeModal();
});

// Toggle Voo / Simulador
document.querySelectorAll('input[name="tipoEntrada"]').forEach(radio => {
  radio.addEventListener('change', e => updateFormForType(e.target.value));
});

// Toggle função → mostrar/ocultar nomes
document.querySelectorAll('input[name="funcao"]').forEach(radio => {
  radio.addEventListener('change', e => updateNameFields(e.target.value));
});

// Auto-uppercase ICAO
['f-origem', 'f-destino'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', function() {
    const pos = this.selectionStart;
    this.value = this.value.toUpperCase();
    this.setSelectionRange(pos, pos);
  });
});

// ── SUBMISSÃO ────────────────────────────────────────────
document.getElementById('flight-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = e.target;
  const isSim = form.tipoEntrada.value === 'simulator';

  if (!form.data.value) {
    alert('Please enter a date.'); form.data.focus(); return;
  }
  const totalVal = isSim ? form.totalSim.value : form.total.value;
  if (!totalVal || toDecimal(totalVal) <= 0) {
    alert('Please enter the duration (e.g. 2:30 or 2.5).');
    (isSim ? form.totalSim : form.total).focus(); return;
  }

  addEntry({
    tipoEntrada:      form.tipoEntrada.value,
    data:             form.data.value,
    origem:           form.origem?.value         || '',
    destino:          form.destino?.value        || '',
    offBlock:         form.offBlock?.value       || '',
    onBlock:          form.onBlock?.value        || '',
    aeronave:         form.aeronave?.value       || '',
    matricula:        form.matricula?.value      || '',
    motores:          form.motores?.value        || 'se',
    operacao:         form.operacao?.value       || 'sp',
    total:            form.total?.value          || '0',
    totalSim:         form.totalSim?.value       || '0',
    noite:            form.noite?.value          || '0',
    ifr:              form.ifr?.value            || '0',
    funcao:           form.funcao.value,
    nomePIC:          form.nomePIC?.value        || '',
    nomeInstrutor:    form.nomeInstrutor?.value  || '',
    descolagensDia:   form.descolagensDia?.value || '0',
    'descolagens_noite': form['descolagens_noite']?.value || '0',
    aterragensDia:    form.aterragensDia?.value  || '0',
    aterragensNoite:  form.aterragensNoite?.value|| '0',
    numAbordagens:    form.numAbordagens?.value  || '0',
    tipoAbordagem:    form.tipoAbordagem?.value  || '',
    fstdTipo:         form.fstdTipo?.value       || '',
    observacoes:      form.observacoes.value
  });

  closeModal();
});

// ── ARRANQUE ─────────────────────────────────────────────
render();
