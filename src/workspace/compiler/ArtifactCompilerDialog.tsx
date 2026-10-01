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
} from '@/lib/quantumEngine'
import { modalVariants, modalOverlayVariants } from '@/lib/motion'

interface ExportModalProps {
  onClose: () => void
}

type ExtendedExportFormat = ExportFormat | 'jsx' | 'tokens'

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
      `corex-design-${new Date().toISOString().split('T')[0]}`,
  )
  const [exporting, setExporting] = useState(false)

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
      } else {
        await exportCanvas(canvas, format, quality / 100, filename, { scale, transparent })
      }
      onClose()
    } finally {
      setExporting(false)
    }
  }

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
          background: 'rgba(8, 9, 14, 0.72)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 400,
            background: 'var(--color-base-850)',
            border: '1px solid var(--color-base-600)',
            borderRadius: '1rem',
            boxShadow: 'var(--shadow-float)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px 14px',
              borderBottom: '1px solid var(--color-base-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-base-100)' }}>
                Quantum Output Compiler
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#06B6D4',
                  marginTop: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Cpu size={11} /> {gpuInfo.backend} Accelerated (Up to 8K)
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-base-500)',
                padding: 4,
              }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Format */}
            <div>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: 'var(--color-base-500)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 8,
                }}
              >
                Output Pipeline Format
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {(
                  [
                    { id: 'png', label: 'PNG' },
                    { id: 'jpeg', label: 'JPEG' },
                    { id: 'svg', label: 'SVG' },
                    { id: 'pdf', label: 'PDF' },
                    { id: 'pptx', label: 'PPTX' },
                    { id: 'jsx', label: 'React JSX' },
                    { id: 'tokens', label: 'W3C JSON' },
                  ] as { id: ExtendedExportFormat; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFormat(item.id)}
                    style={{
                      height: 34,
                      borderRadius: '0.5rem',
                      border: '1px solid',
                      borderColor: format === item.id ? 'var(--color-accent-400)' : 'var(--color-base-600)',
                      background: format === item.id ? 'rgba(6,182,212,0.14)' : 'var(--color-base-800)',
                      color: format === item.id ? 'var(--color-accent-400)' : 'var(--color-base-400)',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 150ms',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Supersampling (1x to 8x 8K) */}
            {format !== 'svg' && format !== 'jsx' && format !== 'tokens' && (
              <div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: 'var(--color-base-500)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 8,
                  }}
                >
                  WebGPU Supersampling Multiplier
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 8].map((s) => (
                    <button
                      key={s}
                      onClick={() => setScale(s)}
                      style={{
                        flex: 1,
                        height: 32,
                        borderRadius: '0.5rem',
                        border: '1px solid',
                        borderColor: scale === s ? 'var(--color-accent-400)' : 'var(--color-base-600)',
                        background: scale === s ? 'rgba(6,182,212,0.14)' : 'var(--color-base-800)',
                        color: scale === s ? 'var(--color-accent-400)' : 'var(--color-base-400)',
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 150ms',
                      }}
                    >
                      {s}x{s === 4 ? ' (4K)' : s === 8 ? ' (8K)' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Transparent background */}
            {format === 'png' && (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  fontSize: 12,
                  color: 'var(--color-base-200)',
                }}
              >
                <input
                  type="checkbox"
                  checked={transparent}
                  onChange={(e) => setTransparent(e.target.checked)}
                  style={{ accentColor: 'var(--color-accent-400)', width: 14, height: 14 }}
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
                  color: 'var(--color-base-500)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 6,
                }}
              >
                Artifact Filename
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  className="input-base"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  style={{ flex: 1 }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--color-base-500)',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  .{format === 'jsx' ? 'tsx' : format === 'tokens' ? 'tokens.json' : format}
                </span>
              </div>
            </div>

            {/* Info */}
            <div
              style={{
                padding: '10px 12px',
                background: 'var(--color-base-800)',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-base-600)',
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--color-base-500)', lineHeight: 1.5 }}>
                {format === 'svg'
                  ? `Pure mathematical XML vector output (${canvasSize.width} × ${canvasSize.height} viewBox).`
                  : format === 'jsx'
                  ? `Compiles all ${canvas?.getObjects().length || 0} stage nodes into a standalone React 19 + inline CSS/Tailwind TypeScript component (.tsx).`
                  : format === 'tokens'
                  ? `Exports artboard dimensions and all active layer color tokens in W3C Design Token Standard JSON format.`
                  : `Hardware rasterized output: ${Math.round(canvasSize.width * scale)} × ${Math.round(canvasSize.height * scale)} px (${scale}x multiplier). Zero watermarks.`}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '0 20px 20px' }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleExport}
              disabled={exporting}
              className="btn-primary btn-base"
              style={{ width: '100%', height: 38, fontSize: 13, gap: 8, opacity: exporting ? 0.7 : 1 }}
            >
              <Download size={14} />
              {exporting ? 'Compiling Artifact…' : `Compile & Download ${format.toUpperCase()}`}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
