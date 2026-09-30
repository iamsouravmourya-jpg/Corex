import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Rect, Circle, IText } from 'fabric'
import { nanoid } from 'nanoid'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import { useEditorStore } from '@/store/editorStore'
import { buildGradient } from '@/lib/appearance'
import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion'

const PRESET_COLORS = [
  '#ffffff', '#09090B', '#F43F5E', '#3B82F6', '#10B981',
  '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  '#1E293B', '#334155', '#64748B', '#CBD5E1', '#F1F5F9',
]

// Corex Studio Rich Multi-Layer Templates
interface Template {
  id: string
  name: string
  category: string
  bg: string
  accent: string
  headline: string
  subhead: string
  badge: string
  gradient?: { angle: number; from: string; to: string }
}

const TEMPLATES: Template[] = [
  { id: 'dark-studio', name: 'Corex Pro', category: 'Product Launch', bg: '#09090B', accent: '#F43F5E', headline: 'DESIGN FASTER', subhead: 'Next-Gen Vector & AI Studio by LernexAI', badge: 'PRO STUDIO' },
  { id: 'gradient-purple', name: 'Cyber Violet', category: 'Social Post', bg: 'linear-gradient(135deg,#7C3AED,#DB2777)', accent: '#ffffff', headline: 'FUTURE OF AI', subhead: 'Autonomous Creative Workflows', badge: 'NEW DROP', gradient: { angle: 45, from: '#7C3AED', to: '#DB2777' } },
  { id: 'tech-blue', name: 'SaaS Keynote', category: 'Presentation', bg: '#0f172a', accent: '#38bdf8', headline: 'SCALE TO MILLIONS', subhead: 'Enterprise Architecture Overview 2026', badge: 'KEYNOTE' },
  { id: 'forest-green', name: 'Eco Brand', category: 'Poster', bg: '#052e16', accent: '#4ade80', headline: 'SUSTAINABLE FUTURE', subhead: '100% Carbon Neutral Product Line', badge: 'ORGANIC' },
  { id: 'sunset-orange', name: 'Summer Fest', category: 'Event Poster', bg: '#7c2d12', accent: '#fb923c', headline: 'SOUND WAVE 2026', subhead: 'Live Electronic Music Experience', badge: 'LIVE EVENT' },
  { id: 'ocean-blue', name: 'Deep Ocean', category: 'Presentation', bg: '#0c4a6e', accent: '#38bdf8', headline: 'GLOBAL SUMMIT', subhead: 'Innovation & Design Leadership', badge: 'SUMMIT' },
  { id: 'minimal-white', name: 'Swiss Minimal', category: 'Editorial', bg: '#ffffff', accent: '#111111', headline: 'LESS IS MORE.', subhead: 'Precision Typography & Grid Systems', badge: 'ISSUE 01' },
  { id: 'neon-dark', name: 'Midnight Glow', category: 'YouTube Cover', bg: '#030712', accent: '#a78bfa', headline: '10X YOUR WORKFLOW', subhead: 'Complete Masterclass Inside', badge: 'TUTORIAL' },
  { id: 'rose-gold', name: 'Atelier Luxe', category: 'Brand Card', bg: '#fdf2f8', accent: '#be185d', headline: 'MAISON DE LUXE', subhead: 'Bespoke Signature Collection', badge: 'EXCLUSIVE' },
  { id: 'paper-beige', name: 'Artisan Roast', category: 'Menu / Promo', bg: '#fef3c7', accent: '#92400e', headline: 'MORNING BREW', subhead: 'Single Origin Specialty Coffee', badge: 'FRESH ROAST' },
  { id: 'warm-gray', name: 'Monolith Dark', category: 'Banner', bg: '#1C1917', accent: '#F59E0B', headline: 'BUILT FOR CREATORS', subhead: 'Zero Latency Browser Canvas Engine', badge: 'LERNEXAI' },
  { id: 'vibrant-yellow', name: 'Flash Sale', category: 'Promo Ad', bg: '#fef08a', accent: '#713f12', headline: 'MEGA FLASH SALE', subhead: 'Up to 60% Off Sitewide Today Only', badge: 'LIMITED TIME' },
]

export function TemplatePanel() {
  const canvas = useFabricCanvas()
  const [showPicker, setShowPicker] = useState(false)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [confirmTemplate, setConfirmTemplate] = useState<typeof TEMPLATES[0] | null>(null)

  const applyBg = (color: string) => {
    if (!canvas) return
    setBgColor(color)
    canvas.set({ backgroundColor: color })
    canvas.requestRenderAll()
    const store = useEditorStore.getState()
    store.snapshot()
    store.bumpBgNonce()
  }

  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    if (!canvas) return
    const store = useEditorStore.getState()
    const w = canvas.getWidth()
    const h = canvas.getHeight()

    store.snapshot()
    ;(canvas as any)._isRestoring = true
    canvas.getObjects().slice().forEach((o) => canvas.remove(o))

    canvas.set({
      backgroundColor: tpl.gradient
        ? buildGradient('linear', tpl.gradient, w, h)
        : tpl.bg,
    })

    const isLightBg = ['#ffffff', '#fdf2f8', '#fef3c7', '#fef08a'].includes(tpl.bg)
    const primaryText = isLightBg ? '#111827' : '#FFFFFF'
    const secondaryText = isLightBg ? '#4B5563' : '#94A3B8'

    // 1. Frame Card
    const card = new Rect({
      left: Math.round(w * 0.08),
      top: Math.round(h * 0.12),
      width: Math.round(w * 0.84),
      height: Math.round(h * 0.76),
      fill: isLightBg ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
      stroke: tpl.accent,
      strokeWidth: 2,
      rx: 16,
      ry: 16,
    })
    ;(card as any).__uid = nanoid(8)
    ;(card as any).corexLabel = 'Frame Border'

    // 2. Decorative Glow Orb
    const orb = new Circle({
      left: Math.round(w * 0.68),
      top: Math.round(h * 0.2),
      radius: Math.round(Math.min(w, h) * 0.11),
      fill: tpl.accent,
      opacity: 0.16,
    })
    ;(orb as any).__uid = nanoid(8)
    ;(orb as any).corexLabel = 'Accent Orb'

    // 3. Kicker / Category Label
    const badgeLabel = new IText(tpl.badge, {
      left: Math.round(w * 0.14),
      top: Math.round(h * 0.24),
      fontFamily: 'Sora',
      fontSize: Math.max(14, Math.round(w * 0.018)),
      fontWeight: '700',
      fill: tpl.accent,
    })
    ;(badgeLabel as any).__uid = nanoid(8)
    ;(badgeLabel as any).corexLabel = 'Category Kicker'

    // 4. Primary Headline
    const headline = new IText(tpl.headline, {
      left: Math.round(w * 0.14),
      top: Math.round(h * 0.34),
      fontFamily: 'Sora',
      fontSize: Math.max(32, Math.round(w * 0.055)),
      fontWeight: '700',
      fill: primaryText,
    })
    ;(headline as any).__uid = nanoid(8)
    ;(headline as any).corexLabel = 'Main Headline'

    // 5. Subtitle
    const subtitle = new IText(tpl.subhead, {
      left: Math.round(w * 0.14),
      top: Math.round(h * 0.48),
      fontFamily: 'Inter',
      fontSize: Math.max(16, Math.round(w * 0.024)),
      fontWeight: '400',
      fill: secondaryText,
    })
    ;(subtitle as any).__uid = nanoid(8)
    ;(subtitle as any).corexLabel = 'Subtitle Text'

    canvas.add(card, orb, badgeLabel, headline, subtitle)
    ;(canvas as any)._isRestoring = false
    canvas.requestRenderAll()
    store.snapshot()
    store.bumpBgNonce()
    store.syncLayersFromCanvas()
    setConfirmTemplate(null)
  }

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Background Color */}
      <div className="panel-heading">Background Color</div>
      <div style={{ padding: '8px 12px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => applyBg(c)}
            style={{
              width: 22, height: 22, borderRadius: 4,
              background: c,
              border: bgColor === c ? '2px solid var(--color-accent-400)' : '1.5px solid var(--color-base-600)',
              cursor: 'pointer',
              transition: 'transform 100ms var(--ease-spring)',
            }}
            aria-label={`Set background ${c}`}
          />
        ))}
        <button
          onClick={() => setShowPicker(!showPicker)}
          style={{ width: 22, height: 22, borderRadius: 4, background: 'conic-gradient(red,yellow,lime,cyan,blue,magenta,red)', border: '1.5px solid var(--color-base-600)', cursor: 'pointer' }}
          aria-label="Custom color"
        />
      </div>
      {showPicker && (
        <div style={{ padding: '0 12px 12px' }}>
          <HexColorPicker color={bgColor} onChange={applyBg} style={{ width: '100%' }} />
        </div>
      )}

      {/* Templates */}
      <div className="panel-heading" style={{ marginTop: 8 }}>Corex Studio Templates</div>
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: '8px 12px' }}
      >
        {TEMPLATES.map((tpl) => (
          <motion.button
            key={tpl.id}
            variants={staggerItemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setConfirmTemplate(tpl)}
            style={{
              height: 64,
              borderRadius: 6,
              background: tpl.bg,
              border: '1px solid var(--color-base-600)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              overflow: 'hidden',
              position: 'relative',
            }}
            aria-label={`Apply template: ${tpl.name}`}
          >
            <span style={{ fontSize: 10, fontWeight: 600, color: tpl.accent, textShadow: '0 1px 3px rgba(0,0,0,0.5)', zIndex: 1 }}>{tpl.name}</span>
            <span style={{ fontSize: 9, color: tpl.accent, opacity: 0.7, zIndex: 1 }}>{tpl.category}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Confirm dialog */}
      {confirmTemplate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ padding: 24, background: 'var(--color-base-800)', border: '1px solid var(--color-base-600)', borderRadius: 10, maxWidth: 320, width: '90%', boxShadow: 'var(--shadow-float)' }}
          >
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-base-100)', marginBottom: 8 }}>Load Studio Template?</div>
            <div style={{ fontSize: 12, color: 'var(--color-base-400)', marginBottom: 20 }}>
              This will load the "{confirmTemplate.name}" multi-layer layout onto your canvas. You can undo anytime with Ctrl+Z.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmTemplate(null)} className="btn-base" style={{ padding: '0 16px', height: 32, fontSize: 12 }}>Cancel</button>
              <button onClick={() => applyTemplate(confirmTemplate)} className="btn-primary btn-base" style={{ padding: '0 16px', height: 32, fontSize: 12 }}>Load Layout</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
