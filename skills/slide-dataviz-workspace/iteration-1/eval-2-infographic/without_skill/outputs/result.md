# result.md — eval-2-infographic (without_skill baseline)

## Approach

Produced a single-page `index.html` infographic slide with pure HTML/CSS — no external libraries, no JavaScript, no skill guidance used.

### Layout structure

- **Header**: tag badge + title + subtitle, centered
- **3-column grid** (Before | arrows | After): side-by-side KPI comparison
  - Each column has a color-coded header (red = before, green = after)
  - Each KPI row shows icon, label, value, and a proportional bar track
  - Center column shows directional arrows and percentage-change badges
- **3-card summary row**: one card per KPI metric, each showing the delta percentage, the raw change, and a one-line plain-language interpretation
- **Footer**: minimal attribution line

### Design decisions

- Dark theme (`#0d1117`) chosen for visual clarity and contemporary look
- Red (`#f85149`) for "before" state, green (`#3fb950`) for "after" state — immediately legible color semantics
- Bar tracks are proportionally scaled against the before value (100%) to give a visual magnitude sense of improvement
- Summary cards include a top-border accent strip and the annual cost savings figure (540万円/year) to anchor the business impact
- No external fonts or CDN dependencies — fully self-contained, renders offline

### KPI calculations used

| Metric | Before | After | Delta |
|---|---|---|---|
| 処理時間 | 4時間 (240分) | 20分 | -91.7% |
| エラー率 | 12% | 1.5% | -87.5% |
| 月間コスト | 80万円 | 35万円 | -56.3% |
| 年間コスト削減 | — | — | 45万円 × 12 = 540万円 |

### What was NOT used

- No `document-skills:frontend-design` skill (this is the baseline/without_skill run)
- No external CSS frameworks (Tailwind, Bootstrap)
- No chart libraries (Chart.js, D3)
- No JavaScript animations
