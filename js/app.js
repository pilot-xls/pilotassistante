/* ============================================================
   PilotAssistante — Logbook App
   v0.6 — Authority-aware + hour subset validation
   ============================================================ */

'use strict';

// ── State ───────────────────────────────────────────────────
let entries     = JSON.parse(localStorage.getItem('pa_entries') || '[]');
let editingId   = null;
let currentMode = 'flight'; // 'flight' | 'sim'
let filterSearch   = '';
let filterDateFrom = '';
let filterDateTo   = '';
let filterRole     = '';
let filterType     = 'all'; // 'all' | 'flight' | 'sim'

// ── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Default date to today
  document.getElementById('f-date').valueAsDate = new Date();

  // Block time auto-calc
  document.getElementById('f-off-block').addEventListener('change', calcBlockTime);
  document.getElementById('f-on-block').addEventListener('change',  calcBlockTime);

  // Authority
  const savedAuthority = localStorage.getItem('pa_authority');
  if (!savedAuthority) {
    showAuthorityOverlay();
  } else {
    initAuthority();
  }

  renderEntries();
  renderStats();

  // Close filter popup when clicking outside
  document.addEventListener('click', e => {
    const popup = document.getElementById('filter-popup');
    const btn   = document.getElementById('filter-popup-btn');
    if (popup && !popup.classList.contains('hidden') &&
        !popup.contains(e.target) && btn && !btn.contains(e.target)) {
      popup.classList.add('hidden');
    }
  });
});

// ── Authority ────────────────────────────────────────────────
function showAuthorityOverlay() {
  document.getElementById('authority-overlay').classList.remove('hidden');
}

function selectAuthority(key) {
  localStorage.setItem('pa_authority', key);
  document.getElementById('authority-overlay').classList.add('hidden');
  initAuthority();
  renderEntries();
}

function initAuthority() {
  const auth = getAuthority();

  // Update badge label
  document.getElementById('authority-label').textContent = auth.name;

  // Populate roles dropdown
  const roleSelect = document.getElementById('f-role');
  roleSelect.innerHTML = auth.roles
    .map(r => `<option value="${r.value}">${r.label}</option>`)
    .join('');

  // Populate simulator types
  const simSelect = document.getElementById('f-fstd-type');
  simSelect.innerHTML = auth.simTypes
    .map(t => `<option value="${t}">${t}</option>`)
    .join('');

  // Populate approach types
  const approachSelect = document.getElementById('f-approach-type');
  approachSelect.innerHTML = auth.approachTypes
    .map(t => `<option value="${t}">${t}</option>`)
    .join('');

  applyAuthorityFields();
}

function applyAuthorityFields() {
  const auth = getAuthority();

  // Operations (SP/MP) — EASA only
  setVisible('field-operations', auth.showOperations);

  // SE/ME engine
  if (!auth.showOperations) {
    // FAA: always show engine type
    setVisible('field-engine', true);
  } else {
    // EASA: show only when SP is selected
    handleOperationsChange();
  }

  // Cross-Country + Solo (FAA only) — same row
  setVisible('field-xc', auth.showCrossCountry || auth.showSolo);

  // Instrument Approaches (FAA only)
  setVisible('field-approaches', auth.showApproaches);
}

// ── Field Visibility ─────────────────────────────────────────
function setVisible(id, visible) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('hidden', !visible);
}

// ── Operations Change (SP/MP) ────────────────────────────────
function handleOperationsChange() {
  const auth = getAuthority();
  if (!auth.showOperations) return;

  const spRadio = document.querySelector('input[name="operations"][value="SP"]');
  const isSP    = spRadio && spRadio.checked;
  setVisible('field-engine', isSP && auth.engineWhenSP);
}

// ── Role Change ──────────────────────────────────────────────
function handleRoleChange() {
  const role = document.getElementById('f-role').value;

  // PIC Name: Co-Pilot, SIC, Dual, PICUS (supervising captain)
  setVisible('field-pic-name',       ['CO_PILOT', 'SIC', 'DUAL', 'PICUS'].includes(role));
  // Student/Instructor Name: Instructor, SPIC (student acting as PIC), FE
  setVisible('field-instructor-name', ['INSTRUCTOR', 'SPIC', 'FE'].includes(role));
}

// ── Mode Toggle (Flight / Simulator) ────────────────────────
function setMode(mode) {
  currentMode = mode;

  document.getElementById('toggle-flight').classList.toggle('active', mode === 'flight');
  document.getElementById('toggle-sim').classList.toggle('active',    mode === 'sim');

  setVisible('flight-fields', mode === 'flight');
  setVisible('sim-fields',    mode === 'sim');
}

// ── Block Time Auto-Calculate ────────────────────────────────
function calcBlockTime() {
  const off = document.getElementById('f-off-block').value;
  const on  = document.getElementById('f-on-block').value;
  if (!off || !on) return;

  const [offH, offM] = off.split(':').map(Number);
  const [onH,  onM ] = on.split(':').map(Number);

  let totalMins = (onH * 60 + onM) - (offH * 60 + offM);
  if (totalMins <= 0) totalMins += 24 * 60; // overnight flight

  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  document.getElementById('f-total').value = `${h}:${String(m).padStart(2, '0')}`;
}

// ── Time Helpers ─────────────────────────────────────────────
function parseHours(val) {
  if (!val || val === '') return 0;
  val = String(val).trim();
  if (val.includes(':')) {
    const [h, m] = val.split(':').map(Number);
    return (h || 0) + (m || 0) / 60;
  }
  return parseFloat(val) || 0;
}

function formatHours(decimal) {
  if (!decimal || isNaN(decimal) || decimal < 0) return '0:00';
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  return `${h}:${String(m).padStart(2, '0')}`;
}

// ── Hour Subset Validation ───────────────────────────────────
// Night and IFR cannot exceed Total (Day and VFR are auto-calculated)
// Total landings cannot exceed total take-offs
function validateEntry(data) {
  const total = parseHours(data.totalTime);

  if (total > 0) {
    const night = parseHours(data.nightHours) || 0;
    const ifr   = parseHours(data.ifrTime)    || 0;

    if (night > total)
      return `Night hours (${formatHours(night)}) cannot exceed Total Flight Time (${formatHours(total)})`;

    if (ifr > total)
      return `IFR hours (${formatHours(ifr)}) cannot exceed Total Flight Time (${formatHours(total)})`;
  }

  const totalTO  = (data.toDay  || 0) + (data.toNight  || 0);
  const totalLDG = (data.ldgDay || 0) + (data.ldgNight || 0);
  if (totalLDG !== totalTO)
    return `Total landings (${totalLDG}) must equal total take-offs (${totalTO})`;

  return null;
}

// ── Drawer ───────────────────────────────────────────────────
function openDrawer(id = null) {
  editingId = id;

  // Garante que os selects (Role, FSTD, Approaches) estão sempre preenchidos
  initAuthority();

  document.body.style.overflow = 'hidden';
  document.getElementById('drawer-overlay').classList.remove('hidden');
  document.getElementById('drawer').classList.remove('hidden');

  if (id !== null) {
    document.getElementById('drawer-title').textContent    = 'Edit Entry';
    document.getElementById('submit-btn').textContent      = 'Update Entry';
    populateDrawer(id);
  } else {
    document.getElementById('drawer-title').textContent    = 'New Entry';
    document.getElementById('submit-btn').textContent      = 'Add Entry';
    resetDrawer();
  }
}

function closeDrawer() {
  document.body.style.overflow = '';
  document.getElementById('drawer-overlay').classList.add('hidden');
  document.getElementById('drawer').classList.add('hidden');
  editingId = null;
}

function resetDrawer() {
  setMode('flight');

  // Today's date
  document.getElementById('f-date').valueAsDate = new Date();

  // Clear all text/time inputs
  const toClear = [
    'f-origin', 'f-destination', 'f-off-block', 'f-on-block', 'f-total',
    'f-aircraft-type', 'f-registration',
    'f-pic-name', 'f-instructor-name',
    'f-night', 'f-ifr', 'f-xc', 'f-solo',
    'f-sim-duration', 'f-remarks',
  ];
  toClear.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Numeric defaults
  document.getElementById('f-to-day').value    = 1;
  document.getElementById('f-to-night').value  = 0;
  document.getElementById('f-ldg-day').value   = 1;
  document.getElementById('f-ldg-night').value = 0;
  const approachCountEl = document.getElementById('f-approach-count');
  if (approachCountEl) approachCountEl.value = 0;

  // Operations default MP
  const mpRadio = document.querySelector('input[name="operations"][value="MP"]');
  if (mpRadio) mpRadio.checked = true;

  // Engine default ME
  const meRadio = document.querySelector('input[name="engine"][value="ME"]');
  if (meRadio) meRadio.checked = true;

  // Role default (first option)
  const roleSelect = document.getElementById('f-role');
  if (roleSelect) roleSelect.selectedIndex = 0;

  // Re-apply authority rules and trigger change handlers
  applyAuthorityFields();
  handleRoleChange();
}

function populateDrawer(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;

  setMode(entry.isSim ? 'sim' : 'flight');
  setValue('f-date', entry.date);

  if (entry.isSim) {
    setValue('f-fstd-type',    entry.fstdType);
    setValue('f-sim-duration', entry.simDuration);
    setValue('f-remarks',      entry.remarks);
    return;
  }

  // Flight fields
  setValue('f-origin',       entry.origin);
  setValue('f-destination',  entry.destination);
  setValue('f-off-block',    entry.offBlock);
  setValue('f-on-block',     entry.onBlock);
  setValue('f-total',        entry.totalTime);
  setValue('f-aircraft-type', entry.aircraftType);
  setValue('f-registration', entry.registration);

  // Operations radio
  const opsVal = entry.operations || 'MP';
  const opsRadio = document.querySelector(`input[name="operations"][value="${opsVal}"]`);
  if (opsRadio) { opsRadio.checked = true; handleOperationsChange(); }

  // Engine radio
  const engVal = entry.engine || 'ME';
  const engRadio = document.querySelector(`input[name="engine"][value="${engVal}"]`);
  if (engRadio) engRadio.checked = true;

  // Role
  setValue('f-role', entry.role);
  handleRoleChange();

  // Hours
  setValue('f-pic-name',        entry.picName);
  setValue('f-instructor-name', entry.instructorName);
  setValue('f-night',           entry.nightHours);
  setValue('f-ifr',             entry.ifrTime);
  setValue('f-xc',              entry.xcHours);
  setValue('f-solo',            entry.soloHours);

  // T/O & LDG
  document.getElementById('f-to-day').value    = entry.toDay    ?? 1;
  document.getElementById('f-to-night').value  = entry.toNight  ?? 0;
  document.getElementById('f-ldg-day').value   = entry.ldgDay   ?? 1;
  document.getElementById('f-ldg-night').value = entry.ldgNight ?? 0;

  // Approaches
  setValue('f-approach-count', entry.approachCount);
  setValue('f-approach-type',  entry.approachType);

  setValue('f-remarks', entry.remarks);

  applyAuthorityFields();
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined && val !== null && val !== '') el.value = val;
}

// ── Submit / Save ────────────────────────────────────────────
function handleSubmit() {
  const isSim = currentMode === 'sim';
  const date  = document.getElementById('f-date').value;

  if (!date) {
    alert('Date is required.');
    return;
  }

  let entryData = {
    id:        editingId !== null ? editingId : Date.now(),
    date,
    isSim,
    authority: getAuthorityKey(),
    remarks:   document.getElementById('f-remarks').value.trim(),
  };

  if (isSim) {
    // ── Simulator entry ──
    const simDuration = document.getElementById('f-sim-duration').value;
    if (!simDuration) {
      alert('Session duration is required.');
      return;
    }
    entryData.fstdType    = document.getElementById('f-fstd-type').value;
    entryData.simDuration = simDuration;

  } else {
    // ── Flight entry ──

    // Block times required (Part-FCL)
    const offBlock = document.getElementById('f-off-block').value;
    const onBlock  = document.getElementById('f-on-block').value;
    if (!offBlock || !onBlock) {
      alert('Off-Block and On-Block times are required for flights (Part-FCL).');
      return;
    }

    // Route, aircraft and role required
    const origin       = document.getElementById('f-origin').value.trim();
    const destination  = document.getElementById('f-destination').value.trim();
    const aircraftType = document.getElementById('f-aircraft-type').value.trim();
    const registration = document.getElementById('f-registration').value.trim();
    const role         = document.getElementById('f-role').value;

    if (!origin || !destination) {
      alert('Origin and Destination (ICAO) are required.');
      return;
    }
    if (!aircraftType) {
      alert('Aircraft Type is required.');
      return;
    }
    if (!registration) {
      alert('Registration is required.');
      return;
    }
    if (!role) {
      alert('Role is required.');
      return;
    }

    entryData = {
      ...entryData,
      origin:         document.getElementById('f-origin').value.toUpperCase().trim(),
      destination:    document.getElementById('f-destination').value.toUpperCase().trim(),
      offBlock,
      onBlock,
      totalTime:      document.getElementById('f-total').value.trim(),
      aircraftType:   document.getElementById('f-aircraft-type').value.trim(),
      registration:   document.getElementById('f-registration').value.toUpperCase().trim(),
      operations:     document.querySelector('input[name="operations"]:checked')?.value || 'MP',
      engine:         document.querySelector('input[name="engine"]:checked')?.value || 'ME',
      role:           document.getElementById('f-role').value,
      picName:        document.getElementById('f-pic-name').value.trim(),
      instructorName: document.getElementById('f-instructor-name').value.trim(),
      nightHours:     document.getElementById('f-night').value.trim(),
      ifrTime:        document.getElementById('f-ifr').value.trim(),
      xcHours:        document.getElementById('f-xc').value.trim(),
      soloHours:      document.getElementById('f-solo').value.trim(),
      toDay:          parseInt(document.getElementById('f-to-day').value)    || 0,
      toNight:        parseInt(document.getElementById('f-to-night').value)  || 0,
      ldgDay:         parseInt(document.getElementById('f-ldg-day').value)   || 0,
      ldgNight:       parseInt(document.getElementById('f-ldg-night').value) || 0,
      approachCount:  document.getElementById('f-approach-count')?.value || '',
      approachType:   document.getElementById('f-approach-type')?.value  || '',
    };

    // ── Auto-calculate Day and VFR ──
    const totalH = parseHours(entryData.totalTime);
    const nightH = parseHours(entryData.nightHours);
    const ifrH   = parseHours(entryData.ifrTime);
    entryData.dayHours = formatHours(Math.max(0, totalH - nightH));
    entryData.vfrTime  = formatHours(Math.max(0, totalH - ifrH));

    // ── Validate entry ──
    const hoursError = validateEntry(entryData);
    if (hoursError) {
      alert(hoursError);
      return;
    }
  }

  // ── Save to localStorage ──
  if (editingId !== null) {
    const idx = entries.findIndex(e => e.id === editingId);
    if (idx !== -1) entries[idx] = entryData;
  } else {
    entries.push(entryData);
  }

  localStorage.setItem('pa_entries', JSON.stringify(entries));
  closeDrawer();
  renderEntries();
  renderStats();
}

// ── Delete ───────────────────────────────────────────────────
function deleteEntry(id, event) {
  event.stopPropagation();
  if (!confirm('Delete this entry? This cannot be undone.')) return;
  entries = entries.filter(e => e.id !== id);
  localStorage.setItem('pa_entries', JSON.stringify(entries));
  renderEntries();
  renderStats();
}

// ── Filters ──────────────────────────────────────────────────
function hasAdvancedFilter() {
  return filterDateFrom || filterDateTo || filterRole || filterType !== 'all';
}

function applyFilters() {
  filterSearch   = document.getElementById('filter-search').value.trim().toLowerCase();
  filterDateFrom = document.getElementById('fp-date-from')?.value || '';
  filterDateTo   = document.getElementById('fp-date-to')?.value   || '';
  filterRole     = document.getElementById('fp-role')?.value      || '';
  const hasFilter = filterSearch || hasAdvancedFilter();
  document.getElementById('filter-clear').classList.toggle('hidden', !hasFilter);
  document.getElementById('filter-popup-btn').classList.toggle('active', !!hasAdvancedFilter());
  renderEntries();
}

function clearFilters() {
  document.getElementById('filter-search').value = '';
  filterSearch = '';
  clearAdvancedFilters();
}

function toggleFilterPopup() {
  const popup = document.getElementById('filter-popup');
  const isOpen = !popup.classList.contains('hidden');
  if (!isOpen) {
    populateRoleFilter();
    popup.classList.remove('hidden');
  } else {
    popup.classList.add('hidden');
  }
}

function setTypeFilter(type) {
  filterType = type;
  document.querySelectorAll('.fp-type-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.type === type)
  );
  applyFilters();
}

function clearAdvancedFilters() {
  const from = document.getElementById('fp-date-from');
  const to   = document.getElementById('fp-date-to');
  const role = document.getElementById('fp-role');
  if (from) from.value = '';
  if (to)   to.value   = '';
  if (role) role.value = '';
  filterDateFrom = '';
  filterDateTo   = '';
  filterRole     = '';
  filterType     = 'all';
  document.querySelectorAll('.fp-type-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.type === 'all')
  );
  document.getElementById('filter-clear').classList.add('hidden');
  document.getElementById('filter-popup-btn').classList.remove('active');
  renderEntries();
}

function populateRoleFilter() {
  const usedRoles = [...new Set(
    entries.filter(e => !e.isSim && e.role).map(e => e.role)
  )];
  const labelMap = {};
  Object.values(AUTHORITIES).forEach(auth =>
    auth.roles.forEach(r => { if (!labelMap[r.value]) labelMap[r.value] = r.label; })
  );
  const select  = document.getElementById('fp-role');
  const current = select.value;
  select.innerHTML = '<option value="">All roles</option>' +
    usedRoles.sort().map(v =>
      `<option value="${v}"${v === current ? ' selected' : ''}>${labelMap[v] || v}</option>`
    ).join('');
}

// ── Filter Helper ────────────────────────────────────────────
function getFilteredEntries() {
  let filtered = [...entries];
  if (filterDateFrom) filtered = filtered.filter(e => e.date && e.date >= filterDateFrom);
  if (filterDateTo)   filtered = filtered.filter(e => e.date && e.date <= filterDateTo);
  if (filterRole)     filtered = filtered.filter(e => e.role === filterRole);
  if (filterType === 'flight') filtered = filtered.filter(e => !e.isSim);
  if (filterType === 'sim')    filtered = filtered.filter(e => e.isSim);
  if (filterSearch) {
    filtered = filtered.filter(e => {
      const auth      = AUTHORITIES[e.authority] || AUTHORITIES.EASA;
      const roleObj   = auth ? auth.roles.find(r => r.value === e.role) : null;
      const roleLabel = roleObj ? roleObj.label : (e.role || '');
      const haystack  = [e.origin, e.destination, e.aircraftType, e.registration, e.fstdType, e.remarks, roleLabel]
        .filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(filterSearch);
    });
  }
  return filtered;
}

// ── Render Entries ───────────────────────────────────────────
function renderEntries() {
  const list  = document.getElementById('entries-list');
  const count = document.getElementById('entries-count');

  const filtered = getFilteredEntries();

  const total = entries.length;
  const shown = filtered.length;
  const isFiltered = filterSearch || hasAdvancedFilter();
  count.textContent = isFiltered
    ? `${shown} of ${total} ${total === 1 ? 'entry' : 'entries'}`
    : `${total} ${total === 1 ? 'entry' : 'entries'}`;

  if (filtered.length === 0) {
    list.innerHTML = entries.length === 0
      ? `<div class="empty-state">
           <i class="ti ti-plane-off"></i>
           <p>No flights logged yet</p>
           <p class="empty-sub">Tap + to add your first flight</p>
         </div>`
      : `<div class="empty-state">
           <i class="ti ti-filter-off"></i>
           <p>No entries match your filters</p>
           <p class="empty-sub"><button class="btn-link" onclick="clearFilters()">Clear filters</button></p>
         </div>`;
    return;
  }

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));
  list.innerHTML = sorted.map(entry =>
    entry.isSim ? renderSimCard(entry) : renderFlightCard(entry)
  ).join('');
}

function renderFlightCard(e) {
  const auth      = AUTHORITIES[e.authority] || AUTHORITIES.EASA;
  const roleObj   = auth.roles.find(r => r.value === e.role);
  const roleLabel = roleObj ? roleObj.label : (e.role || '');

  const hasNight = parseHours(e.nightHours) > 0;
  const hasIFR   = parseHours(e.ifrTime)    > 0;

  const tags = [
    e.aircraftType ? `<span class="entry-tag"><i class="ti ti-plane-tilt"></i> ${e.aircraftType}${e.registration ? ' ' + e.registration : ''}</span>` : '',
    roleLabel       ? `<span class="entry-tag">${roleLabel}</span>` : '',
    hasNight        ? `<span class="entry-tag"><i class="ti ti-moon"></i> ${e.nightHours}</span>` : '',
    hasIFR          ? `<span class="entry-tag"><i class="ti ti-cloud"></i> IFR ${e.ifrTime}</span>` : '',
  ].filter(Boolean).join('');

  return `
    <div class="entry-card" onclick="openDrawer(${e.id})">
      <div class="entry-top">
        <div class="entry-route">
          ${e.origin || '???'}
          <i class="ti ti-arrow-narrow-right"></i>
          ${e.destination || '???'}
        </div>
        <div class="entry-right">
          <span class="entry-time">${e.totalTime || '–'}</span>
          <button class="entry-delete" onclick="deleteEntry(${e.id}, event)" title="Delete">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      </div>
      <div class="entry-meta">
        <span class="entry-date">${formatDate(e.date)}</span>
        ${tags}
      </div>
    </div>`;
}

function renderSimCard(e) {
  return `
    <div class="entry-card" onclick="openDrawer(${e.id})">
      <div class="entry-top">
        <div class="entry-route">
          <i class="ti ti-device-laptop"></i>
          ${e.fstdType || 'Simulator'}
        </div>
        <div class="entry-right">
          <span class="entry-time">${e.simDuration || '–'}</span>
          <button class="entry-delete" onclick="deleteEntry(${e.id}, event)" title="Delete">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      </div>
      <div class="entry-meta">
        <span class="entry-date">${formatDate(e.date)}</span>
        <span class="entry-tag sim"><i class="ti ti-device-laptop"></i> SIM</span>
        ${e.remarks ? `<span class="entry-date">${e.remarks}</span>` : ''}
      </div>
    </div>`;
}

// ── Render Stats ─────────────────────────────────────────────
function renderStats() {
  const flights = entries.filter(e => !e.isSim);
  const sims    = entries.filter(e => e.isSim);

  const now       = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const total = flights.reduce((s, e) => s + parseHours(e.totalTime),  0);
  const pic   = flights.filter(e => e.role === 'PIC')
                        .reduce((s, e) => s + parseHours(e.totalTime), 0);
  const ifr   = flights.reduce((s, e) => s + parseHours(e.ifrTime),   0);
  const night = flights.reduce((s, e) => s + parseHours(e.nightHours),0);
  const sim   = sims.reduce((s, e)    => s + parseHours(e.simDuration),0);
  const month = flights
                  .filter(e => e.date && e.date.startsWith(thisMonth))
                  .reduce((s, e) => s + parseHours(e.totalTime), 0);

  document.getElementById('stat-total').textContent = formatHours(total);
  document.getElementById('stat-pic').textContent   = formatHours(pic);
  document.getElementById('stat-ifr').textContent   = formatHours(ifr);
  document.getElementById('stat-night').textContent = formatHours(night);
  document.getElementById('stat-sim').textContent   = formatHours(sim);
  document.getElementById('stat-month').textContent = formatHours(month);
}

// ── Date Formatting ──────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  // Use T12:00:00 to avoid timezone shifts
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-GB', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  });
}

// ── Export CSV ───────────────────────────────────────────────
function exportCSV() {
  const toExport = getFilteredEntries();
  if (toExport.length === 0) {
    alert('No entries to export.');
    return;
  }

  const headers = [
    'Date', 'Type', 'Authority',
    'From (ICAO)', 'To (ICAO)', 'Off-Block (UTC)', 'On-Block (UTC)',
    'Total HRS', 'Day HRS', 'Night HRS', 'IFR HRS', 'VFR HRS',
    'XC HRS', 'Solo HRS',
    'Operations', 'Engine',
    'Aircraft Type', 'Registration',
    'Role', 'PIC Name', 'Student/Instructor',
    'T/O Day', 'T/O Night', 'LDG Day', 'LDG Night',
    'Approaches #', 'Approach Type',
    'FSTD Type', 'SIM HRS',
    'Remarks',
  ];

  const sorted = [...toExport].sort((a, b) => a.date.localeCompare(b.date));

  const rows = sorted.map(e => {
    if (e.isSim) {
      return [
        e.date, 'Simulator', e.authority || '',
        '', '', '', '',
        '', '', '', '', '',
        '', '',
        '', '',
        '', '',
        '', '', '',
        '', '', '', '',
        '', '',
        e.fstdType || '', e.simDuration || '',
        e.remarks || '',
      ];
    }

    const auth     = AUTHORITIES[e.authority] || AUTHORITIES.EASA;
    const roleObj  = auth.roles.find(r => r.value === e.role);
    const roleLabel = roleObj ? roleObj.label : (e.role || '');

    return [
      e.date, 'Flight', e.authority || '',
      e.origin || '', e.destination || '', e.offBlock || '', e.onBlock || '',
      e.totalTime || '', e.dayHours || '', e.nightHours || '', e.ifrTime || '', e.vfrTime || '',
      e.xcHours || '', e.soloHours || '',
      e.operations || '', e.engine || '',
      e.aircraftType || '', e.registration || '',
      roleLabel, e.picName || '', e.instructorName || '',
      e.toDay ?? '', e.toNight ?? '', e.ldgDay ?? '', e.ldgNight ?? '',
      e.approachCount || '', e.approachType || '',
      '', '',
      e.remarks || '',
    ];
  });

  const escapeCell = val => {
    const s = String(val);
    return (s.includes(',') || s.includes('"') || s.includes('\n'))
      ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const csv  = [headers, ...rows].map(row => row.map(escapeCell).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `pilotassistante_logbook_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
