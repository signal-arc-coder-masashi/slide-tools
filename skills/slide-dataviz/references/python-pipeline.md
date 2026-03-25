# Agent: Python Pipeline → Chart.js

**用途**: CSV / Excel / JSON などのデータファイルを Python で処理し、Chart.js で描画する。データが多い・集計が必要・定期更新がある場合に使う。

---

## 基本フロー

```
data/raw/data.csv
    ↓ process_data.py
data/processed/chart_data.json
    ↓ index.html (Chart.js)
    ↓ PPTX export
```

---

## Step 1: Python データ処理スクリプト

### CSV → JSON（基本）

```python
# process_data.py
import pandas as pd
import json
from pathlib import Path

df = pd.read_csv('data/raw/data.csv', encoding='utf-8')

# 集計
monthly = df.groupby('month').agg(
    sales=('sales', 'sum'),
    count=('id', 'count')
).reset_index()

output = {
    'labels': monthly['month'].tolist(),
    'sales':  monthly['sales'].tolist(),
    'count':  monthly['count'].tolist(),
}

Path('data/processed').mkdir(parents=True, exist_ok=True)
with open('data/processed/chart_data.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"✓ {len(monthly)} records processed")
```

### Excel（複数シート）

```python
import pandas as pd

xl = pd.ExcelFile('data/raw/report.xlsx')
dfs = {sheet: xl.parse(sheet) for sheet in xl.sheet_names}

# シートごとに処理
for name, df in dfs.items():
    # ... 集計処理 ...
```

### 複数グラフ用 JSON 構造

```python
output = {
    'bar': {
        'labels': [...],
        'values': [...],
    },
    'line': {
        'labels': [...],
        'datasets': [
            {'label': 'A', 'values': [...]},
            {'label': 'B', 'values': [...]},
        ]
    },
    'summary': {
        'total':   1234567,
        'growth':  '+42%',
        'top_item': 'Product X',
    }
}
```

---

## Step 2: HTML でデータを読み込む

### fetch() パターン（サーバーが必要）

```html
<script>
fetch('./data/processed/chart_data.json')
  .then(r => r.json())
  .then(data => {
    new Chart(document.getElementById('bar-chart'), {
      type: 'bar',
      data: {
        labels: data.bar.labels,
        datasets: [{ data: data.bar.values, backgroundColor: '#F97316', borderRadius: 6 }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  });
</script>
```

### インライン埋め込みパターン（ファイル単体で動く）

Python 側で JSON を HTML テンプレートに埋め込む:

```python
# generate_slide.py
import json
from pathlib import Path

with open('data/processed/chart_data.json') as f:
    chart_data = json.load(f)

template = Path('index.template.html').read_text(encoding='utf-8')
html = template.replace(
    '/* __CHART_DATA__ */',
    f'const CHART_DATA = {json.dumps(chart_data, ensure_ascii=False)};'
)
Path('index.html').write_text(html, encoding='utf-8')
print("✓ index.html generated")
```

`index.template.html` 側:

```html
<script>
/* __CHART_DATA__ */
// ↑ Python が CHART_DATA = {...} に置換する

document.addEventListener('DOMContentLoaded', () => {
  new Chart(document.getElementById('bar-chart'), {
    type: 'bar',
    data: { labels: CHART_DATA.bar.labels, datasets: [{ data: CHART_DATA.bar.values }] },
    options: { responsive: true, maintainAspectRatio: false }
  });
});
</script>
```

---

## 実行手順

プロジェクト内に `Makefile` または `README.md` に手順を記載する:

```bash
# データ処理
python process_data.py

# （インライン埋め込みの場合）
python generate_slide.py

# ブラウザで確認
open index.html
# または
python -m http.server 8000  # fetch() を使う場合
```

---

## よく使う pandas パターン

```python
# 日付でソート
df['date'] = pd.to_datetime(df['date'])
df = df.sort_values('date')

# 上位N件
top5 = df.nlargest(5, 'value')

# 前期比
df['growth'] = df['value'].pct_change() * 100

# ピボット（カテゴリ × 月）
pivot = df.pivot_table(index='month', columns='category', values='sales', aggfunc='sum').fillna(0)
labels = pivot.index.tolist()
datasets = [{'label': col, 'values': pivot[col].tolist()} for col in pivot.columns]
```

---

## PPTX エクスポート対応

`fetch()` 完了後にチャートが描画されるため、PNG 取得はコールバック内で行う:

```javascript
fetch('./data/processed/chart_data.json')
  .then(r => r.json())
  .then(data => {
    const chartInst = new Chart(document.getElementById('bar-chart'), { ... });

    // アニメーション完了後に PNG を取得
    chartInst.options.animation = {
      onComplete: () => {
        const chartImg = document.getElementById('bar-chart').toDataURL('image/png');
        initPPTXExport({
          filename: 'report.pptx',
          accent: 'F97316',
          slides: [
            { type: 'image', kicker: 'DATA', heading: '月別推移', src: chartImg }
          ]
        });
      }
    };
    chartInst.update();
  });
```
