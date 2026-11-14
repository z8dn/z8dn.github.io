import { useEffect, useState, type CSSProperties } from 'react'
import { Bookmark, ChevronDown, ChevronRight, FileCode, Folder, FolderOpen } from 'lucide-react'
import { Bar, Collapse, Row, Roll, Stage, States, Text, Window, type Act, type Layout, type LookTokens } from '../kit'
import './hero.css'

// Zayden's Android Studio plugin, "Advanced Android Project Tree", in a generic
// IDE window. A deep module tree; one toggle opens a Quick access group on top
// that carries the tree down and lists the files you open all day; one click
// opens libs.versions.toml. The loop resets with a seen cause: the toggle goes
// off and the file is opened the long way, through the tree.

type Sel = 'tree' | 'libs'
type Doc = 'gradle' | 'toml'

type S = { qa: boolean; sel: Sel; doc: Doc; tab: string }

const GRADLE = 'build.gradle.kts'
const LIBS = 'libs.versions.toml'
const MANIFEST = 'AndroidManifest.xml'

const initial: S = { qa: false, sel: 'tree', doc: 'gradle', tab: GRADLE }
const POSTER: S = { qa: true, sel: 'libs', doc: 'toml', tab: LIBS }

type Geo = { x: number; y: number; w: number; h: number; side: number; rest: { x: number; y: number } }
const GEO: Record<Layout, Geo> = {
  wide: { x: 24, y: 24, w: 770, h: 490, side: 248, rest: { x: 590, y: 360 } },
  compact: { x: 14, y: 14, w: 480, h: 440, side: 212, rest: { x: 300, y: 270 } },
}

// The site's own palette, mapped onto the kit's tokens. Light and dark both.
const FONT = "'Be Vietnam Pro', system-ui, -apple-system, 'PingFang SC', 'Noto Sans SC', sans-serif"
const MONO = "'JetBrains Mono Variable', ui-monospace, 'SF Mono', Consolas, monospace"
const TOKENS: Record<'light' | 'dark', LookTokens> = {
  light: {
    '--ss-canvas': '#eceef1',
    '--ss-surface': '#f9fafb',
    '--ss-chrome': '#f3f4f6',
    '--ss-ink-1': 'rgba(9, 11, 14, 0.04)',
    '--ss-ink-2': 'rgba(9, 11, 14, 0.06)',
    '--ss-ink-3': 'rgba(9, 11, 14, 0.09)',
    '--ss-ink-4': 'rgba(9, 11, 14, 0.12)',
    '--ss-ink-5': 'rgba(9, 11, 14, 0.18)',
    '--ss-line': 'rgba(9, 11, 14, 0.09)',
    '--ss-line-faint': 'rgba(9, 11, 14, 0.05)',
    '--ss-text': '#5b616b',
    '--ss-text-strong': '#090b0e',
    '--ss-text-faint': '#8a909a',
    '--ss-icon': '#5b616b',
    '--ss-icon-faint': '#b4b9c1',
    '--ss-accent': '#0c0c0c',
    '--ss-accent-soft': 'rgba(66, 118, 98, 0.14)',
    '--ss-accent-2': '#0c0c0c',
    '--ss-shadow-hero': '0 0 0 1px rgba(9, 11, 14, 0.09), 0 28px 56px -20px rgba(9, 11, 14, 0.22)',
    '--ss-font': FONT,
    '--ss-mono': MONO,
    '--ss-radius-window': '10px',
  },
  dark: {
    '--ss-canvas': '#0e1115',
    '--ss-surface': '#14171c',
    '--ss-chrome': '#12151a',
    '--ss-ink-1': 'rgba(241, 242, 244, 0.05)',
    '--ss-ink-2': 'rgba(241, 242, 244, 0.07)',
    '--ss-ink-3': 'rgba(241, 242, 244, 0.1)',
    '--ss-ink-4': 'rgba(241, 242, 244, 0.13)',
    '--ss-ink-5': 'rgba(241, 242, 244, 0.2)',
    '--ss-line': 'rgba(241, 242, 244, 0.09)',
    '--ss-line-faint': 'rgba(241, 242, 244, 0.05)',
    '--ss-text': '#9299a4',
    '--ss-text-strong': '#f1f2f4',
    '--ss-text-faint': '#6a717c',
    '--ss-icon': '#9299a4',
    '--ss-icon-faint': '#454b55',
    '--ss-accent': '#f2f2f2',
    '--ss-accent-soft': 'rgba(105, 195, 158, 0.16)',
    '--ss-accent-2': '#f2f2f2',
    '--ss-shadow-hero': '0 0 0 1px rgba(241, 242, 244, 0.1), 0 28px 56px -20px rgba(0, 0, 0, 0.7)',
    '--ss-font': FONT,
    '--ss-mono': MONO,
    '--ss-radius-window': '10px',
  },
}

/** Follows the site's [data-theme='dark'] on <html>. */
function useSiteTheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    const el = document.documentElement
    const read = () => setTheme(el.dataset.theme === 'dark' ? 'dark' : 'light')
    read()
    const mo = new MutationObserver(read)
    mo.observe(el, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])
  return theme
}

// The module tree. Real names only where the story touches them.
type Node = { d: number; dir?: boolean; open?: boolean; name?: string; w: number; id?: string }
const TREE: Node[] = [
  { d: 0, dir: true, open: true, name: 'app', w: 0 },
  { d: 1, name: GRADLE, w: 0, id: 'tree-gradle' },
  { d: 1, dir: true, open: true, w: 38 },
  { d: 2, dir: true, open: true, w: 46 },
  { d: 3, name: MANIFEST, w: 0, id: 'tree-manifest' },
  { d: 3, dir: true, w: 66 },
  { d: 3, dir: true, w: 52 },
  { d: 2, dir: true, w: 34 },
  { d: 0, dir: true, open: true, w: 44 },
  { d: 1, dir: true, w: 60 },
  { d: 1, dir: true, w: 74 },
  { d: 1, w: 88 },
  { d: 0, dir: true, open: true, w: 70 },
  { d: 1, dir: true, w: 52 },
  { d: 1, dir: true, w: 66 },
  { d: 1, dir: true, w: 46 },
  { d: 0, dir: true, w: 56 },
  { d: 0, w: 94 },
  { d: 0, dir: true, w: 62 },
  { d: 0, dir: true, w: 50 },
]

const ICON = { size: 14, strokeWidth: 1.75 } as const

function TreeRow({ n, selected }: { n: Node; selected?: boolean }) {
  const Chevron = n.open ? ChevronDown : ChevronRight
  const Dir = n.open ? FolderOpen : Folder
  return (
    <Row
      pad={5}
      selected={selected}
      data-target={n.id}
      lead={
        <span className="hv-lead" style={{ paddingLeft: `calc(var(--hv-indent, 13px) * ${n.d})` }}>
          <span className="hv-chev">{n.dir && <Chevron size={12} strokeWidth={2} />}</span>
          {n.dir ? <Dir {...ICON} /> : <FileCode {...ICON} />}
        </span>
      }
      title={n.name ? <Text className="hv-name">{n.name}</Text> : <Bar w={n.w} h={6} tone={3} />}
    />
  )
}

function QuickRow({ name, id, selected }: { name: string; id: string; selected?: boolean }) {
  return (
    <Row
      pad={5}
      selected={selected}
      data-target={id}
      lead={
        <span className="hv-lead">
          <FileCode {...ICON} />
        </span>
      }
      title={<Text className="hv-name">{name}</Text>}
    />
  )
}

// Filler code: indent, then a run of [width, kind]. k = keyword (ink), c = comment.
type Seg = [number, 'k' | 'n' | 'c']
const GRADLE_LINES: [number, Seg[]][] = [
  [0, [[56, 'k'], [14, 'n'], [60, 'n']]],
  [1, [[44, 'k'], [92, 'n']]],
  [1, [[36, 'n'], [70, 'n']]],
  [0, []],
  [0, [[64, 'k'], [12, 'n']]],
  [1, [[50, 'n'], [18, 'n'], [84, 'n']]],
  [1, [[72, 'n'], [48, 'k']]],
  [2, [[40, 'k'], [96, 'n']]],
  [2, [[58, 'n'], [34, 'n']]],
  [1, [[12, 'n']]],
  [0, [[12, 'n']]],
  [0, []],
  [0, [[48, 'k'], [74, 'n'], [30, 'n']]],
  [1, [[82, 'c']]],
  [1, [[60, 'n'], [26, 'k'], [56, 'n']]],
  [1, [[44, 'n'], [88, 'n']]],
  [1, [[66, 'k'], [38, 'n']]],
  [0, [[12, 'n']]],
  [0, []],
  [0, [[52, 'k'], [90, 'n']]],
  [1, [[70, 'n'], [24, 'n']]],
  [1, [[46, 'n']]],
]
const TOML_LINES: [number, Seg[]][] = [
  [0, [[58, 'k']]],
  [0, [[64, 'n'], [18, 'n'], [52, 'n']]],
  [0, [[46, 'n'], [18, 'n'], [76, 'n']]],
  [0, [[72, 'n'], [18, 'n'], [38, 'n']]],
  [0, [[40, 'n'], [18, 'n'], [60, 'n']]],
  [0, []],
  [0, [[72, 'k']]],
  [0, [[84, 'n'], [18, 'n'], [120, 'n']]],
  [0, [[70, 'n'], [18, 'n'], [132, 'n']]],
  [0, [[96, 'n'], [18, 'n'], [110, 'n']]],
  [0, [[58, 'n'], [18, 'n'], [124, 'n']]],
  [0, [[78, 'n'], [18, 'n'], [102, 'n']]],
  [0, [[90, 'n'], [18, 'n'], [116, 'n']]],
  [0, []],
  [0, [[64, 'k']]],
  [0, [[110, 'n'], [18, 'n'], [74, 'n']]],
  [0, [[92, 'n'], [18, 'n'], [88, 'n']]],
  [0, [[124, 'n'], [18, 'n'], [66, 'n']]],
  [0, [[80, 'n'], [18, 'n'], [96, 'n']]],
  [0, [[104, 'n'], [18, 'n'], [58, 'n']]],
  [0, [[86, 'n'], [18, 'n'], [112, 'n']]],
  [0, [[70, 'n'], [18, 'n'], [80, 'n']]],
]

function Doc({ lines }: { lines: [number, Seg[]][] }) {
  return (
    <div className="hv-doc">
      {lines.map(([indent, segs], i) => (
        <div key={i} className="hv-line">
          <Bar className="hv-num" w={10} h={5} tone={2} />
          <span className="hv-code" style={{ paddingLeft: indent * 16 }}>
            {segs.map(([w, kind], j) => (
              <Bar
                key={j}
                w={w}
                h={6}
                tone={kind === 'c' ? 2 : 3}
                style={kind === 'k' ? { background: 'color-mix(in srgb, var(--ss-accent) 55%, transparent)' } : undefined}
              />
            ))}
          </span>
        </div>
      ))}
    </div>
  )
}

async function script(a: Act<S>) {
  await a.wait(1100)

  // 1. The tree is deep. Click the toggle at the top of the pane.
  await a.move('toggle', { duration: 900 })
  await a.wait(250)
  await a.click()
  await a.set({ qa: true })
  await a.wait(1300)

  // 2. Quick access is open: its rows are the files you open all day.
  await a.move({ at: 'qa-libs', x: 0.92, y: 0.6 }, { duration: 800 })
  await a.wait(300)
  await a.click()
  await a.set({ sel: 'libs', doc: 'toml', tab: LIBS })
  await a.move('rest', { duration: 900 })
  await a.wait(2800)

  // 3. Reset with a seen cause: toggle it off, then open the file the long way.
  await a.move('toggle', { duration: 800 })
  await a.wait(200)
  await a.click()
  await a.set({ qa: false })
  await a.wait(1000)
  await a.move({ at: 'tree-gradle', x: 0.95, y: 0.6 }, { duration: 700 })
  await a.wait(200)
  await a.click()
  await a.set({ sel: 'tree', doc: 'gradle', tab: GRADLE })
  await a.move('rest', { duration: 800 })
  await a.wait(700)
}

export function HeroDemo() {
  const theme = useSiteTheme()
  return (
    <Stage<S>
      width={720}
      height={440}
      compact={{ below: 600, width: 358, height: 340 }}
      theme={theme}
      tokens={TOKENS[theme]}
      initial={initial}
      poster={POSTER}
      script={script}
      cursor={{ at: { wide: GEO.wide.rest, compact: GEO.compact.rest }, style: 'real' }}
      className="hv"
    >
      {(s, _rect, layout) => {
        const g = GEO[layout]
        return (
          <>
            <Window
              className="hv-window"
              style={{ left: g.x, top: g.y, width: g.w, height: g.h } as CSSProperties}
              sidebarWidth={g.side}
              lead={
                <span className="hv-tab">
                  <FileCode {...ICON} />
                  <Roll className="hv-tab-name">{s.tab}</Roll>
                </span>
              }
              sidebar={
                <div className="hv-pane">
                  <div className="hv-head">
                    <Text className="hv-title">Project</Text>
                    <span className="hv-spacer" />
                    <Bar w={14} h={14} r={4} tone={2} />
                    <Bar w={14} h={14} r={4} tone={2} />
                    <span className="hv-toggle" data-target="toggle" data-on={s.qa || undefined} role="switch" aria-checked={s.qa}>
                      <Bookmark size={13} strokeWidth={1.9} fill={s.qa ? 'currentColor' : 'none'} />
                    </span>
                  </div>
                  <Collapse open={s.qa}>
                    <div className="hv-quick">
                      <span className="hv-eyebrow">Quick access</span>
                      <QuickRow name={GRADLE} id="qa-gradle" />
                      <QuickRow name={LIBS} id="qa-libs" selected={s.sel === 'libs'} />
                      <QuickRow name={MANIFEST} id="qa-manifest" />
                    </div>
                  </Collapse>
                  <div className="hv-tree">
                    {TREE.map((n, i) => (
                      <TreeRow key={i} n={n} selected={n.id === 'tree-gradle' && s.sel === 'tree'} />
                    ))}
                  </div>
                </div>
              }
            >
              <States
                className="hv-states"
                align="start"
                value={s.doc}
                states={{ gradle: <Doc lines={GRADLE_LINES} />, toml: <Doc lines={TOML_LINES} /> }}
              />
            </Window>
            <span data-target="rest" className="hv-rest" style={{ left: g.rest.x, top: g.rest.y }} />
          </>
        )
      }}
    </Stage>
  )
}

export default HeroDemo
