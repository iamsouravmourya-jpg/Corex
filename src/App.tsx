import { TopBar as StudioActionHeader } from '@/workspace/header/StudioActionHeader'
import { Toolbar as VectorToolRail } from '@/workspace/dock/VectorToolRail'
import { CanvasBoard as QuantumStageCanvas } from '@/workspace/stage/QuantumStageCanvas'
import { RightPanel as StudioInspectorDeck } from '@/workspace/inspector/StudioInspectorDeck'
import { StatusBar as StageTelemetryFooter } from '@/workspace/telemetry/StageTelemetryFooter'
import { LandingPage } from '@/components/landing/LandingPage'
import { useStudioKeybindings } from '@/hooks/useStudioKeybindings'
import { useEditorStore } from '@/store/editorStore'

function QuantumStudioShell() {
  useStudioKeybindings()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--color-base-900)',
      }}
    >
      <StudioActionHeader />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <VectorToolRail />
        <QuantumStageCanvas />
        <StudioInspectorDeck />
      </div>
      <StageTelemetryFooter />
    </div>
  )
}

export default function App() {
  const currentView = useEditorStore((s) => s.currentView)

  if (currentView === 'landing') {
    return <LandingPage />
  }

  return <QuantumStudioShell />
}
