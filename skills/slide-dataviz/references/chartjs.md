# Agent: Chart.js Inline

**用途**: データが静的（直接 HTML に書ける）、シンプルなグラフ。Python 不要。

---

## セットアップ

```html
<!-- <head> に追加 -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

## グローバル設定（全スライド共通）

`</body>` 前に一度だけ定義する:

```javascript
Chart.defaults.font.family = "'Noto Sans JP', 'Calibri', sans-serif";
Chart.defaults.color = '#64748B';
Chart.defaults.plugins.tooltip.backgroundColor = '#0F172A';
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 6;

const AXIS_STYLE = {
  grid: { color: 'rgba(0,0,0,0.05)' },
  border: { display: false },
  ticks: { padding: 8 }
};
const AXIS_NO_GRID = { grid: { display: false }, border: { display: false } };
```

---

## チャートタイプ別テンプレート

### 棒グラフ（縦）

```html
<div class="chart-wrap"><canvas id="bar-chart"></canvas></div>
<script>
new Chart(document.getElementById('bar-chart'), {
  type: 'bar',
  data: {
    labels: ['1月', '2月', '3月', '4月', '5月'],
    datasets: [{
      label: '売上（万円）',
      data: [120, 150, 90, 180, 210],
      backgroundColor: '#F97316',
      borderRadius: 6,
      barThickness: 40,
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: AXIS_NO_GRID, y: { ...AXIS_STYLE, beginAtZero: true } }
  }
});
</script>
```

### 折れ線グラフ

```html
<div class="chart-wrap"><canvas id="line-chart"></canvas></div>
<script>
new Chart(document.getElementById('line-chart'), {
  type: 'line',
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'ユーザー数',
      data: [300, 480, 720, 1050],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59,130,246,0.08)',
      tension: 0.4,
      pointRadius: 5,
      fill: true,
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: { x: AXIS_NO_GRID, y: AXIS_STYLE }
  }
});
</script>
```

### 複数系列の比較棒グラフ

```javascript
datasets: [
  { label: '今期', data: [120, 150, 90], backgroundColor: '#F97316', borderRadius: 4, barThickness: 24 },
  { label: '前期', data: [100, 130, 110], backgroundColor: '#E2E8F0', borderRadius: 4, barThickness: 24 },
]
```

### ドーナツグラフ

```html
<div class="chart-wrap" style="max-width: 280px; margin: auto;"><canvas id="donut-chart"></canvas></div>
<script>
new Chart(document.getElementById('donut-chart'), {
  type: 'doughnut',
  data: {
    labels: ['A社', 'B社', 'C社', 'その他'],
    datasets: [{ data: [42, 28, 18, 12], backgroundColor: ['#F97316','#3B82F6','#10B981','#E2E8F0'], borderWidth: 0 }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    cutout: '68%',
    plugins: { legend: { position: 'right', labels: { padding: 16 } } }
  }
});
</script>
```

### 横棒グラフ（ランキング）

```javascript
type: 'bar',
// options に追加:
indexAxis: 'y',
// dataset:
backgroundColor: (ctx) => {
  const colors = ['#F97316','#FB923C','#FED7AA','#FEF3C7'];
  return colors[ctx.dataIndex] || '#E2E8F0';
},
```

---

## レイアウトパターン

### チャート + 右側テキスト（2カラム）

```html
<div style="display:grid; grid-template-columns:1fr 1fr; gap:32px; align-items:center; height:380px;">
  <div class="chart-wrap chart-card">
    <canvas id="chart-main"></canvas>
  </div>
  <div>
    <p class="kicker">KEY INSIGHT</p>
    <h3 style="font-size:22px; margin:8px 0 16px;">売上が前年比 <strong style="color:#F97316;">+42%</strong></h3>
    <ul class="bullet-list">
      <li>Q3 からの急成長</li>
      <li>新規顧客獲得が主因</li>
    </ul>
  </div>
</div>
```

### 複数チャートグリッド

```html
<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:20px;">
  <div class="chart-wrap chart-card" style="height:200px;"><canvas id="c1"></canvas></div>
  <div class="chart-wrap chart-card" style="height:200px;"><canvas id="c2"></canvas></div>
</div>
```

---

## PPTX エクスポート対応

チャート描画後に PNG を取得して PPTX config に渡す:

```javascript
// 全チャートが描画されてから実行（DOMContentLoaded 後）
const chart1Img = document.getElementById('bar-chart').toDataURL('image/png');

initPPTXExport({
  filename: 'slides.pptx',
  accent: 'F97316',
  slides: [
    { type: 'image', kicker: 'DATA', heading: '月別売上推移', src: chart1Img },
  ]
});
```

---

## よくあるミスと対処

| 症状 | 原因 | 対処 |
|------|------|------|
| グラフが潰れる | 親 div に `height` なし | `height: var(--chart-h)` を追加 |
| レスポンシブが効かない | `maintainAspectRatio: true` | `false` に変更 |
| アニメーションがPPTXで空白 | PNG 変換のタイミングが早い | `animation: { onComplete: () => { ... } }` 内で取得 |
