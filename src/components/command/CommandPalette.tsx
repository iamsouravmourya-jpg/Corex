/**
 * LernexAI Proprietary — Quantum Omnibar Command Palette (⌘K / Ctrl+K)
 * Borderless soft rounded-3xl surface with 24+ instant vector, shader, CSG, and compiler actions.
 */
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Sparkles,
  Shapes,
  Palette,
  Download,
  AlignCenter,
  QrCode,
  Wand2,
  Grid,
  Scissors,
  Box,
  Compass,
  Layers,
  Code2,
  X,
} from 'lucide-react'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import { useEditorStore } from '@/store/editorStore'
import {
  addStarPolygon,
  addRegularPolygon,
  addIsometricCube,
  addProceduralMesh,
  addVectorQrBadge,
  distributeSelection,
  removeImageBackgroundClient,
  applyImageLutPreset,
  addSuperformulaVector,
  addLissajousCurve,
} from '@/lib/vectorStudio'
import {
  applyProceduralShaderBackground,
  applyVectorBooleanOperation,
  extrudeActiveNode3D,
  compileCanvasToStandaloneHtml,
} from '@/lib/quantumEngine'
import { createAgenticBlueprintPlan } from '@/lib/agenticPlanner'
import { runCorexBotSequence } from '@/workspace/bot/CorexBotSequencer'
import { exportCanvas, dispatchBinaryDownload } from '@/lib/export'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

interface StudioCommand {
  id: string
  category: 'Vector Lab' | 'GLSL & CSG' | 'Color Themes' | 'Smart Align' | 'Image & AI' | 'Studio Export'
  title: string
  subtitle: string
  shortcut?: string
  icon: React.ReactNode
  run: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const canvas = useFabricCanvas()
  const { toggleGrid, toggleAiMode, currentProjectName, snapshot, bumpBgNonce } = useEditorStore()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
    }
  }, [open])

  const applyThemePalette = (bg: string, primary: string, secondary: string, textCol: string) => {
    if (!canvas) return
    canvas.backgroundColor = bg
    const objs = canvas.getObjects()
    objs.forEach((o, idx) => {
      if (o.type === 'i-text' || o.type === 'text') {
        o.set({ fill: idx === 0 ? primary : textCol })
      } else if (o.type !== 'image') {
        o.set({ fill: idx % 2 === 0 ? primary : secondary })
      }
    })
    canvas.requestRenderAll()
    bumpBgNonce()
    snapshot()
  }

  const commands: StudioCommand[] = useMemo(
    () => [
      {
        id: 'corex-bot-autopaint',
        category: 'Image & AI',
        title: 'Launch 60FPS Autonomous Corex Bot (Auto-Paint Stage)',
        subtitle: 'Live robotic cursor draws GLSL shader, bento pods, vault cutout & typewriter text',
        icon: <Sparkles size={15} color="#22D3EE" />,
        run: () => {
          const store = useEditorStore.getState()
          const plan = createAgenticBlueprintPlan(
            'Create a viral tech YT Thumbnail with a dark ink vibe',
            store.canvasSize,
            false,
          )
          store.setBlueprintPlan(plan)
          void runCorexBotSequence(plan, { clearExistingCanvas: true })
        },
      },
      {
        id: 'glsl-aurora',
        category: 'GLSL & CSG',
        title: 'Compile WebGL2 Aurora Plasma Fragment Shader',
        subtitle: '5-Octave Domain-Warped FBM GPU shader (#version 300 es)',
        shortcut: '⇧M',
        icon: <Sparkles size={15} color="#22D3EE" />,
        run: () => canvas && void applyProceduralShaderBackground(canvas, 'aurora-plasma'),
      },
      {
        id: 'csg-union',
        category: 'GLSL & CSG',
        title: 'Synthesize CSG Boolean Union Contour',
        subtitle: 'Constructive Solid Geometry metaball vector union',
        icon: <Layers size={15} color="#14B8A6" />,
        run: () => canvas && applyVectorBooleanOperation(canvas, 'union'),
      },
      {
        id: 'csg-subtract',
        category: 'GLSL & CSG',
        title: 'Synthesize CSG Boolean Subtract Portal',
        subtitle: 'Constructive Solid Geometry crescent punch vector',
        icon: <Layers size={15} color="#06B6D4" />,
        run: () => canvas && applyVectorBooleanOperation(canvas, 'subtract'),
      },
      {
        id: 'extrude-3d',
        category: 'GLSL & CSG',
        title: '3D Axonometric Extrude Selected Node',
        subtitle: 'Synthesize 12-layer isometric relief stack on active node',
        icon: <Box size={15} color="#22D3EE" />,
        run: () => canvas && void extrudeActiveNode3D(canvas, 12),
      },
      {
        id: 'math-superformula',
        category: 'Vector Lab',
        title: 'Generate Gielis Superformula Parametric Star (m=8)',
        subtitle: 'Polar mathematical harmonic curve r(θ) vector path',
        icon: <Compass size={15} color="#06B6D4" />,
        run: () => canvas && addSuperformulaVector(canvas, 8, 0.3, 1.7, 1.7),
      },
      {
        id: 'math-lissajous',
        category: 'Vector Lab',
        title: 'Generate Lissajous Harmonic Wave (3:4 Ratio)',
        subtitle: 'Parametric phase-locked harmonic oscillation curve',
        icon: <Compass size={15} color="#14B8A6" />,
        run: () => canvas && addLissajousCurve(canvas, 3, 4, 90),
      },
      {
        id: 'vec-star-8',
        category: 'Vector Lab',
        title: 'Insert 8-Point Starburst Seal',
        subtitle: 'Parametric geometric vector seal on active stage',
        shortcut: '★',
        icon: <Shapes size={15} color="#06B6D4" />,
        run: () => canvas && addStarPolygon(canvas, 8, 95, 48, '#06B6D4', '8-Point Star Seal'),
      },
      {
        id: 'vec-hex',
        category: 'Vector Lab',
        title: 'Insert Precision Hexagon',
        subtitle: '6-sided regular vector polygon',
        shortcut: '⬢',
        icon: <Shapes size={15} color="#14B8A6" />,
        run: () => canvas && addRegularPolygon(canvas, 6, 86, '#14B8A6', 'Hexagon Node'),
      },
      {
        id: 'vec-cube',
        category: 'Vector Lab',
        title: 'Insert 3D Isometric Cube',
        subtitle: 'Multi-face shaded isometric vector block',
        shortcut: '⇧I',
        icon: <Box size={15} color="#06B6D4" />,
        run: () => canvas && addIsometricCube(canvas),
      },
      {
        id: 'vec-wave',
        category: 'Vector Lab',
        title: 'Generate Cyber Wave Mesh',
        subtitle: '12-layer parametric cubic bezier wave mesh',
        icon: <Wand2 size={15} color="#06B6D4" />,
        run: () => canvas && addProceduralMesh(canvas, 'cyber-wave'),
      },
      {
        id: 'vec-guilloche',
        category: 'Vector Lab',
        title: 'Generate Guilloche Spirograph Rosette',
        subtitle: 'Mathematical harmonic security pattern vector',
        icon: <Compass size={15} color="#14B8A6" />,
        run: () => canvas && addProceduralMesh(canvas, 'guilloche'),
      },
      {
        id: 'vec-golden',
        category: 'Vector Lab',
        title: 'Insert Golden Ratio Fibonacci Spiral',
        subtitle: '1:1.618 composition guide & harmonic arc overlay',
        icon: <Compass size={15} color="#F59E0B" />,
        run: () => canvas && addProceduralMesh(canvas, 'golden-spiral'),
      },
      {
        id: 'vec-qr',
        category: 'Vector Lab',
        title: 'Generate Scalable Vector QR Matrix Badge',
        subtitle: '100% client-side vector QR code group',
        shortcut: '⇧Q',
        icon: <QrCode size={15} color="#10B981" />,
        run: () => canvas && addVectorQrBadge(canvas, 'https://lernexai.com'),
      },
      {
        id: 'theme-ink-cyan',
        category: 'Color Themes',
        title: 'Apply LernexAI Deep Ink & Electric Cyan Theme',
        subtitle: 'Transforms canvas to #08090E ink with #06B6D4 & #14B8A6 accents',
        icon: <Palette size={15} color="#06B6D4" />,
        run: () => applyThemePalette('#08090E', '#06B6D4', '#14B8A6', '#F8FAFC'),
      },
      {
        id: 'theme-swiss',
        category: 'Color Themes',
        title: 'Apply Swiss Editorial High-Contrast Theme',
        subtitle: 'Crisp #F8FAFC paper with #08090E ink & #F43F5E accent',
        icon: <Palette size={15} color="#F43F5E" />,
        run: () => applyThemePalette('#F8FAFC', '#F43F5E', '#08090E', '#0D0F17'),
      },
      {
        id: 'theme-gold',
        category: 'Color Themes',
        title: 'Apply Atelier Obsidian & Luxury Gold Theme',
        subtitle: 'Deep #0D0F17 background with #F59E0B & #10B981 highlights',
        icon: <Palette size={15} color="#F59E0B" />,
        run: () => applyThemePalette('#0D0F17', '#F59E0B', '#1A1E2A', '#F8FAFC'),
      },
      {
        id: 'align-dist-h',
        category: 'Smart Align',
        title: 'Distribute Objects Horizontally',
        subtitle: 'Equalize horizontal spacing across canvas objects',
        icon: <AlignCenter size={15} color="#06B6D4" />,
        run: () => canvas && distributeSelection(canvas, 'horizontal'),
      },
      {
        id: 'align-dist-v',
        category: 'Smart Align',
        title: 'Distribute Objects Vertically',
        subtitle: 'Equalize vertical spacing across canvas objects',
        icon: <AlignCenter size={15} color="#14B8A6" />,
        run: () => canvas && distributeSelection(canvas, 'vertical'),
      },
      {
        id: 'toggle-grid',
        category: 'Smart Align',
        title: 'Toggle Precision 20px / 100px Cyan Grid',
        subtitle: 'Show or hide architectural coordinate grid',
        shortcut: '⇧G',
        icon: <Grid size={15} color="#06B6D4" />,
        run: () => toggleGrid(),
      },
      {
        id: 'img-cutout',
        category: 'Image & AI',
        title: 'Smart Chroma Background Cutout (Selected Image)',
        subtitle: '100% client-side alpha background removal',
        icon: <Scissors size={15} color="#10B981" />,
        run: () => {
          if (canvas) void removeImageBackgroundClient(canvas, 'corner', 48)
        },
      },
      {
        id: 'img-lut-cyber',
        category: 'Image & AI',
        title: 'Apply Cyberpunk High-Vibrance LUT (Selected Image)',
        subtitle: 'Client-side WebGL/Canvas contrast & vibrance shader',
        icon: <Sparkles size={15} color="#06B6D4" />,
        run: () => canvas && applyImageLutPreset(canvas, 'cyberpunk'),
      },
      {
        id: 'ai-toggle',
        category: 'Image & AI',
        title: 'Open Corex AI Studio (Text-to-Design & Vision Doctor)',
        subtitle: 'Launch autonomous layout & image synthesis copilot',
        icon: <Sparkles size={15} color="#14B8A6" />,
        run: () => toggleAiMode(),
      },
      {
        id: 'exp-html5',
        category: 'Studio Export',
        title: 'Compile Standalone Interactive HTML5 Bundle (.html)',
        subtitle: 'Zero-dependency self-contained vector web page artifact',
        icon: <Code2 size={15} color="#22D3EE" />,
        run: () => {
          if (!canvas) return
          const html = compileCanvasToStandaloneHtml(canvas, currentProjectName || 'Corex Quantum Studio')
          dispatchBinaryDownload(new Blob([html], { type: 'text/html;charset=utf-8' }), 'corex-bundle.html')
        },
      },
      {
        id: 'exp-png-2x',
        category: 'Studio Export',
        title: 'Quick Export Ultra-HD PNG (2x Supersampled)',
        subtitle: 'Lossless raster export at 200% resolution',
        icon: <Download size={15} color="#06B6D4" />,
        run: () => canvas && void exportCanvas(canvas, 'png', 1, currentProjectName || 'corex-design', { scale: 2 }),
      },
      {
        id: 'exp-svg',
        category: 'Studio Export',
        title: 'Quick Export Scalable Vector SVG',
        subtitle: 'Pure mathematical vector XML output',
        icon: <Download size={15} color="#14B8A6" />,
        run: () => canvas && void exportCanvas(canvas, 'svg', 1, currentProjectName || 'corex-design'),
      },
    ],
    [canvas, currentProjectName, toggleGrid, toggleAiMode],
  )

  const filtered = useMemo(() => {
    if (!query.trim()) return commands
    const q = query.toLowerCase()
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q),
    )
  }, [commands, query])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0))
      } else if (e.key === 'Enter' && filtered[activeIndex]) {
        e.preventDefault()
        filtered[activeIndex].run()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, filtered, activeIndex, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(7, 8, 13, 0.78)',
            backdropFilter: 'blur(14px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '10vh',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 590,
              background: '#0C0E16',
              borderRadius: 24,
              boxShadow: '0 28px 72px rgba(0, 0, 0, 0.85)',
              overflow: 'hidden',
            }}
          >
            {/* Search Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '16px 20px',
                background: '#111522',
              }}
            >
              <Search size={17} color="#22D3EE" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActiveIndex(0)
                }}
                placeholder="Search 18-Engine Quantum commands (GLSL, CSG Union, 3D Extrude, Superformula, QR)…"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#F8FAFC',
                  fontSize: 13.5,
                  fontFamily: 'var(--font-sans)',
                }}
              />
              <button
                onClick={onClose}
                style={{
                  background: '#181C2B',
                  border: 'none',
                  borderRadius: 10,
                  color: '#94A3B8',
                  padding: '4px 9px',
                  fontSize: 10.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>ESC</span>
                <X size={11} />
              </button>
            </div>

            {/* Command List */}
            <div style={{ maxHeight: 390, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {filtered.length === 0 ? (
                <div style={{ padding: 28, textAlign: 'center', color: '#64748B', fontSize: 12.5 }}>
                  No matching studio commands found.
                </div>
              ) : (
                filtered.map((cmd, idx) => {
                  const active = idx === activeIndex
                  return (
                    <button
                      key={cmd.id}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => {
                        cmd.run()
                        onClose()
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 14px',
                        borderRadius: 14,
                        background: active
                          ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.16) 0%, rgba(20, 184, 166, 0.08) 100%)'
                          : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 100ms',
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 11,
                          background: '#151926',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {cmd.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#F8FAFC' }}>
                            {cmd.title}
                          </span>
                          <span
                            style={{
                              fontSize: 9.5,
                              fontFamily: 'var(--font-mono)',
                              color: '#22D3EE',
                              background: 'rgba(6, 182, 212, 0.12)',
                              padding: '2px 7px',
                              borderRadius: 8,
                            }}
                          >
                            {cmd.category}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                          {cmd.subtitle}
                        </div>
                      </div>
                      {cmd.shortcut && (
                        <span
                          style={{
                            fontSize: 10.5,
                            fontFamily: 'var(--font-mono)',
                            color: '#22D3EE',
                            background: '#151926',
                            padding: '3px 8px',
                            borderRadius: 8,
                          }}
                        >
                          {cmd.shortcut}
                        </span>
                      )}
                    </button>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '10px 18px',
                background: '#090B11',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 10.5,
                color: '#64748B',
              }}
            >
              <span>↑↓ Navigate &nbsp;·&nbsp; ↵ Execute &nbsp;·&nbsp; ESC Close</span>
              <span style={{ color: '#22D3EE', fontFamily: 'var(--font-mono)' }}>
                Corex Quantum v3.0 · 18-Engine Core
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
