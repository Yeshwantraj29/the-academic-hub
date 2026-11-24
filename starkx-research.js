/* Keep the original script.js; this adds only the small animated AI development count. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window)) document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
  if (!reduce && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el=entry.target, total=Number(el.dataset.count);
      observer.unobserve(el);
      if (!Number.isFinite(total) || total<0) return;
      const start=performance.now();
      const frame=now=>{const p=Math.min(1,(now-start)/650);el.textContent=String(Math.round(total*(1-(1-p)**3))).padStart(2,'0');if(p<1)requestAnimationFrame(frame);};
      requestAnimationFrame(frame);
    }),{threshold:.25});
    document.querySelectorAll('[data-count]').forEach(el=>observer.observe(el));
  }
  const toggle=document.querySelector('.menu-toggle');
  document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>toggle?.setAttribute('aria-expanded','false')));
})();
