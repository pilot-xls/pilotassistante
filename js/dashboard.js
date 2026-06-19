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

const GAUGE_DATA={
  LOG:{
    label:'Estatísticas', live:true,
    items:[
      {label:'Total Hours',  value:842.5,  max:1500, unit:'h', dec:1},
      {label:'PIC Hours',    value:312.3,  max:842.5,unit:'h', dec:1},
      {label:'Night Hours',  value:96.7,   max:842.5,unit:'h', dec:1},
      {label:'IFR Hours',    value:201.4,  max:842.5,unit:'h', dec:1},
    ]
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

/* ── Build module grid ── */
const grid=document.getElementById('grid');
M.forEach((m,i)=>{
  const c=document.createElement('div');
  c.className='card'+(i===sel?' active':'')+(m.st==='critical'?' critical':'');
  c.id='c'+i;
  c.innerHTML=`<span class="card-num">${String(i+1).padStart(2,'0')}</span><span class="card-code">${m.code}</span>`;
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
