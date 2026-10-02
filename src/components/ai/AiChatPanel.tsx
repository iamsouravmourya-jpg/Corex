import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Palette,
  Plus,
  Wand2,
  ScanEye,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  Image as ImageIcon,
  Zap,
  CheckSquare,
  Square,
  Play,
} from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import {
  generateServerlessLayout,
  generateServerlessSvgArtwork,
  generateServerlessCritique,
  generateServerlessCopilotReply,
} from '@/lib/serverlessAi'
import { createAgenticBlueprintPlan } from '@/lib/agenticPlanner'
import { COREX_ASSET_VAULT } from '@/data/corexAssetVault'
import { runCorexBotSequence } from '@/workspace/bot/CorexBotSequencer'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import { addIText, addRect, addCircle, addTriangle, addImageFromDataUrl } from '@/lib/shapes'
import { Rect, Circle, Triangle, IText } from 'fabric'

interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
  suggestedColors?: string[]
  suggestedText?: string[]
  timestamp: string
}

type AiTab = 'bot' | 'chat' | 'generate' | 'image' | 'critique'

export function AiChatPanel() {
  const {
    setIsAiModeOpen,
    setActiveFloatingWindow,
    canvasSize,
    snapshot,
    bumpBgNonce,
    syncLayersFromCanvas,
    activeBlueprintPlan,
    setBlueprintPlan,
    updateTodoStep,
    isBotRunning,
  } = useEditorStore()
  const canvas = useFabricCanvas()

  const [activeTab, setActiveTab] = useState<AiTab>('bot')
  const [botPrompt, setBotPrompt] = useState('Create a viral tech YT Thumbnail with a dark ink vibe')
  const [autoResizeArtboard, setAutoResizeArtboard] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [designPrompt, setDesignPrompt] = useState('')
  const [isGeneratingDesign, setIsGeneratingDesign] = useState(false)
  const [imagePrompt, setImagePrompt] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [useCanvasReference, setUseCanvasReference] = useState(false)
  const [critiqueResult, setCritiqueResult] = useState<string | null>(null)
  const [critiqueColors, setCritiqueColors] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        '✨ **Corex AI Activated!**\n\nI am powered by Google Gemini. I can help you design faster, generate complete layouts, suggest aesthetic color palettes, write high-converting copy, or critique your current canvas composition.',
      suggestedColors: ['#08090E', '#06B6D4', '#14B8A6', '#10B981', '#F59E0B', '#F43F5E'],
      timestamp: 'Active',
    },
  ])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const showToast = (msg: string) => {
    setStatusMessage(msg)
    setTimeout(() => setStatusMessage(null), 3000)
  }

  const applyColorToCanvas = (color: string) => {
    if (!canvas) return
    canvas.set({ backgroundColor: color })
    canvas.requestRenderAll()
    snapshot()
    bumpBgNonce()
    showToast(`Canvas background set to ${color}`)
  }

  const addTextToCanvas = (text: string) => {
    if (!canvas) return
    addIText(canvas, text)
    showToast('Text layer added to canvas')
  }

  // 1. Send Chat Message to Gemini API
  const handleSendChat = async (presetPrompt?: string) => {
    const query = (presetPrompt || input).trim()
    if (!query || isTyping) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6),
          canvasContext: {
            width: canvasSize.width,
            height: canvasSize.height,
            label: canvasSize.label,
            objectCount: canvas ? canvas.getObjects().length : 0,
          },
        }),
      })

      const data = await res.json()

      if (res.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: data.text,
            suggestedColors: data.colors && data.colors.length > 0 ? data.colors : undefined,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      } else {
        throw new Error(data.error || 'Failed to generate response')
      }
    } catch {
      const local = generateServerlessCopilotReply(query)
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-local-${Date.now()}`,
          role: 'assistant',
          content: local.reply,
          suggestedColors: local.suggestedColors,
          timestamp: 'Serverless',
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  // 2. Text-to-Canvas Generator
  const handleGenerateDesign = async (promptToUse?: string) => {
    const prompt = (promptToUse || designPrompt).trim()
    if (!prompt || isGeneratingDesign || !canvas) return

    setIsGeneratingDesign(true)
    showToast('Gemini is generating layout elements...')

    try {
      const res = await fetch('/api/ai/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          canvasSize: { width: canvasSize.width, height: canvasSize.height },
        }),
      })

      const data = await res.json()

      if (res.ok && data.design) {
        const d = data.design

        // Clear existing canvas objects
        canvas.clear()

        // Set Background
        if (d.backgroundColor) {
          canvas.set({ backgroundColor: d.backgroundColor })
        }

        // Render generated elements
        if (Array.isArray(d.elements)) {
          d.elements.forEach((el: any) => {
            if (el.type === 'text' && el.text) {
              const textObj = new IText(el.text, {
                left: Number(el.left) || 100,
                top: Number(el.top) || 100,
                fontSize: Number(el.fontSize) || 36,
                fill: el.color || el.fill || '#FFFFFF',
                fontFamily: el.fontFamily || 'Sora',
                fontWeight: el.fontWeight || '700',
                textAlign: el.textAlign || 'left',
                opacity: el.opacity !== undefined ? Number(el.opacity) : 1,
              })
              ;(textObj as any).corexLabel = el.text.slice(0, 16)
              canvas.add(textObj)
            } else if (el.type === 'rect') {
              const rectObj = new Rect({
                left: Number(el.left) || 50,
                top: Number(el.top) || 50,
                width: Number(el.width) || 200,
                height: Number(el.height) || 100,
                fill: el.fill || '#F43F5E',
                stroke: el.stroke,
                strokeWidth: el.strokeWidth ? Number(el.strokeWidth) : 0,
                rx: 12,
                ry: 12,
                opacity: el.opacity !== undefined ? Number(el.opacity) : 1,
              })
              ;(rectObj as any).corexLabel = 'AI Shape'
              canvas.add(rectObj)
            } else if (el.type === 'circle') {
              const circleObj = new Circle({
                left: Number(el.left) || 50,
                top: Number(el.top) || 50,
                radius: Number(el.radius) || 60,
                fill: el.fill || '#8B5CF6',
                opacity: el.opacity !== undefined ? Number(el.opacity) : 1,
              })
              ;(circleObj as any).corexLabel = 'AI Circle'
              canvas.add(circleObj)
            }
          })
        }

        canvas.requestRenderAll()
        snapshot()
        bumpBgNonce()
        syncLayersFromCanvas()
        showToast('✨ AI Design Layout created on Canvas!')
      } else {
        throw new Error(data.error || 'Layout generation failed')
      }
    } catch {
      const d = generateServerlessLayout(prompt, canvasSize.width, canvasSize.height)
      canvas.clear()
      if (d.backgroundColor) canvas.set({ backgroundColor: d.backgroundColor })
      d.elements.forEach((el: any) => {
        if (el.type === 'text' && el.text) {
          const textObj = new IText(el.text, {
            left: Number(el.left) || 100,
            top: Number(el.top) || 100,
            fontSize: Number(el.fontSize) || 36,
            fill: el.fill || '#FFFFFF',
            fontFamily: el.fontFamily || 'Plus Jakarta Sans',
            fontWeight: el.fontWeight || '700',
            opacity: el.opacity !== undefined ? Number(el.opacity) : 1,
          })
          ;(textObj as any).corexLabel = el.text.slice(0, 16)
          canvas.add(textObj)
        } else if (el.type === 'rect') {
          const rectObj = new Rect({
            left: Number(el.left) || 50,
            top: Number(el.top) || 50,
            width: Number(el.width) || 200,
            height: Number(el.height) || 100,
            fill: el.fill || '#06B6D4',
            stroke: el.stroke,
            strokeWidth: el.strokeWidth ? Number(el.strokeWidth) : 0,
            rx: el.rx || 12,
            ry: el.rx || 12,
            opacity: el.opacity !== undefined ? Number(el.opacity) : 1,
          })
          ;(rectObj as any).corexLabel = 'AI Vector Card'
          canvas.add(rectObj)
        } else if (el.type === 'circle') {
          const circleObj = new Circle({
            left: Number(el.left) || 50,
            top: Number(el.top) || 50,
            radius: Number(el.radius) || 60,
            fill: el.fill || '#14B8A6',
            opacity: el.opacity !== undefined ? Number(el.opacity) : 1,
          })
          ;(circleObj as any).corexLabel = 'AI Vector Orb'
          canvas.add(circleObj)
        }
      })
      canvas.requestRenderAll()
      snapshot()
      bumpBgNonce()
      syncLayersFromCanvas()
      showToast('✨ Serverless AI Layout synthesized on Canvas!')
    } finally {
      setIsGeneratingDesign(false)
    }
  }

  // 3. Design Doctor / Canvas Vision Critique
  const handleCritiqueCanvas = async () => {
    if (!canvas || isAnalyzing) return
    setIsAnalyzing(true)
    setCritiqueResult(null)
    showToast('Capturing canvas screenshot for Gemini Vision...')

    try {
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 0.8,
        multiplier: 0.5,
      })

      const res = await fetch('/api/ai/critique-canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: dataUrl,
          prompt: 'Critique this graphic design in detail with score, pros, improvements, and palette recommendations',
        }),
      })

      const data = await res.json()

      if (res.ok && data.critique) {
        setCritiqueResult(data.critique)
        if (data.suggestedColors) setCritiqueColors(data.suggestedColors)
        showToast('✅ Design Doctor Analysis complete!')
      } else {
        throw new Error(data.error || 'Critique failed')
      }
    } catch {
      const localCritique = generateServerlessCritique(
        canvas.getObjects().length,
        canvasSize.width,
        canvasSize.height,
      )
      setCritiqueResult(localCritique.critique)
      setCritiqueColors(localCritique.suggestedColors)
      showToast('✅ Serverless Vision Diagnostic complete!')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 4. Create & Edit Images (gemini-3.1-flash-image-preview + Serverless Vector Synth)
  const handleGenerateImage = async (customPrompt?: string) => {
    const prompt = (customPrompt || imagePrompt).trim()
    if (!prompt || isGeneratingImage || !canvas) return

    setIsGeneratingImage(true)
    showToast('Generating visual artwork...')

    try {
      let sourceImageBase64: string | undefined
      if (useCanvasReference) {
        sourceImageBase64 = canvas.toDataURL({ format: 'png', quality: 0.8, multiplier: 0.5 })
      }

      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, sourceImageBase64 }),
      })

      const data = await res.json()
      if (res.ok && data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl)
        await addImageFromDataUrl(canvas, data.imageUrl)
        snapshot()
        syncLayersFromCanvas()
        showToast('✨ AI Image added to canvas!')
      } else {
        throw new Error(data.error || 'Image generation failed')
      }
    } catch {
      const dataUrl = generateServerlessSvgArtwork(prompt)
      setGeneratedImageUrl(dataUrl)
      await addImageFromDataUrl(canvas, dataUrl)
      snapshot()
      syncLayersFromCanvas()
      showToast('✨ Serverless Vector Artwork added to canvas!')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 470,
        maxHeight: '66vh',
        background: 'transparent',
      }}
    >
      {/* Segmented Mode Navigation Pills */}
      <div
        style={{
          display: 'flex',
          background: '#111522',
          padding: 6,
          margin: '12px 14px 6px',
          borderRadius: 16,
          gap: 6,
          flexShrink: 0,
        }}
      >
        {(
          [
            { id: 'bot', label: 'Corex Bot ⚡', icon: <Zap size={12} /> },
            { id: 'chat', label: 'Copilot', icon: <MessageSquare size={12} /> },
            { id: 'generate', label: 'Layout', icon: <Wand2 size={12} /> },
            { id: 'image', label: 'Image AI', icon: <ImageIcon size={12} /> },
            { id: 'critique', label: 'Doctor', icon: <ScanEye size={12} /> },
          ] as const
        ).map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                height: 34,
                borderRadius: 12,
                border: 'none',
                fontSize: 11,
                fontWeight: active ? 700 : 600,
                background: active
                  ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.22) 0%, rgba(20, 184, 166, 0.16) 100%)'
                  : 'transparent',
                color: active ? '#22D3EE' : '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Status Notification Toast */}
      {statusMessage && (
        <div
          style={{
            margin: '4px 14px',
            padding: '8px 12px',
            borderRadius: 12,
            background: 'rgba(6, 182, 212, 0.14)',
            fontSize: 11,
            color: '#22D3EE',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <CheckCircle2 size={13} color="#06B6D4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* TAB 0: Autonomous Corex Bot (Interactive To-Do Blueprint -> 60FPS Live Stage Painting) */}
      {activeTab === 'bot' && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 14px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Architecture Banner */}
          <div
            style={{
              padding: '12px 14px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.14) 0%, rgba(16, 185, 129, 0.08) 100%)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <Zap size={13} color="#22D3EE" />
                <span>Autonomous Corex Offline Bot (60FPS)</span>
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.45 }}>
                1. Enter brief ➔ 2. Review & customize To-Do checklist ➔ 3. Watch Corex Bot live-paint editable vector layers at 0% server cost.
              </div>
            </div>
            <span
              style={{
                padding: '3px 8px',
                borderRadius: 999,
                background: '#0C0E16',
                color: '#10B981',
                fontSize: 9.5,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              $0.00 LOCAL GPU
            </span>
          </div>

          {/* Prompt Input + 1-Tap Brief Presets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <textarea
              value={botPrompt}
              onChange={(e) => setBotPrompt(e.target.value)}
              placeholder='e.g. "Create a viral tech YT Thumbnail with a dark ink vibe"'
              className="input-base"
              style={{ width: '100%', height: 64, resize: 'none', fontSize: 12, padding: 10 }}
            />

            {/* Quick Brief Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                { label: 'YT Tech Thumbnail', prompt: 'Create a viral tech YT Thumbnail with a dark ink vibe' },
                { label: 'IG SaaS Launch', prompt: 'Instagram SaaS product launch post with glass dashboard mockup' },
                { label: 'VIP 60% Flash Sale', prompt: 'Black Friday luxury e-commerce 60% off flash sale drop' },
                { label: 'Spotify Tech Podcast', prompt: 'Spotify deep tech founder podcast cover with sonic wave' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setBotPrompt(preset.prompt)
                    const nextPlan = createAgenticBlueprintPlan(preset.prompt, canvasSize, autoResizeArtboard)
                    setBlueprintPlan(nextPlan)
                  }}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 10,
                    background: '#141826',
                    border: 'none',
                    color: '#CBD5E1',
                    fontSize: 10.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  fontSize: 11,
                  color: '#94A3B8',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={autoResizeArtboard}
                  onChange={(e) => setAutoResizeArtboard(e.target.checked)}
                  style={{ accentColor: '#06B6D4' }}
                />
                <span>Auto-match artboard dimensions (YouTube / IG / Poster)</span>
              </label>

              <button
                onClick={() => {
                  if (!botPrompt.trim()) return
                  const plan = createAgenticBlueprintPlan(botPrompt, canvasSize, autoResizeArtboard)
                  setBlueprintPlan(plan)
                  showToast(`Blueprint ready (~${(plan.estimatedPayloadBytes / 1024).toFixed(1)} KB JSON)`)
                }}
                className="btn-secondary btn-base"
                style={{
                  height: 34,
                  padding: '0 14px',
                  borderRadius: 12,
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: '#22D3EE',
                  background: '#141826',
                  gap: 6,
                }}
              >
                <Sparkles size={13} />
                <span>Plan To-Do Blueprint</span>
              </button>
            </div>
          </div>

          {/* Interactive 4-Step To-Do Checklist */}
          {activeBlueprintPlan && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                padding: 12,
                borderRadius: 16,
                background: '#0D101A',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#22D3EE', fontFamily: 'var(--font-mono)' }}>
                  TO-DO EXECUTION MATRIX • {activeBlueprintPlan.archetype.name.toUpperCase()}
                </span>
                <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                  ~{(activeBlueprintPlan.estimatedPayloadBytes / 1024).toFixed(1)} KB JSON
                </span>
              </div>

              {activeBlueprintPlan.todoSteps.map((step) => (
                <div
                  key={step.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: step.enabled ? '#141826' : 'rgba(20, 24, 38, 0.45)',
                    opacity: step.enabled ? 1 : 0.6,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <button
                      onClick={() => updateTodoStep(step.id, { enabled: !step.enabled })}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        color: '#F8FAFC',
                        textAlign: 'left',
                      }}
                    >
                      {step.enabled ? (
                        <CheckSquare size={15} color="#06B6D4" />
                      ) : (
                        <Square size={15} color="#64748B" />
                      )}
                      <div>
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: 'var(--font-mono)',
                            color: '#22D3EE',
                            fontWeight: 700,
                            marginRight: 6,
                          }}
                        >
                          {step.stepCode}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC' }}>
                          {step.title}
                        </span>
                      </div>
                    </button>

                    <span
                      style={{
                        fontSize: 9.5,
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 999,
                        background:
                          step.status === 'completed'
                            ? 'rgba(16, 185, 129, 0.18)'
                            : step.status === 'running'
                              ? 'rgba(6, 182, 212, 0.2)'
                              : '#0C0E16',
                        color:
                          step.status === 'completed'
                            ? '#10B981'
                            : step.status === 'running'
                              ? '#22D3EE'
                              : '#94A3B8',
                      }}
                    >
                      {step.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ fontSize: 11, color: '#94A3B8', paddingLeft: 23 }}>
                    {step.description}
                  </div>

                  {/* Step B Inline Color Swatches */}
                  {step.enabled && step.phase === 'geometry' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 23 }}>
                      <span style={{ fontSize: 10, color: '#64748B' }}>Accent:</span>
                      {['#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#3B82F6'].map((hex) => (
                        <button
                          key={hex}
                          onClick={() => updateTodoStep(step.id, { editablePrimaryColor: hex })}
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 6,
                            background: hex,
                            border:
                              step.editablePrimaryColor === hex
                                ? '2px solid #F8FAFC'
                                : '1px solid rgba(255,255,255,0.15)',
                            cursor: 'pointer',
                          }}
                          title={`Set geometry accent to ${hex}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Step C Inline Built-in Vault Asset Selector */}
                  {step.enabled && step.phase === 'assets' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 23 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {COREX_ASSET_VAULT.map((asset) => {
                          const selected = step.selectedVaultAssetId === asset.id
                          return (
                            <button
                              key={asset.id}
                              onClick={() =>
                                updateTodoStep(step.id, {
                                  selectedVaultAssetId: asset.id,
                                  title: `Stream Asset: ${asset.name}`,
                                })
                              }
                              style={{
                                padding: '4px 8px',
                                borderRadius: 8,
                                background: selected ? 'rgba(6, 182, 212, 0.22)' : '#0C0E16',
                                border: selected ? '1px solid #06B6D4' : '1px solid transparent',
                                color: selected ? '#22D3EE' : '#CBD5E1',
                                fontSize: 10,
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              {asset.name}
                            </button>
                          )
                        })}
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: '#94A3B8', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(step.useHybridPhoto)}
                          onChange={(e) => updateTodoStep(step.id, { useHybridPhoto: e.target.checked })}
                          style={{ accentColor: '#06B6D4' }}
                        />
                        <span>Use Hybrid High-Res Online Photo (falls back to 0ms local SVG offline)</span>
                      </label>
                    </div>
                  )}

                  {/* Step D Inline Editable Headline & Badge */}
                  {step.enabled && step.phase === 'typography' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, paddingLeft: 23 }}>
                      <input
                        value={step.editableHeadline || ''}
                        onChange={(e) => updateTodoStep(step.id, { editableHeadline: e.target.value })}
                        placeholder="Headline text..."
                        className="input-base"
                        style={{ height: 30, fontSize: 11, padding: '0 8px' }}
                      />
                      <input
                        value={step.editableBadge || ''}
                        onChange={(e) => updateTodoStep(step.id, { editableBadge: e.target.value })}
                        placeholder="Badge kicker..."
                        className="input-base"
                        style={{ height: 30, fontSize: 11, padding: '0 8px' }}
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Launch 60FPS Corex Bot CTA */}
              <button
                onClick={() => {
                  setActiveFloatingWindow(null)
                  setIsAiModeOpen(false)
                  runCorexBotSequence(activeBlueprintPlan, { clearExistingCanvas: true })
                }}
                disabled={isBotRunning}
                className="btn-primary btn-base"
                style={{
                  height: 42,
                  borderRadius: 14,
                  fontWeight: 800,
                  fontSize: 13,
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <Play size={14} />
                <span>Approve To-Do & Launch 60FPS Corex Bot</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: Chat Copilot */}
      {activeTab === 'chat' && (
        <>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '94%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-start',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      background: msg.role === 'user' ? '#181C2B' : 'rgba(6, 182, 212, 0.16)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {msg.role === 'user' ? (
                      <User size={12} color="#CBD5E1" />
                    ) : (
                      <Bot size={12} color="#22D3EE" />
                    )}
                  </div>

                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 16,
                      fontSize: 12,
                      lineHeight: 1.55,
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)'
                          : '#141826',
                      color: msg.role === 'user' ? '#07080D' : '#F1F5F9',
                      fontWeight: msg.role === 'user' ? 600 : 400,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}

                    {/* Extracted Colors Chips */}
                    {msg.suggestedColors && msg.suggestedColors.length > 0 && (
                      <div style={{ marginTop: 10, paddingTop: 8 }}>
                        <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Palette size={11} color="#22D3EE" />
                          <span>Detected Palette (Tap to apply background):</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {msg.suggestedColors.map((color, idx) => (
                            <button
                              key={idx}
                              onClick={() => applyColorToCanvas(color)}
                              title={`Set canvas background to ${color}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                                padding: '4px 8px',
                                background: '#0C0E16',
                                border: 'none',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontSize: 10,
                                fontFamily: 'var(--font-mono)',
                                color: '#E2E8F0',
                              }}
                            >
                              <span
                                style={{
                                  width: 11,
                                  height: 11,
                                  borderRadius: 4,
                                  background: color,
                                  display: 'inline-block',
                                }}
                              />
                              <span>{color}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 12px' }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 8,
                    background: 'rgba(6, 182, 212, 0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot size={11} color="#22D3EE" />
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span className="animate-bounce" style={{ width: 5, height: 5, borderRadius: '50%', background: '#06B6D4', animationDelay: '0ms' }} />
                  <span className="animate-bounce" style={{ width: 5, height: 5, borderRadius: '50%', background: '#14B8A6', animationDelay: '150ms' }} />
                  <span className="animate-bounce" style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Ideas */}
          <div
            style={{
              padding: '6px 14px',
              display: 'flex',
              gap: 6,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              flexShrink: 0,
            }}
          >
            {[
              '5 Aesthetic Dark Palettes',
              'Viral Tech Headline Copy',
              'YouTube Thumbnail Tips',
              'Best Font Combinations',
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(p)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 10,
                  background: '#141826',
                  border: 'none',
                  color: '#CBD5E1',
                  fontSize: 10.5,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div
            style={{
              padding: '10px 14px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask Corex AI for palettes, copy, or design tips..."
              className="input-base"
              style={{ flex: 1, fontSize: 12, height: 38 }}
              disabled={isTyping}
            />
            <button
              onClick={() => handleSendChat()}
              disabled={!input.trim() || isTyping}
              className="btn-primary btn-base"
              style={{
                height: 38,
                width: 38,
                borderRadius: 12,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: input.trim() ? 1 : 0.4,
              }}
              aria-label="Send"
            >
              <Send size={14} />
            </button>
          </div>
        </>
      )}

      {/* TAB 2: Text-to-Design (Auto Generator) */}
      {activeTab === 'generate' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: 14, background: '#141826', borderRadius: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Wand2 size={14} color="#22D3EE" />
              <span>Autonomous AI Layout Engine</span>
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.5 }}>
              Describe your vision and Corex AI will synthesize coordinated vector shapes, cards, badges, and typography directly on your stage.
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: '#CBD5E1', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Design Brief / Prompt
            </label>
            <textarea
              value={designPrompt}
              onChange={(e) => setDesignPrompt(e.target.value)}
              placeholder="e.g. Modern SaaS launch banner with deep ink background, bold cyan heading, feature card, and 50% discount badge"
              className="input-base"
              style={{ width: '100%', height: 82, resize: 'none', fontSize: 12, padding: 10 }}
            />
          </div>

          <button
            onClick={() => handleGenerateDesign()}
            disabled={!designPrompt.trim() || isGeneratingDesign}
            className="btn-primary btn-base"
            style={{ height: 40, borderRadius: 14, gap: 7, fontWeight: 700, fontSize: 12.5 }}
          >
            <Sparkles size={14} />
            <span>{isGeneratingDesign ? 'Synthesizing Vector Layout...' : 'Synthesize Layout on Stage'}</span>
          </button>

          {/* Prompt Templates */}
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              1-Tap Brief Presets
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Tech Podcast cover with electric cyan glow and bold title',
                'Minimalist Coffee shop promo with warm cream & amber theme',
                'Black Friday Mega Sale with high-contrast red & gold badges',
                'Modern Portfolio header for a UI/UX product designer',
              ].map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDesignPrompt(tmpl)
                    handleGenerateDesign(tmpl)
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: '#141826',
                    border: 'none',
                    color: '#E2E8F0',
                    fontSize: 11,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{tmpl}</span>
                  <ArrowRight size={13} color="#22D3EE" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Create & Edit Images (gemini-3.1-flash-image-preview) */}
      {activeTab === 'image' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: 14, background: '#141826', borderRadius: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ImageIcon size={14} color="#2DD4BF" />
              <span>Create & Edit Artwork</span>
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.5 }}>
              Powered by <code>gemini-3.1-flash-image-preview</code> + Client-Side Vector Synth fallback.
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: '#CBD5E1', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Artwork Prompt
            </label>
            <textarea
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="e.g. Futuristic 3D glass sphere with electric cyan and emerald reflections on deep ink backdrop"
              className="input-base"
              style={{ width: '100%', height: 78, resize: 'none', fontSize: 12, padding: 10 }}
            />
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11.5,
              color: '#CBD5E1',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: 12,
              background: '#141826',
            }}
          >
            <input
              type="checkbox"
              checked={useCanvasReference}
              onChange={(e) => setUseCanvasReference(e.target.checked)}
              style={{ accentColor: '#06B6D4' }}
            />
            <span>Use active stage as reference image to edit</span>
          </label>

          <button
            onClick={() => handleGenerateImage()}
            disabled={!imagePrompt.trim() || isGeneratingImage}
            className="btn-primary btn-base"
            style={{ height: 40, borderRadius: 14, gap: 7, fontWeight: 700, fontSize: 12.5 }}
          >
            <Sparkles size={14} />
            <span>{isGeneratingImage ? 'Synthesizing Artwork...' : 'Generate & Drop on Stage'}</span>
          </button>

          {generatedImageUrl && (
            <div style={{ padding: 10, borderRadius: 14, background: '#141826' }}>
              <div style={{ fontSize: 10.5, color: '#94A3B8', marginBottom: 6 }}>Latest Generated Asset:</div>
              <img
                src={generatedImageUrl}
                alt="AI Generated"
                referrerPolicy="no-referrer"
                style={{ width: '100%', borderRadius: 10, display: 'block' }}
              />
            </div>
          )}

          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Quick Artwork Prompts
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                '3D Holographic Abstract Crystal Icon',
                'Cyberpunk Neon Grid Horizon Illustration',
                'Minimalist Geometric Luxury Brand Emblem',
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setImagePrompt(preset)
                    handleGenerateImage(preset)
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: '#141826',
                    border: 'none',
                    color: '#E2E8F0',
                    fontSize: 11,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{preset}</span>
                  <ArrowRight size={13} color="#22D3EE" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Design Doctor (Vision Critique) */}
      {activeTab === 'critique' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: 14, background: '#141826', borderRadius: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ScanEye size={14} color="#10B981" />
              <span>Multimodal Vision Design Doctor</span>
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.5 }}>
              Scans your active stage composition and evaluates contrast ratios, alignment balance, typography hierarchy, and palette harmony.
            </div>
          </div>

          <button
            onClick={handleCritiqueCanvas}
            disabled={isAnalyzing}
            className="btn-primary btn-base"
            style={{
              height: 40,
              borderRadius: 14,
              gap: 7,
              fontWeight: 700,
              fontSize: 12.5,
            }}
          >
            <ScanEye size={14} />
            <span>{isAnalyzing ? 'Scanning Stage Composition...' : 'Run Vision Diagnostic'}</span>
          </button>

          {critiqueResult && (
            <div
              style={{
                padding: 14,
                borderRadius: 16,
                background: '#141826',
                fontSize: 11.5,
                lineHeight: 1.6,
                color: '#F1F5F9',
                whiteSpace: 'pre-wrap',
              }}
            >
              {critiqueResult}

              {critiqueColors.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 10 }}>
                  <div style={{ fontSize: 10.5, color: '#94A3B8', marginBottom: 6 }}>
                    Recommended Palette Upgrades:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {critiqueColors.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyColorToCanvas(c)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '4px 8px',
                          background: '#0C0E16',
                          border: 'none',
                          borderRadius: 8,
                          fontSize: 10,
                          fontFamily: 'var(--font-mono)',
                          cursor: 'pointer',
                          color: '#E2E8F0',
                        }}
                      >
                        <span style={{ width: 11, height: 11, borderRadius: 4, background: c }} />
                        <span>{c}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

