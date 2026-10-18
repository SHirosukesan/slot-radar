import { PREFECTURES, REGIONS } from '../data/prefectures'

/** 47都道府県を地方ごとにまとめた <option> 群 */
export function PrefectureOptions() {
  return (
    <>
      {REGIONS.map((region) => (
        <optgroup key={region} label={region}>
          {PREFECTURES.filter((p) => p.region === region).map((p) => (
            <option key={p.code} value={String(p.code)}>
              {p.name}
            </option>
          ))}
        </optgroup>
      ))}
    </>
  )
}

export const selectClass =
  'min-h-11 w-full rounded-xl border border-border bg-surface-2 px-3 text-base text-text focus:border-accent'
