import { ToolDoc, strip } from '../types';

export const frontendSummary: ToolDoc = {
  key: 'nextjs',
  title: 'Portfolio Frontend – Codebase Summary',
  icon: 'Monitor',
  summary: 'Next.js + Tailwind with animated profile and tools pages.',
  content: strip(`
Portfolio Frontend – Codebase Summary

Stack and app structure
- Next.js App Router with server components by default; dynamic client components where needed.
- Tailwind CSS for utility styling; globals.css includes custom variables, animations, and control styles.
- Framer Motion used for animated profile sections and UI micro-interactions.

App folders and pages
- src/app/layout.tsx: Root layout; loads global styles, background, custom cursor, and footer.
- src/app/page.tsx: Homepage; renders branding, background layers, and the Profile/Tools link controls.
- src/app/profile/page.tsx: Profile page; shows the full profile view.
- src/app/tools/page.tsx: Tools landing page (linked from ToolsLink).

Styling and config
- src/app/globals.css: Tailwind base plus custom CSS variables and transitions for the circular link controls.
- tailwind.config.ts: Custom breakpoints (includes desktop alias) and content paths.
- next.config.ts: Next.js config.
- public/*.svg and PNG icon in ToolsLink: Static assets.

API/data layer
- src/config/api.config.ts: API base configuration.
- src/interfaces/*.ts: Strongly typed models (portfolio, user).
- src/dto/*.ts: DTOs for consistent server responses.
- src/mappers/portfolio.mapper.ts: Maps raw API data to UI-ready shapes.
- src/services/portfolio.service.ts: Fetches portfolio data from the API.

Components (one-line each)
- components/cursor/CustomCursor.tsx: Replaces native cursor with a custom animated pointer on desktop.
- components/portfolio/PortfolioName.tsx: Displays “Portfolio” branding with responsive positioning.
- components/portfolio/background/HomepageBackground.tsx: Renders animated/ambient homepage background.
- components/portfolio/bottomHeadline/BottomHeadline.tsx: Shows a secondary headline anchored with offsets.
- components/portfolio/footer/Copyright.tsx: Displays dynamic year and copyright info.
- components/portfolio/intro/IntroLoader.tsx: Intro animation gate for initial page load transitions.
- components/portfolio/logo/Logo.tsx: Clickable logo with clamp/offset positioning and responsive logic.
- components/portfolio/profile/ProfileLink.tsx: Circular bottom-right control linking to /profile with hover expansion; resizable via scale and iconSizePx.
- components/portfolio/tool/ToolsLink.tsx: Circular top-right control linking to /tools with PNG icon; same behavior/sizing props as ProfileLink.
- components/portfolio/profile/ProfileViewClient.tsx: Client wrapper to lazy-load the ProfileView (no SSR).
- components/portfolio/profile/ProfileView.tsx: Full profile experience with sections, quick navigation, and motion effects.
- components/portfolio/profile/sections/HeaderCard.tsx: Profile header (name, headline, contact, socials).
- components/portfolio/profile/sections/SkillsSection.tsx: Skill categories with animated progress bars.
- components/portfolio/profile/sections/ExperienceSection.tsx: Timeline-style job history with details and tags.
- components/portfolio/profile/sections/ProjectsSection.tsx: Project cards with links to repo/live and tech badges.
- components/portfolio/profile/sections/EducationCertsSection.tsx: Education and certifications grid.
- components/portfolio/profile/sections/AchievementsLanguagesSection.tsx: Achievements and languages summary.
- components/portfolio/profile/sections/ReportsSection.tsx: Security/quality report summaries with external links.
- components/portfolio/profile/sections/SocialIcon.tsx: Social link icon renderer.
- components/portfolio/profile/sections/CopyButton.tsx: Click-to-copy UI for contact values.
- components/portfolio/profile/sections/utils.ts: Shared motion variants, easing, formatters, and classNames helper.

Integration notes
- Home renders both ProfileLink and ToolsLink with independent offsets, clamped transforms, and smooth transitions.
- Both controls support global scaling via scale and icon-only scaling via iconSizePx for quick tuning.
`),
  order: 17,
};
