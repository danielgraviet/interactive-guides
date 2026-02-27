// ─── CATEGORY DATA ───────────────────────────────────────────────────────────
const CATEGORIES = {
  'machine-learning': {
    label: 'Machine Learning',
    lessons: [
      {
        title: 'Linear Regression',
        path: './guides/machine-learning/linear-regression/',
        meta: 'Interactive · Regression',
      },
      {
        title: 'Logistic Regression',
        path: './guides/machine-learning/logit-log-regression/',
        meta: 'Flashcards · Log-odds & sigmoid',
      },
      {
        title: 'Bias & Variance',
        path: './guides/machine-learning/bias-variance/',
        meta: 'Interactive · Underfitting & overfitting',
      },
      {
        title: 'Naive Bayes',
        path: './guides/machine-learning/naive-bayes/',
        meta: 'Flashcards · Conditional probability',
      },
      {
        title: 'ROC Curves',
        path: './guides/machine-learning/roc-curves/',
        meta: 'Interactive · FPR, TPR, thresholds',
      },
      {
        title: 'SVMs & Decision Trees',
        path: './guides/machine-learning/svm-decision-trees/',
        meta: 'Flashcards · Gini, info gain',
      },
      {
        title: 'Delta Rule & Perceptron',
        path: './guides/machine-learning/delta-perceptron/',
        meta: 'Flashcards · Neural net fundamentals',
      },
      {
        title: 'Error & Validation',
        path: './guides/machine-learning/error-validation/',
        meta: 'Problem sets · SSE, RMSE, cross-val',
      },
      {
        title: 'Math Foundations',
        path: './guides/machine-learning/cs270-math/',
        meta: 'Calculation practice · KNN, trees, regression',
      },
    ],
  },
  'computer-science': {
    label: 'Computer Science',
    lessons: [
      {
        title: 'Thread Safety & Concurrency',
        path: './guides/computer-science/concurrency/',
        meta: 'Interactive demos · Locks & signaling',
      },
    ],
  },
  'data-science': {
    label: 'Data Science',
    lessons: [
      {
        title: 'Data Science Review',
        path: './guides/data-science/data-science-review/',
        meta: 'Flashcards · Stats, sampling, Seaborn',
      },
    ],
  },
};

// ─── PANEL RENDERING ──────────────────────────────────────────────────────────
function buildPanel(categoryId) {
  const panel = document.getElementById(`panel-${categoryId}`);
  const grid = panel.querySelector('.lesson-grid');
  const lessons = CATEGORIES[categoryId]?.lessons ?? [];

  grid.innerHTML = lessons
    .map(
      ({ title, path, meta }) => `
    <a class="lesson-card" href="${path}">
      <span class="lesson-title">${title}</span>
      <span class="lesson-meta">${meta}</span>
    </a>
  `
    )
    .join('');
}

function openPanel(categoryId) {
  const panel = document.getElementById(`panel-${categoryId}`);
  panel.hidden = false;
  // Double rAF ensures the browser has painted `hidden=false` before animating
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      panel.classList.add('is-open');
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    })
  );
}

function closePanel(categoryId) {
  const panel = document.getElementById(`panel-${categoryId}`);
  panel.classList.remove('is-open');
  panel.addEventListener('transitionend', () => { panel.hidden = true; }, { once: true });
}

function getOpenCategory() {
  const btn = document.querySelector('.category-card[aria-expanded="true"]');
  return btn ? btn.dataset.category : null;
}

function closeAllPanels() {
  document.querySelectorAll('.category-card[aria-expanded="true"]').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    closePanel(btn.dataset.category);
  });
}

function toggleCategory(btn) {
  const categoryId = btn.dataset.category;
  const isOpen = btn.getAttribute('aria-expanded') === 'true';

  closeAllPanels();

  if (!isOpen) {
    buildPanel(categoryId);
    btn.setAttribute('aria-expanded', 'true');
    openPanel(categoryId);
    // Update URL hash without scrolling
    history.replaceState(null, '', `#${categoryId}`);
  } else {
    history.replaceState(null, '', location.pathname);
  }
}

// ─── CATEGORY CARD LISTENERS ─────────────────────────────────────────────────
document.querySelectorAll('.category-card').forEach(btn => {
  btn.addEventListener('click', () => toggleCategory(btn));
});

document.querySelectorAll('.panel-close').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.closest('.sub-panel');
    const categoryId = panel.id.replace('panel-', '');
    const card = document.querySelector(`[data-category="${categoryId}"]`);
    card?.setAttribute('aria-expanded', 'false');
    closePanel(categoryId);
    history.replaceState(null, '', location.pathname);
  });
});

// ─── KEYBOARD NAVIGATION ─────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const openCat = getOpenCategory();
    if (openCat) {
      closeAllPanels();
      document.querySelector(`[data-category="${openCat}"]`)?.focus();
      history.replaceState(null, '', location.pathname);
    }
  }
});

// ─── URL HASH AUTO-OPEN ───────────────────────────────────────────────────────
function openFromHash() {
  const hash = location.hash.slice(1);
  if (hash && CATEGORIES[hash]) {
    const btn = document.querySelector(`[data-category="${hash}"]`);
    if (btn) {
      buildPanel(hash);
      btn.setAttribute('aria-expanded', 'true');
      openPanel(hash);
    }
  }
}

openFromHash();

// ─── SEARCH ──────────────────────────────────────────────────────────────────
const searchInput = document.getElementById('search-input');
const categoryView = document.getElementById('category-view');
const searchResultsEl = document.getElementById('search-results');

// Flatten all lessons for search
const ALL_LESSONS = Object.entries(CATEGORIES).flatMap(([catId, cat]) =>
  cat.lessons.map(lesson => ({ ...lesson, categoryId: catId, categoryLabel: cat.label }))
);

function highlight(text, query) {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<em class="hl">$1</em>');
}

function renderSearchResults(query) {
  const q = query.trim().toLowerCase();

  if (!q) {
    searchResultsEl.classList.remove('active');
    categoryView.style.display = '';
    return;
  }

  categoryView.style.display = 'none';
  searchResultsEl.classList.add('active');

  const matches = ALL_LESSONS.filter(
    l =>
      l.title.toLowerCase().includes(q) ||
      l.categoryLabel.toLowerCase().includes(q) ||
      l.meta.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    searchResultsEl.innerHTML = `<p class="no-results">No guides match "<strong>${query}</strong>".</p>`;
    return;
  }

  // Group by category
  const grouped = {};
  matches.forEach(lesson => {
    if (!grouped[lesson.categoryId]) grouped[lesson.categoryId] = [];
    grouped[lesson.categoryId].push(lesson);
  });

  searchResultsEl.innerHTML = Object.entries(grouped)
    .map(([catId, lessons]) => {
      const catLabel = CATEGORIES[catId].label;
      const cards = lessons
        .map(
          l => `
        <a class="lesson-card" href="${l.path}">
          <span class="lesson-title">${highlight(l.title, query.trim())}</span>
          <span class="lesson-meta">${highlight(l.meta, query.trim())}</span>
        </a>
      `
        )
        .join('');
      return `
      <div class="result-group">
        <div class="result-group-label">${catLabel}</div>
        <div class="result-grid">${cards}</div>
      </div>
    `;
    })
    .join('');
}

searchInput.addEventListener('input', e => renderSearchResults(e.target.value));

// Close panels when search is active
searchInput.addEventListener('focus', () => {
  if (searchInput.value.trim()) closeAllPanels();
});
