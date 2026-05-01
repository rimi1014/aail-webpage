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

  // Resize hero canvas when returning to home
  if (targetId === 'page-home') {
    setTimeout(resizeCanvas, 10);
  }

  // Update URL hash without scrolling
  if (pushHistory) {
    const hash = targetId.replace('page-', '');
    history.pushState({ page: targetId }, '', hash === 'home' ? '#' : '#' + hash);
  }
}

// Bind all .nav-tab clicks
navTabs.forEach(tab => {
  tab.addEventListener('click', e => {
    e.preventDefault();
    const target = tab.dataset.target;
    if (target) switchPage(target);
    navLinks.classList.remove('open');
  });
});

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

// ── HAMBURGER MENU ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// ── HERO CANVAS (star-field) ─────────────────────────────────
const canvas = document.getElementById('hero-canvas');
const ctx    = canvas.getContext('2d');
const stars  = [];
const STAR_COUNT = 140;
let animFrameId;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStar() {
  return {
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    r:  Math.random() * 1.4 + 0.3,
    a:  Math.random(),
    da: (Math.random() - 0.5) * 0.004,
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

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.a})`;
    ctx.fill();
  });

  // Accent glow — top-right corner
  const grd = ctx.createRadialGradient(
    canvas.width * 0.85, canvas.height * 0.15, 0,
    canvas.width * 0.85, canvas.height * 0.15, canvas.width * 0.4
  );
  grd.addColorStop(0, 'rgba(74,159,212,0.12)');
  grd.addColorStop(1, 'rgba(74,159,212,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  animFrameId = requestAnimationFrame(drawCanvas);
}

window.addEventListener('resize', () => {
  resizeCanvas();
});

initCanvas();
drawCanvas();

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

  container.innerHTML = groups.map(group => `
    <div class="pub-year-group" data-type="${group.type}">
      <div class="pub-year-label">${group.year}</div>
      ${group.items.map(pub => `
        <div class="pub-item fade-in" data-type="${pub.type}">
          <div class="pub-badge ${pub.type}">${labelMap[pub.type]}</div>
          <div class="pub-content">
            <p class="pub-title">${pub.title}</p>
            <p class="pub-authors">${pub.authors}</p>
            <p class="pub-venue">${pub.venue}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

// ── RENDER: MEMBERS ───────────────────────────────────────────
function renderMembers() {
  const container = document.getElementById('members-container');
  if (!container || typeof MEMBERS === 'undefined') return;

  const groupDefs = [
    { key: 'snu',       label: 'Seoul National University', cosup: false,
      subgroups: [
        { key: 'phd', label: 'PhD Students',   defaultRole: 'PhD Student'  },
        { key: 'msc', label: 'MSc Students',   defaultRole: 'MSc Student'  },
        { key: 'bsc', label: 'BSc Students',   defaultRole: 'BSc Student'  },
      ]
    },
    { key: 'cranfield', label: 'Cranfield University', cosup: true,
      subgroups: [
        { key: 'phd', label: 'PhD Students',   defaultRole: 'PhD Student'  },
      ]
    },
  ];

  container.innerHTML = groupDefs.map(group => {
    const groupData = MEMBERS[group.key];
    if (!groupData) return '';

    const subgroupsHtml = group.subgroups.map(sub => {
      const members = groupData[sub.key];
      if (!members || members.length === 0) return '';

      const cardsHtml = members.map(m => `
        <div class="member-card ${m.highlight ? 'member-card-highlight' : ''}">
          <div class="member-avatar">${m.initials}</div>
          <div class="member-info">
            <p class="member-name">${m.name}</p>
            <p class="member-role">${m.role || sub.defaultRole}</p>
            ${m.note ? `<p class="member-note">${m.note}</p>` : ''}
          </div>
        </div>
      `).join('');

      return `
        <div class="members-subgroup">
          <h4 class="members-subgroup-title">${sub.label}</h4>
          <div class="members-grid">${cardsHtml}</div>
        </div>
      `;
    }).join('');

    const cosupNote = group.cosup
      ? ' <span class="members-group-note">(Co-supervised)</span>'
      : '';

    return `
      <div class="members-group fade-in">
        <h3 class="members-group-title">${group.label}${cosupNote}</h3>
        ${subgroupsHtml}
      </div>
    `;
  }).join('');
}

// ── RENDER: NEWS ──────────────────────────────────────────────
function renderNews() {
  const container = document.getElementById('news-timeline');
  if (!container || typeof NEWS === 'undefined') return;

  container.innerHTML = NEWS.map(item => `
    <div class="news-item fade-in">
      <div class="news-date">
        <span class="news-month">${item.month}</span>
        <span class="news-year">${item.year}</span>
      </div>
      <div class="news-body">
        <div class="news-dot"></div>
        <div class="news-content">
          <p class="news-title">${item.title}</p>
          <p class="news-text">${item.text}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// ── PUBLICATION TABS ─────────────────────────────────────────
function initPubTabs() {
  const tabs   = document.querySelectorAll('.pub-tab');
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

// ── INITIAL RENDER + PAGE LOAD ────────────────────────────────
// data/ 파일들의 내용을 DOM에 렌더링한 뒤 초기 페이지를 표시합니다.
renderPublications();
renderMembers();
renderNews();

// pub tabs 재초기화 (동적으로 생성된 DOM에 이벤트 바인딩)
initPubTabs();

// URL 해시에 따라 올바른 페이지로 이동
(function handleInitialHash() {
  const hash = window.location.hash.replace('#', '');
  const validPages = ['about','research','publications','members','news','contact'];
  if (hash && validPages.includes(hash)) {
    switchPage('page-' + hash, false);
  } else {
    navbar.classList.remove('scrolled');
  }
})();
