import { ToolDoc, strip } from '../types';

export const tailwindOverviewDoc: ToolDoc = {
  key: 'tailwind',
  title: 'Tailwind CSS – Project Usage Overview',
  icon: 'Wind',
  summary: 'How Tailwind is configured and used.',
  content: strip(`
Tailwind CSS – Project Usage Overview

What it is
- Utility-first CSS framework used for rapid styling and consistent design tokens.

Where it is configured
- tailwind.config.ts: Defines content scanning (./src/**/*) and screens (sm/md/lg/xl/2xl plus desktop alias for lg).
- src/app/globals.css: Imports Tailwind and layers custom CSS variables and component styles on top.

How it’s used in this repo
- Applied in almost every component for layout, spacing, typography, colors, borders, shadows, and responsive behavior.
- Common patterns: container mx-auto max-w-* px-4 py-10, grid/flex utilities, rounded-2xl, border-white/10, bg-white/5, backdrop-blur, text-white/70.
- Responsive classes (md:, lg:, xl:) and an additional desktop alias to target ≥1024px.
- Pointer-events layering: wrappers use pointer-events-none, inner interactive elements use pointer-events-auto.

Custom CSS + Tailwind
- src/app/globals.css defines CSS variables and complex transitions for circular controls (.profile-link) while layout and positioning leverage Tailwind utilities.
- CSS vars drive responsive offsets/clamping (e.g., translate with var(--profile-x-*)). Tailwind sets positioning, sizing, and z-index.

Tips and patterns
- Compose utilities for most needs; use globals.css only for complex states, animations, or CSS variables.
- Prefer semantic spacing/typography scales; keep custom px only when aligning with design tokens.
- Respect reduced motion (prefers-reduced-motion) as done for the profile control transitions.

Extending Tailwind
- Add theme extensions or plugins in tailwind.config.ts if frequently repeating custom styles.
- Ensure new source folders are included in content to avoid purging required classes.
`),
  order: 28,
};
