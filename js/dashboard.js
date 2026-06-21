const M=[
  {name:'FTL Schedule',  code:'FTL', sub:'Flight time limitations · EASA Part-FCL',          st:'soon'},
  {name:'Logbook',       code:'LOG', sub:'Smart logbook · EASA & FAA',                        st:'active'},
  {name:'Documents',     code:'DOC', sub:'Licenças · Certificados · Validades',               st:'soon'},
  {name:'Training',      code:'TRN', sub:'Simuladores · Type ratings · Formação',             st:'soon'},
  {name:'Memories',      code:'MEM', sub:'Diário de voo pessoal',                             st:'soon'},
  {name:'Jobs',          code:'JOB', sub:'Mercado de emprego · Airlines',                     st:'soon'},
  {name:'Aviation News', code:'AVN', sub:'Notícias da aviação',                               st:'soon'},
  {name:'Briefing',      code:'BRF', sub:'Pré-voo · Meteorologia · NOTAMs',                  st:'soon'},
  {name:'Salary Calc',   code:'SAL', sub:'Calculadora salarial · Per diem',                  st:'soon'},
  {name:'Interview Prep',code:'INT', sub:'Preparação de entrevistas',                         st:'soon'},
  {name:'Fatigue Log',   code:'FAT', sub:'Registo de fadiga · FRMS',                         st:'critical'},
  {name:'Home Widget',   code:'WGT', sub:'Widget de ecrã principal',                          st:'soon'},
  {name:'Annual Report', code:'ANN', sub:'Relatório anual automático',                        st:'soon'},
  {name:'Voice AI',      code:'VOC', sub:'Assistente de voz IA',                              st:'critical'},
  {name:'Wellbeing',     code:'WEL', sub:'Bem-estar · Sono · Jet lag',                       st:'critical'},
];
const N=15;
let sel=1;

const MODULE_LINKS={
  LOG:'logbook.html',
  FTL:'#',
  DOC:'#', TRN:'#', MEM:'#', JOB:'#', AVN:'#', BRF:'#',
  SAL:'#', INT:'#', FAT:'#', WGT:'#', ANN:'#', VOC:'#', WEL:'#',
};

function parseH(val){
  if(!val||val==='')return 0;
  val=String(val).trim();
  if(val.includes(':')){const[h,m]=val.split(':').map(Number);return(h||0)+(m||0)/60;}
  return parseFloat(val)||0;
}

function logbookGaugeItems(){
  const raw=localStorage.getItem('pa_entries');
  if(!raw)return null;
  const entries=JSON.parse(raw).filter(e=>!e.isSim);
  if(!entries.length)return null;
  const total=entries.reduce((s,e)=>s+parseH(e.totalTime),0);
  const pic  =entries.filter(e=>e.role==='PIC').reduce((s,e)=>s+parseH(e.totalTime),0);
  const night=entries.reduce((s,e)=>s+parseH(e.nightHours),0);
  const ifr  =entries.reduce((s,e)=>s+parseH(e.ifrTime),0);
  const maxV =Math.max(total,1);
  return[
    {label:'Total Hours', value:total, max:Math.max(total*1.5,100), unit:'h'},
    {label:'PIC Hours',   value:pic,   max:maxV,                    unit:'h'},
    {label:'Night Hours', value:night, max:maxV,                    unit:'h'},
    {label:'IFR Hours',   value:ifr,   max:maxV,                    unit:'h'},
  ];
}

const GAUGE_DATA={
  LOG:{
    label:'Estatísticas', live:true,
    items:logbookGaugeItems(),
  },
  FTL:{
    label:'Limites Part-FCL', live:false,
    items:[
      {label:'7 Dias',    value:38.3, max:60,   unit:'h', dec:1},
      {label:'28 Dias',   value:89.8, max:110,  unit:'h', dec:1},
      {label:'12 Meses',  value:612.5,max:1000, unit:'h', dec:1},
      {label:'FDP Hoje',  value:7.25, max:13,   unit:'h', dec:2},
    ]
  },
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

/* ── Build module grid ── */
const grid=document.getElementById('grid');
M.forEach((m,i)=>{
  const c=document.createElement('div');
  c.className='card'+(i===sel?' active':'')+(m.st==='critical'?' critical':'');
  c.id='c'+i;
  c.innerHTML=`${ICONS[m.code]||''}<span class="card-code">${m.code}</span>`;
  c.addEventListener('click',()=>select(i));
  grid.appendChild(c);
});

/* ── Refs ── */
const dBg=document.getElementById('d-bg');
const dPill=document.getElementById('d-pill');
const dDot=document.getElementById('d-dot');
const dPillTxt=document.getElementById('d-pill-txt');
const dName=document.getElementById('d-name');
const dSub=document.getElementById('d-sub');
const dPos=document.getElementById('d-pos');
const prog=document.getElementById('prog');
const gZone=document.getElementById('gauge-zone');
const openBtn=document.getElementById('open-btn');

const ST={active:'Module Activo',soon:'Em Breve',critical:'Crítico'};

/* ── Gauge SVG builder (semicircle meter) ── */
function polar(cx,cy,r,deg){
  const a=(deg-90)*Math.PI/180;
  return {x:cx+r*Math.cos(a), y:cy+r*Math.sin(a)};
}
function arcPath(cx,cy,r,startDeg,endDeg){
  const s=polar(cx,cy,r,endDeg), e=polar(cx,cy,r,startDeg);
  const large=(endDeg-startDeg)<=180?'0':'1';
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}
function fmtHM(v){
  const h=Math.floor(v), m=Math.round((v-h)*60);
  return h+':'+String(m).padStart(2,'0');
}

function buildGauge(g){
  const pct=Math.max(0,Math.min(1,g.value/g.max));
  const endDeg=-90+pct*180;
  const cx=42,cy=46,r=34;
  let color='var(--acc)', pctColor='var(--acc-m)';
  if(pct>=0.92){color='var(--crit)';pctColor='var(--crit)';}
  else if(pct>=0.75){color='var(--amb)';pctColor='var(--amb)';}

  const track=arcPath(cx,cy,r,-90,90);
  const fill=arcPath(cx,cy,r,-90,endDeg);

  return `
    <div class="gauge-box">
      <svg class="gauge-svg" viewBox="0 0 84 50">
        <path d="${track}" fill="none" stroke="var(--bdr)" stroke-width="6" stroke-linecap="round"/>
        <path d="${fill}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/>
      </svg>
      <div class="gauge-val">${fmtHM(g.value)}<span class="unit">${g.unit}</span></div>
      <div class="gauge-lbl">${g.label}</div>
      <div class="gauge-pct" style="color:${pctColor}">${Math.round(pct*100)}% of ${fmtHM(g.max)}${g.unit}</div>
    </div>`;
}

function buildGaugeZone(code){
  const data=GAUGE_DATA[code];
  if(!data){
    gZone.innerHTML=`
      <div class="gauge-empty">
        <div class="gauge-empty-ic">◌</div>
        <div class="gauge-empty-txt">Métricas deste módulo aparecerão aqui<br>quando estiver implementado</div>
        <div class="gauge-empty-sub">Módulo ainda não desenvolvido</div>
      </div>`;
    return;
  }
  if(!data.items){
    gZone.innerHTML=`
      <div class="gauge-empty">
        <div class="gauge-empty-ic">✈</div>
        <div class="gauge-empty-txt">Ainda não tens voos registados no Logbook</div>
        <div class="gauge-empty-sub">As métricas aparecerão aqui após o primeiro voo</div>
      </div>`;
    return;
  }
  const tag=data.live?'dados reais':'dados de exemplo';
  gZone.innerHTML=`
    <div class="gauge-zone-label">
      <span>${data.label}</span>
      <span class="gauge-zone-tag">${tag}</span>
    </div>
    <div class="gauge-grid">${data.items.map(buildGauge).join('')}</div>`;
}

function updateDetail(i,instant){
  const m=M[i];
  dBg.textContent=String(i+1).padStart(2,'0');
  dPos.textContent=String(i+1).padStart(2,'0')+' / 15';
  prog.style.width=((i+1)/N*100)+'%';

  openBtn.disabled=false;

  if(instant){ apply(m); return; }

  [dPill,dName,dSub,gZone].forEach(el=>el.classList.add('fade'));
  setTimeout(()=>{
    apply(m);
    [dPill,dName,dSub,gZone].forEach(el=>el.classList.remove('fade'));
  },100);
}

function apply(m){
  dName.textContent=m.name;
  dSub.textContent=m.sub;
  dPillTxt.textContent=ST[m.st];
  dPill.className='status-pill'+(m.st==='critical'?' critical':'');
  dDot.className='status-pill-dot'+(m.st==='critical'?' critical':m.st==='soon'?' soon':'');
  buildGaugeZone(m.code);
}

function select(i){
  if(i===sel)return;
  document.getElementById('c'+sel)?.classList.remove('active');
  sel=i;
  document.getElementById('c'+sel)?.classList.add('active');
  updateDetail(sel,false);
}

function doOpen(){
  const m=M[sel];
  const link=MODULE_LINKS[m.code];
  if(link && link!=='#'){
    window.location.href=link;
  }
}

document.addEventListener('keydown',e=>{
  let n=sel;
  if(e.key==='ArrowRight') n=(sel+1)%N;
  else if(e.key==='ArrowLeft') n=(sel-1+N)%N;
  else if(e.key==='ArrowDown') n=Math.min(N-1,sel+5);
  else if(e.key==='ArrowUp') n=Math.max(0,sel-5);
  else if(e.key==='Enter'||e.key===' '){doOpen();e.preventDefault();return;}
  else return;
  e.preventDefault(); select(n);
});

updateDetail(sel,true);
