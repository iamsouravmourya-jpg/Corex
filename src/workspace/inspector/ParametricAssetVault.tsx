import { useState } from 'react'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import { addEmoji, addRect, addCircle, addTriangle } from '@/lib/shapes'
import {
  addStarPolygon,
  addRegularPolygon,
  addIsometricCube,
  addProceduralMesh,
  addVectorQrBadge,
} from '@/lib/vectorStudio'
import { motion } from 'framer-motion'
import { QrCode } from 'lucide-react'

const COREX_GLYPH_COLLECTIONS: { label: string; icon: string; glyphs: string[] }[] = [
  {
    label: 'Tech & AI',
    icon: '⚡',
    glyphs: ['⚡','🚀','🤖','✨','💎','🔮','🧬','🛰️','🪐','🌌','💻','🖥️','⌨️','🖱️','📱','🔋','📡','🔭','🔬','🧪','⚙️','🧲','💡','🔦','🛡️','🔑','🎯','♾️'],
  },
  {
    label: 'Reactions',
    icon: '🔥',
    glyphs: ['🔥','💯','🎉','🎊','🏆','🥇','👑','🌟','⭐','💫','💥','❤️','🧡','💛','💚','💙','💜','🖤','🤍','💖','💘','💝','🙌','👏','🤝','👍','🫶','✌️'],
  },
  {
    label: 'Expressions',
    icon: '😎',
    glyphs: ['😀','😄','😁','😆','🤣','😂','🙂','😊','😇','🥰','😍','🤩','😘','😋','😜','🤪','😎','🤓','🧐','🥳','🤯','🤠','🫡','🤫','🤔','😌','😴','👻'],
  },
  {
    label: 'Signals & UI',
    icon: '📌',
    glyphs: ['📌','📍','🔔','📣','📢','💬','💭','🗯️','✅','☑️','✔️','❌','⚠️','🚫','♻️','⬆️','↗️','➡️','↘️','⬇️','↙️','⬅️','↖️','🔄','⏩','⏪','▶️','⏸️'],
  },
  {
    label: 'Commerce',
    icon: '💰',
    glyphs: ['💰','💵','💴','💶','💷','💳','🪙','📈','📉','📊','📋','📁','📂','📅','📆','📇','📎','📏','📐','✂️','🔒','🔓','🏷️','🛍️','🎁','📦','📫','🧾'],
  },
  {
    label: 'Nature & Eco',
    icon: '🌿',
    glyphs: ['🌿','🌱','🍃','🌸','🌺','🌻','🌹','🌷','🌼','🪷','🌴','🌲','🌳','🌵','🍁','🍂','🍄','🌊','❄️','☀️','🌈','🌙','🌎','🌍','🌏','🦋','🐝','🐬'],
  },
  {
    label: 'Media & Art',
    icon: '🎨',
    glyphs: ['🎨','🖌️','🖍️','✏️','✒️','🖋️','🎬','🎤','🎧','🎼','🎹','🥁','🎷','🎺','🎸','🎻','🎲','🎯','🎳','🎮','🕹️','🎰','📷','📸','📹','🎥','📽️','🎞️'],
  },
  {
    label: 'Lifestyle',
    icon: '☕',
    glyphs: ['☕','🍵','🧋','🥤','🍕','🍔','🍟','🌮','🍣','🍱','🍜','🍩','🍪','🎂','🍰','🧁','🍫','🍿','✈️','⛵','🏔️','🏖️','🏛️','🗽','🗼','🎢','🎡','🏕️'],
  },
]

export function StickerPanel() {
  const canvas = useFabricCanvas()
  const [selectedGroup, setSelectedGroup] = useState(0)
  const [query, setQuery] = useState('')
  const [qrUrl, setQrUrl] = useState('https://lernexai.com')

  const insertGlyph = (glyph: string) => {
    if (!canvas) return
    addEmoji(glyph, canvas)
  }

  const allGlyphs = COREX_GLYPH_COLLECTIONS.flatMap((g) => g.glyphs)
  const visibleGlyphs = query
    ? allGlyphs.filter((g) => g.includes(query))
    : COREX_GLYPH_COLLECTIONS[selectedGroup]?.glyphs || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      {/* Parametric Polygons & 3D Vectors */}
      <div className="panel-heading">Parametric Polygons & 3D</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, padding: '4px 10px 6px' }}>
        <button onClick={() => canvas && addRegularPolygon(canvas, 6, 84, '#06B6D4', 'Hexagon')} className="btn-base" style={{ height: 28, fontSize: 11 }}>
          ⬢ Hexagon
        </button>
        <button onClick={() => canvas && addRegularPolygon(canvas, 8, 84, '#14B8A6', 'Octagon')} className="btn-base" style={{ height: 28, fontSize: 11 }}>
          ⯃ Octagon
        </button>
        <button onClick={() => canvas && addStarPolygon(canvas, 5, 90, 42, '#F59E0B', '5-Star')} className="btn-base" style={{ height: 28, fontSize: 11 }}>
          ★ 5-Star
        </button>
        <button onClick={() => canvas && addStarPolygon(canvas, 8, 92, 54, '#06B6D4', '8-Point Seal')} className="btn-base" style={{ height: 28, fontSize: 11 }}>
          ✴ 8-Seal
        </button>
        <button onClick={() => canvas && addIsometricCube(canvas)} className="btn-base" style={{ height: 28, fontSize: 11 }}>
          🧊 3D Cube
        </button>
        <button onClick={() => canvas && addProceduralMesh(canvas, 'golden-spiral')} className="btn-base" style={{ height: 28, fontSize: 11 }}>
          🌀 φ Spiral
        </button>
      </div>

      {/* Corel / Illustrator Procedural Vector Meshes */}
      <div className="panel-heading" style={{ paddingTop: 4 }}>Procedural Vector Meshes</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, padding: '4px 10px 6px' }}>
        <button onClick={() => canvas && addProceduralMesh(canvas, 'cyber-wave')} className="btn-base" style={{ height: 28, fontSize: 10.5 }}>
          〰 Wave Mesh
        </button>
        <button onClick={() => canvas && addProceduralMesh(canvas, 'guilloche')} className="btn-base" style={{ height: 28, fontSize: 10.5 }}>
          ❁ Guilloche
        </button>
        <button onClick={() => canvas && addProceduralMesh(canvas, 'concentric-halo')} className="btn-base" style={{ height: 28, fontSize: 10.5 }}>
          ◎ Halo Rings
        </button>
        <button onClick={() => canvas && addRect(canvas)} className="btn-base" style={{ height: 28, fontSize: 10.5 }}>
          ▢ Card
        </button>
        <button onClick={() => canvas && addCircle(canvas)} className="btn-base" style={{ height: 28, fontSize: 10.5 }}>
          ◯ Orb
        </button>
        <button onClick={() => canvas && addTriangle(canvas)} className="btn-base" style={{ height: 28, fontSize: 10.5 }}>
          △ Prism
        </button>
      </div>

      {/* Client-Side Vector QR Code Generator */}
      <div className="panel-heading" style={{ paddingTop: 4 }}>Vector QR Code Studio</div>
      <div style={{ display: 'flex', gap: 5, padding: '4px 10px 8px' }}>
        <input
          className="input-base"
          value={qrUrl}
          onChange={(e) => setQrUrl(e.target.value)}
          placeholder="https://lernexai.com"
          style={{ flex: 1, fontSize: 11 }}
        />
        <button
          onClick={() => canvas && addVectorQrBadge(canvas, qrUrl || 'https://lernexai.com')}
          className="btn-primary btn-base"
          style={{ height: 30, padding: '0 10px', fontSize: 11 }}
          title="Insert Scalable Vector QR Code"
        >
          <QrCode size={12} />
          <span>QR</span>
        </button>
      </div>

      {/* Search Glyphs */}
      <div style={{ padding: '2px 10px 6px' }}>
        <input
          className="input-base"
          placeholder="Filter studio glyphs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Category Selector */}
      {!query && (
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            padding: '0 10px 6px',
            gap: 4,
            scrollbarWidth: 'none',
            flexShrink: 0,
          }}
        >
          {COREX_GLYPH_COLLECTIONS.map((group, idx) => (
            <button
              key={group.label}
              onClick={() => setSelectedGroup(idx)}
              title={group.label}
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: '0.5rem',
                border: '1px solid',
                borderColor: selectedGroup === idx ? 'var(--color-accent-cyan)' : 'var(--color-base-600)',
                background: selectedGroup === idx ? 'rgba(6, 182, 212, 0.14)' : 'var(--color-base-750)',
                cursor: 'pointer',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 120ms',
              }}
            >
              {group.icon}
            </button>
          ))}
        </div>
      )}

      {!query && (
        <div className="panel-heading" style={{ paddingTop: 2 }}>
          {COREX_GLYPH_COLLECTIONS[selectedGroup]?.label} ({COREX_GLYPH_COLLECTIONS[selectedGroup]?.glyphs.length})
        </div>
      )}

      {/* Glyph Grid */}
      <div
        style={{
          padding: '4px 10px 12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 3,
        }}
      >
        {visibleGlyphs.map((glyph, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => insertGlyph(glyph)}
            style={{
              width: '100%',
              aspectRatio: '1',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '0.375rem',
              fontSize: 19,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-base-700)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            title={glyph}
          >
            {glyph}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
