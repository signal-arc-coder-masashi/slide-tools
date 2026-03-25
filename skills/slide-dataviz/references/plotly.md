# Agent: Plotly（インタラクティブ）

**用途**: ホバー・ズーム・フィルター・ドリルダウンなど、インタラクションが必要なグラフ。デモ・分析レポート向き。

---

## セットアップ

```html
<!-- <head> に追加 -->
<script src="https://cdn.plot.ly/plotly-2.30.0.min.js"></script>
```

または Python で CDN 付き HTML を生成:

```python
import plotly.io as pio
pio.renderers.default = 'browser'
```

---

## パターン A: Python → HTML Fragment → 埋め込み

### Python 側

```python
import plotly.express as px
import plotly.graph_objects as go
import plotly.io as pio
import pandas as pd

df = pd.read_csv('data/raw/data.csv')

# 棒グラフ
fig = px.bar(
    df, x='month', y='sales', color='category',
    color_discrete_sequence=['#F97316', '#3B82F6', '#10B981'],
    template='plotly_white',
)
fig.update_layout(
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)',
    font_family='Noto Sans JP, Calibri, sans-serif',
    font_color='#0F172A',
    legend=dict(orientation='h', yanchor='bottom', y=1.02),
    margin=dict(l=0, r=0, t=40, b=0),
)

# HTML fragment 出力（<div>...</div> のみ、<html> タグなし）
fragment = pio.to_html(
    fig,
    full_html=False,
    include_plotlyjs=False,  # CDN を別途読み込む場合
    div_id='plotly-chart-1',
    config={'responsive': True, 'displayModeBar': False}
)

print(fragment)  # index.html に埋め込む
```

### HTML テンプレートへの埋め込み

```html
<!-- Python が出力した fragment をここに貼る -->
<div class="chart-card" style="height: 360px;">
  <!-- fragment start -->
  <div id="plotly-chart-1">...</div>
  <!-- fragment end -->
</div>
```

---

## パターン B: ブラウザ直接描画（JS のみ）

```html
<div id="plotly-div" style="width:100%; height:340px;"></div>
<script>
Plotly.newPlot('plotly-div', [
  {
    type: 'bar',
    x: ['1月', '2月', '3月', '4月'],
    y: [120, 150, 90, 210],
    marker: { color: '#F97316', cornerradius: 6 },
    name: '売上'
  }
], {
  plot_bgcolor: 'rgba(0,0,0,0)',
  paper_bgcolor: 'rgba(0,0,0,0)',
  font: { family: 'Noto Sans JP, Calibri', color: '#64748B' },
  margin: { l: 40, r: 10, t: 10, b: 40 },
  xaxis: { showgrid: false },
  yaxis: { gridcolor: 'rgba(0,0,0,0.05)' }
}, {
  responsive: true,
  displayModeBar: false,
});
</script>
```

---

## よく使うチャートタイプ

### 散布図（相関分析）

```python
fig = px.scatter(df, x='x_col', y='y_col', size='size_col', color='category',
                 trendline='ols', template='plotly_white')
```

### ファネルチャート（コンバージョン）

```python
fig = go.Figure(go.Funnel(
    y=['訪問', '登録', '購入', 'リピート'],
    x=[1000, 420, 87, 34],
    marker_color=['#F97316', '#FB923C', '#FED7AA', '#FEF3C7'],
))
```

### ヒートマップ

```python
fig = px.imshow(pivot_df, color_continuous_scale='Oranges', aspect='auto')
fig.update_traces(hovertemplate='%{x} × %{y}: %{z}')
```

### ツリーマップ（構成比）

```python
fig = px.treemap(df, path=['category', 'item'], values='value',
                 color='value', color_continuous_scale='RdBu')
```

---

## Python → 完全 HTML 生成（スタンドアロン）

スライドとチャートを Python だけで完全生成する場合:

```python
full_html = pio.to_html(
    fig,
    full_html=True,
    include_plotlyjs='cdn',
    config={'responsive': True}
)
with open('slide_chart.html', 'w', encoding='utf-8') as f:
    f.write(full_html)
```

スライドの1セクションとして `<iframe>` で埋め込むか、メインHTML に fragment を挿入する。

---

## PPTX エクスポート対応

Plotly グラフは `Plotly.toImage()` で PNG に変換:

```javascript
Plotly.toImage('plotly-div', { format: 'png', width: 1000, height: 400 })
  .then(imgData => {
    initPPTXExport({
      filename: 'slides.pptx',
      accent: 'F97316',
      slides: [
        { type: 'image', kicker: 'ANALYSIS', heading: 'データ分析', src: imgData }
      ]
    });
  });
```

または Python + kaleido で静的 PNG を事前生成:

```python
pip install kaleido

fig.write_image('charts/chart1.png', width=1000, height=400, scale=2)
```

---

## 注意点

- `full_html=False` で fragment 出力した場合、Plotly.js の CDN タグを `<head>` に必ず追加する
- `responsive: true` は config オブジェクトに渡す（layout ではない）
- スライドが非表示（`display:none`）の状態でチャートが初期化されるとサイズが 0 になる → スライドが表示される際に `Plotly.relayout(id, {autosize: true})` を呼ぶ
