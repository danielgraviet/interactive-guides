# Technical Overview: Interactive Guides Repo

## Purpose
A local repository of self-contained interactive learning guides built as plain HTML/CSS/JS files. No framework, no build step. Served locally via VS Code Live Server or `npx live-server`. Version controlled with Git/GitHub (private, no hosting).

---

## Tech Stack
- **HTML/CSS/JS** — vanilla only, no frameworks, no bundler
- **Google Fonts CDN** — loaded via `<link>` in each guide's `<head>`
- **No package.json**, no node_modules, no build step
- Served with VS Code Live Server extension or `npx live-server` from repo root

---

## Repo Structure

```
interactive-guides/
├── index.html                  ← root landing page (lists all guides)
├── assets/
│   └── shared.css              ← shared CSS variables and base styles (optional, used by index.html)
├── guides/
│   └── concurrency/
│       └── index.html          ← first guide (already written, content provided below)
├── .gitignore
└── README.md
```

Future guides are added as new folders under `guides/`, each containing their own `index.html`. No other files need to change except the root `index.html` which should get a new card linking to the new guide.

---

## File Specifications

### `/index.html` — Landing Page
A styled page listing all available guides as clickable cards. Each card links to `./guides/<guide-name>/index.html`.

**Design requirements:**
- Match the aesthetic of the existing guide: dark background (`#0d0f0e`), green accent (`#6be584`), `DM Mono` + `Fraunces` fonts from Google Fonts
- One card per guide showing: title, short description, and a tag (e.g. "Threading", "Python")
- Cards should be in a grid layout
- Include a header with the project name

**Initial card to render:**
- Title: `Thread Safety & Concurrent Systems`
- Description: `Locks, closures, dependency injection, daemon threads, and event signaling — with live interactive demos and quizzes.`
- Tag: `Python · Threading`
- Link: `./guides/concurrency/index.html`

---

### `/assets/shared.css` — Shared Styles
Extract the CSS custom properties (variables) and base resets used across guides into this file so the landing page and future guides can optionally import it.

```css
/* Minimum contents */
:root {
  --bg: #0d0f0e;
  --surface: #141614;
  --card: #1a1d1a;
  --border: #252825;
  --accent: #6be584;
  --accent2: #e5c46b;
  --accent3: #6baae5;
  --text: #d4dbd4;
  --muted: #6b776b;
  --danger: #e56b6b;
  --code-bg: #111311;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
}
```

---

### `/guides/concurrency/index.html` — First Guide
This file is already written. Copy it in exactly as provided. Do not modify its contents.

**The full file content is attached at the bottom of this document.**

---

### `/.gitignore`
```
.DS_Store
Thumbs.db
*.log
node_modules/
.vscode/settings.json
```

---

### `/README.md`

```markdown
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

## Adding a New Guide

1. Create a new folder: `guides/<your-guide-name>/`
2. Add an `index.html` inside it (self-contained, all styles and scripts inline)
3. Add a new card to the root `index.html` linking to it

## Structure

```
interactive-guides/
├── index.html          # Landing page
├── assets/
│   └── shared.css      # Shared CSS variables
├── guides/
│   └── concurrency/    # Guide: Thread Safety
│       └── index.html
├── .gitignore
└── README.md
```
```

---

## Git Setup Instructions

Run these commands from the directory where you want the repo to live:

```bash
# 1. Create and enter the repo folder
mkdir interactive-guides && cd interactive-guides

# 2. Initialize git
git init

# 3. Create the folder structure
mkdir -p assets guides/concurrency

# 4. (Copy all files into place as described above)

# 5. Initial commit
git add .
git commit -m "init: landing page + concurrency guide"

# 6. Connect to GitHub (create the repo on GitHub first, then:)
git remote add origin https://github.com/<your-username>/interactive-guides.git
git branch -M main
git push -u origin main
```

---

## Conventions for Future Guides

- Each guide is fully self-contained: all CSS and JS lives inside the single `index.html` — no external files except Google Fonts CDN
- Guides should use the same color palette and fonts as the existing concurrency guide for visual consistency
- Navigation within a guide (prev/next lesson) is handled by JS inside that guide's `index.html`
- The root `index.html` is the only file that needs updating when a new guide is added

---

## Attached: `/guides/concurrency/index.html`

> Copy the full content of the concurrency guide HTML file here verbatim before handing this document to the agent.
> The file is named `concurrency-learner.html` in your Claude outputs — rename it to `index.html` when placing it at `guides/concurrency/index.html`.
