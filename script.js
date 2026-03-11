const sectionMap = { about:0, skills:1, experience:2, projects:3, education:4, contact:5 };

/* ── Dynamic border calculation ── */
function getColCount() {
  // Measure exact character width using a hidden test element
  const probe = document.createElement('pre');
  probe.style.cssText = [
    'position:absolute', 'visibility:hidden', 'top:-9999px',
    'font-family:"Share Tech Mono","Courier New",monospace',
    'font-size:14px', 'padding:0', 'margin:0', 'line-height:1'
  ].join(';');
  probe.textContent = '═';
  document.body.appendChild(probe);
  const charW = probe.getBoundingClientRect().width;
  document.body.removeChild(probe);

  const scrollEl = document.querySelector('.content-scroll');
  const availW = scrollEl.getBoundingClientRect().width - 6; // subtract thin scrollbar
  return Math.max(20, Math.floor(availW / charW));
}

function fillBorders() {
  const cols = getColCount();

  // ╠════════════════════════════════╣ main divider
  const mainDiv = document.querySelector('.main-divider');
  if (mainDiv) mainDiv.textContent = '╠' + '═'.repeat(cols - 2) + '╣';

  // ┌─[ LABEL ]──────────────────────┐ section titles
  document.querySelectorAll('.section-title[data-title]').forEach(el => {
    const label = el.dataset.title;
    const prefix = '┌─[ ';
    const mid    = ' ]';
    const used   = prefix.length + label.length + mid.length + 1; // +1 for closing ┐
    const dashes = Math.max(0, cols - used);
    el.textContent = prefix + label + mid + '─'.repeat(dashes) + '┐';
  });

  // └───────────────────────────────┘ section closes
  document.querySelectorAll('.section-close').forEach(el => {
    el.textContent = '└' + '─'.repeat(cols - 2) + '┘';
  });

  // ····················· thin dividers
  document.querySelectorAll('.thin-divider').forEach(el => {
    el.textContent = '  ' + '·'.repeat(cols - 4);
  });
}

/* ── Skill bar animation ── */
function animateSkills() {
  document.querySelectorAll('.fill').forEach(bar => {
    bar.style.transition = 'none';
    bar.style.width = '0%';
    // Double rAF ensures browser paints the 0% before we set the target
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
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.dos-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.dos-btn')[sectionMap[id]].classList.add('active');
  document.querySelector('.content-scroll').scrollTop = 0;
  if (id === 'skills') animateSkills();
}

/* ── Keyboard shortcuts F1–F6 ── */
document.addEventListener('keydown', e => {
  const map = { F1:'about', F2:'skills', F3:'experience', F4:'projects', F5:'education', F6:'contact' };
  if (map[e.key]) { e.preventDefault(); showSection(map[e.key]); }
});

/* ── Boot sequence ── */
window.addEventListener('load', () => {
  // Draw borders once fonts are loaded
  document.fonts.ready.then(() => {
    fillBorders();
    // Redraw on resize
    window.addEventListener('resize', fillBorders);
  });

  // Title bar boot animation
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
