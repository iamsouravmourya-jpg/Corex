/**
 * LernexAI Proprietary — Quantum Color Spectrum & Studio Swatch Matrix
 * Zero external react-colorful dependency.
 */
import React from 'react'

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
    <div style={{ width: 204, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Native Full-Spectrum Hardware Picker + Live Preview */}
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 10px',
          borderRadius: '0.5rem',
          background: '#08090E',
          border: '1px solid #1A1E2A',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8' }}>
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
          gap: 4,
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
                borderRadius: 4,
                background: swatch,
                border: active ? '2px solid #06B6D4' : '1px solid rgba(255,255,255,0.14)',
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
