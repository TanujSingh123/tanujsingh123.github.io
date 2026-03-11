const sectionMap = { about:0, skills:1, experience:2, myapps:3, education:4, contact:5 };

const aboutLines = [
  { type:'sys',  text:'LOADING PROFILE: TANUJ_SINGH.DAT ................ [OK]' },
  { type:'sys',  text:'PARSING EXPERIENCE.LOG ........................... [OK]' },
  { type:'cmd',  text:'6+ years engineering data at scale — Python 3.x · PySpark · Spark · Hadoop · Databricks.' },
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

/* FIX #1: epoch counter replaces boolean flag — stale callbacks check epoch and bail */
let aboutEpoch = 0;

/* FIX #2: track stat intervals so they can be cleared on re-run */
let statIntervals = [];

function runAboutTypewriter() {
  const container = document.getElementById('about-typewriter');
  const cursor    = document.getElementById('about-cursor');
  const badges    = document.getElementById('about-badges');

  /* FIX #3: null guard — bail silently if HTML elements are missing */
  if (!container || !cursor || !badges) return;

  container.innerHTML  = '';
  badges.innerHTML     = '';
  cursor.style.display = 'none';

  /* FIX #1: bump epoch — all queued tick callbacks from old run see mismatch and stop */
  const myEpoch = ++aboutEpoch;

  /* FIX #2: kill any running stat counters, reset displays */
  statIntervals.forEach(t => clearInterval(t));
  statIntervals = [];
  document.querySelectorAll('.stat-num').forEach(el => { el.textContent = '0'; });

  let lineIdx = 0;

  function typeLine(lineObj, onDone) {
    const p   = document.createElement('p');
    const pfx = document.createElement('span');
    const txt = document.createElement('span');

    pfx.className   = lineObj.type === 'sys' ? 'sys-prompt' : 'prompt';
    pfx.textContent = lineObj.type === 'sys' ? '[SYS] ' : 'C:\\> ';
    p.appendChild(pfx);
    p.appendChild(txt);
    container.appendChild(p);

    let i = 0;
    const speed = lineObj.type === 'sys' ? 14 : 16;

    function tick() {
      if (aboutEpoch !== myEpoch) return; /* FIX #1: stale run — stop immediately */
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
    if (aboutEpoch !== myEpoch) return; /* FIX #1 */
    if (lineIdx < aboutLines.length) {
      typeLine(aboutLines[lineIdx++], nextLine);
    } else {
      animateStats(myEpoch);
      populateBadges(myEpoch);
      cursor.style.display = 'block';
    }
  }

  nextLine();
}

function animateStats(epoch) {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target  = parseInt(el.dataset.target);
    let   current = 0;
    const step    = Math.max(1, Math.ceil(target / 25));
    /* FIX #2: track each interval handle */
    const timer = setInterval(() => {
      if (aboutEpoch !== epoch) { clearInterval(timer); return; }
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 55);
    statIntervals.push(timer);
  });
}

function populateBadges(epoch) {
  if (aboutEpoch !== epoch) return;
  const container = document.getElementById('about-badges');
  if (!container) return;
  techBadges.forEach((name, i) => {
    const span = document.createElement('span');
    span.className = 'badge';
    span.textContent = name;
    span.style.animationDelay = (i * 60) + 'ms';
    container.appendChild(span);
  });
}

/* FIX #5: probe element created once and reused */
let probeEl = null;

function getCharWidth() {
  if (!probeEl) {
    probeEl = document.createElement('pre');
    probeEl.style.cssText = [
      'position:absolute','visibility:hidden','top:-9999px',
      'font-family:"Share Tech Mono","Courier New",monospace',
      'font-size:14px','padding:0','margin:0','line-height:1','white-space:pre'
    ].join(';');
    probeEl.textContent = 'M';
    document.body.appendChild(probeEl);
  }
  return probeEl.getBoundingClientRect().width || 8.4;
}

function getColCount() {
  const scrollEl = document.querySelector('.content-scroll');
  if (!scrollEl) return 80;
  const availW = scrollEl.getBoundingClientRect().width;
  if (!availW) return 80;
  return Math.max(20, Math.floor((availW - 6) / getCharWidth()));
}

function fillBorders() {
  const cols = getColCount();

  const mainDiv = document.querySelector('.main-divider');
  if (mainDiv) mainDiv.textContent = '╠' + '═'.repeat(cols - 2) + '╣';

  document.querySelectorAll('.section-title[data-title]').forEach(el => {
    const label  = el.dataset.title;
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

/* FIX #4: debounced resize — fires at most once per 120ms */
let resizeTimer = null;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(fillBorders, 120);
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
  /* FIX #1 & #6: bump epoch + guard against unknown id */
  aboutEpoch++;

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.dos-btn').forEach(b => b.classList.remove('active'));

  const target = document.getElementById(id);
  if (!target) { console.warn('showSection: unknown id', id); return; }
  target.classList.add('active');

  const btnIdx = sectionMap[id];
  const btns   = document.querySelectorAll('.dos-btn');
  if (btns[btnIdx] !== undefined) btns[btnIdx].classList.add('active');

  document.querySelector('.content-scroll').scrollTop = 0;

  if (id === 'skills') animateSkills();
  if (id === 'about')  runAboutTypewriter();
}

/* ── Keyboard shortcuts F1–F6 ── */
document.addEventListener('keydown', e => {
  const map = { F1:'about', F2:'skills', F3:'experience', F4:'myapps', F5:'education', F6:'contact' };
  if (map[e.key]) { e.preventDefault(); showSection(map[e.key]); }
});

/* ── Boot sequence ── */
window.addEventListener('load', () => {
  document.fonts.ready.then(() => {
    requestAnimationFrame(() => {
      fillBorders();
      window.addEventListener('resize', onResize); /* FIX #4 */
      runAboutTypewriter();
    });
  });

  const msgs = [
    'INITIALIZING SYSTEM...',
    'LOADING SKILLS.DAT...',
    'MOUNTING EXPERIENCE.LOG...',
    'READING MY_APPS.DIR...', /* FIX #9: consistent uppercase */
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
