# Eval-3 Comparison — With Skill Result

## Approach

**Skill used**: `slide-dataviz` (SKILL.md)

**Agent selected**: Infographic agent (`references/infographic.md`)

**Reason**: The task is a comparison table (3 companies x 4 criteria), not a chart or graph. The infographic agent handles "comparison" and "figure/table" layouts using pure HTML/CSS — no external data file or charting library needed.

## What was built

`index.html` — single-file web slide (1280x720, 16:9) containing:

1. **Header bar** — dark background with kicker label, slide title, and PPTX export button
2. **Price hero strip** — 3 price cards side-by-side; 自社 card highlighted with orange border, "推奨" badge, and accent color on the price value
3. **Comparison table** — 4-row table (価格 / API連携 / 日本語対応 / サポート); 自社 column has orange header and tinted cell background; badge icons (○◎△✕) are color-coded green/amber/red; support cells use pill tags
4. **Summary strip** — 3 callout cards reinforcing 自社 advantages: cost vs A社, best Japanese support, 24h availability
5. **PPTX export** — button uses `html2canvas` to capture the slide and table as PNG, then builds a 2-slide PPTX via `pptxgenjs@3.12.0` (Slide 1: structured layout; Slide 2: full slide screenshot)

## Visual strategy for 自社 advantage

- Orange accent column in both the price strip and the table — eye immediately goes to 自社
- "推奨" badge floating above the 自社 price card
- "最高コスパ" sub-badge inside the price card
- Summary strip anchors the three winning points as takeaways at the bottom
- Competitor columns are neutral gray/white — no competing visual weight

## Files

| File | Description |
|---|---|
| `index.html` | Main slide, self-contained |
| `result.md` | This file |
