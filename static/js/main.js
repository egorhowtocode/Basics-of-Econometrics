// Frontend logic for search, accordion, dark mode, and toasts

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('question-form');
  const input = document.getElementById('question-input');
  const toggleBtn = document.getElementById('theme-toggle');
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  const gartnerContainer = document.getElementById('gartner-container');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = input.value;
    try {
      loading.classList.remove('hidden');
      results.classList.add('hidden');
      gartnerContainer.classList.add('hidden');
      highlightSegment(null);

      const data = await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q })
      }).then(r => r.json());
      loading.classList.add('hidden');
      renderResults(data.items);
      results.classList.remove('hidden');
      if (data.items && data.items.length) {
        gartnerContainer.classList.remove('hidden');
        gartnerContainer.classList.remove('anim-float-in');
        void gartnerContainer.offsetWidth;
        gartnerContainer.classList.add('anim-float-in');
      }
      showToast('Results refreshed for your question.');
    } catch (err) {
      console.error(err);
      loading.classList.add('hidden');
      results.classList.remove('hidden');
    }
  });

  toggleBtn.addEventListener('click', () => {
    const mode = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    setTheme(mode);
  });

  initTheme();
});

// Render the list of technologies or a not-found card
function renderResults(items) {
  const container = document.getElementById('results');
  container.innerHTML = '';
  if (!items || !items.length) {
    const card = document.createElement('div');
    card.className = 'anim-float-in bg-white dark:bg-slate-900 rounded-2xl p-6 text-center shadow';
    card.textContent = 'Sorry, we could not find anything.';
    container.appendChild(card);
    return;
  }
  items.forEach((item, i) => container.appendChild(createTechCard(item, i)));
}

// Highlight curve segment
function highlightSegment(seg) {
  document.querySelectorAll('#gartner-curve .gc-segment').forEach(s => s.classList.remove('active'));
  if (seg) {
    const target = document.getElementById(`gc-${seg}`);
    if (target) target.classList.add('active');
  }
}

// Create a technology card with accordion behavior and animation delay
function createTechCard(item, index) {
  const card = document.createElement('div');
  card.className = 'rounded-2xl bg-white dark:bg-slate-900 shadow anim-float-in';
  card.style.animationDelay = `${index * 90}ms`;

  card.addEventListener('mouseenter', () => highlightSegment(item.segment));
  card.addEventListener('mouseleave', () => highlightSegment(null));

  const btn = document.createElement('button');
  btn.id = `acc-btn-${item.id}`;
  btn.className = 'w-full flex justify-between items-center p-4 text-left focus:outline-none focus-visible:ring-2 ring-teal-500';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', `panel-${item.id}`);
  btn.innerHTML = `
    <span>
      <span class="font-semibold">${item.name}</span>
      <p class="text-sm text-slate-500 dark:text-slate-400">${item.maturity || ''}</p>
    </span>
    <svg class="chevron w-5 h-5 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>`;
  btn.addEventListener('click', () => toggleAccordion(item.id));

  const panel = document.createElement('div');
  panel.id = `panel-${item.id}`;
  panel.className = 'accordion-panel px-4';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', btn.id);

  const desc = document.createElement('div');
  desc.innerHTML = `
    <h4 class="font-medium">Вклад в продажи</h4>
    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${item.description}</p>`;

  const instruments = document.createElement('div');
  instruments.innerHTML = `
    <h4 class="font-medium mt-2">Instruments</h4>
    <div class="mt-1 flex flex-wrap gap-2">
      ${item.instruments
        .map(i => `<span class="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-800 dark:text-teal-100 text-sm">${i}</span>`)
        .join('')}
    </div>`;

  const sources = document.createElement('div');
  if (item.sources && item.sources.length) {
    sources.innerHTML = `
      <h4 class="font-medium mt-2">Sources</h4>
      <ul class="list-disc ml-5 text-sm text-slate-500 dark:text-slate-400 mt-1">
        ${item.sources.map(s => `<li>${s}</li>`).join('')}
      </ul>`;
  } else {
    sources.innerHTML = '<h4 class="font-medium mt-2">Sources</h4><p class="text-sm text-slate-500 dark:text-slate-400 mt-1">No sources available yet.</p>';
  }

  panel.appendChild(desc);
  panel.appendChild(instruments);
  panel.appendChild(sources);

  card.appendChild(btn);
  card.appendChild(panel);
  return card;
}

// Toggle accordion panels so only one stays open
function toggleAccordion(id) {
  const targetPanel = document.getElementById(`panel-${id}`);
  const targetBtn = document.getElementById(`acc-btn-${id}`);
  const targetChevron = targetBtn.querySelector('.chevron');
  const isOpen = targetBtn.getAttribute('aria-expanded') === 'true';

  document.querySelectorAll('.accordion-panel').forEach(p => {
    if (p !== targetPanel) {
      p.style.maxHeight = null;
      p.classList.remove('open');
      const b = document.getElementById(`acc-btn-${p.id.replace('panel-','')}`);
      if (b) {
        b.setAttribute('aria-expanded', 'false');
        const c = b.querySelector('.chevron');
        if (c) c.style.transform = 'rotate(0deg)';
      }
    }
  });

  if (isOpen) {
    targetPanel.style.maxHeight = null;
    targetPanel.classList.remove('open');
    targetBtn.setAttribute('aria-expanded', 'false');
    targetChevron.style.transform = 'rotate(0deg)';
  } else {
    targetPanel.classList.add('open');
    targetPanel.style.maxHeight = targetPanel.scrollHeight + 'px';
    targetBtn.setAttribute('aria-expanded', 'true');
    targetChevron.style.transform = 'rotate(180deg)';
  }
}

// Theme utilities
function setTheme(mode) {
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('theme', mode);
  updateThemeIcons(mode);
}

function initTheme() {
  const stored = localStorage.getItem('theme');
  setTheme(stored === 'dark' ? 'dark' : 'light');
}

function updateThemeIcons(mode) {
  const sun = document.getElementById('icon-sun');
  const moon = document.getElementById('icon-moon');
  if (mode === 'dark') {
    sun.classList.remove('hidden');
    moon.classList.add('hidden');
  } else {
    sun.classList.add('hidden');
    moon.classList.remove('hidden');
  }
}

// Simple toast/snackbar
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}
