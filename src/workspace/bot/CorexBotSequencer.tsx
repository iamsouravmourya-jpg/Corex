/**
 * LernexAI Proprietary — 60FPS Autonomous Corex Bot & Visual Radial Drift Sequencer (Step 3)
 *
 * Executes the validated AgenticBlueprintPlan 100% locally on the user's device (0% server load):
 * - Smooth 60FPS `requestAnimationFrame` virtual cursor with radial arc drift
 * - Step A: Obsidian background + WebGL2 GLSL ES 3.00 fragment shader compilation
 * - Step B: Spring-animated glassmorphic vector geometry pods
 * - Step C: Zero-CORS hybrid/local asset streaming with 2.5s timeout fallback
 * - Step D: Real-time character-by-character vector typography live typing
 * - Single atomic ZLIB Undo snapshot upon completion
 */
import React from 'react'
import { Rect, Circle, IText, FabricImage, type Canvas as FabricCanvas } from 'fabric'
import { nanoid } from 'nanoid'
import { Zap, FastForward, Square, Sparkles } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { renderGlslShaderToDataUrl, DEFAULT_GLSL_UNIFORMS } from '@/lib/glslShaderEngine'
import { COREX_ASSET_VAULT } from '@/data/corexAssetVault'
import {
  compileActiveTasksFromPlan,
  type AgenticBlueprintPlan,
  type BotRenderTask,
} from '@/lib/agenticPlanner'

let skipRequested = false
let abortRequested = false

export function skipCorexBotToInstantFinish() {
  skipRequested = true
}

export function abortCorexBotSequence() {
  abortRequested = true
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Animates the virtual bot cursor from (x0, y0) to (x1, y1) along a subtle radial curve at 60FPS
 */
function glideBotCursor(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  durationMs: number,
): Promise<void> {
  if (skipRequested || abortRequested || durationMs <= 0) {
    useEditorStore.getState().setBotTelemetry({ botCursorPos: { x: toX, y: toY } })
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const start = performance.now()
    const dx = toX - fromX
    const dy = toY - fromY
    const dist = Math.hypot(dx, dy)
    // Radial drift perpendicular offset for organic robotic motion
    const arcOffset = Math.min(64, dist * 0.18)

    function tick(now: number) {
      if (skipRequested || abortRequested) {
        useEditorStore.getState().setBotTelemetry({ botCursorPos: { x: toX, y: toY } })
        resolve()
        return
      }
      const elapsed = now - start
      const rawT = Math.min(1, elapsed / durationMs)
      const eased = easeInOutCubic(rawT)
      const radialDrift = Math.sin(rawT * Math.PI) * arcOffset

      const curX = Math.round(fromX + dx * eased - radialDrift * 0.35)
      const curY = Math.round(fromY + dy * eased + radialDrift * 0.65)

      useEditorStore.getState().setBotTelemetry({ botCursorPos: { x: curX, y: curY } })

      if (rawT < 1) {
        requestAnimationFrame(tick)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(tick)
  })
}

/**
 * Loads a FabricImage with a strict timeout and automatic fallback to the 0ms local SVG Data URI
 */
async function loadVaultImageWithFallback(
  primaryUrl: string,
  fallbackDataUri: string,
  timeoutMs = 2400,
): Promise<FabricImage> {
  if (primaryUrl.startsWith('data:')) {
    return FabricImage.fromURL(primaryUrl)
  }

  try {
    const imgPromise = FabricImage.fromURL(primaryUrl, { crossOrigin: 'anonymous' })
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Asset stream timeout')), timeoutMs),
    )
    return await Promise.race([imgPromise, timeoutPromise])
  } catch {
    return FabricImage.fromURL(fallbackDataUri)
  }
}

/**
 * Animates a newly placed Fabric object's opacity from 0.15 -> targetOpacity at 60FPS
 */
function animateNodeAppear(
  stage: FabricCanvas,
  node: any,
  targetOpacity: number,
  durationMs = 180,
): Promise<void> {
  if (skipRequested || abortRequested || durationMs <= 0) {
    node.set({ opacity: targetOpacity })
    stage.requestRenderAll()
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const start = performance.now()
    node.set({ opacity: 0.15 })

    function frame(now: number) {
      if (skipRequested || abortRequested) {
        node.set({ opacity: targetOpacity })
        stage.requestRenderAll()
        resolve()
        return
      }
      const t = Math.min(1, (now - start) / durationMs)
      node.set({ opacity: 0.15 + (targetOpacity - 0.15) * easeInOutCubic(t) })
      stage.requestRenderAll()
      if (t < 1) {
        requestAnimationFrame(frame)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(frame)
  })
}

/**
 * Types out an IText node character-by-character at 60FPS
 */
function animateTypewriterText(
  stage: FabricCanvas,
  textNode: IText,
  fullText: string,
  durationMs = 340,
): Promise<void> {
  if (skipRequested || abortRequested || !fullText) {
    textNode.set({ text: fullText })
    stage.requestRenderAll()
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const start = performance.now()
    const totalChars = fullText.length

    function frame(now: number) {
      if (skipRequested || abortRequested) {
        textNode.set({ text: fullText })
        stage.requestRenderAll()
        resolve()
        return
      }
      const t = Math.min(1, (now - start) / durationMs)
      const count = Math.max(1, Math.ceil(t * totalChars))
      textNode.set({ text: fullText.slice(0, count) })
      stage.requestRenderAll()

      if (t < 1) {
        requestAnimationFrame(frame)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(frame)
  })
}

/**
 * Executes a single BotRenderTask on the active FabricCanvas
 */
async function executeSingleBotTask(stage: FabricCanvas, task: BotRenderTask): Promise<void> {
  const targetOpacity = task.opacity ?? 1

  switch (task.action) {
    case 'set-background': {
      stage.backgroundColor = task.fill || '#07080D'
      useEditorStore.getState().bumpBgNonce()
      stage.requestRenderAll()
      break
    }

    case 'apply-glsl-shader': {
      try {
        const preset = task.glslPreset || 'aurora-plasma'
        const { dataUrl } = renderGlslShaderToDataUrl(
          preset,
          stage.getWidth(),
          stage.getHeight(),
          DEFAULT_GLSL_UNIFORMS,
        )
        const shaderImg = await FabricImage.fromURL(dataUrl)
        shaderImg.set({ left: 0, top: 0, selectable: true, opacity: 0.85 })
        ;(shaderImg as any).__uid = `cx_glsl_${nanoid(8)}`
        ;(shaderImg as any).corexLabel = `GLSL Shader (${preset})`
        stage.add(shaderImg)
        stage.sendObjectToBack(shaderImg)
        await animateNodeAppear(stage, shaderImg, 0.85, 220)
      } catch {
        // Fallback if WebGL2 context is unavailable
        stage.backgroundColor = '#090C15'
        stage.requestRenderAll()
      }
      break
    }

    case 'draw-rect': {
      const rect = new Rect({
        left: task.left ?? 60,
        top: task.top ?? 60,
        width: task.width ?? 320,
        height: task.height ?? 200,
        rx: task.rx ?? 20,
        ry: task.ry ?? 20,
        fill: task.fill ?? '#111522',
        stroke: task.stroke,
        strokeWidth: task.strokeWidth ?? 0,
        opacity: targetOpacity,
      })
      ;(rect as any).__uid = `cx_bot_${nanoid(8)}`
      ;(rect as any).corexLabel = task.label.replace(/^Construct |^Drop /, '')
      stage.add(rect)
      await animateNodeAppear(stage, rect, targetOpacity, 180)
      break
    }

    case 'draw-circle': {
      const circle = new Circle({
        left: task.left ?? 100,
        top: task.top ?? 100,
        radius: task.radius ?? 140,
        fill: task.fill ?? '#06B6D4',
        opacity: targetOpacity,
      })
      ;(circle as any).__uid = `cx_bot_${nanoid(8)}`
      ;(circle as any).corexLabel = task.label.replace(/^Drop /, '')
      stage.add(circle)
      await animateNodeAppear(stage, circle, targetOpacity, 180)
      break
    }

    case 'place-vault-asset': {
      const vaultItem =
        COREX_ASSET_VAULT.find((a) => a.id === task.vaultAssetId) || COREX_ASSET_VAULT[0]
      const primaryUrl =
        task.useHybridPhoto && vaultItem.onlineImageUrl
          ? vaultItem.onlineImageUrl
          : vaultItem.localDataUri

      const img = await loadVaultImageWithFallback(primaryUrl, vaultItem.localDataUri)
      const desiredWidth = task.width ?? 340
      const scale = desiredWidth / (img.width || 400)

      img.set({
        left: task.left ?? Math.round(stage.getWidth() * 0.6),
        top: task.top ?? Math.round(stage.getHeight() * 0.2),
        scaleX: scale,
        scaleY: scale,
        opacity: targetOpacity,
      })
      ;(img as any).__uid = `cx_asset_${nanoid(8)}`
      ;(img as any).corexLabel = vaultItem.name
      stage.add(img)
      await animateNodeAppear(stage, img, targetOpacity, 240)
      break
    }

    case 'type-text': {
      const fullText = task.text || 'COREX STUDIO'
      const textNode = new IText(skipRequested ? fullText : '', {
        left: task.left ?? 80,
        top: task.top ?? 120,
        fontSize: task.fontSize ?? 42,
        fontFamily: task.fontFamily ?? 'Plus Jakarta Sans',
        fontWeight: (task.fontWeight as any) ?? '800',
        fill: task.fill ?? '#F8FAFC',
        opacity: targetOpacity,
      })
      ;(textNode as any).__uid = `cx_text_${nanoid(8)}`
      ;(textNode as any).corexLabel = fullText.slice(0, 24)
      stage.add(textNode)
      await animateTypewriterText(stage, textNode, fullText, 320)
      break
    }
  }
}

/**
 * Master Orchestrator: Runs the confirmed AgenticBlueprintPlan on the live stage
 */
export async function runCorexBotSequence(
  plan: AgenticBlueprintPlan,
  options?: { clearExistingCanvas?: boolean },
): Promise<void> {
  const store = useEditorStore.getState()
  const stage = store.fabricCanvas
  if (!stage || store.isBotRunning) return

  skipRequested = false
  abortRequested = false

  // Resize canvas if requested by the plan
  if (plan.resizeCanvasOnStart) {
    store.setCanvasSize(plan.targetCanvasSize)
    stage.setDimensions({
      width: plan.targetCanvasSize.width,
      height: plan.targetCanvasSize.height,
    })
  }

  const tasks = compileActiveTasksFromPlan(plan)
  if (tasks.length === 0) return

  // Suppress intermediate undo frames so the entire bot run is a single atomic undo step
  ;(stage as any)._isRestoring = true

  if (options?.clearExistingCanvas !== false) {
    stage.clear()
  }

  let cursorX = Math.round(stage.getWidth() * 0.5)
  let cursorY = Math.round(stage.getHeight() * 0.5)

  store.setBotTelemetry({
    isBotRunning: true,
    botCursorPos: { x: cursorX, y: cursorY },
    activeBotTaskLabel: 'Initializing Corex Autonomous Bot...',
    botProgressPercent: 4,
  })

  // Reset all enabled steps to pending
  for (const step of plan.todoSteps) {
    store.updateTodoStep(step.id, {
      status: step.enabled ? 'pending' : 'skipped',
    })
  }

  try {
    let completedTasks = 0

    for (const step of plan.todoSteps) {
      if (!step.enabled) continue
      if (abortRequested) break

      store.updateTodoStep(step.id, { status: 'running' })

      const stepTasks = tasks.filter((t) => t.stepId === step.id)
      for (const task of stepTasks) {
        if (abortRequested) break

        store.setBotTelemetry({
          activeBotTaskLabel: `${step.stepCode}: ${task.label}`,
          botProgressPercent: Math.round(((completedTasks + 0.3) / tasks.length) * 100),
        })

        // Glide virtual cursor to target coordinates
        await glideBotCursor(cursorX, cursorY, task.targetX, task.targetY, 260)
        cursorX = task.targetX
        cursorY = task.targetY

        // Execute the canvas drawing / asset / live typing operation
        await executeSingleBotTask(stage, task)
        completedTasks++

        store.setBotTelemetry({
          botProgressPercent: Math.round((completedTasks / tasks.length) * 100),
        })
        store.syncLayersFromCanvas()
      }

      if (!abortRequested) {
        store.updateTodoStep(step.id, { status: 'completed' })
      }
    }
  } finally {
    ;(stage as any)._isRestoring = false
    stage.discardActiveObject()
    stage.requestRenderAll()
    store.syncLayersFromCanvas()
    store.snapshot()

    store.setBotTelemetry({
      isBotRunning: false,
      botCursorPos: null,
      activeBotTaskLabel: null,
      botProgressPercent: 100,
    })
  }
}

/**
 * Live Visual Overlay Component for the Stage (`<CorexBotStageOverlay />`)
 * Displays the glowing autonomous bot cursor + radial pulse + bottom HUD control bar while painting.
 */
export const CorexBotStageOverlay: React.FC<{ displayScale: number }> = ({ displayScale }) => {
  const isBotRunning = useEditorStore((s) => s.isBotRunning)
  const botCursorPos = useEditorStore((s) => s.botCursorPos)
  const activeBotTaskLabel = useEditorStore((s) => s.activeBotTaskLabel)
  const botProgressPercent = useEditorStore((s) => s.botProgressPercent)

  if (!isBotRunning) return null

  const scaledX = (botCursorPos?.x ?? 0) * displayScale
  const scaledY = (botCursorPos?.y ?? 0) * displayScale

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 45,
        pointerEvents: 'auto',
        cursor: 'wait',
        overflow: 'hidden',
      }}
    >
      {/* Glowing Autonomous Bot Cursor */}
      {botCursorPos && (
        <div
          style={{
            position: 'absolute',
            left: scaledX,
            top: scaledY,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            transition: 'left 32ms linear, top 32ms linear',
          }}
        >
          {/* Outer radial pulse ring */}
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(6,182,212,0.38) 0%, rgba(6,182,212,0) 72%)',
              border: '1.5px solid rgba(34, 211, 238, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 28px rgba(6, 182, 212, 0.55)',
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#22D3EE',
                boxShadow: '0 0 12px #22D3EE',
              }}
            />
          </div>

          {/* Floating Cursor Badge */}
          <div
            style={{
              position: 'absolute',
              left: 34,
              top: 10,
              whiteSpace: 'nowrap',
              padding: '5px 11px',
              borderRadius: 999,
              background: 'rgba(8, 9, 14, 0.92)',
              border: '1px solid rgba(34, 211, 238, 0.45)',
              color: '#F8FAFC',
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 10px 24px rgba(0,0,0,0.5)',
            }}
          >
            <Sparkles size={12} color="#22D3EE" />
            <span>COREX BOT</span>
          </div>
        </div>
      )}

      {/* Top-Center Live Telemetry & Instant Skip HUD Bar */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 14px',
          borderRadius: 16,
          background: 'rgba(12, 14, 22, 0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(6, 182, 212, 0.35)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          color: '#F8FAFC',
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={14} color="#22D3EE" />
          <span style={{ fontWeight: 700, color: '#22D3EE', fontFamily: "'JetBrains Mono', monospace" }}>
            {botProgressPercent}%
          </span>
          <span style={{ color: '#E2E8F0', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {activeBotTaskLabel || 'Painting stage layers...'}
          </span>
        </div>

        <button
          onClick={() => skipCorexBotToInstantFinish()}
          style={{
            padding: '5px 10px',
            borderRadius: 10,
            background: 'rgba(6, 182, 212, 0.18)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            color: '#22D3EE',
            fontSize: 11,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            cursor: 'pointer',
          }}
        >
          <FastForward size={12} />
          <span>Instant Finish</span>
        </button>

        <button
          onClick={() => abortCorexBotSequence()}
          style={{
            padding: '5px 9px',
            borderRadius: 10,
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            color: '#FB7185',
            fontSize: 11,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
          }}
        >
          <Square size={10} />
          <span>Stop</span>
        </button>
      </div>
    </div>
  )
}
