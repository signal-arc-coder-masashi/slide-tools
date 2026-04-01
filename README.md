# slide-tools

Webスライド資料作成時の共通ユーティリティ集。

---

## pptx-exporter.js

HTMLで作ったWebスライドに**PPTXダウンロードボタンを1分で追加**できる共通スクリプト。

### 使い方

#### Step 1: 2つの `<script>` タグを追加

```html
<!-- PptxGenJS CDN（省略可: 自動ロードされる） -->
<script src="https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js"></script>
<!-- 共通エクスポーター -->
<script src="../slide-tools/pptx-exporter.js"></script>
```

#### Step 2: `</body>` の直前でスライド設定を定義

```html
<script>
initPPTXExport({
  filename: 'output.pptx',
  title:    'プレゼンタイトル',
  accent:   'F97316',   // アクセントカラー（#なし16進）
  slides: [
    { type: 'title',   title: 'メインタイトル', subtitle: 'サブタイトル', bg: '1C1917' },
    { type: 'bullets', kicker: 'SECTION 01', heading: '見出し', items: ['項目1', '項目2'] },
    { type: 'cards',   kicker: 'FEATURES',   heading: '機能',   cards: [{ label: '01', body: '説明' }] },
    { type: 'table',   kicker: 'COMPARE',    heading: '比較',   headers: ['項目','A','B'], rows: [['行1','a','b']] },
    { type: 'twoCol',  kicker: 'DETAIL',     heading: '詳細',   left: { items: ['...'] }, right: { body: '...' } },
    { type: 'summary', kicker: 'SUMMARY',    heading: 'まとめ', items: [{ icon: '◎', text: '説明' }] },
  ]
});
</script>
```

これだけで右上に「PPTXを書き出す」ボタンが自動表示される。

---

### スライドタイプ一覧

| type | 用途 | 必須プロパティ |
|------|------|----------------|
| `title` | タイトルスライド（暗背景） | `title` |
| `bullets` | 箇条書き + 補足欄 | `heading`, `items` |
| `cards` | カードグリッド（2列 or 3列） | `heading`, `cards` |
| `table` | 比較テーブル | `heading`, `headers`, `rows` |
| `twoCol` | 左右2カラムレイアウト | `heading`, `left`, `right` |
| `summary` | アイコン付きまとめ | `heading`, `items` |
| `image` | チャート・インフォグラフィック画像の埋め込み | `src` |

### 各タイプのオプション詳細

#### `title`
```js
{ type: 'title',
  bg:       '1C1917',        // 背景色
  eyebrow:  '2025 Edition',  // 小見出し（省略可）
  title:    'タイトル',
  subtitle: 'サブタイトル',   // 省略可
  body:     '補足テキスト'    // 省略可
}
```

#### `bullets`
```js
{ type: 'bullets',
  kicker:  'SECTION 01',
  heading: '見出し',
  accent:  'F97316',       // 省略時はグローバルaccentを使用
  items:   ['箇条書き1', '箇条書き2'],
  note:    '右側の補足テキスト'  // 省略可
}
```

#### `cards`
```js
{ type: 'cards',
  kicker: 'FEATURES',
  heading: '機能一覧',
  accent: 'F97316',
  cols: 3,   // 2 or 3（デフォルト3）
  cards: [
    { label: '01 / TITLE', body: '説明テキスト' },
  ]
}
```

#### `table`
```js
{ type: 'table',
  kicker:    'COMPARISON',
  heading:   '比較表',
  accent:    'F97316',
  headers:   ['項目', '列A', '列B'],
  rows:      [['行1', 'a', 'b']],
  colColors: [null, 'F97316', '0D9488']  // 列ごとの文字色（省略可）
}
```

#### `twoCol`
```js
{ type: 'twoCol',
  kicker:  'OVERVIEW',
  heading: 'タイトル',
  accent:  'F97316',
  left:  { items: ['箇条書き'] },   // または body: 'テキスト'
  right: { cards: [{ label, body }] }  // または body: 'テキスト'
}
```

#### `summary`
```js
{ type: 'summary',
  kicker:  'SUMMARY',
  heading: 'まとめ',
  accent:  'F97316',
  items: [
    { icon: '◎', color: 'F97316', text: '説明テキスト' },
  ],
  quickPicks: [   // 右下クイックリファレンス（省略可）
    { label: 'ラベル', value: '→ 値', color: 'F97316' },
  ]
}
```

#### `image`（チャート・インフォグラフィック）
```js
{ type: 'image',
  kicker:  'DATA',             // 省略可
  heading: 'グラフタイトル',    // 省略可
  src:     chartCanvas.toDataURL('image/png'),  // または画像パス
  sizing:  'contain',          // 'contain'|'cover'|'crop'（デフォルト: contain）
  caption: '出典: ...',        // 右下注記（省略可）
}
```

Chart.js canvas → PNG:
```js
const img = document.getElementById('my-chart').toDataURL('image/png');
```

Plotly → PNG:
```js
Plotly.toImage('plotly-div', { format: 'png', width: 1000, height: 400 }).then(img => { ... });
```

HTML要素（インフォグラフィック） → PNG（html2canvas使用）:
```js
html2canvas(document.querySelector('.stat-grid')).then(c => { const img = c.toDataURL(); });
```

---

### 動作仕様

- PptxGenJS が読み込み済みなら追加ロードしない（CDNタグは省略可能）
- ボタンは `position: fixed; top: 18px; right: 22px` に自動配置
- ダウンロード中はボタンが `disabled` 状態になる
- PPTX レイアウト: `LAYOUT_WIDE`（16:9 / 13.33" × 7.5"）
- フォント: Georgia（見出し）/ Calibri（本文）/ Courier New（モノスペース）

---

## 既存スライドへの適用例

| ファイル | 状態 |
|----------|------|
| `ai-tools-slides/index.html` | インライン `generatePPTX()` で実装済み |
| `ai-slides-genspark-manus/index.html` | インライン `generatePPTX()` で実装済み |

新規スライドには `pptx-exporter.js` を使うこと。既存ファイルは必要に応じてリファクタ。

---

## SLIDE ARCHIVE

公開スライド一覧ページ。作成したスライドを格納・検索できるアーカイブ。

**URL: https://slide-archive.vercel.app**
**GitHub: https://github.com/signal-arc-coder-masashi/slide-tools**

### ディレクトリ構成

```
outputs/
├── index.html          ← ギャラリー＋検索ページ（slide-archive.vercel.app）
├── genspark-manus/     → slide-archive.vercel.app/genspark-manus/
│   └── index.html
└── ai-tools/           → slide-archive.vercel.app/ai-tools/
    └── index.html
```

### 新しいスライドを追加する手順

1. `outputs/スライド名/index.html` を作成
2. `outputs/index.html` の `SLIDES` 配列に1エントリ追加：
```js
{
  id: 'スライド名',
  title: 'タイトル',
  description: '説明文',
  tags: ['タグ1', 'タグ2'],
  date: 'YYYY-MM-DD',
  url: './スライド名/',
},
```
3. `git push` → Vercel自動デプロイ（URL固定）

---

## skills/slide-dataviz/

データビジュアライゼーション付きスライドを作るための**オーケストレーター型スキル**。
タスクの種類に応じて5つのエージェントを使い分ける。

| エージェント | 参照ファイル | 用途 |
|------------|------------|------|
| Chart.js Inline | `references/chartjs.md` | 静的データ・シンプルなグラフ |
| Python Pipeline | `references/python-pipeline.md` | CSV/Excel → JSON → Chart.js |
| Plotly | `references/plotly.md` | インタラクティブ（ホバー・ズーム） |
| matplotlib SVG | `references/matplotlib-svg.md` | カスタム形状・細かいレイアウト制御 |
| Infographic | `references/infographic.md` | KPI・プロセス・比較の図解 |

スキルのエントリーポイント: `skills/slide-dataviz/SKILL.md`

---

## 変更履歴

### 2026-04-01
- **変更ファイル**: `outputs/tjs-ga4-2026-02/index.html`, `outputs/index.html`
- **内容**: 田口住生活設計室 GA4月次レポート（2026年2月 HPサイト編）を新規作成。Chart.jsによるKPIトレンド・チャネル分析・人気ページグラフを実装した6枚構成HTMLスライド
- **理由**: クライアント向け月次レポートをWEBスライド化。アーカイブに登録済み

### 2026-03-25
- **変更ファイル**: `pptx-exporter.js`, `skills/slide-dataviz/SKILL.md`, `skills/slide-dataviz/references/*.md`
- **内容**: pptx-exporter.js に `image` タイプレンダラーを追加。データビジュアライゼーション用スキル（5エージェント構成）を新規作成
- **理由**: グラフ・インフォグラフィックを含むスライドをあらゆるパターンで作れるよう、オーケストレーター型スキルとして共通知識を整備

### 2026-03-25（初版）
- **変更ファイル**: `pptx-exporter.js`
- **内容**: 新規作成。WebスライドにPPTXエクスポート機能を追加する共通ユーティリティ
- **理由**: ai-tools-slides, ai-slides-genspark-manusで同一コードを重複させないため共通化
