(function(){
  // Apply saved theme immediately to avoid flash
  const savedTheme = localStorage.getItem('pa_theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);

  const page = location.pathname.split('/').pop() || 'index.html';
  const isHome     = page === '' || page === 'index.html';
  const isLogbook  = page === 'logbook.html';
  const isSettings = page === 'settings.html';

  /* ── Icons (inline SVG, Tabler style) ── */
  const IC = {
    logbook: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    home:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
    settings:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  };

  /* ── Inject nav bar ── */
  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';

  if (isLogbook) {
    nav.classList.add('bottom-nav--logbook');
    nav.innerHTML = `
      <button class="nav-item active" id="nav-flights" onclick="showTab('log')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
        <span>Flights</span>
      </button>
      <a class="nav-item" href="index.html">
        ${IC.home}<span>Home</span>
      </a>
      <button class="nav-item" id="nav-stats" onclick="showTab('stats')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
        <span>Stats</span>
      </button>`;

    const fabBtn = document.createElement('button');
    fabBtn.className = 'nav-fab';
    fabBtn.setAttribute('aria-label', 'Add flight');
    fabBtn.setAttribute('onclick', 'openDrawer()');
    fabBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;

    const wrapper = document.createElement('div');
    wrapper.className = 'bottom-nav-logbook-wrapper';
    wrapper.appendChild(nav);
    wrapper.appendChild(fabBtn);
    document.body.appendChild(wrapper);

    // Hide the standalone FAB — replaced by nav-fab
    const hideFab = () => { const f = document.getElementById('fab-add'); if (f) f.style.display = 'none'; };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hideFab);
    else hideFab();
  } else {
    nav.innerHTML = `
      <a class="nav-item" href="logbook.html">
        ${IC.logbook}<span>Logbook</span>
      </a>
      <a class="nav-item${isHome?' active':''}" href="index.html">
        ${IC.home}<span>Home</span>
      </a>
      <a class="nav-item${isSettings?' active':''}" href="settings.html">
        ${IC.settings}<span>Settings</span>
      </a>`;
  } else {
    document.body.appendChild(nav);
  }

  /* ── Add bottom padding so content isn't hidden behind nav ── */
  const container = document.getElementById('app') || document.querySelector('.shell');
  if (container) container.style.paddingBottom = '96px';

  /* ── Settings shortcut (fallback for any remaining references) ── */
  window.openNavSettings = function(){ location.href = 'settings.html'; };
})();
