# Pixel-Skinned Bento Redesign — Design Spec

**Date:** 2026-06-11
**Status:** Approved by Zayden (direction, palette, typography, extras all confirmed in brainstorming)

## Goal

Redesign the existing portfolio (Astro / astro-erudite, Catppuccin-themed bento homepage)
into a pixel-art styled interactive portfolio. All content, routes, and infrastructure stay
the same — this is a visual and interaction reskin, not a rebuild.

## Decisions made

| Decision | Choice |
|---|---|
| Direction | A — pixel-skinned bento (keep current layout/UX, reskin everything) |
| Palette | Catppuccin Latte/Mocha base + green accent pop (`#40a02b` light / `#a6e3a1` dark) |
| Typography | Pixel fonts everywhere **except** blog article prose |
| Extras | CRT scanline toggle, boot sequence, 8-bit sounds + Konami code. **No** living-mascot upgrade (mascot keeps current wave). |

## 1. Design system (`src/styles/global.css`)

- Keep all existing Catppuccin Latte/Mocha CSS variables and the `data-theme` light/dark toggle.
- The existing `--accent` is replaced by the Catppuccin green: `#40a02b` (light) / `#a6e3a1` (dark).
- New tokens:
  - `--pixel-border`: 2px solid `var(--border)` — all cards, buttons, chips.
  - `--shadow-hard`: `4px 4px 0` in a "crust" dark color (`#11111b` dark mode, `#bcc0cc`-ish light mode).
  - `--shadow-accent`: `4px 4px 0 var(--accent)` — hero card and featured/highlighted cards only.
- `border-radius: 0` globally (cards, buttons, badges, heatmap cells, avatar, skill bars).
- Clickable cards on hover: `translate(-2px, -2px)` + shadow grows to `6px 6px 0` (replaces the
  current glow). Active state: translate back + shadow shrinks (pressed look).
- Card section labels become `▸ LABEL` in pixel font with accent color.
- Dithering utility (CSS `repeating-linear-gradient` checker pattern) available for decorative fills.
- Respect `prefers-reduced-motion` for all new animations.

## 2. Typography

- **Press Start 2P** (via `@fontsource/press-start-2p`): headings, nav, card labels, buttons,
  dates/metadata. Used at small sizes with generous letter-spacing; sized in px multiples that
  render crisply.
- **Pixelify Sans** (via `@fontsource/pixelify-sans`): general UI body text — bento card body
  copy, descriptions, blog listing excerpts. Pixel character but readable at 14–16px.
- **JetBrains Mono** (already present): blog article prose — paragraphs, lists, inline code.
  Code blocks (expressive-code) and KaTeX untouched.
- Outfit Variable can be dropped if no longer referenced.

## 3. Pages & components (all reskinned, content unchanged)

- **Header:** logo renders `z8dn_` with blinking cursor (CSS animation); nav as `[blog] [work]`;
  toggle cluster: sound, CRT, theme — all square pixel buttons.
- **Footer:** pixel-styled, content unchanged.
- **Homepage bento:** same grid and data, reskinned widgets:
  - Clock: pixel font, blinking colon.
  - Heatmap: square cells, accent-green ramp (existing `--gh-*` vars adjusted to green ramp).
  - Skill bars: segmented pixel blocks (discrete cells) instead of continuous bars.
  - Career timeline: square markers (`▣` active / `□` past), pixel dates.
  - Hero card gets the accent shadow; mascot unchanged.
  - Intro tagline becomes a flavor line: `AKA Z8DN ▸ ANDROID DEV ▸ HCMC` (replaces the
    current "also known as z8dn" line).
- **Blog listing / BlogCard, tags, authors, work / ProjectCard, pagination, breadcrumbs:**
  square corners, 2px borders, hard shadows, pixel headings/metadata.
- **Blog post pages:** chrome (title, TOC, post navigation, subposts sidebar, callouts) pixel-styled;
  prose stays JetBrains Mono via `typography.css`.
- **404:** new "GAME OVER — CONTINUE? ▸ YES" pixel screen; YES links home.

## 4. Interactive extras

All client scripts follow the existing `astro:page-load` / `astro:before-swap` re-init pattern.

- **Boot sequence:** once per browser session (`sessionStorage`), ~1.5s skippable overlay
  ("z8dn OS v1.0" + chunky loading bar). Any key/click skips. Not shown when
  `prefers-reduced-motion`, and rendered as a client-only overlay so SEO/crawlers see content.
- **CRT toggle:** header button toggles a `data-crt` attribute on `<html>`; CSS overlay with
  scanlines (`repeating-linear-gradient`) + subtle phosphor glow. Persisted in `localStorage`,
  applied pre-paint like the theme toggle to avoid flash.
- **Sounds:** WebAudio-generated square-wave bleeps (no audio assets) on nav clicks and card
  hovers. **Off by default**, header toggle, persisted in `localStorage`.
- **Konami code:** ↑↑↓↓←→←→BA listener triggers a one-shot pixel-invader fly-by animation.

## 5. Out of scope / unchanged

- All content (posts, projects, author), routes, RSS, sitemap, SEO meta, OG images.
- Build pipeline, Fly.io deploy, Dockerfile, GitHub Actions.
- Mascot behavior beyond existing wave.
- React/radix UI components stay (restyled via CSS/classes only where used).

## Error handling & testing

- All extras are progressive enhancement: with JS disabled the site renders fully (no boot
  overlay blocking, sounds/CRT simply absent).
- Verify: `npm run build` (includes `astro check`) passes; manual visual pass on home, blog
  listing, the Gradle post (long-form readability, code blocks, math), work, tags, 404 in both
  themes; reduced-motion check; mobile layout check.
