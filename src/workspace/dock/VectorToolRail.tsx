/**
 * LernexAI Proprietary — Dual-Rail Collapsible Left Creation Dock
 * Combines a 64px Primary Icon Rail with a 308px Slide-In / Slide-Out Creation Drawer.
 */
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
  FolderKanban,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  BarChart3,
  Box,
  QrCode,
} from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { useEditorStore, type LeftDrawerTab } from '@/store/editorStore'
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
import { TemplatePanel } from '@/workspace/inspector/BlueprintGalleryDeck'
import { StickerPanel } from '@/workspace/inspector/ParametricAssetVault'
import { QuantumLabPanel } from '@/workspace/inspector/QuantumShaderSuite'
import { ProjectsPanel } from '@/workspace/inspector/LocalVaultExplorer'
import type { ToolType } from '@/types'

const DRAWER_MODULES: {
  id: Exclude<LeftDrawerTab, null>
  label: string
  title: string
  subtitle: string
  icon: React.ReactNode
}[] = [
  {
    id: 'create',
    label: 'Create',
    title: 'Creation Studio',
    subtitle: 'Vectors, Typography, Shaders & Data-Viz',
    icon: <PlusSquare size={17} strokeWidth={1.75} />,
  },
  {
    id: 'blueprints',
    label: 'Presets',
    title: 'Quantum Blueprints',
    subtitle: 'Multi-category editable stage layouts',
    icon: <LayoutTemplate size={17} strokeWidth={1.75} />,
  },
  {
    id: 'vectors',
    label: 'Vectors',
    title: 'Parametric Asset Vault',
    subtitle: 'Polygons, 3D Cubes, Guilloche, QR & Glyphs',
    icon: <Shapes size={17} strokeWidth={1.75} />,
  },
  {
    id: 'quantum',
    label: 'Quantum',
    title: '15-Engine Quantum Lab',
    subtitle: 'CSS Compiler, Smart Reflow & AES-256 Vault',
    icon: <Zap size={17} strokeWidth={1.75} />,
  },
  {
    id: 'vault',
    label: 'Vault',
    title: 'Local Project Vault',
    subtitle: 'IndexedDB persistent workspaces',
    icon: <FolderKanban size={17} strokeWidth={1.75} />,
  },
]

export function Toolbar() {
  const { activeTool, setActiveTool, leftDrawerTab, toggleLeftDrawer, setLeftDrawerTab } =
    useEditorStore()
  const canvas = useFabricCanvas()

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
  }

  const activeModuleMeta = DRAWER_MODULES.find((m) => m.id === leftDrawerTab)

  return (
    <div style={{ display: 'flex', height: '100%', flexShrink: 0, position: 'relative', zIndex: 30 }}>
      {/* ── Primary 64px Vertical Studio Rail ── */}
      <aside
        style={{
          width: 64,
          background: '#0D0F17',
          borderRight: '1px solid var(--color-base-600)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px 6px',
          gap: 6,
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        {/* Slide-Out Drawer Module Triggers */}
        {DRAWER_MODULES.map((mod) => {
          const isOpen = leftDrawerTab === mod.id
          return (
            <button
              key={mod.id}
              onClick={() => toggleLeftDrawer(mod.id)}
              title={`${mod.title} (Click to toggle drawer)`}
              style={{
                width: 52,
                height: 48,
                borderRadius: '0.625rem',
                border: isOpen ? '1px solid rgba(6, 182, 212, 0.45)' : '1px solid transparent',
                background: isOpen ? 'rgba(6, 182, 212, 0.14)' : 'transparent',
                color: isOpen ? '#22D3EE' : '#94A3B8',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                cursor: 'pointer',
                transition: 'all 140ms ease',
                position: 'relative',
              }}
            >
              {isOpen && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 10,
                    bottom: 10,
                    width: 3,
                    borderRadius: '0 3px 3px 0',
                    background: 'linear-gradient(180deg, #06B6D4, #14B8A6)',
                  }}
                />
              )}
              {mod.icon}
              <span style={{ fontSize: 9.5, fontWeight: isOpen ? 700 : 600, letterSpacing: '0.01em' }}>
                {mod.label}
              </span>
            </button>
          )
        })}

        <div style={{ width: 34, height: 1, background: 'var(--color-base-600)', margin: '4px 0' }} />

        {/* Direct Stage Cursor & Drawing Tools */}
        <Tooltip content="Select & Transform" shortcut="V" side="right">
          <button
            onClick={() => activateStageTool('select')}
            style={{
              width: 44,
              height: 36,
              borderRadius: '0.5rem',
              border: activeTool === 'select' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
              background: activeTool === 'select' ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
              color: activeTool === 'select' ? '#06B6D4' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <MousePointer2 size={16} />
          </button>
        </Tooltip>

        <Tooltip content="Freehand Brush" shortcut="P" side="right">
          <button
            onClick={() => activateStageTool('pencil')}
            style={{
              width: 44,
              height: 36,
              borderRadius: '0.5rem',
              border: activeTool === 'pencil' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
              background: activeTool === 'pencil' ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
              color: activeTool === 'pencil' ? '#06B6D4' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <PenLine size={16} />
          </button>
        </Tooltip>

        <Tooltip content="Upload Image Asset" shortcut="I" side="right">
          <button
            onClick={triggerImageUpload}
            style={{
              width: 44,
              height: 36,
              borderRadius: '0.5rem',
              border: '1px solid transparent',
              background: 'transparent',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Image size={16} />
          </button>
        </Tooltip>

        {/* Bottom Slide-In / Slide-Out Toggle Button */}
        <div style={{ marginTop: 'auto', paddingTop: 6 }}>
          <Tooltip
            content={leftDrawerTab ? 'Collapse Left Sidebar' : 'Expand Left Sidebar'}
            side="right"
          >
            <button
              onClick={() =>
                setLeftDrawerTab(leftDrawerTab ? null : 'create')
              }
              aria-label="Toggle Left Sidebar Drawer"
              style={{
                width: 44,
                height: 38,
                borderRadius: '0.5rem',
                border: '1px solid var(--color-base-600)',
                background: '#11141C',
                color: leftDrawerTab ? '#06B6D4' : '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {leftDrawerTab ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>
          </Tooltip>
        </div>
      </aside>

      {/* ── Collapsible Slide-Out Feature Drawer (308px) ── */}
      <AnimatePresence initial={false}>
        {leftDrawerTab && (
          <motion.section
            key="left-slide-drawer"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 308, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: '#0D0F17',
              borderRight: '1px solid var(--color-base-600)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {/* Drawer Header with Collapse Button */}
            <div
              style={{
                padding: '12px 14px 10px',
                borderBottom: '1px solid var(--color-base-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#11141C',
                flexShrink: 0,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC', lineHeight: 1.2 }}>
                  {activeModuleMeta?.title}
                </div>
                <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>
                  {activeModuleMeta?.subtitle}
                </div>
              </div>
              <button
                onClick={() => setLeftDrawerTab(null)}
                title="Slide sidebar inside"
                style={{
                  height: 26,
                  padding: '0 8px',
                  borderRadius: 6,
                  background: '#1A1E2A',
                  border: '1px solid var(--color-base-600)',
                  color: '#94A3B8',
                  fontSize: 10.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  flexShrink: 0,
                }}
              >
                <PanelLeftClose size={12} />
                <span>Hide</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', width: 308 }}>
              {leftDrawerTab === 'create' && (
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* 1. Vector Shapes & Primitives */}
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#94A3B8',
                        marginBottom: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>01. Vector Primitives</span>
                      <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                        1-Click Insert
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                      {[
                        { label: 'Rectangle', key: 'R', icon: <Square size={15} />, run: () => activateStageTool('rect') },
                        { label: 'Circle', key: 'C', icon: <Circle size={15} />, run: () => activateStageTool('circle') },
                        { label: 'Triangle', key: '△', icon: <Triangle size={15} />, run: () => activateStageTool('triangle') },
                        { label: 'Line', key: 'L', icon: <Minus size={15} />, run: () => activateStageTool('line') },
                        { label: 'Arrow', key: '→', icon: <ArrowRight size={15} />, run: () => activateStageTool('arrow') },
                        { label: '3D Cube', key: '⇧I', icon: <Box size={15} />, run: () => canvas && addIsometricCube(canvas) },
                        { label: 'Vector QR', key: '⇧Q', icon: <QrCode size={15} />, run: () => canvas && addVectorQrBadge(canvas, 'https://lernexai.com') },
                        { label: 'Freehand', key: 'P', icon: <PenLine size={15} />, run: () => activateStageTool('pencil') },
                        { label: 'Upload Img', key: 'I', icon: <Image size={15} />, run: triggerImageUpload },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={item.run}
                          className="btn-base"
                          style={{
                            height: 54,
                            flexDirection: 'column',
                            gap: 4,
                            padding: '6px 4px',
                            fontSize: 10.5,
                          }}
                        >
                          <span style={{ color: '#06B6D4' }}>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Typography Hierarchy Stack */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>
                      02. Typography Hierarchy
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <button
                        onClick={() =>
                          insertPresetTypography(
                            'QUANTUM HEADLINE',
                            56,
                            'Plus Jakarta Sans',
                            '800',
                            '#F8FAFC',
                            'Hero Display Heading',
                          )
                        }
                        className="btn-base"
                        style={{
                          height: 40,
                          justifyContent: 'space-between',
                          padding: '0 12px',
                        }}
                      >
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#F8FAFC' }}>
                          Add Display Heading
                        </span>
                        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#06B6D4' }}>
                          56px Bold
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          insertPresetTypography(
                            'Editorial Serif Statement',
                            46,
                            'Playfair Display',
                            '700',
                            '#F8FAFC',
                            'Editorial Serif Heading',
                            true,
                          )
                        }
                        className="btn-base"
                        style={{
                          height: 38,
                          justifyContent: 'space-between',
                          padding: '0 12px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontFamily: 'Playfair Display, serif',
                            fontStyle: 'italic',
                            fontWeight: 700,
                            color: '#F8FAFC',
                          }}
                        >
                          Add Editorial Serif
                        </span>
                        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#14B8A6' }}>
                          46px Italic
                        </span>
                      </button>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        <button
                          onClick={() =>
                            insertPresetTypography(
                              'Section Subheading',
                              28,
                              'Plus Jakarta Sans',
                              '600',
                              '#CBD5E1',
                              'Subheading Layer',
                            )
                          }
                          className="btn-base"
                          style={{ height: 34, fontSize: 11.5 }}
                        >
                          <Type size={13} color="#06B6D4" /> Subheading
                        </button>
                        <button
                          onClick={() =>
                            insertPresetTypography(
                              'Clean body paragraph copy ready for your layout.',
                              18,
                              'Plus Jakarta Sans',
                              '400',
                              '#94A3B8',
                              'Body Text Layer',
                            )
                          }
                          className="btn-base"
                          style={{ height: 34, fontSize: 11.5 }}
                        >
                          <Type size={13} color="#14B8A6" /> Body Copy
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3. Parametric Text-on-Path */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>
                      03. Parametric Text-on-Path
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                      <button
                        onClick={() =>
                          canvas &&
                          addParametricTextOnPath(
                            canvas,
                            'COREX QUANTUM STUDIO • LERNEXAI • ',
                            'circle',
                            '#06B6D4',
                          )
                        }
                        className="btn-base"
                        style={{ height: 34, fontSize: 11 }}
                      >
                        ◎ Ring Seal
                      </button>
                      <button
                        onClick={() =>
                          canvas &&
                          addParametricTextOnPath(canvas, 'QUANTUM WAVE MOTION', 'wave', '#14B8A6')
                        }
                        className="btn-base"
                        style={{ height: 34, fontSize: 11 }}
                      >
                        〰 Sine Wave
                      </button>
                      <button
                        onClick={() =>
                          canvas &&
                          addParametricTextOnPath(canvas, 'LERNEXAI STUDIO', 'arch', '#F59E0B')
                        }
                        className="btn-base"
                        style={{ height: 34, fontSize: 11 }}
                      >
                        ⌒ Arch Crest
                      </button>
                    </div>
                  </div>

                  {/* 4. Data-Viz & Device Mockup Cards */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>
                      04. Data-Viz & Device Mockups
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      <button
                        onClick={() => canvas && addVectorDataVizWidget(canvas, 'kpi-card')}
                        className="btn-base"
                        style={{ height: 34, fontSize: 11 }}
                      >
                        <BarChart3 size={13} color="#10B981" /> KPI Metric Card
                      </button>
                      <button
                        onClick={() => canvas && addVectorDataVizWidget(canvas, 'bar-chart')}
                        className="btn-base"
                        style={{ height: 34, fontSize: 11 }}
                      >
                        <BarChart3 size={13} color="#06B6D4" /> Vector Bar Chart
                      </button>
                      <button
                        onClick={() => canvas && addVectorDataVizWidget(canvas, 'donut-ring')}
                        className="btn-base"
                        style={{ height: 34, fontSize: 11 }}
                      >
                        <Sparkles size={13} color="#14B8A6" /> Donut Progress
                      </button>
                      <button
                        onClick={() => canvas && addVectorDataVizWidget(canvas, 'macbook-window')}
                        className="btn-base"
                        style={{ height: 34, fontSize: 11 }}
                      >
                        <Square size={13} color="#F59E0B" /> Studio Window
                      </button>
                    </div>
                  </div>

                  {/* 5. Procedural Shader Backdrops */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>
                      05. Procedural Shader Backdrops
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      <button
                        onClick={() =>
                          canvas && void applyProceduralShaderBackground(canvas, 'aurora-plasma')
                        }
                        className="btn-base"
                        style={{ height: 34, fontSize: 11 }}
                      >
                        Aurora Plasma
                      </button>
                      <button
                        onClick={() =>
                          canvas && void applyProceduralShaderBackground(canvas, 'synthwave-grid')
                        }
                        className="btn-base"
                        style={{ height: 34, fontSize: 11 }}
                      >
                        Synthwave Grid
                      </button>
                      <button
                        onClick={() =>
                          canvas && void applyProceduralShaderBackground(canvas, 'quantum-mesh')
                        }
                        className="btn-base"
                        style={{ height: 34, fontSize: 11 }}
                      >
                        Quantum Mesh
                      </button>
                      <button
                        onClick={() =>
                          canvas && void applyProceduralShaderBackground(canvas, 'constellation')
                        }
                        className="btn-base"
                        style={{ height: 34, fontSize: 11 }}
                      >
                        Constellation
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {leftDrawerTab === 'blueprints' && <TemplatePanel />}
              {leftDrawerTab === 'vectors' && <StickerPanel />}
              {leftDrawerTab === 'quantum' && <QuantumLabPanel />}
              {leftDrawerTab === 'vault' && <ProjectsPanel />}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
