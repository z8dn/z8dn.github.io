# Pixel-Skinned Bento Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin the existing Astro portfolio into a pixel-art style (Catppuccin + green accent, pixel fonts, hard shadows) and add boot sequence, CRT toggle, opt-in 8-bit sounds, and a Konami easter egg — content and routes unchanged.

**Architecture:** All visual change flows from `src/styles/global.css` (new fonts, tokens, `.pixel-*` utility classes, global `border-radius: 0`) so component edits are mostly class swaps. Interactive extras are three small self-contained Astro components (`BootScreen`, `CrtToggle`, `SoundFx`) wired into `Layout.astro`/`Header.astro`, each following the existing `astro:page-load` / pre-paint `is:inline` patterns already used by `ThemeToggle`.

**Tech Stack:** Astro 5, Tailwind CSS v4, @fontsource (Press Start 2P, Pixelify Sans, JetBrains Mono), WebAudio API (no audio assets).

**Spec:** `docs/superpowers/specs/2026-06-11-pixel-redesign-design.md`

**Verification model:** This is a visual reskin — there is no unit test runner in this repo. Every task's verify step is `npm run build` (which runs `astro check` type-checking first) and, where noted, a manual visual check via `npm run dev`. Never claim a task done without a passing build.

---

### Task 1: Fonts + design tokens (foundation)

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `src/styles/global.css` (full rewrite, content below)

- [ ] **Step 1: Install pixel fonts**

```bash
npm install @fontsource/press-start-2p @fontsource/pixelify-sans
```

- [ ] **Step 2: Rewrite `src/styles/global.css`**

Replace the entire file with:

```css
@import 'tailwindcss';
@import '@fontsource/press-start-2p';
@import '@fontsource/pixelify-sans';
@import '@fontsource-variable/jetbrains-mono';

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

@theme inline {
  --font-sans:
    'Pixelify Sans', ui-sans-serif, system-ui, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  --font-pixel: 'Press Start 2P', monospace;
  --font-mono:
    'JetBrains Mono Variable', 'Geist Mono', ui-monospace, SFMono-Regular,
    Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;

  --color-background: var(--background);
  --color-foreground: var(--foreground);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);

  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);

  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);

  --color-border: var(--border);
  --color-ring: var(--ring);
  --color-accent: var(--accent);
}

@font-face {
  font-family: 'Geist Mono';
  src: url('/fonts/GeistMonoVF.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

/* ── Catppuccin Latte (light) ────────────────────────────────────────────── */
:root {
  --background:         #eff1f5;
  --foreground:         #4c4f69;
  --primary:            #4c4f69;
  --primary-foreground: #eff1f5;
  --muted:              #ccd0da;
  --muted-foreground:   #7c7f93;
  --destructive:        #d20f39;
  --border:             #9ca0b0;
  --ring:               #1e66f5;
  --accent:             #40a02b;
  --crust:              #bcc0cc;
}

/* ── Catppuccin Mocha (dark) ─────────────────────────────────────────────── */
[data-theme='dark'] {
  --background:         #1e1e2e;
  --foreground:         #cdd6f4;
  --primary:            #cdd6f4;
  --primary-foreground: #1e1e2e;
  --muted:              #313244;
  --muted-foreground:   #9399b2;
  --destructive:        #f38ba8;
  --border:             #45475a;
  --ring:               #89b4fa;
  --accent:             #a6e3a1;
  --crust:              #11111b;
}

@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    @apply border-border outline-ring/50;
    border-radius: 0 !important;
  }

  h1, h2, h3 {
    font-family: var(--font-pixel);
  }
}

@layer components {
  /* Pixel card: 2px border, square, hard offset shadow */
  .pixel-card {
    border: 2px solid var(--border);
    background: var(--background);
    box-shadow: 4px 4px 0 var(--crust);
  }
  .pixel-card-accent {
    box-shadow: 4px 4px 0 var(--accent);
  }
  /* Clickable card: press-in-reverse hover */
  .pixel-card-link {
    transition: translate 0.1s steps(2, end), box-shadow 0.1s steps(2, end);
  }
  .pixel-card-link:hover {
    translate: -2px -2px;
    box-shadow: 6px 6px 0 var(--accent);
  }
  .pixel-card-link:active {
    translate: 0 0;
    box-shadow: 2px 2px 0 var(--accent);
  }

  /* Card section label: ▸ LABEL in pixel font + accent */
  .pixel-label {
    font-family: var(--font-pixel);
    font-size: 0.5625rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }
  .pixel-label::before {
    content: '▸';
  }

  .font-pixel {
    font-family: var(--font-pixel);
  }

  /* Blinking cursor / blinking elements */
  .pixel-blink {
    animation: pixel-blink 1.1s steps(1) infinite;
  }
  @keyframes pixel-blink {
    50% { opacity: 0; }
  }

  /* Dither fill utility (checkerboard) */
  .pixel-dither {
    background-image: repeating-conic-gradient(
      var(--muted) 0% 25%, transparent 0% 50%
    );
    background-size: 4px 4px;
  }
}

/* ── CRT mode ────────────────────────────────────────────────────────────── */
html[data-crt='true'] body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.14) 0 1px,
    transparent 1px 3px
  );
}
html[data-crt='true'] body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9998;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    color-mix(in srgb, var(--accent) 6%, transparent) 100%
  );
}

@media (prefers-reduced-motion: reduce) {
  .pixel-blink {
    animation: none;
  }
}
```

Notes for the engineer:
- `--font-sans` now points at Pixelify Sans, so all body/UI text becomes pixel automatically — no per-component font edits needed except where Press Start 2P (headings/labels) is wanted.
- The old `tracking-tight` apply and Geist sans @font-face were removed deliberately (pixel fonts need no negative tracking; Geist sans is unused). Geist Mono stays as a `--font-mono` fallback.
- `--border` in light mode darkened one Catppuccin step (`#9ca0b0`) so 2px borders read crisply.
- `border-radius: 0 !important` in base intentionally squares everything site-wide (avatars, badges, heatmap cells) per spec.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: `astro check` passes (0 errors), build completes.

- [ ] **Step 4: Visual sanity check**

Run: `npm run dev`, open `http://localhost:4321`.
Expected: pixel body font everywhere, square corners, h1 "Hey, I'm Zayden" in Press Start 2P. Cards still soft-styled (reskinned in Task 3).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/styles/global.css
git commit -m "feat: pixel design tokens, fonts, and utility classes"
```

---

### Task 2: Header — z8dn_ logo, bracket nav, CRT + sound toggles

**Files:**
- Create: `src/components/CrtToggle.astro`
- Create: `src/components/SoundToggle.astro`
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Create `src/components/CrtToggle.astro`**

Mirrors ThemeToggle's pattern: pre-paint `is:inline` script + persisted toggle.

```astro
---
import { Button } from '@/components/ui/button'
import { Icon } from 'astro-icon/components'
---

<Button
  id="crt-toggle"
  variant="ghost"
  size="icon"
  title="Toggle CRT effect"
  className="-my-2 size-8"
>
  <Icon name="lucide:tv" class="size-4" />
  <span class="sr-only">Toggle CRT effect</span>
</Button>

<script is:inline data-astro-rerun>
  ;(() => {
    const crt = localStorage?.getItem('crt') === 'true'
    document.documentElement.setAttribute('data-crt', String(crt))
  })()
</script>

<script>
  function handleCrtClick() {
    const el = document.documentElement
    const next = el.getAttribute('data-crt') !== 'true'
    el.setAttribute('data-crt', String(next))
    localStorage.setItem('crt', String(next))
  }

  function initCrtToggle() {
    document
      .getElementById('crt-toggle')
      ?.addEventListener('click', handleCrtClick)
  }

  initCrtToggle()

  document.addEventListener('astro:after-swap', () => {
    document.documentElement.setAttribute(
      'data-crt',
      localStorage.getItem('crt') ?? 'false',
    )
    initCrtToggle()
  })
</script>
```

- [ ] **Step 2: Create `src/components/SoundToggle.astro`**

State-only toggle (the bleep engine in Task 8 reads `localStorage.sfx`). Off by default.

```astro
---
import { Button } from '@/components/ui/button'
import { Icon } from 'astro-icon/components'
---

<Button
  id="sfx-toggle"
  variant="ghost"
  size="icon"
  title="Toggle sound effects"
  className="-my-2 size-8"
>
  <Icon name="lucide:volume-2" class="size-4 hidden [html[data-sfx='true']_&]:block" />
  <Icon name="lucide:volume-x" class="size-4 block [html[data-sfx='true']_&]:hidden" />
  <span class="sr-only">Toggle sound effects</span>
</Button>

<script is:inline data-astro-rerun>
  ;(() => {
    const sfx = localStorage?.getItem('sfx') === 'true'
    document.documentElement.setAttribute('data-sfx', String(sfx))
  })()
</script>

<script>
  function handleSfxClick() {
    const el = document.documentElement
    const next = el.getAttribute('data-sfx') !== 'true'
    el.setAttribute('data-sfx', String(next))
    localStorage.setItem('sfx', String(next))
  }

  function initSfxToggle() {
    document
      .getElementById('sfx-toggle')
      ?.addEventListener('click', handleSfxClick)
  }

  initSfxToggle()

  document.addEventListener('astro:after-swap', () => {
    document.documentElement.setAttribute(
      'data-sfx',
      localStorage.getItem('sfx') ?? 'false',
    )
    initSfxToggle()
  })
</script>
```

- [ ] **Step 3: Rewrite `src/components/Header.astro`**

Text logo with blinking cursor (image logo dropped), bracketed nav, toggle cluster:

```astro
---
import Link from '@/components/Link.astro'
import CrtToggle from '@/components/CrtToggle.astro'
import SoundToggle from '@/components/SoundToggle.astro'
import ThemeToggle from '@/components/ThemeToggle.astro'
import { NAV_LINKS, SITE } from '@/consts'
---

<div>
  <div
    class="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3"
  >
    <Link href="/" class="flex shrink-0 items-center justify-center">
      <span class="font-pixel text-sm leading-none"
        >{SITE.title}<span class="pixel-blink text-(--accent)">_</span></span
      >
    </Link>
    <div class="flex items-center gap-4">
      <nav class="flex items-center gap-3 sm:gap-4">
        {
          NAV_LINKS.map((item) => (
            <Link
              href={item.href}
              class="text-foreground/60 hover:text-(--accent) font-pixel text-[0.625rem] transition-colors"
            >
              [{item.label}]
            </Link>
          ))
        }
      </nav>
      <div class="flex items-center gap-1">
        <SoundToggle transition:persist />
        <CrtToggle transition:persist />
        <ThemeToggle transition:persist />
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Verify**

Run: `npm run build` → 0 errors.
Run: `npm run dev` → header shows `z8dn_` (blinking underscore), `[blog] [work]`, three square toggle buttons. CRT toggle adds scanlines and survives reload; sound toggle flips icon and persists.

- [ ] **Step 5: Commit**

```bash
git add src/components/CrtToggle.astro src/components/SoundToggle.astro src/components/Header.astro
git commit -m "feat: pixel header with CRT and sound toggles"
```

---

### Task 3: Homepage bento reskin

**Files:**
- Modify: `src/pages/index.astro`

All content/data/script logic stays. Changes are markup classes + two widget rework s (clock, skill bars).

- [ ] **Step 1: Swap card shells**

In `src/pages/index.astro`, for every bento cell replace
`rounded-[0.625rem] border bg-background` with `pixel-card`:
- Intro card (line ~84): also append `pixel-card-accent` (hero gets the green shadow).
- Location card (~137), Career card (~211), Skills card (~248), Activity card (~278): `pixel-card`.
- Featured project link (~180) and Latest post link (~290): `pixel-card pixel-card-link` and **remove** `bento-link`.
- Social chips (~318): replace `rounded-[0.4rem] border bg-background` + `bento-link` with `pixel-card pixel-card-link`.
- Delete the now-unused `.bento-link` CSS rules from the `<style is:global>` block (lines ~410-418).

- [ ] **Step 2: Swap section labels**

Each card label `<p>` currently looks like:

```html
<p class="text-muted-foreground flex items-center gap-1.5 text-[0.6875rem] font-medium tracking-[0.08em] uppercase mb-2">
  <Icon name="lucide:map-pin" class="size-[11px]" />
  Location
</p>
```

Replace the class list with `pixel-label mb-2` (keep `mb-2` only where it exists today) and **delete the `<Icon …/>` line** — the `▸` glyph from `.pixel-label::before` replaces lucide icons on labels. Apply to all six labels: Location, Featured project, Career, Time coding, Activity, Latest post.

- [ ] **Step 3: Hero flavor line**

Replace:

```html
<p class="text-muted-foreground mt-0.5 text-[0.8125rem]">
  also known as <span class="text-foreground font-medium">z8dn</span>
</p>
```

with:

```html
<p class="font-pixel text-(--accent) mt-1.5 text-[0.5625rem] tracking-wide">
  AKA Z8DN ▸ ANDROID DEV ▸ HCMC
</p>
```

Also change the `<h1>` size (Press Start 2P renders wide): `text-[1.75rem]` → `text-[1.05rem] lg:text-[1.25rem]`.

- [ ] **Step 4: Pixel clock with blinking colon**

Replace the clock `<p>`:

```html
<p id="hcm-clock" class="text-[1.6rem] font-semibold tracking-tight tabular-nums mt-2">--:-- --</p>
```

with:

```html
<p class="font-pixel text-[1.05rem] mt-3 text-foreground">
  <span id="hcm-clock-h">--</span><span class="pixel-blink text-(--accent)">:</span><span id="hcm-clock-m">--</span>
  <span id="hcm-clock-ampm" class="text-[0.6rem] text-muted-foreground">--</span>
</p>
```

and update `startClock()` in the `<script>`:

```ts
function startClock() {
  const hEl = document.getElementById('hcm-clock-h')
  const mEl = document.getElementById('hcm-clock-m')
  const apEl = document.getElementById('hcm-clock-ampm')
  if (!hEl || !mEl || !apEl) return
  const tick = () => {
    const now = new Date()
    const h = (now.getUTCHours() + 7) % 24
    hEl.textContent = String(h % 12 || 12)
    mEl.textContent = String(now.getUTCMinutes()).padStart(2, '0')
    apEl.textContent = h >= 12 ? 'PM' : 'AM'
  }
  tick()
  _clockInterval = setInterval(tick, 1000)
}
```

- [ ] **Step 5: Segmented skill bars**

Replace the bar markup inside the Time coding card:

```astro
<div class="skill-bar-wrap">
  <div class="skill-bar-bg"></div>
  <div class="skill-bar-fill" style={`width:${(s.hours / arr[0].hours * 100).toFixed(1)}%`}></div>
</div>
```

with:

```astro
<div class="skill-cells">
  {Array.from({ length: 12 }).map((_, i) => (
    <div class:list={['skill-cell', { on: i < Math.round((s.hours / arr[0].hours) * 12) }]} />
  ))}
</div>
```

In the `<style is:global>` block, delete `.skill-bar-wrap`, `.skill-bar-bg`, `.skill-bar-fill` (and their dark-mode overrides) and add:

```css
.skill-cells { flex: 1; display: flex; gap: 2px; }
.skill-cell { flex: 1; height: 10px; background: var(--muted); }
.skill-cell.on { background: var(--accent); }
```

- [ ] **Step 6: Career markers as squares**

Replace the active marker (ping circle):

```html
<span class="relative z-10 mt-[3px] shrink-0 size-[11px] flex-none flex items-center justify-center">
  <span class="absolute inline-flex size-full rounded-full bg-emerald-500 opacity-60 animate-ping"></span>
  <span class="relative size-[7px] rounded-full bg-emerald-500 block"></span>
</span>
```

with:

```html
<span class="relative z-10 mt-[3px] shrink-0 size-[11px] flex-none flex items-center justify-center">
  <span class="pixel-blink absolute inline-flex size-full bg-(--accent) opacity-40"></span>
  <span class="relative size-[7px] bg-(--accent) block"></span>
</span>
```

and the inactive marker's inner span: drop `rounded-full` (global radius-0 squares it anyway, but keep markup honest).

- [ ] **Step 7: Heatmap + grid background tune**

In the `<style is:global>` block:
- `.gh-cell { border-radius: 2px; … }` → remove the `border-radius` line, change `gap: 3px` to `gap: 2px` in `.gh-weeks` and `.gh-week`.
- `.bg-grid` stays (already pixel-appropriate).
- `.skill-icon`: remove `border-radius: 5px`.

- [ ] **Step 8: Verify**

Run: `npm run build` → 0 errors.
Run: `npm run dev` → bento fully pixel: hard shadows (green on hero), `▸ LABEL` headers, blinking clock colon, segmented bars, square heatmap. Hover featured-project/latest-post cards: card lifts -2px with bigger green shadow. Check both themes and mobile width (~375px).

- [ ] **Step 9: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: pixel-skin homepage bento"
```

---

### Task 4: Blog prose typography (readable mono) + post chrome

**Files:**
- Modify: `src/styles/typography.css`

- [ ] **Step 1: Make prose body JetBrains Mono, headings pixel**

In `src/styles/typography.css`:

1. Change the `.prose` root rule:

```css
.prose {
  @apply text-foreground font-mono text-[0.9375rem] leading-7;
}
```

2. The heading rule gets the pixel font + adjusted sizes (Press Start 2P runs ~2x wide, so step every size down):

```css
:where(h1, h2, h3, h4, h5, h6):not(:where(.not-prose, .not-prose *)) {
  @apply text-foreground scroll-mt-32 font-medium xl:scroll-mt-20;
  font-family: var(--font-pixel);
  line-height: 1.6;
}
```

3. Adjust heading sizes: h1 `text-4xl` → `text-xl`; h2 `text-2xl` → `text-base`; h3 `text-xl` → `text-sm`; h4 `text-lg` → `text-xs`. Keep the existing `color: var(--accent)` on h2/h3.

No other rules change — code blocks, KaTeX, tables, blockquotes all keep current styling.

- [ ] **Step 2: Verify**

Run: `npm run dev`, open `/blog/gradle-internals`.
Expected: post title + section headings in Press Start 2P (accent-colored h2/h3), paragraphs in JetBrains Mono at comfortable size, code blocks and images unchanged, no horizontal overflow from long pixel-font headings (spot-check the longest heading).

- [ ] **Step 3: Commit**

```bash
git add src/styles/typography.css
git commit -m "feat: pixel post headings with readable mono prose"
```

---

### Task 5: Cards and shared components (blog listing, work, footer)

**Files:**
- Modify: `src/components/BlogCard.astro:28-30`
- Modify: `src/components/ProjectCard.astro:30-32`
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: BlogCard shell + title**

In `src/components/BlogCard.astro` replace the wrapper div class:

```html
<div class="hover:bg-muted/50 rounded-xl border p-4 transition-colors duration-300 ease-in-out">
```

with:

```html
<div class="pixel-card pixel-card-link p-4">
```

and the title `<h3 class="mb-1 text-lg font-medium">` → `<h3 class="mb-2 font-pixel text-[0.75rem] leading-relaxed">`.

- [ ] **Step 2: ProjectCard shell + title**

Same two changes in `src/components/ProjectCard.astro`: wrapper div gets `pixel-card pixel-card-link p-4`; `<h3 class="mb-1 text-lg font-medium">` → `<h3 class="mb-2 font-pixel text-[0.75rem] leading-relaxed">`. Also on the image wrapper div remove `rounded-md` (line ~40).

- [ ] **Step 3: Footer**

In `src/components/Footer.astro`, change both `text-sm` occurrences to `text-xs` and wrap the copyright in pixel style — replace the copyright span with:

```html
<span class="text-muted-foreground font-pixel text-[0.5rem]">
  &copy; {new Date().getFullYear()} z8dn
</span>
```

(keep the "Made with … by z8dn" line as is — it inherits Pixelify Sans).

- [ ] **Step 4: Verify**

Run: `npm run build` → 0 errors. `npm run dev`: `/blog` and `/work` cards are square with hard shadows and lift on hover; badges/avatars render square (from global radius-0); footer compact pixel.

- [ ] **Step 5: Commit**

```bash
git add src/components/BlogCard.astro src/components/ProjectCard.astro src/components/Footer.astro
git commit -m "feat: pixel-skin blog/work cards and footer"
```

---

### Task 6: 404 GAME OVER page

**Files:**
- Modify: `src/pages/404.astro`

- [ ] **Step 1: Rewrite the section content**

Replace the `<section>` in `src/pages/404.astro` with:

```astro
<section
  class="flex flex-col items-center justify-center gap-y-8 py-16 text-center"
>
  <h1 class="font-pixel text-destructive text-2xl">GAME OVER</h1>
  <p class="font-pixel text-muted-foreground text-[0.625rem] leading-relaxed">
    ERROR 404 ▸ THIS AREA DOES NOT EXIST
  </p>
  <div class="flex flex-col items-center gap-y-3">
    <p class="font-pixel text-[0.625rem]">CONTINUE?</p>
    <Link
      href="/"
      class="pixel-card pixel-card-link font-pixel inline-flex items-center gap-x-2 px-5 py-3 text-[0.625rem]"
    >
      <span class="pixel-blink text-(--accent)">▸</span> YES
    </Link>
  </div>
</section>
```

Remove the now-unused imports (`buttonVariants`, `cn`) from the frontmatter.

- [ ] **Step 2: Verify**

Run: `npm run build` → 0 errors (catches the unused-import lint). `npm run dev`, open `/nonexistent`: GAME OVER screen, blinking `▸`, YES returns home.

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: GAME OVER 404 page"
```

---

### Task 7: Boot sequence

**Files:**
- Create: `src/components/BootScreen.astro`
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Create `src/components/BootScreen.astro`**

Hidden by default (no-JS and crawlers never see it); JS reveals it only when appropriate.

```astro
<div
  id="boot-screen"
  class="bg-background fixed inset-0 z-[10000] hidden flex-col items-center justify-center gap-6"
  aria-hidden="true"
>
  <p class="font-pixel text-(--accent) text-sm">z8dn OS v1.0</p>
  <div class="border-foreground h-5 w-56 border-2 p-[3px]">
    <div id="boot-bar" class="bg-(--accent) h-full w-0"></div>
  </div>
  <p class="font-pixel text-muted-foreground text-[0.5rem]">
    LOADING… PRESS ANY KEY TO SKIP
  </p>
</div>

<script>
  function runBoot() {
    const screen = document.getElementById('boot-screen')
    const bar = document.getElementById('boot-bar')
    if (!screen || !bar) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (sessionStorage.getItem('booted') || reduced) {
      screen.remove()
      return
    }
    sessionStorage.setItem('booted', 'true')

    screen.classList.remove('hidden')
    screen.classList.add('flex')

    let step = 0
    const steps = 6
    const interval = setInterval(() => {
      step++
      bar.style.width = `${Math.min(100, (step / steps) * 100)}%`
      if (step >= steps) finish()
    }, 250)

    function finish() {
      clearInterval(interval)
      screen?.remove()
      removeEventListener('keydown', finish)
      removeEventListener('pointerdown', finish)
    }
    addEventListener('keydown', finish)
    addEventListener('pointerdown', finish)
  }

  runBoot()
</script>
```

Note: plain `<script>` (processed, runs once on initial load) is correct here — the boot screen is once-per-session, so it must NOT re-run on `astro:page-load`.

- [ ] **Step 2: Wire into `src/layouts/Layout.astro`**

Add the import and place it first inside `<body>`:

```astro
import BootScreen from '@/components/BootScreen.astro'
```

```astro
<body class="flex h-fit min-h-screen flex-col gap-y-6 font-sans">
  <BootScreen />
  <header ...>
```

- [ ] **Step 3: Verify**

Run: `npm run dev`. In a fresh tab (or after `sessionStorage.clear()`): boot splash with loading bar (~1.5s), any key/click skips, navigating between pages does NOT replay it, reload in same tab does NOT replay it. With DevTools "Emulate prefers-reduced-motion: reduce" + cleared sessionStorage: no boot screen.

- [ ] **Step 4: Commit**

```bash
git add src/components/BootScreen.astro src/layouts/Layout.astro
git commit -m "feat: once-per-session boot sequence"
```

---

### Task 8: Sound effects + Konami code

**Files:**
- Create: `src/components/PixelFx.astro`
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Create `src/components/PixelFx.astro`**

Script-only component: WebAudio square-wave bleeps (gated on `data-sfx`) and the Konami invader.

```astro
<script>
  let ctx: AudioContext | null = null

  function bleep(freq: number, duration = 0.06) {
    if (document.documentElement.getAttribute('data-sfx') !== 'true') return
    try {
      ctx ??= new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain).connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch {
      /* audio unavailable — stay silent */
    }
  }

  // Event delegation: survives astro view transitions without re-binding
  document.addEventListener('click', (e) => {
    if ((e.target as Element)?.closest('a, button')) bleep(880)
  })
  document.addEventListener(
    'mouseenter',
    (e) => {
      if ((e.target as Element)?.classList?.contains('pixel-card-link'))
        bleep(440, 0.04)
    },
    true,
  )

  // Konami: ↑↑↓↓←→←→BA
  const KONAMI = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
  ]
  let pos = 0

  document.addEventListener('keydown', (e) => {
    pos = e.key === KONAMI[pos] ? pos + 1 : e.key === KONAMI[0] ? 1 : 0
    if (pos === KONAMI.length) {
      pos = 0
      invade()
    }
  })

  function invade() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    bleep(220, 0.3)
    for (let i = 0; i < 8; i++) {
      const inv = document.createElement('div')
      inv.textContent = '👾'
      inv.style.cssText = `position:fixed;z-index:10001;pointer-events:none;font-size:28px;left:-40px;top:${10 + i * 11}vh;animation:invader-fly ${2 + i * 0.25}s linear forwards;`
      document.body.appendChild(inv)
      setTimeout(() => inv.remove(), 4500)
    }
  }

  const style = document.createElement('style')
  style.textContent =
    '@keyframes invader-fly { to { transform: translateX(calc(100vw + 80px)); } }'
  document.head.appendChild(style)
</script>
```

Note: document-level delegation means no `astro:page-load` re-init is needed; listeners attach once and keep working across client-side navigations.

- [ ] **Step 2: Wire into `src/layouts/Layout.astro`**

```astro
import PixelFx from '@/components/PixelFx.astro'
```

Place `<PixelFx />` just before `</body>` (after `<Footer />`).

- [ ] **Step 3: Verify**

Run: `npm run dev`.
- Sounds OFF (default): clicking nav/cards is silent.
- Toggle sound on: nav clicks bleep, hovering blog cards bleeps softly.
- Type ↑↑↓↓←→←→ b a: invaders fly across; nothing with reduced-motion emulated.

- [ ] **Step 4: Commit**

```bash
git add src/components/PixelFx.astro src/layouts/Layout.astro
git commit -m "feat: opt-in 8-bit sounds and Konami easter egg"
```

---

### Task 9: Full-site sweep + final verification

**Files:**
- Possibly small fixes anywhere; no planned edits.

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: `astro check` 0 errors, build succeeds.

- [ ] **Step 2: Visual pass on every route**

Run: `npm run preview`. Check in BOTH themes, desktop + ~375px mobile:
- `/` (bento), `/blog`, `/blog/gradle-internals` (long-form readability, code blocks, math, TOC sidebar), `/work`, `/tags`, `/tags/<any>`, `/authors`, `/authors/z8dn`, `/404` (via a bogus URL), RSS link works.
- CRT toggle on: scanlines on every page; boot only once per session; sounds only when enabled.
- Look specifically for: pixel-font headings overflowing containers, unreadably small Press Start 2P (anything below 0.5rem), broken sticky header backdrop, square avatar/badge regressions that look broken rather than intentional.

Fix anything found (small class adjustments), re-run `npm run build`.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A && git commit -m "fix: pixel reskin polish from full-site visual pass"
```

(Skip if no fixes were needed.)
