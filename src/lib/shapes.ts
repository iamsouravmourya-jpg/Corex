/**
 * LernexAI Proprietary — Vector Node Factory
 */
import {
  Canvas as FabricCanvas,
  Rect,
  Circle,
  Triangle,
  Line,
  Path,
  IText,
  FabricImage,
  PencilBrush,
  type FabricObject,
} from 'fabric'
import { nanoid } from 'nanoid'

function createNodeUid(): string {
  return `cx_${nanoid(8)}`
}

function attachNodeIdentity(node: FabricObject, label?: string) {
  ;(node as any).__uid = createNodeUid()
  if (label) {
    ;(node as any).corexLabel = label
  }
}

function placeAtStageCenter(stage: FabricCanvas, node: FabricObject, label?: string) {
  const nodeW = (node as any).width || 120
  const nodeH = (node as any).height || 120
  node.set({
    left: stage.getWidth() * 0.5 - nodeW * 0.5,
    top: stage.getHeight() * 0.5 - nodeH * 0.5,
  })
  attachNodeIdentity(node, label)
}

export function addRect(stage: FabricCanvas) {
  const node = new Rect({
    width: 220,
    height: 150,
    fill: '#1A1E2A',
    stroke: '#06B6D4',
    strokeWidth: 2,
    rx: 8,
    ry: 8,
  })
  placeAtStageCenter(stage, node, 'Vector Card')
  stage.add(node)
  stage.setActiveObject(node)
  stage.requestRenderAll()
  return node
}

export function addCircle(stage: FabricCanvas) {
  const node = new Circle({
    radius: 84,
    fill: '#06B6D4',
    stroke: 'transparent',
    strokeWidth: 0,
  })
  attachNodeIdentity(node, 'Vector Orb')
  node.set({
    left: stage.getWidth() * 0.5 - 84,
    top: stage.getHeight() * 0.5 - 84,
  })
  stage.add(node)
  stage.setActiveObject(node)
  stage.requestRenderAll()
  return node
}

export function addTriangle(stage: FabricCanvas) {
  const node = new Triangle({
    width: 170,
    height: 150,
    fill: '#14B8A6',
    stroke: 'transparent',
    strokeWidth: 0,
  })
  placeAtStageCenter(stage, node, 'Vector Prism')
  stage.add(node)
  stage.setActiveObject(node)
  stage.requestRenderAll()
  return node
}

export function addLine(stage: FabricCanvas) {
  const midX = stage.getWidth() * 0.5
  const midY = stage.getHeight() * 0.5
  const node = new Line([midX - 110, midY, midX + 110, midY], {
    stroke: '#06B6D4',
    strokeWidth: 3,
    selectable: true,
  })
  attachNodeIdentity(node, 'Vector Divider')
  stage.add(node)
  stage.setActiveObject(node)
  stage.requestRenderAll()
  return node
}

export function addArrow(stage: FabricCanvas) {
  const cx = stage.getWidth() * 0.5
  const cy = stage.getHeight() * 0.5
  const node = new Path(
    `M ${cx - 85} ${cy} L ${cx + 65} ${cy} M ${cx + 42} ${cy - 18} L ${cx + 82} ${cy} L ${cx + 42} ${cy + 18}`,
    {
      stroke: '#06B6D4',
      strokeWidth: 3,
      fill: 'transparent',
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
    },
  )
  attachNodeIdentity(node, 'Directional Vector')
  stage.add(node)
  stage.setActiveObject(node)
  stage.requestRenderAll()
  return node
}

export function addIText(stage: FabricCanvas, text = 'Double-click to edit') {
  const node = new IText(text, {
    left: stage.getWidth() * 0.5 - 160,
    top: stage.getHeight() * 0.5 - 22,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 34,
    fill: '#F8FAFC',
    fontWeight: '700',
  })
  attachNodeIdentity(node, 'Typography Layer')
  stage.add(node)
  stage.setActiveObject(node)
  stage.requestRenderAll()
  return node
}

export function addEmoji(glyph: string, stage: FabricCanvas) {
  const node = new IText(glyph, {
    left: stage.getWidth() * 0.5 - 40,
    top: stage.getHeight() * 0.5 - 40,
    fontSize: 72,
    selectable: true,
  })
  attachNodeIdentity(node, `Glyph ${glyph}`)
  stage.add(node)
  stage.setActiveObject(node)
  stage.requestRenderAll()
  return node
}

export async function addImageFromDataUrl(stage: FabricCanvas, dataUrl: string) {
  const img = await FabricImage.fromURL(dataUrl)
  const maxW = stage.getWidth() * 0.72
  const maxH = stage.getHeight() * 0.72
  const scaleFactor = Math.min(maxW / (img.width || 1), maxH / (img.height || 1), 1)
  img.scale(scaleFactor)
  img.set({
    left: stage.getWidth() * 0.5 - ((img.width || 100) * scaleFactor) * 0.5,
    top: stage.getHeight() * 0.5 - ((img.height || 100) * scaleFactor) * 0.5,
  })
  attachNodeIdentity(img, 'Raster Asset')
  stage.add(img)
  stage.setActiveObject(img)
  stage.requestRenderAll()
  return img
}

export function enablePencil(stage: FabricCanvas, color = '#06B6D4', width = 3) {
  const brush = new PencilBrush(stage)
  brush.color = color
  brush.width = width
  stage.freeDrawingBrush = brush
  stage.isDrawingMode = true
}

export function disablePencil(stage: FabricCanvas) {
  stage.isDrawingMode = false
}

export function duplicateActiveObject(stage: FabricCanvas) {
  const active = stage.getActiveObject()
  if (!active) return
  active.clone().then((cloned: any) => {
    cloned.set({
      left: (active.left || 0) + 24,
      top: (active.top || 0) + 24,
    })
    cloned.__uid = createNodeUid()
    if ((active as any).corexLabel) {
      cloned.corexLabel = `${(active as any).corexLabel} Copy`
    }
    stage.add(cloned)
    stage.setActiveObject(cloned)
    stage.requestRenderAll()
  })
}
