# Directions For Adding A New Interactive Guide

Use this file as the default playbook. It is optimized for low-token, low-exploration guide wiring.

## Goal

When a new guide is added, make it discoverable from all relevant entry points without unnecessary repo scanning.

## Default Assumption

Most guide additions require updates in up to 4 places:

1. Create the new guide folder and `index.html`
2. Register the guide in `assets/nav.js`
3. Update the root landing page counts in `index.html`
4. Update the category landing page at `guides/{category}/index.html`

`README.md` documents the minimum homepage wiring. In practice, category pages also need to be kept in sync.

## Files To Check First

Read only these unless the task explicitly requires more:

- `README.md`
- `assets/nav.js`
- `index.html`
- `guides/{category}/index.html`
- `guides/{category}/{guide-slug}/index.html`

Do not scan the whole repo unless something is inconsistent.

## Repo Model

### Root landing page

- `index.html` contains the category cards and panel headers
- `assets/nav.js` contains the `CATEGORIES` object used to populate lesson cards inside each root panel

### Category landing pages

- Many categories also have a dedicated page at `guides/{category}/index.html`
- These pages contain a static `.guide-grid`
- Adding a guide should usually also add a matching card here

### Guide files

- Each guide lives at:

```text
guides/{category}/{guide-slug}/index.html
```

- Paths in `assets/nav.js` should usually use a trailing slash:

```js
path: './guides/{category}/{guide-slug}/'
```

- Paths in category landing pages are typically relative, for example:

```html
href="./ethics/"
```

## Existing Categories

Use these folder keys unless the user explicitly wants a new category:

- `machine-learning`
- `computer-science`
- `data-science`
- `test-prep`
- `reinforcement-learning`

## Fast Workflow

### 1. Confirm the target guide exists

Expected location:

```text
guides/{category}/{guide-slug}/index.html
```

If it does not exist, create it first.

### 2. Extract metadata from the guide itself

Pull these from the new guide file when possible:

- page title
- visible H1
- subtitle or short summary
- subject/type cues for the `meta` field

Use the guide’s own wording to avoid inventing titles.

### 3. Add the lesson to `assets/nav.js`

Find:

```js
const CATEGORIES = {
```

Append a lesson object inside the correct category:

```js
{
  title: 'Display Title',
  path: './guides/{category}/{guide-slug}/',
  meta: 'Type · Short topic summary',
},
```

### 4. Update root `index.html`

Find the matching category block and update both:

```html
<span class="tag">N guides</span>
```

and

```html
<span class="panel-title">Category Name — N guides</span>
```

Increment both counts by 1.

### 5. Update `guides/{category}/index.html`

Most category pages have:

- a section count like `N guides`
- a static list of `<a class="guide-card" ...>`

Do both:

1. Increment the local section count
2. Add a new `guide-card` for the lesson

Use the existing card format in that file instead of inventing a new structure.

### 6. Verify consistency

Check that all three navigation surfaces agree:

- `assets/nav.js`
- root `index.html`
- `guides/{category}/index.html`

## Required Output Shape

### `assets/nav.js`

Follow the existing style exactly:

```js
{
  title: 'Ethics in Data Science',
  path: './guides/data-science/ethics/',
  meta: 'Interactive · Privacy, bias, consent, misleading statistics',
},
```

Rules:

- keep object formatting consistent with neighboring entries
- use a trailing slash in `path`
- keep `meta` short and scannable
- prefer the category’s existing naming style

## Root `index.html` Rules

Only change the target category block unless asked otherwise.

Update exactly 2 count locations:

1. the category card tag
2. the expanded panel title

Do not manually add lesson cards to the root panel; those are rendered from `assets/nav.js`.

## Category Page Rules

On `guides/{category}/index.html`:

- update the visible guide count
- append a new guide card in the existing visual style
- keep `href` relative to that page
- keep the card’s tag/title/description aligned with neighboring cards

Typical shape:

```html
<a class="guide-card" href="./{guide-slug}/">
  <div class="guide-tag">Interactive · Topic</div>
  <div class="guide-title">Guide Title</div>
  <div class="guide-desc">One-sentence description.</div>
  <div class="guide-arrow">Open guide →</div>
</a>
```

## How To Write `meta`

Use:

```text
Type · keywords
```

Good examples:

- `Interactive · Regression`
- `Flashcards · Conditional probability`
- `Problem sets · SSE, RMSE, cross-val`
- `Study plan · Quick review before any exam`
- `Interactive · Privacy, bias, consent, misleading statistics`

Guidelines:

- 1 short type label
- 1 short phrase of searchable concepts
- no full sentences unless the category already uses them

## How To Choose The Visible Card Text

Prefer this priority order:

1. guide H1
2. guide `<title>` cleaned up for display
3. nearby repo naming conventions

Descriptions should be 1 sentence and should summarize what the learner will do or understand.

## New Category Workflow

Only do this if no existing category fits.

### In `assets/nav.js`

Add a new category key:

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

### In root `index.html`

Add both:

1. a new category card button
2. its matching sub-panel

Critical consistency rules:

- `data-category="new-category"` must match
- `id="panel-new-category"` must match
- `.lesson-grid` stays empty
- the panel contents are populated by `buildPanel()`

### In `guides/new-category/index.html`

Create a category landing page if the repo pattern supports one.

## Do Not Do These

- do not update only `README.md` and stop
- do not change unrelated category counts
- do not manually hardcode root panel lesson cards
- do not omit the category page when one already exists
- do not use inconsistent path formats
- do not rename existing categories without explicit instruction

## Minimal Verification

Run targeted checks, not broad ones:

1. confirm the new guide path exists
2. confirm the guide title/path appears in `assets/nav.js`
3. confirm the root category count changed in both places
4. confirm `guides/{category}/index.html` shows the new count and card

Example verification queries:

```bash
rg -n "{guide-slug}|Guide Title|N guides" assets/nav.js index.html guides/{category}/index.html
```

## Short Execution Template For Agents

Use this exact sequence:

1. Read `README.md`
2. Read `assets/nav.js`
3. Read `index.html` around the target category block
4. Read `guides/{category}/index.html`
5. Read `guides/{category}/{guide-slug}/index.html`
6. Patch `assets/nav.js`
7. Patch root `index.html`
8. Patch `guides/{category}/index.html`
9. Verify all 3 entry points agree

## Completion Checklist

- [ ] `guides/{category}/{guide-slug}/index.html` exists
- [ ] lesson added to the correct `CATEGORIES` array in `assets/nav.js`
- [ ] root `index.html` category tag count updated
- [ ] root `index.html` panel title count updated
- [ ] `guides/{category}/index.html` local guide count updated
- [ ] `guides/{category}/index.html` new guide card added
- [ ] paths are correct and consistent
- [ ] naming and descriptions match the guide content

## One-Line Summary

Adding a guide means wiring the guide file, the root dynamic registry, the root count display, and the category landing page so every browse surface stays consistent.
