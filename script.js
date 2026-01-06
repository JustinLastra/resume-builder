// Basic scaffolding for the Resume Builder (learning / teaching version)
// TODO: Replace assistant mock with real API calls via a server-side proxy.

const DEFAULT_SECTIONS = ["Contact","Summary","Experience","Education","Skills","Projects","Certifications"];
let data = null;

function loadData(){
  const raw = localStorage.getItem('resumeData');
  if(raw){
    try{ data = JSON.parse(raw); return; }catch(e){}
  }
  // initialize
  data = {sections: DEFAULT_SECTIONS.map(name=>({name, content: ''})), meta:{}};
}

function saveData(){
  localStorage.setItem('resumeData', JSON.stringify(data));
}

function renderSectionsList(){
  const ul = document.getElementById('sectionsList');
  ul.innerHTML = '';
  data.sections.forEach((s, i)=>{
    const li = document.createElement('li');
    li.innerHTML = `<span>${s.name}</span><div><button class="moveUp" data-i="${i}">↑</button><button class="moveDown" data-i="${i}">↓</button></div>`;
    ul.appendChild(li);
  });
}

function renderEditor(){
  const root = document.getElementById('editorContent');
  root.innerHTML = '';
  data.sections.forEach((s, i)=>{
    const sec = document.createElement('div');
    sec.className = 'section';
    sec.innerHTML = `<h2>${s.name}</h2><div class="editable" contenteditable="true" data-i="${i}">${escapeHtml(s.content)}</div>`;
    root.appendChild(sec);
  });
  // attach input listeners
  document.querySelectorAll('.editable').forEach(el=>{
    el.addEventListener('input', e=>{
      const idx = +e.target.dataset.i;
      data.sections[idx].content = e.target.innerText;
      saveData();
    });
  });
}

function escapeHtml(str){ if(!str) return ''; return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function addSection(){
  const name = prompt('Section name');
  if(!name) return;
  data.sections.push({name, content: ''});
  saveData(); renderSectionsList(); renderEditor();
}

function moveSection(i, dir){
  const j = i + dir;
  if(j<0 || j>=data.sections.length) return;
  const tmp = data.sections[i]; data.sections[i]=data.sections[j]; data.sections[j]=tmp;
  saveData(); renderSectionsList(); renderEditor();
}

function parseImport(){
  const raw = document.getElementById('importResume').value || '';
  const job = document.getElementById('importJob').value || '';
  if(!raw) return alert('Paste a resume into the "Paste resume" box first');

  // simple heuristic parser: split paragraphs and map by keyword
  const paragraphs = raw.split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean);
  paragraphs.forEach(p=>{
    const lower = p.toLowerCase();
    if(/education|degree|university|college/.test(lower)) appendToSection('Education', p);
    else if(/experience|company|role|responsible|responsibilities|achievement|\bat\b/.test(lower)) appendToSection('Experience', p);
    else if(/skill|skills|technologies|languages/.test(lower)) appendToSection('Skills', p);
    else if(/project|projects|github|repo/.test(lower)) appendToSection('Projects', p);
    else appendToSection('Summary', p);
  });

  if(job){
    // store job description for simple tailoring
    data.meta.job = job;
    document.getElementById('assistantOutput').innerText = 'Job description saved — use Tailor to get a basic suggestion.';
  }
  saveData(); renderSectionsList(); renderEditor();
}

function appendToSection(name, text){
  const s = data.sections.find(s=>s.name.toLowerCase()===name.toLowerCase());
  if(s){
    s.content = (s.content? s.content + '\n\n' : '') + text;
  }
}

function tailorBasic(){
  // VERY basic tailoring example: prepend key phrase from job to Summary
  const job = data.meta.job || document.getElementById('importJob').value || '';
  if(!job) return alert('Paste a job description into the Job Description box first');
  const firstLine = job.split('\n').find(Boolean) || job.slice(0,120);
  const summary = data.sections.find(s=>s.name==='Summary');
  if(summary){
    summary.content = `Tailored summary for job: "${firstLine.trim()}"\n\n` + (summary.content || '');
    document.getElementById('assistantOutput').innerText = 'Added a tailored summary suggestion (basic mock).';
    saveData(); renderEditor();
  }
}

function askAssistant(){
  const prompt = document.getElementById('assistantPrompt').value.trim();
  if(!prompt) return;
  // Mock assistant response: demonstrate how you might rewrite a summary/bullet.
  const resp = `Suggested rewrite (mock): ${prompt.slice(0,200)}...`;
  document.getElementById('assistantOutput').innerText = resp;
}

function attachListeners(){
  document.getElementById('addSectionBtn').addEventListener('click', addSection);
  document.getElementById('parseBtn').addEventListener('click', parseImport);
  document.getElementById('tailorBtn').addEventListener('click', tailorBasic);
  document.getElementById('askBtn').addEventListener('click', askAssistant);
  document.getElementById('printBtn').addEventListener('click', ()=>window.print());

  // delegate move up/down
  document.getElementById('sectionsList').addEventListener('click', e=>{
    if(e.target.matches('button.moveUp')){ moveSection(+e.target.dataset.i, -1); }
    if(e.target.matches('button.moveDown')){ moveSection(+e.target.dataset.i, +1); }
  });
}

// Init
loadData(); renderSectionsList(); renderEditor(); attachListeners();

// Expose for debugging (in-browser console while learning)
window.RESUME_DATA = data;