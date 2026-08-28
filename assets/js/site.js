/**
 * Page behaviour specific to this portfolio: the copy-to-clipboard email
 * button and the nav scroll-spy.
 *
 * Motion (reveals, parallax, counters) lives in motion.js and is shared,
 * unmodified, with the design it was ported from.
 */
(() => {
  /* ————————————————— copy email ————————————————— */
  const copyBtn = document.getElementById('copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.email);
        copyBtn.classList.add('copied');
        setTimeout(() => copyBtn.classList.remove('copied'), 2000);
      } catch {
        /* Clipboard blocked (insecure origin, denied permission) — the address
           is a live mailto link right beside the button, so do nothing. */
      }
    });
  }

  /* ————————————————— nav scroll-spy —————————————————
     Marks the nav link whose section currently owns the viewport. Uses the
     same one-observer approach as motion.js rather than a scroll handler. */
  const links = new Map();
  document.querySelectorAll('[data-nav] .nav-link[href^="#"]').forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) links.set(section, link);
  });

  if (links.size && 'IntersectionObserver' in window) {
    const visible = new Set();
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        // When several sections straddle the line, the topmost one wins.
        const active = [...links.keys()].find((section) => visible.has(section));
        links.forEach((link, section) => {
          link.setAttribute('aria-current', String(section === active));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    links.forEach((_, section) => spy.observe(section));
  }
})();
