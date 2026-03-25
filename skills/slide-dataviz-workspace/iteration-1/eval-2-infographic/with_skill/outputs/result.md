# Result — eval-2-infographic (with_skill)

## Agent / Approach

**Skill used**: `slide-dataviz` (Infographic agent)

The orchestrator in `SKILL.md` classified the task as **Infographic** (数値・比較を図解する) and loaded `references/infographic.md` before implementation.

## Components Used

| Component | Purpose |
|---|---|
| Comparison Column (Before/After) | Left/right panel showing raw KPI values |
| Center reduction cards | Percentage improvement callouts between panels |
| Big Number stat cards | Bottom row with before→after values and delta badges |
| PPTX export (inline) | html2canvas capture + PptxGenJS; pptx-exporter.js path unavailable so logic was inlined |

## Data

| KPI | Before | After | Reduction |
|---|---|---|---|
| 処理時間 | 4時間 (240分) | 20分 | -91.7% (12x faster) |
| エラー率 | 12% | 1.5% | -87.5% |
| 月間コスト | 80万円 | 35万円 | -56.3% (年間540万節約) |

## Files

- `index.html` — Standalone 1920×1080 infographic slide with PPTX export button

## QA Checks

- [x] 1920×1080 layout, scales down on smaller viewports via CSS transform
- [x] All values labelled with units
- [x] Source/calculation note included at bottom
- [x] PPTX export: Slide 1 = full infographic PNG, Slide 2 = data table
- [x] Accent color #F97316 consistent throughout
