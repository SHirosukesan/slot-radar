import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ChevronLeftIcon } from './icons'

type Props = {
  title: string
  /** 戻るボタンを出す（履歴が無ければ fallback へ） */
  backTo?: string
  right?: ReactNode
}

export function PageHeader({ title, backTo, right }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  // アプリ内で移動してきた時だけ履歴を戻る。
  // 直接開いた（key が 'default'）場合に戻ると、アプリ外へ出てしまうため fallback へ。
  const goBack = () => {
    if (location.key !== 'default') navigate(-1)
    else navigate(backTo ?? '/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-10 flex min-h-14 items-center gap-1 border-b border-border bg-bg/95 px-2 backdrop-blur">
      {backTo ? (
        <button
          type="button"
          onClick={goBack}
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-text hover:bg-surface"
          aria-label="戻る"
        >
          <ChevronLeftIcon />
        </button>
      ) : (
        <span className="w-2" aria-hidden="true" />
      )}
      <h1 className="min-w-0 flex-1 truncate text-lg font-bold">{title}</h1>
      {right}
    </header>
  )
}
