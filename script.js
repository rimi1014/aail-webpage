// ── PAGE SWITCHING ───────────────────────────────────────────
const navbar  = document.getElementById('navbar');
const pages   = document.querySelectorAll('.page');
const navTabs = document.querySelectorAll('.nav-tab');

function switchPage(targetId, pushHistory) {
  if (pushHistory === undefined) pushHistory = true;

  pages.forEach(p => p.classList.remove('active'));
  const target = document.getElementById(targetId);
  if (!target) return;
  target.classList.add('active');

  // Always scroll to top on page switch
  window.scrollTo(0, 0);

  // Navbar: transparent only on home, always dark on other pages
  if (targetId === 'page-home') {
    navbar.classList.remove('scrolled');
  } else {
    navbar.classList.add('scrolled');
  }

  // Highlight active nav link
  navTabs.forEach(tab => {
    const isActive = tab.dataset.target === targetId;
    tab.classList.toggle('nav-active', isActive);
  });

  // Trigger fade-in for elements in this page
  const fadeEls = target.querySelectorAll('.fade-in');
  fadeEls.forEach((el, i) => {
    el.classList.remove('visible');
    setTimeout(() => el.classList.add('visible'), i * 70);
  });
  setTimeout(() => observeFadeIns(target), 50);

  // Resize hero canvas when returning to home
  if (targetId === 'page-home') {
    setTimeout(resizeCanvas, 10);
  }

  // Reset Research to overview
  if (targetId === 'page-research') {
    const overview = document.getElementById('research-overview');
    const detail   = document.getElementById('research-detail-view');
    if (overview) overview.style.display = 'block';
    if (detail)   detail.style.display   = 'none';
  }

  // Reset Members to PI tab
  if (targetId === 'page-members') {
    switchMemberPanel('pi');
  }

  // Reset Publications to All filter
  if (targetId === 'page-publications') {
    document.querySelectorAll('#page-publications .pub-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.filter === 'all'));
    document.querySelectorAll('.pub-year-group').forEach(g => g.classList.remove('hidden'));
    document.querySelectorAll('.pub-item').forEach(i => i.classList.remove('hidden'));
  }

  // Update URL hash without scrolling
  if (pushHistory) {
    const hash = targetId.replace('page-', '');
    history.pushState({ page: targetId }, '', hash === 'home' ? '#' : '#' + hash);
  }
}

// nav-tab clicks handled via delegation (see below, after navLinks declaration)

// Handle browser back/forward
window.addEventListener('popstate', e => {
  const page = e.state?.page || 'page-home';
  switchPage(page, false);
});

// ── NAVBAR SCROLL (home page only) ──────────────────────────
window.addEventListener('scroll', () => {
  const homePage = document.getElementById('page-home');
  if (homePage.classList.contains('active')) {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
}, { passive: true });

// ── SCROLL-TRIGGERED ANIMATIONS ─────────────────────────────
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = (parseInt(el.dataset.delay) || 0) * 120;
      setTimeout(() => el.classList.add('visible'), delay);
      scrollObserver.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function observeFadeIns(root) {
  root.querySelectorAll('.fade-in').forEach(el => {
    if (!el.classList.contains('visible')) scrollObserver.observe(el);
  });
}
observeFadeIns(document.querySelector('.page.active') || document.body);

// ── GO TO TOP ────────────────────────────────────────────────
const goTopBtn = document.getElementById('go-top');
window.addEventListener('scroll', () => {
  goTopBtn.classList.toggle('visible', window.scrollY > 200);
}, { passive: true });
goTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── HAMBURGER MENU ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Delegate all .nav-tab[data-target] clicks (covers navbar + page content)
document.body.addEventListener('click', e => {
  const tab = e.target.closest('.nav-tab[data-target]');
  if (tab) {
    e.preventDefault();
    switchPage(tab.dataset.target);
    // Close all dropdowns
    document.querySelectorAll('.has-dropdown').forEach(li => li.classList.remove('open'));
    navLinks.classList.remove('open');
    return;
  }
  // Click on nav item area (outside the <a>) — toggle dropdown
  const li = e.target.closest('.has-dropdown');
  if (li && li.closest('#navbar')) {
    const isOpen = li.classList.contains('open');
    document.querySelectorAll('.has-dropdown').forEach(el => el.classList.remove('open'));
    if (!isOpen) li.classList.add('open');
    return;
  }
  // Click anywhere else — close all dropdowns
  document.querySelectorAll('.has-dropdown').forEach(el => el.classList.remove('open'));
});

// ── HERO SCROLL HINT ─────────────────────────────────────────
const heroScrollHint = document.getElementById('hero-scroll-hint');
if (heroScrollHint) {
  heroScrollHint.addEventListener('click', () => {
    const teaserSection = document.querySelector('#page-home .teaser-section');
    if (teaserSection) teaserSection.scrollIntoView({ behavior: 'smooth' });
  });
}

// ── HERO CANVAS (star-field) ─────────────────────────────────
const canvas = document.getElementById('hero-canvas');
const ctx    = canvas.getContext('2d');
const stars  = [];
const STAR_COUNT = 200;
let animFrameId;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStar() {
  const roll = Math.random();
  let r, da;
  if (roll < 0.12) {
    r  = Math.random() * 1.2 + 1.8;
    da = (Math.random() - 0.5) * 0.010;
  } else if (roll < 0.50) {
    r  = Math.random() * 0.6 + 0.8;
    da = (Math.random() - 0.5) * 0.005;
  } else {
    r  = Math.random() * 0.55 + 0.15;
    da = (Math.random() - 0.5) * 0.003;
  }
  return {
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    r, a: Math.random(), da,
    vx: (Math.random() - 0.5) * 0.08,
    vy: (Math.random() - 0.5) * 0.08,
  };
}

function initCanvas() {
  resizeCanvas();
  stars.length = 0;
  for (let i = 0; i < STAR_COUNT; i++) stars.push(createStar());
}

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(s => {
    s.x += s.vx;
    s.y += s.vy;
    s.a += s.da;
    s.a = Math.max(0.05, Math.min(1, s.a));
    if (s.a <= 0.05 || s.a >= 1) s.da *= -1;
    if (s.x < 0) s.x = canvas.width;
    if (s.x > canvas.width) s.x = 0;
    if (s.y < 0) s.y = canvas.height;
    if (s.y > canvas.height) s.y = 0;

    // Glow halo for larger stars
    if (s.r > 1.4) {
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
      glow.addColorStop(0, `rgba(255,255,255,${s.a * 0.22})`);
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Core dot
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.a})`;
    ctx.fill();

    // Cross sparkle for the brightest large stars
    if (s.r > 2.2) {
      ctx.strokeStyle = `rgba(255,255,255,${s.a * 0.5})`;
      ctx.lineWidth = 0.5;
      const len = s.r * 4;
      ctx.beginPath();
      ctx.moveTo(s.x - len, s.y); ctx.lineTo(s.x + len, s.y);
      ctx.moveTo(s.x, s.y - len); ctx.lineTo(s.x, s.y + len);
      ctx.stroke();
    }
  });

  // Accent glow — top-right (blue)
  const grd = ctx.createRadialGradient(
    canvas.width * 0.85, canvas.height * 0.15, 0,
    canvas.width * 0.85, canvas.height * 0.15, canvas.width * 0.45
  );
  grd.addColorStop(0, 'rgba(74,159,212,0.18)');
  grd.addColorStop(1, 'rgba(74,159,212,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Accent glow — bottom-left (warm gold)
  const grd2 = ctx.createRadialGradient(
    canvas.width * 0.12, canvas.height * 0.88, 0,
    canvas.width * 0.12, canvas.height * 0.88, canvas.width * 0.38
  );
  grd2.addColorStop(0, 'rgba(200,168,107,0.10)');
  grd2.addColorStop(1, 'rgba(200,168,107,0)');
  ctx.fillStyle = grd2;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  animFrameId = requestAnimationFrame(drawCanvas);
}

window.addEventListener('resize', () => {
  resizeCanvas();
});

initCanvas();
drawCanvas();

// ── RESEARCH AREAS DATA ───────────────────────────────────────
const RESEARCH_AREAS = [
  {
    title: "Safe Control under Uncertainty",
    image: "images/safe-control.png",
    tags: ["CBF", "Robust Control", "Safety Guarantees"],
    lead: "We develop provably safe control algorithms that maintain stability and satisfy safety constraints even when the system model is uncertain or subject to external disturbances.",
    body: "Safety-critical control is at the heart of autonomous aerospace systems. Our work combines Control Barrier Functions with robust and adaptive techniques to handle real-world disturbances while maintaining desired performance bounds. By fusing Lyapunov-based stability analysis with set-invariance theory, we construct controllers that provide formal safety certificates valid under a wide class of model uncertainties.",
    topics: ["Control Barrier Functions (CBF)", "Lyapunov-Based Stability Analysis", "Robust and Adaptive Control", "Input-to-State Safety (ISSf)", "QP-Based Safety Filters"]
  },
  {
    title: "Learning-Based Guidance and Control",
    image: "images/learning-gnc.png",
    tags: ["Adaptive Control", "Meta-Learning", "Neural Control"],
    lead: "We integrate machine learning with classical guidance and control frameworks to develop intelligent, adaptive aerospace systems that generalize across mission scenarios.",
    body: "Classical control methods often require precise system models that are difficult to obtain in practice. Our research integrates meta-learning and neural network architectures with proven control-theoretic frameworks, enabling systems to adapt rapidly to changing environments and mission conditions while preserving safety and performance guarantees.",
    topics: ["Meta-Learning for Fast Adaptation", "Neural Network-Based Controllers", "Online Model Learning", "Adaptive Guidance Laws", "Imitation and Reinforcement Learning"]
  },
  {
    title: "Optimization for Aerospace Systems",
    image: "images/opti-aero.png",
    tags: ["Optimal Control", "Trajectory Optimization", "NLP"],
    lead: "We formulate and solve optimal control and trajectory planning problems for complex aerospace missions, from powered descent to spacecraft rendezvous and proximity operations.",
    body: "Trajectory optimization is fundamental to aerospace mission design. We develop efficient numerical methods and real-time capable algorithms — including Sequential Convex Programming and direct collocation — to tackle the nonlinear, constrained problems that arise in powered descent guidance, orbital transfers, and multi-vehicle coordination.",
    topics: ["Sequential Convex Programming (SCP)", "Pontryagin Minimum Principle", "Real-Time Trajectory Optimization", "Fuel-Optimal Control", "Nonlinear Programming (NLP)"]
  },
  {
    title: "Autonomous Aerospace Systems",
    image: "images/autonomous-aero.png",
    tags: ["GNC", "UAV", "Spacecraft"],
    lead: "We design end-to-end autonomous GNC pipelines for UAVs, spacecraft, and other aerospace vehicles operating in complex and uncertain environments.",
    body: "Achieving full autonomy in aerospace requires tight integration of guidance, navigation, and control subsystems. Our research spans from quadrotor UAV autonomy to spacecraft proximity operations and planetary landing, developing architectures that are robust to sensor noise, communication delays, and environmental uncertainty.",
    topics: ["Autonomous UAV Control", "Spacecraft Proximity Operations", "Sense-and-Avoid Systems", "Mission Planning and Scheduling", "Hardware-in-the-Loop Testing"]
  },
  {
    title: "Assured Aerospace Intelligence",
    image: "images/assured-ai.png",
    tags: ["Scientific ML", "Verification", "Trustworthy AI"],
    lead: "We investigate methods to ensure AI-enabled aerospace systems are verifiable, interpretable, and reliably safe for deployment in safety-critical applications.",
    body: "As AI increasingly enters safety-critical aerospace applications, ensuring its reliability becomes paramount. We develop physics-informed neural networks, formal verification techniques for learned controllers, and certification methods for neural network-based decision systems — bridging the gap between data-driven performance and engineering safety standards.",
    topics: ["Physics-Informed Neural Networks", "Formal Verification of Neural Controllers", "Neural Network Certification", "Interpretable Machine Learning", "Safe Reinforcement Learning"]
  }
];

// ── RENDER: RESEARCH GRID ─────────────────────────────────────
function renderResearchGrid() {
  const grid = document.getElementById('research-img-grid');
  if (!grid) return;

  grid.innerHTML = RESEARCH_AREAS.map((area, i) => `
    <div class="research-img-card" data-delay="${i}" onclick="openResearchDetail(${i})">
      <div class="research-img-bg" style="background-image: url('${area.image}')"></div>
      <div class="research-img-overlay"></div>
      <div class="research-img-content">
        <div class="research-img-tags">
          ${area.tags.map(t => `<span class="research-img-tag">${t}</span>`).join('')}
        </div>
        <h3 class="research-img-title">${area.title}</h3>
      </div>
    </div>
  `).join('');
}

function openResearchDetail(index) {
  const area = RESEARCH_AREAS[index];
  if (!area) return;

  document.getElementById('research-overview').style.display = 'none';
  const detailView = document.getElementById('research-detail-view');
  detailView.style.display = 'block';

  detailView.innerHTML = `
    <div class="research-detail-banner" style="background-image: url('${area.image}')">
      <div class="research-detail-banner-overlay"></div>
      <div class="research-detail-banner-content">
        <button class="research-back-btn" onclick="closeResearchDetail()">← All Research</button>
        <h1 class="research-detail-title">${area.title}</h1>
        <div class="research-detail-tags">
          ${area.tags.map(t => `<span class="research-detail-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <div class="research-detail-body">
          <p class="research-detail-lead">${area.lead}</p>
          <p class="research-detail-text">${area.body}</p>
          <h3 class="research-detail-topics-title">Key Research Topics</h3>
          <ul class="research-topics-list">
            ${area.topics.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>
      </div>
    </section>
  `;

  window.scrollTo(0, 0);
}

function closeResearchDetail() {
  document.getElementById('research-detail-view').style.display = 'none';
  document.getElementById('research-overview').style.display = 'block';
  window.scrollTo(0, 0);
  setTimeout(() => observeFadeIns(document.getElementById('research-overview')), 50);
}

// ── RENDER: PUBLICATIONS ─────────────────────────────────────
function renderPublications() {
  const container = document.getElementById('pub-list');
  if (!container || typeof PUBLICATIONS === 'undefined') return;

  // Group by (type, year)
  const groupMap = {};
  PUBLICATIONS.forEach(pub => {
    const key = pub.type + '__' + pub.year;
    if (!groupMap[key]) groupMap[key] = { type: pub.type, year: pub.year, items: [] };
    groupMap[key].items.push(pub);
  });

  // Sort: preprints first, then journals desc, then conferences desc
  const typeOrder = { preprint: 0, journal: 1, conference: 2 };
  const groups = Object.values(groupMap).sort((a, b) => {
    if (a.type !== b.type) return typeOrder[a.type] - typeOrder[b.type];
    if (a.year === 'Preprints') return -1;
    if (b.year === 'Preprints') return  1;
    return parseInt(b.year) - parseInt(a.year);
  });

  const labelMap = { journal: 'Journal', conference: 'Conference', preprint: 'Preprint' };

  function getPubUrl(pub) {
    if (pub.url) return pub.url;
    const arxiv = pub.venue.match(/arXiv:(\d+\.\d+)/);
    if (arxiv) return 'https://arxiv.org/abs/' + arxiv[1];
    return 'https://scholar.google.com/scholar?q=' + encodeURIComponent(pub.title);
  }

  container.innerHTML = groups.map(group => `
    <div class="pub-year-group" data-type="${group.type}">
      <div class="pub-year-label">${group.year}</div>
      ${group.items.map(pub => {
        const url = getPubUrl(pub);
        const titleEl = url
          ? `<a href="${url}" target="_blank" rel="noopener" class="pub-title">${pub.title}</a>`
          : `<p class="pub-title">${pub.title}</p>`;
        return `
        <div class="pub-item fade-in" data-type="${pub.type}">
          <div class="pub-badge ${pub.type}">${labelMap[pub.type]}</div>
          <div class="pub-content">
            ${titleEl}
            <p class="pub-authors">${pub.authors}</p>
            <p class="pub-venue">${pub.venue}</p>
          </div>
        </div>`;
      }).join('')}
    </div>
  `).join('');
}

// ── RENDER: MEMBERS ───────────────────────────────────────────
function memberCardHtml(m, avatarKey, defaultRole) {
  const hasPhoto = !!m.photo;
  const photoHtml = hasPhoto
    ? `<img src="${m.photo}" alt="${m.name}" class="member-photo"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />`
    : '';
  const avatarStyle = hasPhoto ? ' style="display:none"' : '';
  const interestsHtml = (m.interests && m.interests.length > 0)
    ? `<div class="member-interests">${m.interests.map(i =>
        `<span class="member-interest-tag">${i}</span>`).join('')}</div>`
    : '';
  return `
    <div class="member-card ${m.highlight ? 'member-card-highlight' : ''}">
      <div class="member-photo-wrap">
        ${photoHtml}
        <div class="member-avatar avatar-${avatarKey}"${avatarStyle}>${m.initials}</div>
      </div>
      <div class="member-info">
        <p class="member-name">${m.name}</p>
        <p class="member-role">${m.role || defaultRole}</p>
        ${m.note ? `<p class="member-note">${m.note}</p>` : ''}
        ${interestsHtml}
      </div>
    </div>
  `;
}

function renderMembers() {
  if (typeof MEMBERS === 'undefined') return;

  // Students panel: SNU only
  const studentsContainer = document.getElementById('students-container');
  if (studentsContainer) {
    const studentGroups = [
      { label: 'PhD Students', members: MEMBERS.snu?.phd || [], avatarKey: 'phd', defaultRole: 'PhD Student' },
      { label: 'MSc Students', members: MEMBERS.snu?.msc || [], avatarKey: 'msc', defaultRole: 'MSc Student' },
      { label: 'BSc Students', members: MEMBERS.snu?.bsc || [], avatarKey: 'bsc', defaultRole: 'BSc Student' },
    ].filter(g => g.members.length > 0);

    studentsContainer.innerHTML = studentGroups.map(group => `
      <div class="members-group fade-in">
        <h3 class="members-group-title">${group.label}</h3>
        <div class="members-subgroup">
          <div class="members-grid">
            ${group.members.map(m => memberCardHtml(m, group.avatarKey, group.defaultRole)).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  // Alumni panel: Cranfield co-supervised
  const alumniContainer = document.getElementById('alumni-container');
  if (alumniContainer) {
    const alumniMembers = MEMBERS.cranfield?.phd || [];
    alumniContainer.innerHTML = alumniMembers.length > 0
      ? `<div class="members-group fade-in">
          <h3 class="members-group-title">PhD Alumni <span class="members-group-note">(Co-supervised, Cranfield University)</span></h3>
          <div class="members-subgroup">
            <div class="members-grid">
              ${alumniMembers.map(m => memberCardHtml(m, 'phd', 'PhD Alumni')).join('')}
            </div>
          </div>
        </div>`
      : '<p style="color:var(--text-lt);font-size:.9rem;padding:16px 0;">No alumni records yet.</p>';
  }
}

// ── MEMBER PANEL SWITCHING ────────────────────────────────────
function switchMemberPanel(panelId) {
  document.querySelectorAll('.member-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.panel === panelId));
  document.querySelectorAll('.member-panel').forEach(p =>
    p.classList.toggle('active', p.id === 'panel-' + panelId));
  const panel = document.getElementById('panel-' + panelId);
  if (panel) {
    panel.querySelectorAll('.fade-in:not(.visible)').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 70);
    });
  }
}

function initMemberTabs() {
  document.querySelectorAll('.member-tab').forEach(tab => {
    tab.addEventListener('click', () => switchMemberPanel(tab.dataset.panel));
  });
  document.querySelectorAll('.member-subtab').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      switchPage('page-members');
      navLinks.classList.remove('open');
      const panel = link.dataset.subtab;
      setTimeout(() => switchMemberPanel(panel), 60);
    });
  });
}

// ── RENDER: NEWS ──────────────────────────────────────────────
function newsCardHtml(item) {
  const imgBlock = item.image
    ? `<img src="${item.image}" alt="${item.title}" loading="lazy" />`
    : `<div class="news-card-placeholder"><span>${item.month}</span><span>${item.year}</span></div>`;
  return `
    <div class="news-card fade-in">
      <div class="news-card-img">${imgBlock}</div>
      <div class="news-card-body">
        <p class="news-card-date">${item.month} ${item.year}</p>
        <p class="news-card-title">${item.title}</p>
        <p class="news-card-text">${item.text}</p>
      </div>
    </div>
  `;
}

function renderNews() {
  const container = document.getElementById('news-container');
  if (!container || typeof NEWS === 'undefined') return;

  const monthNum = {Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',
                    Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};

  const rows = NEWS.map((item, i) => {
    const num  = NEWS.length - i;
    const date = `${item.year}-${monthNum[item.month] || '??'}`;
    return `
      <div class="board-row fade-in" onclick="openNewsModal(${i})">
        <span class="board-col-num">${num}</span>
        <span class="board-col-title">${item.title}</span>
        <span class="board-col-date">${date}</span>
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="board-list">
      <div class="board-list-header">
        <span class="board-col-num">No.</span>
        <span class="board-col-title">제목</span>
        <span class="board-col-date">날짜</span>
      </div>
      ${rows}
    </div>`;
}

// ── NEWS MODAL (갤러리 모달 재사용) ───────────────────────────
function openNewsModal(index) {
  if (typeof NEWS === 'undefined' || !NEWS[index]) return;
  const item = NEWS[index];
  const monthNum = {Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',
                    Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};

  const modal   = document.getElementById('gallery-modal');
  const imgWrap = document.getElementById('gallery-modal-img-wrap');

  imgWrap.innerHTML = `<div class="news-card-placeholder" style="width:100%;height:100%">
    <span>${item.month}</span><span>${item.year}</span>
  </div>`;

  document.getElementById('gallery-modal-date').textContent  = `${item.year}-${monthNum[item.month] || '??'}`;
  document.getElementById('gallery-modal-title').textContent = item.title;
  document.getElementById('gallery-modal-text').textContent  = item.text;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ── RENDER: GALLERY ───────────────────────────────────────────
function renderGallery() {
  const container = document.getElementById('gallery-container');
  if (!container || typeof GALLERY === 'undefined') return;

  if (GALLERY.length === 0) {
    container.innerHTML = '<p style="color:var(--text-lt);font-size:.9rem;padding:24px 0;">No gallery posts yet.</p>';
    return;
  }

  container.innerHTML = `<div class="news-grid">${GALLERY.map((item, i) => {
    const parts = item.date.split(' ');
    const imgBlock = item.cover
      ? `<img src="${item.cover}" alt="${item.title}" loading="lazy" />`
      : `<div class="news-card-placeholder"><span>${parts[0]}</span><span>${parts.slice(1).join(' ')}</span></div>`;
    return `
      <div class="news-card gallery-card fade-in" role="button" tabindex="0"
           onclick="openGalleryModal(${i})" onkeydown="if(event.key==='Enter')openGalleryModal(${i})">
        <div class="news-card-img">${imgBlock}</div>
        <div class="news-card-body">
          <p class="news-card-date">${item.date}</p>
          <p class="news-card-title">${item.title}</p>
        </div>
      </div>`;
  }).join('')}</div>`;
}

// ── GALLERY MODAL ─────────────────────────────────────────────
function openGalleryModal(index) {
  if (typeof GALLERY === 'undefined' || !GALLERY[index]) return;
  const item = GALLERY[index];
  const modal   = document.getElementById('gallery-modal');
  const imgWrap = document.getElementById('gallery-modal-img-wrap');
  const parts   = item.date.split(' ');

  imgWrap.innerHTML = item.cover
    ? `<img src="${item.cover}" alt="${item.title}" />`
    : `<div class="news-card-placeholder" style="width:100%;height:100%"><span>${parts[0]}</span><span>${parts.slice(1).join(' ')}</span></div>`;

  document.getElementById('gallery-modal-date').textContent  = item.date;
  document.getElementById('gallery-modal-title').textContent = item.title;
  document.getElementById('gallery-modal-text').textContent  = item.body;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
  document.getElementById('gallery-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function initGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  if (!modal) return;
  document.getElementById('gallery-modal-close').addEventListener('click', closeGalleryModal);
  document.getElementById('gallery-modal-backdrop').addEventListener('click', closeGalleryModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeGalleryModal(); });
}

// ── BOARD PANEL SWITCHING ─────────────────────────────────────
function switchBoardPanel(panelId) {
  document.querySelectorAll('#board-tabs .pub-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.panel === panelId));
  document.querySelectorAll('.board-panel').forEach(p =>
    p.classList.toggle('active', p.id === 'board-panel-' + panelId));
  const panel = document.getElementById('board-panel-' + panelId);
  if (panel) {
    panel.querySelectorAll('.fade-in:not(.visible)').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 70);
    });
  }
}

function initBoardTabs() {
  document.querySelectorAll('#board-tabs .pub-tab').forEach(tab => {
    tab.addEventListener('click', () => switchBoardPanel(tab.dataset.panel));
  });
  document.querySelectorAll('.board-subtab').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      switchPage('page-board');
      navLinks.classList.remove('open');
      const panel = link.dataset.subtab;
      setTimeout(() => switchBoardPanel(panel), 60);
    });
  });
}

// ── PUB FILTER NAV ────────────────────────────────────────────
function initPubFilterNav() {
  document.querySelectorAll('.pub-filtertab').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      switchPage('page-publications');
      navLinks.classList.remove('open');
      const filter = link.dataset.filter;
      setTimeout(() => {
        const tabs = document.querySelectorAll('#page-publications .pub-tab');
        tabs.forEach(t => t.classList.toggle('active', t.dataset.filter === filter));
        document.querySelectorAll('.pub-year-group').forEach(g =>
          g.classList.toggle('hidden', g.dataset.type !== filter));
        document.querySelectorAll('.pub-item').forEach(i =>
          i.classList.toggle('hidden', i.dataset.type !== filter));
      }, 60);
    });
  });
}

// ── PUBLICATION TABS ─────────────────────────────────────────
function initPubTabs() {
  const tabs   = document.querySelectorAll('#page-publications .pub-tab');
  const groups = () => document.querySelectorAll('.pub-year-group');
  const items  = () => document.querySelectorAll('.pub-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      if (filter === 'all') {
        groups().forEach(g => g.classList.remove('hidden'));
        items().forEach(i  => i.classList.remove('hidden'));
        return;
      }

      groups().forEach(g => g.classList.toggle('hidden', g.dataset.type !== filter));
      items().forEach(i  => i.classList.toggle('hidden',  i.dataset.type  !== filter));
    });
  });
}

// ── RENDER: PUBLICATIONS TEASER ──────────────────────────────
function renderPublicationsTeaser() {
  const container = document.getElementById('pub-teaser');
  if (!container || typeof PUBLICATIONS === 'undefined') return;

  const recent = PUBLICATIONS
    .filter(p => p.year !== 'Preprints')
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))
    .slice(0, 3);

  const labelMap = { journal: 'Journal', conference: 'Conference', preprint: 'Preprint' };

  function getPubUrl(pub) {
    if (pub.url) return pub.url;
    const arxiv = pub.venue.match(/arXiv:(\d+\.\d+)/);
    if (arxiv) return 'https://arxiv.org/abs/' + arxiv[1];
    return 'https://scholar.google.com/scholar?q=' + encodeURIComponent(pub.title);
  }

  container.innerHTML = recent.map(pub => {
    const url = getPubUrl(pub);
    return `
      <div class="pub-item fade-in" data-type="${pub.type}">
        <div class="pub-badge ${pub.type}">${labelMap[pub.type]}</div>
        <div class="pub-content">
          <a href="${url}" target="_blank" rel="noopener" class="pub-title">${pub.title}</a>
          <p class="pub-authors">${pub.authors}</p>
          <p class="pub-venue">${pub.venue}</p>
        </div>
      </div>`;
  }).join('');
}

// ── RENDER: NEWS TEASER ───────────────────────────────────────
function renderNewsTeaser() {
  const container = document.getElementById('news-teaser');
  if (!container || typeof NEWS === 'undefined') return;
  container.innerHTML = `<div class="news-grid">${NEWS.slice(0, 3).map(newsCardHtml).join('')}</div>`;
}

// ── INITIAL RENDER + PAGE LOAD ────────────────────────────────
// data/ 파일들의 내용을 DOM에 렌더링한 뒤 초기 페이지를 표시합니다.
renderResearchGrid();
renderPublications();
renderMembers();
renderNews();
renderGallery();

initPubTabs();
renderPublicationsTeaser();
renderNewsTeaser();
initMemberTabs();
initBoardTabs();
initPubFilterNav();
initGalleryModal();

// URL 해시에 따라 올바른 페이지로 이동
(function handleInitialHash() {
  const hash = window.location.hash.replace('#', '');
  const validPages = ['about','research','publications','members','board','contact'];
  if (hash && validPages.includes(hash)) {
    switchPage('page-' + hash, false);
  } else {
    navbar.classList.remove('scrolled');
  }
})();
