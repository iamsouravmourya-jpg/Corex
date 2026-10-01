import { useEffect, useRef, useCallback } from 'react'
import { Canvas as FabricCanvas } from 'fabric'
import { useEditorStore } from '@/store/editorStore'
import { nanoid } from 'nanoid'
import { addImageFromDataUrl } from '@/lib/shapes'
import { attachAlignmentGuides } from '@/lib/snapping'
import { crdtMesh } from '@/lib/crdtSync'
import { optimizeStageGeometry, auditAndHealCanvasContrast } from '@/lib/quantumEngine'
import { ZoomIn, ZoomOut, Maximize2, Grid3x3, Wand2, Eye } from 'lucide-react'

const STAGE_MARGIN_PX = 80

export function CanvasBoard() {
  const surfaceNodeRef = useRef<HTMLCanvasElement>(null)
  const matrixFrameRef = useRef<HTMLDivElement>(null)
  const magneticOverlayRef = useRef<HTMLDivElement>(null)
  const stageHostRef = useRef<HTMLDivElement>(null)
  const translationVecRef = useRef({ x: 0, y: 0 })
  const activeScaleRef = useRef(1)
  const spaceHoldRef = useRef(false)

  const {
    canvasSize,
    viewZoom,
    fitScale,
    viewNonce,
    fabricCanvas,
    showGrid,
    setFabricCanvas,
    setActiveObjectId,
    snapshot,
    setFitScale,
  } = useEditorStore()

  const computeViewportMatrix = useCallback(() => {
    const frameEl = matrixFrameRef.current
    const hostEl = stageHostRef.current
    if (!frameEl || !hostEl) return

    const fitRatio = Math.min(
      (hostEl.clientWidth - STAGE_MARGIN_PX) / canvasSize.width,
      (hostEl.clientHeight - STAGE_MARGIN_PX) / canvasSize.height,
      1,
    )
    const compositeScale = fitRatio * viewZoom
    activeScaleRef.current = compositeScale
    frameEl.style.transform = `translate(${translationVecRef.current.x}px, ${translationVecRef.current.y}px) scale(${compositeScale})`

    if (Math.abs(useEditorStore.getState().fitScale - fitRatio) > 0.001) {
      setFitScale(fitRatio)
    }
  }, [canvasSize, viewZoom, setFitScale])

  useEffect(() => {
    if (!surfaceNodeRef.current) return
    const initialBounds = useEditorStore.getState().canvasSize

    const stage = new FabricCanvas(surfaceNodeRef.current, {
      width: initialBounds.width,
      height: initialBounds.height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true,
    })

    setFabricCanvas(stage)
    stage.renderAll()
    crdtMesh.attach(stage)

    stage.on('object:added', (ev) => {
      if (!(ev.target as any).__uid) {
        ;(ev.target as any).__uid = nanoid(8)
      }
      snapshot()
      crdtMesh.broadcastDelta(stage)
    })
    stage.on('object:removed', () => {
      snapshot()
      crdtMesh.broadcastDelta(stage)
    })
    stage.on('object:modified', () => {
      snapshot()
      crdtMesh.broadcastDelta(stage)
    })

    const syncSelection = (ev: any) => {
      setActiveObjectId((ev.selected?.[0] as any)?.__uid || null)
    }
    stage.on('selection:created', syncSelection)
    stage.on('selection:updated', syncSelection)
    stage.on('selection:cleared', () => setActiveObjectId(null))

    snapshot()

    return () => {
      crdtMesh.detach()
      stage.dispose()
      setFabricCanvas(null)
    }
  }, [])

  useEffect(() => {
    if (!fabricCanvas) return
    fabricCanvas.setDimensions({ width: canvasSize.width, height: canvasSize.height })
    fabricCanvas.renderAll()
    computeViewportMatrix()
  }, [fabricCanvas, canvasSize, computeViewportMatrix])

  useEffect(() => {
    computeViewportMatrix()
  }, [computeViewportMatrix, viewNonce])

  useEffect(() => {
    const hostEl = stageHostRef.current
    if (!hostEl) return

    const applyFocalZoom = (pointerX: number, pointerY: number, targetZoom: number) => {
      const frameEl = matrixFrameRef.current
      if (!frameEl) return
      const store = useEditorStore.getState()
      const currentScale = activeScaleRef.current
      const projectedScale = currentScale * (targetZoom / store.viewZoom)
      const bounds = frameEl.getBoundingClientRect()
      const midX = bounds.left + bounds.width * 0.5
      const midY = bounds.top + bounds.height * 0.5
      const ratioDelta = 1 - projectedScale / currentScale
      translationVecRef.current = {
        x: translationVecRef.current.x + (pointerX - midX) * ratioDelta,
        y: translationVecRef.current.y + (pointerY - midY) * ratioDelta,
      }
      store.setViewZoom(targetZoom)
    }

    const handleWheelZoom = (ev: WheelEvent) => {
      if (!ev.ctrlKey && !ev.metaKey) return
      ev.preventDefault()
      const currentZoom = useEditorStore.getState().viewZoom
      applyFocalZoom(ev.clientX, ev.clientY, currentZoom * (ev.deltaY < 0 ? 1.1 : 1 / 1.1))
    }
    hostEl.addEventListener('wheel', handleWheelZoom, { passive: false })

    const handleStagePanStart = (ev: MouseEvent) => {
      const isPanGesture = ev.button === 1 || (ev.button === 0 && spaceHoldRef.current)
      if (!isPanGesture) return
      ev.preventDefault()
      ev.stopPropagation()
      const startVec = { ...translationVecRef.current }
      const originX = ev.clientX
      const originY = ev.clientY
      const onPointerMove = (moveEv: MouseEvent) => {
        translationVecRef.current = {
          x: startVec.x + moveEv.clientX - originX,
          y: startVec.y + moveEv.clientY - originY,
        }
        computeViewportMatrix()
      }
      const onPointerRelease = () => {
        window.removeEventListener('mousemove', onPointerMove)
        window.removeEventListener('mouseup', onPointerRelease)
      }
      window.addEventListener('mousemove', onPointerMove)
      window.addEventListener('mouseup', onPointerRelease)
    }
    hostEl.addEventListener('mousedown', handleStagePanStart, true)

    const isTextInputFocused = () => {
      const tag = (document.activeElement?.tagName || '').toLowerCase()
      const isEditingNode = (useEditorStore.getState().fabricCanvas?.getActiveObject() as any)?.isEditing
      return tag === 'input' || tag === 'textarea' || Boolean(isEditingNode)
    }

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.code === 'Space' && !spaceHoldRef.current && !isTextInputFocused()) {
        spaceHoldRef.current = true
        hostEl.style.cursor = 'grab'
        ev.preventDefault()
      }
      if ((ev.ctrlKey || ev.metaKey) && !isTextInputFocused()) {
        const rect = hostEl.getBoundingClientRect()
        const midX = rect.left + rect.width * 0.5
        const midY = rect.top + rect.height * 0.5
        if (ev.key === '=' || ev.key === '+') {
          ev.preventDefault()
          applyFocalZoom(midX, midY, useEditorStore.getState().viewZoom * 1.2)
        } else if (ev.key === '-') {
          ev.preventDefault()
          applyFocalZoom(midX, midY, useEditorStore.getState().viewZoom / 1.2)
        } else if (ev.key === '0') {
          ev.preventDefault()
          translationVecRef.current = { x: 0, y: 0 }
          useEditorStore.getState().resetView()
        }
      }
    }

    const onKeyUp = (ev: KeyboardEvent) => {
      if (ev.code === 'Space') {
        spaceHoldRef.current = false
        hostEl.style.cursor = ''
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    const resizeObserver = new ResizeObserver(() => computeViewportMatrix())
    resizeObserver.observe(hostEl)
    computeViewportMatrix()

    return () => {
      hostEl.removeEventListener('wheel', handleWheelZoom)
      hostEl.removeEventListener('mousedown', handleStagePanStart, true)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      resizeObserver.disconnect()
    }
  }, [computeViewportMatrix])

  useEffect(() => {
    translationVecRef.current = { x: 0, y: 0 }
    computeViewportMatrix()
  }, [viewNonce, computeViewportMatrix])

  useEffect(() => {
    const overlayEl = magneticOverlayRef.current
    if (!fabricCanvas || !overlayEl) return
    return attachAlignmentGuides(fabricCanvas, overlayEl, () => activeScaleRef.current)
  }, [fabricCanvas])

  const handleAssetDrop = useCallback(
    async (ev: React.DragEvent) => {
      ev.preventDefault()
      const file = ev.dataTransfer.files[0]
      if (!file || !file.type.startsWith('image/') || !fabricCanvas) return
      const reader = new FileReader()
      reader.onload = async (loadEv) => {
        await addImageFromDataUrl(fabricCanvas, loadEv.target!.result as string)
      }
      reader.readAsDataURL(file)
    },
    [fabricCanvas],
  )

  return (
    <div
      ref={stageHostRef}
      onDrop={handleAssetDrop}
      onDragOver={(ev) => ev.preventDefault()}
      style={{
        flex: 1,
        background: 'var(--color-ink-950)',
        backgroundImage: 'radial-gradient(var(--color-ink-700) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        ref={matrixFrameRef}
        style={{
          position: 'relative',
          transformOrigin: 'center center',
          boxShadow: 'var(--shadow-canvas)',
          borderRadius: 2,
          flexShrink: 0,
        }}
      >
        <canvas ref={surfaceNodeRef} />
        {showGrid && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              backgroundImage:
                'linear-gradient(to right, rgba(6, 182, 212, 0.22) 1px, transparent 1px),' +
                'linear-gradient(to bottom, rgba(6, 182, 212, 0.22) 1px, transparent 1px),' +
                'linear-gradient(to right, rgba(6, 182, 212, 0.08) 1px, transparent 1px),' +
                'linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px)',
              backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
            }}
          />
        )}
        <div
          ref={magneticOverlayRef}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />
      </div>

      {/* ── Floating Stage Quick-Action HUD ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 25,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 10px',
          borderRadius: '0.625rem',
          background: 'rgba(13, 15, 23, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--color-base-600)',
          boxShadow: '0 10px 28px rgba(8, 9, 14, 0.75)',
          userSelect: 'none',
        }}
      >
        <button
          onClick={() => useEditorStore.getState().setViewZoom(viewZoom / 1.2)}
          title="Zoom Out"
          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', padding: 3 }}
        >
          <ZoomOut size={13} />
        </button>
        <span
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: '#F8FAFC',
            fontWeight: 600,
            minWidth: 40,
            textAlign: 'center',
          }}
        >
          {Math.round(fitScale * viewZoom * 100)}%
        </span>
        <button
          onClick={() => useEditorStore.getState().setViewZoom(viewZoom * 1.2)}
          title="Zoom In"
          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', padding: 3 }}
        >
          <ZoomIn size={13} />
        </button>
        <button
          onClick={() => useEditorStore.getState().resetView()}
          title="Fit Artboard to Viewport"
          style={{ background: 'none', border: 'none', color: '#06B6D4', cursor: 'pointer', display: 'flex', padding: 3 }}
        >
          <Maximize2 size={12} />
        </button>

        <div style={{ width: 1, height: 14, background: 'var(--color-base-600)', margin: '0 2px' }} />

        <button
          onClick={() => useEditorStore.getState().toggleGrid()}
          title="Toggle Coordinate Grid (⌘')"
          style={{
            height: 24,
            padding: '0 8px',
            borderRadius: 5,
            border: 'none',
            background: showGrid ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
            color: showGrid ? '#22D3EE' : '#94A3B8',
            fontSize: 10.5,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
          }}
        >
          <Grid3x3 size={12} />
          <span>Grid</span>
        </button>

        <button
          onClick={() => fabricCanvas && optimizeStageGeometry(fabricCanvas)}
          title="Optimize Sub-Pixel Geometry (Shift+O)"
          style={{
            height: 24,
            padding: '0 8px',
            borderRadius: 5,
            border: 'none',
            background: 'transparent',
            color: '#94A3B8',
            fontSize: 10.5,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
          }}
        >
          <Wand2 size={12} color="#06B6D4" />
          <span>Optimize</span>
        </button>

        <button
          onClick={() => fabricCanvas && auditAndHealCanvasContrast(fabricCanvas, true)}
          title="WCAG AAA Contrast Auto-Healer (Shift+H)"
          style={{
            height: 24,
            padding: '0 8px',
            borderRadius: 5,
            border: 'none',
            background: 'transparent',
            color: '#94A3B8',
            fontSize: 10.5,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
          }}
        >
          <Eye size={12} color="#10B981" />
          <span>Heal Contrast</span>
        </button>
      </div>
    </div>
  )
}
