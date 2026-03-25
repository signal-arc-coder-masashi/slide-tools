/**
 * pptx-exporter.js
 * Webスライド共通 PPTXエクスポートユーティリティ
 *
 * 【使い方】
 * 1. HTMLファイルに以下2行を追加する
 *    <script src="https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js"></script>
 *    <script src="../slide-tools/pptx-exporter.js"></script>
 *
 * 2. HTMLの </body> 前に window.SLIDE_CONFIG を定義し initPPTXExport() を呼ぶ
 *    <script>
 *    window.SLIDE_CONFIG = { ... };   // ← スライド定義（下記参照）
 *    initPPTXExport(window.SLIDE_CONFIG);
 *    </script>
 *
 * 【SLIDE_CONFIG の構造】
 * {
 *   filename : 'output.pptx',          // 保存ファイル名
 *   title    : 'プレゼンタイトル',       // PPTXのメタタイトル
 *   accent   : 'F97316',               // メインアクセントカラー（16進）
 *   slides   : [ ...SlideDefinition ]  // スライド定義配列（下記）
 * }
 *
 * 【SlideDefinition の type 一覧】
 *
 *  type: 'title'
 *    bg       : '1C1917'        // 背景色
 *    eyebrow  : '2025 Edition'  // 小見出し
 *    title    : 'メインタイトル'
 *    subtitle : 'サブタイトル'
 *    body     : '補足テキスト'
 *
 *  type: 'bullets'
 *    kicker   : 'SECTION 01'
 *    heading  : 'スライドタイトル'
 *    accent   : 'F97316'        // このスライドのアクセント色（省略可）
 *    items    : ['箇条書き1', '箇条書き2', ...]
 *    note     : '右側補足テキスト'（省略可）
 *
 *  type: 'cards'
 *    kicker   : 'FEATURES'
 *    heading  : '機能一覧'
 *    accent   : 'F97316'
 *    cols     : 3               // 列数（2 or 3、デフォルト3）
 *    cards    : [
 *      { label: '01 / TITLE', body: '説明テキスト' },
 *      ...
 *    ]
 *
 *  type: 'table'
 *    kicker   : 'COMPARISON'
 *    heading  : '比較表'
 *    accent   : 'F97316'
 *    headers  : ['項目', '列A', '列B', '列C']
 *    rows     : [
 *      ['行ラベル', 'セルA', 'セルB', 'セルC'],
 *      ...
 *    ]
 *    colColors: [null, 'F97316', '0D9488', null]  // 列ごとの文字色（省略可）
 *
 *  type: 'twoCol'
 *    kicker   : 'OVERVIEW'
 *    heading  : 'タイトル'
 *    accent   : 'F97316'
 *    left     : {
 *      items  : ['箇条書き1', ...]   // or
 *      body   : '自由テキスト'
 *    }
 *    right    : {
 *      cards  : [{ label, body }, ...]   // or
 *      body   : '自由テキスト'
 *    }
 *
 *  type: 'image'
 *    kicker   : 'DATA'           // 省略可
 *    heading  : 'グラフタイトル'  // 省略可
 *    src      : 'data:image/png;base64,...'  // canvas.toDataURL() または画像パス
 *    x, y, w, h : number         // 省略可（デフォルト: 0.5, 2.0, 12.3, 5.2）
 *    sizing   : 'contain'|'cover'|'crop'  // 省略可（デフォルト: contain）
 *    caption  : '出典: ...'      // 右下注記（省略可）
 *    bg       : 'F8F9FC'         // 背景色（省略可）
 *
 *  type: 'summary'
 *    kicker   : 'SUMMARY'
 *    heading  : 'まとめ'
 *    accent   : 'F97316'
 *    items    : [
 *      { icon: '◎', color: 'F97316', text: '説明テキスト' },
 *      ...
 *    ]
 *    quickPicks: [                        // 右下クイックリファレンス（省略可）
 *      { label: 'ラベル', value: '→ 値', color: 'F97316' },
 *      ...
 *    ]
 */

(function () {
  'use strict';

  /* ── デザイン定数 ── */
  const LAYOUT = 'LAYOUT_WIDE'; // 13.33" × 7.5"
  const F = { disp: 'Georgia', body: 'Calibri', mono: 'Courier New' };
  const BASE = {
    bg: 'F8F9FC', white: 'FFFFFF', dark: '0F172A',
    text: '0F172A', muted: '64748B', faint: 'F1F5F9',
    border: 'E2E8F0',
  };

  /* ── ボタン + スタイル注入 ── */
  function injectUI() {
    if (document.getElementById('__pptx-btn')) return;
    const style = document.createElement('style');
    style.textContent = `
      #__pptx-btn {
        position: fixed; top: 18px; right: 22px; z-index: 9999;
        display: inline-flex; align-items: center; gap: 7px;
        padding: 9px 18px; border-radius: 8px; cursor: pointer;
        background: #ffffff; border: 1px solid rgba(0,0,0,0.12);
        font-size: 11px; letter-spacing: .05em; font-weight: 600;
        color: #334155; font-family: 'JetBrains Mono','DM Mono','Courier New',monospace;
        box-shadow: 0 2px 8px rgba(0,0,0,.08);
        transition: border-color .18s, color .18s, box-shadow .18s;
        white-space: nowrap;
      }
      #__pptx-btn:hover  { border-color: var(--__pptx-accent,#3b82f6); color: var(--__pptx-accent,#3b82f6); box-shadow: 0 4px 14px rgba(0,0,0,.12); }
      #__pptx-btn:disabled { opacity: .5; cursor: default; pointer-events: none; }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = '__pptx-btn';
    btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>PPTXを書き出す`;
    document.body.appendChild(btn);
    return btn;
  }

  /* ── PptxGenJS 読み込み確認 ── */
  function waitForPptxGenJS(cb) {
    if (typeof PptxGenJS !== 'undefined') { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  /* ──────────────────────────────────────────
     スライド描画ヘルパー
  ────────────────────────────────────────── */
  function _accent(cfg) { return cfg.accent || BASE.dark; }

  function _hd(s, pptx, kicker, heading, accent) {
    s.addText(kicker ? kicker.toUpperCase() : '', {
      x: .5, y: .5, w: 12, h: .28,
      fontSize: 9, color: BASE.muted, fontFace: F.mono, charSpacing: 3, bold: true,
    });
    s.addShape(pptx.ShapeType.rect, {
      x: .5, y: .86, w: .4, h: .05,
      fill: { color: accent }, line: { type: 'none' },
    });
    s.addText(heading || '', {
      x: .5, y: .9, w: 12, h: .85,
      fontSize: 29, color: BASE.text, bold: true, fontFace: F.disp,
    });
  }

  function _card(s, pptx, x, y, w, h, label, body, accent) {
    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w, h, rectRadius: .07,
      fill: { color: BASE.white }, line: { color: accent, pt: 1.2 },
    });
    if (label) s.addText(label, {
      x: x + .15, y: y + .13, w: w - .3, h: .22,
      fontSize: 9, color: accent, fontFace: F.mono, bold: true,
    });
    if (body) s.addText(body, {
      x: x + .15, y: y + (label ? .38 : .15), w: w - .3,
      h: h - (label ? .52 : .3),
      fontSize: 11.5, color: BASE.text, fontFace: F.body,
      lineSpacingMultiple: 1.4, valign: 'top',
    });
  }

  function _buls(s, items, accent, x, y, w) {
    (items || []).forEach((txt, i) => {
      s.addText(
        [{ text: '→ ', options: { color: accent, bold: true, fontSize: 12 } },
         { text: txt, options: { color: BASE.text, fontSize: 12 } }],
        { x, y: y + i * .43, w, h: .43, fontFace: F.body, lineSpacingMultiple: 1.3, valign: 'middle' },
      );
    });
  }

  /* ──────────────────────────────────────────
     スライドタイプ別レンダラー
  ────────────────────────────────────────── */
  const RENDERERS = {

    /* ── title ── */
    title(pptx, def) {
      const s = pptx.addSlide();
      s.background = { color: def.bg || '0F172A' };
      if (def.eyebrow) s.addText(def.eyebrow, {
        x: .6, y: .5, w: 11, h: .28,
        fontSize: 10, color: '888888', fontFace: F.mono,
      });
      s.addText(def.title || '', {
        x: .6, y: .85, w: 11, h: 3,
        fontSize: 52, color: BASE.white, bold: true, fontFace: F.disp, lineSpacingMultiple: 1.1,
      });
      if (def.subtitle) {
        const ac = def.accentColor || 'AAAAAA';
        s.addShape(pptx.ShapeType.rect, { x: .6, y: 4.1, w: 3.2, h: .05, fill: { color: ac }, line: { type: 'none' } });
        s.addText(def.subtitle, {
          x: .6, y: 4.3, w: 11, h: .55,
          fontSize: 18, color: 'CCCCCC', fontFace: F.disp, italic: true,
        });
      }
      if (def.body) s.addText(def.body, {
        x: .6, y: 5.0, w: 9.5, h: .9,
        fontSize: 13, color: '888888', fontFace: F.body, lineSpacingMultiple: 1.7,
      });
    },

    /* ── bullets ── */
    bullets(pptx, def) {
      const s = pptx.addSlide();
      s.background = { color: BASE.bg };
      const ac = _accent(def);
      _hd(s, pptx, def.kicker, def.heading, ac);

      const hasNote = !!def.note;
      const bw = hasNote ? 6.1 : 12.3;
      _buls(s, def.items, ac, .5, 2.1, bw);

      if (hasNote) {
        s.addShape(pptx.ShapeType.roundRect, {
          x: 7.0, y: 2.0, w: 5.8, h: 5.3, rectRadius: .08,
          fill: { color: BASE.white }, line: { color: BASE.border, pt: 1 },
        });
        s.addText(def.note, {
          x: 7.2, y: 2.15, w: 5.4, h: 5.0,
          fontSize: 12.5, color: BASE.text, fontFace: F.body, lineSpacingMultiple: 1.7, valign: 'top',
        });
      }
    },

    /* ── cards ── */
    cards(pptx, def) {
      const s = pptx.addSlide();
      s.background = { color: BASE.bg };
      const ac = _accent(def);
      _hd(s, pptx, def.kicker, def.heading, ac);

      const cols = def.cols || 3;
      const cw = cols === 2 ? 6.0 : 4.1;
      const ch = cols === 2 ? 2.4 : 2.3;
      const gap = cols === 2 ? .15 : .08;

      (def.cards || []).forEach((c, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        _card(s, pptx, .5 + col * (cw + gap), 2.0 + row * (ch + .12), cw, ch, c.label, c.body, ac);
      });
    },

    /* ── table ── */
    table(pptx, def) {
      const s = pptx.addSlide();
      s.background = { color: BASE.bg };
      const ac = _accent(def);
      _hd(s, pptx, def.kicker, def.heading, ac);

      const headers = def.headers || [];
      const rows    = def.rows    || [];
      const colColors = def.colColors || [];

      const TH = { fill: { color: 'F1F5F9' }, color: BASE.muted, fontFace: F.mono, fontSize: 10, bold: true };
      const TD = { color: BASE.text, fontFace: F.body, fontSize: 11.5 };

      const tableRows = [
        headers.map((h, i) => ({ text: h, options: { ...TH, color: colColors[i] || BASE.muted } })),
        ...rows.map(row =>
          row.map((cell, i) => ({
            text: cell,
            options: { ...TD, color: colColors[i] || BASE.text, bold: !!colColors[i] },
          }))
        ),
      ];

      const totalW = 12.3;
      const colW = Array(headers.length).fill(totalW / headers.length);
      s.addTable(tableRows, {
        x: .5, y: 2.1, w: totalW, rowH: .46,
        colW, border: { type: 'solid', color: BASE.border, pt: .8 },
        fontFace: F.body, fontSize: 11.5,
      });
    },

    /* ── twoCol ── */
    twoCol(pptx, def) {
      const s = pptx.addSlide();
      s.background = { color: BASE.bg };
      const ac = _accent(def);
      _hd(s, pptx, def.kicker, def.heading, ac);

      // Left side
      const left = def.left || {};
      if (left.items) _buls(s, left.items, ac, .5, 2.1, 6.1);
      else if (left.body) s.addText(left.body, {
        x: .5, y: 2.1, w: 6.1, h: 5.0,
        fontSize: 12.5, color: BASE.text, fontFace: F.body, lineSpacingMultiple: 1.7, valign: 'top',
      });

      // Right side
      const right = def.right || {};
      if (right.cards) {
        right.cards.forEach((c, i) => {
          _card(s, pptx, 6.9, 2.0 + i * 1.72, 5.9, 1.58, c.label, c.body, ac);
        });
      } else if (right.body) {
        s.addShape(pptx.ShapeType.roundRect, {
          x: 6.9, y: 2.0, w: 5.9, h: 5.3, rectRadius: .08,
          fill: { color: BASE.white }, line: { color: BASE.border, pt: 1 },
        });
        s.addText(right.body, {
          x: 7.1, y: 2.15, w: 5.5, h: 5.0,
          fontSize: 12.5, color: BASE.text, fontFace: F.body, lineSpacingMultiple: 1.7, valign: 'top',
        });
      }
    },

    /* ── image ── チャート・インフォグラフィックの PNG/dataURL を埋め込む */
    image(pptx, def) {
      const s = pptx.addSlide();
      s.background = { color: def.bg || BASE.bg };
      const ac = _accent(def);

      // ヘッダー（kicker + heading）
      if (def.kicker || def.heading) {
        _hd(s, pptx, def.kicker, def.heading, ac);
      }

      // 画像配置（ヘッダーありなら y=2.0、なしなら y=0.3 でほぼ全面）
      const hasHeader = !!(def.kicker || def.heading);
      const imgY = hasHeader ? 2.0 : 0.3;
      const imgH = hasHeader ? 5.2 : 6.9;

      if (def.src) {
        // src が data URL か外部 URL かを判定
        const isDataUrl = def.src.startsWith('data:');
        s.addImage({
          data: isDataUrl ? def.src : undefined,
          path: isDataUrl ? undefined : def.src,
          x: def.x !== undefined ? def.x : 0.5,
          y: def.y !== undefined ? def.y : imgY,
          w: def.w !== undefined ? def.w : 12.3,
          h: def.h !== undefined ? def.h : imgH,
          sizing: { type: def.sizing || 'contain', align: 'center', valign: 'middle' },
        });
      }

      // キャプション（省略可）
      if (def.caption) {
        s.addText(def.caption, {
          x: 0.5, y: 7.1, w: 12.3, h: 0.28,
          fontSize: 9, color: BASE.muted, fontFace: F.body, align: 'right',
        });
      }
    },

    /* ── summary ── */
    summary(pptx, def) {
      const s = pptx.addSlide();
      s.background = { color: BASE.bg };
      const ac = _accent(def);
      _hd(s, pptx, def.kicker, def.heading, ac);

      (def.items || []).forEach((item, i) => {
        s.addShape(pptx.ShapeType.roundRect, {
          x: .5, y: 2.05 + i * 1.08, w: 7.8, h: .96,
          rectRadius: .07, fill: { color: BASE.white }, line: { color: BASE.border, pt: .8 },
        });
        s.addText(item.icon || '◎', {
          x: .65, y: 2.05 + i * 1.08, w: .5, h: .96,
          fontSize: 18, color: item.color || ac, align: 'center', valign: 'middle',
        });
        s.addText(item.text || '', {
          x: 1.25, y: 2.05 + i * 1.08, w: 6.9, h: .96,
          fontSize: 12, color: BASE.text, fontFace: F.body, lineSpacingMultiple: 1.5, valign: 'middle',
        });
      });

      if (def.quickPicks) {
        def.quickPicks.forEach((p, i) => {
          const px = 8.6 + (i % 2 === 0 ? 0 : 2.9);
          const py = 2.05 + Math.floor(i / 2) * 1.0;
          s.addShape(pptx.ShapeType.roundRect, {
            x: px, y: py, w: 2.7, h: .84,
            rectRadius: .07, fill: { color: BASE.faint }, line: { color: p.color || ac, pt: 1 },
          });
          s.addText(p.label || '', {
            x: px + .1, y: py + .06, w: 2.5, h: .28,
            fontSize: 9, color: p.color || ac, fontFace: F.mono, bold: true,
          });
          s.addText(p.value || '', {
            x: px + .1, y: py + .4, w: 2.5, h: .32,
            fontSize: 11, color: BASE.text, fontFace: F.body, bold: true,
          });
        });
      }
    },
  };

  /* ──────────────────────────────────────────
     メイン：initPPTXExport
  ────────────────────────────────────────── */
  window.initPPTXExport = function (config) {
    const btn = injectUI();
    if (!btn) return;

    // アクセントカラーをCSS変数にセット（ホバー色）
    const ac = config.accent || '3b82f6';
    document.documentElement.style.setProperty('--__pptx-accent', `#${ac}`);

    btn.addEventListener('click', () => {
      waitForPptxGenJS(async () => {
        btn.disabled = true;
        btn.textContent = '生成中...';
        try {
          const pptx = new PptxGenJS();
          pptx.layout = LAYOUT;
          if (config.title) pptx.title = config.title;

          (config.slides || []).forEach(slide => {
            const renderer = RENDERERS[slide.type];
            if (!renderer) { console.warn(`[pptx-exporter] Unknown type: ${slide.type}`); return; }
            // デフォルトアクセントを上位から継承
            if (!slide.accent && config.accent) slide.accent = config.accent;
            renderer(pptx, slide);
          });

          await pptx.writeFile({ fileName: config.filename || 'slides.pptx' });
        } catch (e) {
          console.error('[pptx-exporter]', e);
          alert('PPTX生成に失敗しました。コンソールを確認してください。');
        }
        btn.disabled = false;
        btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>PPTXを書き出す`;
      });
    });
  };

})();
