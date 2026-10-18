import { APP_NAME, APP_VERSION, CURRENT_PHASE } from '../config/app'
import { RadarMark } from './RadarMark'

/**
 * 起動画面（Phase 0）。
 * まだ機能も店舗データも無いことを正直に表示する。
 */
export function SplashScreen() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-8 pt-16">
      <section className="flex flex-1 flex-col items-center text-center">
        <RadarMark size={132} />

        <h1 className="mt-8 text-4xl font-extrabold tracking-[0.12em] text-text">
          SLOT <span className="text-accent">RADAR</span>
        </h1>
        <p className="mt-3 text-base text-text-muted">
          店舗・イベントの根拠を見比べる
          <br />
          パチスロ立ち回り手帳
        </p>

        <div
          className="mt-10 w-full rounded-2xl border border-border bg-surface p-5 text-left"
          role="status"
        >
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-accent-soft px-2 py-0.5 text-sm font-bold text-accent">
              {CURRENT_PHASE.label}
            </span>
            <span className="text-sm text-text-muted">開発中</span>
          </div>
          <p className="mt-3 text-lg font-bold leading-snug">{CURRENT_PHASE.description}</p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            {'店舗・イベント・実戦記録の機能はまだありません。'}
            {'表示されるデータはありません（実データ・架空データとも未登録）。'}
          </p>
        </div>

        <ul className="mt-6 grid w-full grid-cols-3 gap-2 text-center" aria-label="予定している主な評価軸">
          {['総合', '設定狙い', 'ハイエナ'].map((label) => (
            <li key={label} className="rounded-xl border border-border bg-surface-2 px-2 py-3">
              <div className="text-xs text-text-muted">{label}</div>
              <div className="tabular mt-1 text-2xl font-bold text-text-muted">—</div>
              <div className="text-xs text-text-muted">未評価</div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-10 text-center text-xs text-text-muted">
        <span className="tabular">{APP_NAME} v{APP_VERSION}</span>
      </footer>
    </main>
  )
}
