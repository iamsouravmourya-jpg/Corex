/**
 * LernexAI Proprietary — Soft-Edge Borderless Creative Studio Header
 * Uses tonal elevation and rounded-xl capsules instead of rigid 1px divider lines.
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Undo2,
  Redo2,
  Download,
  ChevronDown,
  Sparkles,
  LogOut,
  Home,
  Command,
  PanelLeft,
  PanelRight,
  Zap,
  LayoutTemplate,
  Shapes,
} from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { Tooltip } from '@/components/ui/Tooltip'
import { ExportModal } from '@/workspace/compiler/ArtifactCompilerDialog'
import { CommandPalette } from '@/components/command/CommandPalette'
import { CANVAS_PRESETS } from '@/types'
import type { CanvasSize } from '@/types'

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, userSelect: 'none' }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cLogoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
        </defs>
        <circle cx="14" cy="14" r="13" fill="url(#cLogoGrad)" />
        <path
          d="M20 9C18.3 7.75 16.24 7 14 7C9.03 7 5 10.69 5 15C5 19.31 9.03 23 14 23C16.24 23 18.3 22.25 20 21"
          stroke="#07080D"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          <span style={{ color: '#F8FAFC' }}>Core</span>
          <span style={{ color: '#06B6D4' }}>x</span>
        </span>
        <span
          style={{
            fontSize: 9,
            color: 'var(--color-base-500)',
            letterSpacing: '0.02em',
            lineHeight: 1,
          }}
        >
          by LernexAI
        </span>
      </div>
    </div>
  )
}

function ProjectTitle() {
  const { currentProjectName, setCurrentProjectName } = useEditorStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(currentProjectName)

  const commit = () => {
    const trimmed = draft.trim() || 'Untitled Design'
    setCurrentProjectName(trimmed)
    setEditing(false)
  }

  return editing ? (
    <input
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && commit()}
      className="input-base"
      style={{ width: 170, height: 32, fontSize: 12, borderRadius: 12 }}
    />
  ) : (
    <button
      onClick={() => {
        setDraft(currentProjectName)
        setEditing(true)
      }}
      title="Click to rename design"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: 'none',
        borderRadius: 12,
        padding: '6px 12px',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--color-base-200)',
        cursor: 'pointer',
        maxWidth: 190,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {currentProjectName}
    </button>
  )
}

function PageSizePicker() {
  const { canvasSize, setCanvasSize } = useEditorStore()
  const [open, setOpen] = useState(false)
  const [customW, setCustomW] = useState(String(canvasSize.width))
  const [customH, setCustomH] = useState(String(canvasSize.height))

  const apply = (size: CanvasSize) => {
    setCanvasSize(size)
    setOpen(false)
  }
  const applyCustom = () => {
    const w = parseInt(customW),
      h = parseInt(customH)
    if (w > 0 && h > 0) apply({ width: w, height: h, label: 'Custom' })
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        className="btn-base"
        style={{ height: 34, padding: '0 14px', gap: 6, fontSize: 11.5, borderRadius: 12 }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', color: '#06B6D4', fontSize: 11, fontWeight: 700 }}>
          {canvasSize.width}×{canvasSize.height}
        </span>
        <span style={{ color: 'var(--color-base-300)', fontSize: 11 }}>{canvasSize.label}</span>
        <ChevronDown size={12} style={{ color: 'var(--color-base-500)', flexShrink: 0 }} />
      </button>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{
              position: 'absolute',
              top: 42,
              left: 0,
              zIndex: 300,
              background: '#121521',
              borderRadius: 16,
              boxShadow: 'var(--shadow-float)',
              minWidth: 276,
              padding: 6,
              overflow: 'hidden',
            }}
          >
            <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {CANVAS_PRESETS.map((preset) => {
                const active = canvasSize.label === preset.label
                return (
                  <button
                    key={preset.label}
                    onClick={() => apply(preset)}
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: active ? 'rgba(6, 182, 212, 0.14)' : 'transparent',
                      border: 'none',
                      borderRadius: 10,
                      cursor: 'pointer',
                      fontSize: 11.5,
                      fontWeight: active ? 700 : 500,
                      color: active ? '#22D3EE' : 'var(--color-base-200)',
                      transition: 'background 100ms',
                    }}
                  >
                    <span>{preset.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-base-500)' }}>
                      {preset.width}×{preset.height}
                    </span>
                  </button>
                )
              })}
            </div>
            <div
              style={{
                padding: '10px 10px 6px',
                marginTop: 4,
                background: '#0C0E16',
                borderRadius: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 10.5, color: 'var(--color-base-400)', fontWeight: 600 }}>
                Custom Dimensions
              </span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  className="input-base"
                  value={customW}
                  onChange={(e) => setCustomW(e.target.value)}
                  style={{ width: 70, height: 30, borderRadius: 10 }}
                  placeholder="W"
                />
                <span style={{ color: 'var(--color-base-500)', fontSize: 11 }}>×</span>
                <input
                  className="input-base"
                  value={customH}
                  onChange={(e) => setCustomH(e.target.value)}
                  style={{ width: 70, height: 30, borderRadius: 10 }}
                  placeholder="H"
                />
                <button
                  onClick={applyCustom}
                  className="btn-primary btn-base"
                  style={{ height: 30, padding: '0 12px', fontSize: 11, borderRadius: 10, flexShrink: 0 }}
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
          <div style={{ position: 'fixed', inset: 0, zIndex: 299 }} onClick={() => setOpen(false)} />
        </>
      )}
    </div>
  )
}

function UserProfileMenu() {
  const { user, setCurrentView, logout } = useEditorStore()
  const [open, setOpen] = useState(false)

  const displayName = user?.name || 'Sourav Maurya'
  const displayEmail = user?.email || 'iamsouravmaurya@gmail.com'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        title={`${displayName} (${displayEmail})`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: 34,
          padding: '0 10px 0 6px',
          borderRadius: 12,
          background: '#151927',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-base-200)',
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)',
            color: '#07080D',
            fontSize: 10,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {initials}
        </div>
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            maxWidth: 96,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {displayName.split(' ')[0]}
        </span>
        <ChevronDown size={11} style={{ color: 'var(--color-base-500)' }} />
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 250 }} />
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute',
              top: 42,
              right: 0,
              zIndex: 300,
              width: 220,
              background: '#121521',
              borderRadius: 16,
              boxShadow: 'var(--shadow-float)',
              padding: 8,
            }}
          >
            <div style={{ padding: '10px 12px', background: '#0C0E16', borderRadius: 12, marginBottom: 6 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-base-100)' }}>{displayName}</div>
              <div
                style={{
                  fontSize: 10.5,
                  color: 'var(--color-base-500)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {displayEmail}
              </div>
              <div style={{ fontSize: 10, color: '#06B6D4', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                {user?.plan || 'Corex Pro · LernexAI'}
              </div>
            </div>

            <button
              onClick={() => {
                setOpen(false)
                setCurrentView('landing')
              }}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 10,
                background: 'transparent',
                border: 'none',
                color: 'var(--color-base-200)',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Home size={13} color="var(--color-base-400)" />
              <span>Landing Showcase</span>
            </button>

            <button
              onClick={() => {
                setOpen(false)
                logout()
              }}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 10,
                background: 'transparent',
                border: 'none',
                color: '#FB7185',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <LogOut size={13} color="#FB7185" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        </>
      )}
    </div>
  )
}

export function TopBar() {
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    isAiModeOpen,
    toggleAiMode,
    leftDrawerTab,
    toggleLeftDrawer,
    isRightPanelOpen,
    toggleRightPanel,
  } = useEditorStore()
  const [showExport, setShowExport] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setShowCommandPalette((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
        style={{
          height: 54,
          background: '#0C0E16',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 10,
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        <Logo />

        <Tooltip content={leftDrawerTab ? 'Close Studio Drawer' : 'Open Studio Drawer'} side="bottom">
          <button
            onClick={() => toggleLeftDrawer(leftDrawerTab || 'create')}
            className="btn-base"
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: leftDrawerTab ? 'rgba(6, 182, 212, 0.15)' : '#151927',
              color: leftDrawerTab ? '#22D3EE' : '#94A3B8',
            }}
          >
            <PanelLeft size={15} />
          </button>
        </Tooltip>

        <PageSizePicker />
        <ProjectTitle />

        <div style={{ flex: 1 }} />

        {/* Soft Tonal Quick Suite Capsule */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: 4,
            borderRadius: 14,
            background: '#121521',
          }}
        >
          <button
            onClick={() => toggleLeftDrawer('blueprints')}
            style={{
              height: 28,
              padding: '0 12px',
              borderRadius: 10,
              border: 'none',
              background: leftDrawerTab === 'blueprints' ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
              color: leftDrawerTab === 'blueprints' ? '#22D3EE' : '#94A3B8',
              fontSize: 11.5,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <LayoutTemplate size={13} color="#06B6D4" />
            <span>Blueprints</span>
          </button>

          <button
            onClick={() => toggleLeftDrawer('vectors')}
            style={{
              height: 28,
              padding: '0 12px',
              borderRadius: 10,
              border: 'none',
              background: leftDrawerTab === 'vectors' ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
              color: leftDrawerTab === 'vectors' ? '#22D3EE' : '#94A3B8',
              fontSize: 11.5,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Shapes size={13} color="#14B8A6" />
            <span>Vectors</span>
          </button>

          <button
            onClick={() => toggleLeftDrawer('quantum')}
            style={{
              height: 28,
              padding: '0 12px',
              borderRadius: 10,
              border: 'none',
              background: leftDrawerTab === 'quantum' ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
              color: leftDrawerTab === 'quantum' ? '#22D3EE' : '#94A3B8',
              fontSize: 11.5,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Zap size={13} color="#F59E0B" />
            <span>Quantum Lab</span>
          </button>
        </div>

        {/* ⌘K Omnibar Trigger */}
        <Tooltip content="Omnibar Command Palette" shortcut="⌘K" side="bottom">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCommandPalette(true)}
            aria-label="Open Command Palette"
            className="btn-base"
            style={{
              height: 34,
              padding: '0 12px',
              borderRadius: 12,
              gap: 7,
            }}
          >
            <Command size={13} color="#06B6D4" />
            <span>Omnibar</span>
            <span
              style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: '#06B6D4',
                background: 'rgba(6, 182, 212, 0.12)',
                padding: '2px 6px',
                borderRadius: 6,
              }}
            >
              ⌘K
            </span>
          </motion.button>
        </Tooltip>

        {/* AI Studio Trigger */}
        <Tooltip content={isAiModeOpen ? 'Close AI Studio' : 'Open AI Studio'} side="bottom">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={toggleAiMode}
            aria-label="Toggle AI Mode"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              height: 34,
              padding: '0 14px',
              background: isAiModeOpen
                ? 'linear-gradient(135deg, rgba(6,182,212,0.24) 0%, rgba(20,184,166,0.24) 100%)'
                : '#151927',
              border: 'none',
              borderRadius: 12,
              color: isAiModeOpen ? '#A5F3FC' : 'var(--color-base-200)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: isAiModeOpen ? '0 8px 20px rgba(6,182,212,0.18)' : 'none',
            }}
          >
            <Sparkles size={13} style={{ color: isAiModeOpen ? '#22D3EE' : '#06B6D4' }} />
            <span>AI Studio</span>
          </motion.button>
        </Tooltip>

        {/* Undo / Redo Capsule */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: 3,
            borderRadius: 12,
            background: '#121521',
          }}
        >
          <Tooltip content="Undo" shortcut="⌘Z" side="bottom">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={undo}
              disabled={!canUndo}
              aria-label="Undo"
              className="btn-ghost"
              style={{
                width: 28,
                height: 28,
                borderRadius: 9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: canUndo ? 1 : 0.3,
              }}
            >
              <Undo2 size={14} strokeWidth={1.7} />
            </motion.button>
          </Tooltip>
          <Tooltip content="Redo" shortcut="⌘⇧Z" side="bottom">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={redo}
              disabled={!canRedo}
              aria-label="Redo"
              className="btn-ghost"
              style={{
                width: 28,
                height: 28,
                borderRadius: 9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: canRedo ? 1 : 0.3,
              }}
            >
              <Redo2 size={14} strokeWidth={1.7} />
            </motion.button>
          </Tooltip>
        </div>

        <Tooltip content={isRightPanelOpen ? 'Hide Inspector' : 'Show Inspector'} side="bottom">
          <button
            onClick={toggleRightPanel}
            className="btn-base"
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: isRightPanelOpen ? 'rgba(6, 182, 212, 0.15)' : '#151927',
              color: isRightPanelOpen ? '#22D3EE' : '#94A3B8',
            }}
          >
            <PanelRight size={15} />
          </button>
        </Tooltip>

        <Tooltip content="Compile & Export (PNG 8K, SVG, PDF, PPTX, React JSX)" side="bottom">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowExport(true)}
            aria-label="Export design"
            className="btn-primary btn-base"
            style={{
              height: 34,
              padding: '0 16px',
              borderRadius: 12,
              fontSize: 12,
            }}
          >
            <Download size={13} strokeWidth={2.2} />
            <span>Export</span>
          </motion.button>
        </Tooltip>

        <UserProfileMenu />
      </motion.header>
      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
      <CommandPalette open={showCommandPalette} onClose={() => setShowCommandPalette(false)} />
    </>
  )
}
