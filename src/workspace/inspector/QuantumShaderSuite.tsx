import { useState } from 'react'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import {
  detectHardwareRasterBackend,
  addParametricTextOnPath,
  compileCssToVectorNode,
  optimizeStageGeometry,
  applyProceduralShaderBackground,
  smartReflowCanvasToNewSize,
  compileCanvasToReactTailwindJsx,
  compileCanvasToW3cDesignTokens,
  addVectorDataVizWidget,
  auditAndHealCanvasContrast,
} from '@/lib/quantumEngine'
import { encryptProjectPayload } from '@/lib/cryptoVault'
import { crdtMesh } from '@/lib/crdtSync'
import { dispatchBinaryDownload } from '@/lib/export'
import {
  Cpu,
  Sparkles,
  Code2,
  ShieldCheck,
  BarChart3,
  Maximize2,
  Eye,
  Lock,
  Radio,
  Wand2,
  Type,
} from 'lucide-react'

const SAMPLE_CSS = `width: 320px;
height: 180px;
background: linear-gradient(135deg, #06B6D4, #14B8A6);
border-radius: 24px;
border: 2px solid #F8FAFC;
transform: rotate(-4deg);`

export function QuantumLabPanel() {
  const canvas = useFabricCanvas()
  const gpuInfo = detectHardwareRasterBackend()

  const [pathText, setPathText] = useState('COREX QUANTUM STUDIO • LERNEXAI • ')
  const [cssInput, setCssInput] = useState(SAMPLE_CSS)
  const [vaultKey, setVaultKey] = useState('lernexai-2026')
  const [statusBanner, setStatusBanner] = useState<string | null>(null)
  const [exportedCode, setExportedCode] = useState<string | null>(null)

  const notify = (msg: string) => {
    setStatusBanner(msg)
    setTimeout(() => setStatusBanner(null), 3200)
  }

  const handleOptimizeGeometry = () => {
    if (!canvas) return
    const res = optimizeStageGeometry(canvas)
    notify(`⚡ Optimized ${res.nodesOptimized} nodes (~${res.bytesSavedEstimate}B saved)`)
  }

  const handleContrastAudit = (heal: boolean) => {
    if (!canvas) return
    const res = auditAndHealCanvasContrast(canvas, heal)
    if (heal) {
      notify(`✅ Auto-healed ${res.healedCount} text layers to WCAG AAA (${res.ratio}:1)`)
    } else {
      notify(`WCAG Contrast Grade: ${res.grade} (${res.ratio}:1 min ratio)`)
    }
  }

  const handleEncryptedExport = async () => {
    if (!canvas || !vaultKey.trim()) return
    const rawJson = JSON.stringify((canvas as any).toJSON(['__uid', 'corexLabel']))
    const encrypted = await encryptProjectPayload(rawJson, vaultKey.trim())
    const blob = new Blob([JSON.stringify(encrypted, null, 2)], { type: 'application/json' })
    dispatchBinaryDownload(blob, `corex-vault-aes256.corex.enc`)
    notify('🔒 AES-GCM 256-Bit Encrypted Vault downloaded!')
  }

  const handleSyncBroadcast = () => {
    if (!canvas) return
    crdtMesh.broadcastDelta(canvas)
    notify(`📡 CRDT Binary Frame broadcasted (Clock #${crdtMesh.lamportClock})`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', paddingBottom: 18 }}>
      {/* Live Status Toast */}
      {statusBanner && (
        <div
          style={{
            margin: '8px 10px 2px',
            padding: '8px 10px',
            borderRadius: '0.5rem',
            background: 'rgba(6, 182, 212, 0.14)',
            border: '1px solid #06B6D4',
            color: '#A5F3FC',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {statusBanner}
        </div>
      )}

      {/* 1. Hardware WebGPU & CRDT Telemetry */}
      <div className="panel-heading">Hardware & CRDT Mesh</div>
      <div style={{ padding: '4px 10px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            padding: '8px 10px',
            borderRadius: '0.5rem',
            background: 'var(--color-ink-950)',
            border: '1px solid var(--color-base-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 10.5,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8' }}>
            <Cpu size={13} color="#06B6D4" /> {gpuInfo.backend}
          </span>
          <span style={{ color: '#10B981', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            {gpuInfo.maxTextureDimension}px Max
          </span>
        </div>
        <button onClick={handleSyncBroadcast} className="btn-base" style={{ height: 28, fontSize: 11 }}>
          <Radio size={12} color="#14B8A6" />
          <span>Sync CRDT Binary Mesh Across Tabs</span>
        </button>
      </div>

      {/* 2. Parametric Typography Lab (Text-on-Path) */}
      <div className="panel-heading">Parametric Typography Lab</div>
      <div style={{ padding: '4px 10px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <input
          className="input-base"
          value={pathText}
          onChange={(e) => setPathText(e.target.value)}
          placeholder="Enter curve text…"
          style={{ fontSize: 11 }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
          <button
            onClick={() => canvas && addParametricTextOnPath(canvas, pathText, 'circle', '#06B6D4')}
            className="btn-base"
            style={{ height: 28, fontSize: 10.5 }}
          >
            <Type size={11} color="#06B6D4" /> Ring Path
          </button>
          <button
            onClick={() => canvas && addParametricTextOnPath(canvas, pathText, 'wave', '#14B8A6')}
            className="btn-base"
            style={{ height: 28, fontSize: 10.5 }}
          >
            〰 Sine Wave
          </button>
          <button
            onClick={() => canvas && addParametricTextOnPath(canvas, pathText, 'arch', '#F59E0B')}
            className="btn-base"
            style={{ height: 28, fontSize: 10.5 }}
          >
            ⌒ Arch Crest
          </button>
        </div>
      </div>

      {/* 3. Procedural Generative Shader Lab */}
      <div className="panel-heading">Procedural Shader Backgrounds</div>
      <div style={{ padding: '4px 10px 8px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 5 }}>
        <button
          onClick={() => canvas && void applyProceduralShaderBackground(canvas, 'aurora-plasma')}
          className="btn-base"
          style={{ height: 28, fontSize: 10.5 }}
        >
          <Sparkles size={11} color="#06B6D4" /> Aurora Plasma
        </button>
        <button
          onClick={() => canvas && void applyProceduralShaderBackground(canvas, 'synthwave-grid')}
          className="btn-base"
          style={{ height: 28, fontSize: 10.5 }}
        >
          🌅 Synth Grid
        </button>
        <button
          onClick={() => canvas && void applyProceduralShaderBackground(canvas, 'quantum-mesh')}
          className="btn-base"
          style={{ height: 28, fontSize: 10.5 }}
        >
          🌊 Quantum Mesh
        </button>
        <button
          onClick={() => canvas && void applyProceduralShaderBackground(canvas, 'constellation')}
          className="btn-base"
          style={{ height: 28, fontSize: 10.5 }}
        >
          ✨ Constellation
        </button>
      </div>

      {/* 4. Reverse CSS-to-Vector Compiler */}
      <div className="panel-heading">CSS → Vector Reverse Compiler</div>
      <div style={{ padding: '4px 10px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <textarea
          value={cssInput}
          onChange={(e) => setCssInput(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            background: 'var(--color-ink-950)',
            border: '1px solid var(--color-base-600)',
            borderRadius: '0.5rem',
            color: '#A5F3FC',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            padding: 8,
            outline: 'none',
            resize: 'vertical',
          }}
        />
        <button
          onClick={() => {
            if (!canvas) return
            compileCssToVectorNode(canvas, cssInput)
            notify('✨ CSS AST compiled into editable Vector Layer!')
          }}
          className="btn-primary btn-base"
          style={{ height: 30, fontSize: 11 }}
        >
          <Code2 size={13} />
          <span>Compile CSS → Vector Node</span>
        </button>
      </div>

      {/* 5. Cassowary Autonomous Responsive Layout Reflow */}
      <div className="panel-heading">Autonomous Smart Layout Reflow</div>
      <div style={{ padding: '4px 10px 8px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 5 }}>
        <button
          onClick={() => {
            if (!canvas) return
            smartReflowCanvasToNewSize(canvas, 1080, 1080)
            notify('📐 Smart Reflow → Square 1080×1080')
          }}
          className="btn-base"
          style={{ height: 28, fontSize: 10.5 }}
        >
          <Maximize2 size={11} color="#06B6D4" /> 1:1 Square
        </button>
        <button
          onClick={() => {
            if (!canvas) return
            smartReflowCanvasToNewSize(canvas, 1080, 1920)
            notify('📐 Smart Reflow → Story 1080×1920')
          }}
          className="btn-base"
          style={{ height: 28, fontSize: 10.5 }}
        >
          📱 9:16 Story
        </button>
        <button
          onClick={() => {
            if (!canvas) return
            smartReflowCanvasToNewSize(canvas, 1280, 720)
            notify('📐 Smart Reflow → YouTube 1280×720')
          }}
          className="btn-base"
          style={{ height: 28, fontSize: 10.5 }}
        >
          🎬 16:9 Cover
        </button>
        <button
          onClick={() => {
            if (!canvas) return
            smartReflowCanvasToNewSize(canvas, 1584, 396)
            notify('📐 Smart Reflow → LinkedIn 1584×396')
          }}
          className="btn-base"
          style={{ height: 28, fontSize: 10.5 }}
        >
          💼 4:1 Banner
        </button>
      </div>

      {/* 6. Parametric Data-Viz & Mockup Studio */}
      <div className="panel-heading">Data-Viz & Device Mockups</div>
      <div style={{ padding: '4px 10px 8px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 5 }}>
        <button
          onClick={() => canvas && addVectorDataVizWidget(canvas, 'kpi-card')}
          className="btn-base"
          style={{ height: 28, fontSize: 10.5 }}
        >
          <BarChart3 size={11} color="#10B981" /> KPI Metric
        </button>
        <button
          onClick={() => canvas && addVectorDataVizWidget(canvas, 'bar-chart')}
          className="btn-base"
          style={{ height: 28, fontSize: 10.5 }}
        >
          📊 Bar Chart
        </button>
        <button
          onClick={() => canvas && addVectorDataVizWidget(canvas, 'donut-ring')}
          className="btn-base"
          style={{ height: 28, fontSize: 10.5 }}
        >
          🍩 Donut Ring
        </button>
        <button
          onClick={() => canvas && addVectorDataVizWidget(canvas, 'macbook-window')}
          className="btn-base"
          style={{ height: 28, fontSize: 10.5 }}
        >
          💻 App Window
        </button>
      </div>

      {/* 7. Sub-Pixel Geometry Optimizer & WCAG Contrast Healer */}
      <div className="panel-heading">Geometry & WCAG Contrast Auditor</div>
      <div style={{ padding: '4px 10px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
        <button onClick={handleOptimizeGeometry} className="btn-base" style={{ height: 28, fontSize: 10.5 }}>
          <Wand2 size={11} color="#06B6D4" /> Optimize Nodes
        </button>
        <button onClick={() => handleContrastAudit(true)} className="btn-base" style={{ height: 28, fontSize: 10.5 }}>
          <Eye size={11} color="#10B981" /> Heal Contrast
        </button>
      </div>

      {/* 8. AES-GCM 256-Bit Encrypted Vault */}
      <div className="panel-heading">AES-GCM 256-Bit Crypto Vault</div>
      <div style={{ padding: '4px 10px 8px', display: 'flex', gap: 5 }}>
        <input
          type="password"
          className="input-base"
          value={vaultKey}
          onChange={(e) => setVaultKey(e.target.value)}
          placeholder="Vault passphrase…"
          style={{ flex: 1, fontSize: 11 }}
        />
        <button
          onClick={() => void handleEncryptedExport()}
          className="btn-base"
          style={{ height: 30, padding: '0 10px', fontSize: 10.5, borderColor: '#10B981', color: '#10B981' }}
          title="Export AES-GCM 256-Bit Encrypted Project"
        >
          <Lock size={11} />
          <span>Encrypt</span>
        </button>
      </div>

      {/* 9. Universal Node Pipeline Exporter (React JSX & W3C Tokens) */}
      <div className="panel-heading">Universal AST & React Exporter</div>
      <div style={{ padding: '4px 10px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
          <button
            onClick={() => {
              if (!canvas) return
              const jsx = compileCanvasToReactTailwindJsx(canvas)
              setExportedCode(jsx)
              void navigator.clipboard?.writeText(jsx)
              notify('📋 React JSX Component copied to clipboard!')
            }}
            className="btn-base"
            style={{ height: 28, fontSize: 10.5 }}
          >
            <Code2 size={11} color="#06B6D4" /> React JSX
          </button>
          <button
            onClick={() => {
              if (!canvas) return
              const tokens = compileCanvasToW3cDesignTokens(canvas)
              setExportedCode(tokens)
              void navigator.clipboard?.writeText(tokens)
              notify('📋 W3C Design Tokens JSON copied!')
            }}
            className="btn-base"
            style={{ height: 28, fontSize: 10.5 }}
          >
            <ShieldCheck size={11} color="#14B8A6" /> W3C Tokens
          </button>
        </div>
        {exportedCode && (
          <pre
            style={{
              margin: 0,
              padding: 8,
              maxHeight: 130,
              overflowY: 'auto',
              borderRadius: '0.5rem',
              background: 'var(--color-ink-950)',
              border: '1px solid var(--color-base-600)',
              fontFamily: 'var(--font-mono)',
              fontSize: 9.5,
              color: '#A5F3FC',
            }}
          >
            {exportedCode}
          </pre>
        )}
      </div>
    </div>
  )
}
