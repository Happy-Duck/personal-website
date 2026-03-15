# Rishi Garhyan — Personal Website

**[happy-duck.github.io](https://happy-duck.github.io/)**

An immersive deep-sea themed portfolio built with React and Vite. Scroll from the sunlit surface to the abyssal depths — the entire page transforms as you dive, with color-interpolated backgrounds, roaming sea creatures, and bioluminescent effects.

## Features

- **Continuous ocean depth system** — scroll position maps to 0–6000m across four zones (Sunlit, Twilight, Midnight, Abyssal), driving background color, text color, theme switching, and creature visibility
- **10+ animated sea creatures** — reef fish, sea turtle, jellyfish, squid, anglerfish, deep-sea fish, giant squid, abyssal jellyfish, and snailfish — each with sinusoidal swimming, mouse-flee behavior, peer repulsion, and parallax scrolling
- **Layered ocean atmosphere** — water surface caustics, plankton near the surface, marine snow particles at depth, hydrothermal vents near the abyss floor
- **Persistent contact sidebar** — frosted-glass orbs (Email, LinkedIn, GitHub, Resume) fixed on the left edge with theme-aware styling
- **Interactive depth gauge** — real-time depth meter and zone indicator on the right edge
- **Project cards** — shimmer effects, mouse-tracking parallax, scroll-triggered entrance animations
- **SEO optimized** — Open Graph / Twitter Card meta tags, JSON-LD structured data, sitemap, robots.txt, noscript fallback

## Stack

- [React 19](https://react.dev) + [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)
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
