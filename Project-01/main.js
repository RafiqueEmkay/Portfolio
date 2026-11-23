/* MONA DIGITAL — main.js (vanilla). Safe to load on any page; every block guards for missing elements. */

/* ===== 1. EDIT: contact details (leave '' to keep placeholder / hide) ===== */
const CONFIG = {
  email: '[YOUR EMAIL]',
  linkedin: '',          // e.g. 'https://www.linkedin.com/in/yourname'
  github: '',            // e.g. 'https://github.com/yourname'
  whatsapp: ''           // digits with country code, e.g. '15551234567'. Optional.
};

/* ===== 2. EDIT: projects (all placeholders). `image` optional; empty = placeholder art.
   Buttons for demo/source appear only when a real link is set. ===== */
const PROJECTS = [
  { title: '[PROJECT NAME 1]', category: '[CATEGORY]', concept: true, featured: true,
    description: '[One or two sentences on what you built and the goal. No made-up results.]',
    stack: ['HTML', 'CSS', 'JavaScript'], demo: '', source: '', image: '',
    alt: '[Describe the screenshot, e.g. Homepage on desktop]', url: 'case-study.html' },
  { title: '[PROJECT NAME 2]', category: '[CATEGORY]', concept: true,
    description: '[Short description.]', stack: ['HTML', 'CSS'], demo: '', source: '', image: '',
    alt: '[Screenshot description]', url: 'case-study.html' },
  { title: '[PROJECT NAME 3]', category: '[CATEGORY]', concept: true,
    description: '[Short description.]', stack: ['HTML', 'CSS', 'JavaScript'], demo: '', source: '', image: '',
    alt: '[Screenshot description]', url: 'case-study.html' }
];

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const placeholder = t => 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect width="800" height="500" fill="#0B0F19"/><rect x="60" y="60" width="680" height="380" rx="16" fill="#161B2A" stroke="#263244"/><rect x="100" y="110" width="300" height="24" rx="6" fill="#263244"/><rect x="100" y="150" width="200" height="12" rx="6" fill="#263244"/><rect x="100" y="360" width="120" height="40" rx="8" fill="#38BDF8" opacity=".6"/><text x="400" y="270" fill="#94A3B8" font-family="monospace" font-size="18" text-anchor="middle">${esc(t)}</text></svg>`);

/* Contact links */
$$('a[data-link]').forEach(a => {
  const k = a.dataset.link, v = CONFIG[k];
  if (!v) return;
  a.href = k === 'email' ? `mailto:${v}` : k === 'whatsapp' ? `https://wa.me/${v}` : v;
  if (k === 'email') a.textContent = v;
  else if (k !== 'whatsapp') a.textContent = v.replace(/^https?:\/\/(www\.)?/, '');
});
if (CONFIG.whatsapp) $$('li[data-link="whatsapp"]').forEach(li => li.hidden = false);

/* Mobile nav */
const toggle = $('.nav-toggle'), nav = $('#primary-nav');
if (toggle && nav) {
  const set = open => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => set(!nav.classList.contains('open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); toggle.focus(); }
  });
  matchMedia('(min-width:861px)').addEventListener('change', e => e.matches && set(false));
}

/* Active nav link */
const links = $$('#primary-nav ul a[href^="#"]');
if (links.length && 'IntersectionObserver' in window) {
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    links.forEach(a => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
    const a = map.get(en.target.id);
    if (a) { a.classList.add('active'); a.setAttribute('aria-current', 'true'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* Render projects */
const grid = $('#projects-grid');
if (grid) {
  grid.insertAdjacentHTML('beforeend', PROJECTS.map(p => `
    <article class="card project reveal${p.featured ? ' featured' : ''}">
      <div class="preview">
        <img src="${esc(p.image || placeholder(p.title))}" alt="${esc(p.alt)}" width="800" height="500" loading="lazy" decoding="async">
        <a class="view" href="${esc(p.url || '#')}" aria-label="View case study: ${esc(p.title)}">View case study →</a>
      </div>
      <div class="p-body">
        <div class="p-meta"><span>${esc(p.category)}</span>${p.concept ? '<span class="tag">Concept project</span>' : ''}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.description)}</p>
        <ul class="chips" aria-label="Tech stack">${p.stack.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
        <div class="p-links">
          ${p.demo ? `<a class="btn btn-primary btn-sm" href="${esc(p.demo)}" target="_blank" rel="noopener">Live Demo<span class="sr-only"> of ${esc(p.title)}</span></a>` : ''}
          ${p.source ? `<a class="btn btn-ghost btn-sm" href="${esc(p.source)}" target="_blank" rel="noopener">Source Code<span class="sr-only"> of ${esc(p.title)}</span></a>` : ''}
        </div>
      </div>
    </article>`).join(''));
}

/* Scroll reveal */
const rev = $$('.reveal');
if (rev.length) {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    rev.forEach(el => el.classList.add('in'));
  } else {
    const ro = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
    }), { threshold: .12 });
    rev.forEach(el => ro.observe(el));
  }
}

/* Contact form (mailto fallback, no backend) */
const form = $('#contact-form');
if (form) {
  const status = $('#form-status');
  const rules = {
    name: v => v.trim().length >= 2 || 'Please enter your name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address.',
    type: v => !!v || 'Please choose a project type.',
    message: v => v.trim().length >= 10 || 'Please add a few details (at least 10 characters).'
  };
  const check = f => {
    const r = rules[f.name]; if (!r) return true;
    const res = r(f.value), ok = res === true, err = $('#' + f.id + '-err');
    f.setAttribute('aria-invalid', !ok); err.textContent = ok ? '' : res; return ok;
  };
  $$('input,select,textarea', form).forEach(f => f.addEventListener('blur', () => check(f)));
  form.addEventListener('submit', e => {
    e.preventDefault(); status.textContent = ''; status.style.color = '';
    const bad = $$('input,select,textarea', form).filter(f => !check(f));
    if (bad.length) { bad[0].focus(); status.textContent = 'Please fix the highlighted fields.'; status.style.color = '#FCA5A5'; return; }
    if (!CONFIG.email || CONFIG.email.includes('[')) {
      status.textContent = 'Demo only: add your real email in js/main.js (CONFIG) to enable sending.'; return;
    }
    const d = Object.fromEntries(new FormData(form));
    const body = `Name: ${d.name}\nEmail: ${d.email}\nProject type: ${d.type}\nBudget: ${d.budget || '-'}\n\n${d.message}`;
    location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Project inquiry: ' + d.type)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Thanks! Your email app should open with the details filled in. Press send there to finish.';
    form.reset();
  });
}

/* Footer year */
const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
