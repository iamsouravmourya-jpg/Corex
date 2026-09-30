import { useState } from 'react'
import { motion } from 'framer-motion'
import { Undo2, Redo2, Download, ChevronDown, Sparkles, LogOut, Home } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { Tooltip } from '@/components/ui/Tooltip'
import { ExportModal } from '@/components/export/ExportModal'
import { CANVAS_PRESETS } from '@/types'
import type { CanvasSize } from '@/types'

// ─── Corex Logo: bold "C" circle badge + wordmark ───────────────────────────
function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, userSelect: 'none' }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cLogoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F43F5E"/>
            <stop offset="100%" stopColor="#BE123C"/>
          </linearGradient>
        </defs>
        {/* Filled circle */}
        <circle cx="14" cy="14" r="13" fill="url(#cLogoGrad)"/>
        {/* Bold white "C" arc */}
        <path
          d="M20 9C18.3 7.75 16.24 7 14 7C9.03 7 5 10.69 5 15C5 19.31 9.03 23 14 23C16.24 23 18.3 22.25 20 21"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{
          fontFamily: "'Sora','Inter',sans-serif",
          fontWeight: 700, fontSize: 15,
          letterSpacing: '-0.04em', lineHeight: 1,
        }}>
          <span style={{ color: '#E8E8F0' }}>Core</span>
          <span style={{ color: '#F43F5E' }}>x</span>
        </span>
        <span style={{ fontSize: 8.5, color: 'var(--color-base-500)', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>
          by LernexAI
        </span>
      </div>
    </div>
  )
}

// ─── Editable Project Title ──────────────────────────────────────────────────
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
      style={{ width: 160, height: 26, fontSize: 11.5 }}
    />
  ) : (
    <button
      onClick={() => {
        setDraft(currentProjectName)
        setEditing(true)
      }}
      title="Click to rename design"
      style={{
        background: 'transparent',
        border: '1px solid transparent',
        borderRadius: 6,
        padding: '3px 8px',
        fontSize: 11.5,
        fontWeight: 500,
        color: 'var(--color-base-300)',
        cursor: 'pointer',
        maxWidth: 180,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {currentProjectName}
    </button>
  )
}

// ─── Page Size Picker ─────────────────────────────────────────────────────────
function PageSizePicker() {
  const { canvasSize, setCanvasSize } = useEditorStore()
  const [open, setOpen] = useState(false)
  const [customW, setCustomW] = useState(String(canvasSize.width))
  const [customH, setCustomH] = useState(String(canvasSize.height))

  const apply = (size: CanvasSize) => { setCanvasSize(size); setOpen(false) }
  const applyCustom = () => {
    const w = parseInt(customW), h = parseInt(customH)
    if (w > 0 && h > 0) apply({ width: w, height: h, label: 'Custom' })
  }

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} className="btn-base"
        style={{ height: 28, padding: '0 10px', gap: 5, fontSize: 11 }}>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-base-200)', fontSize: 11 }}>
          {canvasSize.width}×{canvasSize.height}
        </span>
        <span style={{ color: 'var(--color-base-500)', fontSize: 10 }}>{canvasSize.label}</span>
        <ChevronDown size={10} style={{ color: 'var(--color-base-500)', flexShrink: 0 }} />
      </button>
      {open && (
        <>
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            style={{ position: 'absolute', top: 34, left: 0, zIndex: 300,
              background: 'var(--color-base-800)', border: '1px solid var(--color-base-600)',
              borderRadius: 8, boxShadow: 'var(--shadow-float)', minWidth: 230, overflow: 'hidden' }}>
            {CANVAS_PRESETS.map((preset) => (
              <button key={preset.label} onClick={() => apply(preset)}
                style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12,
                  color: canvasSize.label === preset.label ? 'var(--color-accent-400)' : 'var(--color-base-200)',
                  transition: 'background 80ms' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-base-750)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                <span>{preset.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-base-500)' }}>
                  {preset.width}×{preset.height}
                </span>
              </button>
            ))}
            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--color-base-600)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 10, color: 'var(--color-base-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Custom</span>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <input className="input-base" value={customW} onChange={e => setCustomW(e.target.value)} style={{ width: 64 }} placeholder="W" />
                <span style={{ color: 'var(--color-base-500)', fontSize: 11 }}>×</span>
                <input className="input-base" value={customH} onChange={e => setCustomH(e.target.value)} style={{ width: 64 }} placeholder="H" />
                <button onClick={applyCustom} className="btn-base" style={{ height: 28, padding: '0 10px', fontSize: 11, flexShrink: 0 }}>Apply</button>
              </div>
            </div>
          </motion.div>
          <div style={{ position: 'fixed', inset: 0, zIndex: 299 }} onClick={() => setOpen(false)} />
        </>
      )}
    </div>
  )
}

// ─── User Profile Menu ────────────────────────────────────────────────────────
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
          gap: 7,
          height: 30,
          padding: '0 8px 0 5px',
          borderRadius: 7,
          background: 'var(--color-base-800)',
          border: '1px solid var(--color-base-600)',
          cursor: 'pointer',
          color: 'var(--color-base-200)',
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F43F5E 0%, #8B5CF6 100%)',
            color: '#fff',
            fontSize: 9.5,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {initials}
        </div>
        <span style={{ fontSize: 11, fontWeight: 500, maxWidth: 96, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayName.split(' ')[0]}
        </span>
        <ChevronDown size={10} style={{ color: 'var(--color-base-500)' }} />
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 250 }}
          />
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute',
              top: 36,
              right: 0,
              zIndex: 300,
              width: 210,
              background: 'var(--color-base-850)',
              border: '1px solid var(--color-base-600)',
              borderRadius: 10,
              boxShadow: 'var(--shadow-float)',
              padding: 6,
            }}
          >
            <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--color-base-700)', marginBottom: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-base-100)' }}>{displayName}</div>
              <div style={{ fontSize: 10.5, color: 'var(--color-base-500)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displayEmail}
              </div>
              <div style={{ fontSize: 9.5, color: '#F43F5E', marginTop: 3, fontFamily: 'var(--font-mono)' }}>
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
                padding: '7px 10px',
                borderRadius: 6,
                background: 'transparent',
                border: 'none',
                color: 'var(--color-base-200)',
                fontSize: 11.5,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Home size={13} color="var(--color-base-400)" />
              <span>Landing Page</span>
            </button>

            <button
              onClick={() => {
                setOpen(false)
                logout()
              }}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 6,
                background: 'transparent',
                border: 'none',
                color: '#FB7185',
                fontSize: 11.5,
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

// ─── TopBar ───────────────────────────────────────────────────────────────────
export function TopBar() {
  const { canUndo, canRedo, undo, redo, isAiModeOpen, toggleAiMode } = useEditorStore()
  const [showExport, setShowExport] = useState(false)

  return (
    <>
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
        style={{ height: 44, background: 'var(--color-base-875)',
          borderBottom: '1px solid var(--color-base-600)',
          display: 'flex', alignItems: 'center',
          padding: '0 14px', gap: 8, flexShrink: 0, zIndex: 100 }}>

        <Logo />
        <div style={{ width: 1, height: 20, background: 'var(--color-base-600)', margin: '0 2px' }} />
        <PageSizePicker />
        <div style={{ width: 1, height: 16, background: 'var(--color-base-700)', margin: '0 2px' }} />
        <ProjectTitle />
        <div style={{ flex: 1 }} />

        {/* AI Mode Button */}
        <Tooltip content={isAiModeOpen ? "Close AI Assistant" : "Open AI Assistant"} side="bottom">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleAiMode}
            aria-label="Toggle AI Mode"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              height: 28,
              padding: '0 10px',
              background: isAiModeOpen
                ? 'linear-gradient(135deg, rgba(244,63,94,0.25) 0%, rgba(139,92,246,0.25) 100%)'
                : 'var(--color-base-800)',
              border: isAiModeOpen
                ? '1px solid var(--color-accent-400)'
                : '1px solid var(--color-base-600)',
              borderRadius: 6,
              color: isAiModeOpen ? '#FECDD3' : 'var(--color-base-200)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 150ms var(--ease-spring)',
              boxShadow: isAiModeOpen ? '0 0 10px rgba(244,63,94,0.3)' : 'none',
            }}
          >
            <Sparkles size={13} style={{ color: isAiModeOpen ? '#FB7185' : '#F43F5E' }} />
            <span>AI Mode</span>
          </motion.button>
        </Tooltip>

        <div style={{ width: 1, height: 16, background: 'var(--color-base-700)', margin: '0 2px' }} />

        <Tooltip content="Undo" shortcut="⌘Z" side="bottom">
          <motion.button whileTap={{ scale: 0.88 }} onClick={undo} disabled={!canUndo}
            aria-label="Undo" className="btn-ghost btn-icon"
            style={{ opacity: canUndo ? 1 : 0.3, transition: 'opacity 150ms' }}>
            <Undo2 size={15} strokeWidth={1.5} />
          </motion.button>
        </Tooltip>
        <Tooltip content="Redo" shortcut="⌘⇧Z" side="bottom">
          <motion.button whileTap={{ scale: 0.88 }} onClick={redo} disabled={!canRedo}
            aria-label="Redo" className="btn-ghost btn-icon"
            style={{ opacity: canRedo ? 1 : 0.3, transition: 'opacity 150ms' }}>
            <Redo2 size={15} strokeWidth={1.5} />
          </motion.button>
        </Tooltip>

        <div style={{ width: 1, height: 20, background: 'var(--color-base-600)', margin: '0 2px' }} />

        <Tooltip content="Export as PNG, JPEG or SVG" side="bottom">
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => setShowExport(true)}
            aria-label="Export design"
            style={{ display: 'flex', alignItems: 'center', gap: 6,
              height: 30, padding: '0 14px',
              background: 'linear-gradient(180deg,#F43F5E 0%,#E11D48 100%)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7,
              color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(244,63,94,0.4),inset 0 1px 0 rgba(255,255,255,0.15)' }}>
            <Download size={13} strokeWidth={2} />
            Export
          </motion.button>
        </Tooltip>

        <UserProfileMenu />
      </motion.header>
      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
    </>
  )
}
