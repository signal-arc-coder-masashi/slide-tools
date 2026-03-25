# result.md — eval-1-bar-chart / without_skill

## Approach

Built a single-page HTML slide (no external charting library) using hand-crafted CSS bar charts with JS-driven dynamic rendering.

### Aesthetic direction
Warm "sunrise" editorial — cream background (`#FFF8F0`), vivid orange accent (`#FF6B35`), amber highlights. Bebas Neue as the display typeface paired with Noto Sans JP for readability. Intentionally avoids common AI-slop choices (Inter, purple gradients, generic layouts).

### Technical choices
- Bars are plain `div` elements; height is set as a percentage of the maximum value (210万), keeping the math simple and the output pixel-perfect.
- `transform: scaleY(0) → scaleY(1)` with a staggered JS timeout drives the grow-in animation; `cubic-bezier(0.34,1.56,0.64,1)` adds a subtle overshoot bounce.
- Header, footer, and x-axis each have their own `fadeUp` / `fadeIn` CSS animation with staggered `animation-delay`.
- Decorative blurred blobs + SVG noise grain layer add depth without a heavy design library.
- Peak bar (5月 210万) is highlighted with a stronger gradient, glow shadow, and an accent dot. Lowest bar (3月 90万) uses the amber palette to keep the tone bright rather than punitive.
- Footer summarises total (920万), monthly average (153万), peak and lowest months as quick-read stats.

### Files
- `index.html` — self-contained slide, no build step required.
