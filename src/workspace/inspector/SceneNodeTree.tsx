/**
 * LernexAI Proprietary — Left Scene Hierarchy Tree
 * Zero inner border lines, soft rounded-xl layer pills, and generous breathing space.
 */
import { useState } from 'react'
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  GripVertical,
  Square,
  Circle,
  Triangle,
  Type,
  Image,
  Minus,
  Pencil,
  Copy,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import { useEditorStore } from '@/store/editorStore'
import type { LayerItem } from '@/types'
import { motion } from 'framer-motion'
import { nanoid } from 'nanoid'

function resolveNodeIcon(type: string) {
  const props = { size: 13, strokeWidth: 1.75 }
  switch (type) {
    case 'rect':
      return <Square {...props} />
    case 'circle':
      return <Circle {...props} />
    case 'triangle':
      return <Triangle {...props} />
    case 'i-text':
    case 'text':
      return <Type {...props} />
    case 'image':
      return <Image {...props} />
    case 'line':
      return <Minus {...props} />
    case 'path':
      return <Pencil {...props} />
    default:
      return <Square {...props} />
  }
}

export function LayersPanel() {
  const canvas = useFabricCanvas()
  const { layers, setLayers, activeObjectId, setActiveObjectId, syncLayersFromCanvas, snapshot } =
    useEditorStore()
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')

  const reorderLayers = (fromIndex: number, toIndex: number) => {
    if (!canvas || fromIndex === toIndex || toIndex < 0 || toIndex >= layers.length) return
    const updated = [...layers]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setLayers(updated)

    updated
      .slice()
      .reverse()
      .forEach((item, zIdx) => {
        canvas.moveObjectTo(item.fabricObject, zIdx)
      })
    canvas.requestRenderAll()
    snapshot()
  }

  const selectLayer = (layer: LayerItem) => {
    if (!canvas) return
    canvas.setActiveObject(layer.fabricObject)
    canvas.requestRenderAll()
    setActiveObjectId(layer.id)
  }

  const toggleVisible = (e: React.MouseEvent, layer: LayerItem) => {
    e.stopPropagation()
    layer.fabricObject.set({ visible: !layer.fabricObject.visible })
    canvas?.requestRenderAll()
    syncLayersFromCanvas()
  }

  const toggleLock = (e: React.MouseEvent, layer: LayerItem) => {
    e.stopPropagation()
    const nextSelectable = !(layer.fabricObject.selectable ?? true)
    layer.fabricObject.set({ selectable: nextSelectable, evented: nextSelectable })
    canvas?.requestRenderAll()
    syncLayersFromCanvas()
  }

  const deleteLayer = (e: React.MouseEvent, layer: LayerItem) => {
    e.stopPropagation()
    canvas?.remove(layer.fabricObject)
    canvas?.requestRenderAll()
    syncLayersFromCanvas()
  }

  const duplicateLayer = (e: React.MouseEvent, layer: LayerItem) => {
    e.stopPropagation()
    if (!canvas) return
    void layer.fabricObject.clone().then((cloned: any) => {
      cloned.set({
        left: (layer.fabricObject.left || 0) + 22,
        top: (layer.fabricObject.top || 0) + 22,
      })
      cloned.__uid = `cx_${nanoid(8)}`
      cloned.corexLabel = `${layer.name} Clone`
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.requestRenderAll()
      syncLayersFromCanvas()
    })
  }

  return (
    <div style={{ padding: '6px 14px 20px' }}>
      {layers.length === 0 && (
        <div
          style={{
            padding: '36px 16px',
            textAlign: 'center',
            color: 'var(--color-base-500)',
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          Canvas is empty. Pick a shape, text, or blueprint from the left rail.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {layers.map((layer, idx) => {
          const isActive = activeObjectId === layer.id
          const isEditing = editingId === layer.id

          return (
            <motion.div
              key={layer.id}
              draggable
              onDragStart={() => setDraggedId(layer.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (!draggedId || draggedId === layer.id) return
                const fromIdx = layers.findIndex((l) => l.id === draggedId)
                reorderLayers(fromIdx, idx)
                setDraggedId(null)
              }}
              onClick={() => selectLayer(layer)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                height: 38,
                padding: '0 10px',
                borderRadius: 12,
                cursor: 'pointer',
                background: isActive ? 'rgba(6, 182, 212, 0.16)' : 'rgba(255, 255, 255, 0.025)',
                border: 'none',
                color: isActive ? '#F8FAFC' : 'var(--color-base-300)',
                userSelect: 'none',
                transition: 'background 140ms',
              }}
            >
              <span style={{ cursor: 'grab', color: 'var(--color-base-500)', display: 'flex' }}>
                <GripVertical size={12} />
              </span>
              <span style={{ color: isActive ? '#22D3EE' : 'var(--color-base-500)', display: 'flex' }}>
                {resolveNodeIcon(layer.type)}
              </span>

              {isEditing ? (
                <input
                  autoFocus
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onBlur={() => {
                    ;(layer.fabricObject as any).corexLabel = draftName || layer.name
                    syncLayersFromCanvas()
                    setEditingId(null)
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    flex: 1,
                    height: 24,
                    background: '#07080D',
                    border: 'none',
                    borderRadius: 8,
                    color: '#F8FAFC',
                    fontSize: 11.5,
                    padding: '0 8px',
                    outline: 'none',
                  }}
                />
              ) : (
                <span
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    setDraftName(layer.name)
                    setEditingId(layer.id)
                  }}
                  style={{
                    flex: 1,
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title="Double-click to rename"
                >
                  {layer.name}
                </span>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  reorderLayers(idx, idx - 1)
                }}
                title="Move Up"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-base-500)', padding: 2 }}
              >
                <ChevronUp size={11} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  reorderLayers(idx, idx + 1)
                }}
                title="Move Down"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-base-500)', padding: 2 }}
              >
                <ChevronDown size={11} />
              </button>
              <button
                onClick={(e) => duplicateLayer(e, layer)}
                title="Duplicate"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-base-500)', padding: 2 }}
              >
                <Copy size={11} />
              </button>
              <button
                onClick={(e) => toggleVisible(e, layer)}
                title="Visibility"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-base-500)', padding: 2 }}
              >
                {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
              <button
                onClick={(e) => toggleLock(e, layer)}
                title="Lock"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-base-500)', padding: 2 }}
              >
                {layer.locked ? <Lock size={12} color="#F59E0B" /> : <Unlock size={12} />}
              </button>
              <button
                onClick={(e) => deleteLayer(e, layer)}
                title="Delete"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-base-500)', padding: 2 }}
              >
                <Trash2 size={12} />
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
