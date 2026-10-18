# アーキテクチャ

## 現在（Phase 2）

```
ブラウザ ──(静的ファイル)── GitHub Pages
              ↑
     GitHub Actions が main から build して公開
```

サーバーはありません。店舗データは `src/fixtures/sampleShops.ts` の架空データを `services/shopRepository.ts` 経由で表示しています。
設定・お気に入り・検索履歴・プリセットはブラウザ内の IndexedDB（`services/storage/`）に保存します。

### 状態の置き場所
| 種類 | 置き場所 | 例 |
| --- | --- | --- |
| 基本設定（永続） | IndexedDB `user_preferences` | 基本地域、距離上限、低信頼を隠す |
| お気に入り・履歴・プリセット | IndexedDB 各ストア | — |
| 一時的な検索条件 | URL（`#/shops?sort=hyena&area=13`） | キーワード、並び順、範囲 → 共有可能 |
| 一時検索地点（GPS） | メモリのみ | 再起動で解除 |

### 検索の流れ
`ShopListPage` → `useShopSearch`（URL ⇄ 条件）→ `runShopQuery`（純粋関数：絞り込み・距離・並び替え・低信頼の非表示）→ `ShopCard` / `ShopMap`

## 目標の層構成（仕様 2章）

画面にデータ取得処理を直接書かず、層を分けます。

```
pages / components   … 画面（表示だけ）
        │
     hooks           … 画面とデータをつなぐ
        │
    services         … 業務ロジック（収支計算、フィルター等）
     ├─ scoring      … 評価ロジック（純粋関数・モデル版付き）
     ├─ repositories … 端末内保存（IndexedDB）の読み書き
     ├─ adapters     … データ取得元ごとの変換（出典・取得時刻を必ず付与）
     └─ sync         … 同期キュー・競合検出（Phase 7）
        │
     types           … 共通の型（店舗、イベント、出典など）
```

## フォルダ構成（予定）

```
src/
  config/        アプリ設定（現在の Phase など）
  components/    共通 UI 部品
  pages/         画面単位
  hooks/         画面用の状態（お気に入り等）
  types/         ドメイン型（店舗・評価）
  lib/           小さな関数（日付整形・距離計算・Googleマップ URL）
  data/          47都道府県
  services/
    scoring/                         … Phase 5
    shopRepository.ts  店舗データの取得窓口（現在は架空データ）
    shopQuery.ts       検索・並び替え（純粋関数）
    queryParams.ts     検索条件 ⇄ URL
    storage/           IndexedDB（設定・お気に入り・履歴・プリセット）
    adapters/                        … Phase 4
    sync/                            … Phase 7
  fixtures/      架空サンプルデータ（必ず isSample: true）
  test/          テスト共通設定
e2e/             Playwright の E2E テスト
```

## 保存・同期（予定）
- 端末内: IndexedDB。全レコードに一意 ID・`created_at`・`updated_at`・`version`。
- クラウド: Supabase 等を Phase 7 で評価（認証・RLS・Storage・無料枠・移行・競合）。

## 日付・数値の扱い
- 営業日は日本時間・店舗ごとの日跨ぎを考慮した「営業日」型で扱う。
- 金額は整数円、メダルは整数枚、レートは有理数（例: 46枚/1000円）で保持し、丸め方を明記。
