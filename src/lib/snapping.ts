/**
 * LernexAI Proprietary — Magnetic Vector Spatial Solver
 * Computes orthogonal anchor vectors (origin, midpoint, terminus) across
 * active scene nodes and renders Electric Cyan (#06B6D4) laser alignment guides.
 */
import { Canvas as FabricCanvas } from 'fabric'

const MAGNETIC_TOLERANCE_PX = 6

interface SpatialGuideAnchor {
  coordinate: number
  spanOrigin: number
  spanTerminus: number
}

function projectNodeAnchors(box: { left: number; top: number; width: number; height: number }) {
  const xStops = [box.left, box.left + box.width * 0.5, box.left + box.width]
  const yStops = [box.top, box.top + box.height * 0.5, box.top + box.height]

  const verticalAxes: SpatialGuideAnchor[] = xStops.map((coord) => ({
    coordinate: coord,
    spanOrigin: box.top,
    spanTerminus: box.top + box.height,
  }))

  const horizontalAxes: SpatialGuideAnchor[] = yStops.map((coord) => ({
    coordinate: coord,
    spanOrigin: box.left,
    spanTerminus: box.left + box.width,
  }))

  return { verticalAxes, horizontalAxes }
}

function resolveNearestMagneticLock(
  probeStops: number[],
  anchors: SpatialGuideAnchor[],
  tolerance: number,
): { offset: number; anchor: SpatialGuideAnchor } | null {
  let locked: { offset: number; anchor: SpatialGuideAnchor } | null = null

  for (let i = 0; i < probeStops.length; i++) {
    const probe = probeStops[i]
    for (let j = 0; j < anchors.length; j++) {
      const target = anchors[j]
      const offset = target.coordinate - probe
      const dist = Math.abs(offset)
      if (dist <= tolerance && (!locked || dist < Math.abs(locked.offset))) {
        locked = { offset, anchor: target }
      }
    }
  }

  return locked
}

export function attachAlignmentGuides(
  stage: FabricCanvas,
  overlayHost: HTMLElement,
  resolveScaleFactor: () => number,
) {
  const createLaserGuide = (isVertical: boolean) => {
    const node = document.createElement('div')
    node.style.cssText = isVertical
      ? 'position:absolute;left:0;top:0;width:1px;height:0;background:#06B6D4;box-shadow:0 0 8px rgba(6,182,212,0.75);pointer-events:none;display:none;z-index:3'
      : 'position:absolute;left:0;top:0;height:1px;width:0;background:#06B6D4;box-shadow:0 0 8px rgba(6,182,212,0.75);pointer-events:none;display:none;z-index:3'
    overlayHost.appendChild(node)
    return node
  }

  const verticalLaser = createLaserGuide(true)
  const horizontalLaser = createLaserGuide(false)

  const clearGuides = () => {
    verticalLaser.style.display = 'none'
    horizontalLaser.style.display = 'none'
  }

  const handleNodeTranslation = () => {
    const targetNode = stage.getActiveObject()
    if (!targetNode) {
      clearGuides()
      return
    }

    const activeScale = resolveScaleFactor() || 1
    const tolerance = MAGNETIC_TOLERANCE_PX / activeScale
    const rect = targetNode.getBoundingRect()
    const stageW = stage.getWidth()
    const stageH = stage.getHeight()

    const xAnchors: SpatialGuideAnchor[] = [
      { coordinate: 0, spanOrigin: 0, spanTerminus: stageH },
      { coordinate: stageW * 0.5, spanOrigin: 0, spanTerminus: stageH },
      { coordinate: stageW, spanOrigin: 0, spanTerminus: stageH },
    ]
    const yAnchors: SpatialGuideAnchor[] = [
      { coordinate: 0, spanOrigin: 0, spanTerminus: stageW },
      { coordinate: stageH * 0.5, spanOrigin: 0, spanTerminus: stageW },
      { coordinate: stageH, spanOrigin: 0, spanTerminus: stageW },
    ]

    const siblings = stage.getObjects()
    for (let i = 0; i < siblings.length; i++) {
      const item = siblings[i]
      if (item === targetNode || item.visible === false) continue
      const projected = projectNodeAnchors(item.getBoundingRect())
      xAnchors.push(...projected.verticalAxes)
      yAnchors.push(...projected.horizontalAxes)
    }

    const originLeft = targetNode.left || 0
    const originTop = targetNode.top || 0
    const rectRight = rect.left + rect.width
    const rectBottom = rect.top + rect.height

    const lockX = resolveNearestMagneticLock(
      [rect.left, rect.left + rect.width * 0.5, rectRight],
      xAnchors,
      tolerance,
    )
    const lockY = resolveNearestMagneticLock(
      [rect.top, rect.top + rect.height * 0.5, rectBottom],
      yAnchors,
      tolerance,
    )

    if (lockX) {
      targetNode.set({ left: originLeft + lockX.offset })
      const topEdge = Math.min(lockX.anchor.spanOrigin, rect.top)
      const bottomEdge = Math.max(lockX.anchor.spanTerminus, rectBottom)
      verticalLaser.style.display = 'block'
      verticalLaser.style.left = `${lockX.anchor.coordinate}px`
      verticalLaser.style.top = `${topEdge}px`
      verticalLaser.style.height = `${Math.max(0, bottomEdge - topEdge)}px`
    } else {
      verticalLaser.style.display = 'none'
    }

    if (lockY) {
      targetNode.set({ top: originTop + lockY.offset })
      const leftEdge = Math.min(lockY.anchor.spanOrigin, rect.left)
      const rightEdge = Math.max(lockY.anchor.spanTerminus, rectRight)
      horizontalLaser.style.display = 'block'
      horizontalLaser.style.top = `${lockY.anchor.coordinate}px`
      horizontalLaser.style.left = `${leftEdge}px`
      horizontalLaser.style.width = `${Math.max(0, rightEdge - leftEdge)}px`
    } else {
      horizontalLaser.style.display = 'none'
    }

    if (lockX || lockY) {
      stage.requestRenderAll()
    }
  }

  stage.on('object:moving', handleNodeTranslation)
  stage.on('mouse:up', clearGuides)
  stage.on('selection:cleared', clearGuides)

  return () => {
    stage.off('object:moving', handleNodeTranslation)
    stage.off('mouse:up', clearGuides)
    stage.off('selection:cleared', clearGuides)
    verticalLaser.remove()
    horizontalLaser.remove()
  }
}
