---
name: slide-dataviz
description: "Webスライド資料にデータビジュアライゼーション（グラフ・チャート・インフォグラフィック）を組み込む。ユーザーがグラフ・チャート・データ可視化・インフォグラフィックをスライドに入れたいと言ったら必ずこのスキルを使う。CSVやExcelなどのデータファイルからスライドを作る場合、比較表・KPI・統計数値をビジュアルに見せたい場合も同様。Python（matplotlib/plotly/seaborn）とChart.js/D3.jsを組み合わせてあらゆるデータビジュアライゼーション要件に対応する。Also triggers on chart, graph, visualization, infographic, data slide, グラフ, チャート, インフォグラフィック, データ可視化."
---

# Slide Data Visualization — Orchestrator

このスキルは**オーケストレーターとして機能**する。タスクを受け取ったらまず分類し、該当エージェントの参照ファイルを読んで実行する。

---

## Step 1: タスクを分類する

以下の判断基準でビジュアライゼーションの種類を決める。

| 条件 | エージェント | 参照ファイル |
|------|------------|-------------|
| データが手元にある（数値を直接渡せる）、シンプルなグラフ | **Chart.js Inline** | `references/chartjs.md` |
| CSV / Excel / JSON ファイルからデータを読み込む | **Python Pipeline** | `references/python-pipeline.md` |
| ドリルダウン・ホバー・フィルターなどのインタラクション重視 | **Plotly** | `references/plotly.md` |
| カスタム形状・アノテーション・細かいレイアウト制御が必要 | **matplotlib SVG** | `references/matplotlib-svg.md` |
| 数値・プロセス・比較を図解する（グラフではなく図表）| **Infographic** | `references/infographic.md` |

**複数に該当する場合**: 最も複雑な要件を持つエージェントを優先し、不足分を補完する。

---

## Step 2: 該当エージェントの参照ファイルを読む

分類が決まったら、必ず対応する `references/*.md` を Read ツールで読み込んでから実装を始める。
参照ファイルには具体的なコードパターン・設計指針・QAチェックリストが入っている。

---

## Step 3: 共通ルール（全エージェント共通）

### ファイル構成

```
project-name/
├── index.html          # メインスライドファイル
├── data/
│   ├── raw/            # 元データ（CSV/Excel）
│   └── processed/      # Chart.js 用 JSON
├── charts/             # Python生成SVG
├── process_data.py     # データ処理スクリプト
└── README.md
```

### pptx-exporter.js との連携

スライド完成後は必ず PPTX エクスポート機能を追加する。

```html
<script src="https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js"></script>
<script src="../slide-tools/pptx-exporter.js"></script>
```

チャートが含まれるスライドでは `canvas` または `svg` を PNG に変換してから PPTX に埋め込む:

```javascript
// Chart.js canvas → PNG data URL
const chartImg = document.getElementById('my-chart').toDataURL('image/png');

// SVG element → PNG (via canvas)
function svgToPng(svgEl, cb) {
  const svg = new XMLSerializer().serializeToString(svgEl);
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = svgEl.viewBox.baseVal.width || 800;
    c.height = svgEl.viewBox.baseVal.height || 400;
    c.getContext('2d').drawImage(img, 0, 0);
    cb(c.toDataURL('image/png'));
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}
```

pptx-exporter.js の `image` タイプを使う:

```javascript
{ type: 'image', kicker: 'DATA', heading: 'グラフタイトル', src: chartImg }
```

### CSS 共通変数（チャートスライドに適用）

```css
:root {
  --chart-h: 340px;       /* チャートコンテナの高さ */
  --chart-radius: 12px;   /* カードの角丸 */
}
.chart-wrap {
  position: relative;
  height: var(--chart-h);
  width: 100%;
}
.chart-card {
  background: var(--surface, #fff);
  border-radius: var(--chart-radius);
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
}
```

### Python 依存ライブラリ

```bash
pip install pandas matplotlib plotly seaborn openpyxl kaleido
```

---

## Step 4: QA チェックリスト

実装後に必ず確認:

- [ ] フルスクリーン（1920×1080）でグラフが正しく表示される
- [ ] `canvas` に明示的な高さを持つ親 `div` がある（Chart.js 必須）
- [ ] 軸ラベル・凡例・単位が読める（≥12px）
- [ ] データソース or 注記が入っている
- [ ] PPTX 書き出し時にチャートが空白にならない（PNG変換済みか確認）
- [ ] アクセントカラーが `pptx-exporter.js` の accent と統一されている
