import { TopBar } from '@/components/topbar/TopBar'
import { Toolbar } from '@/components/toolbar/Toolbar'
import { CanvasBoard } from '@/components/canvas/CanvasBoard'
import { RightPanel } from '@/components/panels/RightPanel'
import { StatusBar } from '@/components/statusbar/StatusBar'
import { LandingPage } from '@/components/landing/LandingPage'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useEditorStore } from '@/store/editorStore'

function EditorLayout() {
  useKeyboardShortcuts()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--color-base-900)' }}>
      <TopBar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Toolbar />
        <CanvasBoard />
        <RightPanel />
      </div>
      <StatusBar />
    </div>
  )
}

export default function App() {
  const currentView = useEditorStore((s) => s.currentView)

  if (currentView === 'landing') {
    return <LandingPage />
  }

  return <EditorLayout />
}
