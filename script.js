/* ─── CONSTANTS ─────────────────────────────────────────── */
const SLIDE_GAP  = 20;   /* px — matches 1.25rem gap in CSS */
const AUTO_MS    = 3000; /* ms between auto-advance steps   */

/* ─── SECTION STATE ─────────────────────────────────────── */
const sections    = Array.from(document.querySelectorAll('.section'));
const navDots     = Array.from(document.querySelectorAll('.nav-dot'));
const labelNum    = document.querySelector('.section-label__number');
const labelText   = document.querySelector('.section-label__text');
const scrollHint  = document.querySelector('.scroll-hint');

const SECTION_NAMES = ['About Me', 'Work History', 'Projects', 'Contact'];
const SECTION_NUMS  = ['01', '02', '03', '04'];

let currentIndex = 0;
let isAnimating  = false;

/* ─── GO TO SECTION ─────────────────────────────────────── */
function goToSection(index) {
  if (index < 0 || index >= sections.length) return;
  if (isAnimating) return;

  isAnimating = true;
  sections[index].scrollTop = 0;
  currentIndex = index;

  sections.forEach((sec, i) => {
    sec.classList.remove('is-active', 'is-above');
    if (i < index)  sec.classList.add('is-above');
    if (i === index) sec.classList.add('is-active');
  });

  updateUI(index);
  setTimeout(() => { isAnimating = false; }, 1150);
}

/* ─── UPDATE NAV / LABEL ────────────────────────────────── */
function updateUI(index) {
  navDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  labelNum.textContent  = SECTION_NUMS[index];
  labelText.textContent = SECTION_NAMES[index];
  scrollHint.classList.toggle('hidden', index > 0);

  /* Pause/resume slider auto-advance based on which section is active */
  const activeTabId = document.querySelector('.tab.active')?.dataset.tab;
  const inst = activeTabId && sliderInstances[activeTabId];
  if (inst) {
    if (index === 2) inst.startAuto(); /* projects section */
    else             inst.stopAuto();
  }
}

/* ─── WHEEL ─────────────────────────────────────────────── */
let wheelCooldown = false;

window.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (isAnimating || wheelCooldown) return;
  wheelCooldown = true;
  setTimeout(() => { wheelCooldown = false; }, 900);
  goToSection(e.deltaY > 0 ? currentIndex + 1 : currentIndex - 1);
}, { passive: false });

/* ─── TOUCH (section-level, vertical only) ──────────────── */
let touchStartY   = 0;
let touchStartX   = 0;
let touchCooldown = false;

window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (isAnimating || touchCooldown) return;

  const deltaY = touchStartY - e.changedTouches[0].clientY;
  const deltaX = touchStartX - e.changedTouches[0].clientX;

  if (Math.abs(deltaX) > Math.abs(deltaY)) return; /* horizontal → slider handles it */
  if (Math.abs(deltaY) < 40) return;

  const sec      = sections[currentIndex];
  const atTop    = sec.scrollTop <= 2;
  const atBottom = sec.scrollTop + sec.clientHeight >= sec.scrollHeight - 2;

  if (deltaY > 0 && !atBottom) return;
  if (deltaY < 0 && !atTop)   return;

  touchCooldown = true;
  setTimeout(() => { touchCooldown = false; }, 900);
  goToSection(deltaY > 0 ? currentIndex + 1 : currentIndex - 1);
}, { passive: true });

/* ─── KEYBOARD ──────────────────────────────────────────── */
window.addEventListener('keydown', (e) => {
  if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
    e.preventDefault();
    goToSection(currentIndex + 1);
  }
  if (['ArrowUp', 'PageUp'].includes(e.key)) {
    e.preventDefault();
    goToSection(currentIndex - 1);
  }
});

/* ─── NAV DOTS ──────────────────────────────────────────── */
navDots.forEach((dot, i) => dot.addEventListener('click', () => goToSection(i)));

/* ─── SLIDER ─────────────────────────────────────────────── */
const sliderInstances = {};

function buildSlider(panel) {
  const grid  = panel.querySelector('.projects-grid');
  if (!grid) return null;

  const cards = Array.from(grid.querySelectorAll('.project-card'));
  if (cards.length === 0) return null;

  const isMob    = () => window.matchMedia('(max-width: 900px)').matches;
  const perPage  = () => isMob() ? 1 : 3;
  const numPages = () => Math.ceil(cards.length / perPage());

  /* Desktop with ≤3 cards: keep plain grid. Mobile: always slider. */
  if (!isMob() && cards.length <= 3) return null;

  let current = 0;
  let pingDir = 1; /* direction for ping-pong auto-advance */
  let timer   = null;

  /* ── Wrap grid in a clipping viewport ── */
  const viewport = document.createElement('div');
  viewport.className = 'projects-slider__viewport';
  grid.parentNode.insertBefore(viewport, grid);
  viewport.appendChild(grid);
  grid.classList.add('is-slider');
  grid.style.transition = `transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)`;

  /* ── Controls row ── */
  const controls = document.createElement('div');
  controls.className = 'projects-slider__controls';

  function makeArrow(dir) {
    const b = document.createElement('button');
    b.className = `slider-btn slider-btn--${dir}`;
    b.setAttribute('aria-label', dir === 'prev' ? 'Previous slide' : 'Next slide');
    b.innerHTML = dir === 'prev'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
    return b;
  }

  const prevBtn = makeArrow('prev');
  const dotsEl  = document.createElement('div');
  dotsEl.className = 'slider-dots';
  const nextBtn = makeArrow('next');

  controls.append(prevBtn, dotsEl, nextBtn);
  viewport.after(controls);

  /* ── Helpers ── */
  function setWidths() {
    const pp  = perPage();
    const vpW = viewport.clientWidth;
    const w   = (vpW - (pp - 1) * SLIDE_GAP) / pp;
    cards.forEach(c => { c.style.flex = `0 0 ${w}px`; c.style.maxWidth = `${w}px`; });
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    for (let i = 0; i < numPages(); i++) {
      const d = document.createElement('button');
      d.className = 'slider-dot';
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.addEventListener('click', () => { stopAuto(); goTo(i); });
      dotsEl.appendChild(d);
    }
  }

  function goTo(page) {
    const n = numPages();
    /* Mobile: wrap around. Desktop: clamp to bounds. */
    current = isMob()
      ? ((page % n) + n) % n
      : Math.max(0, Math.min(page, n - 1));

    const vpW = viewport.clientWidth;
    grid.style.transform = `translateX(${-(current * (vpW + SLIDE_GAP))}px)`;

    dotsEl.querySelectorAll('.slider-dot')
      .forEach((d, i) => d.classList.toggle('active', i === current));

    prevBtn.disabled = !isMob() && current === 0;
    nextBtn.disabled = !isMob() && current === n - 1;
  }

  /* ── Auto-advance (mobile only, ping-pong) ── */
  function startAuto() {
    if (!isMob()) return;
    stopAuto();
    timer = setInterval(() => {
      const n = numPages();
      if (n <= 1) return;
      if (current + pingDir >= n) pingDir = -1;
      if (current + pingDir < 0)  pingDir =  1;
      goTo(current + pingDir);
    }, AUTO_MS);
  }

  function stopAuto() { clearInterval(timer); timer = null; }

  /* ── Touch: horizontal swipe inside slider viewport ── */
  let tx = 0, ty = 0;
  viewport.addEventListener('touchstart', e => {
    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    const dx = tx - e.changedTouches[0].clientX;
    const dy = ty - e.changedTouches[0].clientY;
    /* Only handle horizontal swipes; let vertical propagate to section handler */
    if (Math.abs(dy) >= Math.abs(dx) || Math.abs(dx) < 30) return;
    stopAuto();
    goTo(dx > 0 ? current + 1 : current - 1);
    startAuto();
  }, { passive: true });

  /* ── Button clicks ── */
  prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  /* ── Adapt on viewport resize ── */
  new ResizeObserver(() => {
    setWidths();
    buildDots();
    goTo(current);
    /* Switch auto-advance on/off depending on breakpoint */
    if (isMob()) startAuto(); else stopAuto();
  }).observe(viewport);

  /* ── Init ── */
  setWidths();
  buildDots();
  goTo(0);
  startAuto();

  return {
    startAuto,
    stopAuto,
    reset() { stopAuto(); current = 0; pingDir = 1; goTo(0); startAuto(); },
  };
}

/* ─── TABS ──────────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(`tab-${target}`);
      panel.classList.add('active');

      /* Init slider lazily (panel is now visible, clientWidth is valid) */
      if (!sliderInstances[target]) {
        const inst = buildSlider(panel);
        if (inst) sliderInstances[target] = inst;
      } else {
        sliderInstances[target].reset();
      }
    });
  });
}

/* ─── COPY EMAIL ────────────────────────────────────────── */
function initCopyEmail() {
  const btn = document.getElementById('copy-email');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    await navigator.clipboard.writeText('gambaroimark@gmail.com');
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 2000);
  });
}

/* ─── LENIS ─────────────────────────────────────────────── */
function initLenis() {
  try {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  } catch (_) { /* CDN unavailable — CSS transitions still handle snapping */ }
}

/* ─── BOOT ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();

  /* Init slider for the default active tab (visible on load, has valid clientWidth) */
  const defaultPanel = document.querySelector('.tab-panel.active');
  if (defaultPanel) {
    const id   = defaultPanel.id.replace('tab-', '');
    const inst = buildSlider(defaultPanel);
    if (inst) sliderInstances[id] = inst;
  }

  initCopyEmail();
  initLenis();
  goToSection(0);
});
