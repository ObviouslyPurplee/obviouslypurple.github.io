// --- Project Detail Modal Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Define Project Data
    const projectData = {
        'cooked': {
            title: '🔥 Cooked!',
            imageSrc: 'Cooked.png',
            description: `Joining BloxByte Games in late 2024, I took on the role of Creative Lead Director for their new project, 'Cooked!'. I was responsible for steering the game's overall creative vision, taking leadership in both 3D asset creation and establishing the definitive art style. A key part of my role involved directing and personally designing the entire user interface to ensure a seamless and intuitive player experience.<br><br>Drawing on over a decade of experience, I helped guide the project from concept to completion in an accelerated timeline of just six months. My workflow involved a suite of professional tools, including Blender for 3D modeling, Pixelmat_pro for graphics, and Roblox Studio as the core development platform. This project was also a fantastic opportunity for growth, as I learned to texture in Procreate on the iPad Pro. I used this new skill to craft the game's standout visual feature: its hyper-realistic dishes. By applying Physically-Based Rendering (PBR) textures, the food was given a detailed, lifelike quality that truly pops on screen.`
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

    // 2. Get References to Modal Elements
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('project-modal-title');
    const modalImage = document.getElementById('project-modal-image');
    const modalDescription = document.getElementById('project-modal-description');
    const exploreButtons = document.querySelectorAll('.see-more[data-project-id]');

    // 3. Functions to Open and Close Modal
    const openModal = () => {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // 4. Attach Event Listeners
    exploreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = button.dataset.projectId;
            const data = projectData[projectId];

            if (data) {
                // Populate modal with data
                modalTitle.textContent = data.title;
                modalImage.src = data.imageSrc;
                modalDescription.innerHTML = data.description; // Use innerHTML to allow <br> tags
                openModal();
            }
        });
    });

    // Close modal listeners
    modal.querySelectorAll('[data-close]').forEach(el => {
        el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
});


// --- Everything below this line is your original code ---

// Fog Gradient FX (slow, subtle) — works in light & dark, motion-aware
(function() {
  if (window.__fogFX) return;
  window.__fogFX = true;
  const cvs = document.getElementById('fogFX');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let W = 0,
    H = 0,
    DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const SCALE = 2; // low-res for gentle pixelation; CSS adds tiny blur
  let last = 0;
  let blobs = [];
  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isReduced = () => document.documentElement.getAttribute('data-motion') === 'reduced';

  function colors() {
    return isDark() ? ['rgba(255,190,220,0.16)', 'rgba(255,190,220,0)'] : ['rgba(255,216,234,0.50)', 'rgba(255,216,234,0)'];
  }

  function seed() {
    blobs.length = 0;
    const base = Math.max(10, Math.round((W * H) / 300000));
    const n = Math.min(22, Math.max(10, Math.round(base * (isReduced() ? 0.7 : 1))));
    for (let i = 0; i < n; i++) {
      const r = 160 + Math.random() * 320; // radius in px
      const ang = Math.random() * Math.PI * 2;
      const spd = (isReduced() ? 0.002 : 0.004) + Math.random() * 0.002; // px/ms
      blobs.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        wob: Math.random() * Math.PI * 2,
        wobAmp: 0.2 + Math.random() * 0.4,
        wobSpd: 0.0003 + Math.random() * 0.0006
      });
    }
  }

  function resize() {
    W = innerWidth;
    H = innerHeight;
    cvs.style.width = W + 'px';
    cvs.style.height = H + 'px';
    cvs.width = Math.ceil(W / SCALE) * DPR;
    cvs.height = Math.ceil(H / SCALE) * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.imageSmoothingEnabled = false;
    seed();
  }

  function draw(dt) {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    const [c0, c1] = colors();
    for (const b of blobs) {
      // movement (very slow)
      const m = isReduced() ? 0.5 : 1;
      b.wob += b.wobSpd * dt * m;
      b.x += b.vx * dt * m + Math.cos(b.wob) * 0.02 * dt; // tiny wobble push
      b.y += b.vy * dt * m + Math.sin(b.wob) * 0.02 * dt;
      const pad = b.r + 40;
      if (b.x < -pad) b.x = W + pad;
      if (b.x > W + pad) b.x = -pad;
      if (b.y < -pad) b.y = H + pad;
      if (b.y > H + pad) b.y = -pad;
      // radial blob
      const cx = b.x / SCALE,
        cy = b.y / SCALE,
        rr = b.r / SCALE;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
      g.addColorStop(0, c0);
      g.addColorStop(1, c1);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop(ts) {
    const dt = Math.min(50, (ts - last) || 16);
    last = ts;
    draw(dt);
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize', resize, {
    passive: true
  });
  document.addEventListener('theme:changed', resize);
  document.addEventListener('motion:changed', resize);
  resize();
  requestAnimationFrame(loop);
})();

// Changelog Modal
document.addEventListener('DOMContentLoaded', function() {
  const CHANGELOG = [{
    date: '2025-09-12',
    title: 'Portfolio Curation',
    items: ['Simplified the portfolio grid to feature key projects: Cooked!, The Voyage, and Cooked UI.']
  }, {
    date: '2025-08-31',
    title: 'Highlights',
    items: ['Added “Rising Mountains” to Showcases', 'Added “Light House Map” to Projects', 'Added “New York Powerhouse (WIP)” to Showcases', 'Added “Ariels Tropic” to Showcases']
  }, {
    date: '2025-08-31',
    title: 'Image viewer',
    items: ['Clicking a highlight image opens a full preview with dimmed background and rounded frame']
  }, {
    date: '2025-08-31',
    title: 'Navigation & categories',
    items: ['Tabs: “other engagements” renamed to “showcases”; added “graphic design” and “other engagements” tabs', 'Cooked UI categorized under “graphic design”', '“view all projects” reveals all highlights']
  }, {
    date: '2025-08-31',
    title: 'Theme',
    items: ['Removed light mode and locked site to dark', 'Removed theme toggle button']
  }, {
    date: '2025-08-31',
    title: 'Background FX',
    items: ['Added subtle gradient fog (blurred, low-res) in both themes; very slow + motion-aware']
  }, {
    date: '2025-08-31',
    title: 'Visual',
    items: ['Removed pixelated cloud background from normal mode', 'Kept galaxy overlay (logo) only; disabled background comets']
  }, {
    date: '2025-08-31',
    title: 'Accessibility',
    items: ['Added reduced-motion support (respects system setting)', 'Calmer effects for reduced-motion users; galaxy mode also respects it']
  }, {
    date: '2025-08-27',
    title: 'FX tuning',
    items: ['Light mode: boosted pink cloud visibility & glitch presence', 'Logo galaxy: brighter nebula/stars + added comets; stronger shimmer in both themes']
  }, {
    date: '2025-08-27',
    title: 'Themes & FX',
    items: ['LIGHT: moving pixelated light-pink clouds + subtle background glitches', 'DARK: static pixelated clouds + vintage TV static/glitch overlay', 'Logo: secret galaxy theme (purple/blue nebula, stars, orange glitches, shimmer) when audio plays']
  }, {
    date: '2025-08-27',
    title: 'Pixel clouds',
    items: ['Restored subtle pixelated pink clouds background with gentle movement', 'Dark mode-aware coloring and performance-friendly rendering']
  }, {
    date: '2025-08-27',
    title: 'Easter egg',
    items: ['Added secret logo audio playback (logoeasteregg.mp3)']
  }, {
    date: '2025-08-27',
    title: 'UI wording',
    items: ['Changed project labels to say “explore” instead of “view project / see more”']
  }, {
    date: '2025-08-27',
    title: 'Highlights UX',
    items: ['Added tap-to-reveal labels on mobile; kept hover on desktop', 'Made labels clickable and positioned left/right', 'Removed “play” label from The Voyage']
  }, {
    date: '2025-08-27',
    title: 'Tabs + Filtering',
    items: ['Tabs now filter projects and added an “all” tab by default']
  }, {
    date: '2025-08-27',
    title: 'Media updates',
    items: ['Hooked up Cooked.png and TheVoyage.png for highlight cards']
  }];
  const modal = document.getElementById('changelogModal');
  const openBtn = document.getElementById('open-changelog');
  const list = document.getElementById('cl-list');
  const filterSel = document.getElementById('cl-filter');

  function open() {
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function yearOf(d) {
    return new Date(d).getFullYear().toString();
  }

  function render() {
    const y = filterSel.value;
    list.innerHTML = '';
    CHANGELOG.filter(e => y === 'all' || yearOf(e.date) === y).forEach(e => {
      const li = document.createElement('li');
      li.className = 'cl-item';
      li.innerHTML = `<time datetime="${e.date}">${e.date}</time><h4>${e.title}</h4><ul>${e.items.map(it=>`<li>${it}</li>`).join('')}</ul>`;
      list.appendChild(li);
    });
  }
  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      render();
      open();
    });
  }
  modal?.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
  filterSel?.addEventListener('change', render);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close();
  });
});

// tabs filter (all/live/projects/other)
(function() {
  const tabs = document.querySelectorAll('.tabs .tab');
  const cards = document.querySelectorAll('.grid .card');

  function apply(filter) {
    tabs.forEach(t => {
      const active = t.dataset.filter === filter;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
    });
    cards.forEach(c => {
      c.style.display = (filter === 'all' || c.dataset.cat === filter) ? '' : 'none';
    });
  }
  const initial = document.querySelector('.tabs .tab.is-active')?.dataset.filter || 'all';
  apply(initial);
  tabs.forEach(t => {
    t.addEventListener('click', () => apply(t.dataset.filter));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        apply(t.dataset.filter);
      }
    });
  });
  document.getElementById('view-all')?.addEventListener('click', (e) => {
    apply('all');
  });
})();

// Highlight image lightbox (open on image click, ESC/Backdrop to close)
(function() {
  const modal = document.getElementById('imgModal');
  const imgEl = document.getElementById('imgModalImg');
  if (!modal || !imgEl) return;

  function parseURL(bg) {
    const m = /url\((?:\"|')?([^\"')]+)(?:\"|')?\)/.exec(bg || '');
    return m ? m[1] : null;
  }

  function open(url) {
    if (!url) return;
    imgEl.src = url;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.setAttribute('aria-hidden', 'true');
    imgEl.removeAttribute('src');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.shot.has-img').forEach(shot => {
    shot.addEventListener('click', (e) => {
      if (e.target.closest('.labels') || e.target.closest('a')) return; // don’t intercept buttons
      const url = parseURL(shot.style.backgroundImage);
      open(url);
    });
  });
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close();
  });
})();

// Logo Easter Egg Audio
(function() {
  const logo = document.getElementById('logoEgg');
  const audio = document.getElementById('egg-audio');
  if (!logo || !audio) return;
  audio.volume = 0.6; // gentle volume
  function toggle() {
    if (audio.paused) {
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.then === 'function') {
        p.catch(() => {});
      }
      logo.classList.add('egg-playing');
    } else {
      audio.pause();
      logo.classList.remove('egg-playing');
    }
  }
  logo.addEventListener('click', toggle);
  logo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
})();

// Theme mode: locked to dark — light mode removed
(function() {
  const root = document.documentElement;
  root.setAttribute('data-theme', 'dark');
  try {
    localStorage.setItem('theme', 'dark');
  } catch (_) {}
  document.querySelector('.theme-toggle')?.remove();
})();

// Motion preference: automatic (respects system setting); no UI toggle
(function() {
  const root = document.documentElement;
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  function apply() {
    const mode = mq.matches ? 'reduced' : 'normal';
    root.setAttribute('data-motion', mode);
    document.dispatchEvent(new CustomEvent('motion:changed', {
      detail: {
        mode
      }
    }));
  }
  apply();
  try {
    mq.addEventListener('change', apply);
  } catch (_) {
    mq.addListener && mq.addListener(apply);
  }
})();

// Shimmer/Galaxy FX overlay on #shimmerFX (v3 — motion-aware & brighter)
(function() {
  if (window.__shimmerFX3) return;
  window.__shimmerFX3 = true;
  const cvs = document.getElementById('shimmerFX');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let W = 0,
    H = 0,
    DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const SCALE = 2;
  let t = 0;
  let stars = [];
  let glitchT = 0;
  let comets = [];
  let cometT = 0;
  const isReduced = () => document.documentElement.getAttribute('data-motion') === 'reduced';

  function resize() {
    W = innerWidth;
    H = innerHeight;
    cvs.style.width = W + 'px';
    cvs.style.height = H + 'px';
    cvs.width = Math.ceil(W / SCALE) * DPR;
    cvs.height = Math.ceil(H / SCALE) * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.imageSmoothingEnabled = false;
    seedStars();
  }

  function seedStars() {
    const base = Math.max(120, Math.round((W * H) / 18000));
    const count = Math.round(base * (isReduced() ? 0.5 : 1));
    stars = Array.from({
      length: count
    }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      tw: Math.random() * Math.PI * 2,
      s: (Math.random() * 2 + 0.6),
      hue: Math.random() < 0.18 ? 'orange' : 'blue'
    }));
  }

  function drawNebula() {
    const cols = Math.ceil(W / (SCALE * 7)),
      rows = Math.ceil(H / (SCALE * 7));
    for (let yy = 0; yy < rows; yy++) {
      for (let xx = 0; xx < cols; xx++) {
        const wv = Math.sin((xx + yy + t) * 0.14) * 0.5 + Math.sin((xx * 0.34 - yy * 0.22 + t * 0.9)) * 0.5;
        const a = (isReduced() ? 0.08 : 0.10) + (wv + 1) * (isReduced() ? 0.07 : 0.10);
        const r = 170 + Math.floor((wv + 1) * 60);
        const g = 140 + Math.floor((1 - wv) * 50);
        const b = 255;
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fillRect(xx * 7, yy * 7, 7, 7);
      }
    }
  }

  function drawStars() {
    for (const s of stars) {
      s.tw += isReduced() ? 0.05 : 0.09;
      const a = (isReduced() ? 0.4 : 0.5) + (Math.sin(s.tw) * (isReduced() ? 0.25 : 0.4) + 0.3);
      ctx.fillStyle = s.hue === 'orange' ? `rgba(255,180,100,${a*0.9})` : `rgba(170,160,255,${a})`;
      const size = s.s;
      ctx.fillRect(Math.round(s.x / SCALE), Math.round(s.y / SCALE), size, size);
    }
  }

  function spawnComet() {
    if (isReduced()) return;
    const fromLeft = Math.random() < 0.5;
    const y = Math.random() * H * 0.9;
    const x = fromLeft ? -50 : W + 50;
    const vx = (fromLeft ? 1 : -1) * (2 + Math.random() * 3);
    const vy = -0.4 + Math.random() * 0.8;
    comets.push({
      x,
      y,
      vx,
      vy,
      life: 220
    });
  }

  function drawComets() {
    for (let i = comets.length - 1; i >= 0; i--) {
      const c = comets[i];
      c.x += c.vx;
      c.y += c.vy;
      c.life -= 1;
      for (let tix = 0; tix < 6; tix++) {
        const trailX = c.x - c.vx * tix * 3;
        const trailY = c.y - c.vy * tix * 3;
        const alpha = 0.18 - tix * 0.025;
        if (alpha <= 0) continue;
        ctx.fillStyle = `rgba(${tix%2?200:150},${tix%2?120:180},255,${alpha})`;
        ctx.fillRect(Math.round(trailX / SCALE), Math.round(trailY / SCALE), 3, 2);
      }
      ctx.fillStyle = 'rgba(255,170,80,0.9)';
      ctx.fillRect(Math.round(c.x / SCALE), Math.round(c.y / SCALE), 2, 2);
      if (c.life <= 0 || c.x < -100 || c.x > W + 100 || c.y < -100 || c.y > H + 100) comets.splice(i, 1);
    }
  }

  function drawOrangeGlitch(dt) {
    if (isReduced()) return;
    glitchT -= dt;
    if (glitchT > 0) return;
    glitchT = 900 + Math.random() * 1200;
    const y = (Math.random() * H) | 0,
      h = 6 + ((Math.random() * 20) | 0),
      shift = (Math.random() > 0.5 ? 1 : -1) * (8 + ((Math.random() * 24) | 0));
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = 'rgba(255,150,70,1)';
    ctx.fillRect(shift, y, W, h);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = 'rgba(120,180,255,1)';
    ctx.fillRect(shift * 0.5, y + 2, W, h - 2);
    ctx.restore();
  }

  function drawShimmer() {
    const cols = Math.ceil(W / (SCALE * 8)),
      rows = Math.ceil(H / (SCALE * 8));
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const wv = Math.sin((x + y + t) * 0.14) * 0.5 + Math.sin((x * 0.32 - y * 0.24 + t * 0.9)) * 0.5;
        const a = (isReduced() ? 0.08 : 0.10) + (wv + 1) * (isReduced() ? 0.07 : 0.10);
        const r = 190 + Math.floor((wv + 1) * 35);
        const g = 160 + Math.floor((1 - wv) * 30);
        const b = 255;
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fillRect(x * 8, y * 8, 8, 8);
      }
    }
  }

  function loop() {
    t += isReduced() ? 0.4 : 0.8;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    const root = document.documentElement;
    if (root.classList.contains('galaxy-on')) {
      drawNebula();
      drawStars();
      drawComets();
      drawOrangeGlitch(16);
      if (!isReduced()) {
        cometT -= 16;
        if (cometT <= 0) {
          cometT = 1500 + Math.random() * 2000;
          spawnComet();
        }
      }
    } else if (root.classList.contains('shimmer-on')) {
      drawShimmer();
    }
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize', resize, {
    passive: true
  });
  document.addEventListener('motion:changed', () => {
    resize();
  });
  resize();
  loop();
})();

// Bind secret galaxy theme to logo audio play/pause
(function() {
  if (window.__logoGalaxy) return;
  window.__logoGalaxy = true;
  const audio = document.getElementById('egg-audio');
  const logo = document.getElementById('logoEgg');
  const root = document.documentElement;

  function onPlay() {
    root.classList.add('galaxy-on');
    root.classList.add('shimmer-on');
  }

  function onPause() {
    root.classList.remove('galaxy-on');
    root.classList.remove('shimmer-on');
  }
  if (audio) {
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onPause);
  }
  if (!audio && logo) {
    logo.addEventListener('click', () => root.classList.toggle('galaxy-on'));
  }
})();

// Shot image fallback: try primary, then fallback if missing (so GitHub naming differences don't break cards)
(function() {
  const shots = document.querySelectorAll('.shot[data-src-primary]');
  shots.forEach(shot => {
    const primary = shot.getAttribute('data-src-primary');
    const fallback = shot.getAttribute('data-src-fallback');
    if (!primary) return;
    const img = new Image();
    img.onload = () => {
      shot.style.backgroundImage = `url('${primary}')`;
    };
    img.onerror = () => {
      if (fallback) {
        shot.style.backgroundImage = `url('${fallback}')`;
      }
    };
    img.src = primary;
  });
})();

// Image‑reactive glass buttons — match card image and sample color
(function() {
  const shots = document.querySelectorAll('.shot.has-img');
  const cache = new Map(); // url -> {img,w,h,ready,canvas,cctx}
  function parseURL(bg) {
    const m = /url\((?:\"|')?([^\"')]+)(?:\"|')?\)/.exec(bg || '');
    return m ? m[1] : null;
  }

  function setupShot(shot) {
    const url = parseURL(shot.style.backgroundImage);
    if (!url) return;
    let entry = cache.get(url);
    if (!entry) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      entry = {
        img,
        ready: false
      };
      cache.set(url, entry);
      img.onload = () => {
        entry.ready = true;
        entry.w = img.naturalWidth;
        entry.h = img.naturalHeight;
        entry.canvas = document.createElement('canvas');
        entry.canvas.width = entry.w;
        entry.canvas.height = entry.h;
        entry.cctx = entry.canvas.getContext('2d');
        entry.cctx.drawImage(img, 0, 0);
        positionButtons(shot, entry);
      };
    } else if (entry.ready) {
      positionButtons(shot, entry);
    }
  }

  function positionButtons(shot, entry) {
    const rectS = shot.getBoundingClientRect();
    const sw = rectS.width,
      sh = rectS.height;
    const scale = Math.max(sw / entry.w, sh / entry.h);
    const drawW = entry.w * scale,
      drawH = entry.h * scale;
    const offX = (sw - drawW) / 2,
      offY = (sh - drawH) / 2;
    const size = `${drawW}px ${drawH}px`;
    shot.querySelectorAll('.see-more');
  }
})();
