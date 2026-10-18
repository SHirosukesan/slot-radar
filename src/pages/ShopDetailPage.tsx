import { Link, useParams } from 'react-router'
import { ComingSoon } from '../components/ComingSoon'
import { FavoriteButton } from '../components/FavoriteButton'
import { PageHeader } from '../components/PageHeader'
import { SampleBadge, SampleDataBanner } from '../components/SampleDataBanner'
import { RouteButton } from '../components/RouteButton'
import { ScoreTile } from '../components/ScoreTile'
import { useAppData, useOrigin } from '../hooks/useAppData'
import { formatPeriod, formatUpdatedAt } from '../lib/format'
import { distanceKm, formatDistance } from '../lib/geo'
import { getShop } from '../services/shopRepository'
import { toDisplayScore, type DisplayScore } from '../services/shopQuery'
import { CONFIDENCE_LABEL, SCORE_KINDS, SCORE_LABEL } from '../types/score'

const STATUS_LABEL = { open: '営業中', closed: '閉店', unknown: '営業状態 不明' } as const

export function ShopDetailPage() {
  const { shopId = '' } = useParams()
  const shop = getShop(shopId)
  const { prefs } = useAppData()
  const origin = useOrigin()

  if (!shop) {
    return (
      <>
        <PageHeader title="店舗が見つかりません" backTo="/shops" />
        <div className="mx-4 mt-6 rounded-2xl border border-border bg-surface p-5">
          <p>指定された店舗は見つかりませんでした。</p>
          <Link to="/shops" className="mt-4 inline-flex min-h-11 items-center font-bold text-accent underline">
            店舗一覧へ戻る
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="店舗詳細"
        backTo="/shops"
        right={<FavoriteButton shopId={shop.id} shopName={shop.name} />}
      />
      {shop.isSample && <SampleDataBanner />}

      <section className="px-4 pt-4">
        <div className="flex items-start gap-2">
          {shop.isSample && <SampleBadge />}
          <h2 className="text-2xl font-extrabold leading-snug break-all">{shop.name}</h2>
        </div>
        <p className="mt-1 text-sm text-text-muted">{shop.address}</p>
        <p className="tabular mt-1 text-xs text-text-muted">
          {STATUS_LABEL[shop.status]}・評価更新 {formatUpdatedAt(shop.updatedAt)}
          {origin && shop.location && `・${origin.label}から直線 ${formatDistance(distanceKm(origin.point, shop.location))}`}
        </p>
        <div className="mt-3">
          <RouteButton shop={shop} variant="wide" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {SCORE_KINDS.map((kind) => (
            <ScoreTile key={kind} kind={kind} score={toDisplayScore(shop.scores[kind], prefs.hideLowConfidence)} size="lg" />
          ))}
        </div>
      </section>

      <section className="px-4 pt-6" aria-labelledby="basis-heading">
        <h3 id="basis-heading" className="text-base font-bold">
          評価の根拠
        </h3>
        <dl className="mt-2 divide-y divide-border rounded-2xl border border-border bg-surface">
          {SCORE_KINDS.map((kind) => (
            <div key={kind} className="px-4 py-3">
              <dt className="text-sm font-bold">{SCORE_LABEL[kind]}</dt>
              <dd className="mt-1 text-sm text-text-muted">
                <BasisText score={toDisplayScore(shop.scores[kind], prefs.hideLowConfidence)} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <ComingSoon
        phase={5}
        title="イベント実績・機種別・現場感覚"
        items={['イベント別実績ランキング', '30日 / 90日 / 1年 の比較', '店舗ごとの現場感覚（客数・専業割合など）']}
      />
    </>
  )
}

function BasisText({ score }: { score: DisplayScore }) {
  switch (score.status) {
    case 'hidden_low_confidence':
      return <>信頼度「低」のため非表示（「店舗検索 → その他の条件」で表示に切替できます）</>
    case 'unrated':
      return <>根拠データなし（未評価）</>
    case 'on_hold':
      return <>評価保留：{score.reason}</>
    case 'rated':
    case 'provisional': {
      const b = score.basis
      return (
        <span className="tabular">
          {formatPeriod(b.periodDays)}中 {b.sampleDays}日分・信頼度 {CONFIDENCE_LABEL[score.confidence]}
          {score.status === 'provisional' && '（母数不足のため暫定）'}
          <br />
          {b.note}
          <br />
          出典：{b.source}
        </span>
      )
    }
  }
}
