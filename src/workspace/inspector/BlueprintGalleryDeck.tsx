import { useState, useMemo } from 'react'
import { Rect, Circle, IText } from 'fabric'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import { useEditorStore } from '@/store/editorStore'
import { motion } from 'framer-motion'
import { Sparkles, Search } from 'lucide-react'

type BlueprintCategory = 'All' | 'SaaS & AI' | 'Social' | 'Editorial' | 'Keynote'

interface QuantumBlueprintSpec {
  id: string
  title: string
  category: Exclude<BlueprintCategory, 'All'>
  tag: string
  bg: string
  accent: string
  previewTitle: string
  previewSub: string
  populate: (canvas: any) => void
}

const QUANTUM_BLUEPRINTS: QuantumBlueprintSpec[] = [
  {
    id: 'bp-quantum-saas',
    title: 'Quantum AI Cloud Launch',
    category: 'SaaS & AI',
    tag: 'SaaS Hero',
    bg: '#08090E',
    accent: '#06B6D4',
    previewTitle: 'QUANTUM AI',
    previewSub: 'Autonomous Vector Cloud',
    populate: (c) => {
      const w = c.getWidth(), h = c.getHeight()
      c.backgroundColor = '#08090E'
      c.add(new Circle({ left: w * 0.62, top: -h * 0.14, radius: w * 0.34, fill: '#06B6D4', opacity: 0.22 }))
      c.add(new Circle({ left: -w * 0.12, top: h * 0.6, radius: w * 0.28, fill: '#14B8A6', opacity: 0.18 }))
      c.add(new Rect({ left: w * 0.08, top: h * 0.14, width: w * 0.84, height: h * 0.72, rx: 24, ry: 24, fill: '#11141C', stroke: '#06B6D4', strokeWidth: 2 }))
      c.add(new Rect({ left: w * 0.14, top: h * 0.22, width: 170, height: 34, rx: 17, ry: 17, fill: '#06B6D4' }))
      c.add(new IText('LERNEXAI V2.4', { left: w * 0.16, top: h * 0.22 + 8, fontSize: 13, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#08090E' }))
      c.add(new IText('AUTONOMOUS\nDESIGN ENGINE', { left: w * 0.14, top: h * 0.34, fontSize: Math.round(w * 0.068), fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#F8FAFC', lineHeight: 1.08 }))
      c.add(new IText('Zero-Latency WebGPU 8K • P2P CRDT Mesh • AES-256 Vault', { left: w * 0.14, top: h * 0.64, fontSize: Math.round(w * 0.024), fontFamily: 'Plus Jakarta Sans', fill: '#94A3B8' }))
    },
  },
  {
    id: 'bp-fintech-neo',
    title: 'NeoBank Titanium Card Promo',
    category: 'SaaS & AI',
    tag: 'FinTech',
    bg: '#0D0F17',
    accent: '#10B981',
    previewTitle: 'TITANIUM OS',
    previewSub: 'Zero-Fee Global Treasury',
    populate: (c) => {
      const w = c.getWidth(), h = c.getHeight()
      c.backgroundColor = '#0D0F17'
      c.add(new Rect({ left: w * 0.08, top: h * 0.12, width: w * 0.84, height: h * 0.76, rx: 28, ry: 28, fill: '#11141C', stroke: '#10B981', strokeWidth: 2 }))
      c.add(new IText('INSTANT TREASURY', { left: w * 0.14, top: h * 0.2, fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#10B981', charSpacing: 220 }))
      c.add(new IText('4.85% APY\nON AUTOPILOT', { left: w * 0.14, top: h * 0.28, fontSize: Math.round(w * 0.075), fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#F8FAFC', lineHeight: 1.06 }))
      c.add(new Rect({ left: w * 0.14, top: h * 0.62, width: 220, height: 54, rx: 14, ry: 14, fill: '#10B981' }))
      c.add(new IText('OPEN VAULT →', { left: w * 0.17, top: h * 0.62 + 16, fontSize: 18, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#08090E' }))
    },
  },
  {
    id: 'bp-devtools-cli',
    title: 'Developer SDK Release Banner',
    category: 'SaaS & AI',
    tag: 'DevTools',
    bg: '#08090E',
    accent: '#14B8A6',
    previewTitle: 'SDK v4.0',
    previewSub: 'Edge WASM Compiler',
    populate: (c) => {
      const w = c.getWidth(), h = c.getHeight()
      c.backgroundColor = '#08090E'
      c.add(new Rect({ left: w * 0.07, top: h * 0.15, width: w * 0.86, height: h * 0.7, rx: 20, ry: 20, fill: '#0D0F17', stroke: '#14B8A6', strokeWidth: 2 }))
      c.add(new IText('$ npx @lernexai/corex-init', { left: w * 0.13, top: h * 0.24, fontSize: Math.round(w * 0.028), fontFamily: 'JetBrains Mono', fontWeight: '700', fill: '#06B6D4' }))
      c.add(new IText('SHIP 10X FASTER\nAT THE EDGE.', { left: w * 0.13, top: h * 0.36, fontSize: Math.round(w * 0.066), fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#F8FAFC', lineHeight: 1.1 }))
      c.add(new IText('Sub-millisecond cold starts • Zero config • Native TypeScript', { left: w * 0.13, top: h * 0.66, fontSize: Math.round(w * 0.024), fontFamily: 'Plus Jakarta Sans', fill: '#94A3B8' }))
    },
  },
  {
    id: 'bp-yt-viral',
    title: 'High-CTR YouTube Masterclass',
    category: 'Social',
    tag: 'YouTube 16:9',
    bg: '#08090E',
    accent: '#F59E0B',
    previewTitle: '100X FASTER',
    previewSub: 'Full Architecture Breakdown',
    populate: (c) => {
      const w = c.getWidth(), h = c.getHeight()
      c.backgroundColor = '#08090E'
      c.add(new Circle({ left: w * 0.68, top: h * 0.08, radius: w * 0.26, fill: '#F59E0B', opacity: 0.25 }))
      c.add(new Rect({ left: w * 0.06, top: h * 0.12, width: 210, height: 44, rx: 10, ry: 10, fill: '#F43F5E' }))
      c.add(new IText('MUST WATCH', { left: w * 0.08, top: h * 0.12 + 11, fontSize: 18, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#F8FAFC' }))
      c.add(new IText('GOODBYE\nFIGMA?', { left: w * 0.06, top: h * 0.26, fontSize: Math.round(w * 0.105), fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#F8FAFC', lineHeight: 0.96 }))
      c.add(new IText('15 Serverless Engines Inside One Browser Tab', { left: w * 0.06, top: h * 0.72, fontSize: Math.round(w * 0.032), fontFamily: 'Plus Jakarta Sans', fontWeight: '700', fill: '#06B6D4' }))
    },
  },
  {
    id: 'bp-podcast-cover',
    title: 'Deep Tech Podcast Album Cover',
    category: 'Social',
    tag: 'Podcast 1:1',
    bg: '#0D0F17',
    accent: '#06B6D4',
    previewTitle: 'THE QUANTUM LAB',
    previewSub: 'Hosted by Sourav Maurya',
    populate: (c) => {
      const w = c.getWidth(), h = c.getHeight()
      c.backgroundColor = '#0D0F17'
      c.add(new Circle({ left: w * 0.5 - 180, top: h * 0.22, radius: 180, fill: 'transparent', stroke: '#06B6D4', strokeWidth: 3 }))
      c.add(new Circle({ left: w * 0.5 - 120, top: h * 0.28, radius: 120, fill: '#06B6D4', opacity: 0.2 }))
      c.add(new IText('EPISODE 42 • SEASON 03', { left: w * 0.12, top: h * 0.1, fontSize: 15, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#14B8A6', charSpacing: 200 }))
      c.add(new IText('QUANTUM\nFOUNDERS', { left: w * 0.12, top: h * 0.58, fontSize: Math.round(w * 0.088), fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#F8FAFC', lineHeight: 1.02 }))
      c.add(new IText('FEATURING LERNEXAI ENGINEERING', { left: w * 0.12, top: h * 0.84, fontSize: 16, fontFamily: 'Plus Jakarta Sans', fontWeight: '700', fill: '#94A3B8' }))
    },
  },
  {
    id: 'bp-flash-drop',
    title: 'Streetwear Cyber Drop Poster',
    category: 'Social',
    tag: 'Flash Drop',
    bg: '#08090E',
    accent: '#F43F5E',
    previewTitle: 'ARCHIVE 09',
    previewSub: 'Limited Edition Release',
    populate: (c) => {
      const w = c.getWidth(), h = c.getHeight()
      c.backgroundColor = '#08090E'
      c.add(new Rect({ left: w * 0.06, top: h * 0.06, width: w * 0.88, height: h * 0.88, fill: 'transparent', stroke: '#F43F5E', strokeWidth: 3 }))
      c.add(new IText('DROP // 009', { left: w * 0.12, top: h * 0.14, fontSize: 18, fontFamily: 'JetBrains Mono', fontWeight: '800', fill: '#F43F5E' }))
      c.add(new IText('CYBER\nATELIER', { left: w * 0.12, top: h * 0.28, fontSize: Math.round(w * 0.11), fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#F8FAFC', lineHeight: 0.96 }))
      c.add(new Rect({ left: w * 0.12, top: h * 0.68, width: w * 0.76, height: 64, rx: 12, ry: 12, fill: '#F43F5E' }))
      c.add(new IText('UNLOCK ACCESS • 60% OFF', { left: w * 0.18, top: h * 0.68 + 19, fontSize: 22, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#F8FAFC' }))
    },
  },
  {
    id: 'bp-swiss-museum',
    title: 'Zurich Architectural Exhibition',
    category: 'Editorial',
    tag: 'Swiss Grid',
    bg: '#F8FAFC',
    accent: '#08090E',
    previewTitle: 'NEUE GRAFIK',
    previewSub: 'Zurich Design Biennale',
    populate: (c) => {
      const w = c.getWidth(), h = c.getHeight()
      c.backgroundColor = '#F8FAFC'
      c.add(new Circle({ left: w * 0.1, top: h * 0.12, radius: Math.min(w, h) * 0.22, fill: '#F43F5E' }))
      c.add(new Circle({ left: w * 0.36, top: h * 0.12, radius: Math.min(w, h) * 0.22, fill: '#08090E', opacity: 0.9 }))
      c.add(new Rect({ left: w * 0.1, top: h * 0.6, width: w * 0.8, height: 4, fill: '#08090E' }))
      c.add(new IText('NEUE GRAFIK\nZÜRICH 2026', { left: w * 0.1, top: h * 0.64, fontSize: Math.round(w * 0.078), fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#08090E', lineHeight: 1.02 }))
      c.add(new IText('KUNSTHALLE • 14 OCTOBER – 28 NOVEMBER', { left: w * 0.1, top: h * 0.86, fontSize: 15, fontFamily: 'Plus Jakarta Sans', fontWeight: '700', fill: '#475569', charSpacing: 160 }))
    },
  },
  {
    id: 'bp-vogue-noir',
    title: 'Maison Noir Luxury Editorial',
    category: 'Editorial',
    tag: 'Editorial Serif',
    bg: '#08090E',
    accent: '#F59E0B',
    previewTitle: 'MAISON NOIR',
    previewSub: 'Autumn / Winter Collection',
    populate: (c) => {
      const w = c.getWidth(), h = c.getHeight()
      c.backgroundColor = '#08090E'
      c.add(new Rect({ left: w * 0.08, top: h * 0.08, width: w * 0.84, height: h * 0.84, fill: 'transparent', stroke: '#F59E0B', strokeWidth: 1.5 }))
      c.add(new IText('ISSUE N° 18 • PARIS / TOKYO', { left: w * 0.14, top: h * 0.16, fontSize: 13, fontFamily: 'Plus Jakarta Sans', fontWeight: '700', fill: '#F59E0B', charSpacing: 260 }))
      c.add(new IText('Maison\nLernex', { left: w * 0.14, top: h * 0.28, fontSize: Math.round(w * 0.115), fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: '700', fill: '#F8FAFC', lineHeight: 0.98 }))
      c.add(new IText('THE ARCHITECTURE OF DIGITAL HAUTE COUTURE', { left: w * 0.14, top: h * 0.76, fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '600', fill: '#94A3B8', charSpacing: 140 }))
    },
  },
  {
    id: 'bp-keynote-pitch',
    title: 'Series-A Venture Pitch Deck Cover',
    category: 'Keynote',
    tag: 'Pitch Deck',
    bg: '#08090E',
    accent: '#06B6D4',
    previewTitle: 'SERIES A DECK',
    previewSub: '$18M Seed Extension',
    populate: (c) => {
      const w = c.getWidth(), h = c.getHeight()
      c.backgroundColor = '#08090E'
      c.add(new Rect({ left: 0, top: 0, width: 16, height: h, fill: '#06B6D4' }))
      c.add(new IText('CONFIDENTIAL • INVESTOR BRIEFING', { left: w * 0.08, top: h * 0.14, fontSize: 14, fontFamily: 'JetBrains Mono', fontWeight: '700', fill: '#06B6D4', charSpacing: 180 }))
      c.add(new IText('REDEFINING\nCREATIVE COMPUTE.', { left: w * 0.08, top: h * 0.28, fontSize: Math.round(w * 0.072), fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#F8FAFC', lineHeight: 1.08 }))
      c.add(new Rect({ left: w * 0.08, top: h * 0.64, width: w * 0.25, height: 110, rx: 14, ry: 14, fill: '#11141C', stroke: '#1A1E2A', strokeWidth: 2 }))
      c.add(new IText('340%\nYoY Growth', { left: w * 0.1, top: h * 0.67, fontSize: 22, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#10B981' }))
      c.add(new Rect({ left: w * 0.36, top: h * 0.64, width: w * 0.25, height: 110, rx: 14, ry: 14, fill: '#11141C', stroke: '#1A1E2A', strokeWidth: 2 }))
      c.add(new IText('0.4ms\nFrame Latency', { left: w * 0.38, top: h * 0.67, fontSize: 22, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#06B6D4' }))
    },
  },
  {
    id: 'bp-keynote-roadmap',
    title: 'Q4 Engineering Architecture Slide',
    category: 'Keynote',
    tag: 'Roadmap',
    bg: '#0D0F17',
    accent: '#14B8A6',
    previewTitle: 'Q4 ROADMAP',
    previewSub: 'WebGPU + CRDT + Vault',
    populate: (c) => {
      const w = c.getWidth(), h = c.getHeight()
      c.backgroundColor = '#0D0F17'
      c.add(new IText('SYSTEMS ARCHITECTURE ROADMAP', { left: w * 0.08, top: h * 0.1, fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#14B8A6', charSpacing: 200 }))
      c.add(new IText('2026 QUANTUM MILESTONES', { left: w * 0.08, top: h * 0.16, fontSize: Math.round(w * 0.052), fontFamily: 'Plus Jakarta Sans', fontWeight: '800', fill: '#F8FAFC' }))
      const cols = [
        { title: 'PHASE 01', sub: 'WebGPU 8K Pipeline', col: '#06B6D4', x: 0.08 },
        { title: 'PHASE 02', sub: 'Lamport CRDT Mesh', col: '#14B8A6', x: 0.38 },
        { title: 'PHASE 03', sub: 'AES-GCM 256 Vault', col: '#10B981', x: 0.68 },
      ]
      cols.forEach((p) => {
        c.add(new Rect({ left: w * p.x, top: h * 0.34, width: w * 0.24, height: h * 0.48, rx: 18, ry: 18, fill: '#11141C', stroke: p.col, strokeWidth: 2 }))
        c.add(new IText(p.title, { left: w * p.x + 20, top: h * 0.4, fontSize: 14, fontFamily: 'JetBrains Mono', fontWeight: '800', fill: p.col }))
        c.add(new IText(p.sub, { left: w * p.x + 20, top: h * 0.48, fontSize: 20, fontFamily: 'Plus Jakarta Sans', fontWeight: '700', fill: '#F8FAFC' }))
      })
    },
  },
]

const CATEGORIES: BlueprintCategory[] = ['All', 'SaaS & AI', 'Social', 'Editorial', 'Keynote']

export function TemplatePanel() {
  const canvas = useFabricCanvas()
  const { snapshot, bumpBgNonce, syncLayersFromCanvas } = useEditorStore()
  const [category, setCategory] = useState<BlueprintCategory>('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return QUANTUM_BLUEPRINTS.filter((bp) => {
      const matchesCat = category === 'All' || bp.category === category
      const matchesSearch =
        !search.trim() ||
        bp.title.toLowerCase().includes(search.toLowerCase()) ||
        bp.tag.toLowerCase().includes(search.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [category, search])

  const loadBlueprint = (bp: QuantumBlueprintSpec) => {
    if (!canvas) return
    canvas.clear()
    bp.populate(canvas)
    canvas.getObjects().forEach((o: any, idx: number) => {
      if (!o.corexLabel) o.corexLabel = `${bp.title} Layer ${idx + 1}`
    })
    canvas.requestRenderAll()
    bumpBgNonce()
    snapshot()
    syncLayersFromCanvas()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', paddingBottom: 16 }}>
      <div className="panel-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Quantum Studio Blueprints</span>
        <span style={{ color: '#06B6D4', fontFamily: 'var(--font-mono)', fontSize: 9.5 }}>
          {filtered.length} Presets
        </span>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '4px 10px 6px', position: 'relative' }}>
        <Search size={12} color="#64748B" style={{ position: 'absolute', left: 18, top: 12 }} />
        <input
          className="input-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search SaaS, YouTube, Swiss, Deck…"
          style={{ paddingLeft: 26, fontSize: 11 }}
        />
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: 4, padding: '2px 10px 8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat) => {
          const active = category === cat
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '4px 9px',
                borderRadius: '0.5rem',
                fontSize: 10.5,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                border: '1px solid',
                borderColor: active ? '#06B6D4' : 'var(--color-base-600)',
                background: active ? 'rgba(6, 182, 212, 0.14)' : 'var(--color-base-800)',
                color: active ? '#A5F3FC' : 'var(--color-base-400)',
                transition: 'all 120ms',
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Blueprint Cards Grid */}
      <div style={{ padding: '2px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((bp) => (
          <motion.button
            key={bp.id}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadBlueprint(bp)}
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'var(--color-base-800)',
              border: '1px solid var(--color-base-600)',
              borderRadius: '0.75rem',
              padding: 10,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'border-color 150ms',
            }}
          >
            {/* Visual Mini Artboard Preview */}
            <div
              style={{
                width: 68,
                height: 52,
                borderRadius: '0.5rem',
                background: bp.bg,
                border: `1.5px solid ${bp.accent}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '4px 6px',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  fontSize: 7.5,
                  fontWeight: 800,
                  color: bp.bg === '#F8FAFC' ? '#08090E' : '#F8FAFC',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {bp.previewTitle}
              </div>
              <div
                style={{
                  width: 24,
                  height: 3,
                  borderRadius: 2,
                  background: bp.accent,
                  marginTop: 3,
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#F8FAFC',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {bp.title}
                </span>
              </div>
              <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 2 }}>{bp.previewSub}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: 'var(--font-mono)',
                    color: bp.accent,
                    background: 'rgba(6, 182, 212, 0.08)',
                    padding: '1px 6px',
                    borderRadius: 4,
                  }}
                >
                  {bp.tag}
                </span>
                <span style={{ fontSize: 9.5, color: '#64748B', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Sparkles size={9} color="#06B6D4" /> Editable Vector Nodes
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
