/* ─── STATE ──────────────────────────────────────────────── */
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
  const prev  = currentIndex;
  currentIndex = index;

  /* Update section classes */
  sections.forEach((sec, i) => {
    sec.classList.remove('is-active', 'is-above');
    if (i < index)  sec.classList.add('is-above');
    if (i === index) sec.classList.add('is-active');
    /* Sections above current index go above; below go off-screen below (no class = default) */
  });

  updateUI(index);

  /* Match the CSS transition duration (1.1s) */
  setTimeout(() => { isAnimating = false; }, 1150);
}

/* ─── UPDATE NAV / LABEL ────────────────────────────────── */
function updateUI(index) {
  navDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  labelNum.textContent  = SECTION_NUMS[index];
  labelText.textContent = SECTION_NAMES[index];
  scrollHint.classList.toggle('hidden', index > 0);
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

/* ─── TOUCH ─────────────────────────────────────────────── */
let touchStartY   = 0;
let touchCooldown = false;

window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (isAnimating || touchCooldown) return;
  const delta = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(delta) < 40) return;
  touchCooldown = true;
  setTimeout(() => { touchCooldown = false; }, 900);
  goToSection(delta > 0 ? currentIndex + 1 : currentIndex - 1);
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

/* ─── TABS ──────────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${target}`).classList.add('active');
    });
  });
}

/* ─── CONTACT FORM ──────────────────────────────────────── */
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name || !data.email || !data.message) {
      status.textContent = 'Please fill in name, email, and message.';
      status.className = 'contact-form__status error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      status.textContent = 'Please enter a valid email address.';
      status.className = 'contact-form__status error';
      return;
    }

    status.textContent = 'Sending…';
    status.className = 'contact-form__status';

    /* TODO: replace with your email service (Formspree, EmailJS, etc.) */
    await new Promise((r) => setTimeout(r, 900));

    status.textContent = "Message sent! I'll get back to you soon.";
    status.className = 'contact-form__status success';
    form.reset();
  });
}

/* ─── LENIS (optional — adds subtle smoothness to other page effects) */
function initLenis() {
  try {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  } catch (_) {
    /* Lenis CDN unavailable — snapping still works via CSS transitions */
  }
}

/* ─── BOOT ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initContactForm();
  initLenis();

  /* Show first section immediately */
  goToSection(0);
});
