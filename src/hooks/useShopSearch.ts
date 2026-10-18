import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { parseQuery, serializeQuery } from '../services/queryParams'
import { DEFAULT_QUERY, type ShopQuery } from '../types/query'

export type ViewMode = 'list' | 'map'

/**
 * 一時的な検索条件は URL（#/shops?sort=hyena&area=13 など）に持つ。
 * → リンクで共有でき、次回起動時（URL なしで開いた時）は初期値に戻る。
 */
export function useShopSearch() {
  const [params, setParams] = useSearchParams()
  const query = useMemo(() => parseQuery(params), [params])
  const view: ViewMode = params.get('view') === 'map' ? 'map' : 'list'

  const write = useCallback(
    (next: ShopQuery, nextView: ViewMode) => {
      const p = serializeQuery(next)
      if (nextView === 'map') p.set('view', 'map')
      setParams(p, { replace: true })
    },
    [setParams],
  )

  const setQuery = useCallback((patch: Partial<ShopQuery>) => write({ ...query, ...patch }, view), [write, query, view])
  const setView = useCallback((v: ViewMode) => write(query, v), [write, query])
  const reset = useCallback(() => write(DEFAULT_QUERY, view), [write, view])
  const applyParams = useCallback(
    (raw: string) => {
      write(parseQuery(new URLSearchParams(raw)), view)
    },
    [write, view],
  )

  return { query, setQuery, view, setView, reset, applyParams }
}
