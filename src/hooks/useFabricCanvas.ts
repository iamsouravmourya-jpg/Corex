/**
 * LernexAI Proprietary — Corex SceneGraph Runtime Accessor
 */
import { useEditorStore } from '@/store/editorStore'

export function useFabricCanvas() {
  return useEditorStore((state) => state.fabricCanvas)
}

export function useActiveSceneNode() {
  const stage = useEditorStore((state) => state.fabricCanvas)
  const activeId = useEditorStore((state) => state.activeObjectId)
  if (!stage || !activeId) return null
  return stage.getActiveObject() ?? null
}

export function useViewportTransform() {
  const viewZoom = useEditorStore((state) => state.viewZoom)
  const fitScale = useEditorStore((state) => state.fitScale)
  return {
    zoomFactor: viewZoom,
    fitRatio: fitScale,
    effectiveScale: viewZoom * fitScale,
  }
}
