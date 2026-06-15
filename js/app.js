/* ─────────────────────────────────────────────────────────────
   PilotAssistante — Logbook Logic
   v0.3 · Índigo Profundo
   ───────────────────────────────────────────────────────────── */

'use strict';

const STORAGE_KEY = 'pilotassistante_logbook_v1';

let currentType = 'flight'; // 'flight' | 'sim'

/* ── UTILS ──────────────────────────────────────────────────── */

/** Parse "2:30" or "2.5" → decimal hours */
function parseHours(val) {
  if (!val || String(val).trim() === '') return 0;
  const s = String(val).trim();
  if (s.includes(':')) {
    const [h, m] = s.split(':').map(Number);
    return (h || 0) + (m || 0) / 60;
  }
  return parseFloat(s) || 0;
}

/** Decimal hours → "H:MM" */
function fmtHours(h) {
  if (!h || isNaN(h) || h < 0) return '0:00';
  const hours = Math.floor(h);
  const mins  = Math.round((h - hours) * 60);
  return `${hours}:${String(mins).padStart(2, '0')}`;
}

/** "2026-06-14" → "14·06·26" */
function fmtDate(str) {
  if (!str) return '—';
  const [y, m, d] = str.split('-');
  return `${d}·${m}·${y.slice(2)}`;
}

/** Current year-month "2026-06" */
function thisMonth() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`;
}

/** Generate unique id */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ── STORAGE ─────────────────────────────────────────────────── */

function getEntries() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
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

  set('stat-total', fmtHours(total));
  set('stat-pic',   fmtHours(pic));
  set('stat-ifr',   fmtHours(ifr));
  set('stat-night', fmtHours(night));
  set('stat-sim',   fmtHours(sim));
  set('stat-month', fmtHours(monthHrs));
}

function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ── RENDER ENTRIES ──────────────────────────────────────────── */

function renderEntries() {
  const entries = getEntries();
  const list = document.getElementById('entries-list');
  if (!list) return;

  if (entries.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <p>No entries yet.</p>
        <small>Add your first flight with the button above.</small>
      </div>`;
    return;
  }

  // Sort newest first
  const sorted = [...entries].sort((a, b) =>
    (b.date || '').localeCompare(a.date || ''));

  list.innerHTML = sorted.map(e => {
    const isSim = e.type === 'sim';
    const isPIC = e.role === 'PIC';
    const h = parseHours(e.totalHours);

    // Route / label
    let routeHtml;
    if (isSim) {
      routeHtml = `<span class="entry-icao">${e.fstdType || 'FSTD'}</span>
                   <span class="entry-aircraft">Simulator</span>`;
    } else {
      const orig = (e.origin || '—').toUpperCase();
      const dest = (e.dest   || '—').toUpperCase();
      const acft = e.aircraftType
        ? e.aircraftType + (e.registration ? ' · ' + e.registration : '')
        : '';
      routeHtml = `
        <span class="entry-icao">${orig}</span>
        <span class="entry-arrow">→</span>
        <span class="entry-icao">${dest}</span>
        ${acft ? `<span class="entry-aircraft">${acft}</span>` : ''}`;
    }

    // Role label & class
    const roleMap = { 'PIC': 'PIC', 'Co-Pilot': 'F/O', 'Dual': 'Dual', 'Instructor': 'INST' };
    const roleLabel = isSim ? 'SIM' : (roleMap[e.role] || e.role || 'PIC');
    const roleClass = isPIC && !isSim ? 'pic' : 'other';

    return `
      <div class="entry-row" data-id="${e.id}">
        <span class="entry-date">${fmtDate(e.date)}</span>
        <div class="entry-route">${routeHtml}</div>
        <span class="entry-duration${isPIC && !isSim ? '' : ' muted'}">${fmtHours(h)}</span>
        <span class="entry-role ${roleClass}">${roleLabel}</span>
        <button class="entry-delete" data-id="${e.id}" title="Delete entry" aria-label="Delete">✕</button>
      </div>`;
  }).join('');

  // Attach delete listeners
  list.querySelectorAll('.entry-delete').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteEntry(btn.dataset.id);
    });
  });
}

/* ── DELETE ──────────────────────────────────────────────────── */

function deleteEntry(id) {
  if (!confirm('Delete this entry? This cannot be undone.')) return;
  const entries = getEntries().filter(e => e.id !== id);
  saveEntries(entries);
  renderEntries();
  updateStats();
}

/* ── DRAWER ──────────────────────────────────────────────────── */

function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawer-overlay').classList.add('visible');
  document.body.style.overflow = 'hidden';
  // Default to today
  const dateField = document.getElementById('f-date');
  if (!dateField.value) {
    dateField.valueAsDate = new Date();
  }
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('visible');
  document.body.style.overflow = '';
}

/* ── TYPE TOGGLE ─────────────────────────────────────────────── */

function setType(type) {
  currentType = type;
  document.getElementById('type-flight').classList.toggle('active', type === 'flight');
  document.getElementById('type-sim').classList.toggle('active', type === 'sim');

  document.querySelectorAll('.flight-only').forEach(el =>
    el.classList.toggle('hidden', type !== 'flight'));
  document.querySelectorAll('.sim-only').forEach(el =>
    el.classList.toggle('hidden', type !== 'sim'));

  document.getElementById('drawer-title').textContent =
    type === 'sim' ? 'New Simulator Session' : 'New Flight';
}

/* ── ROLE FIELDS ─────────────────────────────────────────────── */

function updateRoleFields() {
  const role = document.getElementById('f-role').value;
  const picGroup  = document.getElementById('pic-name-group');
  const instGroup = document.getElementById('instructor-group');
  picGroup.classList.toggle('hidden',  role !== 'Co-Pilot' && role !== 'Dual');
  instGroup.classList.toggle('hidden', role !== 'Dual');
}

/* ── SAVE ENTRY ──────────────────────────────────────────────── */

function saveEntry(e) {
  e.preventDefault();

  const val = id => {
    const el = document.getElementById(id);
    return el ? el.value : '';
  };

  const entry = {
    id:         uid(),
    type:       currentType,
    date:       val('f-date'),
    totalHours: val('f-total'),
    remarks:    val('f-remarks'),
  };

  if (!entry.date || !entry.totalHours) {
    alert('Date and Total Hours are required.');
    return;
  }

  if (currentType === 'flight') {
    Object.assign(entry, {
      origin:         val('f-origin').toUpperCase(),
      dest:           val('f-dest').toUpperCase(),
      offBlock:       val('f-offblock'),
      onBlock:        val('f-onblock'),
      aircraftType:   val('f-aircraft-type').toUpperCase(),
      registration:   val('f-reg').toUpperCase(),
      engine:         val('f-engine'),
      ops:            val('f-ops'),
      dayHours:       val('f-day'),
      nightHours:     val('f-night'),
      ifrHours:       val('f-ifr'),
      vfrHours:       val('f-vfr'),
      role:           val('f-role'),
      picName:        val('f-pic-name'),
      instructorName: val('f-instructor'),
      toDay:          val('f-to-day'),
      toNight:        val('f-to-night'),
      ldgDay:         val('f-ldg-day'),
      ldgNight:       val('f-ldg-night'),
      apprNum:        val('f-appr-num'),
      apprType:       val('f-appr-type'),
    });
  } else {
    entry.fstdType = val('f-fstd-type');
  }

  const entries = getEntries();
  entries.push(entry);
  saveEntries(entries);

  // Reset
  document.getElementById('entry-form').reset();
  setType('flight');
  closeDrawer();
  renderEntries();
  updateStats();
}

/* ── INIT ────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // Drawer
  document.getElementById('btn-add-flight')
    .addEventListener('click', openDrawer);
  document.getElementById('drawer-close')
    .addEventListener('click', closeDrawer);
  document.getElementById('btn-cancel')
    .addEventListener('click', closeDrawer);
  document.getElementById('drawer-overlay')
    .addEventListener('click', closeDrawer);

  // Esc key closes drawer
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') closeDrawer();
  });

  // Type toggle
  document.getElementById('type-flight')
    .addEventListener('click', () => setType('flight'));
  document.getElementById('type-sim')
    .addEventListener('click', () => setType('sim'));

  // Role-dependent fields
  document.getElementById('f-role')
    .addEventListener('change', updateRoleFields);

  // Auto-uppercase on ICAO / registration inputs
  document.querySelectorAll('.upper').forEach(input => {
    input.addEventListener('input', function () {
      const pos = this.selectionStart;
      this.value = this.value.toUpperCase();
      this.setSelectionRange(pos, pos);
    });
  });

  // Form submit
  document.getElementById('entry-form')
    .addEventListener('submit', saveEntry);

  // Initial render
  renderEntries();
  updateStats();
});
