# Agent: matplotlib → SVG インライン

**用途**: カスタム形状・アノテーション・複合レイアウト・ブランドカラーを細かく制御したいグラフ。インタラクション不要だが見た目にこだわりたい場合。

---

## 基本パターン

```python
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import io

# フォント設定（日本語）
plt.rcParams['font.family'] = 'Hiragino Sans'  # Mac
# plt.rcParams['font.family'] = 'Noto Sans CJK JP'  # Linux
plt.rcParams['axes.spines.top']   = False
plt.rcParams['axes.spines.right'] = False

fig, ax = plt.subplots(figsize=(8, 4.5), dpi=150)

# ── グラフ描画 ──
ax.set_facecolor('#F8F9FC')
fig.patch.set_facecolor('#F8F9FC')  # または透明: set_alpha(0)

# ── SVG 出力 ──
buf = io.BytesIO()
fig.savefig(buf, format='svg', bbox_inches='tight',
            facecolor=fig.get_facecolor(), edgecolor='none')
plt.close(fig)

svg_raw = buf.getvalue().decode('utf-8')
# XML 宣言を除去して <svg>...</svg> だけ残す
svg_clean = svg_raw[svg_raw.find('<svg'):]
```

`index.html` に埋め込む:

```html
<div class="chart-card">
  <!-- ↓ Python が生成した svg_clean を貼る -->
  <svg viewBox="..." xmlns="...">...</svg>
</div>
```

または Python が HTML を直接生成:

```python
template = Path('index.template.html').read_text()
html = template.replace('<!-- __CHART_1__ -->', svg_clean)
Path('index.html').write_text(html)
```

---

## グラフスタイル設定

### ブランドカラーパレット

```python
PALETTE = {
    'primary':   '#F97316',
    'secondary': '#3B82F6',
    'success':   '#10B981',
    'muted':     '#94A3B8',
    'bg':        '#F8F9FC',
    'surface':   '#FFFFFF',
    'text':      '#0F172A',
}
```

### 軸・グリッドのスタイリング

```python
ax.set_facecolor(PALETTE['bg'])
ax.grid(axis='y', color='rgba(0,0,0,0.05)', linewidth=0.8, zorder=0)
ax.tick_params(axis='both', labelsize=10, colors=PALETTE['muted'])
ax.set_xlabel('', fontsize=0)  # ラベル不要な場合
for spine in ax.spines.values():
    spine.set_visible(False)
```

### 棒グラフ（角丸付き）

```python
bars = ax.bar(
    x_positions, values,
    color=PALETTE['primary'], width=0.55,
    zorder=3
)

# 角丸は FancyBboxPatch で代替
for bar in bars:
    bar.set_visible(False)
    x, y, w, h = bar.get_x(), bar.get_y(), bar.get_width(), bar.get_height()
    fancy = mpatches.FancyBboxPatch(
        (x + 0.04, y), w - 0.08, h,
        boxstyle='round,pad=0,rounding_size=0.06',
        facecolor=PALETTE['primary'], edgecolor='none', zorder=3
    )
    ax.add_patch(fancy)
```

### 折れ線（グラデーション塗り）

```python
import numpy as np
from matplotlib.patches import PathPatch
from matplotlib.path import Path

ax.plot(x, y, color=PALETTE['primary'], linewidth=2.5, zorder=4)
ax.fill_between(x, y, alpha=0.12, color=PALETTE['primary'], zorder=3)
```

### データラベル表示

```python
for i, (xi, yi) in enumerate(zip(x_vals, y_vals)):
    ax.text(xi, yi + max(y_vals)*0.02, f'{yi:,}',
            ha='center', va='bottom', fontsize=10,
            color=PALETTE['text'], fontweight='bold')
```

---

## 複合レイアウト（サブプロット）

```python
fig = plt.figure(figsize=(12, 5))
gs = fig.add_gridspec(1, 2, width_ratios=[1.5, 1], wspace=0.08)

ax_left  = fig.add_subplot(gs[0])  # 棒グラフ
ax_right = fig.add_subplot(gs[1])  # ドーナツ

# ... それぞれ描画 ...
```

---

## アノテーション・吹き出し

```python
# 矢印付き注記
ax.annotate(
    '過去最高値',
    xy=(peak_x, peak_y),
    xytext=(peak_x + 0.5, peak_y + 20),
    arrowprops=dict(arrowstyle='->', color=PALETTE['primary'], lw=1.5),
    fontsize=10, color=PALETTE['text'],
)

# 強調ボックス
ax.axvspan(x_start, x_end, alpha=0.08, color=PALETTE['primary'], zorder=1)
ax.text((x_start + x_end)/2, ax.get_ylim()[1] * 0.95,
        '注目期間', ha='center', fontsize=9, color=PALETTE['primary'])
```

---

## PNG ファイルとして保存（PPTX 用）

```python
# PNG 保存（スケール2倍でRetinaクオリティ）
fig.savefig('charts/chart1.png', format='png', dpi=150,
            bbox_inches='tight', facecolor=fig.get_facecolor())
```

HTML 側で `<img>` タグとして使う場合:

```html
<img src="./charts/chart1.png" style="width:100%; height:auto; display:block;">
```

PPTX エクスポート config:

```javascript
{ type: 'image', kicker: 'DATA', heading: 'グラフ', src: './charts/chart1.png' }
```

---

## 日本語フォント対応（環境別）

```python
import matplotlib
import platform

if platform.system() == 'Darwin':
    matplotlib.rc('font', family='Hiragino Sans')
elif platform.system() == 'Linux':
    matplotlib.rc('font', family='Noto Sans CJK JP')
else:  # Windows
    matplotlib.rc('font', family='MS Gothic')
```

フォントが見つからない場合（CI環境など）:

```bash
pip install japanize-matplotlib
```

```python
import japanize_matplotlib  # import するだけで日本語対応
```
