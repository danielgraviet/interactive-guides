# Interactive Guides — Reorganization Technical Outline

## Goal

Scale the project from a flat list of guides into a **category-driven navigation system** where:

1. The landing page shows top-level **category cards**
2. Clicking a category opens an **inline sub-panel** listing all lessons in that category
3. Each lesson card in the panel links to the actual guide
4. The file structure mirrors the navigation hierarchy

No frameworks. No build step. Vanilla HTML / CSS / JavaScript — same stack as today.

---

## Proposed File Structure

```
interactive-guides/
├── index.html                          # Landing page (category grid)
├── assets/
│   ├── shared.css                      # Global design tokens & base styles
│   └── nav.js                          # Shared panel toggle logic (new)
│
└── guides/
    ├── machine-learning/
    │   ├── linear-regression/
    │   │   └── index.html
    │   ├── logit-log-regression/
    │   │   └── index.html
    │   ├── bias-variance/
    │   │   └── index.html
    │   ├── naive-bayes/
    │   │   └── index.html
    │   ├── roc-curves/
    │   │   └── index.html
    │   ├── svm-decision-trees/
    │   │   └── index.html
    │   ├── delta-perceptron/
    │   │   └── index.html
    │   ├── error-validation/
    │   │   └── index.html
    │   └── cs270-math/
    │       └── index.html
    │
    ├── computer-science/
    │   └── concurrency/
    │       └── index.html
    │
    └── data-science/
        └── data-science-review/
            └── index.html
```

**Migration note:** Rename existing flat folders to kebab-case and nest them under their category. Update relative path references in each guide's `back-link` accordingly.

---

## Landing Page Architecture (`index.html`)

### Layout

```
┌─────────────────────────────────────────────────┐
│  Interactive Guides                             │
│  — self-contained learning modules             │
├─────────────────────────────────────────────────┤
│                                                 │
│  [ Machine Learning ]  [ Computer Science ]     │
│  [ Data Science     ]  [ + more... ]            │
│                                                 │
├─────────────────────────────────────────────────┤
│  ▼ SUB-PANEL (expands inline when category      │
│    card is clicked)                             │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Lesson 1 │ │ Lesson 2 │ │ Lesson 3 │        │
│  └──────────┘ └──────────┘ └──────────┘        │
└─────────────────────────────────────────────────┘
```

### Interaction Model

- Category cards live in a grid (same visual language as today's guide cards)
- Clicking a card:
  - Marks it as **active** (accent border, filled background tint)
  - **Expands an inline panel** directly below the category row (not a modal, not a sidebar)
  - Clicking the same card again **collapses** the panel (toggle)
  - Clicking a *different* card **swaps** panel content and scrolls it into view
- The panel renders lesson cards for that category — each card links to its guide
- Panel has a close button (×) in the top-right corner

### Why Inline Panel (Not Modal / Sidebar)

| Approach | Pros | Cons |
|---|---|---|
| **Inline expand** (chosen) | Stays in page flow, no overlay, keyboard friendly, linkable via `#anchor` | Shifts page content down |
| Modal / overlay | No layout shift | Blocks background, harder to skim |
| Sidebar drawer | Familiar pattern | Requires fixed positioning, hides content |
| New page (current cs_270 hub) | Deep-linkable | Extra navigation step, breaks flow |

---

## HTML Structure

### Category Card

```html
<button
  class="category-card"
  data-category="machine-learning"
  aria-expanded="false"
  aria-controls="panel-machine-learning"
>
  <div class="card-tags">
    <span class="tag">CS 270</span>
    <span class="tag">10 guides</span>
  </div>
  <h2 class="card-title">Machine Learning</h2>
  <p class="card-desc">Regression, SVMs, decision trees, neural networks, and more.</p>
  <span class="card-arrow" aria-hidden="true">↓</span>
</button>
```

Using `<button>` (not `<a>`) because it triggers in-page behavior, not navigation. This also gives accessibility roles for free.

### Sub-Panel

```html
<div
  id="panel-machine-learning"
  class="sub-panel"
  role="region"
  aria-label="Machine Learning lessons"
  hidden
>
  <div class="sub-panel-inner">
    <button class="panel-close" aria-label="Close panel">×</button>
    <div class="lesson-grid">
      <!-- Lesson cards injected here — either hardcoded or via JS data object -->
    </div>
  </div>
</div>
```

Place each `.sub-panel` **immediately after its category row** in the DOM so the CSS height animation expands naturally in flow.

### Lesson Card (inside panel)

```html
<a class="lesson-card" href="./guides/machine-learning/naive-bayes/index.html">
  <span class="lesson-title">Naive Bayes</span>
  <span class="lesson-meta">Flashcards · 12 questions</span>
  <!-- lesson-meta is populated from the `meta` field in the CATEGORIES data object -->
</a>
```

---

## CSS Strategy

### Panel Animation

```css
.sub-panel {
  display: grid;
  grid-template-rows: 0fr;          /* collapsed */
  transition: grid-template-rows 0.3s ease;
  overflow: hidden;
}

.sub-panel.is-open {
  grid-template-rows: 1fr;          /* expanded */
}

.sub-panel-inner {
  min-height: 0;                    /* required for grid row animation trick */
  padding: 0;
  transition: padding 0.3s ease;
}

.sub-panel.is-open .sub-panel-inner {
  padding: 1.5rem;
}
```

The `grid-template-rows: 0fr → 1fr` trick animates height without JavaScript height calculations. No `max-height` hacks.

### Active Category State

```css
.category-card[aria-expanded="true"] {
  border-color: var(--accent);
  background: rgba(107, 229, 132, 0.06);
}

.category-card[aria-expanded="true"] .card-arrow {
  transform: rotate(180deg);         /* arrow flips to ↑ when open */
}
```

Drive visual state from the ARIA attribute — keeps JS and CSS in sync automatically.

---

## JavaScript (`assets/nav.js`)

```js
// Data-driven approach: categories and their lessons defined in one place
const CATEGORIES = {
  'machine-learning': {
    lessons: [
      { title: 'Linear Regression',         path: './guides/machine-learning/linear-regression/' },
      { title: 'Logistic Regression',        path: './guides/machine-learning/logit-log-regression/' },
      { title: 'Bias & Variance',            path: './guides/machine-learning/bias-variance/' },
      { title: 'Naive Bayes',                path: './guides/machine-learning/naive-bayes/' },
      { title: 'ROC Curves',                 path: './guides/machine-learning/roc-curves/' },
      { title: 'SVMs & Decision Trees',      path: './guides/machine-learning/svm-decision-trees/' },
      { title: 'Delta Rule & Perceptron',    path: './guides/machine-learning/delta-perceptron/' },
      { title: 'Error & Validation',         path: './guides/machine-learning/error-validation/' },
      { title: 'CS 270 Math Foundations',    path: './guides/machine-learning/cs270-math/' },
    ]
  },
  'computer-science': {
    lessons: [
      { title: 'Thread Safety & Concurrency', path: './guides/computer-science/concurrency/' },
    ]
  },
  'data-science': {
    lessons: [
      { title: 'Data Science Review', path: './guides/data-science/data-science-review/' },
    ]
  }
};

function buildPanel(categoryId) {
  const panel = document.getElementById(`panel-${categoryId}`);
  const grid = panel.querySelector('.lesson-grid');
  const lessons = CATEGORIES[categoryId]?.lessons ?? [];

  grid.innerHTML = lessons.map(({ title, path }) => `
    <a class="lesson-card" href="${path}">
      <span class="lesson-title">${title}</span>
    </a>
  `).join('');
}

function openPanel(categoryId) {
  const panel = document.getElementById(`panel-${categoryId}`);
  panel.hidden = false;
  requestAnimationFrame(() => panel.classList.add('is-open'));
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closePanel(categoryId) {
  const panel = document.getElementById(`panel-${categoryId}`);
  panel.classList.remove('is-open');
  panel.addEventListener('transitionend', () => { panel.hidden = true; }, { once: true });
}

function toggleCategory(btn) {
  const categoryId = btn.dataset.category;
  const isOpen = btn.getAttribute('aria-expanded') === 'true';

  // Close all open panels
  document.querySelectorAll('.category-card[aria-expanded="true"]').forEach(openBtn => {
    openBtn.setAttribute('aria-expanded', 'false');
    closePanel(openBtn.dataset.category);
  });

  if (!isOpen) {
    buildPanel(categoryId);                        // lazy-render lesson cards
    btn.setAttribute('aria-expanded', 'true');
    openPanel(categoryId);
  }
}

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
  });
});
```

**Lessons are rendered lazily** — the JS only builds the inner HTML when the panel is first opened, keeping the initial page payload small.

---

## Migration Steps

### Phase 1 — Restructure files (no UI changes)

1. Create `guides/machine-learning/`, `guides/computer-science/`, `guides/data-science/` directories
2. Move and rename existing guide folders into the correct category
3. Update the `back-link` path in every guide (`../../index.html` → `../../../index.html` since nesting is now 3 levels deep)
4. Verify all internal asset/CSS relative paths within each guide still resolve

### Phase 2 — Update landing page

1. Replace the current guide card grid with category cards (new HTML structure above)
2. Add a `.sub-panel` div after each category card
3. Add `assets/nav.js` and link it at the bottom of `index.html`
4. Add panel CSS (either inline in `index.html` or extend `assets/shared.css`)
5. Remove the now-redundant `guides/cs_270/index.html` hub page (its role is replaced by the ML panel)
6. Add search input above the category grid; wire up client-side filter in `nav.js`

### Phase 3 — Polish

1. Add a lesson count badge to each category card (driven from `CATEGORIES` data object)
2. Add keyboard navigation: `Escape` closes the active panel
3. Add URL hash support: `index.html#machine-learning` auto-opens the correct panel on load
4. Persist last-opened category to `localStorage` so it re-opens on return visits (optional)

---

## Adding New Guides (Future Workflow)

1. Create `guides/<category>/<guide-name>/index.html`
2. Add one entry to the `CATEGORIES` object in `nav.js`
3. Done — the panel renders it automatically

No changes to `index.html` HTML required after the initial setup.

---

## Accessibility Checklist

- [ ] Category cards are `<button>` elements (keyboard focusable, Enter/Space activatable)
- [ ] `aria-expanded` on each card reflects open/closed state
- [ ] `aria-controls` links card to its panel
- [ ] Panel has `role="region"` and `aria-label`
- [ ] `hidden` attribute on closed panels (not just `display:none` via CSS)
- [ ] Close button has `aria-label="Close panel"`
- [ ] `Escape` key closes the active panel
- [ ] Lesson cards are `<a>` elements with descriptive text

---

## Decisions

1. **How many top-level categories?** — **3 for now** (Machine Learning, Computer Science, Data Science). Add more categories only when new content clearly warrants a new grouping.

2. **Keep category hub pages?** — **No, remove them.** The inline panel fully replaces their function. Back-links in each guide point to `index.html#<category>` which auto-opens the correct panel, so deep linking still works without maintaining separate hub pages.

3. **Lesson metadata** — **Yes, show light metadata.** Each entry in the `CATEGORIES` data object will include a `meta` field (e.g., `"Flashcards · 12 questions"`, `"Interactive demo"`). This also powers the search feature so results can display type and topic at a glance.

4. **Search** — **Scoped in.** A client-side text filter above the category grid, searching across lesson titles and metadata. **No framework switch needed** — a 20-line vanilla JS filter over the `CATEGORIES` object will be instant at this scale and preserves the "Go Live" workflow you rely on. Next.js would add a build step, `npm run dev`, and Node.js as a dependency without providing any benefit for a static content site. Vercel deploys vanilla HTML just as cleanly.

   **Search UX:** A single `<input>` above the category grid. As you type, lesson cards across all categories are filtered in real time. Categories with zero matches collapse automatically. Results show lesson title + metadata snippet.

   Updated `CATEGORIES` entry shape:
   ```js
   { title: 'Naive Bayes', path: '...', meta: 'Flashcards · 12 questions', tags: ['ML', 'probability'] }
   ```
