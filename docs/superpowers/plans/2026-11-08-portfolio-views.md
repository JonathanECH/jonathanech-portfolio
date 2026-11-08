# Portfolio Views — Implementation Plan

**Spec:** Motion Driven portfolio brief (HomeView + TilyShop ProjectDetailView).
**Reference:** `stitch_motion_driven_developer_portfolio.zip` (DESIGN.md + HTML mockups).
**Stack:** Vue 3.5 · TypeScript strict · Vite 8 · Tailwind CSS v4 · Pinia · vue-router 5 · pnpm.

## Global Constraints

- pnpm only. Never run `npm`/`yarn`, never edit `pnpm-lock.yaml` manually.
- Tailwind v4 is CSS-first: tokens live in `src/styles/main.css` (`@theme`), not `tailwind.config.ts`.
- Tokens: `background`, `surface`, `surface-card`, `surface-card-hover`, `border`, `border-hover`, `cyan-accent`, `cyan-glow`, `muted`; fonts `sans` (Plus Jakarta Sans) and `mono` (JetBrains Mono).
- UI copy in Spanish. Technical labels may be English/uppercase.
- Icons: UI from `@lucide/vue`; technology/social brands from `simple-icons` through `TechIcon.vue`/`SocialIcon.vue`.
- No backend, no contact form, no new dependencies.
- Accessibility: semantic landmarks, keyboard support, visible focus, `aria-*`, reduced-motion support.
- Responsive from 320px to 1440px+.
- Tests cover the data/store layer only; presentational components are verified by typecheck + build + review (approved plan: no fragile UI tests).

## Task 1: Foundation (coordinator)

**Produces:** Vite scaffold, Tailwind v4 theme, router, Pinia store, typed data, composables, navbar/footer, UI primitives, placeholder views.
**Expected:** `pnpm typecheck` and `pnpm build` pass; `pnpm test` → 10/10.
**Commit:** `feat: scaffold portfolio foundation`.

## Task 2: Home — Hero + Tech Ecosystem (Agent 1)

**Files (only these):** `src/components/home/HeroSection.vue`, `TechEcosystem.vue`, `TechCard.vue`.
**Consumes:** `profile`, `usePortfolioStore`, `techFilterOptions`, `SectionHeading.vue`, `TechIcon.vue`, tokens.
**Behavior:** kinetic cursor spotlight (`--mouse-x/--mouse-y`, rAF, reduced-motion/touch safe); H1 two-line with cyan glow; CTAs; stats strip. Stack section with `// CORE TECHNOLOGIES & TOOLCHAIN // SYS_SPECS`, 5 filter badges with counts, staggered fade-up on filter change, 11 cards.
**Expected:** components type-safe, no edits outside scope.
**Commit:** part of integration commit.

## Task 3: Home — Projects, Modal, About, Contact (Agent 2)

**Files (only these):** `src/components/home/ProjectCard.vue`, `ProjectsShowcase.vue`, `ProjectQuickModal.vue`, `AboutSection.vue`, `ContactSection.vue`.
**Consumes:** `projects`, `profile`, `contactChannels`, `usePortfolioStore`, `useClipboard`, `useScrollLock`, `useFocusTrap`, `SectionHeading.vue`, `SocialIcon.vue`.
**Behavior:** 3 project cards (full-card link + quick-view button); modal via `Teleport` with backdrop blur, scroll lock, focus trap, Esc/backdrop close, metrics and CTA to detail; about editor `~/profile/philosophy.md` + performance/Locus cards; 4 direct contact cards, email copy with “¡Copiado!” feedback.
**Expected:** components type-safe, no edits outside scope.
**Commit:** part of integration commit.

## Task 4: Detail — Header, Specs, Audit, Modules, Pager (Agent 3)

**Files (only these):** `src/components/detail/ProjectHeader.vue`, `ProjectSpecs.vue`, `ChallengeAudit.vue`, `ArchitectureModules.vue`, `ProjectPager.vue`.
**Consumes:** `Project` type, `SectionHeading.vue`, tokens.
**Behavior:** breadcrumb/back, year/status, split title with cyan highlight, demo/repo/whitepaper actions, 4-column spec grid, challenge findings + audit report (4,820 ms → 42 ms → 0.00%), 3 MOD cards, previous/next navigation.
**Expected:** components type-safe, no edits outside scope.
**Commit:** part of integration commit.

## Task 5: Detail — Cinematic Gallery (Agent 4)

**Files (only these):** `src/composables/useCinematicCarousel.ts`, `src/components/detail/MockupCanvas.vue`, `src/components/detail/ProjectGallery.vue`.
**Consumes:** `Project`, `GallerySlide`, `MockupVariant`, tokens, `@lucide/vue`.
**Behavior:** 4.8s autoplay, pause on hover/focus, resume on leave, manual controls reset timer, cleanup on unmount/route change, reduced-motion + visibility handling; console HUD bar (traffic lights, dynamic URL, autoplay state, counter, HTTPS badge); pills/arrows/keyboard; caption + badges; CSS/SVG mockups for 6 variants with optional `image` override.
**Expected:** timer leaks prevented; components type-safe; no edits outside scope.
**Commit:** part of integration commit.

## Task 6: Integration & Verification (coordinator)

**Files:** `src/views/HomeView.vue`, `ProjectDetailView.vue`, `App.vue` (if needed), `public/cv/*.pdf`, `public/docs/*.pdf`, `README.md`.
**Steps:** assemble views, add placeholder PDFs, responsive/a11y polish, run `pnpm verify`, smoke-test preview routes, commit, final fresh review.
**Expected:** `pnpm verify` green; preview `/` and `/proyectos/tilyshop-inventory` return 200.
**Commit:** `feat: implement portfolio home and project detail views`.

## Verification Commands

- `pnpm test` → 10/10
- `pnpm typecheck` → clean
- `pnpm build` → success
- `pnpm preview` + curl `/` and `/proyectos/tilyshop-inventory`
