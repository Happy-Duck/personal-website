# Rishi Garhyan — Personal Website

**[happy-duck.github.io/personal-website](https://happy-duck.github.io/personal-website)**

A deep-sea themed personal portfolio built with React, Vite, and Tailwind CSS. Toggle between **deep sea** (dark) and **shallow reef** (light) modes — bioluminescent marine snow, caustic light ripples, and roaming sea creatures included.

## Features

- **Dual ocean themes** — deep sea / shallow reef with instant CSS variable transitions and no flash on load
- **Animated background** — marine snow particle canvas, caustic light blobs, depth overlays
- **Interactive creatures** — three reef fish and a jellyfish/turtle that drift across the screen and flee the cursor
- **Projects section** — featured Pelagos card with shimmer effect, mouse-tracking parallax on all cards, scroll-triggered entrance animations
- **Framer Motion** — Hero stagger fade-in, Projects scroll reveal, theme toggle spring

## Stack

- [React 19](https://react.dev) + [Vite 8](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com)
- Deployed via [gh-pages](https://github.com/tschaub/gh-pages) to GitHub Pages

## Development

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run deploy
```

Builds to `dist/` and pushes to the `gh-pages` branch.
