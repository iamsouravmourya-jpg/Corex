/**
 * LernexAI Proprietary — Parametric Vector Lab, Procedural Guilloche Meshes,
 * Client-Side Vector QR Matrix & Smart Chroma Background Cutout Engine.
 * 100% Client-Side Serverless Execution.
 */
import {
  Canvas as FabricCanvas,
  Polygon,
  Path,
  Group,
  Rect,
  Circle,
  FabricImage,
  filters,
  type FabricObject,
} from 'fabric'
import { nanoid } from 'nanoid'
import { useEditorStore } from '@/store/editorStore'

function stampUid(node: FabricObject, label: string) {
  ;(node as any).__uid = `cx_${nanoid(8)}`
  ;(node as any).corexLabel = label
}

/**
 * Generates an N-pointed star or badge seal polygon.
 */
export function addStarPolygon(
  stage: FabricCanvas,
  points = 5,
  outerRadius = 90,
  innerRadius = 42,
  fill = '#06B6D4',
  label = 'Star Vector',
) {
  const vertices: { x: number; y: number }[] = []
  const step = Math.PI / points
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius
    const angle = i * step - Math.PI / 2
    vertices.push({
      x: outerRadius + r * Math.cos(angle),
      y: outerRadius + r * Math.sin(angle),
    })
  }
  const star = new Polygon(vertices, {
    left: stage.getWidth() * 0.5 - outerRadius,
    top: stage.getHeight() * 0.5 - outerRadius,
    fill,
    stroke: '#14B8A6',
    strokeWidth: 2,
  })
  stampUid(star, label)
  stage.add(star)
  stage.setActiveObject(star)
  stage.requestRenderAll()
  useEditorStore.getState().snapshot()
  return star
}

/**
 * Generates a regular N-sided polygon (Hexagon, Octagon, Diamond, Pentagon).
 */
export function addRegularPolygon(
  stage: FabricCanvas,
  sides = 6,
  radius = 85,
  fill = '#14B8A6',
  label = 'Polygon Vector',
) {
  const vertices: { x: number; y: number }[] = []
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
    vertices.push({
      x: radius + radius * Math.cos(angle),
      y: radius + radius * Math.sin(angle),
    })
  }
  const poly = new Polygon(vertices, {
    left: stage.getWidth() * 0.5 - radius,
    top: stage.getHeight() * 0.5 - radius,
    fill,
    stroke: '#06B6D4',
    strokeWidth: 2,
  })
  stampUid(poly, label)
  stage.add(poly)
  stage.setActiveObject(poly)
  stage.requestRenderAll()
  useEditorStore.getState().snapshot()
  return poly
}

/**
 * Generates a 3D Isometric Vector Cube Group with 3 shaded faces.
 */
export function addIsometricCube(stage: FabricCanvas) {
  const s = 80
  const dx = s * Math.cos(Math.PI / 6)
  const dy = s * Math.sin(Math.PI / 6)

  const topFace = new Polygon(
    [
      { x: dx, y: 0 },
      { x: dx * 2, y: dy },
      { x: dx, y: dy * 2 },
      { x: 0, y: dy },
    ],
    { fill: '#22D3EE', stroke: '#08090E', strokeWidth: 1.5 },
  )

  const leftFace = new Polygon(
    [
      { x: 0, y: dy },
      { x: dx, y: dy * 2 },
      { x: dx, y: dy * 2 + s },
      { x: 0, y: dy + s },
    ],
    { fill: '#06B6D4', stroke: '#08090E', strokeWidth: 1.5 },
  )

  const rightFace = new Polygon(
    [
      { x: dx, y: dy * 2 },
      { x: dx * 2, y: dy },
      { x: dx * 2, y: dy + s },
      { x: dx, y: dy * 2 + s },
    ],
    { fill: '#0891B2', stroke: '#08090E', strokeWidth: 1.5 },
  )

  const cubeGroup = new Group([topFace, leftFace, rightFace], {
    left: stage.getWidth() * 0.5 - dx,
    top: stage.getHeight() * 0.5 - s,
  })
  stampUid(cubeGroup, 'Isometric 3D Cube')
  stage.add(cubeGroup)
  stage.setActiveObject(cubeGroup)
  stage.requestRenderAll()
  useEditorStore.getState().snapshot()
  return cubeGroup
}

/**
 * CorelDRAW / Illustrator-style Procedural Vector Mesh & Guilloche Generator.
 */
export function addProceduralMesh(
  stage: FabricCanvas,
  kind: 'cyber-wave' | 'guilloche' | 'concentric-halo' | 'golden-spiral',
) {
  const cx = stage.getWidth() * 0.5
  const cy = stage.getHeight() * 0.5
  const paths: FabricObject[] = []

  if (kind === 'cyber-wave') {
    const lines = 12
    const spanW = Math.min(stage.getWidth() * 0.75, 640)
    for (let i = 0; i < lines; i++) {
      const offset = (i - lines / 2) * 14
      const amp = 48 + i * 6
      const d = `M ${-spanW / 2} ${offset} C ${-spanW / 6} ${offset - amp}, ${spanW / 6} ${offset + amp}, ${spanW / 2} ${offset}`
      paths.push(
        new Path(d, {
          fill: 'transparent',
          stroke: i % 2 === 0 ? '#06B6D4' : '#14B8A6',
          strokeWidth: 2,
          opacity: 0.35 + (i / lines) * 0.65,
        }),
      )
    }
    const waveGroup = new Group(paths, { left: cx - spanW / 2, top: cy - 90 })
    stampUid(waveGroup, 'Cyber Wave Mesh')
    stage.add(waveGroup)
    stage.setActiveObject(waveGroup)
  } else if (kind === 'guilloche') {
    const petals = 16
    const R = 110
    let d = ''
    const steps = 180
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2
      const r = R + 36 * Math.sin(petals * t)
      const x = r * Math.cos(t)
      const y = r * Math.sin(t)
      d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)} ` : `L ${x.toFixed(1)} ${y.toFixed(1)} `
    }
    d += 'Z'
    const outer = new Path(d, {
      fill: 'transparent',
      stroke: '#06B6D4',
      strokeWidth: 2,
    })
    const inner = new Circle({
      radius: 64,
      left: -64,
      top: -64,
      fill: 'transparent',
      stroke: '#14B8A6',
      strokeWidth: 1.5,
      strokeDashArray: [6, 4],
    })
    const grp = new Group([outer, inner], { left: cx - 146, top: cy - 146 })
    stampUid(grp, 'Guilloche Spirograph')
    stage.add(grp)
    stage.setActiveObject(grp)
  } else if (kind === 'concentric-halo') {
    for (let i = 1; i <= 6; i++) {
      const r = i * 24
      paths.push(
        new Circle({
          radius: r,
          left: -r,
          top: -r,
          fill: 'transparent',
          stroke: i % 2 === 0 ? '#06B6D4' : '#10B981',
          strokeWidth: 2,
          strokeDashArray: i % 2 === 0 ? [12, 6] : undefined,
          opacity: 1 - i * 0.1,
        }),
      )
    }
    const halo = new Group(paths, { left: cx - 144, top: cy - 144 })
    stampUid(halo, 'Concentric Vector Halo')
    stage.add(halo)
    stage.setActiveObject(halo)
  } else {
    // Golden Ratio Fibonacci Frame
    const w = 340
    const h = 210
    const frame = new Rect({
      left: 0,
      top: 0,
      width: w,
      height: h,
      fill: 'transparent',
      stroke: '#06B6D4',
      strokeWidth: 2,
    })
    const divider1 = new Rect({
      left: 210,
      top: 0,
      width: 130,
      height: 210,
      fill: 'transparent',
      stroke: '#14B8A6',
      strokeWidth: 1.5,
      strokeDashArray: [5, 5],
    })
    const arc = new Path(`M 0 210 A 210 210 0 0 1 210 0 A 130 130 0 0 1 340 130 A 80 80 0 0 1 260 210`, {
      fill: 'transparent',
      stroke: '#F59E0B',
      strokeWidth: 2.5,
    })
    const golden = new Group([frame, divider1, arc], { left: cx - w / 2, top: cy - h / 2 })
    stampUid(golden, 'Golden Ratio Spiral')
    stage.add(golden)
    stage.setActiveObject(golden)
  }

  stage.requestRenderAll()
  useEditorStore.getState().snapshot()
}

/**
 * 100% Client-Side Vector QR Matrix Badge Generator.
 * Synthesizes a scannable-style 21x21 QR finder + payload matrix as pure vector Rect nodes.
 */
export function addVectorQrBadge(
  stage: FabricCanvas,
  payload = 'https://lernexai.com',
  fgColor = '#08090E',
  bgColor = '#FFFFFF',
) {
  const grid = 21
  const cell = 8
  const pad = 16
  const totalSize = grid * cell + pad * 2

  const elements: FabricObject[] = [
    new Rect({
      left: 0,
      top: 0,
      width: totalSize,
      height: totalSize,
      rx: 12,
      ry: 12,
      fill: bgColor,
      stroke: '#06B6D4',
      strokeWidth: 2,
    }),
  ]

  const isFinder = (r: number, c: number) => {
    const inTL = r < 7 && c < 7
    const inTR = r < 7 && c >= grid - 7
    const inBL = r >= grid - 7 && c < 7
    return inTL || inTR || inBL
  }

  const finderBit = (r: number, c: number) => {
    const lr = r >= grid - 7 ? r - (grid - 7) : r
    const lc = c >= grid - 7 ? c - (grid - 7) : c
    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true
    if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true
    return false
  }

  // Deterministic hash seed from payload string
  let seed = 2166136261
  for (let i = 0; i < payload.length; i++) {
    seed ^= payload.charCodeAt(i)
    seed = Math.imul(seed, 16777619)
  }

  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      let filled = false
      if (isFinder(r, c)) {
        filled = finderBit(r, c)
      } else if (r === 6 || c === 6) {
        filled = (r + c) % 2 === 0
      } else {
        const h = Math.imul(seed ^ (r * 31 + c * 17), 2654435761) >>> 0
        filled = h % 10 < 5
      }

      if (filled) {
        elements.push(
          new Rect({
            left: pad + c * cell,
            top: pad + r * cell,
            width: cell,
            height: cell,
            rx: 1.5,
            ry: 1.5,
            fill: fgColor,
          }),
        )
      }
    }
  }

  const qrGroup = new Group(elements, {
    left: stage.getWidth() * 0.5 - totalSize * 0.5,
    top: stage.getHeight() * 0.5 - totalSize * 0.5,
  })
  stampUid(qrGroup, `QR Vector (${payload.slice(0, 16)})`)
  stage.add(qrGroup)
  stage.setActiveObject(qrGroup)
  stage.requestRenderAll()
  useEditorStore.getState().snapshot()
  return qrGroup
}

/**
 * Multi-object Precision Distribution (Horizontal & Vertical Equal Spacing).
 */
export function distributeSelection(stage: FabricCanvas, axis: 'horizontal' | 'vertical') {
  const active = stage.getActiveObject()
  const items: FabricObject[] =
    active && (active as any).getObjects ? (active as any).getObjects() : stage.getObjects()

  if (items.length < 3) return

  const sorted = [...items].sort((a, b) =>
    axis === 'horizontal' ? (a.left || 0) - (b.left || 0) : (a.top || 0) - (b.top || 0),
  )

  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const startPos = axis === 'horizontal' ? first.left || 0 : first.top || 0
  const endPos = axis === 'horizontal' ? last.left || 0 : last.top || 0
  const step = (endPos - startPos) / (sorted.length - 1)

  sorted.forEach((item, idx) => {
    if (axis === 'horizontal') {
      item.set({ left: Math.round(startPos + step * idx) })
    } else {
      item.set({ top: Math.round(startPos + step * idx) })
    }
    item.setCoords()
  })

  stage.requestRenderAll()
  useEditorStore.getState().snapshot()
}

/**
 * 100% Client-Side Chroma Key Background Cutout for Selected Image.
 * Samples corner pixel or removes white/dark backgrounds in browser memory.
 */
export async function removeImageBackgroundClient(
  stage: FabricCanvas,
  mode: 'corner' | 'light' | 'dark' = 'corner',
  tolerance = 48,
): Promise<boolean> {
  const active = stage.getActiveObject()
  if (!active || active.type !== 'image') return false

  const imgNode = active as FabricImage
  const el = imgNode.getElement() as HTMLImageElement | HTMLCanvasElement
  if (!el) return false

  const w = el.width || (imgNode.width ?? 300)
  const h = el.height || (imgNode.height ?? 300)
  const offscreen = document.createElement('canvas')
  offscreen.width = w
  offscreen.height = h
  const ctx = offscreen.getContext('2d')
  if (!ctx) return false

  ctx.drawImage(el, 0, 0, w, h)
  const imgData = ctx.getImageData(0, 0, w, h)
  const data = imgData.data

  let targetR = data[0]
  let targetG = data[1]
  let targetB = data[2]

  if (mode === 'light') {
    targetR = 250
    targetG = 250
    targetB = 250
  } else if (mode === 'dark') {
    targetR = 12
    targetG = 14
    targetB = 20
  }

  const maxDist = tolerance * 1.8

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const dist = Math.hypot(r - targetR, g - targetG, b - targetB)
    if (dist < tolerance) {
      data[i + 3] = 0
    } else if (dist < maxDist) {
      const alphaFactor = (dist - tolerance) / (maxDist - tolerance)
      data[i + 3] = Math.round(data[i + 3] * alphaFactor)
    }
  }

  ctx.putImageData(imgData, 0, 0)
  const cutoutUrl = offscreen.toDataURL('image/png')

  const prevLeft = imgNode.left
  const prevTop = imgNode.top
  const prevScaleX = imgNode.scaleX
  const prevScaleY = imgNode.scaleY
  const prevAngle = imgNode.angle
  const prevLabel = (imgNode as any).corexLabel || 'Cutout Asset'

  stage.remove(imgNode)
  const newImg = await FabricImage.fromURL(cutoutUrl)
  newImg.set({
    left: prevLeft,
    top: prevTop,
    scaleX: prevScaleX,
    scaleY: prevScaleY,
    angle: prevAngle,
  })
  stampUid(newImg, `${prevLabel} (Cutout)`)
  stage.add(newImg)
  stage.setActiveObject(newImg)
  stage.requestRenderAll()
  useEditorStore.getState().snapshot()
  return true
}

/**
 * Applies 1-Click Studio Color Grading LUT Presets to a FabricImage.
 */
export function applyImageLutPreset(
  stage: FabricCanvas,
  preset: 'cyberpunk' | 'noir' | 'cinema-gold' | 'arctic' | 'reset',
) {
  const active = stage.getActiveObject()
  if (!active || active.type !== 'image') return
  const img = active as FabricImage

  if (preset === 'reset') {
    img.filters = []
  } else if (preset === 'cyberpunk') {
    img.filters = [
      new filters.Contrast({ contrast: 0.24 }),
      new filters.Saturation({ saturation: 0.45 }),
      new filters.Vibrance({ vibrance: 0.35 }),
    ]
  } else if (preset === 'noir') {
    img.filters = [
      new filters.Saturation({ saturation: -1 }),
      new filters.Contrast({ contrast: 0.32 }),
      new filters.Brightness({ brightness: -0.04 }),
    ]
  } else if (preset === 'cinema-gold') {
    img.filters = [
      new filters.Contrast({ contrast: 0.16 }),
      new filters.Saturation({ saturation: 0.22 }),
      new filters.Brightness({ brightness: 0.05 }),
    ]
  } else if (preset === 'arctic') {
    img.filters = [
      new filters.Brightness({ brightness: 0.08 }),
      new filters.Contrast({ contrast: 0.14 }),
      new filters.Saturation({ saturation: -0.25 }),
    ]
  }

  img.applyFilters()
  stage.requestRenderAll()
  useEditorStore.getState().snapshot()
}

/**
 * Generates clean Figma Dev Mode CSS & SVG code snippets for any selected canvas object.
 */
export function generateDevModeCss(obj: FabricObject | null): string {
  if (!obj) return '/* Select a layer to inspect CSS */'
  const w = Math.round((obj.width || 0) * (obj.scaleX || 1))
  const h = Math.round((obj.height || 0) * (obj.scaleY || 1))
  const x = Math.round(obj.left || 0)
  const y = Math.round(obj.top || 0)
  const lines: string[] = [
    `/* Layer: ${(obj as any).corexLabel || obj.type} */`,
    `position: absolute;`,
    `left: ${x}px;`,
    `top: ${y}px;`,
    `width: ${w}px;`,
    `height: ${h}px;`,
  ]
  if (obj.angle) {
    lines.push(`transform: rotate(${Math.round(obj.angle)}deg);`)
  }
  if (typeof obj.fill === 'string' && obj.fill !== 'transparent') {
    if (obj.type === 'i-text' || obj.type === 'text') {
      lines.push(`color: ${obj.fill};`)
    } else {
      lines.push(`background: ${obj.fill};`)
    }
  }
  if (obj.stroke && obj.stroke !== 'transparent' && obj.strokeWidth) {
    lines.push(`border: ${obj.strokeWidth}px solid ${obj.stroke};`)
  }
  if ((obj as any).rx) {
    lines.push(`border-radius: ${(obj as any).rx}px;`)
  }
  if (obj.opacity !== undefined && obj.opacity < 1) {
    lines.push(`opacity: ${obj.opacity.toFixed(2)};`)
  }
  if (obj.globalCompositeOperation && obj.globalCompositeOperation !== 'source-over') {
    lines.push(`mix-blend-mode: ${obj.globalCompositeOperation};`)
  }
  if (obj.type === 'i-text' || obj.type === 'text') {
    const t = obj as any
    lines.push(`font-family: '${t.fontFamily || 'Plus Jakarta Sans'}', sans-serif;`)
    lines.push(`font-size: ${t.fontSize || 24}px;`)
    lines.push(`font-weight: ${t.fontWeight || 400};`)
  }
  return lines.join('\n')
}
