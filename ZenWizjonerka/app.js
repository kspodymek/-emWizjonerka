// minimal app.js for GitHub Pages
import * as Tasks from './components/tasks.js';
import * as Payments from './components/payments.js';
import * as Health from './components/health.js';
import * as Ideas from './components/ideas.js';
import * as Growth from './components/growth.js';

const STORAGE_KEY = 'zenwiz_v1';
const DEFAULT = {tasks:[],payments:[],health:[],ideas:[],growth:[],meta:{notifications:false,lastSaved:null}};
const state = load();

window.Wiz = {state, save, exportJSON, importJSON, registerChange};

document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> {
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const t = btn.dataset.target;
    document.querySelectorAll('.page').forEach(p=> p.id === t ? p.classList.add('active') : p.classList.remove('active'));
  });
});

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const modalTitle = document.getElementById('modalTitle');
document.getElementById('closeModal').addEventListener('click', ()=> modal.classList.add('hidden'));
function openModal(title, el){ modalTitle.textContent=title; modalBody.innerHTML=''; if(typeof el==='string') modalBody.innerHTML=el; else modalBody.appendChild(el); modal.classList.remove('hidden'); }
document.body.__openModal = openModal;

function load(){ const raw=localStorage.getItem(STORAGE_KEY); if(raw){ try{return JSON.parse(raw);}catch(e){console.error(e);} } return DEFAULT; }
function save(){ state.meta.lastSaved = new Date().toISOString(); localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function exportJSON(){ const data=JSON.stringify(state); const blob=new Blob([data],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='zenwiz_backup.json'; a.click(); URL.revokeObjectURL(url); }
function importJSON(text){ try{ const obj=JSON.parse(text); Object.assign(state,obj); save(); Tasks.renderAll(); Payments.renderAll(); Health.renderAll(); Ideas.renderAll(); Growth.renderAll(); renderStart(); alert('Import zakończony.'); }catch(e){ alert('Błąd importu: '+e.message); } }

function generateQRForData(){ const wrap=document.getElementById('qrWrap'); wrap.innerHTML=''; const data=JSON.stringify(state); const qr=document.createElement('div'); try{ new QRCode(qr,{text:data,width:160,height:160}); }catch(e){ qr.textContent='QR unavailable'; } wrap.appendChild(qr); }

document.getElementById('btnExport').addEventListener('click', exportJSON);
document.getElementById('btnImport').addEventListener('click', ()=>{ const ta=document.createElement('textarea'); ta.style.width='100%'; ta.style.height='220px'; ta.placeholder='Wklej JSON i kliknij Importuj'; const btn=document.createElement('button'); btn.className='btn'; btn.textContent='Importuj'; btn.addEventListener('click', ()=>{ importJSON(ta.value); modal.classList.add('hidden'); }); const wrap=document.createElement('div'); wrap.appendChild(ta); wrap.appendChild(btn); openModal('Import danych', wrap); });

function renderStart(){ const startEl=document.getElementById('startList'); startEl.innerHTML=''; (state.tasks||[]).slice(0,3).forEach(t=>{ const li=document.createElement('li'); li.textContent = t.title || '(bez tytułu)'; startEl.appendChild(li); }); generateQRForData(); }
function registerChange(){ save(); renderStart(); }
window.Wiz.registerChange = registerChange;

Tasks.init(state, window.Wiz); Payments.init(state, window.Wiz); Health.init(state, window.Wiz); Ideas.init(state, window.Wiz); Growth.init(state, window.Wiz);
renderStart();
