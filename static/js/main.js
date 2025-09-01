// Frontend logic for search, accordion, dark mode, and toasts

const BASELINE = 600;
const STAGE_RANGES = {
  discovery: [100, 250],
  trigger: [250, 480],
  peak: [480, 650],
  trough: [650, 860],
  slope: [860, 1020],
  plateau: [1020, 1120],
  legacy: [1120, 1200],
};

const stageDescriptions = {
  discovery:
    "Discovery marks the birth of a concept. Teams tinker with unproven ideas and prototypes. Practical applications are scarce but curiosity pushes research. Early adopters watch for breakthroughs.",
  trigger:
    "The technology trigger draws attention as early successes surface. Media coverage amplifies expectations. Investment pours in despite limited evidence of viability. Enthusiasts believe a revolution is near.",
  peak:
    "Hype reaches its maximum during the peak of inflated expectations. Projects multiply faster than they can prove value. Some pioneers report successes while many more quietly struggle. The market assumes mainstream adoption is imminent.",
  trough:
    "Disillusionment follows when promises remain unfulfilled. Funding dries up and projects are abandoned. Remaining teams refocus on fundamentals to uncover real use cases. Lessons from failed experiments shape the next wave.",
  slope:
    "On the slope of enlightenment, viable practices start to crystallize. Case studies demonstrate tangible benefits. Tooling improves and integration challenges are resolved. Cautious organizations begin pilot programs.",
  plateau:
    "The plateau of productivity signals a maturing technology. Best practices are widely understood and tooling is stable. Adoption expands beyond innovators into the mainstream. Growth becomes predictable and incremental.",
  legacy:
    "Commoditized legacy represents the final phase. Competition drives prices down and differentiation fades. The technology persists but rarely influences strategy. Attention shifts to the next emerging wave.",
};

let overlay, clipRect, leftLine, rightLine, descPanel;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('question-form');
  const input = document.getElementById('question-input');
  const toggleBtn = document.getElementById('theme-toggle');
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  const gartnerContainer = document.getElementById('gartner-container');
  const content = document.getElementById('content-area');
  const errorBanner = document.getElementById('error-banner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    try {
      errorBanner.classList.add('hidden');
      loading.classList.remove('hidden');
      content.classList.add('hidden');
      gartnerContainer.classList.add('hidden');
      highlightSegment(null);

      const data = await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q })
      }).then(r => r.json());

      loading.classList.add('hidden');
      const hasItems = renderResults(data.items);

      if (hasItems) {
        content.classList.remove('hidden');
        gartnerContainer.classList.remove('hidden');
        gartnerContainer.classList.remove('anim-float-in');
        void gartnerContainer.offsetWidth;
        gartnerContainer.classList.add('anim-float-in');
        showToast('Results refreshed for your question.');
      } else {
        errorBanner.textContent = 'Please enter a valid question.';
        errorBanner.classList.remove('hidden');
      }
    } catch (err) {
      console.error(err);
      loading.classList.add('hidden');
      errorBanner.textContent = 'Something went wrong. Please try again.';
      errorBanner.classList.remove('hidden');
    }
  });

  toggleBtn.addEventListener('click', () => {
    const mode = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    setTheme(mode);
  });

  initTheme();
  initGartnerCurve();
});

// Render the list of technologies or a not-found card
function renderResults(items) {
  const container = document.getElementById('results');
  container.innerHTML = '';
  if (!items || !items.length) {
    return false;
  }
  items.forEach((item, i) => container.appendChild(createTechCard(item, i)));
  return true;
}

// Highlight curve segment
function highlightSegment(seg) {
  if (!overlay || !clipRect || !leftLine || !rightLine || !descPanel) return;

  if (!seg || seg === 'none' || !STAGE_RANGES[seg]) {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.setAttribute('visibility', 'hidden'), 400);
    leftLine.setAttribute('visibility', 'hidden');
    rightLine.setAttribute('visibility', 'hidden');
    descPanel.classList.remove('show');
    return;
  }

  const [x1, x2] = STAGE_RANGES[seg];
  clipRect.setAttribute('x', x1);
  clipRect.setAttribute('width', x2 - x1);
  overlay.setAttribute('visibility', 'visible');
  overlay.classList.add('visible');

  leftLine.setAttribute('x1', x1);
  leftLine.setAttribute('x2', x1);
  leftLine.setAttribute('y1', 0);
  leftLine.setAttribute('y2', BASELINE);
  leftLine.setAttribute('visibility', 'visible');

  rightLine.setAttribute('x1', x2);
  rightLine.setAttribute('x2', x2);
  rightLine.setAttribute('y1', 0);
  rightLine.setAttribute('y2', BASELINE);
  rightLine.setAttribute('visibility', 'visible');

  descPanel.textContent = stageDescriptions[seg];
  requestAnimationFrame(() => descPanel.classList.add('show'));
}

function initGartnerCurve() {
  const curvePath =
    "M100 450 C180 420, 220 360, 280 300 C340 220, 420 140, 480 140 C540 140, 600 240, 650 370 C700 440, 780 360, 860 330 C940 310, 1020 320, 1080 340 S1140 380, 1120 360";
  const areaPath = `${curvePath} L1120 ${BASELINE} L100 ${BASELINE} Z`;
  const curve = document.getElementById('gc-curve-path');
  curve.setAttribute('d', curvePath);
  const maskPath = document.getElementById('mask-path');
  maskPath.setAttribute('d', areaPath);

  curve.classList.add('animate-rise');
  maskPath.classList.add('animate-rise');

  overlay = document.getElementById('stage-overlay');
  clipRect = document.getElementById('stage-clip-rect');
  leftLine = document.getElementById('stage-left');
  rightLine = document.getElementById('stage-right');
  descPanel = document.getElementById('stage-description');
}

// Create a technology card with accordion behavior and animation delay
function createTechCard(item, index) {
  const uid = `tech-${index}`;
  const card = document.createElement('div');
  card.className = 'border-b border-slate-200 last:border-b-0 anim-float-in';
  card.style.animationDelay = `${index * 90}ms`;

  card.addEventListener('mouseenter', () => highlightSegment(item.segment));
  card.addEventListener('mouseleave', () => highlightSegment(null));

  const btn = document.createElement('button');
  btn.id = `acc-btn-${uid}`;
  btn.className = 'w-full flex justify-between items-center py-3 px-2 text-left text-sm font-medium hover:bg-white rounded-md focus:outline-none focus-visible:ring-2 ring-teal-500';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', `panel-${uid}`);
  btn.innerHTML = `
    <span>${item.name}</span>
    <svg class="chevron w-5 h-5 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>`;
  btn.addEventListener('click', () => toggleAccordion(uid));

  const panel = document.createElement('div');
  panel.id = `panel-${uid}`;
  panel.className = 'accordion-panel px-2 text-sm text-slate-600';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', btn.id);

  const desc = document.createElement('div');
  const parsedDesc = marked.parse(item.description || "");
  desc.innerHTML = `
    <h4 class="font-medium">Вклад в продажи</h4>
    <div class="mt-1">${parsedDesc}</div>`;

  const instruments = document.createElement('div');
  instruments.innerHTML = `
    <h4 class="font-medium mt-2">Instruments</h4>
    <div class="mt-1 flex flex-wrap gap-2">
      ${item.instruments
        .map(
          (i) =>
            `<span class="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-800 dark:text-teal-100 text-xs">${i}</span>`
        )
        .join('')}
    </div>`;

  const sources = document.createElement('div');
  if (item.sources && item.sources.length) {
    sources.innerHTML = `
      <h4 class="font-medium mt-2">Sources</h4>
      <ul class="list-disc ml-5 mt-1">
        ${item.sources
          .map(
            (s) =>
              `<li><a href="${s.url}" target="_blank" class="underline text-teal-600 dark:text-teal-400">${s.name}</a></li>`
          )
          .join('')}
      </ul>`;
  } else {
    sources.innerHTML =
      '<h4 class="font-medium mt-2">Sources</h4><p class="mt-1">No sources available yet.</p>';
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
