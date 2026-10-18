import { Link } from 'react-router'
import { ComingSoon } from '../components/ComingSoon'
import { ChevronRightIcon, GearIcon } from '../components/icons'
import { RadarMark } from '../components/RadarMark'
import { RegionSetup } from '../components/RegionSetup'
import { CURRENT_PHASE } from '../config/app'
import { getPrefecture } from '../data/prefectures'
import { useAppData } from '../hooks/useAppData'

export function HomePage() {
  const { prefs } = useAppData()
  const base = getPrefecture(prefs.basePrefectureCode)
  return (
    <>
      <header className="flex items-center gap-3 px-4 pt-5">
        <RadarMark size={40} />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-extrabold tracking-[0.1em]">
            SLOT <span className="text-accent">RADAR</span>
          </h1>
          <p className="text-xs text-text-muted">
            {CURRENT_PHASE.label}・{CURRENT_PHASE.description}
          </p>
        </div>
        <Link to="/settings" aria-label="設定" className="flex size-11 shrink-0 items-center justify-center rounded-full text-text-muted hover:bg-surface">
          <GearIcon size={22} />
        </Link>
      </header>

      {!prefs.onboardingDone ? (
        <RegionSetup />
      ) : (
        <p className="mx-4 mt-4 flex flex-wrap items-center gap-x-2 text-sm text-text-muted">
          <span>
            基本地域：<strong className="text-text">{base ? base.name : '未設定（全国）'}</strong>
          </span>
          <Link to="/settings" className="inline-flex min-h-11 items-center text-accent underline">
            変更
          </Link>
        </p>
      )}

      <Link
        to="/shops"
        className="mx-4 mt-3 flex min-h-14 items-center justify-between rounded-2xl border border-accent/50 bg-accent-soft px-4 py-3"
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
