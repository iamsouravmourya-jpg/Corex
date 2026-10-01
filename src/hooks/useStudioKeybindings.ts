/**
 * LernexAI Proprietary — Quantum Studio Hotkey Dispatcher
 */
import { useHotkeys } from 'react-hotkeys-hook'
import { ActiveSelection } from 'fabric'
import { useEditorStore } from '@/store/editorStore'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import {
  duplicateActiveObject,
  addRect,
  addCircle,
  addIText,
  enablePencil,
} from '@/lib/shapes'
import { copyActive, cutActive, pasteClipboard, moveZOrder } from '@/lib/clipboard'
import { copyStyle, pasteStyle } from '@/lib/style'
import { optimizeStageGeometry, auditAndHealCanvasContrast } from '@/lib/quantumEngine'
import { addIsometricCube, addVectorQrBadge } from '@/lib/vectorStudio'

export function useStudioKeybindings() {
  const stage = useFabricCanvas()
  const { undo, redo, setActiveTool } = useEditorStore()

  // Binary Ledger Undo / Redo
  useHotkeys(
    'ctrl+z, meta+z',
    (ev) => {
      ev.preventDefault()
      void undo()
    },
    { enableOnFormTags: false },
  )
  useHotkeys(
    'ctrl+shift+z, meta+shift+z, ctrl+y, meta+y',
    (ev) => {
      ev.preventDefault()
      void redo()
    },
    { enableOnFormTags: false },
  )

  // Node Removal
  useHotkeys(
    'delete, backspace',
    (ev) => {
      const target = stage?.getActiveObject()
      if (!target || (target as any).isEditing) return
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      ev.preventDefault()
      stage?.remove(target)
      stage?.requestRenderAll()
      useEditorStore.getState().syncLayersFromCanvas()
    },
    { enableOnFormTags: false },
  )

  // Offset Clone
  useHotkeys('ctrl+d, meta+d', (ev) => {
    ev.preventDefault()
    if (stage) duplicateActiveObject(stage)
  })

  // Clipboard Buffer Operations
  useHotkeys(
    'ctrl+c, meta+c',
    (ev) => {
      if (ev.altKey) return
      ev.preventDefault()
      if (stage) void copyActive(stage)
    },
    { enableOnFormTags: false },
  )
  useHotkeys(
    'ctrl+x, meta+x',
    (ev) => {
      ev.preventDefault()
      if (stage) void cutActive(stage)
    },
    { enableOnFormTags: false },
  )
  useHotkeys(
    'ctrl+v, meta+v',
    (ev) => {
      if (ev.altKey) return
      ev.preventDefault()
      if (stage) void pasteClipboard(stage)
    },
    { enableOnFormTags: false },
  )

  // Visual Attribute Cloning
  useHotkeys(
    'ctrl+alt+c, meta+alt+c',
    (ev) => {
      ev.preventDefault()
      const target = stage?.getActiveObject()
      if (target) copyStyle(target)
    },
    { enableOnFormTags: false },
  )
  useHotkeys(
    'ctrl+alt+v, meta+alt+v',
    (ev) => {
      ev.preventDefault()
      const target = stage?.getActiveObject()
      if (!stage || !pasteStyle(target)) return
      stage.requestRenderAll()
      useEditorStore.getState().snapshotSoon()
    },
    { enableOnFormTags: false },
  )

  // Z-Index Hierarchy Stack
  useHotkeys(
    'ctrl+], meta+]',
    (ev) => {
      ev.preventDefault()
      if (stage) moveZOrder(stage, 'forward')
    },
    { enableOnFormTags: false },
  )
  useHotkeys(
    'ctrl+[, meta+[',
    (ev) => {
      ev.preventDefault()
      if (stage) moveZOrder(stage, 'backward')
    },
    { enableOnFormTags: false },
  )
  useHotkeys(
    'ctrl+shift+], meta+shift+]',
    (ev) => {
      ev.preventDefault()
      if (stage) moveZOrder(stage, 'front')
    },
    { enableOnFormTags: false },
  )
  useHotkeys(
    'ctrl+shift+[, meta+shift+[',
    (ev) => {
      ev.preventDefault()
      if (stage) moveZOrder(stage, 'back')
    },
    { enableOnFormTags: false },
  )

  // Multi-Node Selection
  useHotkeys('ctrl+a, meta+a', (ev) => {
    ev.preventDefault()
    if (!stage) return
    const nodes = stage.getObjects()
    if (nodes.length === 0) return
    stage.discardActiveObject()
    const multiSel = new ActiveSelection(nodes, { canvas: stage })
    stage.setActiveObject(multiSel)
    stage.requestRenderAll()
  })

  useHotkeys('escape', () => {
    stage?.discardActiveObject()
    stage?.requestRenderAll()
  })

  // Coordinate Grid Overlay
  useHotkeys(
    "ctrl+', meta+'",
    (ev) => {
      ev.preventDefault()
      useEditorStore.getState().toggleGrid()
    },
    { enableOnFormTags: false },
  )

  // Primary Vector Tool Activation
  useHotkeys('v', () => {
    setActiveTool('select')
    if (stage) stage.isDrawingMode = false
  })
  useHotkeys('r', () => {
    if (stage) {
      addRect(stage)
      setActiveTool('select')
    }
  })
  useHotkeys('c', () => {
    if (stage) {
      addCircle(stage)
      setActiveTool('select')
    }
  })
  useHotkeys('t', () => {
    if (stage) {
      addIText(stage)
      setActiveTool('select')
    }
  })
  useHotkeys('p', () => {
    if (stage) {
      enablePencil(stage)
      setActiveTool('pencil')
    }
  })

  // Quantum Studio Exclusive Hotkeys
  useHotkeys(
    'shift+o',
    (ev) => {
      ev.preventDefault()
      if (stage) optimizeStageGeometry(stage)
    },
    { enableOnFormTags: false },
  )
  useHotkeys(
    'shift+h',
    (ev) => {
      ev.preventDefault()
      if (stage) auditAndHealCanvasContrast(stage, true)
    },
    { enableOnFormTags: false },
  )
  useHotkeys(
    'shift+i',
    (ev) => {
      ev.preventDefault()
      if (stage) addIsometricCube(stage)
    },
    { enableOnFormTags: false },
  )
  useHotkeys(
    'shift+q',
    (ev) => {
      ev.preventDefault()
      if (stage) addVectorQrBadge(stage, 'https://lernexai.com')
    },
    { enableOnFormTags: false },
  )

  // Precision Coordinate Translation
  const translateActiveNode = (dx: number, dy: number) => {
    const active = stage?.getActiveObject()
    if (!active || !stage) return
    active.set({ left: (active.left || 0) + dx, top: (active.top || 0) + dy })
    stage.requestRenderAll()
    useEditorStore.getState().snapshotSoon()
  }

  useHotkeys('up', (ev) => { ev.preventDefault(); translateActiveNode(0, -1) }, { enableOnFormTags: false })
  useHotkeys('down', (ev) => { ev.preventDefault(); translateActiveNode(0, 1) }, { enableOnFormTags: false })
  useHotkeys('left', (ev) => { ev.preventDefault(); translateActiveNode(-1, 0) }, { enableOnFormTags: false })
  useHotkeys('right', (ev) => { ev.preventDefault(); translateActiveNode(1, 0) }, { enableOnFormTags: false })
  useHotkeys('shift+up', (ev) => { ev.preventDefault(); translateActiveNode(0, -10) }, { enableOnFormTags: false })
  useHotkeys('shift+down', (ev) => { ev.preventDefault(); translateActiveNode(0, 10) }, { enableOnFormTags: false })
  useHotkeys('shift+left', (ev) => { ev.preventDefault(); translateActiveNode(-10, 0) }, { enableOnFormTags: false })
  useHotkeys('shift+right', (ev) => { ev.preventDefault(); translateActiveNode(10, 0) }, { enableOnFormTags: false })
}
