/**
 * LernexAI Proprietary — Quantum Color Spectrum & Soft Swatch Matrix
 * Zero harsh borders, rounded-xl organic pills, and 24 curated studio swatches.
 */
const LERNEX_SWATCH_MATRIX = [
  '#08090E', '#0D0F17', '#11141C', '#1A1E2A', '#475569', '#94A3B8', '#F8FAFC', '#FFFFFF',
  '#06B6D4', '#22D3EE', '#14B8A6', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
  '#F43F5E', '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#A855F7', '#0891B2',
]

interface QuantumColorSpectrumProps {
  color: string
  onChange: (hex: string) => void
}

export function QuantumColorSpectrum({ color, onChange }: QuantumColorSpectrumProps) {
  const safeHex = /^#[0-9A-Fa-f]{6}$/.test(color) ? color : '#06B6D4'

  return (
    <div style={{ width: 212, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Native Full-Spectrum Hardware Picker + Live Preview */}
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderRadius: 12,
          background: '#0C0E16',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: '#CBD5E1' }}>
          Full HSV Spectrum
        </span>
        <input
          type="color"
          value={safeHex}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 36,
            height: 22,
            border: 'none',
            padding: 0,
            background: 'transparent',
            cursor: 'pointer',
          }}
        />
      </label>

      {/* 24-Color LernexAI Curated Swatch Matrix */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: 5,
        }}
      >
        {LERNEX_SWATCH_MATRIX.map((swatch) => {
          const active = swatch.toLowerCase() === safeHex.toLowerCase()
          return (
            <button
              key={swatch}
              type="button"
              onClick={() => onChange(swatch)}
              title={swatch}
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: 8,
                background: swatch,
                border: 'none',
                boxShadow: active ? '0 0 0 2px #22D3EE' : 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
