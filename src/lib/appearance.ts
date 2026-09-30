/**
 * LernexAI Proprietary — Shader & Vector Fill Compiler
 */
import { Color, Gradient, Shadow, type FabricObject, type GradientType } from 'fabric'

type CorexGradientInstance = Gradient<GradientType>

export type FillMode = 'solid' | 'linear' | 'radial'

export interface GradientSpec {
  angle: number
  from: string
  to: string
}

export const DEFAULT_GRADIENT: GradientSpec = {
  angle: 135,
  from: '#06B6D4',
  to: '#14B8A6',
}

export interface ShadowSpec {
  color: string
  opacity: number
  blur: number
  offsetX: number
  offsetY: number
}

export const DEFAULT_SHADOW: ShadowSpec = {
  color: '#08090E',
  opacity: 40,
  blur: 18,
  offsetX: 0,
  offsetY: 8,
}

export function isGradient(fill: unknown): fill is CorexGradientInstance {
  return fill instanceof Gradient
}

function computePolarRadius(w: number, h: number, deg: number): number {
  const theta = (deg * Math.PI) / 180
  return (Math.abs(w * Math.cos(theta)) + Math.abs(h * Math.sin(theta))) * 0.5
}

export function buildGradient(
  mode: 'linear' | 'radial',
  spec: GradientSpec,
  width: number,
  height: number,
) {
  const theta = (spec.angle * Math.PI) / 180
  const midX = width * 0.5
  const midY = height * 0.5
  const stops = [
    { offset: 0, color: spec.from },
    { offset: 1, color: spec.to },
  ]

  if (mode === 'radial') {
    const outerRadius = Math.hypot(midX, midY)
    return new Gradient({
      type: 'radial',
      gradientUnits: 'pixels',
      coords: { x1: midX, y1: midY, r1: 0, x2: midX, y2: midY, r2: outerRadius },
      colorStops: stops,
    })
  }

  const span = computePolarRadius(width, height, spec.angle) || 1
  return new Gradient({
    type: 'linear',
    gradientUnits: 'pixels',
    coords: {
      x1: midX - span * Math.cos(theta),
      y1: midY - span * Math.sin(theta),
      x2: midX + span * Math.cos(theta),
      y2: midY + span * Math.sin(theta),
    },
    colorStops: stops,
  })
}

export function readGradient(fill: CorexGradientInstance): GradientSpec {
  const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = fill.coords || {}
  const stops = fill.colorStops || []
  const computedAngle =
    fill.type === 'linear'
      ? Math.round(((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI + 360) % 360)
      : 0

  return {
    angle: computedAngle,
    from: stops[0]?.color || DEFAULT_GRADIENT.from,
    to: stops[1]?.color || stops[stops.length - 1]?.color || DEFAULT_GRADIENT.to,
  }
}

export function readShadow(node: FabricObject): ShadowSpec {
  const rawShadow = node.shadow
  if (!rawShadow) return { ...DEFAULT_SHADOW }
  const parsedColor = new Color(rawShadow.color || '#08090E')
  return {
    color: `#${parsedColor.toHex()}`,
    opacity: Math.round(parsedColor.getAlpha() * 100),
    blur: rawShadow.blur || 0,
    offsetX: rawShadow.offsetX || 0,
    offsetY: rawShadow.offsetY || 0,
  }
}

export function buildShadow(spec: ShadowSpec) {
  return new Shadow({
    color: new Color(spec.color).setAlpha(spec.opacity / 100).toRgba(),
    blur: spec.blur,
    offsetX: spec.offsetX,
    offsetY: spec.offsetY,
  })
}

export const BLEND_MODES = [
  { value: 'source-over', label: 'Normal' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'darken', label: 'Darken' },
  { value: 'lighten', label: 'Lighten' },
  { value: 'color-dodge', label: 'Color Dodge' },
  { value: 'color-burn', label: 'Color Burn' },
  { value: 'hard-light', label: 'Hard Light' },
  { value: 'soft-light', label: 'Soft Light' },
  { value: 'difference', label: 'Difference' },
  { value: 'exclusion', label: 'Exclusion' },
  { value: 'hue', label: 'Hue' },
  { value: 'saturation', label: 'Saturation' },
  { value: 'color', label: 'Color' },
  { value: 'luminosity', label: 'Luminosity' },
]
