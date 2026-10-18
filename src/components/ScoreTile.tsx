import type { DisplayScore } from '../services/shopQuery'
import { CONFIDENCE_LABEL, SCORE_LABEL, type ScoreKind } from '../types/score'

type Props = {
  kind: ScoreKind
  score: DisplayScore
  size?: 'md' | 'lg'
}

/**
 * 評価1つ分のタイル。
 * 点数がある時だけ数字を出し、未評価・保留・低信頼で非表示は「—」。0点で埋めない。
 */
export function ScoreTile({ kind, score, size = 'md' }: Props) {
  const label = SCORE_LABEL[kind]
  const numberClass = size === 'lg' ? 'text-4xl' : 'text-3xl'
  const hasValue = score.status === 'rated' || score.status === 'provisional'

  const status = (() => {
    switch (score.status) {
      case 'rated':
        return `信頼度 ${CONFIDENCE_LABEL[score.confidence]}`
      case 'provisional':
        return '暫定'
      case 'unrated':
        return '未評価'
      case 'on_hold':
        return '評価保留'
      case 'hidden_low_confidence':
        return '低信頼・非表示'
    }
  })()

  const ariaLabel = hasValue ? `${label} ${score.value}点 ${status}` : `${label} ${status}`

  return (
    <div
      className="flex flex-col items-center rounded-xl border border-border bg-surface-2 px-1 py-2.5 text-center"
      aria-label={ariaLabel}
      role="group"
      data-score-status={score.status}
    >
      <div className="text-xs text-text-muted">{label}</div>
      <div className={`tabular mt-0.5 font-extrabold leading-none ${numberClass}`}>
        {hasValue ? (
          <span className={kind === 'overall' ? 'text-accent' : 'text-text'}>{score.value}</span>
        ) : (
          <span className="text-text-muted">—</span>
        )}
      </div>
      <div
        className={[
          'mt-1.5 text-xs whitespace-nowrap',
          score.status === 'provisional' ? 'rounded bg-warn/15 px-1.5 font-bold text-warn' : 'text-text-muted',
        ].join(' ')}
      >
        {status}
      </div>
    </div>
  )
}
