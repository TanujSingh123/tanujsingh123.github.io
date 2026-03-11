const sectionMap = { about:0, skills:1, experience:2, projects:3, education:4, contact:5 };

/* ── About: typewriter lines ── */
const aboutLines = [
  { type:'sys',  text:'LOADING PROFILE: TANUJ_SINGH.DAT ................ [OK]' },
  { type:'sys',  text:'PARSING EXPERIENCE.LOG ........................... [OK]' },
  { type:'cmd',  text:'6.5+ years engineering data at scale — Python 3.x · PySpark · Spark · Hadoop · Databricks.' },
  { type:'cmd',  text:'Built AI semantic search — SentenceTransformers · ChromaDB · PyTorch embeddings.' },
  { type:'cmd',  text:'ETL pipelines: millions of records/day via PySpark · AWS Lambda · S3 · Datadog.' },
  { type:'cmd',  text:'Containerized & shipped — Docker · Kubernetes · Jenkins CI/CD · GitLab.' },
  { type:'cmd',  text:'Domains: Capital Markets · Real Estate · Mortgage data platforms.' },
];

const techBadges = [
  'Python 3.x','PySpark','Apache Spark','Hadoop','Databricks',
  'SentenceTransformers','ChromaDB','PyTorch','Streamlit',
  'Docker','Kubernetes','AWS Lambda','Amazon S3',
  'Jenkins','GitLab','Airflow','MongoDB','Core Java'
];

let aboutRunning = false;

function runAboutTypewriter() {
  const container = document.getElementById('about-typewriter');
  const cursor    = document.getElementById('about-cursor');
  const badges    = document.getElementById('about-badges');
  container.innerHTML = '';
  badges.innerHTML    = '';
  cursor.style.display = 'none';
  aboutRunning = true;

  let lineIdx = 0;

  function typeLine(lineObj, onDone) {
    const p    = document.createElement('p');
    const pfx  = document.createElement('span');
    const txt  = document.createElement('span');

    if (lineObj.type === 'sys') {
      pfx.className   = 'sys-prompt';
      pfx.textContent = '[SYS] ';
    } else {
      pfx.className   = 'prompt';
      pfx.textContent = 'C:\\> ';
    }

    p.appendChild(pfx);
    p.appendChild(txt);
    container.appendChild(p);

    let i = 0;
    const speed = lineObj.type === 'sys' ? 14 : 16;

    function tick() {
      if (!aboutRunning) return;
      if (i < lineObj.text.length) {
        txt.textContent += lineObj.text[i++];
        setTimeout(tick, speed + Math.random() * 12);
      } else {
        setTimeout(onDone, 100);
      }
    }
    tick();
  }

  function nextLine() {
    if (!aboutRunning) return;
    if (lineIdx < aboutLines.length) {
      typeLine(aboutLines[lineIdx++], nextLine);
    } else {
      animateStats();
      populateBadges();
      cursor.style.display = 'block';
    }
  }

  nextLine();
}

function animateStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target  = parseInt(el.dataset.target);
    let   current = 0;
    const step    = Math.max(1, Math.ceil(target / 25));
    const timer   = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 55);
  });
}

function populateBadges() {
  const container = document.getElementById('about-badges');
  techBadges.forEach((name, i) => {
    const span = document.createElement('span');
    span.className = 'badge';
    span.textContent = name;
    span.style.animationDelay = (i * 60) + 'ms';
    container.appendChild(span);
  });
}

/* ── BUG FIX #2 & #3: safe column counter ── */
function getColCount() {
  const scrollEl = document.querySelector('.content-scroll');
  if (!scrollEl) return 80;
  const availW = scrollEl.getBoundingClientRect().width;
  if (!availW || availW === 0) return 80;              // fallback if layout not ready

  /* BUG FIX #4: use 'M' — safe ASCII char, equal width to box chars in monospace */
  const probe = document.createElement('pre');
  probe.style.cssText = [
    'position:absolute','visibility:hidden','top:-9999px',
    'font-family:"Share Tech Mono","Courier New",monospace',
    'font-size:14px','padding:0','margin:0','line-height:1','white-space:pre'
  ].join(';');
  probe.textContent = 'M';
  document.body.appendChild(probe);
  const charW = probe.getBoundingClientRect().width || 8.4;
  document.body.removeChild(probe);

  return Math.max(20, Math.floor((availW - 6) / charW));
}

function fillBorders() {
  const cols = getColCount();

  const mainDiv = document.querySelector('.main-divider');
  if (mainDiv) mainDiv.textContent = '╠' + '═'.repeat(cols - 2) + '╣';

  document.querySelectorAll('.section-title[data-title]').forEach(el => {
    const label = el.dataset.title;
    const prefix = '┌─[ ', mid = ' ]';
    const used   = prefix.length + label.length + mid.length + 1;
    const dashes = Math.max(0, cols - used);
    el.textContent = prefix + label + mid + '─'.repeat(dashes) + '┐';
  });

  document.querySelectorAll('.section-close').forEach(el => {
    el.textContent = '└' + '─'.repeat(cols - 2) + '┘';
  });

  document.querySelectorAll('.thin-divider').forEach(el => {
    el.textContent = '  ' + '·'.repeat(Math.max(0, cols - 4));
  });
}

/* ── Skill bar animation ── */
function animateSkills() {
  document.querySelectorAll('.fill').forEach(bar => {
    bar.style.transition = 'none';
    bar.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        bar.style.width = bar.dataset.width + '%';
      });
    });
  });
}

/* ── Section navigation ── */
function showSection(id) {
  aboutRunning = false; // stop any in-progress typewriter if user leaves about

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.dos-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.dos-btn')[sectionMap[id]].classList.add('active');
  document.querySelector('.content-scroll').scrollTop = 0;

  if (id === 'skills')  animateSkills();
  if (id === 'about')   runAboutTypewriter();
}

/* ── Keyboard shortcuts F1–F6 ── */
document.addEventListener('keydown', e => {
  const map = { F1:'about', F2:'skills', F3:'experience', F4:'projects', F5:'education', F6:'contact' };
  if (map[e.key]) { e.preventDefault(); showSection(map[e.key]); }
});

/* ── Boot sequence ── */
window.addEventListener('load', () => {

  /* BUG FIX #2: wrap in rAF after fonts.ready so layout is fully painted */
  document.fonts.ready.then(() => {
    requestAnimationFrame(() => {
      fillBorders();
      window.addEventListener('resize', fillBorders);
      runAboutTypewriter(); // start typewriter after borders are drawn
    });
  });

  /* Title bar boot animation */
  const msgs = [
    'INITIALIZING SYSTEM...',
    'LOADING SKILLS.DAT...',
    'MOUNTING EXPERIENCE.LOG...',
    'READING PROJECTS.DIR...',
    'BOOT SEQUENCE COMPLETE ✓'
  ];
  const bar = document.querySelector('.title-text');
  let i = 0;
  const cycle = () => {
    if (i < msgs.length) { bar.textContent = msgs[i++]; setTimeout(cycle, 650); }
    else bar.textContent = '▓▓▒▒░░ RESUME.EXE v1.0 — TANUJ SINGH ░░▒▒▓▓';
  };
  cycle();
});
