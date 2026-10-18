import { NavLink } from 'react-router'
import { HomeIcon, RecordIcon, SearchIcon, StarIcon, WalletIcon } from './icons'

const TABS = [
  { to: '/', label: 'ホーム', Icon: HomeIcon, end: true },
  { to: '/shops', label: '店舗検索', Icon: SearchIcon, end: false },
  { to: '/records', label: '実戦記録', Icon: RecordIcon, end: false },
  { to: '/balance', label: '収支', Icon: WalletIcon, end: false },
  { to: '/favorites', label: 'お気に入り', Icon: StarIcon, end: false },
] as const

/** 下部ナビ（5タブ）。現在地は色だけでなく上部バー＋太字でも区別する */
export function BottomNav() {
  return (
    <nav
      aria-label="メインメニュー"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {TABS.map(({ to, label, Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'relative flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-xs',
                  isActive ? 'font-bold text-accent' : 'text-text-muted',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-accent" aria-hidden="true" />
                  )}
                  <Icon size={22} />
                  <span className="whitespace-nowrap">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
