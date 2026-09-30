import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Tabs from '@radix-ui/react-tabs'
import { PropertiesPanel } from './PropertiesPanel'
import { LayersPanel } from './LayersPanel'
import { TemplatePanel } from './TemplatePanel'
import { ProjectsPanel } from './ProjectsPanel'
import { StickerPanel } from './StickerPanel'
import { QuantumLabPanel } from './QuantumLabPanel'
import { AiChatPanel } from '@/components/ai/AiChatPanel'
import { useEditorStore } from '@/store/editorStore'
import { panelVariants } from '@/lib/motion'

const STUDIO_INSPECTOR_TABS = [
  { id: 'properties', label: 'Inspector' },
  { id: 'quantum',    label: '⚡ Quantum' },
  { id: 'layers',     label: 'Hierarchy' },
  { id: 'templates',  label: 'Blueprints' },
  { id: 'emoji',      label: 'Vectors' },
  { id: 'projects',   label: 'Vault' },
]

export function RightPanel() {
  const [activeTab, setActiveTab] = useState('properties')
  const { isAiModeOpen } = useEditorStore()

  return (
    <motion.aside
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
      style={{
        width: 288,
        background: 'var(--color-base-875)',
        borderLeft: '1px solid var(--color-base-600)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Tabs.Root
        value={activeTab}
        onValueChange={setActiveTab}
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Tabs.List
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-base-600)',
            background: 'var(--color-base-875)',
            flexShrink: 0,
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {STUDIO_INSPECTOR_TABS.map((tab) => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              style={{
                flex: 1,
                minWidth: 0,
                height: 38,
                fontSize: 10,
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--color-accent-cyan)' : 'var(--color-base-500)',
                background: activeTab === tab.id ? 'rgba(6, 182, 212, 0.06)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id
                  ? '2px solid var(--color-accent-cyan)'
                  : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 150ms',
                padding: '0 3px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ height: '100%' }}
            >
              <Tabs.Content value="properties" forceMount style={{ display: activeTab === 'properties' ? 'block' : 'none', height: '100%' }}>
                <PropertiesPanel />
              </Tabs.Content>
              <Tabs.Content value="quantum" forceMount style={{ display: activeTab === 'quantum' ? 'block' : 'none', height: '100%' }}>
                <QuantumLabPanel />
              </Tabs.Content>
              <Tabs.Content value="layers" forceMount style={{ display: activeTab === 'layers' ? 'block' : 'none', height: '100%' }}>
                <LayersPanel />
              </Tabs.Content>
              <Tabs.Content value="templates" forceMount style={{ display: activeTab === 'templates' ? 'block' : 'none', height: '100%' }}>
                <TemplatePanel />
              </Tabs.Content>
              <Tabs.Content value="emoji" forceMount style={{ display: activeTab === 'emoji' ? 'flex' : 'none', flexDirection: 'column', height: '100%' }}>
                <StickerPanel />
              </Tabs.Content>
              <Tabs.Content value="projects" forceMount style={{ display: activeTab === 'projects' ? 'block' : 'none', height: '100%' }}>
                <ProjectsPanel />
              </Tabs.Content>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs.Root>

      <AnimatePresence>
        {isAiModeOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 100,
            }}
          >
            <AiChatPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}
