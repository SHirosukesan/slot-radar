# SLOT RADAR

全国のパチスロ店舗・イベントを探し、**信頼できる過去実績**と**個人の現場感覚**を区別して比較し、Googleマップで移動し、実戦・給与・親の損益も記録できる、スマホ優先の Web アプリ（PWA）です。

> **現在の状態: Phase 0（開発基盤のみ）**
> 起動画面・自動テスト・CI があるだけで、店舗・イベント・記録の機能はまだありません。
> 仕様の基準は [`docs/product-spec.md`](docs/product-spec.md) です。

## 画面を見る方法

### A. 公開URL（GitHub Pages を有効にした後）

`main` にマージされると GitHub Actions が自動で公開します。

- URL: `https://shirosukesan.github.io/slot-radar/`
- 初回だけ GitHub の **Settings → Pages → Build and deployment → Source** を **「GitHub Actions」** にする必要があります。

### B. 自分のPCで動かす

必要なもの: [Node.js](https://nodejs.org/) 22 以上

```bash
git clone https://github.com/SHirosukesan/slot-radar.git
cd slot-radar
npm ci          # 必要な部品（ライブラリ）をインストール
npm run dev     # 開発用サーバーを起動
```

表示された `http://localhost:5173/` をブラウザで開きます。スマホ表示は、ブラウザの開発者ツール（F12）→ 端末アイコンで確認できます。

## よく使うコマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発用サーバー（保存すると即反映） |
| `npm run lint` | コードの書き方チェック（oxlint） |
| `npm run typecheck` | 型チェック（TypeScript の矛盾検出） |
| `npm test` | 自動テスト（Vitest） |
| `npm run build` | 公開用ファイルを `dist/` に作成 |
| `npm run check` | 上の lint / 型 / テスト / ビルドを全部実行 |

## 技術構成

- **React + TypeScript + Vite** … 画面部品・型付き JavaScript・高速な開発サーバー
- **Tailwind CSS v4** … デザイントークン（色や文字の決まり事）を `src/index.css` に集約
- **Vitest + Testing Library** … 自動テスト
- **GitHub Actions** … PR ごとに lint / 型 / テスト / ビルドを自動実行（`.github/workflows/ci.yml`）
- **GitHub Pages** … `main` の内容を公開（`.github/workflows/deploy-pages.yml`）

## 開発の進め方

- `main` は常に動作確認済み。変更は `feature/*` ブランチ → Pull Request → CI 成功 → 確認後マージ。
- フェーズは [`docs/roadmap.md`](docs/roadmap.md)。一度に全部作らず 1 Phase ずつ確認を取ります。
- 秘密情報（APIキー・個人収支・非公開スクショ）はコミットしません。見本は `.env.example` のみ。

## ドキュメント

| ファイル | 内容 |
| --- | --- |
| [docs/product-spec.md](docs/product-spec.md) | 統合仕様書（基準） |
| [docs/roadmap.md](docs/roadmap.md) | フェーズ計画と完了条件 |
| [docs/decisions.md](docs/decisions.md) | 決定済み事項 |
| [docs/open-decisions.md](docs/open-decisions.md) | 未決定事項 |
| [docs/architecture.md](docs/architecture.md) | 構成・フォルダ設計 |
| [docs/data-sources.md](docs/data-sources.md) | データ取得元の台帳 |
| [docs/scoring.md](docs/scoring.md) | スコアの考え方 |
| [docs/test-plan.md](docs/test-plan.md) | テスト計画 |
| [docs/changelog.md](docs/changelog.md) | 変更履歴 |
