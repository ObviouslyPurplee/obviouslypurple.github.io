// --- Immediately Invoked Function Expressions (IIFEs) for page setup ---
(function() { 
    const root = document.documentElement; 
    root.setAttribute('data-theme', 'dark'); 
})();

(function() { 
    const root = document.documentElement; 
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)'); 
    function apply() { 
        const mode = mq.matches ? 'reduced' : 'normal'; 
        root.setAttribute('data-motion', mode); 
        document.dispatchEvent(new CustomEvent('motion:changed', { detail: { mode } })); 
    } 
    apply(); 
    try { mq.addEventListener('change', apply); } catch (_) { mq.addListener && mq.addListener(apply); } 
})();

// Fog Gradient Background Effect
(function() { 
    if (window.__fogFX) return; 
    window.__fogFX = true; 
    const cvs = document.getElementById('fogFX'); 
    if (!cvs) return; 
    const ctx = cvs.getContext('2d'); 
    let W = 0, H = 0, DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1)); 
    const SCALE = 2; 
    let last = 0; 
    let blobs = []; 
    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark'; 
    const isReduced = () => document.documentElement.getAttribute('data-motion') === 'reduced'; 
    function colors() { return isDark() ? ['rgba(255,190,220,0.16)', 'rgba(255,190,220,0)'] : ['rgba(255,216,234,0.50)', 'rgba(255,216,234,0)']; } 
    function seed() { blobs.length = 0; const base = Math.max(10, Math.round((W * H) / 300000)); const n = Math.min(22, Math.max(10, Math.round(base * (isReduced() ? 0.7 : 1)))); for (let i = 0; i < n; i++) { const r = 160 + Math.random() * 320; const ang = Math.random() * Math.PI * 2; const spd = (isReduced() ? 0.002 : 0.004) + Math.random() * 0.002; blobs.push({ x: Math.random() * W, y: Math.random() * H, r, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, wob: Math.random() * Math.PI * 2, wobAmp: 0.2 + Math.random() * 0.4, wobSpd: 0.0003 + Math.random() * 0.0006 }); } } 
    function resize() { W = innerWidth; H = innerHeight; cvs.style.width = W + 'px'; cvs.style.height = H + 'px'; cvs.width = Math.ceil(W / SCALE) * DPR; cvs.height = Math.ceil(H / SCALE) * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.imageSmoothingEnabled = false; seed(); } 
    function draw(dt) { ctx.clearRect(0, 0, cvs.width, cvs.height); const [c0, c1] = colors(); for (const b of blobs) { const m = isReduced() ? 0.5 : 1; b.wob += b.wobSpd * dt * m; b.x += b.vx * dt * m + Math.cos(b.wob) * 0.02 * dt; b.y += b.vy * dt * m + Math.sin(b.wob) * 0.02 * dt; const pad = b.r + 40; if (b.x < -pad) b.x = W + pad; if (b.x > W + pad) b.x = -pad; if (b.y < -pad) b.y = H + pad; if (b.y > H + pad) b.y = -pad; const cx = b.x / SCALE, cy = b.y / SCALE, rr = b.r / SCALE; const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.fill(); } } 
    function loop(ts) { const dt = Math.min(50, (ts - last) || 16); last = ts; draw(dt); requestAnimationFrame(loop); } 
    window.addEventListener('resize', resize, { passive: true }); 
    document.addEventListener('theme:changed', resize); 
    document.addEventListener('motion:changed', resize); 
    resize(); 
    requestAnimationFrame(loop); 
})();

// Shimmer/Galaxy FX overlay for logo easter egg
(function() { 
    if (window.__shimmerFX3) return; 
    window.__shimmerFX3 = true; 
    const cvs = document.getElementById('shimmerFX'); 
    if (!cvs) return; 
    const ctx = cvs.getContext('2d'); 
    let W = 0, H = 0, DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1)); 
    const SCALE = 2; 
    let t = 0; 
    let stars = []; 
    let comets = []; 
    let cometT = 0; 
    const isReduced = () => document.documentElement.getAttribute('data-motion') === 'reduced'; 
    function resize() { W = innerWidth; H = innerHeight; cvs.style.width = W + 'px'; cvs.style.height = H + 'px'; cvs.width = Math.ceil(W / SCALE) * DPR; cvs.height = Math.ceil(H / SCALE) * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.imageSmoothingEnabled = false; seedStars(); } 
    function seedStars() { const base = Math.max(120, Math.round((W * H) / 18000)); const count = Math.round(base * (isReduced() ? 0.5 : 1)); stars = Array.from({ length: count }, () => ({ x: Math.random() * W, y: Math.random() * H, tw: Math.random() * Math.PI * 2, s: (Math.random() * 2 + 0.6), hue: Math.random() < 0.18 ? 'orange' : 'blue' })); } 
    function drawNebula() { const cols = Math.ceil(W / (SCALE * 7)), rows = Math.ceil(H / (SCALE * 7)); for (let yy = 0; yy < rows; yy++) { for (let xx = 0; xx < cols; xx++) { const wv = Math.sin((xx + yy + t) * 0.14) * 0.5 + Math.sin((xx * 0.34 - yy * 0.22 + t * 0.9)) * 0.5; const a = (isReduced() ? 0.08 : 0.10) + (wv + 1) * (isReduced() ? 0.07 : 0.10); const r = 170 + Math.floor((wv + 1) * 60); const g = 140 + Math.floor((1 - wv) * 50); const b = 255; ctx.fillStyle = `rgba(${r},${g},${b},${a})`; ctx.fillRect(xx * 7, yy * 7, 7, 7); } } } 
    function drawStars() { for (const s of stars) { s.tw += isReduced() ? 0.05 : 0.09; const a = (isReduced() ? 0.4 : 0.5) + (Math.sin(s.tw) * (isReduced() ? 0.25 : 0.4) + 0.3); ctx.fillStyle = s.hue === 'orange' ? `rgba(255,180,100,${a*0.9})` : `rgba(170,160,255,${a})`; const size = s.s; ctx.fillRect(Math.round(s.x / SCALE), Math.round(s.y / SCALE), size, size); } } 
    function spawnComet() { if (isReduced()) return; const fromLeft = Math.random() < 0.5; const y = Math.random() * H * 0.9; const x = fromLeft ? -50 : W + 50; const vx = (fromLeft ? 1 : -1) * (2 + Math.random() * 3); const vy = -0.4 + Math.random() * 0.8; comets.push({ x, y, vx, vy, life: 220 }); } 
    function drawComets() { for (let i = comets.length - 1; i >= 0; i--) { const c = comets[i]; c.x += c.vx; c.y += c.vy; c.life -= 1; for (let tix = 0; tix < 6; tix++) { const trailX = c.x - c.vx * tix * 3; const trailY = c.y - c.vy * tix * 3; const alpha = 0.18 - tix * 0.025; if (alpha <= 0) continue; ctx.fillStyle = `rgba(${tix%2?200:150},${tix%2?120:180},255,${alpha})`; ctx.fillRect(Math.round(trailX / SCALE), Math.round(trailY / SCALE), 3, 2); } ctx.fillStyle = 'rgba(255,170,80,0.9)'; ctx.fillRect(Math.round(c.x / SCALE), Math.round(c.y / SCALE), 2, 2); if (c.life <= 0 || c.x < -100 || c.x > W + 100 || c.y < -100 || c.y > H + 100) comets.splice(i, 1); } } 
    function loop() { t += isReduced() ? 0.4 : 0.8; ctx.clearRect(0, 0, cvs.width, cvs.height); const root = document.documentElement; if (root.classList.contains('galaxy-on')) { drawNebula(); drawStars(); drawComets(); if(!isReduced()){ cometT-=16; if(cometT<=0){ cometT = 1500 + Math.random()*2000; spawnComet(); } } } requestAnimationFrame(loop); } 
    window.addEventListener('resize', resize, { passive: true }); 
    document.addEventListener('motion:changed', () => { resize(); }); 
    resize(); 
    loop(); 
})();


// --- Scripts that need to wait for the DOM to be ready ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Page/View Switching Logic ---
    const pageHome = document.getElementById('page-home');
    const pageProjectDetail = document.getElementById('page-project-detail');
    const exploreButtons = document.querySelectorAll('.see-more[data-project-id]');
    const backButton = document.getElementById('back-to-home-btn');
    const navHome = document.getElementById('nav-home');
    const navProjects = document.getElementById('nav-projects');

    const projectData = {
        'cooked': {
            title: '🔥 Cooked!',
            imageSrc: 'Cooked.png',
            description: `Joining BloxByte Games in late 2024, I took on the role of Creative Lead Director for their new project, 'Cooked!'. I was responsible for steering the game's overall creative vision, taking leadership in both 3D asset creation and establishing the definitive art style. A key part of my role involved directing and personally designing the entire user interface to ensure a seamless and intuitive player experience.<br><br>Drawing on over a decade of experience, I helped guide the project from concept to completion in an accelerated timeline of just six months. My workflow involved a suite of professional tools, including Blender for 3D modeling, Pixelmator Pro for graphics, and Roblox Studio as the core development platform. This project was also a fantastic opportunity for growth, as I learned to texture in Procreate on the iPad Pro. I used this new skill to craft the game's standout visual feature: its hyper-realistic dishes. By applying Physically-Based Rendering (PBR) textures, the food was given a detailed, lifelike quality that truly pops on screen.`
        },
        'voyage': {
            title: 'The Voyage',
            imageSrc: 'TheVoyage.png',
            description: 'Provide a description for The Voyage here.'
        },
        'cooked-ui': {
            title: 'Cooked UI',
            imageSrc: 'MainUI.png',
            description: 'Provide a description for the Cooked UI project here.'
        }
    };

    const projectDetailTitle = document.getElementById('project-detail-title');
    const projectDetailImg = document.getElementById('project-detail-img');
    const projectDetailDescription = document.getElementById('project-detail-description');

    function showPage(pageToShow) {
        pageHome.classList.add('hidden');
        pageProjectDetail.classList.add('hidden');
        pageToShow.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    function showProjectDetail(projectId) {
        const data = projectData[projectId];
        if (data) {
            projectDetailTitle.textContent = data.title;
            projectDetailImg.src = data.imageSrc;
            projectDetailImg.alt = `Highlight image for ${data.title}`;
            projectDetailDescription.innerHTML = data.description;
            showPage(pageProjectDetail);
        }
    }

    exploreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = button.dataset.projectId;
            showProjectDetail(projectId);
        });
    });

    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(pageHome);
    });
    
    navHome.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(pageHome);
    });

    navProjects.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(pageHome);
        document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
    });

    // --- Changelog Modal Logic ---
    const CHANGELOG = [{ date: '2025-09-12', title: 'Portfolio Curation', items: ['Simplified the portfolio grid to feature key projects.'] }, { date: '2025-08-31', title: 'Highlights', items: ['Added “Rising Mountains” to Showcases', 'Added “Light House Map” to Projects'] }];
    const clModal = document.getElementById('changelogModal');
    const openBtn = document.getElementById('open-changelog');
    const list = document.getElementById('cl-list');
    const filterSel = document.getElementById('cl-filter');
    const openClModal = () => { clModal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
    const closeClModal = () => { clModal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
    const renderCl = () => { if (!list || !filterSel) return; const y = filterSel.value; list.innerHTML = ''; CHANGELOG.filter(e => y === 'all' || new Date(e.date).getFullYear().toString() === y).forEach(e => { const li = document.createElement('li'); li.className = 'cl-item'; li.innerHTML = `<time datetime="${e.date}">${e.date}</time><h4>${e.title}</h4><ul>${e.items.map(it=>`<li>${it}</li>`).join('')}</ul>`; list.appendChild(li); }); };
    if (openBtn) { openBtn.addEventListener('click', (e) => { e.preventDefault(); renderCl(); openClModal(); }); }
    clModal?.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeClModal));
    filterSel?.addEventListener('change', renderCl);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && clModal?.getAttribute('aria-hidden') === 'false') closeClModal(); });

    // --- Tabs Filter Logic ---
    const tabs = document.querySelectorAll('.tabs .tab'); 
    const cards = document.querySelectorAll('.grid .card'); 
    function applyFilter(filter) { 
        tabs.forEach(t => { 
            const active = t.dataset.filter === filter; 
            t.classList.toggle('is-active', active); 
            t.setAttribute('aria-selected', String(active)); 
        }); 
        cards.forEach(c => { 
            c.style.display = (filter === 'all' || c.dataset.cat === filter) ? '' : 'none'; 
        }); 
    } 
    const initialFilter = document.querySelector('.tabs .tab.is-active')?.dataset.filter || 'all'; 
    applyFilter(initialFilter); 
    tabs.forEach(t => { 
        t.addEventListener('click', () => applyFilter(t.dataset.filter)); 
        t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); applyFilter(t.dataset.filter); } }); 
    }); 
    document.getElementById('view-all')?.addEventListener('click', (e) => { applyFilter('all'); }); 
    
    // --- Logo Easter Egg Logic ---
    const logo = document.getElementById('logoEgg'); 
    const audio = document.getElementById('egg-audio'); 
    const root = document.documentElement;
    if (!logo || !audio) return; 
    audio.volume = 0.6; 
    function onPlay() { root.classList.add('galaxy-on'); root.classList.add('shimmer-on'); }
    function onPause() { root.classList.remove('galaxy-on'); root.classList.remove('shimmer-on'); }
    function toggleAudio() { 
        if (audio.paused) { 
            audio.currentTime = 0; 
            const p = audio.play(); 
            if (p && typeof p.then === 'function') { p.catch(() => {}); } 
        } else { 
            audio.pause(); 
        } 
    } 
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onPause);
    logo.addEventListener('click', toggleAudio); 
    logo.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleAudio(); } }); 
});
