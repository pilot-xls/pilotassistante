/* ============================================================
   PilotAssistante — Logbook App
   v0.6 — Authority-aware + hour subset validation
   ============================================================ */

'use strict';

// ── State ───────────────────────────────────────────────────
let entries     = JSON.parse(localStorage.getItem('pa_entries') || '[]');
let editingId   = null;
let currentMode = 'flight'; // 'flight' | 'sim'
let filterSearch       = '';
let filterDateFrom     = '';
let filterDateTo       = '';
let filterAirport      = '';
let filterAircraftType = '';
let filterRegistration = '';
let filterRole         = '';
let filterOperations   = ''; // '' | 'SP' | 'MP'
let filterEngine       = ''; // '' | 'SE' | 'ME'
let filterHasNight     = false;
let filterHasIFR       = false;
let filterType         = 'all'; // 'all' | 'flight' | 'sim'
let statsPeriod        = 'ytd'; // 'ytd' | '12m' | 'all'

// ── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // iOS detection — adds .is-ios to <html> for Safari-specific CSS
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    document.documentElement.classList.add('is-ios');
  }

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

  // Update badge label (flag emoji) and tooltip (full name)
  document.getElementById('authority-label').textContent = auth.flag;
  document.getElementById('authority-badge').title = auth.name;

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
  return filterDateFrom || filterDateTo || filterRole || filterType !== 'all'
    || filterAirport || filterAircraftType || filterRegistration
    || filterOperations || filterEngine || filterHasNight || filterHasIFR;
}

function applyFilters() {
  filterSearch       = document.getElementById('filter-search').value.trim().toLowerCase();
  filterDateFrom     = document.getElementById('fp-date-from')?.value  || '';
  filterDateTo       = document.getElementById('fp-date-to')?.value    || '';
  filterAirport      = (document.getElementById('fp-airport')?.value.trim() || '').toUpperCase();
  filterAircraftType = document.getElementById('fp-ac-type')?.value    || '';
  filterRegistration = document.getElementById('fp-reg')?.value        || '';
  filterRole         = document.getElementById('fp-role')?.value       || '';
  filterHasNight     = document.getElementById('fp-has-night')?.checked || false;
  filterHasIFR       = document.getElementById('fp-has-ifr')?.checked   || false;
  // filterOperations and filterEngine are set by setOpsFilter()/setEngineFilter()
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
    if (window.innerWidth <= 500) {
      const btn  = document.getElementById('filter-popup-btn');
      const rect = btn.getBoundingClientRect();
      const top  = Math.round(rect.bottom) + 6;
      popup.style.top       = top + 'px';
      popup.style.maxHeight = `calc(100dvh - ${top + 14}px)`;
    } else {
      popup.style.top       = '';
      popup.style.maxHeight = '';
    }
    populatePopupFilters();
    setVisible('fp-group-ops', getAuthority().showOperations);
    popup.classList.remove('hidden');
  } else {
    popup.classList.add('hidden');
  }
}

function setTypeFilter(type) {
  filterType = type;
  document.querySelectorAll('#fp-group-type .fp-type-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.type === type)
  );
  applyFilters();
}

function setOpsFilter(ops) {
  filterOperations = ops === 'all' ? '' : ops;
  document.querySelectorAll('#fp-group-ops .fp-type-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.ops === ops)
  );
  applyFilters();
}

function setEngineFilter(eng) {
  filterEngine = eng === 'all' ? '' : eng;
  document.querySelectorAll('#fp-group-eng .fp-type-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.eng === eng)
  );
  applyFilters();
}

function clearAdvancedFilters() {
  ['fp-date-from', 'fp-date-to', 'fp-airport', 'fp-ac-type', 'fp-reg', 'fp-role'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['fp-has-night', 'fp-has-ifr'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
  filterDateFrom = ''; filterDateTo       = '';
  filterAirport  = ''; filterAircraftType = ''; filterRegistration = '';
  filterRole     = ''; filterOperations   = ''; filterEngine       = '';
  filterHasNight = false; filterHasIFR    = false;
  filterType     = 'all';
  document.querySelectorAll('#fp-group-type .fp-type-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.type === 'all'));
  document.querySelectorAll('#fp-group-ops .fp-type-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.ops === 'all'));
  document.querySelectorAll('#fp-group-eng .fp-type-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.eng === 'all'));
  document.getElementById('filter-clear').classList.add('hidden');
  document.getElementById('filter-popup-btn').classList.remove('active');
  renderEntries();
}

function populatePopupFilters() {
  const flights = entries.filter(e => !e.isSim);

  const labelMap = {};
  Object.values(AUTHORITIES).forEach(auth =>
    auth.roles.forEach(r => { if (!labelMap[r.value]) labelMap[r.value] = r.label; })
  );

  const buildSelect = (id, defaultLabel, values, current) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `<option value="">${defaultLabel}</option>` +
      values.map(v => `<option value="${v}"${v === current ? ' selected' : ''}>${v}</option>`).join('');
  };

  const roles = [...new Set(flights.filter(e => e.role).map(e => e.role))].sort();
  const roleSelect  = document.getElementById('fp-role');
  const currentRole = roleSelect?.value || '';
  if (roleSelect) {
    roleSelect.innerHTML = '<option value="">All roles</option>' +
      roles.map(v => `<option value="${v}"${v === currentRole ? ' selected' : ''}>${labelMap[v] || v}</option>`).join('');
  }

  const types = [...new Set(flights.filter(e => e.aircraftType).map(e => e.aircraftType))].sort();
  buildSelect('fp-ac-type', 'All types', types, document.getElementById('fp-ac-type')?.value || '');

  const regs = [...new Set(flights.filter(e => e.registration).map(e => e.registration))].sort();
  buildSelect('fp-reg', 'All registrations', regs, document.getElementById('fp-reg')?.value || '');
}

// ── Filter Helper ────────────────────────────────────────────
function getFilteredEntries() {
  let filtered = [...entries];
  if (filterDateFrom)     filtered = filtered.filter(e => e.date && e.date >= filterDateFrom);
  if (filterDateTo)       filtered = filtered.filter(e => e.date && e.date <= filterDateTo);
  if (filterType === 'flight') filtered = filtered.filter(e => !e.isSim);
  if (filterType === 'sim')    filtered = filtered.filter(e => e.isSim);
  if (filterAirport)      filtered = filtered.filter(e =>
    (e.origin || '').includes(filterAirport) || (e.destination || '').includes(filterAirport));
  if (filterAircraftType) filtered = filtered.filter(e => e.aircraftType === filterAircraftType);
  if (filterRegistration) filtered = filtered.filter(e => e.registration === filterRegistration);
  if (filterRole)         filtered = filtered.filter(e => e.role === filterRole);
  if (filterOperations)   filtered = filtered.filter(e => e.operations === filterOperations);
  if (filterEngine)       filtered = filtered.filter(e => e.engine === filterEngine);
  if (filterHasNight)     filtered = filtered.filter(e => parseHours(e.nightHours) > 0);
  if (filterHasIFR)       filtered = filtered.filter(e => parseHours(e.ifrTime) > 0);
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
    renderStats();
    return;
  }

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));
  list.innerHTML = sorted.map(entry =>
    entry.isSim ? renderSimCard(entry) : renderFlightCard(entry)
  ).join('');

  renderStats();
}

function renderFlightCard(e) {
  const auth      = AUTHORITIES[e.authority] || AUTHORITIES.EASA;
  const roleObj   = auth.roles.find(r => r.value === e.role);
  const roleLabel = roleObj ? roleObj.label : (e.role || '');

  const d     = new Date(e.date + 'T12:00:00');
  const day   = d.getDate();
  const month = d.toLocaleDateString('en-GB', {month: 'short'}).toUpperCase();

  const hasNight = parseHours(e.nightHours) > 0;
  const hasIFR   = parseHours(e.ifrTime)    > 0;

  const pills = [
    roleLabel      ? `<span class="entry-pill role-pill">${roleLabel}</span>` : '',
    e.totalTime    ? `<span class="entry-pill dur-pill">${e.totalTime} h</span>` : '',
    e.aircraftType ? `<span class="entry-pill type-pill">${e.aircraftType}</span>` : '',
    hasNight       ? `<span class="entry-pill night-pill"><i class="ti ti-moon"></i> ${e.nightHours}</span>` : '',
    hasIFR         ? `<span class="entry-pill ifr-pill">IFR</span>` : '',
  ].filter(Boolean).join('');

  const depTime = e.offBlock || '';
  const arrTime = e.onBlock  || '';

  return `
    <div class="entry-card" onclick="openDrawer(${e.id})">
      <div class="entry-date-col">
        <span class="entry-day">${day}</span>
        <span class="entry-month-lbl">${month}</span>
      </div>
      <div class="entry-body">
        <div class="entry-block-times">
          <span>${depTime}</span>
          <span>${arrTime}</span>
        </div>
        <div class="entry-airports">
          <span>${e.origin || '???'}</span>
          <span>${e.destination || '???'}</span>
        </div>
        <div class="entry-pills">${pills}</div>
      </div>
      <button class="entry-delete" onclick="deleteEntry(${e.id}, event)" title="Delete">
        <i class="ti ti-trash"></i>
      </button>
    </div>`;
}

function renderSimCard(e) {
  const d     = new Date(e.date + 'T12:00:00');
  const day   = d.getDate();
  const month = d.toLocaleDateString('en-GB', {month: 'short'}).toUpperCase();

  return `
    <div class="entry-card" onclick="openDrawer(${e.id})">
      <div class="entry-date-col">
        <span class="entry-day">${day}</span>
        <span class="entry-month-lbl">${month}</span>
      </div>
      <div class="entry-body">
        <div class="entry-block-times"><span></span><span></span></div>
        <div class="entry-airports">
          <span>${e.fstdType || 'Simulator'}</span>
          <span></span>
        </div>
        <div class="entry-pills">
          <span class="entry-pill sim-pill">SIM</span>
          ${e.simDuration ? `<span class="entry-pill dur-pill">${e.simDuration} h</span>` : ''}
        </div>
      </div>
      <button class="entry-delete" onclick="deleteEntry(${e.id}, event)" title="Delete">
        <i class="ti ti-trash"></i>
      </button>
    </div>`;
}

// ── Render Stats ─────────────────────────────────────────────
function renderStats() {
  // Quick stats removed from flights view; stats are shown in the Stats tab
}

// ── Tab System ───────────────────────────────────────────────
function showTab(tab) {
  document.getElementById('log-view').classList.toggle('hidden', tab !== 'log');
  document.getElementById('stats-view').classList.toggle('hidden', tab !== 'stats');

  // Update header
  document.getElementById('header-title').textContent = tab === 'stats' ? 'My stats' : 'My flights';
  document.getElementById('btn-header-export').classList.toggle('hidden', tab !== 'stats');
  document.getElementById('fab-add').style.display = tab === 'stats' ? 'none' : '';

  // Update bottom nav active state
  const navFlights = document.getElementById('nav-flights');
  const navStats   = document.getElementById('nav-stats');
  if (navFlights) navFlights.classList.toggle('active', tab === 'log');
  if (navStats)   navStats.classList.toggle('active',   tab === 'stats');

  if (tab === 'stats') renderStatsView();
}

function focusSearch() {
  const el = document.getElementById('filter-search');
  if (el) { el.focus(); el.select(); }
}

function setStatsPeriod(p) {
  statsPeriod = p;
  document.querySelectorAll('.period-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.period === p)
  );
  renderStatsContent();
}

function getPeriodFlights() {
  const fl = entries.filter(e => !e.isSim);
  const now = new Date();
  if (statsPeriod === 'ytd') return fl.filter(e => e.date >= `${now.getFullYear()}-01-01`);
  if (statsPeriod === '12m') {
    const d = new Date(now); d.setFullYear(d.getFullYear() - 1);
    return fl.filter(e => e.date >= d.toISOString().slice(0, 10));
  }
  return fl;
}

function renderStatsView() {
  const sv = document.getElementById('stats-view');
  sv.innerHTML = `
    <div class="period-bar hidden">
      <button class="period-btn${statsPeriod==='ytd'?' active':''}" data-period="ytd" onclick="setStatsPeriod('ytd')">This Year</button>
      <button class="period-btn${statsPeriod==='12m'?' active':''}" data-period="12m" onclick="setStatsPeriod('12m')">12 Months</button>
      <button class="period-btn${statsPeriod==='all'?' active':''}" data-period="all" onclick="setStatsPeriod('all')">All Time</button>
    </div>
    <div id="sv-content"></div>`;
  renderStatsContent();
}

function renderStatsContent() {
  const fl    = getPeriodFlights();
  const allFl = entries.filter(e => !e.isSim);
  const allSm = entries.filter(e => e.isSim);

  // ── Period summary ──
  const total = fl.reduce((s,e) => s + parseHours(e.totalTime), 0);
  const pic   = fl.filter(e => e.role==='PIC').reduce((s,e) => s + parseHours(e.totalTime), 0);
  const night = fl.reduce((s,e) => s + parseHours(e.nightHours), 0);
  const ifr   = fl.reduce((s,e) => s + parseHours(e.ifrTime), 0);
  const sim   = allSm.reduce((s,e) => s + parseHours(e.simDuration), 0);
  const cnt   = fl.length;
  const ldgs  = fl.reduce((s,e) => s + (e.ldgDay||0) + (e.ldgNight||0), 0);
  const avg   = cnt > 0 ? total / cnt : 0;

  // ── Monthly chart (last 12 months, always all-time) ──
  const now = new Date();
  const monthly = [];
  for (let i = 11; i >= 0; i--) {
    const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const lbl = d.toLocaleDateString('en-GB', {month:'short'});
    const hrs = allFl.filter(e => e.date.startsWith(key)).reduce((s,e) => s + parseHours(e.totalTime), 0);
    monthly.push({key, lbl, hrs});
  }
  const maxH  = Math.max(...monthly.map(m => m.hrs), 0.1);
  const BH=70, BW=14, GAP=6;
  const SVW   = monthly.length * (BW + GAP) - GAP;
  const thisMo= `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const bars  = monthly.map((m,i) => {
    const h    = m.hrs > 0 ? Math.max(m.hrs / maxH * BH, 3) : 1;
    const x    = i * (BW + GAP);
    const y    = BH - h;
    const fill = m.hrs > 0 ? (m.key === thisMo ? '#5552C0' : '#2825A0') : '#ECEBF8';
    return `<g><rect x="${x}" y="${y.toFixed(1)}" width="${BW}" height="${h.toFixed(1)}" rx="3" fill="${fill}"/>` +
           `<text x="${x+BW/2}" y="${BH+15}" text-anchor="middle" font-size="7" fill="#8A88B0" font-family="Space Mono,monospace">${m.lbl}</text></g>`;
  }).join('');
  const chartSvg = `<svg class="monthly-svg" viewBox="0 0 ${SVW} ${BH+20}" width="100%">${bars}</svg>`;

  // ── 90-day currency (always all-time) ──
  const cut  = new Date(now); cut.setDate(cut.getDate() - 90);
  const cutS = cut.toISOString().slice(0, 10);
  const r90  = allFl.filter(e => e.date >= cutS);
  const ldgD90 = r90.reduce((s,e) => s + (e.ldgDay||0),  0);
  const ldgN90 = r90.reduce((s,e) => s + (e.ldgNight||0), 0);
  const nightFl = allFl.filter(e => (e.ldgNight||0)>0).sort((a,b) => b.date.localeCompare(a.date));
  let nightRow = '';
  if (nightFl.length >= 3) {
    const exp = new Date(nightFl[2].date + 'T12:00:00');
    exp.setDate(exp.getDate() + 90);
    const expired = exp < now;
    const soon    = !expired && (exp - now) < 30 * 24 * 3600 * 1000;
    const ds  = exp.toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'});
    const cls = expired ? 'curr-exp' : soon ? 'curr-warn' : 'curr-ok';
    nightRow = `<div class="curr-row ${cls}"><i class="ti ti-certificate"></i><span>Night currency</span><span class="curr-val">${expired ? 'Expired' : `Until ${ds}`}</span></div>`;
  } else {
    nightRow = `<div class="curr-row curr-exp"><i class="ti ti-certificate"></i><span>Night currency</span><span class="curr-val">Insufficient data</span></div>`;
  }

  // ── Breakdown (period-filtered) ──
  const byType = {}, byRole = {};
  fl.forEach(e => {
    if (e.aircraftType) byType[e.aircraftType] = (byType[e.aircraftType]||0) + parseHours(e.totalTime);
    if (e.role)         byRole[e.role]         = (byRole[e.role]||0)         + parseHours(e.totalTime);
  });
  const auth = getAuthority();
  const rLbl = code => (auth.roles.find(r => r.value === code) || {label: code}).label;
  const mkBars = (obj, ref) => Object.entries(obj).sort((a,b) => b[1]-a[1]).slice(0,5).map(([k,h]) => {
    const pct = ref > 0 ? Math.round(h / ref * 100) : 0;
    return `<div class="bk-row"><span class="bk-name">${k}</span><div class="bk-track"><div class="bk-fill" style="width:${pct}%"></div></div><span class="bk-val">${formatHours(h)}</span></div>`;
  }).join('');

  // ── Insights (all-time) ──
  const aType = {}, aPort = {}, aRoute = {};
  allFl.forEach(e => {
    if (e.aircraftType)             aType[e.aircraftType] = (aType[e.aircraftType]||0) + parseHours(e.totalTime);
    if (e.origin)                   aPort[e.origin]       = (aPort[e.origin]||0)       + 1;
    if (e.destination)              aPort[e.destination]  = (aPort[e.destination]||0)  + 1;
    if (e.origin && e.destination)  { const k=`${e.origin}→${e.destination}`; aRoute[k]=(aRoute[k]||0)+1; }
  });
  const longest  = allFl.reduce((mx,e) => parseHours(e.totalTime) > parseHours(mx?.totalTime||'0') ? e : mx, null);
  const busiest  = monthly.reduce((mx,m) => m.hrs > (mx?.hrs||0) ? m : mx, null);
  const topType  = Object.entries(aType).sort((a,b) => b[1]-a[1])[0];
  const topPort  = Object.entries(aPort).sort((a,b) => b[1]-a[1])[0];
  const topRoute = Object.entries(aRoute).sort((a,b) => b[1]-a[1])[0];
  const insList  = [
    topType  && {ic:'ti-plane-tilt',       lbl:'Most Flown Aircraft', val: topType[0]},
    topPort  && {ic:'ti-building-airport', lbl:'Top Airport',         val: `${topPort[0]} (${topPort[1]} movements)`},
    topRoute && {ic:'ti-route',            lbl:'Top Route',           val: `${topRoute[0]}  ×${topRoute[1]}`},
    longest  && parseHours(longest.totalTime) > 0 && {ic:'ti-trophy', lbl:'Longest Flight', val:`${formatHours(parseHours(longest.totalTime))} · ${longest.origin}–${longest.destination}`},
    busiest  && busiest.hrs > 0 && {ic:'ti-star', lbl:'Busiest Month', val:`${busiest.lbl} (${formatHours(busiest.hrs)})`},
  ].filter(Boolean);

  const noData = '<div class="sv-empty">No data for this period</div>';

  // ── EASA FTL gauges (fixed periods) ──
  const now2  = new Date();
  const cut28 = new Date(now2); cut28.setDate(cut28.getDate() - 28);
  const cut28S= cut28.toISOString().slice(0,10);
  const hrs28 = allFl.filter(e => e.date >= cut28S).reduce((s,e) => s + parseHours(e.totalTime), 0);

  const cutYr = `${now2.getFullYear()}-01-01`;
  const hrsYr = allFl.filter(e => e.date >= cutYr).reduce((s,e) => s + parseHours(e.totalTime), 0);

  const cut12m = new Date(now2); cut12m.setFullYear(cut12m.getFullYear() - 1);
  const cut12S = cut12m.toISOString().slice(0,10);
  const hrs12m = allFl.filter(e => e.date >= cut12S).reduce((s,e) => s + parseHours(e.totalTime), 0);

  function makeGauge(value, maxVal, label, maxLabel) {
    const R = 38, CX = 50, CY = 50;
    const FULL_ANGLE = 270;
    const CIRC = 2 * Math.PI * R;
    const arcLen = CIRC * FULL_ANGLE / 360;
    const gap    = CIRC - arcLen;
    const pct    = Math.min(value / maxVal, 1);
    const filled = pct * arcLen;
    const startAngle = 135;

    const bgDash  = `${arcLen.toFixed(2)} ${gap.toFixed(2)}`;
    const fgDash  = `${filled.toFixed(2)} ${(CIRC - filled).toFixed(2)}`;
    const rotate  = `rotate(${startAngle}, ${CX}, ${CY})`;
    const valStr  = formatHours(value);

    const cs       = getComputedStyle(document.body);
    const colText  = cs.getPropertyValue('--text').trim()      || '#FFFFFF';
    const colMuted = cs.getPropertyValue('--text-muted').trim()|| '#7A8FA6';
    const colBg    = cs.getPropertyValue('--border').trim()    || '#1C2D42';
    const colFg    = cs.getPropertyValue('--accent').trim()    || '#E8900A';

    return `
      <div class="sv-gauge-cell">
        <svg class="sv-gauge-svg" viewBox="0 0 100 100" width="100" height="100">
          <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${colBg}" stroke-width="7"
            stroke-dasharray="${bgDash}" stroke-dashoffset="0" transform="${rotate}" stroke-linecap="round"/>
          <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${colFg}" stroke-width="7"
            stroke-dasharray="${fgDash}" stroke-dashoffset="0" transform="${rotate}" stroke-linecap="round"/>
          <text x="${CX}" y="47" text-anchor="middle" font-family="Space Grotesk,sans-serif"
            font-size="13" font-weight="700" fill="${colText}">${valStr}</text>
          <text x="${CX}" y="60" text-anchor="middle" font-family="Space Grotesk,sans-serif"
            font-size="7" fill="${colMuted}">h</text>
        </svg>
        <div class="sv-gauge-val">${label}</div>
        <div class="sv-gauge-max">max ${maxLabel}</div>
      </div>`;
  }

  // ── Duration breakdown (all-time) ──
  const durBrackets = [
    {label:'12 h – 18 h', min:12, max:18},
    {label:'7 h – 12 h',  min:7,  max:12},
    {label:'4 h – 7 h',   min:4,  max:7},
    {label:'2 h – 4 h',   min:2,  max:4},
    {label:'0 h – 2 h',   min:0,  max:2},
  ];
  const durTotals = durBrackets.map(b => {
    const hrs = allFl.filter(e => {
      const h = parseHours(e.totalTime);
      return h >= b.min && h < b.max;
    }).reduce((s,e) => s + parseHours(e.totalTime), 0);
    return {...b, hrs};
  });
  const durGrandTotal = durTotals.reduce((s,b) => s + b.hrs, 0);
  const durRows = durTotals.map(b => {
    const pct = durGrandTotal > 0 ? Math.round(b.hrs / durGrandTotal * 100) : 0;
    return `<div class="dur-bk-row">
      <div class="dur-bk-left">
        <div class="dur-bk-range">${b.label}</div>
        <div class="dur-bk-hrs">${formatHours(b.hrs)}</div>
      </div>
      <div class="dur-bk-bar"><div class="dur-bk-fill" style="width:${pct}%"></div></div>
      <div class="dur-bk-pct">${pct} %</div>
    </div>`;
  }).join('');

  // ── Recency ──
  const ldgDayPct  = Math.min(ldgD90 / 3 * 100, 100);
  const ldgNightPct= Math.min(ldgN90 / 3 * 100, 100);
  const ldgDayCls  = ldgD90 >= 3 ? 'sv-recency-ok' : ldgD90 >= 1 ? 'sv-recency-warn' : 'sv-recency-exp';
  const ldgNightCls= ldgN90 >= 3 ? 'sv-recency-ok' : ldgN90 >= 1 ? 'sv-recency-warn' : 'sv-recency-exp';

  document.getElementById('sv-content').innerHTML = `
    <div class="sv-section-title">Flight time</div>
    <div class="sv-gauges">
      ${makeGauge(hrs28,  100,  'Last 28 days', '100 h')}
      ${makeGauge(hrs12m, 1000, 'Last 12 months', '1000 h')}
      ${makeGauge(hrsYr,  900,  `Year ${now2.getFullYear()}`, '900 h')}
    </div>

    <div class="sv-section-title">Recency</div>
    <div class="sv-recency">
      <div class="sv-recency-row ${ldgDayCls}">
        <div class="sv-recency-top">
          <span>LDG recency</span>
          <span class="sv-recency-sub">${ldgD90} landing${ldgD90!==1?'s':''} in 90 days</span>
        </div>
        <div class="sv-recency-track"><div class="sv-recency-fill" style="width:${ldgDayPct}%"></div></div>
      </div>
      <div class="sv-recency-row ${ldgNightCls}">
        <div class="sv-recency-top">
          <span>Night time</span>
          <span class="sv-recency-sub">${ldgN90} night landing${ldgN90!==1?'s':''} in 90 days</span>
        </div>
        <div class="sv-recency-track"><div class="sv-recency-fill" style="width:${ldgNightPct}%"></div></div>
      </div>
    </div>

    <div class="sv-card">
      <div class="sv-card-hdr">Hours per Month <span class="sv-card-sub">last 12 months</span></div>
      ${chartSvg}
    </div>

    <div class="sv-card">
      <div class="sv-card-hdr">Insights</div>
      <div class="sv-card-hdr sv-card-hdr--mt" style="margin-bottom:8px;font-size:12px;color:var(--text-muted);font-weight:500;">Average flight duration</div>
      ${durRows || noData}
      ${insList.length > 0 ? `<div class="sv-card-hdr sv-card-hdr--mt" style="font-size:12px;color:var(--text-muted);font-weight:500;margin-bottom:8px;">Top stats</div>` + insList.map(i =>
        `<div class="ins-row"><i class="ti ${i.ic} ins-ic"></i><div><div class="ins-lbl">${i.lbl}</div><div class="ins-val">${i.val}</div></div></div>`
      ).join('') : ''}
    </div>

    <div class="sv-card">
      <div class="sv-card-hdr">By Aircraft</div>
      ${mkBars(byType, total) || noData}
      <div class="sv-card-hdr sv-card-hdr--mt">By Role</div>
      ${Object.entries(byRole).sort((a,b)=>b[1]-a[1]).map(([r,h]) => {
        const pct = total>0 ? Math.round(h/total*100) : 0;
        return `<div class="bk-row"><span class="bk-name">${rLbl(r)}</span><div class="bk-track"><div class="bk-fill" style="width:${pct}%"></div></div><span class="bk-val">${formatHours(h)}</span></div>`;
      }).join('') || noData}
    </div>`;
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

  const auth    = getAuthority();
  const authKey = getAuthorityKey();

  // Build column definitions based on active authority
  const cols = [
    { header: 'Date',            get: e => e.date || '' },
    { header: 'Type',            get: e => e.isSim ? 'Simulator' : 'Flight' },
    { header: 'From (ICAO)',     get: e => e.origin || '' },
    { header: 'To (ICAO)',       get: e => e.destination || '' },
    { header: 'Off-Block (UTC)', get: e => e.offBlock || '' },
    { header: 'On-Block (UTC)', get: e => e.onBlock || '' },
    { header: 'Total HRS',       get: e => e.isSim ? '' : (e.totalTime || '') },
    { header: 'Day HRS',         get: e => e.dayHours || '' },
    { header: 'Night HRS',       get: e => e.nightHours || '' },
    { header: 'IFR HRS',         get: e => e.ifrTime || '' },
    { header: 'VFR HRS',         get: e => e.vfrTime || '' },
  ];

  if (auth.showCrossCountry) cols.push({ header: 'XC HRS',   get: e => e.xcHours   || '' });
  if (auth.showSolo)         cols.push({ header: 'Solo HRS', get: e => e.soloHours || '' });
  if (auth.showOperations)   cols.push({ header: 'Operations', get: e => e.operations || '' });

  cols.push(
    { header: 'Engine',           get: e => e.engine || '' },
    { header: 'Aircraft Type',    get: e => e.aircraftType || '' },
    { header: 'Registration',     get: e => e.registration || '' },
    {
      header: 'Role',
      get: e => {
        if (!e.role) return '';
        const eAuth  = AUTHORITIES[e.authority] || AUTHORITIES.EASA;
        const roleObj = eAuth.roles.find(r => r.value === e.role);
        return roleObj ? roleObj.label : e.role;
      },
    },
    { header: 'PIC Name',           get: e => e.picName || '' },
    { header: 'Student/Instructor', get: e => e.instructorName || '' },
    { header: 'T/O Day',   get: e => e.isSim ? '' : (e.toDay   ?? '') },
    { header: 'T/O Night', get: e => e.isSim ? '' : (e.toNight ?? '') },
    { header: 'LDG Day',   get: e => e.isSim ? '' : (e.ldgDay  ?? '') },
    { header: 'LDG Night', get: e => e.isSim ? '' : (e.ldgNight ?? '') },
  );

  if (auth.showApproaches) {
    cols.push(
      { header: 'Approaches #',  get: e => e.approachCount || '' },
      { header: 'Approach Type', get: e => e.approachType  || '' },
    );
  }

  cols.push(
    { header: 'FSTD Type', get: e => e.fstdType    || '' },
    { header: 'SIM HRS',   get: e => e.simDuration || '' },
    { header: 'Remarks',   get: e => e.remarks     || '' },
  );

  const sorted = [...toExport].sort((a, b) => a.date.localeCompare(b.date));

  const escapeCell = val => {
    const s = String(val);
    return (s.includes(',') || s.includes('"') || s.includes('\n'))
      ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const csv = [
    cols.map(c => c.header),
    ...sorted.map(e => cols.map(c => c.get(e))),
  ].map(row => row.map(escapeCell).join(',')).join('\r\n');

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `pilotassistante_logbook_${authKey}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── Import ─────────────────────────────────────────────────── */

const IMPORT_FIELDS = [
  { key: 'date',           label: 'Date *',             aliases: ['date', 'data', 'flight date', 'datum', 'day'] },
  { key: 'simDate',        label: 'SIM Date',           aliases: ['sim date', 'sim data', 'simulator date', 'fstd date', 'sim day'] },
  { key: 'entryType',      label: 'Type (flight/sim)',   aliases: ['type', 'entry type', 'flight type', 'category'] },
  { key: 'origin',         label: 'From (ICAO)',         aliases: ['from', 'origin', 'dep', 'departure', 'adep', 'origem', 'from (icao)'] },
  { key: 'destination',    label: 'To (ICAO)',           aliases: ['to', 'dest', 'destination', 'arr', 'arrival', 'ades', 'destino', 'to (icao)'] },
  { key: 'offBlock',       label: 'Off-Block UTC',       aliases: ['off block', 'off-block', 'dep time', 'block off', 'out', 'btd', 'off-block (utc)', 'off-block utc'] },
  { key: 'onBlock',        label: 'On-Block UTC',        aliases: ['on block', 'on-block', 'arr time', 'block on', 'in', 'bta', 'on-block (utc)', 'on-block utc'] },
  { key: 'totalTime',      label: 'Total HRS',           aliases: ['total', 'total hrs', 'total time', 'block time', 'duration', 'flight time', 'total flight time'] },
  { key: 'aircraftType',   label: 'Aircraft Type',       aliases: ['aircraft type', 'ac type', 'aircraft', 'actype', 'a/c type', 'type'] },
  { key: 'registration',   label: 'Registration',        aliases: ['registration', 'reg', 'tail', 'tail number', 'regn', 'a/c reg'] },
  { key: 'operations',     label: 'Operations (SP/MP text)', aliases: ['operations', 'ops', 'sp/mp', 'spmp'] },
  { key: 'engine',         label: 'Engine (SE/ME text)',     aliases: ['engine', 'se/me', 'seme', 'eng'] },
  { key: 'spseHours',      label: 'SP SE Hours',            aliases: ['sp se', 'sp se hrs', 'sp se time', 'single pilot se', 'single engine sp', 'se sp'] },
  { key: 'spmeHours',      label: 'SP ME Hours',            aliases: ['sp me', 'sp me hrs', 'sp me time', 'single pilot me', 'multi engine sp', 'me sp'] },
  { key: 'mpHours',        label: 'MP Hours',               aliases: ['mp', 'mp hrs', 'mp time', 'multi pilot', 'multi pilot hrs', 'multi pilot time', 'multi-pilot'] },
  { key: 'role',           label: 'Role (text)',          aliases: ['role', 'function', 'capacity', 'duty', 'crew function'] },
  { key: 'picHours',        label: 'PIC Hours',           aliases: ['pic time', 'pic hours', 'pic hrs', 'pilot in command time', 'pilot in command hours', 'pilot in command hrs'] },
  { key: 'picusHours',      label: 'PICUS Hours',         aliases: ['picus time', 'picus hours', 'picus hrs', 'pic under supervision', 'pic under supervision hrs'] },
  { key: 'copilotHours',    label: 'Co-Pilot / SIC Hours', aliases: ['co-pilot time', 'co-pilot hours', 'co-pilot hrs', 'copilot time', 'copilot hours', 'sic time', 'sic hours', 'sic hrs', 'f/o time', 'f/o hours', 'first officer time'] },
  { key: 'dualHours',       label: 'Dual Hours',          aliases: ['dual time', 'dual hours', 'dual hrs', 'dual received time', 'dual received', 'under instruction'] },
  { key: 'instructorHours', label: 'Instructor Hours',    aliases: ['dual given', 'dual given time', 'dual given hrs', 'instruction given', 'instructor time', 'cfi time', 'cfi hours', 'cfi hrs'] },
  { key: 'spicHours',       label: 'SPIC Hours',          aliases: ['spic time', 'spic hours', 'spic hrs', 'student pic time', 'student pic hrs'] },
  { key: 'feHours',         label: 'FE Hours',            aliases: ['fe time', 'fe hours', 'fe hrs', 'flight examiner time', 'examiner time', 'examiner hrs'] },
  { key: 'picName',        label: 'PIC Name',            aliases: ['pic name', 'captain', 'captain name', 'commander', 'pilot in command'] },
  { key: 'instructorName', label: 'Instructor / Student', aliases: ['instructor', 'instructor name', 'student', 'student name', 'student/instructor'] },
  { key: 'nightHours',     label: 'Night HRS',           aliases: ['night', 'night hrs', 'night time', 'night hours'] },
  { key: 'ifrTime',        label: 'IFR HRS',             aliases: ['ifr', 'instrument', 'inst hrs', 'instrument time', 'ifr hrs'] },
  { key: 'xcHours',        label: 'Cross-Country HRS',   aliases: ['xc', 'cross country', 'xc hrs', 'cross-country', 'cross-country hrs'] },
  { key: 'soloHours',      label: 'Solo HRS',            aliases: ['solo', 'solo hrs', 'solo time', 'solo hours'] },
  { key: 'toDay',          label: 'T/O Day',             aliases: ['to day', 't/o day', 'takeoff day', 'take-off day', 'day t/o', 'day to'] },
  { key: 'toNight',        label: 'T/O Night',           aliases: ['to night', 't/o night', 'takeoff night', 'night to', 'night t/o'] },
  { key: 'ldgDay',         label: 'LDG Day',             aliases: ['ldg day', 'landing day', 'landings day', 'day ldg'] },
  { key: 'ldgNight',       label: 'LDG Night',           aliases: ['ldg night', 'landing night', 'landings night', 'night ldg'] },
  { key: 'fstdType',       label: 'FSTD Type',           aliases: ['fstd', 'fstd type', 'sim type', 'simulator type', 'ffs', 'ftd'] },
  { key: 'simDuration',    label: 'Sim Duration',        aliases: ['sim duration', 'sim hrs', 'sim time', 'fstd hrs', 'sim hours'] },
  { key: 'remarks',        label: 'Remarks',             aliases: ['remarks', 'notes', 'comments', 'remark', 'note'] },
];

let importState = { headers: [], rows: [], mapping: {}, parsedEntries: [] };

function openImport() {
  importState = { headers: [], rows: [], mapping: {}, parsedEntries: [] };
  document.getElementById('import-file-input').value = '';
  showImportStep(1);
  document.getElementById('import-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeImport() {
  document.getElementById('import-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

function handleImportOverlayClick(e) {
  if (e.target === document.getElementById('import-overlay')) closeImport();
}

function showImportStep(n) {
  [1, 2, 3].forEach(i => {
    const el = document.getElementById('import-step-' + i);
    if (i === n) {
      el.style.display = n === 1 ? 'block' : 'flex';
      if (n !== 1) { el.style.flexDirection = 'column'; el.style.flex = '1'; el.style.overflow = 'hidden'; el.style.minHeight = '0'; }
    } else {
      el.style.display = 'none';
    }
  });
  const titles = { 1: 'Import Flights', 2: 'Map Columns', 3: 'Preview' };
  document.getElementById('import-title').textContent = titles[n];
}

function resetImportFile() {
  importState.headers = []; importState.rows = []; importState.mapping = {};
  document.getElementById('import-file-input').value = '';
  showImportStep(1);
}

function handleImportDrop(e) {
  e.preventDefault();
  document.getElementById('import-drop-zone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (!file) return;
  processImportFile(file);
}

function handleImportFile(input) {
  const file = input.files[0];
  if (!file) return;
  processImportFile(file);
}

function processImportFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const reader = new FileReader();
  if (ext === 'csv') {
    reader.onload = e => parseCSVImport(e.target.result, file.name);
    reader.readAsText(file, 'UTF-8');
  } else if (ext === 'xlsx' || ext === 'xls') {
    reader.onload = e => parseExcelImport(e.target.result, file.name);
    reader.readAsArrayBuffer(file);
  } else {
    alert('Please upload a .csv, .xlsx, or .xls file.');
  }
}

function parseCSVImport(text, filename) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) { alert('The file appears to be empty.'); return; }
  const delim = detectCSVDelimiter(lines[0]);
  const headers = parseCSVRow(lines[0], delim);
  const rows = lines.slice(1).map(l => {
    const cells = parseCSVRow(l, delim);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (cells[i] || '').trim(); });
    return obj;
  }).filter(r => Object.values(r).some(v => v !== ''));
  importState.headers = headers;
  importState.rows = rows;
  showMappingUI(filename, rows.length);
}

function parseExcelImport(buffer, filename) {
  try {
    const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    if (data.length < 2) { alert('The sheet appears to be empty.'); return; }
    const headers = data[0].map(String);
    const rows = data.slice(1)
      .filter(r => r.some(c => c !== ''))
      .map(r => {
        const obj = {};
        headers.forEach((h, i) => {
          let v = r[i];
          if (v instanceof Date) v = v.toISOString().slice(0, 10);
          else v = String(v == null ? '' : v).trim();
          obj[h] = v;
        });
        return obj;
      });
    importState.headers = headers;
    importState.rows = rows;
    showMappingUI(filename, rows.length);
  } catch (err) {
    alert('Could not read the file: ' + err.message);
  }
}

function detectCSVDelimiter(line) {
  const counts = { ',': 0, ';': 0, '\t': 0 };
  for (const d of Object.keys(counts)) counts[d] = line.split(d).length - 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function parseCSVRow(line, delim) {
  const result = []; let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === delim && !inQ) {
      result.push(cur.trim()); cur = '';
    } else cur += ch;
  }
  result.push(cur.trim());
  return result;
}

function autoDetectMapping(headers) {
  const lc = headers.map(h => h.toLowerCase().trim());
  const mapping = {};
  for (const field of IMPORT_FIELDS) {
    for (const alias of field.aliases) {
      const idx = lc.findIndex(h => h === alias || h.includes(alias));
      if (idx !== -1 && !Object.values(mapping).includes(headers[idx])) {
        mapping[field.key] = headers[idx]; break;
      }
    }
  }
  return mapping;
}

function showMappingUI(filename, rowCount) {
  importState.mapping = autoDetectMapping(importState.headers);
  document.getElementById('import-file-info').textContent = `${filename} · ${rowCount} rows`;
  const body = document.getElementById('import-map-body');
  body.innerHTML = '';
  for (const field of IMPORT_FIELDS) {
    const row = document.createElement('div');
    row.className = 'import-map-row';
    const lbl = document.createElement('span');
    lbl.className = 'import-map-label';
    lbl.textContent = field.label;
    const sel = document.createElement('select');
    sel.className = 'import-map-select';
    sel.innerHTML = '<option value="">(skip)</option>' +
      importState.headers.map(h =>
        `<option value="${h}"${importState.mapping[field.key] === h ? ' selected' : ''}>${h}</option>`
      ).join('');
    sel.addEventListener('change', () => { importState.mapping[field.key] = sel.value || null; });
    row.appendChild(lbl);
    row.appendChild(sel);
    body.appendChild(row);
  }
  showImportStep(2);
}

function showImportPreview() {
  if (!importState.mapping.date) {
    alert('Please map the Date column — it is required.');
    return;
  }
  const built = buildImportEntries();
  if (!built.length) {
    alert('No valid rows found. Make sure the Date column is mapped correctly.');
    return;
  }
  importState.parsedEntries = built;
  const n = built.length;
  document.getElementById('import-preview-info').textContent =
    `${n} entr${n === 1 ? 'y' : 'ies'} ready to import (showing first ${Math.min(n, 5)})`;
  document.getElementById('import-confirm-btn').textContent =
    `Import ${n} entr${n === 1 ? 'y' : 'ies'}`;
  const cols  = ['date','origin','destination','offBlock','onBlock','totalTime','aircraftType','registration','role'];
  const heads = ['Date','From','To','Off','On','Total','A/C','Reg','Role'];
  const preview = built.slice(0, 5);
  document.getElementById('import-preview-table').innerHTML =
    `<thead><tr>${heads.map(h => `<th>${h}</th>`).join('')}</tr></thead>` +
    `<tbody>${preview.map(e =>
      `<tr>${cols.map(c => `<td>${e[c] || ''}</td>`).join('')}</tr>`
    ).join('')}</tbody>`;
  showImportStep(3);
}

function normalizeImportRole(raw, authKey) {
  if (!raw) return '';
  const vUp = raw.trim().toUpperCase().replace(/[\s\-\.\/\(\)_]+/g, '');
  const auth = getAuthority();
  for (const r of auth.roles) {
    if (vUp === r.value.replace(/_/g, '')) return r.value;
    if (vUp === r.label.toUpperCase().replace(/[\s\-\.\/\(\)]+/g, '')) return r.value;
  }
  const common = {
    'COPILOT': 'CO_PILOT', 'FO': 'CO_PILOT', 'FIRSTOFFICER': 'CO_PILOT',
    'SIC': authKey === 'FAA' ? 'SIC' : 'CO_PILOT',
    'CFI': 'INSTRUCTOR', 'DUALGIVEN': 'INSTRUCTOR', 'INSTRUCTIONSGIVEN': 'INSTRUCTOR',
    'DUALRECEIVED': 'DUAL', 'UNDERINSTRUCTION': 'DUAL',
    'PICUNDERSUPERVISION': 'PICUS', 'PICUS': 'PICUS',
    'STUDENTPILOTINCOMMAND': 'SPIC',
    'FLIGHTEXAMINER': 'FE', 'EXAMINER': 'FE',
  };
  return common[vUp] || raw.trim();
}

function buildImportEntries() {
  const m = importState.mapping;
  const authKey = getAuthorityKey();
  const get = (row, key) => (m[key] ? (row[m[key]] || '') : '').toString().trim();
  return importState.rows.map(row => {
    const date = normalizeImportDate(get(row, 'date') || get(row, 'simDate'));
    if (!date) return null;
    const entryTypeRaw = get(row, 'entryType').toLowerCase();
    const fstdTypeVal  = get(row, 'fstdType');
    const simDurVal    = get(row, 'simDuration');
    const isSim = entryTypeRaw.includes('sim') ||
                  (fstdTypeVal !== '' && !entryTypeRaw.includes('flight'));

    // Determine role: text column first, then infer from role-time columns
    let role = normalizeImportRole(get(row, 'role'), authKey);
    let roleInferredTime = '';
    if (!role) {
      const roleTimeCols = [
        { key: 'picHours',        value: 'PIC' },
        { key: 'picusHours',      value: 'PICUS' },
        { key: 'copilotHours',    value: authKey === 'FAA' ? 'SIC' : 'CO_PILOT' },
        { key: 'dualHours',       value: 'DUAL' },
        { key: 'instructorHours', value: 'INSTRUCTOR' },
        { key: 'spicHours',       value: 'SPIC' },
        { key: 'feHours',         value: 'FE' },
      ];
      for (const rc of roleTimeCols) {
        const t = get(row, rc.key);
        if (t && parseHours(normalizeImportHours(t)) > 0) {
          role = rc.value;
          roleInferredTime = normalizeImportHours(t);
          break;
        }
      }
    }

    const nightHours = normalizeImportHours(get(row, 'nightHours'));
    const ifrTime    = normalizeImportHours(get(row, 'ifrTime'));
    const nightDec = parseHours(nightHours);
    const ifrDec   = parseHours(ifrTime);
    // Determine operations + engine from text fields or dedicated hour columns (SP SE / SP ME / MP)
    const opsRaw  = get(row, 'operations').toUpperCase();
    const engRaw  = get(row, 'engine').toUpperCase();
    const spseVal = get(row, 'spseHours');
    const spmeVal = get(row, 'spmeHours');
    const mpVal   = get(row, 'mpHours');
    let operations, engine, opsInferredTime = '';
    if (['SP','MP'].includes(opsRaw)) {
      operations = opsRaw;
      engine     = ['SE','ME'].includes(engRaw) ? engRaw : 'ME';
    } else if (spseVal && parseHours(normalizeImportHours(spseVal)) > 0) {
      operations = 'SP'; engine = 'SE'; opsInferredTime = normalizeImportHours(spseVal);
    } else if (spmeVal && parseHours(normalizeImportHours(spmeVal)) > 0) {
      operations = 'SP'; engine = 'ME'; opsInferredTime = normalizeImportHours(spmeVal);
    } else if (mpVal && parseHours(normalizeImportHours(mpVal)) > 0) {
      operations = 'MP'; engine = 'ME'; opsInferredTime = normalizeImportHours(mpVal);
    } else {
      operations = 'MP'; engine = 'ME';
    }
    const totalTime = normalizeImportHours(get(row, 'totalTime') || (isSim ? simDurVal : '') || roleInferredTime || opsInferredTime);
    const totalDec = parseHours(totalTime);
    return {
      id:             Date.now() + Math.random(),
      date,
      isSim,
      authority:      authKey,
      origin:         get(row, 'origin').toUpperCase(),
      destination:    get(row, 'destination').toUpperCase(),
      offBlock:       normalizeImportTime(get(row, 'offBlock')),
      onBlock:        normalizeImportTime(get(row, 'onBlock')),
      totalTime,
      aircraftType:   get(row, 'aircraftType'),
      registration:   get(row, 'registration').toUpperCase(),
      operations,
      engine,
      role,
      picName:        get(row, 'picName'),
      instructorName: get(row, 'instructorName'),
      nightHours,
      ifrTime,
      xcHours:        normalizeImportHours(get(row, 'xcHours')),
      soloHours:      normalizeImportHours(get(row, 'soloHours')),
      dayHours:       formatHours(Math.max(0, totalDec - nightDec)),
      vfrTime:        formatHours(Math.max(0, totalDec - ifrDec)),
      toDay:          parseInt(get(row, 'toDay'))    || (isSim ? 0 : 1),
      toNight:        parseInt(get(row, 'toNight'))  || 0,
      ldgDay:         parseInt(get(row, 'ldgDay'))   || (isSim ? 0 : 1),
      ldgNight:       parseInt(get(row, 'ldgNight')) || 0,
      fstdType:       fstdTypeVal,
      simDuration:    normalizeImportHours(simDurVal),
      remarks:        get(row, 'remarks'),
    };
  }).filter(Boolean);
}

function normalizeImportDate(v) {
  if (!v) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const m1 = v.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (m1) return `${m1[3]}-${m1[2].padStart(2,'0')}-${m1[1].padStart(2,'0')}`;
  const d = new Date(v);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return '';
}

function normalizeImportTime(v) {
  if (!v) return '';
  if (/^\d{1,2}:\d{2}$/.test(v)) return v.padStart(5, '0');
  if (/^\d{4}$/.test(v)) return v.slice(0, 2) + ':' + v.slice(2);
  return '';
}

function normalizeImportHours(v) {
  if (!v) return '';
  return formatHours(parseHours(v));
}

function backToMapping() { showImportStep(2); }

function confirmImport() {
  const imported = importState.parsedEntries;
  entries.push(...imported);
  entries.sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem('pa_entries', JSON.stringify(entries));
  closeImport();
  renderEntries();
  renderStats();
  alert(`✓ ${imported.length} entr${imported.length === 1 ? 'y' : 'ies'} imported.`);
}
