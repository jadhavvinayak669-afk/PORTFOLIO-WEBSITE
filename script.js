/* ── CURSOR ── */
// Custom cursor disabled - using normal cursor
// const cursor = document.getElementById('cursor');
// let mx=0,my=0;
// document.addEventListener('mousemove',e=>{
//   mx=e.clientX; my=e.clientY;
//   cursor.style.left=mx+'px'; cursor.style.top=my+'px';
// });

/* ── TYPING EFFECT ── */
const phrases=["Android App Developer","Full-Stack Developer","Software Tester","IoT Enthusiast","WordPress Developer"];
let pi=0,ci=0,deleting=false;
const typedEl=document.getElementById('typed-text');
function type(){
  const phrase=phrases[pi];
  if(!deleting){
    typedEl.textContent=phrase.slice(0,ci+1);
    ci++;
    if(ci===phrase.length){ setTimeout(()=>{deleting=true;},1800); setTimeout(type,100); return; }
  } else {
    typedEl.textContent=phrase.slice(0,ci-1);
    ci--;
    if(ci===0){ deleting=false; pi=(pi+1)%phrases.length; }
  }
  setTimeout(type, deleting?60:100);
}
type();

/* ── HERO 3D CANVAS (rotating torus knot-like geometry) ── */
(function initHero(){
  const canvas=document.getElementById('heroCanvas');
  const ctx=canvas.getContext('2d');
  let W,H,frame=0;
  function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
  resize(); window.addEventListener('resize',resize);

  const POINTS=1800;
  let pts=[];
  // Generate torus knot points
  for(let i=0;i<POINTS;i++){
    const t=(i/POINTS)*Math.PI*2*7;
    const p=3,q=2;
    const r=.5+.3*Math.cos(q*t);
    pts.push({
      ox: r*Math.cos(p*t),
      oy: r*Math.sin(p*t),
      oz: Math.sin(q*t)*0.3,
      hue: (i/POINTS)*360
    });
  }

  let mouseX=0.5, mouseY=0.5;
  document.addEventListener('mousemove',e=>{ mouseX=e.clientX/window.innerWidth; mouseY=e.clientY/window.innerHeight; });

  function draw(){
    frame++;
    ctx.clearRect(0,0,W,H);
    const cx=W/2, cy=H/2;
    const scale=Math.min(W,H)*0.28;
    const rotY=frame*.006+mouseX*2;
    const rotX=frame*.003+mouseY*1.2;
    const cosY=Math.cos(rotY),sinY=Math.sin(rotY);
    const cosX=Math.cos(rotX),sinX=Math.sin(rotX);

    // sort by z
    const projected=pts.map(p=>{
      let x=p.ox, y=p.oy, z=p.oz;
      // rotY
      let x2=x*cosY+z*sinY; let z2=-x*sinY+z*cosY;
      // rotX
      let y2=y*cosX-z2*sinX; let z3=y*sinX+z2*cosX;
      const fov=2.5; const pz=z3+fov;
      const sx=cx+(x2/pz)*scale; const sy=cy+(y2/pz)*scale;
      const size=Math.max(.3,(1.8/(pz))*1.1);
      const alpha=Math.min(1,(.8+z3)*.7);
      return {sx,sy,size,alpha,hue:p.hue,z3};
    }).sort((a,b)=>a.z3-b.z3);

    projected.forEach(p=>{
      const gradient=ctx.createRadialGradient(p.sx,p.sy,0,p.sx,p.sy,p.size*2);
      const h=(p.hue+frame*.4)%360;
      gradient.addColorStop(0,`hsla(${h},80%,65%,${p.alpha})`);
      gradient.addColorStop(1,`hsla(${h},80%,65%,0)`);
      ctx.beginPath();
      ctx.arc(p.sx,p.sy,p.size*2,0,Math.PI*2);
      ctx.fillStyle=gradient;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── BACKGROUND PARTICLES ── */
(function initParticles(){
  const canvas=document.getElementById('particles');
  const ctx=canvas.getContext('2d');
  let W,H;
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
  resize(); window.addEventListener('resize',resize);
  const N=90;
  const stars=Array.from({length:N},()=>({
    x:Math.random()*2000, y:Math.random()*2000,
    r:Math.random()*.8+.2, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
    a:Math.random()
  }));
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='rgba(5,5,8,0)';
    stars.forEach(s=>{
      s.x+=s.vx; s.y+=s.vy;
      if(s.x<0)s.x=W; if(s.x>W)s.x=0;
      if(s.y<0)s.y=H; if(s.y>H)s.y=0;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(108,99,255,${s.a*.5})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── 3D CARD TILT ── */
const card=document.getElementById('card3d');
if(card){
  card.addEventListener('mousemove',e=>{
    const rect=card.getBoundingClientRect();
    const x=(e.clientX-rect.left)/rect.width*2-1;
    const y=(e.clientY-rect.top)/rect.height*2-1;
    card.style.transform=`rotateY(${x*12}deg) rotateX(${-y*10}deg)`;
    card.style.setProperty('--mx',`${(x+1)/2*100}%`);
    card.style.setProperty('--my',`${(y+1)/2*100}%`);
  });
  card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
}

/* ── SKILLS ── */
const SKILLS=[
  {logo:'Oasis_Discovered__Prime_Python__Java__JS_Services__Thirsty_No_More___Quench_with_Quality_Orders_.jpg',name:'Java / Kotlin',level:82,color:'#f89820'},
  {logo:'Python_PNG_Logo_Transparent_Png_Image.jpg',name:'Python',level:78,color:'#3776ab'},
  {logo:'C___Programming_Language_Sticker.jpg',name:'C++',level:75,color:'#00599c'},
  {logo:'html_logo.jpg',name:'HTML / CSS',level:88,color:'#e34f26'},
  {logo:'JavaScript___La_puissance_du_langage_de_programmation.jpg',name:'JavaScript',level:80,color:'#f7df1e'},
  {logo:'R_Programming_Language_R_Logo_Sticker.jpg',name:'R Language',level:65,color:'#276dc3'},
  {logo:'MySQL_Logo_PNG_Vector__EPS__Free_Download.jpg',name:'MySQL',level:77,color:'#00758f'},
  {logo:'Wordpress_Tutorial.jpg',name:'WordPress',level:85,color:'#21759b'},
  {logo:'Firebase___Google_s_Mobile_and_Web_App_Development_Platform.jpg',name:'Android Dev',level:80,color:'#3ddc84'},
];
const sg=document.getElementById('skillsGrid');
SKILLS.forEach(s=>{
  const iconHTML = s.logo 
    ? `<img src="${s.logo}" alt="${s.name}" class="skill-logo">` 
    : `<span class="skill-icon">${s.icon}</span>`;
  sg.innerHTML+=`
  <div class="skill-card reveal">
    ${iconHTML}
    <div class="skill-name">${s.name}</div>
    <div style="color:var(--muted);font-size:.75rem;margin-top:.2rem">${s.level}% proficiency</div>
    <div class="skill-bar-wrap"><div class="skill-bar" data-level="${s.level}" style="background:${s.color}40;border-bottom:2px solid ${s.color};"></div></div>
  </div>`;
});

/* ── PROJECT CANVAS THUMBNAILS ── */
function makeProjectCanvas(container,colorA,colorB){
  const c=document.createElement('canvas');
  c.width=480; c.height=270;
  container.appendChild(c);
  const ctx=c.getContext('2d');
  let t=0;
  function draw(){
    ctx.clearRect(0,0,480,270);
    const g=ctx.createLinearGradient(0,0,480,270);
    g.addColorStop(0,colorA); g.addColorStop(1,colorB);
    ctx.fillStyle=g; ctx.fillRect(0,0,480,270);
    // animated circles
    for(let i=0;i<6;i++){
      const x=240+Math.sin(t*.7+i*1.1)*160;
      const y=135+Math.cos(t*.5+i*.9)*80;
      const r=20+i*8;
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${.04+i*.01})`; ctx.fill();
    }
    // grid lines
    ctx.strokeStyle='rgba(255,255,255,.07)'; ctx.lineWidth=1;
    for(let x=0;x<480;x+=40){ ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,270);ctx.stroke(); }
    for(let y=0;y<270;y+=40){ ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(480,y);ctx.stroke(); }
    t+=.02;
    requestAnimationFrame(draw);
  }
  draw();
}

const PROJECTS=[
  {tags:['Android','Kotlin','Firebase'],title:'Fuel Expense Tracker',desc:'An Android app to track daily fuel expenses, mileage, and spending trends. Features fuel log history, cost analytics, and smart insights for better vehicle budgeting.',image:'fuel_tracker.jpeg'},
  {tags:['HTML','CSS','JavaScript'],title:'Personal Portfolio Website',desc:'This very portfolio — a fully interactive, 3D animated personal website built to showcase projects, skills, and experience in a modern dark aesthetic.',image:'portfolio_screenshot.png'},
  {tags:['Java','MySQL','JDBC'],title:'Library Management System',desc:'A desktop application to manage books, members, and borrowing records. Supports CRUD operations, search functionality, and overdue tracking with a clean UI.',colorA:'#001a10',colorB:'#001a1a'},
  {tags:['IoT','Arduino','Hardware'],title:'Footstep Energy Harvesting',desc:'An IoT-based system that harvests kinetic energy from human footsteps using piezoelectric sensors, converts it to usable electricity, and displays real-time output data.',colorA:'#1a0500',colorB:'#001a10'},
];
const pg=document.getElementById('projectsGrid');
PROJECTS.forEach((p,i)=>{
  const div=document.createElement('div');
  div.className='project-card reveal';
  div.innerHTML=`
    <div class="project-thumb" id="pthumb${i}"></div>
    <div class="project-info">
      <div class="project-tags">${p.tags.map(t=>`<span class="project-tag">${t}</span>`).join('')}</div>
      <div class="project-title">${p.title}</div>
      <div class="project-desc">${p.desc}</div>
      <a href="#" class="project-link">View project →</a>
    </div>`;
  pg.appendChild(div);
  
  // Use image if available, otherwise create canvas animation
  if(p.image){
    setTimeout(()=>{
      const thumb=document.getElementById('pthumb'+i);
      const img=document.createElement('img');
      img.src=p.image;
      img.alt=p.title;
      img.className='project-image';
      thumb.appendChild(img);
    },50);
  } else {
    setTimeout(()=>makeProjectCanvas(document.getElementById('pthumb'+i),p.colorA,p.colorB),50);
  }
});

/* ── INTERSECTION OBSERVER (reveal + skill bars + counters) ── */
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      // skill bars
      entry.target.querySelectorAll('.skill-bar').forEach(b=>{
        b.style.width=b.dataset.level+'%';
      });
      // counters
      entry.target.querySelectorAll('[data-target]').forEach(el=>{
        const target=+el.dataset.target;
        let curr=0;
        const inc=Math.max(1,Math.floor(target/40));
        const iv=setInterval(()=>{
          curr=Math.min(curr+inc,target);
          el.textContent=curr+'+';
          if(curr>=target) clearInterval(iv);
        },40);
      });
    }
  });
},{threshold:.15});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
// also observe skill cards for bars
document.querySelectorAll('.skill-card').forEach(el=>observer.observe(el));

/* ── SMOOTH SCROLL WITH NAVBAR OFFSET ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;
    
    // Scroll to section with just navbar clearance - no extra padding
    const navbarHeight = document.querySelector('nav').offsetHeight;
    const targetPosition = targetSection.offsetTop - navbarHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});

/* ── CV BUTTON CHECK ── */
// Try to fetch the CV file; if it's missing, show the fallback note
fetch('Vinayak_Jadhav_CV.pdf',{method:'HEAD'})
  .then(r=>{ if(!r.ok) document.getElementById('cvNote').style.display='block'; })
  .catch(()=>{ document.getElementById('cvNote').style.display='block'; });
