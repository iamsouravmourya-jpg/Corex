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
} from '@/lib/vectorStudio'
import { exportCanvas } from '@/lib/export'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

interface StudioCommand {
  id: string
  category: 'Vector Lab' | 'Color Themes' | 'Smart Align' | 'Image & Shaders' | 'Studio Export'
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
        shortcut: '3D',
        icon: <Box size={15} color="#06B6D4" />,
        run: () => canvas && addIsometricCube(canvas),
      },
      {
        id: 'vec-wave',
        category: 'Vector Lab',
        title: 'Generate Cyber Wave Mesh (Corel / Illustrator Blend)',
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
        shortcut: "⌘'",
        icon: <Grid size={15} color="#06B6D4" />,
        run: () => toggleGrid(),
      },
      {
        id: 'img-cutout',
        category: 'Image & Shaders',
        title: 'Smart Chroma Background Cutout (Selected Image)',
        subtitle: '100% client-side alpha background removal',
        icon: <Scissors size={15} color="#10B981" />,
        run: () => {
          if (canvas) void removeImageBackgroundClient(canvas, 'corner', 48)
        },
      },
      {
        id: 'img-lut-cyber',
        category: 'Image & Shaders',
        title: 'Apply Cyberpunk High-Vibrance LUT (Selected Image)',
        subtitle: 'Client-side WebGL/Canvas contrast & vibrance shader',
        icon: <Sparkles size={15} color="#06B6D4" />,
        run: () => canvas && applyImageLutPreset(canvas, 'cyberpunk'),
      },
      {
        id: 'ai-toggle',
        category: 'Image & Shaders',
        title: 'Open Corex AI Studio (Text-to-Design & Vision Doctor)',
        subtitle: 'Launch autonomous layout & image synthesis copilot',
        icon: <Sparkles size={15} color="#14B8A6" />,
        run: () => toggleAiMode(),
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
      {
        id: 'exp-pdf',
        category: 'Studio Export',
        title: 'Quick Export Print-Ready PDF (96 DPI)',
        subtitle: 'Vector-calibrated PDF document compilation',
        icon: <Download size={15} color="#10B981" />,
        run: () => canvas && void exportCanvas(canvas, 'pdf', 1, currentProjectName || 'corex-design', { scale: 2 }),
      },
      {
        id: 'exp-pptx',
        category: 'Studio Export',
        title: 'Quick Export Native PowerPoint Slide (.PPTX)',
        subtitle: 'Client-side PptxGenJS presentation slide',
        icon: <Download size={15} color="#F59E0B" />,
        run: () => canvas && void exportCanvas(canvas, 'pptx', 1, currentProjectName || 'corex-design', { scale: 2 }),
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
            background: 'rgba(8, 9, 14, 0.78)',
            backdropFilter: 'blur(12px)',
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
              maxWidth: 580,
              background: '#0D0F17',
              border: '1px solid #1A1E2A',
              borderRadius: '1rem',
              boxShadow: '0 24px 64px rgba(8, 9, 14, 0.9), 0 6px 20px rgba(6, 182, 212, 0.16)',
              overflow: 'hidden',
            }}
          >
            {/* Search Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 18px',
                borderBottom: '1px solid #1A1E2A',
                background: '#11141C',
              }}
            >
              <Search size={16} color="#06B6D4" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActiveIndex(0)
                }}
                placeholder="Type a command (e.g., Guilloche, Isometric Cube, QR Code, Cutout, Theme, SVG)…"
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
                  background: '#1A1E2A',
                  border: '1px solid #262C3D',
                  borderRadius: '0.375rem',
                  color: '#94A3B8',
                  padding: '2px 7px',
                  fontSize: 10.5,
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
            <div style={{ maxHeight: 380, overflowY: 'auto', padding: 8 }}>
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
                        padding: '10px 12px',
                        borderRadius: '0.625rem',
                        background: active ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                        border: active ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 100ms',
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '0.5rem',
                          background: '#11141C',
                          border: '1px solid #1A1E2A',
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
                              color: '#06B6D4',
                              background: 'rgba(6, 182, 212, 0.1)',
                              padding: '1px 6px',
                              borderRadius: 4,
                            }}
                          >
                            {cmd.category}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>
                          {cmd.subtitle}
                        </div>
                      </div>
                      {cmd.shortcut && (
                        <span
                          style={{
                            fontSize: 10.5,
                            fontFamily: 'var(--font-mono)',
                            color: '#94A3B8',
                            background: '#11141C',
                            border: '1px solid #1A1E2A',
                            padding: '2px 7px',
                            borderRadius: 5,
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
                padding: '8px 16px',
                background: '#08090E',
                borderTop: '1px solid #1A1E2A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 10.5,
                color: '#64748B',
              }}
            >
              <span>↑↓ Navigate &nbsp;·&nbsp; ↵ Execute &nbsp;·&nbsp; ESC Close</span>
              <span style={{ color: '#06B6D4', fontFamily: 'var(--font-mono)' }}>
                100% Client-Side Serverless Engine
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
