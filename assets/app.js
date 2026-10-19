const LAYERS = [
  {c:'var(--blue)',  k:'var(--blue-ink)',  en:{t:'Input',d:'The entry point where human intentions meet artificial intelligence. Voice, text and other signals are captured and prepared.',p:['Natural speech recognition','Context-aware text input','Multi-modal data integration']},
                                            es:{t:'Entrada',d:'El punto donde las intenciones humanas se encuentran con la IA. Voz, texto y otras señales se capturan y preparan.',p:['Reconocimiento de voz natural','Texto con contexto','Integración multimodal']}},
  {c:'var(--purple)',k:'var(--purple-ink)',en:{t:'Understanding',d:'Raw input becomes meaning. Models decode not just words, but intent, emotion and context.',p:['Intent recognition','Semantic & entity analysis','Contextual memory']},
                                            es:{t:'Comprensión',d:'La entrada se convierte en significado. Los modelos decodifican intención, emoción y contexto.',p:['Reconocimiento de intención','Análisis semántico','Memoria contextual']}},
  {c:'var(--green)', k:'var(--green-ink)', en:{t:'Reasoning',d:'The cognitive core. The system weighs options and constraints to plan the best way to meet your need.',p:['Decision frameworks','Constraint optimization','Predictive planning']},
                                            es:{t:'Razonamiento',d:'El núcleo cognitivo. El sistema evalúa opciones y restricciones para planear la mejor solución.',p:['Marcos de decisión','Optimización de restricciones','Planificación predictiva']}},
  {c:'var(--yellow)',k:'var(--yellow-ink)',en:{t:'Action',d:'Where decisions become reality. Systems, APIs and services are orchestrated to get things done.',p:['API orchestration','Verified transactions','Real-time coordination']},
                                            es:{t:'Acción',d:'Donde las decisiones se vuelven realidad. Se orquestan sistemas, APIs y servicios para resolver.',p:['Orquestación de APIs','Transacciones verificadas','Coordinación en tiempo real']}},
  {c:'var(--red)',   k:'var(--red-ink)',   en:{t:'Output',d:'The final delivery: a response, a visual, or the task simply done — in the format that fits you best.',p:['Natural responses','Multi-channel delivery','Continuous feedback loop']},
                                            es:{t:'Salida',d:'La entrega final: una respuesta, un visual o la tarea resuelta, en el formato que mejor te sirve.',p:['Respuestas naturales','Entrega multicanal','Retroalimentación continua']}}
];
let lang=localStorage.getItem('nn-lang')||'en', active=0;
const steps=document.getElementById('steps'), panel=document.getElementById('panel');
const T={en:{layer:'Layer',of:'of',prev:'Previous',next:'Next layer'},es:{layer:'Capa',of:'de',prev:'Anterior',next:'Siguiente capa'}};

function renderSteps(){
  if(!steps) return;
  steps.innerHTML='';
  LAYERS.forEach((L,i)=>{
    const b=document.createElement('button');
    b.className='step'+(i<active?' done':''); b.type='button'; b.setAttribute('role','tab');
    b.style.setProperty('--c',L.c);
    b.setAttribute('aria-selected',i===active);
    b.innerHTML=`<b>${i+1}</b><span>${L[lang].t}</span>`;
    b.onclick=()=>go(i);
    steps.appendChild(b);
  });
}
function renderPanel(){
  if(!panel) return;
  const L=LAYERS[active], x=L[lang], t=T[lang];
  panel.style.setProperty('--c',L.c); panel.style.setProperty('--k',L.k);
  const prev=active>0, next=active<LAYERS.length-1;
  panel.innerHTML=`<div class="fade">
      <span class="p-step">${t.layer} 0${active+1} ${t.of} 05</span>
      <h3 class="p-title">${x.t}</h3>
      <p class="p-desc">${x.d}</p>
      <div class="p-nav">
        <button class="btn btn-secondary btn-sm" type="button" id="prev" ${prev?'':'disabled style="opacity:.4;cursor:default"'}>${t.prev}</button>
        <button class="btn btn-primary btn-sm" type="button" id="next" ${next?'':'disabled style="opacity:.4;cursor:default"'}>${t.next} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
      </div>
    </div>
    <ul class="p-list fade">${x.p.map(p=>`<li>${p}</li>`).join('')}</ul>`;
  if(prev) document.getElementById('prev').onclick=()=>go(active-1);
  if(next) document.getElementById('next').onclick=()=>go(active+1);
}
function go(i){active=i;renderSteps();renderPanel();}
const m=location.hash.match(/^#l([1-5])$/); if(m) active=+m[1]-1;
renderSteps(); renderPanel();

function applyLang(){
  document.documentElement.lang=lang;
  document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('on',b.dataset.l===lang));
  document.querySelectorAll('[data-'+lang+']').forEach(el=>el.textContent=el.dataset[lang]);
}
applyLang();
document.documentElement.classList.remove('lang-pending');
document.querySelectorAll('.lang button').forEach(btn=>btn.onclick=()=>{
  lang=btn.dataset.l; localStorage.setItem('nn-lang',lang); applyLang(); document.documentElement.lang=lang;
  document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('on',b===btn));
  document.querySelectorAll('[data-'+lang+']').forEach(el=>el.textContent=el.dataset[lang]);
  renderSteps(); renderPanel();
});

const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40),{passive:true});
const menu=document.getElementById('menu'), links=document.getElementById('links');
menu.onclick=()=>{const o=links.classList.toggle('open');menu.setAttribute('aria-expanded',o);};
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* ===== Success modal ===== */
function openModal(src){
  if(!src) return;
  let m=document.getElementById('modal');
  if(!m){
    m=document.createElement('div'); m.id='modal'; m.className='modal'; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true');
    m.innerHTML='<div class="modal-card"><button class="modal-x" type="button" aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="modal-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div><div class="modal-body"></div></div>';
    document.body.appendChild(m);
    const close=()=>{m.classList.remove('show');document.body.style.overflow='';};
    m.querySelector('.modal-x').onclick=close;
    m.addEventListener('click',e=>{if(e.target===m)close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  }
  m.querySelector('.modal-body').innerHTML=src.innerHTML;
  m.querySelector('.modal-ic').style.animation='none'; void m.offsetWidth; m.querySelector('.modal-ic').style.animation='';
  m.classList.add('show'); document.body.style.overflow='hidden';
  setTimeout(()=>m.querySelector('.modal-x').focus(),50);
}

/* ===== Forms (Formspree-compatible, AJAX with graceful fallback) ===== */
document.querySelectorAll('form[data-ajax]').forEach(form=>{
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const ok=form.querySelector('.ok'), err=form.querySelector('.err'), btn=form.querySelector('button[type="submit"]');
    ok&&ok.classList.remove('show'); err&&err.classList.remove('show');
    let valid=true;
    form.querySelectorAll('[required]').forEach(f=>{const bad=!f.value.trim()||(f.type==='email'&&!f.value.includes('@'));f.style.borderColor=bad?'var(--red)':'';if(bad&&valid){f.focus();valid=false;}});
    if(!valid) return;
    if(form.action.includes('YOUR_FORM_ID')){ /* not configured yet: demo success */ openModal(ok); form.querySelectorAll('.field').forEach(f=>f.value=''); return; }
    btn&&btn.setAttribute('aria-busy','true');
    try{
      const r=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});
      if(r.ok){openModal(ok);form.querySelectorAll('.field').forEach(f=>f.value='');}
      else err&&err.classList.add('show');
    }catch(_){err&&err.classList.add('show');}
    btn&&btn.removeAttribute('aria-busy');
  });
});

// active nav link
const here=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.nav-links>a').forEach(a=>{if(a.getAttribute('href').split('#')[0]===here)a.classList.add('active');});

/* ===== Hero particle network (from the original site, tuned for light bg) ===== */
(()=>{
  const cv=document.getElementById('hero-canvas'); if(!cv) return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx=cv.getContext('2d'); let W,H,ps=[];
  const COLORS=['#60a5fa','#a78bfa','#22c55e','#fbbf24','#ef4444'];
  function size(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;
    const n=Math.min(110,Math.floor(W*H/14000));
    ps=Array.from({length:n},()=>mk());}
  function mk(){return{x:Math.random()*W,y:Math.random()*H,s:Math.random()*2+1,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,a:Math.random()*.5+.3,c:COLORS[Math.floor(Math.random()*COLORS.length)]};}
  let vis=true; new IntersectionObserver(es=>{vis=es[0].isIntersecting; if(vis) requestAnimationFrame(frame);}).observe(cv);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&vis) requestAnimationFrame(frame);});
  function frame(){
    if(!vis||document.hidden) return;
    ctx.clearRect(0,0,W,H);
    for(const p of ps){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W||p.y<0||p.y>H)Object.assign(p,mk());}
    for(let i=0;i<ps.length;i++)for(let k=i+1;k<ps.length;k++){
      const a=ps[i],b=ps[k],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<150){ctx.strokeStyle=`rgba(37,99,235,${.16*(1-d/150)})`;ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}
    for(const p of ps){ctx.globalAlpha=p.a;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,7);ctx.fill();}
    ctx.globalAlpha=1; requestAnimationFrame(frame);}
  addEventListener('resize',size); size(); frame();
})();

/* ===== Neural network (brain) visualization — Approach section ===== */
document.querySelectorAll('.neural-canvas').forEach(cv=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx=cv.getContext('2d'); let W,H,neurons=[],signals=[];
  function init(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;neurons=[];signals=[];
    const cx=W/2,cy=H/2,R=Math.min(W,H)*.42,N=Math.max(30,Math.min(60,Math.floor(W*H/5500)));
    for(let i=0;i<N;i++){const a=(i/N)*Math.PI*2+Math.random()*.5,r=Math.random()*R;
      neurons.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r,br:Math.random()*3+2,r:0,ph:Math.random()*Math.PI*2,con:[],fire:false,t:0});}
    neurons.forEach((n,i)=>{const c=Math.floor(Math.random()*3)+2;for(let k=0;k<c;k++){const t=Math.floor(Math.random()*N);if(t!==i)n.con.push(t);}});}
  let vis=true; new IntersectionObserver(es=>{vis=es[0].isIntersecting; if(vis) requestAnimationFrame(frame);}).observe(cv);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&vis) requestAnimationFrame(frame);});
  function frame(time){
    if(!vis||document.hidden) return;
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='rgba(37,99,235,.16)';ctx.lineWidth=1;
    for(const n of neurons)for(const t of n.con){ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(neurons[t].x,neurons[t].y);ctx.stroke();}
    for(const n of neurons){
      n.r=n.br+Math.sin(time*.002+n.ph);
      if(!n.fire&&Math.random()<.0012){n.fire=true;n.t=30;for(const t of n.con)if(Math.random()<.5)signals.push({a:n,b:neurons[t],p:0,v:.02+Math.random()*.02});}
      if(n.fire&&--n.t<=0)n.fire=false;
      const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*2.2);
      if(n.fire){g.addColorStop(0,'rgba(34,197,94,1)');g.addColorStop(.5,'rgba(34,197,94,.45)');g.addColorStop(1,'rgba(34,197,94,0)');}
      else{g.addColorStop(0,'rgba(96,165,250,.9)');g.addColorStop(.5,'rgba(167,139,250,.35)');g.addColorStop(1,'rgba(167,139,250,0)');}
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(n.x,n.y,n.r*2.2,0,7);ctx.fill();
      ctx.fillStyle=n.fire?'#22c55e':'#2563eb';ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,7);ctx.fill();}
    signals=signals.filter(s=>{const x=s.a.x+(s.b.x-s.a.x)*s.p,y=s.a.y+(s.b.y-s.a.y)*s.p;
      ctx.fillStyle='#22c55e';ctx.beginPath();ctx.arc(x,y,3,0,7);ctx.fill();s.p+=s.v;return s.p<1;});
    requestAnimationFrame(frame);}
  addEventListener('resize',init); init(); requestAnimationFrame(frame);
});

/* ===== Anchor navigation: land exactly at the top of the section ===== */
(()=>{
  const navH=()=>document.getElementById('nav').offsetHeight+16;
  const scrollToId=(id,smooth)=>{
    const el=document.getElementById(id); if(!el) return false;
    const y=el.getBoundingClientRect().top+scrollY-navH();
    scrollTo({top:y,behavior:smooth?'smooth':'auto'}); return true;
  };
  // same-page anchors
  document.querySelectorAll('a[href]').forEach(a=>{
    const href=a.getAttribute('href'); if(!href) return;
    const [path,hash]=href.split('#'); if(!hash) return;
    const here=location.pathname.split('/').pop()||'index.html';
    if(path && path!==here) return;
    a.addEventListener('click',e=>{
      if(/^l[1-5]$/.test(hash)) return; // stepper deep links handled by the stepper
      if(scrollToId(hash,true)){e.preventDefault();history.pushState(null,'','#'+hash);}
    });
  });
  // cross-page landing with hash: re-align after layout settles
  if(location.hash){
    const id=location.hash.slice(1);
    if(/^l[1-5]$/.test(id)){ const how=document.getElementById('how'); if(how){ requestAnimationFrame(()=>scrollToId('how',false)); setTimeout(()=>scrollToId('how',false),250);} }
    else { requestAnimationFrame(()=>scrollToId(id,false)); setTimeout(()=>scrollToId(id,false),250); }
  }
  if('scrollRestoration' in history) history.scrollRestoration='manual';
})();

/* ===== Hero demo: a request flowing through the five layers ===== */
(()=>{
  const root=document.getElementById('demo'); if(!root) return;
  const typed=document.getElementById('demo-typed'), status=document.getElementById('demo-status'),
        res=document.getElementById('demo-result-text'), lis=[...document.querySelectorAll('#demo-layers li')];
  lis.forEach(li=>li.style.setProperty('--c',li.dataset.c));
  const S={
    en:{listening:'listening',working:'working',done:'resolved',scenarios:[
      {q:'Move my dentist appointment to next Tuesday afternoon.',l:['voice → text','intent: reschedule · entity: dentist','check calendar · find free slots','call clinic API · confirm 3:30 PM','draft confirmation'],r:'Done. Tuesday 3:30 PM at Dr. Mora. Added to your calendar.'},
      {q:'Renew my car insurance with the same coverage.',l:['text · context: policy #','intent: renew · constraint: same plan','compare quote vs. last year','submit renewal · secure payment','receipt + policy PDF'],r:'Renewed for 12 months. Policy and receipt are in your inbox.'},
      {q:'Book a table for four tonight near the office.',l:['voice → text · location','intent: reserve · party: 4 · time: tonight','rank options by distance & rating','reserve at 7:30 PM · 2 backups held','send invite to the group'],r:'Table for 4 at 7:30 PM, 5 min from the office. Invite sent.'}
    ]},
    es:{listening:'escuchando',working:'trabajando',done:'resuelto',scenarios:[
      {q:'Mueve mi cita con el dentista al martes en la tarde.',l:['voz → texto','intención: reagendar · entidad: dentista','revisar calendario · buscar espacios','llamar API clínica · confirmar 3:30 PM','redactar confirmación'],r:'Listo. Martes 3:30 PM con el Dr. Mora. Ya está en tu calendario.'},
      {q:'Renueva el seguro del carro con la misma cobertura.',l:['texto · contexto: n.º de póliza','intención: renovar · restricción: mismo plan','comparar cotización vs. año pasado','enviar renovación · pago seguro','recibo + póliza en PDF'],r:'Renovado por 12 meses. Póliza y recibo están en tu correo.'},
      {q:'Reserva mesa para cuatro esta noche cerca de la oficina.',l:['voz → texto · ubicación','intención: reservar · personas: 4 · hoy','ordenar opciones por distancia y rating','reservar 7:30 PM · 2 respaldos','enviar invitación al grupo'],r:'Mesa para 4 a las 7:30 PM, a 5 min de la oficina. Invitación enviada.'}
    ]}
  };
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let idx=0, token=0;
  async function run(){
    const my=++token; const L=S[(typeof lang!=='undefined'&&S[lang])?lang:'en']; const sc=L.scenarios[idx%L.scenarios.length]; idx++;
    root.classList.remove('done'); typed.textContent=''; res.textContent=sc.r; status.textContent=L.listening;
    lis.forEach((li,i)=>{li.className='';document.getElementById('dl'+i).textContent='';});
    if(reduced){typed.textContent=sc.q;lis.forEach((li,i)=>{li.className='done';document.getElementById('dl'+i).textContent=sc.l[i];});root.classList.add('done');status.textContent=L.done;return;}
    await wait(600); if(my!==token) return;
    for(const ch of sc.q){typed.textContent+=ch;await wait(28+Math.random()*30);if(my!==token)return;}
    await wait(500); status.textContent=L.working;
    for(let i=0;i<5;i++){
      lis[i].className='active'; document.getElementById('dl'+i).textContent=sc.l[i];
      await wait(900); if(my!==token) return;
      lis[i].className='done';
    }
    root.classList.add('done'); status.textContent=L.done;
    await wait(4200); if(my!==token) return;
    run();
  }
  const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();run();}},{threshold:.3});
  io.observe(root);
  document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>{idx=Math.max(0,idx-1);run();}));
})();


/* ===== Product switcher + lightbox ===== */
(()=>{
  const tabs=[...document.querySelectorAll('.pc[role="tab"]')]; if(!tabs.length) return;
  const panels=[...document.querySelectorAll('.ppanel')];
  function show(id,push){
    tabs.forEach(t=>t.setAttribute('aria-selected',t.dataset.p===id));
    panels.forEach(p=>{p.hidden=(p.id!=='panel-'+id);});
    if(push) history.replaceState(null,'','#'+id);
    document.dispatchEvent(new CustomEvent('product:show',{detail:id}));
  }
  tabs.forEach((t,i)=>{
    t.addEventListener('click',()=>show(t.dataset.p,true));
    t.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];n.focus();show(n.dataset.p,true);}});
  });
  const h=location.hash.replace('#',''); if(tabs.some(t=>t.dataset.p===h)) show(h,false);
  // links to a product (engine cards, home cards) switch the tab and scroll to the switcher
  document.querySelectorAll('a[data-p]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();show(a.dataset.p,true);const sw=document.getElementById('switcher');const y=sw.getBoundingClientRect().top+scrollY-(document.getElementById('nav').offsetHeight+16);scrollTo({top:y,behavior:'smooth'});}));
  // lightbox
  const lb=document.getElementById('lb'), img=document.getElementById('lb-img'), cap=document.getElementById('lb-cap');
  const open=fig=>{const im=fig.querySelector('img'), fc=fig.querySelector('figcaption'); img.src=im.src; img.alt=im.alt; cap.textContent=fc?fc.textContent:''; lb.hidden=false; document.body.style.overflow='hidden'; lb.querySelector('.lb-x').focus();};
  const close=()=>{lb.hidden=true; document.body.style.overflow='';};
  document.querySelectorAll('.shotimg.zoom').forEach(f=>{f.addEventListener('click',()=>open(f)); f.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(f);}});});
  lb.addEventListener('click',e=>{if(e.target===lb||e.target.closest('.lb-x'))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!lb.hidden)close();});
})();

/* ===== Guided demo tours over screenshots ===== */
(()=>{
  const wraps=[...document.querySelectorAll('.demo-wrap')]; if(!wraps.length) return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const state=new Map();
  async function run(w){
    const token=(state.get(w)||0)+1; state.set(w,token);
    const hs=[...w.querySelectorAll('.hs')], cur=w.querySelector('.cursor');
    hs.forEach(h=>h.classList.remove('on'));
    if(reduced){hs[0].classList.add('on');return;}
    w.classList.add('playing');
    cur.style.left='50%';cur.style.top='60%'; await wait(400);
    for(let loop=0;loop<2;loop++){
      for(const h of hs){
        if(state.get(w)!==token) return;
        cur.style.left=h.style.left; cur.style.top=h.style.top; await wait(950);
        if(state.get(w)!==token) return;
        cur.classList.add('click'); setTimeout(()=>cur.classList.remove('click'),400);
        hs.forEach(x=>x.classList.remove('on')); h.classList.add('on');
        await wait(2300);
      }
    }
    if(state.get(w)===token){w.classList.remove('playing');}
  }
  function stop(w){state.set(w,(state.get(w)||0)+1);w.classList.remove('playing');}
  function visible(w){return !w.closest('.ppanel')?.hidden;}
  // hotspots: manual
  wraps.forEach(w=>{
    w.querySelectorAll('.hs').forEach(h=>h.addEventListener('click',e=>{e.stopPropagation();stop(w);w.querySelectorAll('.hs').forEach(x=>x.classList.remove('on'));h.classList.add('on');}));
    w.querySelector('.demo-replay').addEventListener('click',e=>{e.stopPropagation();run(w);});
    w.addEventListener('mouseenter',()=>{});
  });
  // start when panel visible & in viewport
  const io=new IntersectionObserver(es=>es.forEach(e=>{const w=e.target;if(e.isIntersecting&&visible(w)&&!w.classList.contains('playing'))run(w);}),{threshold:.4});
  wraps.forEach(w=>io.observe(w));
  document.addEventListener('product:show',e=>{wraps.forEach(w=>{if(visible(w))run(w);else stop(w);});});
})();

/* ===== Express mini demo (products page) ===== */
(()=>{
  const box=document.querySelector('.shot.xdemo'); if(!box) return;
  const typed=box.querySelector('.xtyped'), steps=[...box.querySelectorAll('.xs')], st=box.querySelector('.xstatus');
  const text='Renew my car insurance with the same coverage.';
  const wait=ms=>new Promise(r=>setTimeout(r,ms)); let tok=0;
  async function run(){const my=++tok; box.classList.remove('done'); typed.textContent=''; steps.forEach(s=>s.classList.remove('on')); st.textContent='listening';
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){typed.textContent=text;steps.forEach(s=>s.classList.add('on'));box.classList.add('done');st.textContent='resolved';return;}
    await wait(500); for(const ch of text){if(my!==tok)return;typed.textContent+=ch;await wait(30);}
    st.textContent='working'; for(const s of steps){await wait(800);if(my!==tok)return;s.classList.add('on');}
    await wait(600); if(my!==tok)return; box.classList.add('done'); st.textContent='resolved'; await wait(5000); if(my===tok) run();}
  const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();run();}},{threshold:.3}); io.observe(box);
  document.addEventListener('product:show',e=>{if(e.detail==='express')run();});
})();

/* ===== Always open a page from the top (unless a hash targets a section) ===== */
(()=>{
  if(location.hash) return;
  const top=()=>scrollTo({top:0,left:0,behavior:'auto'});
  top(); addEventListener('load',top); addEventListener('pageshow',e=>{if(e.persisted)top();});
})();
