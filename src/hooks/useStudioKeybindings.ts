/**
 * Corex Studio by LernexAI — Pro-Studio Keyboard Matrix
 * Uses Figma/Sketch-inspired studio chords (Shift+G grid, Alt+S/P style sampler,
 * O for Oval/Ellipse, B for Brush, L for Line, F for Floating Elements).
 */
import { useEffect } from 'react'
import { ActiveSelection } from 'fabric'
import { useEditorStore } from '@/store/editorStore'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import {
  duplicateActiveObject,
  addRect,
  addCircle,
  addLine,
  addIText,
  enablePencil,
} from '@/lib/shapes'
import { copyActive, cutActive, pasteClipboard, moveZOrder } from '@/lib/clipboard'
import { copyStyle, pasteStyle } from '@/lib/style'
import {
  optimizeStageGeometry,
  auditAndHealCanvasContrast,
  applyProceduralShaderBackground,
} from '@/lib/quantumEngine'
import { addIsometricCube, addVectorQrBadge } from '@/lib/vectorStudio'

function isEditableElementActive(): boolean {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el as HTMLElement).isContentEditable
}

export function useStudioKeybindings() {
  const stage = useFabricCanvas()
  const { undo, redo, setActiveTool, toggleFloatingWindow } = useEditorStore()

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      const activeObj = stage?.getActiveObject() as any
      const editingTextOnStage = Boolean(activeObj && activeObj.isEditing)
      const inFormField = isEditableElementActive()

      const cmd = ev.metaKey || ev.ctrlKey
      const shift = ev.shiftKey
      const alt = ev.altKey
      const key = ev.key.toLowerCase()

      if (inFormField || editingTextOnStage) {
        if (key === 'escape' && stage) {
          stage.discardActiveObject()
          stage.requestRenderAll()
        }
        return
      }

      // 1. Binary DEFLATE Ledger Undo / Redo (⌘Z / ⌘⇧Z / ⌘Y)
      if (cmd && !alt && key === 'z') {
        ev.preventDefault()
        if (shift) {
          void redo()
        } else {
          void undo()
        }
        return
      }
      if (cmd && !alt && key === 'y') {
        ev.preventDefault()
        void redo()
        return
      }

      // 2. Pro-Studio Visual Style Sampler & Applicator (Alt+S to Sample, Alt+P to Apply)
      if (!cmd && alt && !shift && key === 's') {
        ev.preventDefault()
        if (activeObj) copyStyle(activeObj)
        return
      }
      if (!cmd && alt && !shift && key === 'p') {
        ev.preventDefault()
        if (stage && activeObj && pasteStyle(activeObj)) {
          stage.requestRenderAll()
          useEditorStore.getState().snapshotSoon()
        }
        return
      }

      // 3. Scene Node Copy / Cut / Paste / Duplicate / Select All
      if (cmd && !alt && key === 'c') {
        ev.preventDefault()
        if (stage) void copyActive(stage)
        return
      }
      if (cmd && !alt && key === 'x') {
        ev.preventDefault()
        if (stage) void cutActive(stage)
        return
      }
      if (cmd && !alt && key === 'v') {
        ev.preventDefault()
        if (stage) void pasteClipboard(stage)
        return
      }
      if (cmd && !alt && key === 'd') {
        ev.preventDefault()
        if (stage) duplicateActiveObject(stage)
        return
      }
      if (cmd && !alt && key === 'a') {
        ev.preventDefault()
        if (!stage) return
        const nodes = stage.getObjects()
        if (nodes.length === 0) return
        stage.discardActiveObject()
        stage.setActiveObject(new ActiveSelection(nodes, { canvas: stage }))
        stage.requestRenderAll()
        return
      }

      // 4. Z-Index Hierarchy Stack (⌘] / ⌘[ / ⌘⇧] / ⌘⇧[)
      if (cmd && (ev.key === ']' || ev.key === '}')) {
        ev.preventDefault()
        if (stage) moveZOrder(stage, shift ? 'front' : 'forward')
        return
      }
      if (cmd && (ev.key === '[' || ev.key === '{')) {
        ev.preventDefault()
        if (stage) moveZOrder(stage, shift ? 'back' : 'backward')
        return
      }

      // 5. Node Deletion
      if (ev.key === 'Delete' || ev.key === 'Backspace') {
        if (!activeObj || !stage) return
        ev.preventDefault()
        stage.remove(activeObj)
        stage.requestRenderAll()
        useEditorStore.getState().syncLayersFromCanvas()
        return
      }

      // 6. Escape Selection
      if (ev.key === 'Escape') {
        stage?.discardActiveObject()
        stage?.requestRenderAll()
        return
      }

      // 7. Studio Shift Chords (Shift+G Grid, Shift+O Optimize, Shift+H Contrast, Shift+M GLSL Shader, Shift+I Cube, Shift+Q QR)
      if (shift && !cmd && !alt) {
        if (key === 'g') {
          ev.preventDefault()
          useEditorStore.getState().toggleGrid()
          return
        }
        if (key === 'o' && stage) {
          ev.preventDefault()
          optimizeStageGeometry(stage)
          return
        }
        if (key === 'h' && stage) {
          ev.preventDefault()
          auditAndHealCanvasContrast(stage, true)
          return
        }
        if (key === 'm' && stage) {
          ev.preventDefault()
          void applyProceduralShaderBackground(stage, 'aurora-plasma')
          return
        }
        if (key === 'i' && stage) {
          ev.preventDefault()
          addIsometricCube(stage)
          return
        }
        if (key === 'q' && stage) {
          ev.preventDefault()
          addVectorQrBadge(stage, 'https://lernexai.com')
          return
        }
      }

      // 8. Pro-Studio Single-Key Vector Tool Switching (V / R / O / L / T / B / F)
      if (!cmd && !alt && !shift) {
        if (key === 'v') {
          setActiveTool('select')
          if (stage) stage.isDrawingMode = false
          return
        }
        if (key === 'r' && stage) {
          addRect(stage)
          setActiveTool('select')
          return
        }
        if (key === 'o' && stage) {
          addCircle(stage)
          setActiveTool('select')
          return
        }
        if (key === 'l' && stage) {
          addLine(stage)
          setActiveTool('select')
          return
        }
        if (key === 't' && stage) {
          addIText(stage)
          setActiveTool('select')
          return
        }
        if (key === 'b' && stage) {
          enablePencil(stage)
          setActiveTool('pencil')
          return
        }
        if (key === 'f') {
          ev.preventDefault()
          toggleFloatingWindow('create')
          return
        }
      }

      // 9. Precision Arrow Key Translation (1px / 10px)
      const step = shift ? 10 : 1
      if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown' || ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
        if (!activeObj || !stage) return
        ev.preventDefault()
        const dx = ev.key === 'ArrowLeft' ? -step : ev.key === 'ArrowRight' ? step : 0
        const dy = ev.key === 'ArrowUp' ? -step : ev.key === 'ArrowDown' ? step : 0
        activeObj.set({ left: (activeObj.left || 0) + dx, top: (activeObj.top || 0) + dy })
        stage.requestRenderAll()
        useEditorStore.getState().snapshotSoon()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [stage, undo, redo, setActiveTool, toggleFloatingWindow])
}
