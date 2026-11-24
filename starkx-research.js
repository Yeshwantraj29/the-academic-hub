/* Research portfolio filters, live result count and accessible counters. */
(() => {
  'use strict';
  const grid = document.getElementById('sx-paper-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.sx-paper')];
  const filters = [...document.querySelectorAll('.sx-filters button')];
  const input = document.getElementById('sx-search');
  const count = document.getElementById('sx-results');
  let stage = 'all';
  function render() {
    const words = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let shown = 0;
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const stageMatches = stage === 'all' || (stage === 'submitted' ? ['submitted','review'].includes(card.dataset.stage) : card.dataset.stage === stage);
      const visible = stageMatches && words.every(word => text.includes(word));
      card.hidden = !visible;
      if (visible) { shown++; card.classList.add('visible'); }
    });
    count.textContent = shown ? `Showing ${shown} of ${cards.length} research streams` : 'No matching research streams. Try another search or filter.';
  }
  filters.forEach(button => button.addEventListener('click', () => {
    stage = button.dataset.filter;
    filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    render();
  }));
  input.addEventListener('input', render);
  // Keep the original animation system; only provide a fallback if IntersectionObserver is unavailable.
  if (!('IntersectionObserver' in window)) document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = [...document.querySelectorAll('[data-count]')];
  // Keep portfolio indicators consistent when adding/removing entries.
  if (counters[0]) { counters[0].dataset.count = String(cards.length); counters[0].textContent = String(cards.length).padStart(2,'0'); }
  if (counters[2]) { const n = document.querySelectorAll('.publication-list .publication').length; counters[2].dataset.count = String(n); counters[2].textContent = String(n).padStart(2,'0'); }
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const metricObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const total = Number(el.dataset.count);
      if (!Number.isFinite(total) || total < 0) return;
      metricObserver.unobserve(el);
      const start = performance.now();
      const tick = now => {
        const p = Math.min(1, (now-start)/650);
        const val = Math.round(total*(1-Math.pow(1-p,3)));
        el.textContent = String(val).padStart(2,'0');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), {threshold:.25});
    counters.forEach(el => metricObserver.observe(el));
  }
  // Correct aria-expanded after the existing navigation script closes the menu.
  const toggle = document.querySelector('.menu-toggle');
  document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => toggle?.setAttribute('aria-expanded','false')));
})();
