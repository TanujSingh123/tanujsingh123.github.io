// Section navigation
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.dos-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  // Highlight active button
  const buttons = document.querySelectorAll('.dos-btn');
  const map = { about:0, skills:1, experience:2, projects:3, education:4, contact:5 };
  buttons[map[id]].classList.add('active');

  // Re-trigger skill bar animations
  if (id === 'skills') {
    document.querySelectorAll('.fill').forEach(bar => {
      const w = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = w; }, 50);
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

// Boot-up typing effect in title bar
window.addEventListener('load', () => {
  const msgs = [
    'LOADING RESUME.EXE...',
    'READING SKILLS.DAT...',
    'MOUNTING EXPERIENCE.LOG...',
    'BOOT COMPLETE ✓'
  ];
  const bar = document.querySelector('.title-bar span');
  let i = 0;
  const cycle = () => {
    if (i < msgs.length) {
      bar.textContent = msgs[i++];
      setTimeout(cycle, 700);
    } else {
      bar.textContent = '▓▓▒▒░░ RESUME.EXE v1.0 ░░▒▒▓▓';
    }
  };
  cycle();
});
