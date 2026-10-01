/**
 * LernexAI Proprietary — Quantum Studio Type Specifications & 15 Artboard Presets
 */
import type { FabricObject } from 'fabric'

export type Tool =
  | 'select'
  | 'rect'
  | 'circle'
  | 'triangle'
  | 'line'
  | 'arrow'
  | 'pencil'
  | 'text'
  | 'image'
  | 'emoji'

export type ToolType = Tool

export interface LayerItem {
  id: string
  name: string
  type: string
  visible: boolean
  locked: boolean
  fabricObject: FabricObject
}

export interface CanvasSize {
  width: number
  height: number
  label: string
}

export interface Project {
  id: string
  name: string
  json: string
  thumbnail: string
  canvasSize: CanvasSize
  createdAt?: number
  updatedAt: number
}

export interface Template {
  id: string
  name: string
  category: 'Social' | 'Presentation' | 'Poster' | 'Card' | 'Banner' | 'Custom'
  width: number
  height: number
  thumbnail: string
  canvasJSON: string
}

export const CANVAS_PRESETS: CanvasSize[] = [
  { width: 1080, height: 1080, label: 'Instagram Square (1:1)' },
  { width: 1080, height: 1920, label: 'Instagram / TikTok Reel (9:16)' },
  { width: 1280, height: 720, label: 'YouTube High-CTR Thumbnail' },
  { width: 1920, height: 1080, label: 'Keynote / Pitch Deck FHD (16:9)' },
  { width: 3840, height: 2160, label: '4K UHD Cinema Frame' },
  { width: 1728, height: 1117, label: 'MacBook Pro 16" Retina Stage' },
  { width: 1179, height: 2556, label: 'iPhone 16 Pro Mobile Frame' },
  { width: 1600, height: 1200, label: 'Dribbble / Behance Shot (4:3)' },
  { width: 1270, height: 760, label: 'Product Hunt Launch Card' },
  { width: 1584, height: 396, label: 'LinkedIn Executive Banner (4:1)' },
  { width: 1500, height: 500, label: 'X / Twitter Header Matrix' },
  { width: 1200, height: 630, label: 'OpenGraph / Social Share Card' },
  { width: 1400, height: 1400, label: 'Spotify / Apple Podcast Cover' },
  { width: 794, height: 1123, label: 'ISO A4 Editorial Print (96 DPI)' },
  { width: 1200, height: 1500, label: 'Exhibition Poster (4:5)' },
]
