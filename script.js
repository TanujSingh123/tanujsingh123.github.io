const sectionMap = { about:0, skills:1, experience:2, projects:3, education:4, contact:5 };

function showSection(id) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.dos-btn').forEach(b => b.classList.remove('active'));

  // Show selected
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.dos-btn')[sectionMap[id]].classList.add('active');

  // Scroll content area back to top
  document.querySelector('.content-scroll').scrollTop = 0;

  // Animate skill bars
  if (id === 'skills') {
    document.querySelectorAll('.fill').forEach(bar => {
      const target = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = target; }, 80);
    });
  }
}

// Keyboard shortcuts F1–F6
document.addEventListener('keydown', (e) => {
  const map = { F1:'about', F2:'skills', F3:'experience', F4:'projects', F5:'education', F6:'contact' };
  if (map[e.key]) {
    e.preventDefault();
    showSection(map[e.key]);
  }
});

// Boot-up title animation
window.addEventListener('load', () => {
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
    if (i < msgs.length) {
      bar.textContent = msgs[i++];
      setTimeout(cycle, 650);
    } else {
      bar.textContent = '▓▓▒▒░░ RESUME.EXE v1.0 — TANUJ SINGH ░░▒▒▓▓';
    }
  };
  cycle();

  // Trigger skill bar animation on first load if about is active
  setTimeout(() => {
    if (document.getElementById('skills').classList.contains('active')) {
      document.querySelectorAll('.fill').forEach(bar => {
        const t = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = t; }, 80);
      });
    }
  }, 400);
});
