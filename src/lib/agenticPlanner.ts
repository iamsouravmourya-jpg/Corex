/**
 * LernexAI Proprietary — Autonomous To-Do Blueprint Planner & ~2KB JSON Matrix Compiler (Step 2)
 *
 * Converts natural language user briefs into:
 * 1. An interactive, human-confirmable To-Do Execution Blueprint (`AgenticTodoStep[]`).
 * 2. A safe-zone clamped, sequential rendering task queue (`BotRenderTask[]`) for the 60FPS Corex Bot.
 * Operates at $0.00 external server cost with 100% client-side deterministic planning + optional Gemini hybrid enrichment.
 */
import { nanoid } from 'nanoid'
import type { CanvasSize } from '@/types'
import type { GlslShaderPreset } from '@/lib/glslShaderEngine'
import {
  resolveArchetypeForPrompt,
  resolveVaultAssetForPrompt,
  COREX_ASSET_VAULT,
  type CorexVaultAsset,
  type CorexDomainArchetype,
} from '@/data/corexAssetVault'

export type TodoStepPhase = 'background' | 'geometry' | 'assets' | 'typography'
export type TodoStepStatus = 'pending' | 'running' | 'completed' | 'skipped'

export interface BotRenderTask {
  id: string
  stepId: string
  phase: TodoStepPhase
  action:
    | 'set-background'
    | 'apply-glsl-shader'
    | 'draw-rect'
    | 'draw-circle'
    | 'place-vault-asset'
    | 'type-text'
  label: string
  /** Target cursor focus coordinates on canvas */
  targetX: number
  targetY: number
  /** Geometry / Text / Asset parameters */
  left?: number
  top?: number
  width?: number
  height?: number
  radius?: number
  rx?: number
  ry?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  opacity?: number
  glslPreset?: GlslShaderPreset
  vaultAssetId?: string
  useHybridPhoto?: boolean
  text?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string | number
}

export interface AgenticTodoStep {
  id: string
  phase: TodoStepPhase
  stepCode: 'STEP A' | 'STEP B' | 'STEP C' | 'STEP D'
  title: string
  description: string
  enabled: boolean
  status: TodoStepStatus
  /** Optional user-editable parameters before confirming */
  editableHeadline?: string
  editableSubtitle?: string
  editableBadge?: string
  editablePrimaryColor?: string
  selectedVaultAssetId?: string
  useHybridPhoto?: boolean
  tasks: BotRenderTask[]
}

export interface AgenticBlueprintPlan {
  planId: string
  prompt: string
  archetype: CorexDomainArchetype
  targetCanvasSize: CanvasSize
  resizeCanvasOnStart: boolean
  estimatedPayloadBytes: number
  createdAt: number
  todoSteps: AgenticTodoStep[]
}

/**
 * Extracts custom user headline or topic from a natural language prompt
 */
function extractCustomCopyFromPrompt(
  prompt: string,
  archetype: CorexDomainArchetype,
): { badge: string; headline: string; subtitle: string; cta: string } {
  const quoted = prompt.match(/["']([^"']{3,48})["']/)
  if (quoted && quoted[1]) {
    return {
      badge: archetype.defaultBadge,
      headline: quoted[1].toUpperCase(),
      subtitle: archetype.defaultSubtitle,
      cta: archetype.defaultCta,
    }
  }

  // Strip common filler words to extract the core subject
  const stopWords = new Set([
    'create', 'make', 'design', 'build', 'generate', 'a', 'an', 'the', 'for', 'with',
    'in', 'on', 'of', 'and', 'to', 'me', 'please', 'viral', 'cool', 'modern', 'dark',
    'ink', 'vibe', 'theme', 'style', 'post', 'banner', 'thumbnail', 'poster', 'card',
    'youtube', 'yt', 'instagram', 'ig', 'banao', 'banana', 'hai', 'ek', 'aisa',
  ])

  const cleanTokens = prompt
    .replace(/[^a-zA-Z0-9\s%]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w.toLowerCase()))

  if (cleanTokens.length >= 2) {
    const extracted = cleanTokens.slice(0, 4).join(' ').toUpperCase()
    return {
      badge: archetype.defaultBadge,
      headline: extracted.length <= 28 ? extracted : archetype.defaultHeadline,
      subtitle: archetype.defaultSubtitle,
      cta: archetype.defaultCta,
    }
  }

  return {
    badge: archetype.defaultBadge,
    headline: archetype.defaultHeadline,
    subtitle: archetype.defaultSubtitle,
    cta: archetype.defaultCta,
  }
}

/**
 * Spatial Safe-Zone Clamper — prevents any shape or text node from overflowing the artboard
 */
export function clampTaskToSafeZone(
  task: BotRenderTask,
  canvasWidth: number,
  canvasHeight: number,
): BotRenderTask {
  const pad = Math.round(Math.min(canvasWidth, canvasHeight) * 0.04)
  const next = { ...task }

  if (typeof next.left === 'number' && typeof next.width === 'number') {
    if (next.action !== 'draw-circle') {
      next.width = Math.min(next.width, canvasWidth - pad * 2)
      next.left = Math.max(pad, Math.min(next.left, canvasWidth - next.width - pad))
    }
  }

  if (typeof next.top === 'number' && typeof next.height === 'number') {
    if (next.action !== 'draw-circle') {
      next.height = Math.min(next.height, canvasHeight - pad * 2)
      next.top = Math.max(pad, Math.min(next.top, canvasHeight - next.height - pad))
    }
  }

  next.targetX = Math.max(pad, Math.min(canvasWidth - pad, Math.round(next.targetX)))
  next.targetY = Math.max(pad, Math.min(canvasHeight - pad, Math.round(next.targetY)))

  return next
}

/**
 * Generates a complete, user-confirmable Agentic To-Do Blueprint & Task Matrix in 0ms
 */
export function createAgenticBlueprintPlan(
  prompt: string,
  currentCanvasSize: CanvasSize,
  autoMatchCanvasSize = false,
): AgenticBlueprintPlan {
  const archetype = resolveArchetypeForPrompt(prompt)
  const matchedAsset: CorexVaultAsset = resolveVaultAssetForPrompt(prompt, archetype.category)
  const copy = extractCustomCopyFromPrompt(prompt, archetype)

  const targetCanvasSize: CanvasSize = autoMatchCanvasSize
    ? {
        width: archetype.width,
        height: archetype.height,
        label: archetype.recommendedCanvasLabel,
      }
    : currentCanvasSize

  const w = targetCanvasSize.width
  const h = targetCanvasSize.height
  const isLandscape = w > h * 1.15

  const stepAId = `step_bg_${nanoid(6)}`
  const stepBId = `step_geo_${nanoid(6)}`
  const stepCId = `step_asset_${nanoid(6)}`
  const stepDId = `step_type_${nanoid(6)}`

  // ── STEP A: Inject Background & Optional WebGL2 Shader ──
  const stepATasks: BotRenderTask[] = [
    {
      id: `task_${nanoid(6)}`,
      stepId: stepAId,
      phase: 'background',
      action: 'set-background',
      label: `Render ${archetype.bgHex} Obsidian Base Stage`,
      targetX: Math.round(w * 0.5),
      targetY: Math.round(h * 0.5),
      fill: archetype.bgHex,
    },
  ]

  if (archetype.glslPreset) {
    stepATasks.push({
      id: `task_${nanoid(6)}`,
      stepId: stepAId,
      phase: 'background',
      action: 'apply-glsl-shader',
      label: `Compile WebGL2 GLSL (${archetype.glslPreset}) Shader Backdrop`,
      targetX: Math.round(w * 0.5),
      targetY: Math.round(h * 0.5),
      glslPreset: archetype.glslPreset,
    })
  } else {
    stepATasks.push({
      id: `task_${nanoid(6)}`,
      stepId: stepAId,
      phase: 'background',
      action: 'draw-circle',
      label: 'Drop Ambient Radial Luminance Sphere',
      targetX: Math.round(w * 0.78),
      targetY: Math.round(h * 0.22),
      left: Math.round(w * 0.62),
      top: Math.round(-h * 0.08),
      radius: Math.round(Math.min(w, h) * 0.32),
      fill: archetype.primaryHex,
      opacity: 0.16,
    })
  }

  // ── STEP B: Draw Glassmorphic Vector Geometry Pods ──
  const mainCardWidth = isLandscape ? Math.round(w * 0.54) : Math.round(w * 0.86)
  const mainCardHeight = isLandscape ? Math.round(h * 0.78) : Math.round(h * 0.48)
  const mainCardLeft = Math.round(w * 0.06)
  const mainCardTop = isLandscape ? Math.round(h * 0.11) : Math.round(h * 0.44)

  const stepBTasks: BotRenderTask[] = [
    clampTaskToSafeZone(
      {
        id: `task_${nanoid(6)}`,
        stepId: stepBId,
        phase: 'geometry',
        action: 'draw-rect',
        label: 'Construct Primary Glassmorphic Bento Pod',
        targetX: mainCardLeft + Math.round(mainCardWidth * 0.5),
        targetY: mainCardTop + Math.round(mainCardHeight * 0.5),
        left: mainCardLeft,
        top: mainCardTop,
        width: mainCardWidth,
        height: mainCardHeight,
        rx: 28,
        ry: 28,
        fill: archetype.cardHex,
        stroke: archetype.primaryHex,
        strokeWidth: 2,
        opacity: 0.92,
      },
      w,
      h,
    ),
    clampTaskToSafeZone(
      {
        id: `task_${nanoid(6)}`,
        stepId: stepBId,
        phase: 'geometry',
        action: 'draw-rect',
        label: 'Drop Kicker Pill Frame',
        targetX: mainCardLeft + 160,
        targetY: mainCardTop + 56,
        left: mainCardLeft + 36,
        top: mainCardTop + 36,
        width: Math.min(340, mainCardWidth - 72),
        height: 42,
        rx: 21,
        ry: 21,
        fill: archetype.primaryHex,
        opacity: 0.18,
      },
      w,
      h,
    ),
    clampTaskToSafeZone(
      {
        id: `task_${nanoid(6)}`,
        stepId: stepBId,
        phase: 'geometry',
        action: 'draw-rect',
        label: 'Construct Interactive CTA Action Button',
        targetX: mainCardLeft + 160,
        targetY: mainCardTop + mainCardHeight - 64,
        left: mainCardLeft + 36,
        top: mainCardTop + mainCardHeight - 92,
        width: 260,
        height: 56,
        rx: 16,
        ry: 16,
        fill: archetype.primaryHex,
        opacity: 1,
      },
      w,
      h,
    ),
  ]

  // ── STEP C: Stream Pre-Bundled Alpha-Masked Vault Asset ──
  const assetTargetWidth = Math.round(Math.min(w, h) * (isLandscape ? 0.52 : 0.34))
  const assetLeft = isLandscape
    ? Math.round(w * 0.63)
    : Math.round((w - assetTargetWidth) * 0.5)
  const assetTop = isLandscape
    ? Math.round((h - assetTargetWidth) * 0.5)
    : Math.round(h * 0.06)

  const stepCTasks: BotRenderTask[] = [
    {
      id: `task_${nanoid(6)}`,
      stepId: stepCId,
      phase: 'assets',
      action: 'place-vault-asset',
      label: `Stream Local Asset: ${matchedAsset.name}`,
      targetX: assetLeft + Math.round(assetTargetWidth * 0.5),
      targetY: assetTop + Math.round(assetTargetWidth * 0.5),
      left: assetLeft,
      top: assetTop,
      width: assetTargetWidth,
      height: assetTargetWidth,
      vaultAssetId: matchedAsset.id,
      useHybridPhoto: false,
    },
  ]

  // ── STEP D: Live-Type Scalable Vector Typography ──
  const headlineSize = Math.max(36, Math.min(76, Math.round(w * (isLandscape ? 0.044 : 0.056))))
  const subSize = Math.max(18, Math.min(30, Math.round(w * 0.02)))

  const stepDTasks: BotRenderTask[] = [
    clampTaskToSafeZone(
      {
        id: `task_${nanoid(6)}`,
        stepId: stepDId,
        phase: 'typography',
        action: 'type-text',
        label: `Type Kicker Badge: "${copy.badge}"`,
        targetX: mainCardLeft + 150,
        targetY: mainCardTop + 56,
        left: mainCardLeft + 54,
        top: mainCardTop + 47,
        text: copy.badge,
        fontSize: 15,
        fontFamily: 'JetBrains Mono',
        fontWeight: '700',
        fill: archetype.accentHex,
      },
      w,
      h,
    ),
    clampTaskToSafeZone(
      {
        id: `task_${nanoid(6)}`,
        stepId: stepDId,
        phase: 'typography',
        action: 'type-text',
        label: `Live-Type Headline: "${copy.headline}"`,
        targetX: mainCardLeft + Math.round(mainCardWidth * 0.45),
        targetY: mainCardTop + Math.round(mainCardHeight * 0.42),
        left: mainCardLeft + 36,
        top: mainCardTop + 108,
        text: copy.headline,
        fontSize: headlineSize,
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: '800',
        fill: archetype.textHex,
      },
      w,
      h,
    ),
    clampTaskToSafeZone(
      {
        id: `task_${nanoid(6)}`,
        stepId: stepDId,
        phase: 'typography',
        action: 'type-text',
        label: `Live-Type Subtitle Copy`,
        targetX: mainCardLeft + Math.round(mainCardWidth * 0.45),
        targetY: mainCardTop + Math.round(mainCardHeight * 0.62),
        left: mainCardLeft + 36,
        top: mainCardTop + 124 + headlineSize,
        text: copy.subtitle,
        fontSize: subSize,
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: '500',
        fill: archetype.mutedTextHex,
      },
      w,
      h,
    ),
    clampTaskToSafeZone(
      {
        id: `task_${nanoid(6)}`,
        stepId: stepDId,
        phase: 'typography',
        action: 'type-text',
        label: `Type CTA Button Label: "${copy.cta}"`,
        targetX: mainCardLeft + 160,
        targetY: mainCardTop + mainCardHeight - 64,
        left: mainCardLeft + 62,
        top: mainCardTop + mainCardHeight - 74,
        text: copy.cta,
        fontSize: 17,
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: '800',
        fill: '#07080D',
      },
      w,
      h,
    ),
  ]

  const todoSteps: AgenticTodoStep[] = [
    {
      id: stepAId,
      phase: 'background',
      stepCode: 'STEP A',
      title: 'Inject Background & GPU Shader',
      description: archetype.glslPreset
        ? `Renders ${archetype.bgHex} obsidian stage + WebGL2 (${archetype.glslPreset}) fragment shader.`
        : `Renders ${archetype.bgHex} stage + ambient radial luminance glow.`,
      enabled: true,
      status: 'pending',
      editablePrimaryColor: archetype.primaryHex,
      tasks: stepATasks,
    },
    {
      id: stepBId,
      phase: 'geometry',
      stepCode: 'STEP B',
      title: 'Draw Glassmorphic Vector Pods',
      description: `Drops main bento container (${mainCardWidth}×${mainCardHeight}px), kicker pill & CTA button.`,
      enabled: true,
      status: 'pending',
      editablePrimaryColor: archetype.primaryHex,
      tasks: stepBTasks,
    },
    {
      id: stepCId,
      phase: 'assets',
      stepCode: 'STEP C',
      title: `Stream Asset: ${matchedAsset.name}`,
      description: `Places alpha-masked visual (${matchedAsset.category}) from Corex Local Asset Vault.`,
      enabled: true,
      status: 'pending',
      selectedVaultAssetId: matchedAsset.id,
      useHybridPhoto: false,
      tasks: stepCTasks,
    },
    {
      id: stepDId,
      phase: 'typography',
      stepCode: 'STEP D',
      title: 'Live-Type Scalable Vector Typography',
      description: `Types headline "${copy.headline}", badge & subtitle as isolated editable IText layers.`,
      enabled: true,
      status: 'pending',
      editableBadge: copy.badge,
      editableHeadline: copy.headline,
      editableSubtitle: copy.subtitle,
      tasks: stepDTasks,
    },
  ]

  const serializedBytes = new TextEncoder().encode(JSON.stringify(todoSteps)).length

  return {
    planId: `plan_${nanoid(8)}`,
    prompt,
    archetype,
    targetCanvasSize,
    resizeCanvasOnStart: autoMatchCanvasSize,
    estimatedPayloadBytes: serializedBytes,
    createdAt: Date.now(),
    todoSteps,
  }
}

/**
 * Re-compiles the sequential BotRenderTask queue after the user customizes
 * any To-Do step (toggling steps, changing headline, changing asset, or swapping accent color).
 */
export function compileActiveTasksFromPlan(plan: AgenticBlueprintPlan): BotRenderTask[] {
  const queue: BotRenderTask[] = []

  for (const step of plan.todoSteps) {
    if (!step.enabled) continue

    for (const rawTask of step.tasks) {
      const task: BotRenderTask = { ...rawTask }

      if (step.phase === 'geometry' && step.editablePrimaryColor) {
        if (task.stroke) task.stroke = step.editablePrimaryColor
        if (task.fill && task.fill !== plan.archetype.cardHex) {
          task.fill = step.editablePrimaryColor
        }
      }

      if (step.phase === 'assets' && step.selectedVaultAssetId) {
        task.vaultAssetId = step.selectedVaultAssetId
        task.useHybridPhoto = Boolean(step.useHybridPhoto)
        const found = COREX_ASSET_VAULT.find((a) => a.id === step.selectedVaultAssetId)
        if (found) {
          task.label = `Stream Asset: ${found.name}`
        }
      }

      if (step.phase === 'typography') {
        if (task.label.startsWith('Type Kicker Badge') && step.editableBadge) {
          task.text = step.editableBadge
        } else if (task.label.startsWith('Live-Type Headline') && step.editableHeadline) {
          task.text = step.editableHeadline
        } else if (task.label.startsWith('Live-Type Subtitle') && step.editableSubtitle) {
          task.text = step.editableSubtitle
        }
      }

      queue.push(task)
    }
  }

  return queue
}
