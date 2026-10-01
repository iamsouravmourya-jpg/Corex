/**
 * LernexAI Proprietary — Native Quantum Precision Range Slider
 * Zero external @radix-ui/react-slider dependency.
 */
interface SliderProps {
  label?: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  showValue?: boolean
  unit?: string
  className?: string
}

export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  showValue = false,
  unit = '',
}: SliderProps) {
  const pct = Math.max(0, Math.min(100, ((value - min) / Math.max(max - min, 0.0001)) * 100))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: '100%' }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && (
            <span
              style={{
                fontSize: 10.5,
                color: 'var(--color-base-400)',
                fontWeight: 600,
              }}
            >
              {label}
            </span>
          )}
          {showValue && (
            <span
              style={{
                fontSize: 10.5,
                fontFamily: 'var(--font-mono)',
                color: '#06B6D4',
                fontWeight: 600,
              }}
            >
              {value}
              {unit}
            </span>
          )}
        </div>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: 18 }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 4,
            borderRadius: 999,
            background: 'var(--color-ink-700)',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #06B6D4 0%, #14B8A6 100%)',
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: 18,
            margin: 0,
            opacity: 0,
            cursor: 'pointer',
            position: 'relative',
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `calc(${pct}% - 7px)`,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#F8FAFC',
            border: '2.5px solid #06B6D4',
            boxShadow: '0 2px 6px rgba(8, 9, 14, 0.75)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      </div>
    </div>
  )
}
