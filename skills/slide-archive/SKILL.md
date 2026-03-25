---
name: slide-archive
description: "High-quality web slide creation and storage to SLIDE ARCHIVE. Use this skill whenever the user asks to: create a presentation, make a web slide, build slide materials, add slides to the archive, or store/manage existing slides. Also triggers on: 'スライドを作って', '資料を作って', 'プレゼン資料', 'スライドをアーカイブに追加', 'slide-archiveに保存'. Always use this skill for any slide creation task — do not attempt to create slides without it."
---

# SLIDE ARCHIVE Skill

高品質なWEBスライドを作成し、SLIDE ARCHIVEに格納するためのスキル。

## アーカイブ情報

- **公開URL**: https://slide-archive.vercel.app
- **リポジトリ**: https://github.com/signal-arc-coder-masashi/slide-tools
- **ローカルパス**: `/Users/kisinomasasi/projects/slide-tools/outputs/`

---

## ワークフロー

### Step 1: スライド内容を確認する

以下を確認してから制作に入る：
- テーマ・題材は何か
- ターゲット（誰に見せるか）
- トーン（明るい/クール/プロフェッショナル/ポップ など）
- スライド枚数の目安
- PPTXエクスポートが必要か

### Step 2: HTMLスライドを作成する

**`document-skills:frontend-design` スキルを必ず使う。**

スライド作成の原則：
- 単一の `index.html`（HTML + CSS + JS 完結）
- レスポンシブ（PC優先、全画面表示対応）
- キーボードナビゲーション対応（← → または PageUp/Down）
- フォントはGoogle Fontsから選ぶ（Inter/Roboto/Arial は禁止）
- アニメーション: スライド切り替えはCSSトランジションで実装
- PPTXエクスポートが必要な場合は `pptx-exporter.js` を統合する

**`pptx-exporter.js` の統合方法:**
```html
<script src="https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js"></script>
<script src="../../pptx-exporter.js"></script>
<script>
initPPTXExport({
  filename: 'slide-name.pptx',
  title: 'タイトル',
  accent: 'アクセントカラー（#なし）',
  slides: [ ... ]
});
</script>
```

### Step 3: アーカイブに格納する

1. スライドを `outputs/スライドID/index.html` として保存
2. `outputs/index.html` の `SLIDES` 配列に追加：

```js
{
  id: 'スライドID',           // ディレクトリ名と同じ（英数字・ハイフン）
  title: 'スライドタイトル',
  description: '1〜2行の説明文',
  tags: ['タグ1', 'タグ2'],   // 検索・フィルター用
  date: 'YYYY-MM-DD',
  url: './スライドID/',
},
```

3. git commit & push：
```bash
cd /Users/kisinomasasi/projects/slide-tools
git add outputs/
git commit -m "feat: [スライドタイトル] を追加"
git push origin main
```

→ Vercelが自動デプロイ。1〜2分後に https://slide-archive.vercel.app で公開される。

---

## スライドIDの命名規則

| 例 | ID |
|---|---|
| GenSpark・Manus解説 | `genspark-manus` |
| AI導入コンサル提案書 | `ai-consulting-proposal` |
| Signal Craft紹介 | `signal-craft-intro` |
| Q1進捗レポート | `q1-progress-2026` |

- 英数字とハイフンのみ
- 短く・内容がわかる名前

---

## 品質チェックリスト

スライドを格納する前に確認：

- [ ] 全スライドが正常に表示される
- [ ] キーボードナビゲーションが動作する
- [ ] フォントが正しく読み込まれる
- [ ] スマホ表示でも崩れていない（最低限）
- [ ] PPTXエクスポートが正常に動作する（該当する場合）
- [ ] `SLIDES` 配列に正しく追加されている
- [ ] タグが適切につけられている

---

## 既存スライド一覧

| ID | タイトル | URL |
|---|---|---|
| `genspark-manus` | GenSpark・Manus スライド機能解説 | https://slide-archive.vercel.app/genspark-manus/ |
| `ai-tools` | AIツール活用スライド | https://slide-archive.vercel.app/ai-tools/ |

---

## 関連スキル

データビジュアライゼーション（グラフ・インフォグラフィック）が必要な場合は `slide-dataviz` スキルも参照する。
