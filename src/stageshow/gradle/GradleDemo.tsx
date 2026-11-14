import { useEffect, useState } from 'react'
import { Badge, Bar, Check, Meter, Stage } from '../kit'
import './gradle.css'

// A still: the result of moving a 300+ module Android build from buildSrc to
// an included build-logic. A build panel (no window chrome: at this size it would eat the tile) hung from the tile's top-left corner
// and running off its right and bottom edges: "Configuration", 2.9s in the big
// figure, the red -94% badge, the old 48.6s struck through beside it, the
// "Configuration cache reused" line with its check and a few modules as
// filler bars with round ticks. The compact crop (the half-width phone tile)
// keeps only the label, the figure, the badge and the struck-through time.
//
// Real strings: Configuration, 2.9s, -94%, 48.6s, Configuration cache reused.

function useSiteTheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    const root = document.documentElement
    const read = () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')
    read()
    const mo = new MutationObserver(read)
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])
  return theme
}

const NAMES = [64, 52, 58, 46]

const Figure = () => (
  <span className="gd-time">
    2.9<span className="gd-unit">s</span>
  </span>
)

export default function GradleDemo() {
  const theme = useSiteTheme()
  return (
    <Stage width={280} height={236} compact={{ below: 200, width: 162, height: 126 }} theme={theme} fill className="gd">
      {(_s, _r, layout) =>
        layout === 'compact' ? (
          <div className="gd-panel">
            <span className="gd-label">Configuration</span>
            <Figure />
            <div className="gd-pair">
              <Badge tone="accent" className="gd-delta">
                −94%
              </Badge>
              <span className="gd-was">48.6s</span>
            </div>
          </div>
        ) : (
          <div className="gd-panel" data-wide>
            <span className="gd-label">Configuration</span>
            <div className="gd-hero">
              <Figure />
              <span className="gd-side">
                <Badge tone="accent" className="gd-delta">
                  −94%
                </Badge>
                <span className="gd-was">48.6s</span>
              </span>
            </div>
            <div className="gd-reused">
              <Check on size={14} />
              <span>Configuration cache reused</span>
            </div>
            <div className="gd-rule" />
            {NAMES.map((w, i) => (
              <div className="gd-row" key={i}>
                <Bar w={w} h={6} tone={3} />
                <Meter className="gd-meter" value={1} />
                <Check on size={14} />
              </div>
            ))}
          </div>
        )
      }
    </Stage>
  )
}
