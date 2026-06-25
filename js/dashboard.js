const M=[
  {name:'FTL Schedule',  code:'FTL', st:'soon'},
  {name:'Logbook',       code:'LOG', st:'active'},
  {name:'Documents',     code:'DOC', st:'soon'},
  {name:'Training',      code:'TRN', st:'soon'},
  {name:'Memories',      code:'MEM', st:'soon'},
  {name:'Jobs',          code:'JOB', st:'soon'},
  {name:'Aviation News', code:'AVN', st:'soon'},
  {name:'Briefing',      code:'BRF', st:'soon'},
  {name:'Salary Calc',   code:'SAL', st:'soon'},
  {name:'Interview Prep',code:'INT', st:'soon'},
  {name:'Fatigue Log',   code:'FAT', st:'critical'},
  {name:'Home Widget',   code:'WGT', st:'soon'},
  {name:'Annual Report', code:'ANN', st:'soon'},
  {name:'Voice AI',      code:'VOC', st:'critical'},
  {name:'Wellbeing',     code:'WEL', st:'critical'},
];

const MODULE_LINKS={
  LOG:'logbook.html',
  FTL:'#',DOC:'#',TRN:'#',MEM:'#',JOB:'#',AVN:'#',BRF:'#',
  SAL:'#',INT:'#',FAT:'#',WGT:'#',ANN:'#',VOC:'#',WEL:'#',
};

const ICONS={
  FTL:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 14.5 14.5"/></svg>`,
  LOG:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`,
  DOC:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="13" y2="13"/></svg>`,
  TRN:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  MEM:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  JOB:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
  AVN:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
  BRF:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>`,
  SAL:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  INT:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
  FAT:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
  WGT:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  ANN:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  VOC:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>`,
  WEL:`<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
};

function parseH(val){
  if(!val||val==='')return 0;
  val=String(val).trim();
  if(val.includes(':')){const[h,m]=val.split(':').map(Number);return(h||0)+(m||0)/60;}
  return parseFloat(val)||0;
}

function fmtDate(str){
  if(!str)return '';
  const d=new Date(str+'T00:00:00');
  const mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return d.getDate()+' '+mo[d.getMonth()];
}

function daysSince(str){
  if(!str)return null;
  const diff=Date.now()-new Date(str+'T00:00:00').getTime();
  return Math.floor(diff/86400000);
}

function getEntries(){
  try{return JSON.parse(localStorage.getItem('pa_entries')||'[]');}catch{return[];}
}

/* ── HERO ── */
function renderHero(flights){
  const total=flights.reduce((s,e)=>s+parseH(e.totalTime),0);
  const ym=new Date().toISOString().slice(0,7);
  const monthH=flights.filter(e=>e.date&&e.date.startsWith(ym)).reduce((s,e)=>s+parseH(e.totalTime),0);
  const sorted=[...flights].sort((a,b)=>((b.date||'')>(a.date||'')?1:-1));
  const last=sorted[0];
  const days=last?daysSince(last.date):null;
  const daysStr=days===null?'–':days===0?'Today':days===1?'1d ago':days+'d ago';
  const totalRound=Math.round(total);
  const totalStr=totalRound>=1000
    ?Math.floor(totalRound/1000)+' '+String(totalRound%1000).padStart(3,'0')
    :String(totalRound);

  document.getElementById('hero').innerHTML=`
    <div class="hero">
      <div class="hero-wm">
        <svg width="160" height="160" viewBox="0 0 24 24" fill="white"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
      </div>
      <div class="hero-greeting">Total flight hours</div>
      <div class="hero-main">
        <div class="hero-hours">${totalStr||'0'}</div>
        <div class="hero-unit">h</div>
      </div>
      ${last?`<div class="hero-badge"><div class="hero-badge-dot"></div><span class="hero-badge-txt">Last flight · ${fmtDate(last.date)}</span></div>`
            :`<div class="hero-badge"><span class="hero-badge-txt">No flights logged yet</span></div>`}
      <div class="hero-stats">
        <div class="hs"><div class="hs-val">${Math.round(monthH)}h</div><div class="hs-lbl">This month</div></div>
        <div class="hs"><div class="hs-val">${flights.length}</div><div class="hs-lbl">Total flights</div></div>
        <div class="hs"><div class="hs-val">${daysStr}</div><div class="hs-lbl">Last flight</div></div>
      </div>
    </div>`;
}

/* ── EASA CURRENCY ── */
function renderCurrency(flights){
  const now=new Date();
  const cutoff=new Date(now-90*86400000).toISOString().slice(0,10);
  const recent=flights.filter(e=>e.date>=cutoff);
  const ldgD=recent.reduce((s,e)=>s+(e.ldgDay||0),0);
  const ldgN=recent.reduce((s,e)=>s+(e.ldgNight||0),0);

  const nightFl=[...flights].filter(e=>(e.ldgNight||0)>0).sort((a,b)=>((b.date||'')>(a.date||'')?1:-1));
  let expStr='–', expClass='crit', expSub='No data';
  if(nightFl.length>=3){
    const exp=new Date(new Date(nightFl[2].date+'T00:00:00').getTime()+90*86400000);
    const diff=Math.ceil((exp-now)/86400000);
    expStr=diff<=0?'Expired':diff+'d';
    expClass=diff<=0?'crit':diff<=14?'warn':'ok';
    expSub=diff<=0?'Expired':`Exp ${exp.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][exp.getMonth()]}`;
  } else if(nightFl.length>0){
    expStr='<3';expClass='warn';expSub=`${nightFl.length}/3 flights`;
  }

  const dayClass=ldgD>=3?'ok':ldgD>=2?'warn':'crit';
  const nClass=ldgN>=3?'ok':ldgN>=2?'warn':'crit';

  document.getElementById('currency-section').innerHTML=`
    <div class="home-section">
      <div class="sh"><span class="sh-title">EASA Currency</span><span class="sh-tag">90 DAYS</span></div>
      <div class="curr-grid">
        <div class="cc ${dayClass}">
          <div class="cc-dot"></div><div class="cc-val">${ldgD}</div>
          <div class="cc-lbl">Day ldgs</div>
          <div class="cc-sub">${ldgD>=3?'OK · min 3':'Need '+(3-ldgD)+' more'}</div>
        </div>
        <div class="cc ${nClass}">
          <div class="cc-dot"></div><div class="cc-val">${ldgN}</div>
          <div class="cc-lbl">Night ldgs</div>
          <div class="cc-sub">${ldgN>=3?'OK · min 3':'Need '+(3-ldgN)+' more'}</div>
        </div>
        <div class="cc ${expClass}">
          <div class="cc-dot"></div><div class="cc-val">${expStr}</div>
          <div class="cc-lbl">Night exp</div>
          <div class="cc-sub">${expSub}</div>
        </div>
      </div>
    </div>`;
}

/* ── RECENT FLIGHTS ── */
function renderRecent(flights){
  const recent=[...flights].sort((a,b)=>((b.date||'')>(a.date||'')?1:-1)).slice(0,3);
  const arrowSvg=`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  const rows=recent.length
    ?recent.map(e=>`
      <a class="fl" href="logbook.html">
        <div class="fl-route">
          <span class="fl-apt">${e.origin||'?'}</span>${arrowSvg}<span class="fl-apt">${e.destination||'?'}</span>
        </div>
        ${e.aircraftType?`<span class="fl-type">${e.aircraftType}</span>`:''}
        <div class="fl-meta">
          <span class="fl-dur">${e.totalTime||'–'}</span>
          <span class="fl-date">${fmtDate(e.date)}</span>
        </div>
      </a>`).join('')
    :`<div class="recent-empty">No flights in your logbook yet.<br>Tap <strong>Log flight</strong> below to add your first.</div>`;

  document.getElementById('recent-section').innerHTML=`
    <div class="home-section">
      <div class="sh">
        <span class="sh-title">Recent flights</span>
        <a class="sh-tag sh-link" href="logbook.html">See all →</a>
      </div>
      <div class="flights-list">${rows}</div>
    </div>`;
}

/* ── QUICK ACTION ── */
function renderQA(){
  const plusSvg=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`;
  document.getElementById('qa-section').innerHTML=`
    <div class="qa-wrap">
      <a class="qa-btn" href="logbook.html">${plusSvg}Log flight</a>
    </div>`;
}

/* ── MODULE GRID ── */
function buildGrid(){
  const grid=document.getElementById('grid');
  M.forEach(m=>{
    const c=document.createElement('div');
    c.className='card'+(m.code==='LOG'?' active':'')+(m.st==='critical'?' critical':'');
    c.innerHTML=`${ICONS[m.code]||''}<span class="card-code">${m.code}</span>`;
    c.addEventListener('click',()=>{
      const link=MODULE_LINKS[m.code];
      if(link&&link!=='#')window.location.href=link;
    });
    grid.appendChild(c);
  });
}

/* ── INIT ── */
(function(){
  const entries=getEntries();
  const flights=entries.filter(e=>!e.isSim);
  renderHero(flights);
  renderCurrency(flights);
  renderRecent(flights);
  renderQA();
  buildGrid();
})();
