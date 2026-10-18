import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../App'
import { DB_NAME, resetDbConnection } from '../services/storage/db'

/** 端末内 DB を空にする（テスト間で保存内容を持ち越さない） */
export async function clearDb() {
  await resetDbConnection()
  await new Promise<void>((resolve) => {
    const req = indexedDB.deleteDatabase(DB_NAME)
    req.onsuccess = req.onerror = req.onblocked = () => resolve()
  })
}

/** アプリを指定の URL で表示し、保存データの読み込み完了まで待つ */
export async function renderApp(path: string) {
  const utils = render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  await waitFor(() => expect(screen.queryByText('読み込み中…')).not.toBeInTheDocument())
  return utils
}
