# アーキテクチャ

## 現在（Phase 0）

```
ブラウザ ──(静的ファイル)── GitHub Pages
              ↑
     GitHub Actions が main から build して公開
```

サーバーもデータベースもまだありません。

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
  pages/         画面単位            … Phase 1〜
  hooks/                             … Phase 1〜
  types/         ドメイン型          … Phase 1〜
  services/
    scoring/                         … Phase 5
    repositories/                    … Phase 2〜（IndexedDB）
    adapters/                        … Phase 4
    sync/                            … Phase 7
  fixtures/      架空サンプルデータ（必ず is_sample: true）… Phase 1
  test/          テスト共通設定
```

## 保存・同期（予定）
- 端末内: IndexedDB。全レコードに一意 ID・`created_at`・`updated_at`・`version`。
- クラウド: Supabase 等を Phase 7 で評価（認証・RLS・Storage・無料枠・移行・競合）。

## 日付・数値の扱い
- 営業日は日本時間・店舗ごとの日跨ぎを考慮した「営業日」型で扱う。
- 金額は整数円、メダルは整数枚、レートは有理数（例: 46枚/1000円）で保持し、丸め方を明記。
