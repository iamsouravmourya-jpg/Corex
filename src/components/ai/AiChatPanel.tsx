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
} from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { useFabricCanvas } from '@/hooks/useFabricCanvas'
import { addIText, addRect, addCircle, addTriangle } from '@/lib/shapes'
import { Rect, Circle, Triangle, IText } from 'fabric'

interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
  suggestedColors?: string[]
  suggestedText?: string[]
  timestamp: string
}

type AiTab = 'chat' | 'generate' | 'critique'

export function AiChatPanel() {
  const { setIsAiModeOpen, canvasSize, snapshot, bumpBgNonce, syncLayersFromCanvas } = useEditorStore()
  const canvas = useFabricCanvas()

  const [activeTab, setActiveTab] = useState<AiTab>('chat')
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [designPrompt, setDesignPrompt] = useState('')
  const [isGeneratingDesign, setIsGeneratingDesign] = useState(false)
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
      suggestedColors: ['#0F172A', '#F43F5E', '#8B5CF6', '#38BDF8', '#10B981', '#F59E0B'],
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
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Note: ${err.message || 'Gemini response could not be loaded'}. Tip: You can configure \`GEMINI_API_KEY\` in your environment variables to enable live AI capabilities.`,
          timestamp: 'Now',
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
              ;(textObj as any).craftName = el.text.slice(0, 16)
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
              ;(rectObj as any).craftName = 'AI Shape'
              canvas.add(rectObj)
            } else if (el.type === 'circle') {
              const circleObj = new Circle({
                left: Number(el.left) || 50,
                top: Number(el.top) || 50,
                radius: Number(el.radius) || 60,
                fill: el.fill || '#8B5CF6',
                opacity: el.opacity !== undefined ? Number(el.opacity) : 1,
              })
              ;(circleObj as any).craftName = 'AI Circle'
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
    } catch (err: any) {
      showToast(`Generation error: ${err.message || 'Check API key'}`)
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
    } catch (err: any) {
      setCritiqueResult(`Unable to critique canvas: ${err.message || 'Check GEMINI_API_KEY'}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        background: 'var(--color-base-900)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        borderLeft: '1px solid var(--color-base-600)',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 48,
          borderBottom: '1px solid var(--color-base-600)',
          background: 'var(--color-base-875)',
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #F43F5E 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(244,63,94,0.3)',
            }}
          >
            <Sparkles size={14} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-base-100)', lineHeight: 1.2 }}>
              Corex AI Studio
            </div>
            <div style={{ fontSize: 9.5, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              Gemini 3.8 Flash Connected
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsAiModeOpen(false)}
          className="btn-ghost btn-icon"
          style={{ width: 28, height: 28, color: 'var(--color-base-400)', cursor: 'pointer' }}
          aria-label="Close AI Studio"
          title="Close AI Studio"
        >
          <X size={15} />
        </button>
      </div>

      {/* Sub Header Mode Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--color-base-600)',
          background: 'var(--color-base-850)',
          padding: '2px 6px',
          gap: 4,
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setActiveTab('chat')}
          style={{
            flex: 1,
            height: 28,
            borderRadius: 5,
            border: 'none',
            fontSize: 10.5,
            fontWeight: activeTab === 'chat' ? 600 : 400,
            background: activeTab === 'chat' ? 'var(--color-base-750)' : 'transparent',
            color: activeTab === 'chat' ? 'var(--color-accent-300)' : 'var(--color-base-400)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <MessageSquare size={12} />
          <span>Chat Copilot</span>
        </button>

        <button
          onClick={() => setActiveTab('generate')}
          style={{
            flex: 1,
            height: 28,
            borderRadius: 5,
            border: 'none',
            fontSize: 10.5,
            fontWeight: activeTab === 'generate' ? 600 : 400,
            background: activeTab === 'generate' ? 'var(--color-base-750)' : 'transparent',
            color: activeTab === 'generate' ? 'var(--color-accent-300)' : 'var(--color-base-400)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <Wand2 size={12} />
          <span>Text-to-Design</span>
        </button>

        <button
          onClick={() => setActiveTab('critique')}
          style={{
            flex: 1,
            height: 28,
            borderRadius: 5,
            border: 'none',
            fontSize: 10.5,
            fontWeight: activeTab === 'critique' ? 600 : 400,
            background: activeTab === 'critique' ? 'var(--color-base-750)' : 'transparent',
            color: activeTab === 'critique' ? 'var(--color-accent-300)' : 'var(--color-base-400)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <ScanEye size={12} />
          <span>Design Doctor</span>
        </button>
      </div>

      {/* Status Notification Toast */}
      {statusMessage && (
        <div
          style={{
            padding: '5px 10px',
            background: 'rgba(244,63,94,0.15)',
            borderBottom: '1px solid rgba(244,63,94,0.3)',
            fontSize: 10,
            color: '#FDA4AF',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <CheckCircle2 size={12} color="#F43F5E" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* TAB 1: Chat Copilot */}
      {activeTab === 'chat' && (
        <>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '96%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                    alignItems: 'flex-start',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: msg.role === 'user' ? 'var(--color-base-700)' : 'rgba(244,63,94,0.15)',
                      border: msg.role === 'user' ? '1px solid var(--color-base-600)' : '1px solid rgba(244,63,94,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {msg.role === 'user' ? (
                      <User size={11} color="var(--color-base-200)" />
                    ) : (
                      <Bot size={11} color="#F43F5E" />
                    )}
                  </div>

                  <div
                    style={{
                      padding: '8px 11px',
                      borderRadius: 8,
                      fontSize: 11.5,
                      lineHeight: 1.5,
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg, #BE123C 0%, #F43F5E 100%)'
                          : 'var(--color-base-800)',
                      border:
                        msg.role === 'user'
                          ? '1px solid rgba(255,255,255,0.15)'
                          : '1px solid var(--color-base-600)',
                      color: msg.role === 'user' ? '#FFFFFF' : 'var(--color-base-100)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}

                    {/* Extracted Colors Chips */}
                    {msg.suggestedColors && msg.suggestedColors.length > 0 && (
                      <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid var(--color-base-700)' }}>
                        <div style={{ fontSize: 9.5, color: 'var(--color-base-400)', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Palette size={10} />
                          <span>Detected Palette (Click to set BG):</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {msg.suggestedColors.map((color, idx) => (
                            <button
                              key={idx}
                              onClick={() => applyColorToCanvas(color)}
                              title={`Set canvas background to ${color}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '2px 5px',
                                background: 'var(--color-base-750)',
                                border: '1px solid var(--color-base-600)',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontSize: 9.5,
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--color-base-200)',
                              }}
                            >
                              <span
                                style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: 2,
                                  background: color,
                                  border: '1px solid rgba(255,255,255,0.2)',
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
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '6px 10px' }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    background: 'rgba(244,63,94,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot size={10} color="#F43F5E" />
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span className="animate-bounce" style={{ width: 4, height: 4, borderRadius: '50%', background: '#F43F5E', animationDelay: '0ms' }} />
                  <span className="animate-bounce" style={{ width: 4, height: 4, borderRadius: '50%', background: '#F43F5E', animationDelay: '150ms' }} />
                  <span className="animate-bounce" style={{ width: 4, height: 4, borderRadius: '50%', background: '#F43F5E', animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Ideas */}
          <div
            style={{
              padding: '6px 8px',
              borderTop: '1px solid var(--color-base-700)',
              background: 'var(--color-base-875)',
              display: 'flex',
              gap: 5,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              flexShrink: 0,
            }}
          >
            {[
              '🎨 5 Aesthetic Dark Palettes',
              '🔥 Viral Tech Headline Copy',
              '💡 YouTube Thumbnail Tips',
              '🪄 Best Font Combinations',
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(p)}
                style={{
                  padding: '3px 7px',
                  borderRadius: 4,
                  background: 'var(--color-base-800)',
                  border: '1px solid var(--color-base-600)',
                  color: 'var(--color-base-300)',
                  fontSize: 9.5,
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
              padding: '8px',
              borderTop: '1px solid var(--color-base-600)',
              background: 'var(--color-base-875)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask Gemini design questions or copy..."
              className="input-base"
              style={{ flex: 1, fontSize: 11, height: 32 }}
              disabled={isTyping}
            />
            <button
              onClick={() => handleSendChat()}
              disabled={!input.trim() || isTyping}
              className="btn-primary btn-base"
              style={{
                height: 32,
                width: 32,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: input.trim() ? 1 : 0.4,
              }}
              aria-label="Send"
            >
              <Send size={13} />
            </button>
          </div>
        </>
      )}

      {/* TAB 2: Text-to-Design (Auto Generator) */}
      {activeTab === 'generate' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: '10px', background: 'var(--color-base-800)', borderRadius: 8, border: '1px solid var(--color-base-600)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--color-base-100)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Wand2 size={13} color="#F43F5E" />
              <span>Autonomous AI Layout Engine</span>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--color-base-400)', lineHeight: 1.4 }}>
              Describe your vision and Gemini will generate and place coordinated shapes, cards, badges, and typography on your canvas.
            </div>
          </div>

          <div>
            <label style={{ fontSize: 10.5, color: 'var(--color-base-300)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Design Brief / Prompt
            </label>
            <textarea
              value={designPrompt}
              onChange={(e) => setDesignPrompt(e.target.value)}
              placeholder="e.g. Modern SaaS launch banner with dark navy background, bold cyan heading, feature card, and 50% discount badge"
              className="input-base"
              style={{ width: '100%', height: 75, resize: 'none', fontSize: 11, padding: '8px' }}
            />
          </div>

          <button
            onClick={() => handleGenerateDesign()}
            disabled={!designPrompt.trim() || isGeneratingDesign}
            className="btn-primary btn-base"
            style={{ height: 34, gap: 6, fontWeight: 600, fontSize: 11.5 }}
          >
            <Sparkles size={14} />
            <span>{isGeneratingDesign ? 'Generating Design Elements...' : 'Generate On Canvas'}</span>
          </button>

          {/* Prompt Templates */}
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-base-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Quick Templates
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Tech Podcast cover with neon purple glow and bold title',
                'Minimalist Coffee shop promo with warm cream & amber theme',
                'Black Friday Mega Sale with high-contrast red & yellow badges',
                'Modern Portfolio header for a UI/UX product designer',
              ].map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDesignPrompt(tmpl)
                    handleGenerateDesign(tmpl)
                  }}
                  style={{
                    padding: '8px',
                    borderRadius: 6,
                    background: 'var(--color-base-800)',
                    border: '1px solid var(--color-base-600)',
                    color: 'var(--color-base-200)',
                    fontSize: 10.5,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{tmpl}</span>
                  <ArrowRight size={12} color="var(--color-base-400)" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Design Doctor (Vision Critique) */}
      {activeTab === 'critique' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: '10px', background: 'var(--color-base-800)', borderRadius: 8, border: '1px solid var(--color-base-600)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--color-base-100)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ScanEye size={13} color="#8B5CF6" />
              <span>Multimodal Vision Critique</span>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--color-base-400)', lineHeight: 1.4 }}>
              Gemini Vision scans your active canvas and evaluates color contrast, alignment, typography hierarchy, and visual balance.
            </div>
          </div>

          <button
            onClick={handleCritiqueCanvas}
            disabled={isAnalyzing}
            className="btn-primary btn-base"
            style={{
              height: 34,
              gap: 6,
              fontWeight: 600,
              fontSize: 11.5,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
            }}
          >
            <ScanEye size={14} />
            <span>{isAnalyzing ? 'Analyzing Canvas Composition...' : 'Analyze Current Canvas'}</span>
          </button>

          {critiqueResult && (
            <div
              style={{
                padding: '10px',
                borderRadius: 8,
                background: 'var(--color-base-800)',
                border: '1px solid var(--color-base-600)',
                fontSize: 11,
                lineHeight: 1.55,
                color: 'var(--color-base-100)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {critiqueResult}

              {critiqueColors.length > 0 && (
                <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--color-base-700)' }}>
                  <div style={{ fontSize: 10, color: 'var(--color-base-400)', marginBottom: 5 }}>
                    Recommended Enhancements:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {critiqueColors.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyColorToCanvas(c)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '2px 6px',
                          background: 'var(--color-base-750)',
                          border: '1px solid var(--color-base-600)',
                          borderRadius: 4,
                          fontSize: 9.5,
                          cursor: 'pointer',
                          color: 'var(--color-base-200)',
                        }}
                      >
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
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
