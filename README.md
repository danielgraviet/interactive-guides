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
