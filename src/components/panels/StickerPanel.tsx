import { useState } from 'react'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import { addEmoji, addRect, addCircle, addTriangle } from '@/lib/shapes'
import { motion } from 'framer-motion'

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

  const insertGlyph = (glyph: string) => {
    if (!canvas) return
    addEmoji(glyph, canvas)
  }

  const allGlyphs = COREX_GLYPH_COLLECTIONS.flatMap((g) => g.glyphs)
  const visibleGlyphs = query
    ? allGlyphs.filter((g) => g.includes(query))
    : COREX_GLYPH_COLLECTIONS[selectedGroup]?.glyphs || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Quick Vector Primitives */}
      <div className="panel-heading">Vector Primitives</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: '4px 10px 8px' }}>
        <button
          onClick={() => canvas && addRect(canvas)}
          className="btn-base"
          style={{ height: 28, fontSize: 11 }}
        >
          ▢ Card
        </button>
        <button
          onClick={() => canvas && addCircle(canvas)}
          className="btn-base"
          style={{ height: 28, fontSize: 11 }}
        >
          ◯ Orb
        </button>
        <button
          onClick={() => canvas && addTriangle(canvas)}
          className="btn-base"
          style={{ height: 28, fontSize: 11 }}
        >
          △ Prism
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '4px 10px 6px' }}>
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
        <div className="panel-heading" style={{ paddingTop: 4 }}>
          {COREX_GLYPH_COLLECTIONS[selectedGroup]?.label} ({COREX_GLYPH_COLLECTIONS[selectedGroup]?.glyphs.length})
        </div>
      )}

      {/* Glyph Grid */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '4px 10px 10px',
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
