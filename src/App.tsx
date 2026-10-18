import { HashRouter, Route, Routes } from 'react-router'
import { AppShell } from './components/AppShell'
import { FavoritesProvider } from './hooks/useFavorites'
import { HomePage } from './pages/HomePage'
import { BalancePage, FavoritesPage, NotFoundPage, RecordsPage } from './pages/PlaceholderPages'
import { ShopDetailPage } from './pages/ShopDetailPage'
import { ShopListPage } from './pages/ShopListPage'

/** 画面とURLの対応表。テストからも使えるようルーターとは分けている */
export function AppRoutes() {
  return (
    <FavoritesProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="shops" element={<ShopListPage />} />
          <Route path="shops/:shopId" element={<ShopDetailPage />} />
          <Route path="records" element={<RecordsPage />} />
          <Route path="balance" element={<BalancePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </FavoritesProvider>
  )
}

/**
 * HashRouter（URL の # 以降で画面を切替える方式）を使う。
 * GitHub Pages はサーバー側の転送設定ができないため、
 * この方式なら画面の再読み込みや直接リンクでも 404 にならない。
 */
export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  )
}
