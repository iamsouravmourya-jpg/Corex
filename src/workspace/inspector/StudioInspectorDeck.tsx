/**
 * LernexAI Proprietary — Next-Gen Collapsible Right Inspector & AI Studio Dock
 * Features a 3-mode spacious header (Inspector, Hierarchy, AI Studio) + Slide-In/Out Toggle.
 */
import { motion, AnimatePresence } from 'framer-motion'
import {
  SlidersHorizontal,
  Layers,
  Sparkles,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react'
import { PropertiesPanel } from './LayerParameterMatrix'
import { LayersPanel } from './SceneNodeTree'
import { AiChatPanel } from '@/components/ai/AiChatPanel'
import { useEditorStore, type RightInspectorTab } from '@/store/editorStore'
import { panelVariants } from '@/lib/motion'

export function RightPanel() {
  const {
    rightActiveTab,
    setRightActiveTab,
    isRightPanelOpen,
    toggleRightPanel,
    layers,
  } = useEditorStore()

  const TABS: { id: RightInspectorTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'properties',
      label: 'Inspector',
      icon: <SlidersHorizontal size={13} strokeWidth={1.8} />,
    },
    {
      id: 'layers',
      label: 'Hierarchy',
      icon: <Layers size={13} strokeWidth={1.8} />,
      badge: layers.length,
    },
    {
      id: 'ai',
      label: 'AI Studio',
      icon: <Sparkles size={13} strokeWidth={1.8} />,
    },
  ]

  return (
    <div style={{ display: 'flex', height: '100%', flexShrink: 0, position: 'relative', zIndex: 30 }}>
      {/* Floating Expand Trigger when Right Panel is Collapsed */}
      {!isRightPanelOpen && (
        <div
          style={{
            width: 40,
            background: '#0D0F17',
            borderLeft: '1px solid var(--color-base-600)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 10,
            gap: 8,
          }}
        >
          <button
            onClick={toggleRightPanel}
            title="Expand Right Inspector"
            style={{
              width: 30,
              height: 30,
              borderRadius: '0.5rem',
              background: '#11141C',
              border: '1px solid var(--color-base-600)',
              color: '#06B6D4',
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
              background: '#0D0F17',
              borderLeft: '1px solid var(--color-base-600)',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Spacious 3-Mode Segmented Header + Collapse Button */}
            <div
              style={{
                padding: '8px 10px',
                borderBottom: '1px solid var(--color-base-600)',
                background: '#11141C',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
                width: 320,
              }}
            >
              <div
                role="tablist"
                style={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 4,
                  padding: 3,
                  borderRadius: '0.5rem',
                  background: '#08090E',
                  border: '1px solid var(--color-base-600)',
                }}
              >
                {TABS.map((tab) => {
                  const active = rightActiveTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setRightActiveTab(tab.id)}
                      style={{
                        height: 28,
                        borderRadius: 6,
                        border: 'none',
                        background: active
                          ? tab.id === 'ai'
                            ? 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)'
                            : 'rgba(6, 182, 212, 0.16)'
                          : 'transparent',
                        color: active
                          ? tab.id === 'ai'
                            ? '#08090E'
                            : '#22D3EE'
                          : '#94A3B8',
                        fontSize: 11,
                        fontWeight: active ? 700 : 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 5,
                        cursor: 'pointer',
                        transition: 'all 140ms ease',
                      }}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      {typeof tab.badge === 'number' && tab.badge > 0 && (
                        <span
                          style={{
                            fontSize: 9.5,
                            fontFamily: 'var(--font-mono)',
                            color: active ? '#22D3EE' : '#64748B',
                          }}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={toggleRightPanel}
                title="Collapse Right Inspector"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: '#1A1E2A',
                  border: '1px solid var(--color-base-600)',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <PanelRightClose size={13} />
              </button>
            </div>

            {/* Active Tab Content */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', width: 320 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={rightActiveTab}
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ height: '100%' }}
                >
                  {rightActiveTab === 'properties' && <PropertiesPanel />}
                  {rightActiveTab === 'layers' && <LayersPanel />}
                  {rightActiveTab === 'ai' && <AiChatPanel />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
