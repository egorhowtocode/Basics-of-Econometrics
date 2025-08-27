// Frontend logic for search, accordion, dark mode, and toasts

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('question-form');
  const input = document.getElementById('question-input');
  const toggleBtn = document.getElementById('theme-toggle');
  const chatWindow = document.getElementById('chat-window');
  const targetQuestion = 'Which AI technologies are used to enhance financial time series forecasting performance by processing multi-period inputs?';
  const markdownText = `
## Технологии для предиктивной аналитики и их применение в улучшении продаж

1. **Video marketing analytics with AI (AI-аналитика видео-маркетинга)**

   * **Используемые инструменты:** RapidMiner, CatBoost, machine learning
   * **Вклад в продажи:** Повышает точность прогнозирования эффективности маркетинговых кампаний через автоматическую обработку данных и сегментацию клиентов. Улучшает стратегическое планирование за счёт анализа поведения аудитории (Santos & Malta, 2023; Santos et al., 2024).

2. **AI-technologies (ИИ-технологии)**

   * **Используемые инструменты:** Natural language processing (NLP), machine learning
   * **Вклад в продажи:** NLP автоматизирует обработку текстовых данных для выявления трендов, а ML обеспечивает прогностические инсайты и когнитивное принятие решений. Ускоряет адаптацию маркетинговых стратегий к запросам клиентов (Plata Lerma et al., 2023).

3. **Predictive modeling for churn prevention (Прогнозная модель удержания клиентов)**

   * **Используемые инструменты:** k-Nearest Neighbors (kNN)
   * **Вклад в продажи:** Алгоритм классифицирует риски оттока клиентов, позволяя заранее внедрять персонализированные меры удержания. Снижает потери дохода за счёт раннего выявления проблемных сегментов (Sasse et al., 2025).

4. **AI-driven digital marketing analytics (ИИ-аналитика цифрового маркетинга)**

   * **Используемые инструменты:** Deep neural networks
   * **Вклад в продажи:** Глубокие нейронные сети оптимизируют прогнозирование метрик эффективности рекламы, повышая точность таргетирования и ROI кампаний. Улучшают автоматизацию маркетинговых процессов (Wei et al., 2024).

---

### Список источников

* Santos, V., & Malta, P. (2023). *The Impact of Digital Transformation on Innovation in European Companies*. ICMarkTech.
* Santos, V., & Malta, P. (2024). *Evaluating the Impact of MarTech on Digital Transformation in EU Companies*. ICMarkTech.
* Plata Lerma, D. F., Kwarteng, M. A., Ntsiful, A., Owusu, V. K., & Amankwah, E. S. (2023). *Beyond UTAUT: AI Adoption in SMEs*. SMA.
* Sasse, L., Nicolaisen-Soberky, E., et al. (2025). *Overview of leakage scenarios in supervised machine learning*. *Journal of Big Data*. DOI: 10.1186/...
* Wei, C., Zelditch, B., Chen, J., & Ribeiro, A. A. S. T. (2024). *Neural Optimization for Intelligent Marketing Systems*. KDD. DOI: 10.1145/3637528...
`;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    try {
      const res = await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q })
      });
      const data = await res.json();
      renderResults(data.items);
      handleChatWindow(q);
      showToast('Results refreshed for your question.');
    } catch (err) {
      console.error(err);
    }
  });

  toggleBtn.addEventListener('click', () => {
    const mode = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    setTheme(mode);
  });

  initTheme();

  function handleChatWindow(q) {
    if (!chatWindow) return;
    if (q.toLowerCase() === targetQuestion.toLowerCase()) {
      if (window.marked) {
        chatWindow.innerHTML = window.marked.parse(markdownText);
      } else {
        chatWindow.textContent = markdownText;
      }
      chatWindow.classList.remove('hidden');
      chatWindow.classList.remove('anim-float-in');
      void chatWindow.offsetWidth;
      chatWindow.classList.add('anim-float-in');
    } else {
      chatWindow.classList.add('hidden');
      chatWindow.classList.remove('anim-float-in');
      chatWindow.innerHTML = '';
    }
  }
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
  const segments = document.querySelectorAll('#gartner-curve .gc-segment');
  segments.forEach(s => s.classList.remove('active'));
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
      <p class="text-sm text-slate-500 dark:text-slate-400">${item.summary}</p>
    </span>
    <svg class="chevron w-5 h-5 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>`;
  btn.addEventListener('click', () => toggleAccordion(item.id));

  const panel = document.createElement('div');
  panel.id = `panel-${item.id}`;
  panel.className = 'accordion-panel px-4';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', btn.id);

  const instruments = document.createElement('div');
  instruments.innerHTML = `
    <h4 class="font-medium">Instruments</h4>
    <div class="mt-1 flex flex-wrap gap-2">
      ${item.instruments
        .map(i => `<span class="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-800 dark:text-teal-100 text-sm">${i}</span>`)
        .join('')}
    </div>`;

  const sources = document.createElement('div');
  sources.innerHTML = '<h4 class="font-medium mt-2">Sources</h4><p class="text-sm text-slate-500 dark:text-slate-400 mt-1">No sources available yet.</p>';

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
