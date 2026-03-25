# Agent: インフォグラフィック

**用途**: グラフではなく「図解」で伝える。KPI・プロセス・比較・割合を HTML/CSS だけで表現する。データが少ない・コンセプト重視のスライドに使う。

---

## コンポーネント一覧

| コンポーネント | 用途 |
|--------------|------|
| [Big Number](#big-number) | KPI・単一指標の強調 |
| [Progress Bar](#progress-bar) | 達成率・割合 |
| [Icon + Text Row](#icon--text-row) | 特長・ポイント列挙 |
| [Step Flow](#step-flow) | プロセス・ステップ |
| [Comparison Column](#comparison-column) | Before / After・A vs B |
| [Tag Cloud](#tag-cloud) | キーワード・優先度 |
| [Timeline](#timeline) | 時系列・ロードマップ |

---

## Big Number

```html
<div class="stat-grid">
  <div class="stat-card">
    <span class="stat-num">87<small>%</small></span>
    <span class="stat-label">生産性向上</span>
    <span class="stat-delta positive">▲ 12pt 前年比</span>
  </div>
  <div class="stat-card">
    <span class="stat-num">3.2<small>倍</small></span>
    <span class="stat-label">処理速度</span>
    <span class="stat-delta positive">▲ 0.8 倍</span>
  </div>
</div>

<style>
.stat-grid { display: flex; gap: 24px; }
.stat-card { flex: 1; background: var(--surface,#fff); border-radius: 12px; padding: 28px 24px; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
.stat-num  { display: block; font-size: 64px; font-weight: 900; line-height: 1; color: var(--accent,#F97316); }
.stat-num small { font-size: 28px; }
.stat-label { display: block; font-size: 14px; color: var(--muted,#64748B); margin-top: 8px; }
.stat-delta { display: block; font-size: 12px; margin-top: 6px; }
.stat-delta.positive { color: #10B981; }
.stat-delta.negative { color: #EF4444; }
</style>
```

---

## Progress Bar

```html
<div class="progress-list">
  <div class="progress-item">
    <div class="progress-header"><span>コスト削減</span><span>72%</span></div>
    <div class="progress-track"><div class="progress-fill" style="--pct:72%; --color:#F97316;"></div></div>
  </div>
  <div class="progress-item">
    <div class="progress-header"><span>工数削減</span><span>58%</span></div>
    <div class="progress-track"><div class="progress-fill" style="--pct:58%; --color:#3B82F6;"></div></div>
  </div>
</div>

<style>
.progress-list  { display: flex; flex-direction: column; gap: 16px; }
.progress-header{ display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
.progress-track { height: 10px; background: #E2E8F0; border-radius: 5px; overflow: hidden; }
.progress-fill  { height: 100%; width: var(--pct); background: var(--color); border-radius: 5px;
                   transition: width 1s ease; }
</style>
```

---

## Icon + Text Row

```html
<div class="feature-list">
  <div class="feature-row">
    <div class="feature-icon" style="background:#FFF7ED; color:#F97316;">⚡</div>
    <div>
      <strong>高速処理</strong>
      <p>従来比3倍のスループットを実現</p>
    </div>
  </div>
  <div class="feature-row">
    <div class="feature-icon" style="background:#EFF6FF; color:#3B82F6;">🔒</div>
    <div>
      <strong>セキュア</strong>
      <p>エンドツーエンド暗号化対応</p>
    </div>
  </div>
</div>

<style>
.feature-list { display: flex; flex-direction: column; gap: 20px; }
.feature-row  { display: flex; align-items: flex-start; gap: 16px; }
.feature-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.feature-row strong { font-size: 15px; display: block; margin-bottom: 4px; }
.feature-row p { font-size: 13px; color: var(--muted,#64748B); margin: 0; }
</style>
```

---

## Step Flow

```html
<div class="step-flow">
  <div class="step">
    <div class="step-num">01</div>
    <div class="step-label">データ収集</div>
    <div class="step-body">CSVまたはAPIから自動取得</div>
  </div>
  <div class="step-arrow">→</div>
  <div class="step">
    <div class="step-num">02</div>
    <div class="step-label">AI分析</div>
    <div class="step-body">Claude APIで自動分類・集計</div>
  </div>
  <div class="step-arrow">→</div>
  <div class="step">
    <div class="step-num">03</div>
    <div class="step-label">レポート生成</div>
    <div class="step-body">スライドとPDFを自動出力</div>
  </div>
</div>

<style>
.step-flow   { display: flex; align-items: center; gap: 8px; }
.step        { flex: 1; background: var(--surface,#fff); border-radius: 12px; padding: 20px 16px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
.step-num    { font-size: 11px; font-weight: 700; letter-spacing: .1em; color: var(--accent,#F97316); margin-bottom: 8px; }
.step-label  { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
.step-body   { font-size: 12px; color: var(--muted,#64748B); }
.step-arrow  { font-size: 20px; color: var(--muted,#94A3B8); flex-shrink: 0; }
</style>
```

---

## Comparison Column（Before / After）

```html
<div class="compare-grid">
  <div class="compare-col before">
    <div class="compare-label">BEFORE</div>
    <ul>
      <li>手動で集計（3時間/回）</li>
      <li>Excel管理でミス多発</li>
      <li>報告書を手作り</li>
    </ul>
  </div>
  <div class="compare-divider">→</div>
  <div class="compare-col after">
    <div class="compare-label">AFTER</div>
    <ul>
      <li>自動集計（5分/回）</li>
      <li>クラウド一元管理</li>
      <li>スライド自動生成</li>
    </ul>
  </div>
</div>

<style>
.compare-grid    { display: flex; align-items: center; gap: 24px; }
.compare-col     { flex: 1; border-radius: 12px; padding: 24px; }
.compare-col.before { background: #F1F5F9; }
.compare-col.after  { background: #FFF7ED; border: 1.5px solid #F97316; }
.compare-label   { font-size: 10px; font-weight: 700; letter-spacing: .15em; margin-bottom: 14px; }
.compare-col.before .compare-label { color: #94A3B8; }
.compare-col.after  .compare-label { color: #F97316; }
.compare-col ul  { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.compare-col li  { font-size: 14px; padding-left: 20px; position: relative; }
.compare-col.before li::before { content: '✕'; position: absolute; left: 0; color: #94A3B8; }
.compare-col.after  li::before { content: '✓'; position: absolute; left: 0; color: #10B981; font-weight: 700; }
.compare-divider { font-size: 28px; color: var(--accent,#F97316); font-weight: 700; flex-shrink: 0; }
</style>
```

---

## PPTX エクスポート対応

インフォグラフィックは HTML 要素なので、`html2canvas` でキャプチャしてから PNG として PPTX に渡す:

```html
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
<script>
async function captureElement(selector) {
  const el = document.querySelector(selector);
  const canvas = await html2canvas(el, { backgroundColor: null, scale: 2 });
  return canvas.toDataURL('image/png');
}

// initPPTXExport の前に呼ぶ
captureElement('.stat-grid').then(imgData => {
  initPPTXExport({
    filename: 'slides.pptx',
    accent: 'F97316',
    slides: [
      { type: 'image', kicker: 'KPI', heading: '主要指標', src: imgData }
    ]
  });
});
</script>
```

または、pptx-exporter.js の `summary` タイプで近いレイアウトを再現:

```javascript
{ type: 'summary', heading: 'まとめ', items: [
    { icon: '⚡', color: 'F97316', text: '高速処理 — 従来比3倍' },
    { icon: '🔒', color: '3B82F6', text: 'セキュア — エンドツーエンド暗号化' },
]}
```
