/**
 * LernexAI Proprietary — 18-Engine Quantum Lab Suite (Contextual Floating Module)
 * Zero inner border lines, soft rounded-2xl tonal pods, visual shader swatches,
 * CSG Vector Boolean Solver, 3D Axonometric Extruder, and AES-GCM-256 Crypto Vault.
 */
import { useState } from 'react'
import {
  Zap,
  Sparkles,
  Code2,
  Type,
  Lock,
  Unlock,
  Maximize2,
  Cpu,
  CheckCircle2,
  Compass,
  Box,
  Layers,
} from 'lucide-react'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import { useEditorStore } from '@/store/editorStore'
import {
  detectHardwareRasterBackend,
  addParametricTextOnPath,
  compileCssToVectorNode,
  optimizeStageGeometry,
  applyProceduralShaderBackground,
  smartReflowCanvasToNewSize,
  addVectorDataVizWidget,
  auditAndHealCanvasContrast,
  extrudeActiveNode3D,
  applyVectorBooleanOperation,
} from '@/lib/quantumEngine'
import { DEFAULT_GLSL_UNIFORMS, type GlslShaderPreset } from '@/lib/glslShaderEngine'
import { addSuperformulaVector, addLissajousCurve } from '@/lib/vectorStudio'
import { encryptProjectPayload, decryptProjectPayload, type EncryptedVaultEnvelope } from '@/lib/cryptoVault'
import { dispatchBinaryDownload } from '@/lib/export'

const SHADER_CARDS: { id: GlslShaderPreset; label: string; sub: string; gradient: string }[] = [
  {
    id: 'aurora-plasma',
    label: 'Aurora Plasma',
    sub: '5-Octave Domain FBM',
    gradient: 'radial-gradient(circle at 25% 25%, #06B6D4 0%, #14B8A6 48%, #07080D 100%)',
  },
  {
    id: 'synthwave-grid',
    label: 'Synthwave Horizon',
    sub: '3D Ray-Projected Grid',
    gradient: 'linear-gradient(180deg, #F43F5E 0%, #F59E0B 42%, #06B6D4 100%)',
  },
  {
    id: 'quantum-mesh',
    label: 'Iridescent Silk',
    sub: 'Cosine Thin-Film Wave',
    gradient: 'linear-gradient(135deg, #22D3EE 0%, #10B981 52%, #0D0F17 100%)',
  },
  {
    id: 'constellation',
    label: 'Voronoi Nebula',
    sub: 'Cellular Star Topology',
    gradient: 'radial-gradient(circle at 65% 35%, #38BDF8 0%, #0E7490 50%, #07080D 100%)',
  },
]

export function QuantumLabPanel() {
  const stage = useFabricCanvas()
  const { currentProjectName, canvasSize, snapshot, syncLayersFromCanvas, setActiveFloatingWindow } =
    useEditorStore()
  const gpuInfo = detectHardwareRasterBackend()

  const [pathText, setPathText] = useState('COREX QUANTUM STUDIO • LERNEXAI • ')
  const [cssSnippet, setCssSnippet] = useState(
    `width: 320px;\nheight: 160px;\nbackground: linear-gradient(135deg, #06B6D4, #14B8A6);\nborder-radius: 24px;\nborder: 2px solid #F8FAFC;`,
  )
  const [vaultPassphrase, setVaultPassphrase] = useState('lernex-quantum-2026')
  const [glslUniforms, setGlslUniforms] = useState(DEFAULT_GLSL_UNIFORMS)
  const [superM, setSuperM] = useState(6)
  const [lissajousRatio, setLissajousRatio] = useState<[number, number]>([3, 4])
  const [extrudeDepth, setExtrudeDepth] = useState(12)
  const [statusToast, setStatusToast] = useState<string | null>(null)

  const notify = (msg: string) => {
    setStatusToast(msg)
    setTimeout(() => setStatusToast(null), 2800)
  }

  const handleEncryptExport = async () => {
    if (!stage || !vaultPassphrase.trim()) return
    const payload = JSON.stringify({
      projectName: currentProjectName,
      canvasSize,
      scene: (stage as any).toJSON(['__uid', 'corexLabel']),
    })
    const encrypted = await encryptProjectPayload(payload, vaultPassphrase)
    dispatchBinaryDownload(
      new Blob([JSON.stringify(encrypted, null, 2)], { type: 'application/json' }),
      `${(currentProjectName || 'corex-vault').toLowerCase().replace(/\s+/g, '-')}.corex.enc`,
    )
    notify('AES-GCM 256-Bit Encrypted Vault Exported')
  }

  const handleDecryptImport = () => {
    if (!stage || !vaultPassphrase.trim()) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.enc,.json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const raw = await file.text()
        const vault = JSON.parse(raw) as EncryptedVaultEnvelope
        const decryptedText = await decryptProjectPayload(vault, vaultPassphrase)
        const parsed = JSON.parse(decryptedText)
        if (parsed.scene) {
          await stage.loadFromJSON(parsed.scene)
          stage.requestRenderAll()
          snapshot()
          syncLayersFromCanvas()
          notify('Vault Decrypted & Restored to Stage')
        }
      } catch {
        notify('Invalid Passphrase or Corrupted Vault File')
      }
    }
    input.click()
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: '14px 16px 28px',
      }}
    >
      {/* Hardware Telemetry Pill */}
      <div
        style={{
          padding: '12px 14px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.14) 0%, rgba(20, 184, 166, 0.06) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: '#0C0E16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22D3EE',
            }}
          >
            <Cpu size={16} />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: '#F8FAFC' }}>
              18-Engine Quantum Architecture
            </div>
            <div style={{ fontSize: 10.5, color: '#22D3EE', fontFamily: 'var(--font-mono)' }}>
              {gpuInfo.backend} · {gpuInfo.maxTextureDimension}px Max
            </div>
          </div>
        </div>
      </div>

      {statusToast && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 14,
            background: 'rgba(16, 185, 129, 0.14)',
            color: '#6EE7B7',
            fontSize: 11.5,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <CheckCircle2 size={14} color="#10B981" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* 1. WebGL2 GLSL ES 3.00 Fragment Shader Studio */}
      <div style={{ padding: 14, borderRadius: 18, background: '#141826', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={13} color="#22D3EE" /> WebGL2 GLSL ES 3.00 Shaders
          </span>
          <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--font-mono)' }}>#version 300 es</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {SHADER_CARDS.map((sh) => (
            <button
              key={sh.id}
              onClick={() => {
                if (!stage) return
                void applyProceduralShaderBackground(stage, sh.id, glslUniforms)
                notify(`Compiled GLSL ${sh.label}`)
              }}
              style={{
                height: 54,
                borderRadius: 14,
                background: sh.gradient,
                border: 'none',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(7,8,13,0.05) 0%, rgba(7,8,13,0.78) 100%)',
                }}
              />
              <span style={{ position: 'relative', zIndex: 1, fontSize: 11, fontWeight: 700, color: '#F8FAFC' }}>
                {sh.label}
              </span>
              <span style={{ position: 'relative', zIndex: 1, fontSize: 9.5, color: '#CBD5E1' }}>
                {sh.sub}
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, paddingTop: 4 }}>
          <label style={{ fontSize: 10, color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Warp ({glslUniforms.warp.toFixed(1)})</span>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={glslUniforms.warp}
              onChange={(e) => setGlslUniforms({ ...glslUniforms, warp: parseFloat(e.target.value) })}
              style={{ accentColor: '#06B6D4' }}
            />
          </label>
          <label style={{ fontSize: 10, color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Scale ({glslUniforms.scale.toFixed(1)})</span>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.2"
              value={glslUniforms.scale}
              onChange={(e) => setGlslUniforms({ ...glslUniforms, scale: parseFloat(e.target.value) })}
              style={{ accentColor: '#14B8A6' }}
            />
          </label>
          <label style={{ fontSize: 10, color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Seed ({glslUniforms.seed.toFixed(1)})</span>
            <input
              type="range"
              min="0.5"
              max="9.9"
              step="0.3"
              value={glslUniforms.seed}
              onChange={(e) => setGlslUniforms({ ...glslUniforms, seed: parseFloat(e.target.value) })}
              style={{ accentColor: '#10B981' }}
            />
          </label>
        </div>
      </div>

      {/* 2. CSG Vector Boolean Solver & 3D Axonometric Extruder */}
      <div style={{ padding: 14, borderRadius: 18, background: '#141826', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Layers size={13} color="#14B8A6" /> CSG Vector Booleans & 3D Extruder
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {(
            [
              { id: 'union', label: 'Union' },
              { id: 'subtract', label: 'Subtract' },
              { id: 'intersect', label: 'Intersect' },
              { id: 'xor', label: 'XOR' },
            ] as const
          ).map((op) => (
            <button
              key={op.id}
              onClick={() => {
                if (!stage) return
                applyVectorBooleanOperation(stage, op.id)
                notify(`Synthesized CSG ${op.label}`)
              }}
              style={{
                height: 34,
                borderRadius: 11,
                background: '#1B2032',
                border: 'none',
                color: '#E2E8F0',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {op.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 2 }}>
          <button
            onClick={async () => {
              if (!stage) return
              const ok = await extrudeActiveNode3D(stage, extrudeDepth)
              notify(ok ? `Extruded 3D Relief (${extrudeDepth}px)` : 'Select a node on canvas first')
            }}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(20, 184, 166, 0.16) 100%)',
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
            <Box size={13} /> 3D Extrude Active Node ({extrudeDepth}px)
          </button>
          <input
            type="range"
            min={6}
            max={28}
            value={extrudeDepth}
            onChange={(e) => setExtrudeDepth(Number(e.target.value))}
            style={{ width: 80, accentColor: '#06B6D4' }}
          />
        </div>
      </div>

      {/* 3. Gielis Superformula & Lissajous Harmonic Math Lab */}
      <div style={{ padding: 14, borderRadius: 18, background: '#141826', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Compass size={13} color="#22D3EE" /> Parametric Superformula & Lissajous
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[5, 6, 8, 12].map((mVal) => (
            <button
              key={mVal}
              onClick={() => {
                setSuperM(mVal)
                if (stage) {
                  addSuperformulaVector(stage, mVal, 0.35, 1.7, 1.7)
                  notify(`Gielis Superformula (m=${mVal})`)
                }
              }}
              style={{
                flex: 1,
                height: 34,
                borderRadius: 11,
                background: superM === mVal ? 'rgba(6, 182, 212, 0.18)' : '#1B2032',
                border: 'none',
                color: superM === mVal ? '#22D3EE' : '#CBD5E1',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              m={mVal} Star
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(
            [
              [3, 2],
              [3, 4],
              [5, 4],
              [5, 6],
            ] as [number, number][]
          ).map(([a, b]) => {
            const active = lissajousRatio[0] === a && lissajousRatio[1] === b
            return (
              <button
                key={`${a}-${b}`}
                onClick={() => {
                  setLissajousRatio([a, b])
                  if (stage) {
                    addLissajousCurve(stage, a, b, 90)
                    notify(`Lissajous Harmonic (${a}:${b})`)
                  }
                }}
                style={{
                  flex: 1,
                  height: 34,
                  borderRadius: 11,
                  background: active ? 'rgba(20, 184, 166, 0.18)' : '#1B2032',
                  border: 'none',
                  color: active ? '#2DD4BF' : '#CBD5E1',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {a}:{b} Wave
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Parametric Typography on Path */}
      <div style={{ padding: 14, borderRadius: 18, background: '#141826', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Type size={13} color="#22D3EE" /> Parametric Text-on-Path
        </div>
        <input
          className="input-base"
          value={pathText}
          onChange={(e) => setPathText(e.target.value)}
          placeholder="Enter curved badge text..."
          style={{ height: 36, fontSize: 12 }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {(
            [
              { id: 'circle', label: 'Circular Ring' },
              { id: 'wave', label: 'Sine Wave' },
              { id: 'arch', label: 'Arch Crest' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => {
                if (!stage) return
                addParametricTextOnPath(stage, pathText, m.id)
                setActiveFloatingWindow(null)
              }}
              style={{
                height: 34,
                borderRadius: 11,
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
        </div>
      </div>

      {/* 5. Reverse CSS AST -> Vector Compiler */}
      <div style={{ padding: 14, borderRadius: 18, background: '#141826', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Code2 size={13} color="#2DD4BF" /> CSS AST → Vector Compiler
        </div>
        <textarea
          value={cssSnippet}
          onChange={(e) => setCssSnippet(e.target.value)}
          style={{
            width: '100%',
            height: 76,
            borderRadius: 12,
            background: '#0C0E16',
            border: 'none',
            color: '#22D3EE',
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            padding: 10,
            resize: 'none',
            outline: 'none',
          }}
        />
        <button
          onClick={() => {
            if (!stage) return
            compileCssToVectorNode(stage, cssSnippet)
            notify('CSS AST Compiled to Vector Node')
          }}
          style={{
            height: 36,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)',
            border: 'none',
            color: '#07080D',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Compile CSS to Live Stage Node
        </button>
      </div>

      {/* 6. Cassowary Smart Layout Reflow & Data-Viz */}
      <div style={{ padding: 14, borderRadius: 18, background: '#141826', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Maximize2 size={13} color="#F59E0B" /> Smart Layout Reflow & Data-Viz
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            { w: 1080, h: 1080, label: '1:1 Square' },
            { w: 1080, h: 1920, label: '9:16 Story' },
            { w: 1280, h: 720, label: '16:9 YouTube' },
            { w: 1584, h: 396, label: '4:1 LinkedIn' },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                if (!stage) return
                smartReflowCanvasToNewSize(stage, preset.w, preset.h)
                notify(`Reflowed to ${preset.label}`)
              }}
              style={{
                height: 34,
                borderRadius: 11,
                background: '#1B2032',
                border: 'none',
                color: '#E2E8F0',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, paddingTop: 4 }}>
          {(
            [
              { id: 'kpi-card', label: 'KPI Metric Card' },
              { id: 'bar-chart', label: 'Vector Bar Chart' },
              { id: 'donut-ring', label: 'Donut Ring' },
              { id: 'macbook-window', label: 'macOS Frame' },
            ] as const
          ).map((w) => (
            <button
              key={w.id}
              onClick={() => {
                if (!stage) return
                addVectorDataVizWidget(stage, w.id)
                setActiveFloatingWindow(null)
              }}
              style={{
                height: 34,
                borderRadius: 11,
                background: '#0C0E16',
                border: 'none',
                color: '#22D3EE',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Sub-Pixel Geometry Optimizer & WCAG AAA Healer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button
          onClick={() => {
            if (!stage) return
            const res = optimizeStageGeometry(stage)
            notify(`Quantized ${res.nodesOptimized} nodes`)
          }}
          style={{
            height: 40,
            borderRadius: 14,
            background: '#141826',
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
          <Zap size={13} /> Sub-Pixel Quantizer
        </button>
        <button
          onClick={() => {
            if (!stage) return
            const res = auditAndHealCanvasContrast(stage, true)
            notify(`WCAG ${res.grade} (${res.ratio}:1)`)
          }}
          style={{
            height: 40,
            borderRadius: 14,
            background: '#141826',
            border: 'none',
            color: '#6EE7B7',
            fontSize: 11.5,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <CheckCircle2 size={13} /> Heal Contrast AAA
        </button>
      </div>

      {/* 8. Web Crypto AES-GCM 256-Bit Local Vault */}
      <div style={{ padding: 14, borderRadius: 18, background: '#141826', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Lock size={13} color="#10B981" /> AES-GCM 256-Bit Crypto Vault
        </div>
        <input
          type="password"
          className="input-base"
          value={vaultPassphrase}
          onChange={(e) => setVaultPassphrase(e.target.value)}
          placeholder="Vault passphrase..."
          style={{ height: 36, fontSize: 12 }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button
            onClick={handleEncryptExport}
            style={{
              height: 36,
              borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.16)',
              border: 'none',
              color: '#6EE7B7',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Lock size={12} /> Encrypt .enc
          </button>
          <button
            onClick={handleDecryptImport}
            style={{
              height: 36,
              borderRadius: 12,
              background: '#1B2032',
              border: 'none',
              color: '#E2E8F0',
              fontSize: 11.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Unlock size={12} /> Decrypt .enc
          </button>
        </div>
      </div>
    </div>
  )
}
