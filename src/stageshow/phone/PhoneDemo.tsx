import { useEffect, useState } from 'react'
import { Check, Phone, Stage } from '../kit'
import './phone.css'

// A still: the selfie-capture moment at its best frame, in a generic banking
// app. A dark camera surface with a quiet three-segment step bar (all lit), a
// face oval with its guide turned solid white and a ring of dots around it,
// an abstract silhouette inside, a red check badge on the ring's lower-right edge
// and a "Looks good" chip under it. One satellite straddles the phone's right
// edge low on the tile: a small "Identity verified" card with the same
// silhouette as a round avatar. Nothing moves; the page is the ground and the
// phone hangs from the top and runs off the bottom.
//
// Real strings: Looks good, Identity verified. Everything else is shape.

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

// Two crops of the same picture. `tall` is the desktop tile (about 263 wide),
// the default is the full-width phone tile. Oval geometry is in screen points
// (the phone's screen is 402 x 874); the phone and card are in stage pixels.
const WIDE = { phone: 262, left: 0, top: 18, cx: 201, cy: 312, rx: 104, ry: 138, barX: 24 }
const TALL = { phone: 232, left: -22, top: 18, cx: 201, cy: 350, rx: 112, ry: 148, barX: 56 }
type Geo = typeof WIDE

const GAP = 12 // from the oval to its progress ring

function Silhouette({ cx, cy, rx, ry, id }: { cx: number; cy: number; rx: number; ry: number; id: string }) {
  const path = `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`
  const outer = `M${cx - rx - GAP} ${cy}a${rx + GAP} ${ry + GAP} 0 1 0 ${(rx + GAP) * 2} 0a${rx + GAP} ${ry + GAP} 0 1 0 ${-(rx + GAP) * 2} 0Z`
  return (
    <svg className="pd-scene" width="402" height="874" viewBox="0 0 402 874" aria-hidden>
      <defs>
        <clipPath id={id}>
          <path d={path} />
        </clipPath>
      </defs>
      <rect width="402" height="874" fill="#111" />
      <path d={path} fill="#262626" />
      <g clipPath={`url(#${id})`}>
        <ellipse cx={cx} cy={cy - ry * 0.12} rx={rx * 0.46} ry={ry * 0.38} fill="#9a9a9a" />
        <ellipse cx={cx} cy={cy + ry * 0.98} rx={rx * 0.98} ry={ry * 0.52} fill="#666" />
      </g>
      <path d={`M0 0H402V874H0Z ${path}`} fill="#000" fillOpacity="0.5" fillRule="evenodd" />
      <path d={path} fill="none" stroke="#fff" strokeWidth="1.5" />
      <path d={path} fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1" transform={`translate(${cx} ${cy}) scale(${(rx + 6) / rx} ${(ry + 6) / ry}) translate(${-cx} ${-cy})`} />
      <path d={outer} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeDasharray="0.01 10" />
    </svg>
  )
}

function Face({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden>
      <circle cx="24" cy="19" r="8.5" fill="var(--pd-head)" />
      <ellipse cx="24" cy="46" rx="17" ry="14" fill="var(--pd-body)" />
    </svg>
  )
}

export default function PhoneDemo() {
  const theme = useSiteTheme()
  return (
    <Stage width={358} height={420} compact={{ below: 300, width: 270, height: 462 }} theme={theme} fill className="pd">
      {(_s, _r, layout) => {
        const g: Geo = layout === 'compact' ? TALL : WIDE
        // The ring's lower-right point, where the badge sits
        const bx = g.cx + (g.rx + GAP) * Math.SQRT1_2
        const by = g.cy + (g.ry + GAP) * Math.SQRT1_2
        return (
          <>
            <Phone width={g.phone} dark className="pd-phone" style={{ left: g.left, top: g.top }}>
              <div className="pd-cam">
                <Silhouette cx={g.cx} cy={g.cy} rx={g.rx} ry={g.ry} id={`pd-oval-${layout}`} />
                <span className="pd-steps" style={{ left: g.barX, right: g.barX }}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="pd-badge" style={{ left: bx, top: by }}>
                  <Check on size={46} />
                </span>
                <span className="pd-chip" style={{ left: g.cx, top: g.cy + g.ry + GAP + 38 }}>
                  Looks good
                </span>
              </div>
            </Phone>
            <div className="pd-card" data-layout={layout}>
              <span className="pd-avatar">
                <Face size={28} />
                <Check className="pd-avatar__mark" on size={13} />
              </span>
              <span className="pd-card__text">Identity verified</span>
            </div>
          </>
        )
      }}
    </Stage>
  )
}
