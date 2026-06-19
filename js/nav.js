(function(){
  const page = location.pathname.split('/').pop() || 'index.html';
  const isHome    = page === '' || page === 'index.html';
  const isLogbook = page === 'logbook.html';

  /* ── Icons (inline SVG, Tabler style) ── */
  const IC = {
    logbook: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    home:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
    settings:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  };

  /* ── Inject nav bar ── */
  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.innerHTML = `
    <a class="nav-item${isLogbook?' active':''}" href="logbook.html">
      ${IC.logbook}<span>Logbook</span>
    </a>
    <a class="nav-item${isHome?' active':''}" href="index.html">
      ${IC.home}<span>Home</span>
    </a>
    <button class="nav-item" id="nav-settings-btn" onclick="openNavSettings()">
      ${IC.settings}<span>Settings</span>
    </button>`;
  document.body.appendChild(nav);

  /* ── Add bottom padding so content isn't hidden behind nav ── */
  const container = document.getElementById('app') || document.querySelector('.shell');
  if (container) container.style.paddingBottom = '56px';

  /* ── Inject settings modal ── */
  const modal = document.createElement('div');
  modal.className = 'nav-settings-overlay hidden';
  modal.id = 'nav-settings-overlay';
  modal.innerHTML = `
    <div class="nav-settings-sheet" onclick="event.stopPropagation()">
      <div class="nav-settings-handle"></div>
      <div class="nav-settings-title">Settings</div>
      <div class="nav-settings-sub">Aviation authority · Personalises your logbook fields</div>
      <div class="nav-auth-cards">
        <button class="nav-auth-card" id="nav-auth-easa" onclick="setNavAuthority('EASA')">
          <span class="nav-auth-flag">🇪🇺</span>
          <span class="nav-auth-name">EASA</span>
          <span class="nav-auth-desc">European Union Aviation Safety Agency</span>
        </button>
        <button class="nav-auth-card" id="nav-auth-faa" onclick="setNavAuthority('FAA')">
          <span class="nav-auth-flag">🇺🇸</span>
          <span class="nav-auth-name">FAA</span>
          <span class="nav-auth-desc">Federal Aviation Administration</span>
        </button>
      </div>
      <button class="nav-settings-close" onclick="closeNavSettings()">Close</button>
    </div>`;
  modal.addEventListener('click', closeNavSettings);
  document.body.appendChild(modal);

  /* ── Settings open/close ── */
  window.openNavSettings = function(){
    const current = localStorage.getItem('pa_authority') || 'EASA';
    document.getElementById('nav-auth-easa').classList.toggle('selected', current === 'EASA');
    document.getElementById('nav-auth-faa').classList.toggle('selected',  current === 'FAA');
    document.getElementById('nav-settings-overlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeNavSettings = function(){
    document.getElementById('nav-settings-overlay').classList.add('hidden');
    document.body.style.overflow = '';
  };

  window.setNavAuthority = function(key){
    localStorage.setItem('pa_authority', key);
    /* If logbook's selectAuthority is available, use it (updates UI live) */
    if (typeof selectAuthority === 'function') {
      selectAuthority(key);
      closeNavSettings();
    } else {
      closeNavSettings();
      /* Small delay so the user sees the selection before reload */
      setTimeout(() => location.reload(), 150);
    }
  };
})();
