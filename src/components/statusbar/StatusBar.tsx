import { useState, useEffect } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Grid3x3 } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

export function StatusBar() {
  const canvasSize = useEditorStore((s) => s.canvasSize)
  const fabricCanvas = useEditorStore((s) => s.fabricCanvas)
  const layers = useEditorStore((s) => s.layers)
  const viewZoom = useEditorStore((s) => s.viewZoom)
  const fitScale = useEditorStore((s) => s.fitScale)
  const setViewZoom = useEditorStore((s) => s.setViewZoom)
  const resetView = useEditorStore((s) => s.resetView)
  const showGrid = useEditorStore((s) => s.showGrid)
  const toggleGrid = useEditorStore((s) => s.toggleGrid)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!fabricCanvas) return
    const handler = (e: any) => {
      const p = (fabricCanvas as any).getScenePoint?.(e.e) || { x: 0, y: 0 }
      setCursorPos({ x: Math.round(p.x), y: Math.round(p.y) })
    }
    fabricCanvas.on('mouse:move', handler)
    return () => {
      fabricCanvas.off('mouse:move', handler)
    }
  }, [fabricCanvas])

  const effectiveZoom = Math.round(fitScale * viewZoom * 100)

  return (
    <div
      style={{
        height: 26,
        background: 'var(--color-base-875)',
        borderTop: '1px solid var(--color-base-600)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 12,
        fontSize: 11,
        color: 'var(--color-base-500)',
        flexShrink: 0,
        fontFamily: 'var(--font-mono)',
        userSelect: 'none',
      }}
    >
      {/* Brand Signature */}
      <span style={{ color: 'var(--color-base-400)', fontSize: 10, fontWeight: 600 }}>
        COREX STUDIO
      </span>
      <span style={{ color: 'var(--color-base-700)' }}>·</span>

      {/* Canvas dimensions */}
      <span>
        {canvasSize.width} × {canvasSize.height}px
      </span>
      <span style={{ color: 'var(--color-base-700)' }}>·</span>

      {/* Active Layer Count */}
      <span>{layers.length} {layers.length === 1 ? 'Layer' : 'Layers'}</span>
      <span style={{ color: 'var(--color-base-700)' }}>·</span>

      {/* Cursor coordinates */}
      <span>
        X: {cursorPos.x}, Y: {cursorPos.y}
      </span>

      {/* Zoom & Viewport Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
        <button
          onClick={() => setViewZoom(viewZoom / 1.2)}
          aria-label="Zoom out"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-base-500)',
            padding: 2,
            display: 'flex',
          }}
        >
          <ZoomOut size={12} />
        </button>
        <span style={{ minWidth: 36, textAlign: 'center' }}>{effectiveZoom}%</span>
        <button
          onClick={() => setViewZoom(viewZoom * 1.2)}
          aria-label="Zoom in"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-base-500)',
            padding: 2,
            display: 'flex',
          }}
        >
          <ZoomIn size={12} />
        </button>
        <button
          onClick={resetView}
          aria-label="Fit to screen"
          title="Fit to screen"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-base-500)',
            padding: 2,
            display: 'flex',
          }}
        >
          <Maximize2 size={11} />
        </button>
        <button
          onClick={toggleGrid}
          aria-label="Toggle grid"
          title="Toggle grid (Ctrl + ')"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 2,
            display: 'flex',
            color: showGrid ? 'var(--color-accent-400)' : 'var(--color-base-500)',
          }}
        >
          <Grid3x3 size={12} />
        </button>
      </div>

      <span style={{ color: 'var(--color-base-700)', marginLeft: 4 }}>·</span>
      <span style={{ color: 'var(--color-base-500)', fontSize: 10 }}>
        Engineered by LernexAI
      </span>
    </div>
  )
}
