/**
 * LernexAI Proprietary — SceneGraph Node Hierarchy & Native Drag-Reorder Tree
 * Zero external @dnd-kit dependency.
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
  const props = { size: 12, strokeWidth: 1.7 }
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
    <div style={{ padding: '8px 8px' }}>
      <div className="panel-heading" style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 4 }}>
        <span>Scene Node Tree</span>
        <span style={{ color: '#06B6D4', fontFamily: 'var(--font-mono)' }}>{layers.length} Nodes</span>
      </div>

      {layers.length === 0 && (
        <div
          style={{
            padding: '28px 12px',
            textAlign: 'center',
            color: 'var(--color-base-500)',
            fontSize: 11.5,
          }}
        >
          Stage is empty. Insert vectors, shaders, or typography.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
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
                gap: 5,
                height: 34,
                padding: '0 8px',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                background: isActive ? 'rgba(6, 182, 212, 0.12)' : 'var(--color-base-800)',
                border: isActive ? '1px solid rgba(6, 182, 212, 0.45)' : '1px solid transparent',
                color: isActive ? '#F8FAFC' : 'var(--color-base-400)',
                userSelect: 'none',
              }}
            >
              <span style={{ cursor: 'grab', color: 'var(--color-base-500)', display: 'flex' }}>
                <GripVertical size={12} />
              </span>
              <span style={{ color: isActive ? '#06B6D4' : 'var(--color-base-500)', display: 'flex' }}>
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
                    height: 22,
                    background: 'var(--color-ink-950)',
                    border: '1px solid #06B6D4',
                    borderRadius: 4,
                    color: '#F8FAFC',
                    fontSize: 11.5,
                    padding: '0 6px',
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
                    fontSize: 11.5,
                    fontWeight: isActive ? 600 : 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title="Double-click to rename node"
                >
                  {layer.name}
                </span>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  reorderLayers(idx, idx - 1)
                }}
                title="Step Up"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-base-500)', padding: 1 }}
              >
                <ChevronUp size={11} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  reorderLayers(idx, idx + 1)
                }}
                title="Step Down"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-base-500)', padding: 1 }}
              >
                <ChevronDown size={11} />
              </button>
              <button
                onClick={(e) => duplicateLayer(e, layer)}
                title="Clone Node"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-base-500)', padding: 2 }}
              >
                <Copy size={11} />
              </button>
              <button
                onClick={(e) => toggleVisible(e, layer)}
                title="Toggle Visibility"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-base-500)', padding: 2 }}
              >
                {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
              <button
                onClick={(e) => toggleLock(e, layer)}
                title="Lock / Unlock"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-base-500)', padding: 2 }}
              >
                {layer.locked ? <Lock size={12} color="#F59E0B" /> : <Unlock size={12} />}
              </button>
              <button
                onClick={(e) => deleteLayer(e, layer)}
                title="Delete Node"
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
