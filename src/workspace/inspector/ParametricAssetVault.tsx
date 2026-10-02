/**
 * LernexAI Proprietary — Parametric Vector Lab & SVG Icon Badges (Contextual Floating Module)
 * Zero inner border lines, soft rounded-2xl tonal cards, and pure vector synthesis.
 */
import { useState } from 'react'
import { Shapes, Box, Compass, QrCode, Sparkles, Image as ImageIcon } from 'lucide-react'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import { useEditorStore } from '@/store/editorStore'
import { COREX_ASSET_VAULT } from '@/data/corexAssetVault'
import { addImageFromDataUrl } from '@/lib/shapes'
import {
  addStarPolygon,
  addRegularPolygon,
  addIsometricCube,
  addProceduralMesh,
  addVectorQrBadge,
  addSvgVectorIconBadge,
  addSuperformulaVector,
  addLissajousCurve,
} from '@/lib/vectorStudio'

const VECTOR_ICON_BADGES = [
  {
    label: 'Lightning Bolt',
    color: '#06B6D4',
    path: 'M 13 2 L 3 14 L 12 14 L 11 22 L 21 10 L 12 10 Z',
  },
  {
    label: 'Shield Verified',
    color: '#10B981',
    path: 'M 12 22 C 12 22 20 18 20 12 L 20 5 L 12 2 L 4 5 L 4 12 C 4 18 12 22 12 22 Z',
  },
  {
    label: 'Star Emblem',
    color: '#F59E0B',
    path: 'M 12 2 L 15.09 8.26 L 22 9.27 L 17 14.14 L 18.18 21.02 L 12 17.77 L 5.82 21.02 L 7 14.14 L 2 9.27 L 8.91 8.26 Z',
  },
  {
    label: 'Heart Pulse',
    color: '#F43F5E',
    path: 'M 20.84 4.61 A 5.5 5.5 0 0 0 16.5 2.5 C 14.76 2.5 13.09 3.31 12 4.66 C 10.91 3.31 9.24 2.5 7.5 2.5 A 5.5 5.5 0 0 0 3.16 4.61 C 1.25 6.52 1.25 9.62 3.16 11.53 L 12 20.37 L 20.84 11.53 C 22.75 9.62 22.75 6.52 20.84 4.61 Z',
  },
  {
    label: 'Diamond Gem',
    color: '#22D3EE',
    path: 'M 6 3 L 18 3 L 22 9 L 12 22 L 2 9 Z',
  },
  {
    label: 'Rocket Launch',
    color: '#14B8A6',
    path: 'M 4.5 16.5 C 3 18 3 21 3 21 C 3 21 6 21 7.5 19.5 C 8.33 18.67 8.33 17.33 7.5 16.5 C 6.67 15.67 5.33 15.67 4.5 16.5 Z M 12 15 L 9 12 C 10.5 7.5 15 4 21 3 C 20 9 16.5 13.5 12 15 Z',
  },
  {
    label: 'Crown Royal',
    color: '#F59E0B',
    path: 'M 2 4 L 5 16 L 19 16 L 22 4 L 16 10 L 12 4 L 8 10 Z M 5 19 L 19 19',
  },
  {
    label: 'Hexagon Core',
    color: '#A855F7',
    path: 'M 21 16 L 21 8 L 12 3 L 3 8 L 3 16 L 12 21 Z',
  },
]

export function StickerPanel() {
  const stage = useFabricCanvas()
  const { setActiveFloatingWindow } = useEditorStore()
  const [qrPayload, setQrPayload] = useState('https://lernexai.com')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: '14px 16px 28px',
      }}
    >
      {/* 0. Pre-Bundled Corex Media, 3D Cutout & Mockup Vault */}
      <div style={{ padding: 14, borderRadius: 18, background: '#141826', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ImageIcon size={13} color="#22D3EE" /> Built-in Media & 3D Cutout Vault
          </div>
          <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', color: '#10B981', fontWeight: 700 }}>
            0ms OFFLINE READY
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {COREX_ASSET_VAULT.map((asset) => (
            <button
              key={asset.id}
              onClick={async () => {
                if (!stage) return
                await addImageFromDataUrl(stage, asset.localDataUri)
                setActiveFloatingWindow(null)
              }}
              style={{
                padding: '10px',
                borderRadius: 14,
                background: '#1B2032',
                border: 'none',
                color: '#F8FAFC',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                textAlign: 'left',
              }}
            >
              <img
                src={asset.localDataUri}
                alt={asset.name}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  objectFit: 'contain',
                  background: '#0C0E16',
                  flexShrink: 0,
                }}
              />
              <span style={{ lineHeight: 1.25 }}>{asset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. Parametric Polygons & 3D Isometric Cube */}
      <div style={{ padding: 14, borderRadius: 18, background: '#141826', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Shapes size={13} color="#22D3EE" /> Parametric Polygons & 3D Cube
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button
            onClick={() => {
              if (!stage) return
              addStarPolygon(stage, 5, 90, 42, '#06B6D4', '5-Point Star')
              setActiveFloatingWindow(null)
            }}
            style={{
              height: 40,
              borderRadius: 12,
              background: '#1B2032',
              border: 'none',
              color: '#F8FAFC',
              fontSize: 11.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ★ 5-Point Star
          </button>
          <button
            onClick={() => {
              if (!stage) return
              addStarPolygon(stage, 8, 95, 48, '#14B8A6', '8-Point Seal')
              setActiveFloatingWindow(null)
            }}
            style={{
              height: 40,
              borderRadius: 12,
              background: '#1B2032',
              border: 'none',
              color: '#F8FAFC',
              fontSize: 11.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ✷ 8-Point Seal
          </button>
          <button
            onClick={() => {
              if (!stage) return
              addRegularPolygon(stage, 6, 85, '#06B6D4', 'Hexagon')
              setActiveFloatingWindow(null)
            }}
            style={{
              height: 40,
              borderRadius: 12,
              background: '#1B2032',
              border: 'none',
              color: '#F8FAFC',
              fontSize: 11.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ⬢ Hexagon Node
          </button>
          <button
            onClick={() => {
              if (!stage) return
              addIsometricCube(stage)
              setActiveFloatingWindow(null)
            }}
            style={{
              height: 40,
              borderRadius: 12,
              background: 'rgba(6, 182, 212, 0.16)',
              border: 'none',
              color: '#22D3EE',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Box size={13} /> 3D Iso Cube
          </button>
        </div>
      </div>

      {/* 2. Procedural Guilloche, Golden Ratio & Harmonic Curves */}
      <div style={{ padding: 14, borderRadius: 18, background: '#141826', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Compass size={13} color="#2DD4BF" /> Procedural Meshes & Math Curves
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {(
            [
              { id: 'cyber-wave', label: 'Cyber Wave Mesh' },
              { id: 'guilloche', label: 'Guilloche Rosette' },
              { id: 'concentric-halo', label: 'Concentric Halo' },
              { id: 'golden-spiral', label: 'Golden Spiral φ' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => {
                if (!stage) return
                addProceduralMesh(stage, m.id)
                setActiveFloatingWindow(null)
              }}
              style={{
                height: 38,
                borderRadius: 12,
                background: '#1B2032',
                border: 'none',
                color: '#E2E8F0',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {m.label}
            </button>
          ))}
          <button
            onClick={() => {
              if (!stage) return
              addSuperformulaVector(stage, 8, 0.3, 1.7, 1.7)
              setActiveFloatingWindow(null)
            }}
            style={{
              height: 38,
              borderRadius: 12,
              background: '#0C0E16',
              border: 'none',
              color: '#22D3EE',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Gielis Superformula
          </button>
          <button
            onClick={() => {
              if (!stage) return
              addLissajousCurve(stage, 3, 4, 90)
              setActiveFloatingWindow(null)
            }}
            style={{
              height: 38,
              borderRadius: 12,
              background: '#0C0E16',
              border: 'none',
              color: '#2DD4BF',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Lissajous 3:4
          </button>
        </div>
      </div>

      {/* 3. Pure SVG Vector Icon Badges */}
      <div style={{ padding: 14, borderRadius: 18, background: '#141826', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={13} color="#F59E0B" /> Pure SVG Vector Icon Badges
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {VECTOR_ICON_BADGES.map((badge) => (
            <button
              key={badge.label}
              onClick={() => {
                if (!stage) return
                addSvgVectorIconBadge(stage, badge.path, badge.label, badge.color)
                setActiveFloatingWindow(null)
              }}
              title={badge.label}
              style={{
                height: 58,
                borderRadius: 14,
                background: '#1B2032',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d={badge.path}
                  stroke={badge.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{ fontSize: 9.5, color: '#CBD5E1', fontWeight: 600 }}>
                {badge.label.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Client-Side Scalable Vector QR Generator */}
      <div style={{ padding: 14, borderRadius: 18, background: '#141826', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <QrCode size={13} color="#10B981" /> Client-Side Vector QR Matrix
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input-base"
            value={qrPayload}
            onChange={(e) => setQrPayload(e.target.value)}
            placeholder="https://lernexai.com"
            style={{ flex: 1, height: 36, fontSize: 12 }}
          />
          <button
            onClick={() => {
              if (!stage) return
              addVectorQrBadge(stage, qrPayload || 'https://lernexai.com')
              setActiveFloatingWindow(null)
            }}
            style={{
              height: 36,
              padding: '0 14px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)',
              border: 'none',
              color: '#07080D',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Insert QR
          </button>
        </div>
      </div>
    </div>
  )
}
