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
    const CHANGELOG = [{ date: '2025-09-12', title: 'Portfolio Curation', items: ['Simplified the portfolio grid to feature key projects: Cooked!, The Voyage, and Cooked UI.'] }, { date: '2025-08-31', title: 'Highlights', items: ['Added “Rising Mountains” to Showcases', 'Added “Light House Map” to Projects', 'Added “New York Powerhouse (WIP)” to Showcases', 'Added “Ariels Tropic” to Showcases'] }, { date: '2025-08-31', title: 'Image viewer', items: ['Clicking a highlight image opens a full preview with dimmed background and rounded frame'] }, { date: '2025-08-31', title: 'Navigation & categories', items: ['Tabs: “other engagements” renamed to “showcases”; added “graphic design” and “other engagements” tabs', 'Cooked UI categorized under “graphic design”', '“view all projects” reveals all highlights'] }, { date: '2025-08-31', title: 'Theme', items: ['Removed light mode and locked site to dark', 'Removed theme toggle button'] }];
    const clModal = document.getElementById('changelogModal');
    const openBtn = document.getElementById('open-changelog');
    const list = document.getElementById('cl-list');
    const filterSel = document.getElementById('cl-filter');
    const openClModal = () => { clModal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
    const closeClModal = () => { clModal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
    const yearOf = (d) => new Date(d).getFullYear().toString();
    const renderCl = () => { if (!list || !filterSel) return; const y = filterSel.value; list.innerHTML = ''; CHANGELOG.filter(e => y === 'all' || yearOf(e.date) === y).forEach(e => { const li = document.createElement('li'); li.className = 'cl-item'; li.innerHTML = `<time datetime="${e.date}">${e.date}</time><h4>${e.title}</h4><ul>${e.items.map(it=>`<li>${it}</li>`).join('')}</ul>`; list.appendChild(li); }); };
    if (openBtn) { openBtn.addEventListener('click', (e) => { e.preventDefault(); renderCl(); openClModal(); }); }
    clModal?.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeClModal));
    filterSel?.addEventListener('change', renderCl);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && clModal?.getAttribute('aria-hidden') === 'false') closeClModal(); });

    // --- Original Scripts from index.html ---
    (function() { const tabs = document.querySelectorAll('.tabs .tab'); const cards = document.querySelectorAll('.grid .card'); function apply(filter) { tabs.forEach(t => { const active = t.dataset.filter === filter; t.classList.toggle('is-active', active); t.setAttribute('aria-selected', String(active)); }); cards.forEach(c => { c.style.display = (filter === 'all' || c.dataset.cat === filter) ? '' : 'none'; }); } const initial = document.querySelector('.tabs .tab.is-active')?.dataset.filter || 'all'; apply(initial); tabs.forEach(t => { t.addEventListener('click', () => apply(t.dataset.filter)); t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); apply(t.dataset.filter); } }); }); document.getElementById('view-all')?.addEventListener('click', (e) => { apply('all'); }); })();
    (function() { const logo = document.getElementById('logoEgg'); const audio = document.getElementById('egg-audio'); if (!logo || !audio) return; audio.volume = 0.6; function toggle() { if (audio.paused) { audio.currentTime = 0; const p = audio.play(); if (p && typeof p.then === 'function') { p.catch(() => {}); } logo.classList.add('egg-playing'); } else { audio.pause(); logo.classList.remove('egg-playing'); } } logo.addEventListener('click', toggle); logo.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }); })();
    (function() { const shots = document.querySelectorAll('.shot[data-src-primary]'); shots.forEach(shot => { const primary = shot.getAttribute('data-src-primary'); const fallback = shot.getAttribute('data-src-fallback'); if (!primary) return; const img = new Image(); img.onload = () => { shot.style.backgroundImage = `url('${primary}')`; }; img.onerror = () => { if (fallback) { shot.style.backgroundImage = `url('${fallback}')`; } }; img.src = primary; }); })();
});

// --- Scripts that run immediately and don't need the DOM ---
(function() { const root = document.documentElement; root.setAttribute('data-theme', 'dark'); try { localStorage.setItem('theme', 'dark'); } catch (_) {} })();
(function() { const root = document.documentElement; const mq = window.matchMedia('(prefers-reduced-motion: reduce)'); function apply() { const mode = mq.matches ? 'reduced' : 'normal'; root.setAttribute('data-motion', mode); document.dispatchEvent(new CustomEvent('motion:changed', { detail: { mode } })); } apply(); try { mq.addEventListener('change', apply); } catch (_) { mq.addListener && mq.addListener(apply); } })();
(function() { if (window.__logoGalaxy) return; window.__logoGalaxy = true; const audio = document.getElementById('egg-audio'); const logo = document.getElementById('logoEgg'); const root = document.documentElement; function onPlay() { root.classList.add('galaxy-on'); root.classList.add('shimmer-on'); } function onPause() { root.classList.remove('galaxy-on'); root.classList.remove('shimmer-on'); } if (audio) { audio.addEventListener('play', onPlay); audio.addEventListener('pause', onPause); audio.addEventListener('ended', onPause); } if (!audio && logo) { logo.addEventListener('click', () => root.classList.toggle('galaxy-on')); } })();
