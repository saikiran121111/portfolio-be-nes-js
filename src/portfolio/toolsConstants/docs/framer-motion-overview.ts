import { ToolDoc, strip } from '../types';

export const framerMotionOverviewDoc: ToolDoc = {
  key: 'framer-motion',
  title: 'Framer Motion – Project Usage Overview',
  icon: 'Rocket',
  summary: 'Where and how animations are used in the frontend.',
  content: strip(`
Framer Motion – Project Usage Overview

What it is
- Animation library for React used for enter/exit, hover/tap, scroll-linked, and in-view animations.

Where it is used
- ProfileView and its sections (HeaderCard, SkillsSection, ExperienceSection, ProjectsSection, EducationCertsSection, AchievementsLanguagesSection, ReportsSection).
- NavigationTab (inside ProfileView) for the quick navigation drawer, hover/tap interactions, and list item transitions.

Key patterns in this repo
- Variants and easing are centralized in components/portfolio/profile/sections/utils.ts (containerVariants, fadeUpVariants, slideInRightVariants, scaleVariants, EASE_OUT).
- In-view animations via whileInView and viewport options (e.g., once: true, margin: "-120px").
- Hover/tap micro-interactions: whileHover/whileTap for subtle scale/translate/rotate effects.
- Scroll-linked effects: useScroll and useTransform in ProfileView to animate header opacity/scale and the top progress bar.

SSR and client components
- Motion is used only in "use client" components; heavy animated views (ProfileView) are dynamically imported (ProfileViewClient) to avoid SSR constraints.

Adding new animations
- Reuse shared variants from utils.ts for consistency; add new variants there if needed.
- Prefer small, fast transitions (200–600ms) with the shared EASE_OUT; respect reduced motion.
- For lists, stagger via containerVariants (staggerChildren, delayChildren) rather than per-item arbitrary delays.

Performance tips
- Animate transform/opacity properties; avoid layout-thrashing properties where possible.
- Keep offscreen animations gated by viewport and avoid long-running animations on the main thread.
`),
  order: 23,
};
