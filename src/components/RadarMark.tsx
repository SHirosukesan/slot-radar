type Props = {
  size?: number
}

/** ロゴ用のレーダーマーク。装飾なので読み上げ対象から外す */
export function RadarMark({ size = 120 }: Props) {
  return (
    <div className="relative" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 120 120" width={size} height={size} className="absolute inset-0">
        <circle cx="60" cy="60" r="56" fill="none" stroke="var(--color-border)" strokeWidth="2" />
        <circle cx="60" cy="60" r="38" fill="none" stroke="var(--color-border)" strokeWidth="2" />
        <circle cx="60" cy="60" r="20" fill="none" stroke="var(--color-border)" strokeWidth="2" />
        <line x1="60" y1="4" x2="60" y2="116" stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1="4" y1="60" x2="116" y2="60" stroke="var(--color-border)" strokeWidth="1.5" />
      </svg>
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        className="radar-sweep absolute inset-0"
        style={{ animation: 'radar-sweep 3.2s linear infinite' }}
      >
        <defs>
          <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <path d="M60 60 L60 4 A56 56 0 0 1 108.5 32 Z" fill="url(#sweep)" />
        <line x1="60" y1="60" x2="108.5" y2="32" stroke="var(--color-accent)" strokeWidth="2.5" />
      </svg>
      <svg viewBox="0 0 120 120" width={size} height={size} className="absolute inset-0">
        <circle cx="60" cy="60" r="4" fill="var(--color-accent)" />
        <circle cx="84" cy="36" r="3.5" fill="var(--color-text)" />
      </svg>
    </div>
  )
}
