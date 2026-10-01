/**
 * LernexAI Proprietary — Unified Right Properties & Tool Settings Deck
 * Dedicated exclusively to core operational properties and active layer controls
 * (Layers tree lives on the Left navigation framework; AI & Quantum float over stage).
 */
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { PropertiesPanel } from './LayerParameterMatrix'
import { useEditorStore } from '@/store/editorStore'

export function RightPanel() {
  const { isRightPanelOpen, toggleRightPanel, activeObjectId } = useEditorStore()

  return (
    <div style={{ display: 'flex', height: '100%', flexShrink: 0, position: 'relative', zIndex: 30 }}>
      {!isRightPanelOpen && (
        <div
          style={{
            width: 44,
            background: '#0C0E16',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 12,
          }}
        >
          <button
            onClick={toggleRightPanel}
            title="Expand Properties Deck"
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: '#141826',
              border: 'none',
              color: '#22D3EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <PanelRightOpen size={15} />
          </button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {isRightPanelOpen && (
          <motion.aside
            key="right-inspector-dock"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: '#0C0E16',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Minimal Borderless Header */}
            <div
              style={{
                padding: '16px 18px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
                width: 320,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SlidersHorizontal size={14} color="#06B6D4" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>
                  {activeObjectId ? 'Layer Properties' : 'Stage & Canvas'}
                </span>
              </div>

              <button
                onClick={toggleRightPanel}
                title="Hide Properties Deck"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  background: '#141826',
                  border: 'none',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <PanelRightClose size={14} />
              </button>
            </div>

            {/* Unified Properties Stream */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', width: 320 }}>
              <PropertiesPanel />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
