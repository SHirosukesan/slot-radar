import { Link } from 'react-router'
import { ComingSoon } from '../components/ComingSoon'
import { ChevronRightIcon } from '../components/icons'
import { RadarMark } from '../components/RadarMark'
import { CURRENT_PHASE } from '../config/app'

export function HomePage() {
  return (
    <>
      <header className="flex items-center gap-3 px-4 pt-5">
        <RadarMark size={40} />
        <div>
          <h1 className="text-xl font-extrabold tracking-[0.1em]">
            SLOT <span className="text-accent">RADAR</span>
          </h1>
          <p className="text-xs text-text-muted">
            {CURRENT_PHASE.label}・{CURRENT_PHASE.description}
          </p>
        </div>
      </header>

      <Link
        to="/shops"
        className="mx-4 mt-5 flex min-h-14 items-center justify-between rounded-2xl border border-accent/50 bg-accent-soft px-4 py-3"
      >
        <span>
          <span className="block text-base font-bold">店舗を探す</span>
          <span className="block text-sm text-text-muted">総合・設定狙い・ハイエナで比較</span>
        </span>
        <ChevronRightIcon className="text-accent" />
      </Link>

      <ComingSoon
        phase={3}
        title="本日のイベント"
        items={['重点イベント（まいったぁまいったぁ等）の優先表示', '指定距離内・地域別のイベント一覧', '出典と信頼度の表示']}
      />
    </>
  )
}
