import { Canvas as FabricCanvas, FabricObject } from 'fabric'

export type ToolType =
  | 'select'
  | 'rect'
  | 'circle'
  | 'triangle'
  | 'line'
  | 'arrow'
  | 'pencil'
  | 'text'
  | 'image'

export interface CanvasSize {
  width: number
  height: number
  label: string
}

export const CANVAS_PRESETS: CanvasSize[] = [
  { width: 1080, height: 1080, label: 'Social Square HD' },
  { width: 1080, height: 1920, label: 'Vertical Reel / Story' },
  { width: 1920, height: 1080, label: 'Widescreen Deck 16:9' },
  { width: 1280, height: 720,  label: 'YouTube Studio Cover' },
  { width: 1600, height: 1200, label: 'Dribbble Shot 4:3' },
  { width: 1270, height: 760,  label: 'Product Hunt Launch' },
  { width: 1584, height: 396,  label: 'LinkedIn Cover Banner' },
  { width: 1500, height: 500,  label: 'X / Header Banner' },
  { width: 1200, height: 630,  label: 'OpenGraph Social Card' },
  { width: 794,  height: 1123, label: 'A4 Editorial Print' },
  { width: 816,  height: 1056, label: 'US Letter Document' },
  { width: 960,  height: 960,  label: 'Studio Square (960×960)' },
]

export interface LayerItem {
  id: string
  name: string
  type: string
  visible: boolean
  locked: boolean
  fabricObject: FabricObject
}

export interface Project {
  id: string
  name: string
  json: string
  thumbnail: string
  canvasSize: CanvasSize
  updatedAt: number
}

export interface HistoryState {
  json: string
  background: string
}

export interface UserProfile {
  name: string
  email: string
  avatar?: string
  plan: string
  provider: 'google' | 'email' | 'demo'
}

export interface EditorState {
  // Navigation & Auth Session
  currentView: 'landing' | 'studio'
  setCurrentView: (view: 'landing' | 'studio') => void
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  logout: () => void

  // Canvas
  fabricCanvas: FabricCanvas | null
  setFabricCanvas: (canvas: FabricCanvas | null) => void

  // Active tool
  activeTool: ToolType
  setActiveTool: (tool: ToolType) => void

  // Canvas size
  canvasSize: CanvasSize
  setCanvasSize: (size: CanvasSize) => void

  // Active object
  activeObjectId: string | null
  setActiveObjectId: (id: string | null) => void

  // Layers
  layers: LayerItem[]
  setLayers: (layers: LayerItem[]) => void
  syncLayersFromCanvas: () => void

  // History
  history: HistoryState[]
  historyIndex: number
  pushHistory: (state: HistoryState) => void
  snapshot: () => void
  snapshotSoon: () => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean

  // Viewport
  fitScale: number
  setFitScale: (scale: number) => void
  viewZoom: number
  setViewZoom: (zoom: number) => void
  viewNonce: number
  resetView: () => void

  showGrid: boolean
  setShowGrid: (show: boolean) => void
  toggleGrid: () => void

  // Bumped whenever something other than the Properties panel replaces the
  // canvas background, so the panel can re-read it instead of going stale.
  bgNonce: number
  bumpBgNonce: () => void

  // AI Mode
  isAiModeOpen: boolean
  setIsAiModeOpen: (open: boolean) => void
  toggleAiMode: () => void

  // Current project
  currentProjectId: string | null
  setCurrentProjectId: (id: string | null) => void
  currentProjectName: string
  setCurrentProjectName: (name: string) => void
}
