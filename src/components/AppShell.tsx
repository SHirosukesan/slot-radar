import { Outlet } from 'react-router'
import { useAppData } from '../hooks/useAppData'
import { BottomNav } from './BottomNav'

/** 全画面共通の枠。下部ナビの高さ分だけ下に余白を取る */
export function AppShell() {
  const { ready, storageError } = useAppData()
  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-md pb-[calc(5rem+env(safe-area-inset-bottom))]">
        {storageError && (
          <p role="alert" className="mx-4 mt-3 rounded-lg border border-warn/50 bg-warn/10 px-3 py-2 text-sm text-warn">
            {storageError}
          </p>
        )}
        {ready ? <Outlet /> : <p className="py-20 text-center text-text-muted">読み込み中…</p>}
      </div>
      <BottomNav />
    </div>
  )
}
