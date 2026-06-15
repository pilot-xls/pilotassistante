/* ─────────────────────────────────────────────────────────────
   PilotAssistante — Logbook Logic
   v0.4 · Authority-aware
   ───────────────────────────────────────────────────────────── */

'use strict';

const STORAGE_KEY   = 'pilotassistante_logbook_v1';
const AUTHORITY_KEY = 'pilotassistante_authority';

let currentType      = 'flight'; // 'flight' | 'sim'
let activeAuthority  = 'EASA';   // default
let editingId        = null;     // id da entrada em edição, null = nova entrada

/* ── UTILS ──────────────────────────────────────────────────── */

function parseHours(val) {
  if (!val || String(val).trim() === '') return 0;
  const s = String(val).trim();
  if (s.includes(':')) {
    const [h, m] = s.split(':').map(Number);
    return (h || 0) + (m || 0) / 60;
  }
  return parseFloat(s) || 0;
}

function fmtHours(h) {
  if (!h || isNaN(h) || h < 0) return '0:00';
  const hours = Math.floor(h);
  const mins  = Math.round((h - hours) * 60);
  return `${hours}:${String(mins).padStart(2, '0')}`;
}

function fmtDate(str) {
  if (!str) return '—';
  const [y, m, d] = str.split('-');
  return `${d}·${m}·${y.slice(2)}`;
}

function thisMonth() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function el(id) { return document.getElementById(id); }

/* ── STORAGE ─────────────────────────────────────────────────── */

function getEntries() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/* ── AUTHORITY SYSTEM ────────────────────────────────────────── */

function applyAuthority(key) {
  const auth = AUTHORITIES[key];
  if (!auth) return;

  activeAuthority = key;
  localStorage.setItem(AUTHORITY_KEY, key);

  // Update header badge
  const badge = el('authority-name');
  if (badge) badge.textContent = auth.name;

  // Operations group (MP/SP)
  const opsGroup = el('ops-group');
  if (opsGroup) opsGroup.classList.toggle('hidden', !auth.form.showOperations);

  // Engine type group
  const engineGroup = el('engine-group');
  if (engineGroup) {
    if (!auth.form.showOperations) {
      // FAA: always show SE/ME
      engineGroup.classList.remove('hidden');
    } else {
      // EASA: depends on SP/MP
      updateOpsFields();
    }
  }

  // Cross-country (FAA)
  const xcGroup = el('xc-group');
  if (xcGroup) xcGroup.classList.toggle('hidden', !auth.form.showCrossCountry);

  // Solo (FAA)
  const soloGroup = el('solo-group');
  if (soloGroup) soloGroup.classList.toggle('hidden', !auth.form.showSolo);

  // Populate roles
  const roleSelect = el('f-role');
  if (roleSelect) {
    roleSelect.innerHTML = auth.roles
      .map(r => `<option value="${r.value}">${r.label}</option>`)
      .join('');
  }

  // Populate sim types
  const simSelect = el('f-fstd-type');
  if (simSelect) {
    simSelect.innerHTML = auth.simTypes
      .map(t => `<option value="${t.value}">${t.label}</option>`)
      .join('');
  }

  // Populate approach types
  const apprSelect = el('f-appr-type');
  if (apprSelect) {
    apprSelect.innerHTML = '<option value="">—</option>' +
      auth.approachTypes
        .map(t => `<option value="${t}">${t}</option>`)
        .join('');
  }

  // Close selector if open
  closeAuthoritySelector();
}

function openAuthoritySelector() {
  el('auth-overlay').classList.add('visible');
}

function closeAuthoritySelector() {
  const overlay = el('auth-overlay');
  if (overlay) overlay.classList.remove('visible');
}

/* ── BLOCK TIME AUTO-CALCULATE ───────────────────────────────── */

function calculateBlockTime(off, on) {
  if (!off || !on) return null;
  const [oh, om] = off.split(':').map(Number);
  const [nh, nm] = on.split(':').map(Number);
  let mins = (nh * 60 + nm) - (oh * 60 + om);
  if (mins < 0) mins += 1440; // overnight
  if (mins <= 0) return null;
  return `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;
}

function handleBlockTime() {
  const result = calculateBlockTime(
    el('f-offblock').value,
    el('f-onblock').value
  );
  if (result) el('f-total').value = result;
}

/* ── OPS FIELDS (SP/MP → SE/ME) ─────────────────────────────── */

function updateOpsFields() {
  const auth = AUTHORITIES[activeAuthority];
  if (!auth || !auth.form.showOperations) return;
  const isSP = el('f-ops').value === 'SP';
  el('engine-group').classList.toggle('hidden', !isSP);
}

/* ── ROLE FIELDS ─────────────────────────────────────────────── */

function updateRoleFields() {
  const role = el('f-role').value;
  // PIC name: show for Co-Pilot, SIC, and Dual
  const showPicName = ['Co-Pilot', 'SIC', 'Dual'].includes(role);
  el('pic-name-group').classList.toggle('hidden', !showPicName);
  el('instructor-group').classList.toggle('hidden', role !== 'Dual');
}

/* ── STATS ───────────────────────────────────────────────────── */

function updateStats() {
  const entries = getEntries();
  const month = thisMonth();
  let total = 0, pic = 0, ifr = 0, night = 0, sim = 0, monthHrs = 0;

  for (const e of entries) {
    const h = parseHours(e.totalHours);
    if (e.type === 'sim') {
      sim += h;
    } else {
      total += h;
      if (e.role === 'PIC') pic += h;
      ifr   += parseHours(e.ifrHours);
      night += parseHours(e.nightHours);
      if (e.date && e.date.startsWith(month)) monthHrs += h;
    }
  }

  const set = (id, val) => { const e = el(id); if (e) e.textContent = val; };
  set('stat-total', fmtHours(total));
  set('stat-pic',   fmtHours(pic));
  set('stat-ifr',   fmtHours(ifr));
  set('stat-night', fmtHours(night));
  set('stat-sim',   fmtHours(sim));
  set('stat-month', fmtHours(monthHrs));
}

/* ── RENDER ENTRIES ──────────────────────────────────────────── */

function renderEntries() {
  const entries = getEntries();
  const list = el('entries-list');
  if (!list) return;

  if (entries.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <p>No entries yet.</p>
        <small>Add your first flight with the button above.</small>
      </div>`;
    return;
  }

  const sorted = [...entries].sort((a, b) =>
    (b.date || '').localeCompare(a.date || ''));

  list.innerHTML = sorted.map(e => {
    const isSim = e.type === 'sim';
    const isPIC = e.role === 'PIC';
    const h = parseHours(e.totalHours);

    let routeHtml;
    if (isSim) {
      routeHtml = `<span class="entry-type-icon"><i class="ti ti-device-gamepad-2"></i></span>
                   <span class="entry-icao">${e.fstdType || 'FSTD'}</span>
                   <span class="entry-aircraft">Simulator</span>`;
    } else {
      const orig = (e.origin || '—').toUpperCase();
      const dest = (e.dest   || '—').toUpperCase();
      const acft = e.aircraftType
        ? e.aircraftType + (e.registration ? ' · ' + e.registration : '')
        : '';
      routeHtml = `
        <span class="entry-type-icon"><i class="ti ti-plane"></i></span>
        <span class="entry-icao">${orig}</span>
        <span class="entry-arrow">→</span>
        <span class="entry-icao">${dest}</span>
        ${acft ? `<span class="entry-aircraft">${acft}</span>` : ''}`;
    }

    const auth   = AUTHORITIES[activeAuthority] || AUTHORITIES.EASA;
    const roleMap = Object.fromEntries(
      auth.roles.map(r => [r.value, r.value === 'Co-Pilot' ? 'F/O' : r.value])
    );
    const roleLabel = isSim ? 'SIM' : (roleMap[e.role] || e.role || 'PIC');
    const roleClass = isPIC && !isSim ? 'pic' : 'other';

    return `
      <div class="entry-row" data-id="${e.id}">
        <span class="entry-date">${fmtDate(e.date)}</span>
        <div class="entry-route">${routeHtml}</div>
        <span class="entry-duration${isPIC && !isSim ? '' : ' muted'}">${fmtHours(h)}</span>
        <span class="entry-role ${roleClass}">${roleLabel}</span>
        <div class="entry-actions">
          <button class="entry-edit" data-id="${e.id}" title="Edit" aria-label="Edit entry">
            <i class="ti ti-pencil"></i>
          </button>
          <button class="entry-delete" data-id="${e.id}" title="Delete" aria-label="Delete entry">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      </div>`;
  }).join('');

  list.querySelectorAll('.entry-edit').forEach(btn => {
    btn.addEventListener('click', ev => {
      ev.stopPropagation();
      editEntry(btn.dataset.id);
    });
  });

  list.querySelectorAll('.entry-delete').forEach(btn => {
    btn.addEventListener('click', ev => {
      ev.stopPropagation();
      deleteEntry(btn.dataset.id);
    });
  });

  // Clicar na linha também abre edição
  list.querySelectorAll('.entry-row').forEach(row => {
    row.addEventListener('click', () => editEntry(row.dataset.id));
  });
}

/* ── EDIT ENTRY ──────────────────────────────────────────────── */

function editEntry(id) {
  const entry = getEntries().find(e => e.id === id);
  if (!entry) return;

  editingId = id;

  // Se a entrada foi criada com outra autoridade, aplicar a dela
  if (entry.authority && AUTHORITIES[entry.authority]) {
    applyAuthority(entry.authority);
  }

  // Abrir drawer e definir tipo
  openDrawer();
  setType(entry.type || 'flight');

  // Campos comuns
  const set = (id, val) => { const e = el(id); if (e) e.value = val || ''; };
  set('f-date',    entry.date);
  set('f-total',   entry.totalHours);
  set('f-remarks', entry.remarks);

  if (entry.type === 'sim') {
    set('f-fstd-type', entry.fstdType);
  } else {
    set('f-origin',        entry.origin);
    set('f-dest',          entry.dest);
    set('f-offblock',      entry.offBlock);
    set('f-onblock',       entry.onBlock);
    set('f-aircraft-type', entry.aircraftType);
    set('f-reg',           entry.registration);
    set('f-ops',           entry.ops    || 'MP');
    set('f-engine',        entry.engine || 'ME');
    set('f-day',           entry.dayHours);
    set('f-night',         entry.nightHours);
    set('f-ifr',           entry.ifrHours);
    set('f-vfr',           entry.vfrHours);
    set('f-xc',            entry.xcHours);
    set('f-solo',          entry.soloHours);
    set('f-role',          entry.role || 'PIC');
    set('f-pic-name',      entry.picName);
    set('f-instructor',    entry.instructorName);
    set('f-to-day',        entry.toDay   ?? '1');
    set('f-to-night',      entry.toNight ?? '0');
    set('f-ldg-day',       entry.ldgDay  ?? '1');
    set('f-ldg-night',     entry.ldgNight ?? '0');
    set('f-appr-num',      entry.apprNum ?? '0');
    set('f-appr-type',     entry.apprType);
    updateOpsFields();
    updateRoleFields();
  }

  // Actualizar título e botão
  el('drawer-title').textContent =
    entry.type === 'sim' ? 'Edit Simulator Session' : 'Edit Flight';
  document.querySelector('.btn-save').textContent = 'Update Entry';
}

/* ── DELETE ──────────────────────────────────────────────────── */

function deleteEntry(id) {
  if (!confirm('Delete this entry? This cannot be undone.')) return;
  saveEntries(getEntries().filter(e => e.id !== id));
  renderEntries();
  updateStats();
}

/* ── DRAWER ──────────────────────────────────────────────────── */

function openDrawer() {
  el('drawer').classList.add('open');
  el('drawer-overlay').classList.add('visible');
  document.body.style.overflow = 'hidden';
  if (!el('f-date').value) el('f-date').valueAsDate = new Date();
}

function closeDrawer() {
  el('drawer').classList.remove('open');
  el('drawer-overlay').classList.remove('visible');
  document.body.style.overflow = '';
  editingId = null;
  el('drawer-title').textContent = 'New Flight';
  const saveBtn = document.querySelector('.btn-save');
  if (saveBtn) saveBtn.textContent = 'Save Entry';
}

/* ── TYPE TOGGLE ─────────────────────────────────────────────── */

function setType(type) {
  currentType = type;
  el('type-flight').classList.toggle('active', type === 'flight');
  el('type-sim').classList.toggle('active', type === 'sim');

  document.querySelectorAll('.flight-only').forEach(e =>
    e.classList.toggle('hidden', type !== 'flight'));
  document.querySelectorAll('.sim-only').forEach(e =>
    e.classList.toggle('hidden', type !== 'sim'));

  el('drawer-title').textContent =
    type === 'sim' ? 'New Simulator Session' : 'New Flight';

  // Label do campo de horas muda conforme o tipo
  const totalLabel = el('f-total').previousElementSibling;
  if (totalLabel) {
    totalLabel.innerHTML = type === 'sim'
      ? 'Session Duration'
      : 'Total Flight Time <span class="label-hint">auto from block times</span>';
  }

  // Re-apply authority rules quando muda para voo
  if (type === 'flight') applyAuthority(activeAuthority);
}

/* ── SAVE ENTRY ──────────────────────────────────────────────── */

function saveEntry(ev) {
  ev.preventDefault();

  const v = id => { const e = el(id); return e ? e.value : ''; };

  const entry = {
    id:         uid(),
    type:       currentType,
    authority:  activeAuthority,
    date:       v('f-date'),
    totalHours: v('f-total'),
    remarks:    v('f-remarks'),
  };

  if (!entry.date || !entry.totalHours) {
    alert('Date and Total Flight Time are required.');
    return;
  }

  if (currentType === 'flight') {
    if (!el('f-offblock').value || !el('f-onblock').value) {
      alert('Off-Block and On-Block times are required for flight entries.');
      el('f-offblock').focus();
      return;
    }
  }

  if (currentType === 'flight') {
    Object.assign(entry, {
      origin:         v('f-origin').toUpperCase(),
      dest:           v('f-dest').toUpperCase(),
      offBlock:       v('f-offblock'),
      onBlock:        v('f-onblock'),
      aircraftType:   v('f-aircraft-type').toUpperCase(),
      registration:   v('f-reg').toUpperCase(),
      ops:            v('f-ops') || 'MP',
      engine:         v('f-engine') || 'ME',
      dayHours:       v('f-day'),
      nightHours:     v('f-night'),
      ifrHours:       v('f-ifr'),
      vfrHours:       v('f-vfr'),
      xcHours:        v('f-xc'),
      soloHours:      v('f-solo'),
      role:           v('f-role'),
      picName:        v('f-pic-name'),
      instructorName: v('f-instructor'),
      toDay:          v('f-to-day'),
      toNight:        v('f-to-night'),
      ldgDay:         v('f-ldg-day'),
      ldgNight:       v('f-ldg-night'),
      apprNum:        v('f-appr-num'),
      apprType:       v('f-appr-type'),
    });
  } else {
    entry.fstdType = v('f-fstd-type');
  }

  const entries = getEntries();

  if (editingId) {
    // Actualizar entrada existente
    const idx = entries.findIndex(e => e.id === editingId);
    if (idx !== -1) {
      entry.id = editingId;
      entries[idx] = entry;
    }
    editingId = null;
  } else {
    // Nova entrada
    entry.id = uid();
    entries.push(entry);
  }

  saveEntries(entries);

  el('entry-form').reset();
  setType('flight');
  updateOpsFields();
  closeDrawer();
  renderEntries();
  updateStats();
}

/* ── INIT ────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // Load or prompt authority
  const saved = localStorage.getItem(AUTHORITY_KEY);
  if (saved && AUTHORITIES[saved]) {
    applyAuthority(saved);
  } else {
    applyAuthority('EASA'); // default
    openAuthoritySelector(); // first time: ask
  }

  // Authority selector buttons
  document.querySelectorAll('.auth-card').forEach(btn => {
    btn.addEventListener('click', () => applyAuthority(btn.dataset.authority));
  });

  // Header authority badge
  el('auth-badge').addEventListener('click', openAuthoritySelector);

  // Close authority selector on overlay click
  el('auth-overlay').addEventListener('click', ev => {
    if (ev.target === el('auth-overlay')) closeAuthoritySelector();
  });

  // Drawer
  el('btn-add-flight').addEventListener('click', openDrawer);
  el('drawer-close').addEventListener('click', closeDrawer);
  el('btn-cancel').addEventListener('click', closeDrawer);
  el('drawer-overlay').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') { closeDrawer(); closeAuthoritySelector(); }
  });

  // Type toggle
  el('type-flight').addEventListener('click', () => setType('flight'));
  el('type-sim').addEventListener('click',    () => setType('sim'));

  // Block time auto-total
  el('f-offblock').addEventListener('change', handleBlockTime);
  el('f-onblock').addEventListener('change',  handleBlockTime);

  // SP/MP → SE/ME
  el('f-ops').addEventListener('change', updateOpsFields);

  // Role fields
  el('f-role').addEventListener('change', updateRoleFields);

  // Auto-uppercase
  document.querySelectorAll('.upper').forEach(input => {
    input.addEventListener('input', function () {
      const pos = this.selectionStart;
      this.value = this.value.toUpperCase();
      this.setSelectionRange(pos, pos);
    });
  });

  // Form submit
  el('entry-form').addEventListener('submit', saveEntry);

  // Initial render
  renderEntries();
  updateStats();
});
