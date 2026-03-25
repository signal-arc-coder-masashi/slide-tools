# result.md — eval-3-comparison / without_skill

## Approach

Built a single-file `index.html` comparison slide from scratch without using the `document-skills:frontend-design` skill.

### Visual strategy

- **Dark theme** (`#0d1117` base, GitHub-dark palette) — conveys technical authority and modernity.
- **Grid layout** with CSS `display: grid` (4 columns: label + 3 companies). No table element.
- **Self column highlighting**: the "自社ツール" column gets a blue gradient background, a top accent border (`#58a6ff`), and a "RECOMMENDED" ribbon badge — making it immediately stand out.
- **Value encoding by color**: green for good (○), blue/bright for great (◎), red for bad (✕), grey for neutral competitors.
- **Price framing**: Self price (¥5,000) rendered large and bold with a "最適コスト" badge. A社 (¥8,000) and B社 (¥3,500) are muted grey — B社's lower price is de-emphasized since it lacks API and 24h support.
- **Score bar row**: A synthesized 95/100 vs 62/100 vs 54/100 bar chart row provides a visual summary that frames the self column as dominant.
- **Footer CTA banner**: Restates the three key advantages (cost −37.5%, API, 24h support) in one sentence plus a call-to-action button.

### What was NOT used

- No `document-skills:frontend-design` skill (this is the baseline / without_skill run).
- No external CSS frameworks or JS libraries — fully self-contained HTML.

### Files written

- `index.html` — the complete comparison slide
- `result.md` — this file
