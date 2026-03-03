# Interactive Guides

A collection of self-contained interactive learning guides. No build step required.

## Running Locally

**Option 1 — VS Code Live Server**
1. Open the repo folder in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. Or click the "Go Live" button in the bottom status bar

**Option 2 — npx live-server**
```bash
npx live-server
```
Opens at http://localhost:8080 by default.

## Structure

```
interactive-guides/
├── index.html              # Landing page (category cards + panels)
├── assets/
│   ├── shared.css          # Shared CSS variables
│   └── nav.js              # CATEGORIES data + search + panel logic
├── guides/
│   ├── machine-learning/   # 10 guides
│   ├── computer-science/   # 5 guides
│   ├── data-science/       # 1 guide
│   └── test-prep/          # 1 guide
└── README.md
```

---

## LLM Wiring Instructions

> **Read this section before touching any file.** Adding a guide requires edits to exactly two files.

### Step 1 — Place the guide file

Put the new `index.html` into a new folder under the appropriate category:

```
guides/{category}/{guide-slug}/index.html
```

Existing categories and their folder names:

| Display Name      | Folder name         |
|-------------------|---------------------|
| Machine Learning  | `machine-learning`  |
| Computer Science  | `computer-science`  |
| Data Science      | `data-science`      |
| Test Prep         | `test-prep`         |

If the guide belongs to a new category, see **Adding a New Category** below.

---

### Step 2 — Register the guide in `assets/nav.js`

Open `assets/nav.js`. Find the `CATEGORIES` object at the top of the file. Locate the array for the target category and append a new lesson object:

```js
{
  title: 'Display Title',
  path: './guides/{category}/{guide-slug}/',   // trailing slash required
  meta:  'Format · Short description',
},
```

**`meta` format convention:** `'Type · Topic keywords'`
Examples from the existing guides:
- `'Interactive · Regression'`
- `'Flashcards · Conditional probability'`
- `'Problem sets · SSE, RMSE, cross-val'`
- `'Study plan · Quick review before any exam'`

---

### Step 3 — Update the guide count in `index.html`

Open the root `index.html`. Search for the category by its display name. Update **two** places — both are in the same category block:

1. **Category card tag** (visible on the card itself):
   ```html
   <span class="tag">N guides</span>
   ```

2. **Panel title** (shown inside the expanded sub-panel):
   ```html
   <span class="panel-title">Category Name — N guides</span>
   ```

Increment `N` by 1 in both places.

---

### Adding a New Category

Only needed when the guide doesn't fit an existing category.

**`assets/nav.js`** — add a new key to `CATEGORIES`:
```js
'new-category': {
  label: 'Display Name',
  lessons: [
    {
      title: 'Guide Title',
      path: './guides/new-category/{guide-slug}/',
      meta: 'Format · Description',
    },
  ],
},
```

**`index.html`** — add a category card button and its matching sub-panel `div` inside `<div class="category-grid" id="category-grid">`. Copy the pattern of an existing category block exactly:

```html
<!-- New Category -->
<button
  class="category-card"
  data-category="new-category"
  aria-expanded="false"
  aria-controls="panel-new-category"
>
  <div class="card-tags">
    <span class="tag">Tag</span>
    <span class="tag">1 guide</span>
  </div>
  <h2 class="card-title">Display Name</h2>
  <p class="card-desc">Short description of what this category covers.</p>
  <div class="card-footer">
    <span>Browse lessons</span>
    <span class="card-arrow" aria-hidden="true">↓</span>
  </div>
</button>

<div
  id="panel-new-category"
  class="sub-panel"
  role="region"
  aria-label="Display Name lessons"
  hidden
>
  <div class="sub-panel-inner">
    <div class="panel-header">
      <span class="panel-title">Display Name — 1 guide</span>
      <button class="panel-close" aria-label="Close panel">×</button>
    </div>
    <div class="lesson-grid"></div>
  </div>
</div>
```

The `data-category` on the button and the `id` on the panel **must** match the key used in `CATEGORIES` in `nav.js`. The `.lesson-grid` div is populated dynamically by `buildPanel()` — leave it empty.

---

### Checklist

- [ ] `guides/{category}/{guide-slug}/index.html` exists
- [ ] Lesson object added to correct array in `assets/nav.js`
- [ ] Guide count incremented in `<span class="tag">` in root `index.html`
- [ ] Guide count incremented in `<span class="panel-title">` in root `index.html`
- [ ] (New category only) Category block added to root `index.html`
- [ ] (New category only) New key added to `CATEGORIES` in `assets/nav.js`
