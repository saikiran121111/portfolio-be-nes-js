import { ToolDoc, strip } from '../types';

export const lucideReactOverviewDoc: ToolDoc = {
  key: 'lucide',
  title: 'lucide-react – Project Usage Overview',
  icon: 'Shapes',
  summary: 'SVG icon usage, styling, and accessibility notes.',
  content: strip(`
lucide-react – Project Usage Overview

What it is
- Icon library of SVGs as React components (tree-shakeable). Used for UI affordances and labels.

Where it is used
- Across profile sections and UI: MapPin, Mail, Phone, Github, ExternalLink, Globe, Calendar, BriefcaseBusiness, GraduationCap, BadgeCheck, Trophy, ShieldCheck, etc.

How icons are styled
- Sized via Tailwind utilities (e.g., size-4/size-5) or by passing width/height; color inherits currentColor from text classes.
- Placed inside interactive elements (buttons/links) with hover states (e.g., text-white/80 → text-white, bg-white/10 → bg-white/20).

Accessibility
- Decorative icons should include aria-hidden="true" or be wrapped with accessible text labels.
- When used as the only content of a control, ensure an accessible name (aria-label or visible text).

Tips
- Import only the icons you use to keep bundles small: import { MapPin, Github } from "lucide-react".
- Keep a consistent size and stroke across components; prefer className-based sizing for uniformity.

Adding a new icon
- Import from lucide-react and drop into your JSX; set size via className or width/height, and rely on text color utilities to tint.
`),
  order: 24,
};
