import { Outlet } from 'react-router'
import { BottomNav } from './BottomNav'

/** 全画面共通の枠。下部ナビの高さ分だけ下に余白を取る */
export function AppShell() {
  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-md pb-[calc(5rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
