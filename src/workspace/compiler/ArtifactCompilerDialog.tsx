/**
 * LernexAI Proprietary — 10-Pipeline Quantum Artifact Compiler Dialog
 * Zero harsh borders, soft rounded-3xl modal surface, rounded-xl format pills,
 * and 1x-8x (8K) WebGPU Supersampling + Code/Shader/HTML5 Bundle Compilation.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Cpu } from 'lucide-react'
import { Slider } from '@/components/ui/Slider'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import { useEditorStore } from '@/store/editorStore'
import { exportCanvas, dispatchBinaryDownload, type ExportFormat } from '@/lib/export'
import {
  detectHardwareRasterBackend,
  compileCanvasToReactTailwindJsx,
  compileCanvasToW3cDesignTokens,
  compileCanvasToStandaloneHtml,
  compileCanvasToCssModule,
} from '@/lib/quantumEngine'
import { getGlslFragmentKernelSource } from '@/lib/glslShaderEngine'
import { modalVariants, modalOverlayVariants } from '@/lib/motion'

interface ExportModalProps {
  onClose: () => void
}

type ExtendedExportFormat =
  | ExportFormat
  | 'jsx'
  | 'tokens'
  | 'html'
  | 'glsl'
  | 'css'

export function ExportModal({ onClose }: ExportModalProps) {
  const canvas = useFabricCanvas()
  const { currentProjectName, canvasSize } = useEditorStore()
  const gpuInfo = detectHardwareRasterBackend()
  const [format, setFormat] = useState<ExtendedExportFormat>('png')
  const [quality, setQuality] = useState(95)
  const [scale, setScale] = useState(2)
  const [transparent, setTransparent] = useState(false)
  const [filename, setFilename] = useState(
    currentProjectName?.replace(/[^a-z0-9]/gi, '-').toLowerCase() ||
      `corex-quantum-${new Date().toISOString().split('T')[0]}`,
  )
  const [exporting, setExporting] = useState(false)

  const getFileExtension = (fmt: ExtendedExportFormat) => {
    if (fmt === 'jsx') return 'tsx'
    if (fmt === 'tokens') return 'tokens.json'
    if (fmt === 'html') return 'html'
    if (fmt === 'glsl') return 'frag'
    if (fmt === 'css') return 'module.css'
    return fmt
  }

  const handleExport = async () => {
    if (!canvas) return
    setExporting(true)
    try {
      if (format === 'jsx') {
        const code = compileCanvasToReactTailwindJsx(canvas)
        dispatchBinaryDownload(new Blob([code], { type: 'text/plain;charset=utf-8' }), `${filename}.tsx`)
      } else if (format === 'tokens') {
        const json = compileCanvasToW3cDesignTokens(canvas)
        dispatchBinaryDownload(new Blob([json], { type: 'application/json;charset=utf-8' }), `${filename}.tokens.json`)
      } else if (format === 'html') {
        const html = compileCanvasToStandaloneHtml(canvas, currentProjectName || 'Corex Quantum Studio')
        dispatchBinaryDownload(new Blob([html], { type: 'text/html;charset=utf-8' }), `${filename}.html`)
      } else if (format === 'glsl') {
        const frag = getGlslFragmentKernelSource('aurora-plasma')
        dispatchBinaryDownload(new Blob([frag], { type: 'text/plain;charset=utf-8' }), `${filename}.frag`)
      } else if (format === 'css') {
        const css = compileCanvasToCssModule(canvas)
        dispatchBinaryDownload(new Blob([css], { type: 'text/css;charset=utf-8' }), `${filename}.module.css`)
      } else {
        await exportCanvas(canvas, format, quality / 100, filename, { scale, transparent })
      }
      onClose()
    } finally {
      setExporting(false)
    }
  }

  const isRasterOrDoc = format === 'png' || format === 'jpeg' || format === 'pdf' || format === 'pptx'

  return (
    <AnimatePresence>
      <motion.div
        variants={modalOverlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 500,
          background: 'rgba(7, 8, 13, 0.76)',
          backdropFilter: 'blur(14px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 440,
            background: '#0C0E16',
            borderRadius: 24,
            boxShadow: '0 28px 72px rgba(0, 0, 0, 0.78)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 22px 14px',
              background: '#111522',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 15.5, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                10-Pipeline Quantum Compiler
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#22D3EE',
                  marginTop: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Cpu size={12} /> {gpuInfo.backend} Accelerated (Up to 8K)
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 12,
                background: '#181C2B',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Format */}
            <div>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  marginBottom: 8,
                }}
              >
                Output Pipeline Format (10 Targets)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                {(
                  [
                    { id: 'png', label: 'PNG' },
                    { id: 'jpeg', label: 'JPEG' },
                    { id: 'svg', label: 'SVG' },
                    { id: 'pdf', label: 'PDF' },
                    { id: 'pptx', label: 'PPTX' },
                    { id: 'jsx', label: 'React JSX' },
                    { id: 'tokens', label: 'W3C JSON' },
                    { id: 'html', label: 'HTML5' },
                    { id: 'glsl', label: 'GLSL .frag' },
                    { id: 'css', label: 'CSS Mod' },
                  ] as { id: ExtendedExportFormat; label: string }[]
                ).map((item) => {
                  const active = format === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setFormat(item.id)}
                      style={{
                        height: 36,
                        borderRadius: 12,
                        border: 'none',
                        background: active
                          ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.22) 0%, rgba(20, 184, 166, 0.16) 100%)'
                          : '#151926',
                        color: active ? '#22D3EE' : '#94A3B8',
                        fontSize: 11,
                        fontWeight: active ? 700 : 600,
                        cursor: 'pointer',
                        transition: 'all 150ms',
                      }}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Resolution Supersampling (1x to 8x 8K) */}
            {isRasterOrDoc && (
              <div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    marginBottom: 8,
                  }}
                >
                  WebGPU Supersampling Multiplier
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 8].map((s) => {
                    const active = scale === s
                    return (
                      <button
                        key={s}
                        onClick={() => setScale(s)}
                        style={{
                          flex: 1,
                          height: 36,
                          borderRadius: 12,
                          border: 'none',
                          background: active
                            ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.22) 0%, rgba(20, 184, 166, 0.16) 100%)'
                            : '#151926',
                          color: active ? '#22D3EE' : '#94A3B8',
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 150ms',
                        }}
                      >
                        {s}x{s === 4 ? ' (4K)' : s === 8 ? ' (8K)' : ''}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Transparent background */}
            {format === 'png' && (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  fontSize: 12,
                  color: '#E2E8F0',
                  padding: '8px 12px',
                  borderRadius: 12,
                  background: '#151926',
                }}
              >
                <input
                  type="checkbox"
                  checked={transparent}
                  onChange={(e) => setTransparent(e.target.checked)}
                  style={{ accentColor: '#06B6D4', width: 15, height: 15 }}
                />
                Alpha Channel Transparency (Zero Background)
              </label>
            )}

            {/* JPEG Quality */}
            {format === 'jpeg' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <Slider label="Quality" value={quality} min={40} max={100} step={5} onChange={setQuality} showValue unit="%" />
              </motion.div>
            )}

            {/* Filename */}
            <div>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  marginBottom: 6,
                }}
              >
                Artifact Filename
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  className="input-base"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  style={{ flex: 1, height: 38 }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: '#22D3EE',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                    padding: '8px 10px',
                    borderRadius: 10,
                    background: '#151926',
                  }}
                >
                  .{getFileExtension(format)}
                </span>
              </div>
            </div>

            {/* Info */}
            <div
              style={{
                padding: '12px 14px',
                background: '#151926',
                borderRadius: 14,
              }}
            >
              <div style={{ fontSize: 11.5, color: '#94A3B8', lineHeight: 1.55 }}>
                {format === 'svg'
                  ? `Pure mathematical XML vector output (${canvasSize.width} × ${canvasSize.height} viewBox).`
                  : format === 'jsx'
                  ? `Compiles all ${canvas?.getObjects().length || 0} stage nodes into a standalone React 19 + Tailwind TypeScript component (.tsx).`
                  : format === 'tokens'
                  ? `Exports artboard dimensions and all active layer color tokens in W3C Design Token Standard JSON format.`
                  : format === 'html'
                  ? `Compiles the complete vector stage and Google Fonts into a standalone, zero-dependency HTML5 microsite (.html).`
                  : format === 'glsl'
                  ? `Exports the raw WebGL2 GLSL ES 3.00 (#version 300 es) GPU fragment kernel source (.frag).`
                  : format === 'css'
                  ? `Compiles all active stage layers into a production-ready scoped CSS Module stylesheet (.module.css).`
                  : `Hardware rasterized output: ${Math.round(canvasSize.width * scale)} × ${Math.round(canvasSize.height * scale)} px (${scale}x multiplier). Zero watermarks.`}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '0 22px 22px' }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleExport}
              disabled={exporting}
              className="btn-primary btn-base"
              style={{
                width: '100%',
                height: 42,
                borderRadius: 14,
                fontSize: 13,
                gap: 8,
                opacity: exporting ? 0.7 : 1,
              }}
            >
              <Download size={15} />
              {exporting ? 'Compiling Artifact…' : `Compile & Download .${getFileExtension(format).toUpperCase()}`}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
