import { useEffect, useState, useCallback } from 'react'
import { QuantumColorSpectrum } from '@/components/ui/QuantumColorSpectrum'
import { IText, FabricObject, Group, ActiveSelection } from 'fabric'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import { useEditorStore } from '@/store/editorStore'
import { Slider } from '@/components/ui/Slider'
import { FONT_LIST, loadGoogleFont } from '@/data/fontList'
import { copyActive, pasteClipboard, moveZOrder } from '@/lib/clipboard'
import {
  NEUTRAL_ADJUSTMENTS, isImageObject, readAdjustments, applyAdjustments,
  type ImageAdjustments,
} from '@/lib/imageFilters'
import {
  BLEND_MODES, DEFAULT_GRADIENT, DEFAULT_SHADOW, buildGradient, buildShadow,
  isGradient, readGradient, readShadow,
  type FillMode, type GradientSpec, type ShadowSpec,
} from '@/lib/appearance'
import { copyStyle, pasteStyle } from '@/lib/style'
import {
  distributeSelection,
  removeImageBackgroundClient,
  applyImageLutPreset,
  generateDevModeCss,
} from '@/lib/vectorStudio'
import {
  applyProceduralShaderBackground,
  smartReflowCanvasToNewSize,
  optimizeStageGeometry,
  auditAndHealCanvasContrast,
  compileCanvasToReactTailwindJsx,
  compileCanvasToW3cDesignTokens,
} from '@/lib/quantumEngine'
import {
  AlignLeft, AlignCenter, AlignRight,
  AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  AlignHorizontalSpaceAround, AlignVerticalSpaceAround,
  BringToFront, SendToBack, MoveUp, MoveDown,
  Copy, Trash2, Group as GroupIcon, Ungroup,
  Bold, Italic, Underline, FlipHorizontal, FlipVertical, RotateCcw, Pipette, Paintbrush,
  Scissors, Code2, Check, Sparkles, Maximize2, Wand2, Eye, Zap, ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'

function ColorSwatch({ color, onChange, label }: { color: string; onChange: (c: string) => void; label?: string }) {
  const [open, setOpen] = useState(false)
  const safeColor = color && color !== 'transparent' ? color : '#000000'
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <span style={{ fontSize: 10.5, color: 'var(--color-base-400)', fontWeight: 600 }}>{label}</span>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => setOpen(!open)}
          aria-label={`Pick ${label || 'color'}`}
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background:
              color === 'transparent'
                ? 'repeating-conic-gradient(#ccc 0% 25%,#fff 0% 50%) 0 0/10px 10px'
                : color,
            border: 'none',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        />
        <input
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="input-base"
          style={{ flex: 1, fontSize: 11.5, fontFamily: 'var(--font-mono)', borderRadius: 10, height: 32 }}
        />
      </div>
      {open && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 0,
              zIndex: 500,
              padding: 12,
              background: '#121521',
              borderRadius: 16,
              boxShadow: 'var(--shadow-float)',
            }}
          >
            <QuantumColorSpectrum color={safeColor} onChange={onChange} />
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <button
                onClick={() => {
                  onChange('transparent')
                  setOpen(false)
                }}
                style={{
                  flex: 1,
                  height: 28,
                  background: '#181C2B',
                  border: 'none',
                  borderRadius: 8,
                  color: 'var(--color-base-300)',
                  fontSize: 10.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Transparent
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{
                  flex: 1,
                  height: 28,
                  background: 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#07080D',
                  fontSize: 10.5,
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                Done
              </button>
            </div>
          </div>
          <div style={{ position: 'fixed', inset: 0, zIndex: 499 }} onClick={() => setOpen(false)} />
        </>
      )}
    </div>
  )
}

function IconBtn({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      title={label}
      aria-label={label}
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        border: 'none',
        background: active ? 'rgba(6, 182, 212, 0.2)' : '#1C2234',
        color: active ? '#22D3EE' : '#94A3B8',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 120ms',
      }}
    >
      {icon}
    </motion.button>
  )
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        padding: 4,
        borderRadius: 12,
        background: '#0C0E16',
      }}
    >
      {options.map((o) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            style={{
              flex: 1,
              height: 28,
              borderRadius: 9,
              fontSize: 11,
              fontWeight: active ? 700 : 600,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 120ms',
              background: active ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
              color: active ? '#22D3EE' : '#94A3B8',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function ContextualPod({
  title,
  subtitle,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  subtitle?: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div style={{ padding: '4px 0' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isOpen ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
          border: 'none',
          borderRadius: 14,
          color: '#F8FAFC',
          fontSize: 12.5,
          fontWeight: 700,
          cursor: 'pointer',
          padding: '10px 12px',
          transition: 'background 150ms',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{title}</span>
          {subtitle && (
            <span style={{ fontSize: 11, fontWeight: 500, color: '#64748B' }}>{subtitle}</span>
          )}
        </div>
        <ChevronDown
          size={14}
          style={{
            color: '#64748B',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 160ms',
          }}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '14px 6px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FILL_MODES: { value: FillMode; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'linear', label: 'Linear' },
  { value: 'radial', label: 'Radial' },
]

// ── Gradient stop + angle editors ─────────────────────────────────────────────
function GradientFields({ spec, mode, onChange }: {
  spec: GradientSpec; mode: FillMode; onChange: (p: Partial<GradientSpec>) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <ColorSwatch label="Start" color={spec.from} onChange={c => onChange({ from: c })} />
        </div>
        <div style={{ flex: 1 }}>
          <ColorSwatch label="End" color={spec.to} onChange={c => onChange({ to: c })} />
        </div>
      </div>
      {mode === 'linear' && (
        <Slider label="Angle" value={spec.angle} min={0} max={359} step={1}
          onChange={v => onChange({ angle: v })} showValue unit="°" />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export function PropertiesPanel() {
  const canvas = useFabricCanvas()
  const { activeObjectId, syncLayersFromCanvas, snapshot, snapshotSoon, bgNonce } = useEditorStore()

  const [obj, setObj] = useState<FabricObject | null>(null)
  const [fillColor, setFillColor] = useState('#3C3C4E')
  const [fillMode, setFillMode] = useState<FillMode>('solid')
  const [grad, setGrad] = useState<GradientSpec>(DEFAULT_GRADIENT)
  const [strokeColor, setStrokeColor] = useState('transparent')
  const [strokeWidth, setStrokeWidth] = useState(0)
  const [opacity, setOpacity] = useState(100)
  const [blendMode, setBlendMode] = useState('source-over')
  const [flipX, setFlipX] = useState(false)
  const [flipY, setFlipY] = useState(false)
  const [rx, setRx] = useState(0)
  const [posX, setPosX] = useState(0)
  const [posY, setPosY] = useState(0)
  const [objW, setObjW] = useState(0)
  const [objH, setObjH] = useState(0)
  const [rotation, setRotation] = useState(0)
  // Text
  const [fontFamily, setFontFamily] = useState('Plus Jakarta Sans')
  const [fontSize, setFontSize] = useState(32)
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [underline, setUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left')
  const [lineHeight, setLineHeight] = useState(1.2)
  const [charSpacing, setCharSpacing] = useState(0)
  // Image adjustments
  const [adj, setAdj] = useState<ImageAdjustments>(NEUTRAL_ADJUSTMENTS)
  // Shadow
  const [shadow, setShadow] = useState<ShadowSpec>(DEFAULT_SHADOW)
  const [hasShadow, setHasShadow] = useState(false)
  const [styleStored, setStyleStored] = useState(false)
  const [cssCopied, setCssCopied] = useState(false)
  const [openPod, setOpenPod] = useState<string | null>('appearance')
  const togglePod = (id: string) => setOpenPod((prev) => (prev === id ? null : id))
  // Canvas bg
  const [bgColor, setBgColor] = useState('#ffffff')
  const [bgMode, setBgMode] = useState<FillMode>('solid')
  const [bgGrad, setBgGrad] = useState<GradientSpec>({ ...DEFAULT_GRADIENT, from: '#F43F5E', to: '#1E1E28' })

  // Sync from active object
  useEffect(() => {
    if (!canvas) return
    const active = canvas.getActiveObject()
    setObj(active || null)
    setAdj(isImageObject(active) ? readAdjustments(active) : NEUTRAL_ADJUSTMENTS)
    if (!active) return

    if (isGradient(active.fill)) {
      setFillMode(active.fill.type === 'radial' ? 'radial' : 'linear')
      setGrad(readGradient(active.fill))
    } else {
      setFillMode('solid')
      setFillColor((active.fill as string) || '#3C3C4E')
    }
    setStrokeColor((active.stroke as string) || 'transparent')
    setStrokeWidth(active.strokeWidth || 0)
    setOpacity(Math.round((active.opacity ?? 1) * 100))
    setBlendMode(active.globalCompositeOperation || 'source-over')
    setFlipX(!!active.flipX)
    setFlipY(!!active.flipY)
    setHasShadow(!!active.shadow)
    if (active.shadow) setShadow(readShadow(active))
    setRx((active as any).rx || 0)
    setPosX(Math.round(active.left || 0))
    setPosY(Math.round(active.top || 0))
    setObjW(Math.round((active.width || 0) * (active.scaleX || 1)))
    setObjH(Math.round((active.height || 0) * (active.scaleY || 1)))
    setRotation(Math.round(active.angle || 0))

    if (active.type === 'i-text' || active.type === 'text') {
      const t = active as IText
      setFontFamily(t.fontFamily || 'Plus Jakarta Sans')
      setFontSize(t.fontSize || 32)
      setBold(t.fontWeight === 'bold')
      setItalic(t.fontStyle === 'italic')
      setUnderline(t.underline || false)
      setTextAlign((t.textAlign as any) || 'left')
      setLineHeight(t.lineHeight || 1.2)
      setCharSpacing(t.charSpacing || 0)
    }
  }, [activeObjectId, canvas])

  useEffect(() => {
    if (!canvas) return
    const bg = (canvas as any).backgroundColor
    if (isGradient(bg)) {
      setBgMode(bg.type === 'radial' ? 'radial' : 'linear')
      setBgGrad(readGradient(bg))
    } else {
      setBgMode('solid')
      setBgColor((bg as string) || '#ffffff')
    }
  }, [canvas, bgNonce])

  const update = (props: Record<string, any>) => {
    const active = canvas?.getActiveObject()
    if (!active || !canvas) return
    active.set(props as any)
    active.dirty = true
    canvas.requestRenderAll()
    snapshotSoon()
  }

  const setAdjustment = (key: keyof ImageAdjustments, value: number) => {
    const active = canvas?.getActiveObject()
    if (!canvas || !isImageObject(active)) return
    const next = { ...adj, [key]: value }
    setAdj(next)
    applyAdjustments(active, next)
    canvas.requestRenderAll()
    snapshotSoon()
  }

  const applyFill = (mode: FillMode, spec: GradientSpec, solid: string) => {
    const active = canvas?.getActiveObject()
    if (!canvas || !active) return
    active.set({
      fill: mode === 'solid'
        ? solid
        : buildGradient(mode, spec, active.width || 100, active.height || 100),
    })
    active.dirty = true
    canvas.requestRenderAll()
    snapshotSoon()
  }

  const applyShadow = (spec: ShadowSpec) => {
    const active = canvas?.getActiveObject()
    if (!canvas || !active) return
    active.set({ shadow: buildShadow(spec) })
    active.dirty = true
    canvas.requestRenderAll()
    snapshotSoon()
  }

  const applyBackground = (mode: FillMode, spec: GradientSpec, solid: string) => {
    if (!canvas) return
    canvas.backgroundColor = mode === 'solid'
      ? solid
      : buildGradient(mode, spec, canvas.getWidth(), canvas.getHeight())
    canvas.requestRenderAll()
    snapshotSoon()
  }

  const patchShadow = (patch: Partial<ShadowSpec>) => {
    const next = { ...shadow, ...patch }
    setShadow(next)
    applyShadow(next)
  }

  const patchGradient = (patch: Partial<GradientSpec>) => {
    const next = { ...grad, ...patch }
    setGrad(next)
    applyFill(fillMode, next, fillColor)
  }

  const patchBgGradient = (patch: Partial<GradientSpec>) => {
    const next = { ...bgGrad, ...patch }
    setBgGrad(next)
    applyBackground(bgMode, next, bgColor)
  }

  const toggleShadow = () => {
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (!active) return
    if (hasShadow) {
      active.set({ shadow: null })
      active.dirty = true
      canvas.requestRenderAll()
      snapshotSoon()
      setHasShadow(false)
    } else {
      setHasShadow(true)
      applyShadow(shadow)
    }
  }

  const applyBlend = (value: string) => {
    const active = canvas?.getActiveObject()
    if (!canvas || !active) return
    setBlendMode(value)
    active.set({ globalCompositeOperation: value as any })
    active.dirty = true
    canvas.requestRenderAll()
    snapshotSoon()
  }

  const applyFlip = (axis: 'x' | 'y') => {
    const active = canvas?.getActiveObject()
    if (!canvas || !active) return
    const nextX = axis === 'x' ? !flipX : flipX
    const nextY = axis === 'y' ? !flipY : flipY
    setFlipX(nextX)
    setFlipY(nextY)
    active.set({ flipX: nextX, flipY: nextY })
    canvas.requestRenderAll()
    snapshotSoon()
  }

  const resetTransform = () => {
    const active = canvas?.getActiveObject()
    if (!canvas || !active) return
    setFlipX(false)
    setFlipY(false)
    setRotation(0)
    active.set({ angle: 0, flipX: false, flipY: false, scaleX: 1, scaleY: 1 })
    setObjW(Math.round(active.width || 0))
    setObjH(Math.round(active.height || 0))
    canvas.requestRenderAll()
    snapshot()
  }

  // Alignment helpers
  const alignH = (dir: 'left' | 'center' | 'right') => {
    const o = canvas?.getActiveObject()
    if (!o || !canvas) return
    const cw = canvas.getWidth()
    const bw = (o.width || 0) * (o.scaleX || 1)
    const newLeft = dir === 'left' ? 0 : dir === 'center' ? (cw - bw) / 2 : cw - bw
    o.set({ left: newLeft })
    canvas.requestRenderAll()
    snapshotSoon()
  }

  const alignV = (dir: 'top' | 'middle' | 'bottom') => {
    const o = canvas?.getActiveObject()
    if (!o || !canvas) return
    const ch = canvas.getHeight()
    const bh = (o.height || 0) * (o.scaleY || 1)
    const newTop = dir === 'top' ? 0 : dir === 'middle' ? (ch - bh) / 2 : ch - bh
    o.set({ top: newTop })
    canvas.requestRenderAll()
    snapshotSoon()
  }

  // Z-order
  const bringFront = () => canvas && moveZOrder(canvas, 'front')
  const sendBack   = () => canvas && moveZOrder(canvas, 'back')
  const bringFwd   = () => canvas && moveZOrder(canvas, 'forward')
  const sendBwd    = () => canvas && moveZOrder(canvas, 'backward')

  // Copy / Paste / Delete
  const copyObj = () => { if (canvas) void copyActive(canvas) }
  const pasteObj = () => { if (canvas) void pasteClipboard(canvas) }
  const copyStyleBtn = () => {
    const active = canvas?.getActiveObject()
    if (active && copyStyle(active)) setStyleStored(true)
  }
  const pasteStyleBtn = () => {
    const active = canvas?.getActiveObject()
    if (!canvas || !active || !pasteStyle(active)) return
    canvas.requestRenderAll()
    snapshotSoon()
  }
  const deleteObj = () => {
    const o = canvas?.getActiveObject()
    if (!o || !canvas) return
    canvas.remove(o)
    canvas.requestRenderAll()
    syncLayersFromCanvas()
  }

  // Group / Ungroup
  const groupObjs = () => {
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (active?.type === 'activeselection') {
      try {
        const grp = new Group((active as any).getObjects(), { canvas })
        ;(active as any).getObjects().forEach((o: any) => canvas.remove(o))
        canvas.add(grp)
        canvas.setActiveObject(grp)
        canvas.requestRenderAll()
        syncLayersFromCanvas()
      } catch (_) {}
    }
  }
  const ungroupObjs = () => {
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (active?.type === 'group') {
      const grp = active as Group
      const objs = grp.getObjects()
      canvas.remove(grp)
      objs.forEach((o: any) => {
        const t = grp.calcTransformMatrix()
        const m = (o as any).calcTransformMatrix()
        canvas.add(o)
      })
      canvas.requestRenderAll()
      syncLayersFromCanvas()
    }
  }

  const isText = obj?.type === 'i-text' || obj?.type === 'text'
  const isShape = obj && !isText && obj.type !== 'image'
  const isGroup = obj?.type === 'group'
  const isMulti = obj?.type === 'activeselection'
  const isImage = obj?.type === 'image'
  // A shared gradient on a multi-selection paints once per child, which reads as a bug.
  const canGradient = !!obj && !isGroup && !isMulti

  const fillEditor = canGradient ? (
    <>
      <Segmented value={fillMode} options={FILL_MODES}
        onChange={m => { setFillMode(m); applyFill(m, grad, fillColor) }} />
      {fillMode === 'solid' ? (
        <ColorSwatch color={fillColor} onChange={c => { setFillColor(c); applyFill('solid', grad, c) }} />
      ) : (
        <GradientFields spec={grad} mode={fillMode} onChange={patchGradient} />
      )}
    </>
  ) : (
    <ColorSwatch color={fillColor} onChange={c => { setFillColor(c); update({ fill: c }) }} />
  )

  return (
    <div
      style={{
        padding: '10px 18px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        overflowY: 'auto',
      }}
    >
      {/* ── Empty Selection: Open Visual Stage Flow (No Content Boxes) ── */}
      {!obj && (
        <>
          {/* 1. Ambient Shader Backdrops (Visual Gradient Thumbnails) */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 12, paddingLeft: 4 }}>
              Ambient Stage Shaders
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                {
                  id: 'aurora-plasma',
                  label: 'Aurora Plasma',
                  bg: 'radial-gradient(circle at 25% 25%, #06B6D4 0%, #14B8A6 45%, #07080D 100%)',
                },
                {
                  id: 'synthwave-grid',
                  label: 'Synthwave Grid',
                  bg: 'linear-gradient(180deg, #0F172A 0%, #831843 55%, #F43F5E 100%)',
                },
                {
                  id: 'quantum-mesh',
                  label: 'Quantum Waves',
                  bg: 'linear-gradient(135deg, #08090E 0%, #0891B2 50%, #2DD4BF 100%)',
                },
                {
                  id: 'constellation',
                  label: 'Starlight Mesh',
                  bg: 'radial-gradient(circle at 70% 30%, #38BDF8 0%, #1E1B4B 55%, #07080D 100%)',
                },
              ].map((sh) => (
                <button
                  key={sh.id}
                  onClick={() => canvas && void applyProceduralShaderBackground(canvas, sh.id as any)}
                  style={{
                    height: 70,
                    borderRadius: 18,
                    border: 'none',
                    background: sh.bg,
                    padding: 12,
                    display: 'flex',
                    alignItems: 'flex-end',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.32)',
                  }}
                >
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: '#F8FAFC',
                      textShadow: '0 2px 8px rgba(0,0,0,0.85)',
                    }}
                  >
                    {sh.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Contextual Custom Canvas Color / Gradient Pod */}
          <ContextualPod
            title="Custom Stage Fill"
            subtitle={bgMode}
            isOpen={openPod === 'bg-fill'}
            onToggle={() => togglePod('bg-fill')}
          >
            <Segmented
              value={bgMode}
              options={FILL_MODES}
              onChange={(m) => {
                setBgMode(m)
                applyBackground(m, bgGrad, bgColor)
              }}
            />
            {bgMode === 'solid' ? (
              <ColorSwatch
                color={bgColor}
                onChange={(c) => {
                  setBgColor(c)
                  applyBackground('solid', bgGrad, c)
                }}
              />
            ) : (
              <GradientFields spec={bgGrad} mode={bgMode} onChange={patchBgGradient} />
            )}
          </ContextualPod>

          {/* 3. Contextual Smart Aspect Ratio Reflow Pod */}
          <ContextualPod
            title="Smart Ratio Reflow"
            subtitle="Auto-scale layout"
            isOpen={openPod === 'reflow'}
            onToggle={() => togglePod('reflow')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { w: 1080, h: 1080, label: '1:1 Square', sub: '1080×1080' },
                { w: 1080, h: 1920, label: '9:16 Story', sub: '1080×1920' },
                { w: 1280, h: 720, label: '16:9 Video', sub: '1280×720' },
                { w: 1584, h: 396, label: '4:1 Banner', sub: '1584×396' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => canvas && smartReflowCanvasToNewSize(canvas, preset.w, preset.h)}
                  style={{
                    height: 48,
                    borderRadius: 12,
                    border: 'none',
                    background: '#1C2234',
                    color: '#F8FAFC',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 11.5, fontWeight: 700 }}>{preset.label}</span>
                  <span style={{ fontSize: 9.5, color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                    {preset.sub}
                  </span>
                </button>
              ))}
            </div>
          </ContextualPod>

          {/* 4. Quick Polish & Export Tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              onClick={() => canvas && optimizeStageGeometry(canvas)}
              style={{
                height: 44,
                borderRadius: 14,
                border: 'none',
                background: '#151927',
                color: '#E2E8F0',
                fontSize: 11.5,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <Wand2 size={14} color="#06B6D4" />
              <span>Optimize</span>
            </button>
            <button
              onClick={() => canvas && auditAndHealCanvasContrast(canvas, true)}
              style={{
                height: 44,
                borderRadius: 14,
                border: 'none',
                background: '#151927',
                color: '#E2E8F0',
                fontSize: 11.5,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <Eye size={14} color="#10B981" />
              <span>Heal Contrast</span>
            </button>
            <button
              onClick={() => {
                if (!canvas) return
                void navigator.clipboard?.writeText(compileCanvasToReactTailwindJsx(canvas))
                setCssCopied(true)
                setTimeout(() => setCssCopied(false), 1800)
              }}
              style={{
                height: 44,
                borderRadius: 14,
                border: 'none',
                background: '#151927',
                color: '#E2E8F0',
                fontSize: 11.5,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              {cssCopied ? <Check size={14} color="#10B981" /> : <Code2 size={14} color="#22D3EE" />}
              <span>{cssCopied ? 'Copied!' : 'Copy JSX'}</span>
            </button>
            <button
              onClick={() => useEditorStore.getState().setLeftDrawerTab('create')}
              style={{
                height: 44,
                borderRadius: 14,
                border: 'none',
                background: '#151927',
                color: '#E2E8F0',
                fontSize: 11.5,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <Zap size={14} color="#F59E0B" />
              <span>Add Elements</span>
            </button>
          </div>
        </>
      )}

      {/* ── Active Object Selected: Borderless Progressive-Disclosure Flow ── */}
      {obj && (
        <>
          {/* Quick Action Strip (Soft Tonal Flow, No Hard Box) */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 18,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
              <IconBtn icon={<AlignLeft size={14} />} label="Align Left" onClick={() => alignH('left')} />
              <IconBtn icon={<AlignCenter size={14} />} label="Align Center" onClick={() => alignH('center')} />
              <IconBtn icon={<AlignRight size={14} />} label="Align Right" onClick={() => alignH('right')} />
              <IconBtn icon={<AlignStartVertical size={14} />} label="Align Top" onClick={() => alignV('top')} />
              <IconBtn icon={<AlignCenterVertical size={14} />} label="Align Middle" onClick={() => alignV('middle')} />
              <IconBtn icon={<AlignEndVertical size={14} />} label="Align Bottom" onClick={() => alignV('bottom')} />
              <IconBtn icon={<BringToFront size={14} />} label="Bring to Front" onClick={bringFront} />
              <IconBtn icon={<SendToBack size={14} />} label="Send to Back" onClick={sendBack} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
              <IconBtn icon={<Copy size={14} />} label="Copy" onClick={copyObj} />
              <IconBtn icon={<Pipette size={14} />} label="Copy Style" onClick={copyStyleBtn} />
              <IconBtn icon={<Paintbrush size={14} />} label="Paste Style" onClick={pasteStyleBtn} active={styleStored} />
              <IconBtn icon={<FlipHorizontal size={14} />} label="Flip Horizontal" onClick={() => applyFlip('x')} active={flipX} />
              <IconBtn icon={<FlipVertical size={14} />} label="Flip Vertical" onClick={() => applyFlip('y')} active={flipY} />
              {isMulti && <IconBtn icon={<GroupIcon size={14} />} label="Group Selection" onClick={groupObjs} />}
              {isGroup && <IconBtn icon={<Ungroup size={14} />} label="Ungroup" onClick={ungroupObjs} />}
              <IconBtn icon={<Trash2 size={14} color="#FB7185" />} label="Delete Layer" onClick={deleteObj} />
            </div>
          </div>

          {/* Contextual Pod 1: Appearance, Fill & Opacity */}
          <ContextualPod
            title="Fill & Opacity"
            subtitle={`${opacity}%`}
            isOpen={openPod === 'appearance'}
            onToggle={() => togglePod('appearance')}
          >
            {(isShape || isGroup || isText) && fillEditor}
            <Slider
              label="Layer Opacity"
              value={opacity}
              min={0}
              max={100}
              onChange={(v) => {
                setOpacity(v)
                update({ opacity: v / 100 })
              }}
              showValue
              unit="%"
            />
          </ContextualPod>

          {/* Contextual Pod 2 (Text Only): Typography Studio */}
          {isText && (
            <ContextualPod
              title="Typography & Font"
              subtitle={fontFamily}
              isOpen={openPod === 'typography'}
              onToggle={() => togglePod('typography')}
            >
              <select
                value={fontFamily}
                onChange={async (e) => {
                  const f = e.target.value
                  setFontFamily(f)
                  await loadGoogleFont(f, canvas)
                  update({ fontFamily: f })
                }}
                style={{
                  height: 36,
                  background: '#0C0E16',
                  border: 'none',
                  borderRadius: 12,
                  color: 'var(--color-base-100)',
                  fontSize: 12,
                  padding: '0 12px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {FONT_LIST.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 10.5, color: 'var(--color-base-400)', fontWeight: 600 }}>Size</span>
                  <input
                    className="input-base"
                    type="number"
                    value={fontSize}
                    onChange={(e) => {
                      const v = +e.target.value
                      setFontSize(v)
                      update({ fontSize: v })
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 10.5, color: 'var(--color-base-400)', fontWeight: 600 }}>Spacing</span>
                  <input
                    className="input-base"
                    type="number"
                    value={charSpacing}
                    onChange={(e) => {
                      const v = +e.target.value
                      setCharSpacing(v)
                      update({ charSpacing: v })
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  {
                    label: 'Bold',
                    icon: <Bold size={13} />,
                    active: bold,
                    action: () => {
                      const n = !bold
                      setBold(n)
                      update({ fontWeight: n ? 'bold' : 'normal' })
                    },
                  },
                  {
                    label: 'Italic',
                    icon: <Italic size={13} />,
                    active: italic,
                    action: () => {
                      const n = !italic
                      setItalic(n)
                      update({ fontStyle: n ? 'italic' : 'normal' })
                    },
                  },
                  {
                    label: 'Underline',
                    icon: <Underline size={13} />,
                    active: underline,
                    action: () => {
                      const n = !underline
                      setUnderline(n)
                      update({ underline: n })
                    },
                  },
                ].map(({ label, icon, active, action }) => (
                  <IconBtn key={label} icon={icon} label={label} onClick={action} active={active} />
                ))}
              </div>

              <Slider
                label="Line Height"
                value={lineHeight}
                min={0.8}
                max={3}
                step={0.05}
                onChange={(v) => {
                  setLineHeight(v)
                  update({ lineHeight: v })
                }}
                showValue
              />
            </ContextualPod>
          )}

          {/* Contextual Pod 2 (Image Only): Chroma Cutout, Visual LUTs & Filters */}
          {isImage && (
            <ContextualPod
              title="Image Cutout & Color Grading"
              subtitle="AI-free client engine"
              isOpen={openPod === 'image-lab'}
              onToggle={() => togglePod('image-lab')}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                <button
                  onClick={() => canvas && void removeImageBackgroundClient(canvas, 'corner', 48)}
                  className="btn-base"
                  style={{ height: 34, background: '#1C2234', fontSize: 11 }}
                >
                  <Scissors size={12} color="#06B6D4" /> Auto Cut
                </button>
                <button
                  onClick={() => canvas && void removeImageBackgroundClient(canvas, 'light', 52)}
                  className="btn-base"
                  style={{ height: 34, background: '#1C2234', fontSize: 11 }}
                >
                  Cut White
                </button>
                <button
                  onClick={() => canvas && void removeImageBackgroundClient(canvas, 'dark', 52)}
                  className="btn-base"
                  style={{ height: 34, background: '#1C2234', fontSize: 11 }}
                >
                  Cut Dark
                </button>
              </div>

              {/* Visual Gradient LUT Swatches */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[
                  {
                    id: 'cyberpunk',
                    label: 'Cyberpunk',
                    bg: 'linear-gradient(135deg, #06B6D4 0%, #EC4899 100%)',
                  },
                  {
                    id: 'noir',
                    label: 'Noir Mono',
                    bg: 'linear-gradient(135deg, #0F172A 0%, #64748B 100%)',
                  },
                  {
                    id: 'cinema-gold',
                    label: 'Cinema Gold',
                    bg: 'linear-gradient(135deg, #78350F 0%, #F59E0B 100%)',
                  },
                  {
                    id: 'arctic',
                    label: 'Arctic Cool',
                    bg: 'linear-gradient(135deg, #0284C7 0%, #A5F3FC 100%)',
                  },
                ].map((lut) => (
                  <button
                    key={lut.id}
                    onClick={() => canvas && applyImageLutPreset(canvas, lut.id as any)}
                    style={{
                      height: 38,
                      borderRadius: 12,
                      border: 'none',
                      background: lut.bg,
                      color: '#F8FAFC',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      textShadow: '0 1px 6px rgba(0,0,0,0.8)',
                    }}
                  >
                    {lut.label}
                  </button>
                ))}
              </div>

              <Slider
                label="Brightness"
                value={Math.round(adj.brightness * 100)}
                min={-100}
                max={100}
                step={1}
                onChange={(v) => setAdjustment('brightness', v / 100)}
                showValue
              />
              <Slider
                label="Contrast"
                value={Math.round(adj.contrast * 100)}
                min={-100}
                max={100}
                step={1}
                onChange={(v) => setAdjustment('contrast', v / 100)}
                showValue
              />
              <Slider
                label="Saturation"
                value={Math.round(adj.saturation * 100)}
                min={-100}
                max={100}
                step={1}
                onChange={(v) => setAdjustment('saturation', v / 100)}
                showValue
              />
              <Slider
                label="Blur"
                value={Math.round(adj.blur * 100)}
                min={0}
                max={50}
                step={1}
                onChange={(v) => setAdjustment('blur', v / 100)}
                showValue
              />
            </ContextualPod>
          )}

          {/* Contextual Pod 3: Position, Dimensions & Angle */}
          <ContextualPod
            title="Dimensions & Position"
            subtitle={`${objW}×${objH}`}
            isOpen={openPod === 'transform'}
            onToggle={() => togglePod('transform')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'X Position', value: posX, key: 'left', set: setPosX },
                { label: 'Y Position', value: posY, key: 'top', set: setPosY },
              ].map(({ label, value, key, set }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 10.5, color: 'var(--color-base-400)', fontWeight: 600 }}>{label}</span>
                  <input
                    className="input-base"
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const v = +e.target.value
                      set(v)
                      update({ [key]: v })
                    }}
                  />
                </div>
              ))}
              {[
                { label: 'Width', value: objW, key: 'scaleX' },
                { label: 'Height', value: objH, key: 'scaleY' },
              ].map(({ label, value, key }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 10.5, color: 'var(--color-base-400)', fontWeight: 600 }}>{label}</span>
                  <input
                    className="input-base"
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const v = +e.target.value
                      const natural = key === 'scaleX' ? obj?.width || 1 : obj?.height || 1
                      if (v <= 0 || !natural) return
                      if (key === 'scaleX') setObjW(v)
                      else setObjH(v)
                      update({ [key]: v / natural })
                    }}
                  />
                </div>
              ))}
            </div>
            <Slider
              label="Rotation Angle"
              value={rotation}
              min={0}
              max={360}
              step={1}
              onChange={(v) => {
                setRotation(v)
                update({ angle: v })
              }}
              showValue
              unit="°"
            />
            <button
              onClick={resetTransform}
              className="btn-base"
              style={{ height: 34, background: '#1C2234', fontSize: 11.5 }}
            >
              <RotateCcw size={13} /> Reset Transform
            </button>
          </ContextualPod>

          {/* Contextual Pod 4 (Shapes): Stroke & Rounded Corners */}
          {(isShape || isGroup) && (
            <ContextualPod
              title="Border & Corner Rounding"
              subtitle={`${rx}px radius`}
              isOpen={openPod === 'stroke'}
              onToggle={() => togglePod('stroke')}
            >
              <ColorSwatch
                label="Border Color"
                color={strokeColor}
                onChange={(c) => {
                  setStrokeColor(c)
                  update({ stroke: c })
                }}
              />
              <Slider
                label="Border Thickness"
                value={strokeWidth}
                min={0}
                max={30}
                step={0.5}
                onChange={(v) => {
                  setStrokeWidth(v)
                  update({ strokeWidth: v })
                }}
                showValue
                unit="px"
              />
              <Slider
                label="Corner Rounding"
                value={rx}
                min={0}
                max={200}
                step={1}
                onChange={(v) => {
                  setRx(v)
                  update({ rx: v, ry: v })
                }}
                showValue
                unit="px"
              />
            </ContextualPod>
          )}

          {/* Contextual Pod 5: Drop Shadow & Blend Mode */}
          <ContextualPod
            title="Shadow & Blend Mode"
            subtitle={hasShadow ? 'Active' : 'Off'}
            isOpen={openPod === 'effects'}
            onToggle={() => togglePod('effects')}
          >
            <Segmented
              value={hasShadow ? 'on' : 'off'}
              options={[
                { value: 'on', label: 'Shadow On' },
                { value: 'off', label: 'Shadow Off' },
              ]}
              onChange={(v) => {
                if ((v === 'on') !== hasShadow) toggleShadow()
              }}
            />
            {hasShadow && (
              <>
                <ColorSwatch label="Shadow Color" color={shadow.color} onChange={(c) => patchShadow({ color: c })} />
                <Slider
                  label="Soft Blur"
                  value={shadow.blur}
                  min={0}
                  max={80}
                  step={1}
                  onChange={(v) => patchShadow({ blur: v })}
                  showValue
                  unit="px"
                />
                <Slider
                  label="Offset X"
                  value={shadow.offsetX}
                  min={-60}
                  max={60}
                  step={1}
                  onChange={(v) => patchShadow({ offsetX: v })}
                  showValue
                  unit="px"
                />
                <Slider
                  label="Offset Y"
                  value={shadow.offsetY}
                  min={-60}
                  max={60}
                  step={1}
                  onChange={(v) => patchShadow({ offsetY: v })}
                  showValue
                  unit="px"
                />
              </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
              <span style={{ fontSize: 10.5, color: 'var(--color-base-400)', fontWeight: 600 }}>Blend Mode</span>
              <select
                value={blendMode}
                onChange={(e) => applyBlend(e.target.value)}
                style={{
                  width: '100%',
                  height: 34,
                  background: '#0C0E16',
                  border: 'none',
                  borderRadius: 10,
                  color: 'var(--color-base-100)',
                  fontSize: 12,
                  padding: '0 10px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {BLEND_MODES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </ContextualPod>

          {/* Contextual Pod 6: Dev Mode CSS (Hidden until clicked!) */}
          <ContextualPod
            title="Inspect CSS Code"
            subtitle="Dev Mode"
            isOpen={openPod === 'css'}
            onToggle={() => togglePod('css')}
          >
            <pre
              style={{
                margin: 0,
                padding: 12,
                borderRadius: 12,
                background: '#0C0E16',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: '#A5F3FC',
                overflowX: 'auto',
                lineHeight: 1.55,
              }}
            >
              {generateDevModeCss(obj)}
            </pre>
            <button
              onClick={() => {
                void navigator.clipboard?.writeText(generateDevModeCss(obj))
                setCssCopied(true)
                setTimeout(() => setCssCopied(false), 1800)
              }}
              className="btn-primary btn-base"
              style={{ width: '100%', height: 34, borderRadius: 12, fontSize: 11.5 }}
            >
              {cssCopied ? <Check size={13} /> : <Code2 size={13} />}
              <span>{cssCopied ? 'Copied to Clipboard!' : 'Copy Layer CSS'}</span>
            </button>
          </ContextualPod>
        </>
      )}
    </div>
  )
}
