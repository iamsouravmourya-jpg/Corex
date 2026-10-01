import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Canvas as FabricCanvas } from 'fabric'
import type { ToolType, CanvasSize, LayerItem } from '@/types'
import { CANVAS_PRESETS } from '@/types'
import { encodeSceneTransaction, decodeSceneTransaction } from '@/lib/commandLedger'

const MAX_LEDGER_FRAMES = 64

export type LeftDrawerTab = 'create' | 'blueprints' | 'vectors' | 'quantum' | 'vault' | null
export type RightInspectorTab = 'properties' | 'layers' | 'ai'
export type FloatingWindowType = 'create' | 'blueprints' | 'vectors' | 'quantum' | 'ai' | null

export interface UserSession {
  name: string
  email: string
  avatar?: string
  plan: string
  provider: 'google' | 'email' | 'demo'
}

interface EditorState {
  currentView: 'landing' | 'editor'
  user: UserSession | null
  setCurrentView: (view: 'landing' | 'editor') => void
  setUser: (user: UserSession | null) => void
  logout: () => void

  fabricCanvas: FabricCanvas | null
  activeTool: ToolType
  canvasSize: CanvasSize
  viewZoom: number
  fitScale: number
  viewNonce: number
  showGrid: boolean
  bgNonce: number
  activeObjectId: string | null
  layers: LayerItem[]

  /** Left Hierarchy Sidebar & Contextual Floating Pop-Out Windows */
  isHierarchyOpen: boolean
  leftSidebarView: 'layers' | 'vault'
  activeFloatingWindow: FloatingWindowType
  leftDrawerTab: LeftDrawerTab
  rightActiveTab: RightInspectorTab
  isRightPanelOpen: boolean

  toggleHierarchySidebar: () => void
  setLeftSidebarView: (view: 'layers' | 'vault') => void
  setActiveFloatingWindow: (win: FloatingWindowType) => void
  toggleFloatingWindow: (win: Exclude<FloatingWindowType, null>) => void
  setLeftDrawerTab: (tab: LeftDrawerTab) => void
  toggleLeftDrawer: (tab?: Exclude<LeftDrawerTab, null>) => void
  setRightActiveTab: (tab: RightInspectorTab) => void
  toggleRightPanel: () => void

  /** Binary Deflated Transaction Ledger (Uint8Array packets via pako) */
  transactionLedger: Uint8Array[]
  ledgerCursor: number

  canUndo: boolean
  canRedo: boolean
  currentProjectId: string | null
  currentProjectName: string
  isAiModeOpen: boolean

  setFabricCanvas: (canvas: FabricCanvas | null) => void
  setActiveTool: (tool: ToolType) => void
  setCanvasSize: (size: CanvasSize) => void
  setViewZoom: (zoom: number) => void
  setFitScale: (scale: number) => void
  resetView: () => void
  toggleGrid: () => void
  bumpBgNonce: () => void
  setActiveObjectId: (id: string | null) => void
  setLayers: (layers: LayerItem[]) => void
  syncLayersFromCanvas: () => void
  snapshot: () => void
  snapshotSoon: () => void
  undo: () => Promise<void>
  redo: () => Promise<void>
  setCurrentProjectId: (id: string | null) => void
  setCurrentProjectName: (name: string) => void
  setIsAiModeOpen: (open: boolean) => void
  toggleAiMode: () => void
}

function resolveNodeLabel(type: string, index: number): string {
  const map: Record<string, string> = {
    rect: 'Rectangle',
    circle: 'Circle',
    triangle: 'Triangle',
    line: 'Line',
    path: 'Vector Path',
    'i-text': 'Text Layer',
    text: 'Text Layer',
    image: 'Image Asset',
    group: 'Layer Group',
  }
  return `${map[type] || 'Vector Node'} ${index + 1}`
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set, get) => ({
    currentView: 'landing',
    user: null,
    setCurrentView: (view) => set({ currentView: view }),
    setUser: (user) => set({ user, currentView: user ? 'editor' : 'landing' }),
    logout: () => set({ user: null, currentView: 'landing' }),

    fabricCanvas: null,
    activeTool: 'select',
    canvasSize: CANVAS_PRESETS[0],
    viewZoom: 1,
    fitScale: 1,
    viewNonce: 0,
    showGrid: false,
    bgNonce: 0,
    activeObjectId: null,
    layers: [],

    isHierarchyOpen: true,
    leftSidebarView: 'layers',
    activeFloatingWindow: null,
    leftDrawerTab: null,
    rightActiveTab: 'properties',
    isRightPanelOpen: true,

    toggleHierarchySidebar: () => set((s) => ({ isHierarchyOpen: !s.isHierarchyOpen })),
    setLeftSidebarView: (view) => set({ leftSidebarView: view, isHierarchyOpen: true }),
    setActiveFloatingWindow: (win) =>
      set({
        activeFloatingWindow: win,
        leftDrawerTab: win === 'ai' ? null : (win as LeftDrawerTab),
        isAiModeOpen: win === 'ai',
      }),
    toggleFloatingWindow: (win) =>
      set((s) => {
        const next = s.activeFloatingWindow === win ? null : win
        return {
          activeFloatingWindow: next,
          leftDrawerTab: next === 'ai' ? null : (next as LeftDrawerTab),
          isAiModeOpen: next === 'ai',
        }
      }),

    setLeftDrawerTab: (tab) =>
      set({
        leftDrawerTab: tab,
        activeFloatingWindow: tab === 'vault' ? null : (tab as FloatingWindowType),
        ...(tab === 'vault' ? { leftSidebarView: 'vault', isHierarchyOpen: true } : {}),
      }),
    toggleLeftDrawer: (targetTab = 'create') =>
      set((s) => {
        if (targetTab === 'vault') {
          return {
            leftSidebarView: 'vault',
            isHierarchyOpen: !(s.isHierarchyOpen && s.leftSidebarView === 'vault'),
          }
        }
        const next = s.activeFloatingWindow === targetTab ? null : targetTab
        return {
          activeFloatingWindow: next,
          leftDrawerTab: next,
          isAiModeOpen: false,
        }
      }),
    setRightActiveTab: (tab) =>
      set({
        rightActiveTab: tab,
        isRightPanelOpen: true,
        ...(tab === 'ai' ? { activeFloatingWindow: 'ai', isAiModeOpen: true } : {}),
        ...(tab === 'layers' ? { leftSidebarView: 'layers', isHierarchyOpen: true } : {}),
      }),
    toggleRightPanel: () => set((s) => ({ isRightPanelOpen: !s.isRightPanelOpen })),

    transactionLedger: [],
    ledgerCursor: -1,
    canUndo: false,
    canRedo: false,
    currentProjectId: null,
    currentProjectName: 'Untitled Design',
    isAiModeOpen: false,

    setFabricCanvas: (canvas) => set({ fabricCanvas: canvas }),
    setActiveTool: (tool) => set({ activeTool: tool }),
    setCanvasSize: (size) => set({ canvasSize: size }),
    setViewZoom: (zoom) => set({ viewZoom: Math.min(4, Math.max(0.25, zoom)) }),
    setFitScale: (scale) => set({ fitScale: scale }),
    resetView: () => set((s) => ({ viewZoom: 1, viewNonce: s.viewNonce + 1 })),
    toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
    bumpBgNonce: () => set((s) => ({ bgNonce: s.bgNonce + 1 })),
    setActiveObjectId: (id) => set({ activeObjectId: id }),
    setLayers: (layers) => set({ layers }),

    syncLayersFromCanvas: () => {
      const { fabricCanvas } = get()
      if (!fabricCanvas) return
      const objs = fabricCanvas.getObjects()
      const layers: LayerItem[] = objs
        .slice()
        .reverse()
        .map((obj, idx) => ({
          id: (obj as any).__uid || `node-${idx}`,
          name: (obj as any).corexLabel || resolveNodeLabel(obj.type || 'object', idx),
          type: obj.type || 'object',
          visible: obj.visible ?? true,
          locked: !(obj.selectable ?? true),
          fabricObject: obj,
        }))
      set({ layers })
    },

    snapshot: () => {
      const { fabricCanvas, transactionLedger, ledgerCursor } = get()
      if (!fabricCanvas || (fabricCanvas as any)._isRestoring) return
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        debounceTimer = null
      }
      const binaryFrame = encodeSceneTransaction((fabricCanvas as any).toJSON(['__uid', 'corexLabel']))
      const nextLedger = transactionLedger.slice(0, ledgerCursor + 1)
      nextLedger.push(binaryFrame)
      if (nextLedger.length > MAX_LEDGER_FRAMES) nextLedger.shift()
      const nextCursor = nextLedger.length - 1
      set({
        transactionLedger: nextLedger,
        ledgerCursor: nextCursor,
        canUndo: nextCursor > 0,
        canRedo: false,
      })
      get().syncLayersFromCanvas()
    },

    snapshotSoon: () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        debounceTimer = null
        get().snapshot()
      }, 220)
    },

    undo: async () => {
      const { fabricCanvas, transactionLedger, ledgerCursor } = get()
      if (!fabricCanvas || ledgerCursor <= 0) return
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        debounceTimer = null
      }
      const prevCursor = ledgerCursor - 1
      const decodedJson = decodeSceneTransaction(transactionLedger[prevCursor])
      ;(fabricCanvas as any)._isRestoring = true
      await fabricCanvas.loadFromJSON(JSON.parse(decodedJson))
      fabricCanvas.requestRenderAll()
      ;(fabricCanvas as any)._isRestoring = false
      set({
        ledgerCursor: prevCursor,
        canUndo: prevCursor > 0,
        canRedo: true,
        activeObjectId: null,
      })
      get().syncLayersFromCanvas()
    },

    redo: async () => {
      const { fabricCanvas, transactionLedger, ledgerCursor } = get()
      if (!fabricCanvas || ledgerCursor >= transactionLedger.length - 1) return
      const nextCursor = ledgerCursor + 1
      const decodedJson = decodeSceneTransaction(transactionLedger[nextCursor])
      ;(fabricCanvas as any)._isRestoring = true
      await fabricCanvas.loadFromJSON(JSON.parse(decodedJson))
      fabricCanvas.requestRenderAll()
      ;(fabricCanvas as any)._isRestoring = false
      set({
        ledgerCursor: nextCursor,
        canUndo: true,
        canRedo: nextCursor < transactionLedger.length - 1,
        activeObjectId: null,
      })
      get().syncLayersFromCanvas()
    },

    setCurrentProjectId: (id) => set({ currentProjectId: id }),
    setCurrentProjectName: (name) => set({ currentProjectName: name }),
    setIsAiModeOpen: (open) =>
      set({
        isAiModeOpen: open,
        activeFloatingWindow: open ? 'ai' : null,
      }),
    toggleAiMode: () =>
      set((s) => {
        const nextOpen = s.activeFloatingWindow !== 'ai'
        return {
          isAiModeOpen: nextOpen,
          activeFloatingWindow: nextOpen ? 'ai' : null,
        }
      }),
  }))
)
