/**
 * LernexAI Proprietary — Unified Left Navigation Framework & Contextual Floating Windows
 * - Left Rail (64px): Direct Vector Tools + Floating Window Launchers
 * - Left Hierarchy Tree (264px): Classic industry-standard Layers & Project Pages tree
 * - Glassmorphic Floating Pop-Out Windows: Drop over the active workspace only when tapped
 */
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IText } from 'fabric'
import { nanoid } from 'nanoid'
import {
  MousePointer2,
  Square,
  Circle,
  Triangle,
  Minus,
  ArrowRight,
  PenLine,
  Type,
  Image,
  PlusSquare,
  LayoutTemplate,
  Shapes,
  Zap,
  Layers,
  FolderKanban,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Box,
  QrCode,
  X,
} from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { useEditorStore, type FloatingWindowType } from '@/store/editorStore'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import {
  addRect,
  addCircle,
  addTriangle,
  addLine,
  addArrow,
  addIText,
  enablePencil,
  disablePencil,
} from '@/lib/shapes'
import {
  addParametricTextOnPath,
  applyProceduralShaderBackground,
  addVectorDataVizWidget,
} from '@/lib/quantumEngine'
import { addIsometricCube, addVectorQrBadge } from '@/lib/vectorStudio'
import { LayersPanel } from '@/workspace/inspector/SceneNodeTree'
import { TemplatePanel } from '@/workspace/inspector/BlueprintGalleryDeck'
import { StickerPanel } from '@/workspace/inspector/ParametricAssetVault'
import { QuantumLabPanel } from '@/workspace/inspector/QuantumShaderSuite'
import { ProjectsPanel } from '@/workspace/inspector/LocalVaultExplorer'
import { AiChatPanel } from '@/components/ai/AiChatPanel'
import type { ToolType } from '@/types'

const SHADER_VISUAL_THUMBS = [
  {
    id: 'aurora-plasma',
    label: 'Aurora Plasma',
    gradient: 'radial-gradient(circle at 25% 25%, #06B6D4 0%, #14B8A6 45%, #07080D 100%)',
  },
  {
    id: 'synthwave-grid',
    label: 'Synthwave Horizon',
    gradient: 'linear-gradient(180deg, #0F172A 0%, #831843 55%, #F43F5E 100%)',
  },
  {
    id: 'quantum-mesh',
    label: 'Quantum Waves',
    gradient: 'linear-gradient(135deg, #08090E 0%, #0891B2 50%, #2DD4BF 100%)',
  },
  {
    id: 'constellation',
    label: 'Starlight Mesh',
    gradient: 'radial-gradient(circle at 70% 30%, #38BDF8 0%, #1E1B4B 55%, #07080D 100%)',
  },
] as const

const FLOATING_WINDOW_META: Record<
  Exclude<FloatingWindowType, null>,
  { title: string; subtitle: string; width: number }
> = {
  create: {
    title: 'Creative Elements & Shaders',
    subtitle: 'Tap any element to drop onto the canvas',
    width: 420,
  },
  blueprints: {
    title: 'Studio Blueprints',
    subtitle: 'Multi-layer starter compositions',
    width: 460,
  },
  vectors: {
    title: 'Parametric Vectors, QR & Glyphs',
    subtitle: 'Polygons, Guilloche meshes, QR matrix & icons',
    width: 420,
  },
  quantum: {
    title: 'Quantum Studio Engines',
    subtitle: 'Curve text, smart reflow, CSS compiler & AES vault',
    width: 420,
  },
  ai: {
    title: 'Autonomous AI Studio',
    subtitle: 'Copilot, Text-to-Design, Image AI & Design Doctor',
    width: 390,
  },
}

export function Toolbar() {
  const {
    activeTool,
    setActiveTool,
    isHierarchyOpen,
    toggleHierarchySidebar,
    leftSidebarView,
    setLeftSidebarView,
    activeFloatingWindow,
    setActiveFloatingWindow,
    toggleFloatingWindow,
    layers,
  } = useEditorStore()
  const canvas = useFabricCanvas()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeFloatingWindow) {
        setActiveFloatingWindow(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeFloatingWindow, setActiveFloatingWindow])

  const activateStageTool = (tool: ToolType) => {
    if (!canvas) return
    setActiveTool(tool)
    if (tool !== 'pencil') disablePencil(canvas)

    switch (tool) {
      case 'rect':
        addRect(canvas)
        setActiveTool('select')
        break
      case 'circle':
        addCircle(canvas)
        setActiveTool('select')
        break
      case 'triangle':
        addTriangle(canvas)
        setActiveTool('select')
        break
      case 'line':
        addLine(canvas)
        setActiveTool('select')
        break
      case 'arrow':
        addArrow(canvas)
        setActiveTool('select')
        break
      case 'text':
        addIText(canvas)
        setActiveTool('select')
        break
      case 'pencil':
        enablePencil(canvas)
        break
      case 'select':
        canvas.isDrawingMode = false
        break
    }
  }

  const triggerImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file || !canvas) return
      const { addImageFromDataUrl } = await import('@/lib/shapes')
      const reader = new FileReader()
      reader.onload = async (ev) => {
        await addImageFromDataUrl(canvas, ev.target!.result as string)
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const insertPresetTypography = (
    text: string,
    fontSize: number,
    fontFamily: string,
    fontWeight: string,
    fill: string,
    label: string,
    italic = false,
  ) => {
    if (!canvas) return
    const node = new IText(text, {
      left: Math.round(canvas.getWidth() * 0.5 - 160),
      top: Math.round(canvas.getHeight() * 0.5 - fontSize * 0.6),
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle: italic ? 'italic' : 'normal',
      fill,
      lineHeight: 1.1,
    })
    ;(node as any).__uid = `cx_txt_${nanoid(8)}`
    ;(node as any).corexLabel = label
    canvas.add(node)
    canvas.setActiveObject(node)
    canvas.requestRenderAll()
    useEditorStore.getState().snapshot()
    setActiveFloatingWindow(null)
  }

  const activeWindowMeta = activeFloatingWindow ? FLOATING_WINDOW_META[activeFloatingWindow] : null

  return (
    <div style={{ display: 'flex', height: '100%', flexShrink: 0, position: 'relative', zIndex: 30 }}>
      {/* ── 1. Leftmost Creative Tool Rail (64px, Borderless Tonal Surface) ── */}
      <aside
        style={{
          width: 64,
          background: '#0A0C13',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 8px',
          gap: 6,
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        {/* Direct Stage Cursor & Vector Primitives */}
        {[
          { id: 'select', label: 'Select', key: 'V', icon: <MousePointer2 size={17} /> },
          { id: 'rect', label: 'Rectangle', key: 'R', icon: <Square size={17} /> },
          { id: 'circle', label: 'Circle', key: 'C', icon: <Circle size={17} /> },
          { id: 'triangle', label: 'Triangle', key: '△', icon: <Triangle size={17} /> },
          { id: 'line', label: 'Line', key: 'L', icon: <Minus size={17} /> },
          { id: 'text', label: 'Text', key: 'T', icon: <Type size={17} /> },
          { id: 'pencil', label: 'Brush', key: 'P', icon: <PenLine size={17} /> },
        ].map((tool) => {
          const isSelected = activeTool === tool.id
          return (
            <Tooltip key={tool.id} content={tool.label} shortcut={tool.key} side="right">
              <button
                onClick={() => activateStageTool(tool.id as ToolType)}
                style={{
                  width: 44,
                  height: 40,
                  borderRadius: 14,
                  border: 'none',
                  background: isSelected ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
                  color: isSelected ? '#22D3EE' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 140ms',
                }}
              >
                {tool.icon}
              </button>
            </Tooltip>
          )
        })}

        <Tooltip content="Upload Media" shortcut="I" side="right">
          <button
            onClick={triggerImageUpload}
            style={{
              width: 44,
              height: 40,
              borderRadius: 14,
              border: 'none',
              background: 'transparent',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Image size={17} />
          </button>
        </Tooltip>

        {/* Contextual Floating Pop-Out Window Launchers */}
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            padding: 5,
            borderRadius: 18,
            background: '#111522',
          }}
        >
          {[
            { id: 'create', label: 'Creative Elements', icon: <PlusSquare size={17} />, color: '#06B6D4' },
            { id: 'blueprints', label: 'Studio Blueprints', icon: <LayoutTemplate size={17} />, color: '#22D3EE' },
            { id: 'vectors', label: 'Vectors, QR & Glyphs', icon: <Shapes size={17} />, color: '#14B8A6' },
            { id: 'quantum', label: 'Quantum Lab', icon: <Zap size={17} />, color: '#F59E0B' },
            { id: 'ai', label: 'AI Studio Copilot', icon: <Sparkles size={17} />, color: '#38BDF8' },
          ].map((pop) => {
            const isOpen = activeFloatingWindow === pop.id
            return (
              <Tooltip key={pop.id} content={pop.label} side="right">
                <button
                  onClick={() => toggleFloatingWindow(pop.id as Exclude<FloatingWindowType, null>)}
                  style={{
                    width: 40,
                    height: 38,
                    borderRadius: 13,
                    border: 'none',
                    background: isOpen ? 'rgba(6, 182, 212, 0.22)' : 'transparent',
                    color: isOpen ? '#22D3EE' : pop.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 150ms',
                  }}
                >
                  {pop.icon}
                </button>
              </Tooltip>
            )
          })}
        </div>

        {/* Toggle Left Hierarchy Tree */}
        <div style={{ marginTop: 'auto' }}>
          <Tooltip
            content={isHierarchyOpen ? 'Hide Layers Tree' : 'Show Layers Tree'}
            side="right"
          >
            <button
              onClick={toggleHierarchySidebar}
              style={{
                width: 44,
                height: 40,
                borderRadius: 14,
                border: 'none',
                background: '#111522',
                color: isHierarchyOpen ? '#22D3EE' : '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isHierarchyOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>
          </Tooltip>
        </div>
      </aside>

      {/* ── 2. Classic Left Scene Hierarchy & Pages Tree (260px, Borderless Tonal Flow) ── */}
      <AnimatePresence initial={false}>
        {isHierarchyOpen && (
          <motion.section
            key="left-hierarchy-tree"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: '#0D101A',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {/* Soft Segmented Switcher: Layers vs Saved Workspaces */}
            <div style={{ padding: '14px 14px 8px', width: 260, flexShrink: 0 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 4,
                  padding: 4,
                  borderRadius: 14,
                  background: '#141826',
                }}
              >
                <button
                  onClick={() => setLeftSidebarView('layers')}
                  style={{
                    height: 30,
                    borderRadius: 10,
                    border: 'none',
                    background:
                      leftSidebarView === 'layers' ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
                    color: leftSidebarView === 'layers' ? '#22D3EE' : '#94A3B8',
                    fontSize: 11.5,
                    fontWeight: leftSidebarView === 'layers' ? 700 : 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                >
                  <Layers size={13} />
                  <span>Layers</span>
                  {layers.length > 0 && (
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'var(--font-mono)',
                        color: leftSidebarView === 'layers' ? '#22D3EE' : '#64748B',
                      }}
                    >
                      {layers.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setLeftSidebarView('vault')}
                  style={{
                    height: 30,
                    borderRadius: 10,
                    border: 'none',
                    background:
                      leftSidebarView === 'vault' ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
                    color: leftSidebarView === 'vault' ? '#22D3EE' : '#94A3B8',
                    fontSize: 11.5,
                    fontWeight: leftSidebarView === 'vault' ? 700 : 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                >
                  <FolderKanban size={13} />
                  <span>Projects</span>
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', width: 260 }}>
              {leftSidebarView === 'layers' ? <LayersPanel /> : <ProjectsPanel />}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── 3. Contextual Glassmorphic Floating Pop-Out Windows Over Active Workspace ── */}
      <AnimatePresence>
        {activeFloatingWindow && activeWindowMeta && (
          <>
            {/* Subtle click-away backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFloatingWindow(null)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 80,
                background: 'rgba(4, 6, 12, 0.25)',
              }}
            />

            <motion.div
              key={activeFloatingWindow}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                top: 72,
                left: isHierarchyOpen ? 340 : 80,
                width: activeWindowMeta.width,
                maxHeight: 'calc(100vh - 116px)',
                zIndex: 90,
                background: 'rgba(15, 18, 29, 0.88)',
                backdropFilter: 'blur(28px) saturate(1.6)',
                borderRadius: 24,
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.65), 0 4px 20px rgba(6, 182, 212, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Floating Window Header */}
              <div
                style={{
                  padding: '18px 20px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexShrink: 0,
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', lineHeight: 1.2 }}>
                    {activeWindowMeta.title}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 3 }}>
                    {activeWindowMeta.subtitle}
                  </div>
                </div>
                <button
                  onClick={() => setActiveFloatingWindow(null)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: 'none',
                    color: '#CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Close window (Esc)"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Floating Window Body */}
              <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 16 }}>
                {activeFloatingWindow === 'create' && (
                  <div style={{ padding: '4px 20px 12px', display: 'flex', flexDirection: 'column', gap: 22 }}>
                    {/* Section 1: Ambient Shader Backdrops */}
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: '#94A3B8', marginBottom: 10 }}>
                        Ambient Shader Backdrops
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {SHADER_VISUAL_THUMBS.map((sw) => (
                          <button
                            key={sw.id}
                            onClick={() => {
                              if (!canvas) return
                              void applyProceduralShaderBackground(canvas, sw.id)
                              setActiveFloatingWindow(null)
                            }}
                            style={{
                              height: 74,
                              borderRadius: 16,
                              border: 'none',
                              background: sw.gradient,
                              padding: 12,
                              display: 'flex',
                              alignItems: 'flex-end',
                              cursor: 'pointer',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
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
                              {sw.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Section 2: Typography & Path Text */}
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: '#94A3B8', marginBottom: 10 }}>
                        Typography & Curve Text
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <button
                          onClick={() =>
                            insertPresetTypography(
                              'STUDIO HEADLINE',
                              56,
                              'Plus Jakarta Sans',
                              '800',
                              '#F8FAFC',
                              'Display Heading',
                            )
                          }
                          style={{
                            height: 48,
                            borderRadius: 14,
                            border: 'none',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#F8FAFC',
                            fontSize: 13,
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          Display Heading
                        </button>
                        <button
                          onClick={() =>
                            insertPresetTypography(
                              'Editorial Serif',
                              46,
                              'Playfair Display',
                              '700',
                              '#F8FAFC',
                              'Editorial Serif',
                              true,
                            )
                          }
                          style={{
                            height: 48,
                            borderRadius: 14,
                            border: 'none',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#F8FAFC',
                            fontSize: 14,
                            fontFamily: 'Playfair Display, serif',
                            fontStyle: 'italic',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Editorial Serif
                        </button>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: 8,
                          marginTop: 8,
                        }}
                      >
                        {[
                          { label: '◎ Ring Seal', mode: 'circle' as const, color: '#06B6D4' },
                          { label: '〰 Sine Wave', mode: 'wave' as const, color: '#14B8A6' },
                          { label: '⌒ Arch Crest', mode: 'arch' as const, color: '#F59E0B' },
                        ].map((pt) => (
                          <button
                            key={pt.label}
                            onClick={() => {
                              if (!canvas) return
                              addParametricTextOnPath(
                                canvas,
                                'COREX QUANTUM STUDIO • ',
                                pt.mode,
                                pt.color,
                              )
                              setActiveFloatingWindow(null)
                            }}
                            style={{
                              height: 40,
                              borderRadius: 12,
                              border: 'none',
                              background: 'rgba(255, 255, 255, 0.05)',
                              color: '#E2E8F0',
                              fontSize: 11.5,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            {pt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Section 3: Data-Viz, 3D & QR */}
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: '#94A3B8', marginBottom: 10 }}>
                        Charts, 3D & Smart Objects
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                        {[
                          {
                            label: 'KPI Card',
                            run: () => canvas && addVectorDataVizWidget(canvas, 'kpi-card'),
                          },
                          {
                            label: 'Bar Chart',
                            run: () => canvas && addVectorDataVizWidget(canvas, 'bar-chart'),
                          },
                          {
                            label: 'Donut Ring',
                            run: () => canvas && addVectorDataVizWidget(canvas, 'donut-ring'),
                          },
                          {
                            label: 'Browser Frame',
                            run: () => canvas && addVectorDataVizWidget(canvas, 'macbook-window'),
                          },
                          {
                            label: '3D Cube',
                            run: () => canvas && addIsometricCube(canvas),
                          },
                          {
                            label: 'Vector QR',
                            run: () => canvas && addVectorQrBadge(canvas, 'https://lernexai.com'),
                          },
                        ].map((item) => (
                          <button
                            key={item.label}
                            onClick={() => {
                              item.run()
                              setActiveFloatingWindow(null)
                            }}
                            style={{
                              height: 44,
                              borderRadius: 14,
                              border: 'none',
                              background: 'rgba(255, 255, 255, 0.05)',
                              color: '#E2E8F0',
                              fontSize: 11.5,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeFloatingWindow === 'blueprints' && <TemplatePanel />}
                {activeFloatingWindow === 'vectors' && <StickerPanel />}
                {activeFloatingWindow === 'quantum' && <QuantumLabPanel />}
                {activeFloatingWindow === 'ai' && (
                  <div style={{ height: 520 }}>
                    <AiChatPanel />
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
