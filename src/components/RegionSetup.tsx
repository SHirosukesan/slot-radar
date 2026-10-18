import { useState } from 'react'
import { useAppData } from '../hooks/useAppData'
import { PrefectureOptions, selectClass } from './PrefectureSelect'

/** 初回の地域設定。スキップしても使える（全国表示） */
export function RegionSetup() {
  const { updatePrefs } = useAppData()
  const [code, setCode] = useState('')

  return (
    <section
      className="mx-4 mt-5 rounded-2xl border border-accent/50 bg-accent-soft p-4"
      aria-labelledby="region-setup-heading"
    >
      <h2 id="region-setup-heading" className="text-lg font-bold">
        はじめに：基本地域を選んでください
      </h2>
      <p className="mt-1 text-sm text-text-muted">店舗検索の初期範囲と距離の基準になります。あとで設定から変更できます。</p>
      <label htmlFor="setup-pref" className="sr-only">
        都道府県
      </label>
      <select id="setup-pref" className={`${selectClass} mt-3`} value={code} onChange={(e) => setCode(e.target.value)}>
        <option value="">都道府県を選択</option>
        <PrefectureOptions />
      </select>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={!code}
          onClick={() => updatePrefs({ basePrefectureCode: Number(code), onboardingDone: true })}
          className="min-h-12 flex-1 rounded-xl bg-accent-strong text-base font-bold text-white disabled:opacity-40"
        >
          この地域にする
        </button>
        <button
          type="button"
          onClick={() => updatePrefs({ onboardingDone: true })}
          className="min-h-12 rounded-xl border border-border px-4 text-sm"
        >
          あとで
        </button>
      </div>
    </section>
  )
}
