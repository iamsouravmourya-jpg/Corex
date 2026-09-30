import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Wand2,
  ScanEye,
  Layers,
  Download,
  Zap,
  ArrowRight,
  Check,
  Image as ImageIcon,
  Sliders,
  Command,
  Shield,
  Play,
} from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { AuthModal } from '@/components/auth/AuthModal'

function GoogleIconSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function LandingPage() {
  const { setUser } = useEditorStore()
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'signin' | 'signup' | 'google' }>({
    open: false,
    mode: 'signup',
  })
  const [previewAccent, setPreviewAccent] = useState('#F43F5E')

  const handleInstantDemo = () => {
    setUser({
      name: 'Sourav Maurya',
      email: 'iamsouravmaurya@gmail.com',
      plan: 'Corex Pro · LernexAI',
      provider: 'demo',
    })
  }

  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollBehavior: 'smooth',
        background: '#09090B',
        color: '#F8FAFC',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
      }}
    >
      {/* Subtle Ambient Background Mesh */}
      <div
        style={{
          position: 'fixed',
          top: -180,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 960,
          height: 460,
          background: 'radial-gradient(ellipse at center, rgba(244, 63, 94, 0.14) 0%, rgba(139, 92, 246, 0.08) 45%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Sticky Navigation Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 64,
          background: 'rgba(9, 9, 11, 0.82)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #1E1E2A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
            <defs>
              <linearGradient id="navLogoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F43F5E" />
                <stop offset="100%" stopColor="#BE123C" />
              </linearGradient>
            </defs>
            <circle cx="14" cy="14" r="13" fill="url(#navLogoGrad)" />
            <path
              d="M20 9C18.3 7.75 16.24 7 14 7C9.03 7 5 10.69 5 15C5 19.31 9.03 23 14 23C16.24 23 18.3 22.25 20 21"
              stroke="white"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '-0.04em' }}>
              <span style={{ color: '#F8FAFC' }}>Core</span>
              <span style={{ color: '#F43F5E' }}>x</span>
            </span>
            <span style={{ fontSize: 11, color: '#64748B', fontFamily: "'JetBrains Mono', monospace" }}>
              by LernexAI
            </span>
          </div>
        </div>

        {/* Clean Unboxed Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="#features" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none', fontWeight: 500 }}>
            Architecture
          </a>
          <a href="#ai-engine" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none', fontWeight: 500 }}>
            Gemini AI Suite
          </a>
          <a href="#workflow" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none', fontWeight: 500 }}>
            Workflow
          </a>
        </nav>

        {/* Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setAuthModal({ open: true, mode: 'signin' })}
            style={{
              height: 36,
              padding: '0 14px',
              background: 'transparent',
              border: '1px solid #262636',
              borderRadius: 8,
              color: '#E2E8F0',
              fontSize: 12.5,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthModal({ open: true, mode: 'google' })}
            style={{
              height: 36,
              padding: '0 14px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              color: '#0F172A',
              fontSize: 12.5,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              cursor: 'pointer',
            }}
          >
            <GoogleIconSmall />
            <span>Google Sign In</span>
          </button>
          <button
            onClick={() => setAuthModal({ open: true, mode: 'signup' })}
            style={{
              height: 36,
              padding: '0 16px',
              background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8,
              color: '#FFFFFF',
              fontSize: 12.5,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(244, 63, 94, 0.35)',
            }}
          >
            <span>Sign Up Free</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1200,
          margin: '0 auto',
          padding: '72px 24px 64px',
          textAlign: 'center',
        }}
      >
        {/* Clean Unboxed Typographic Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            fontSize: 11.5,
            fontFamily: "'JetBrains Mono', monospace",
            color: '#F43F5E',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 18,
          }}
        >
          COREX STUDIO 2.0 &nbsp;·&nbsp; LERNEXAI PROPRIETARY ENGINE &nbsp;·&nbsp; GEMINI 3.8 FLASH VISION
        </motion.div>

        {/* Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 'clamp(2.5rem, 5vw + 1rem, 4.4rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.06,
            maxWidth: 920,
            margin: '0 auto 22px',
            color: '#F8FAFC',
          }}
        >
          Autonomous Vector & AI Design Studio{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #F43F5E 0%, #FB7185 45%, #A78BFA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Built for Speed.
          </span>
        </motion.h1>

        {/* Lead Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            fontSize: 17,
            color: '#94A3B8',
            lineHeight: 1.65,
            maxWidth: 680,
            margin: '0 auto 34px',
          }}
        >
          Experience a sub-millisecond 60FPS vector canvas fused with autonomous Text-to-Canvas layout generation, AI image creation & editing, and lossless 3x multi-format exports.
        </motion.p>

        {/* Primary CTA Cluster */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 18,
          }}
        >
          <button
            onClick={() => setAuthModal({ open: true, mode: 'google' })}
            style={{
              height: 46,
              padding: '0 22px',
              borderRadius: 10,
              background: '#FFFFFF',
              color: '#09090B',
              border: '1px solid #E2E8F0',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            }}
          >
            <GoogleIconSmall />
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => setAuthModal({ open: true, mode: 'signup' })}
            style={{
              height: 46,
              padding: '0 24px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.18)',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 8px 28px rgba(244, 63, 94, 0.4)',
            }}
          >
            <span>Sign Up & Open Dashboard</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={handleInstantDemo}
            style={{
              height: 46,
              padding: '0 18px',
              borderRadius: 10,
              background: '#14141D',
              color: '#E2E8F0',
              border: '1px solid #2A2A3C',
              fontSize: 13.5,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              cursor: 'pointer',
            }}
          >
            <Play size={13} fill="#F43F5E" color="#F43F5E" />
            <span>Instant Demo Login</span>
          </button>
        </motion.div>

        {/* Sub-CTA Metadata Line */}
        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 48 }}>
          Instant browser workspace &nbsp;·&nbsp; No credit card required &nbsp;·&nbsp; Local IndexedDB + Gemini Cloud AI
        </div>

        {/* INTERACTIVE LIVE STUDIO WORKSPACE PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: '#111116',
            border: '1px solid #262636',
            borderRadius: 16,
            boxShadow: '0 32px 80px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(244, 63, 94, 0.1)',
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          {/* Preview Window Top Bar */}
          <div
            style={{
              height: 42,
              background: '#16161F',
              borderBottom: '1px solid #242432',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F43F5E' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
              <span style={{ marginLeft: 10, fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", color: '#94A3B8' }}>
                Corex Studio — Launch_Campaign_2026.corex (1080×1080)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: '#64748B' }}>Interactive Theme Preview:</span>
              {['#F43F5E', '#8B5CF6', '#38BDF8', '#10B981', '#F59E0B'].map((col) => (
                <button
                  key={col}
                  onClick={() => setPreviewAccent(col)}
                  aria-label={`Preview accent ${col}`}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background: col,
                    border: previewAccent === col ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                  }}
                />
              ))}
              <button
                onClick={handleInstantDemo}
                style={{
                  marginLeft: 8,
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: '#F43F5E',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Open in Full Editor →
              </button>
            </div>
          </div>

          {/* Simulated 3-Column Studio Interface */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', minHeight: 410 }}>
            {/* Left Layers & Tools Column */}
            <div style={{ background: '#13131B', borderRight: '1px solid #222230', padding: 16 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                Active Scene Layers (5)
              </div>
              {[
                { name: 'CTA Button Group', type: 'Vector Rect' },
                { name: 'Hero Display Title', type: 'Sora 800' },
                { name: 'AI Generated 3D Asset', type: 'Gemini Image' },
                { name: 'Accent Glow Sphere', type: 'Radial Shader' },
                { name: 'Obsidian Artboard', type: '1080 × 1080' },
              ].map((layer, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    background: idx === 1 ? '#1E1E2C' : 'transparent',
                    borderLeft: idx === 1 ? `2px solid ${previewAccent}` : '2px solid transparent',
                    marginBottom: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: 12, color: idx === 1 ? '#F8FAFC' : '#94A3B8', fontWeight: idx === 1 ? 600 : 400 }}>
                    {layer.name}
                  </span>
                  <span style={{ fontSize: 10, color: '#64748B', fontFamily: "'JetBrains Mono', monospace" }}>
                    {layer.type}
                  </span>
                </div>
              ))}
            </div>

            {/* Center Artboard Canvas */}
            <div
              onClick={handleInstantDemo}
              title="Click to open interactive editor"
              style={{
                background: '#0C0C11',
                backgroundImage: 'radial-gradient(#222230 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 32,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: 460,
                  padding: '36px 32px',
                  borderRadius: 14,
                  background: '#09090B',
                  border: `2px solid ${previewAccent}`,
                  boxShadow: `0 20px 60px rgba(0,0,0,0.65), 0 0 40px ${previewAccent}22`,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: previewAccent,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    marginBottom: 10,
                  }}
                >
                  LERNEXAI CREATIVE ENGINE
                </div>
                <div
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 28,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: 1.15,
                    marginBottom: 10,
                  }}
                >
                  CRAFT WITHOUT LIMITS.
                </div>
                <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 22 }}>
                  Click anywhere on this artboard to launch the live 60FPS Studio Dashboard.
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 18px',
                    borderRadius: 7,
                    background: previewAccent,
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <span>LAUNCH EDITOR NOW</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>

            {/* Right AI Copilot Inspector */}
            <div style={{ background: '#13131B', borderLeft: '1px solid #222230', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#F8FAFC', marginBottom: 10 }}>
                  <Sparkles size={13} color={previewAccent} />
                  <span>Corex AI Studio</span>
                </div>
                <div style={{ padding: 10, borderRadius: 8, background: '#1A1A26', border: '1px solid #2A2A3C', fontSize: 11.5, color: '#CBD5E1', lineHeight: 1.5, marginBottom: 12 }}>
                  "Generate a high-contrast SaaS launch poster with neon accents and bold Sora typography."
                </div>
                <div style={{ fontSize: 11, color: '#10B981', marginBottom: 8 }}>
                  ✓ 5 vector layers generated
                </div>
                <div style={{ fontSize: 11, color: '#10B981', marginBottom: 8 }}>
                  ✓ Contrast ratio: 14.2:1 (AAA)
                </div>
                <div style={{ fontSize: 11, color: '#10B981' }}>
                  ✓ Gemini Image Gen ready
                </div>
              </div>

              <button
                onClick={() => setAuthModal({ open: true, mode: 'google' })}
                style={{
                  width: '100%',
                  height: 36,
                  borderRadius: 8,
                  background: '#1E1E2C',
                  border: '1px solid #323248',
                  color: '#F8FAFC',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Try AI Mode in Dashboard →
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ARCHITECTURAL FEATURE BENTO GRID */}
      <section
        id="features"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '64px 24px',
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", color: '#F43F5E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            PROPRIETARY ARCHITECTURE
          </div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', color: '#F8FAFC' }}>
            Engineered for Professional Creative Teams
          </h2>
        </div>

        <div
          id="ai-engine"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 20,
          }}
        >
          {[
            {
              icon: <Wand2 size={20} color="#F43F5E" />,
              kicker: 'TEXT-TO-CANVAS ENGINE',
              title: 'Autonomous AI Layout Generator',
              desc: 'Describe any poster, social banner, or YouTube thumbnail in natural language. Corex synthesizes editable Fabric.js vector shapes, cards, and typography hierarchies directly on your canvas.',
            },
            {
              icon: <ImageIcon size={20} color="#8B5CF6" />,
              kicker: 'GEMINI 3.1 FLASH IMAGE',
              title: 'AI Image Creation & Editing',
              desc: 'Create bespoke illustrations, 3D icons, and product visuals from text prompts or edit existing canvas images using our integrated Gemini image generation pipeline.',
            },
            {
              icon: <ScanEye size={20} color="#38BDF8" />,
              kicker: 'MULTIMODAL VISION',
              title: 'Design Doctor Live Critique',
              desc: 'One-click canvas snapshot inspection evaluates contrast ratios, visual hierarchy, alignment balance, and recommends instant 1-click color palette upgrades.',
            },
            {
              icon: <Sliders size={20} color="#10B981" />,
              kicker: '60FPS GPU COMPOSITOR',
              title: 'Vector Precision & Live Shaders',
              desc: 'Full affine transformations, smart edge/center snapping guides, 16 composite blend modes, linear/radial gradient builders, and live brightness/contrast/blur filters.',
            },
            {
              icon: <Download size={20} color="#F59E0B" />,
              kicker: 'MULTI-FORMAT COMPILER',
              title: 'Lossless 3x Studio Exports',
              desc: 'Export supersampled 1x/2x/3x PNG & JPEG, transparent alpha cutouts, scalable vector SVG, print-ready 96DPI PDF documents, and native editable PowerPoint PPTX decks.',
            },
            {
              icon: <Shield size={20} color="#EC4899" />,
              kicker: 'ZERO-LATENCY VAULT',
              title: 'Local IndexedDB + 50-Step History',
              desc: 'Every project saves instantaneously to your browser IndexedDB with live visual thumbnails, drag-to-reorder layer trees, and a 50-step delta undo/redo stack.',
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              style={{
                padding: 28,
                borderRadius: 14,
                background: '#111116',
                border: '1px solid #222230',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#181822',
                  border: '1px solid #2A2A3C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {feat.icon}
              </div>
              <div style={{ fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", color: '#64748B', letterSpacing: '0.06em' }}>
                {feat.kicker}
              </div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: 13.5, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON & KEYBOARD ERGONOMICS SECTION */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '24px 24px 56px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: 24,
        }}
      >
        {/* Left: Corex Studio vs Legacy Cloud Tools */}
        <div
          style={{
            padding: 28,
            borderRadius: 16,
            background: '#111116',
            border: '1px solid #222230',
          }}
        >
          <div style={{ fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", color: '#F43F5E', letterSpacing: '0.08em', marginBottom: 8 }}>
            PERFORMANCE BENCHMARK
          </div>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 18 }}>
            Why Creators Switch to Corex Studio
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { metric: 'Canvas Frame Rate', corex: '60FPS GPU Native', legacy: '24-30FPS DOM Lag' },
              { metric: 'AI Layout & Image Gen', corex: 'Built-in Gemini 3.8 + 3.1', legacy: 'Paid Tier Add-on' },
              { metric: 'Multi-Format Exports', corex: 'PNG, JPG, SVG, PDF, PPTX (3x)', legacy: 'Watermarked / Paywalled' },
              { metric: 'Data Privacy Vault', corex: '100% Local IndexedDB', legacy: 'Forced Cloud Upload' },
              { metric: 'Startup Latency', corex: '< 120ms Instant Load', legacy: '4-6s Heavy Bundle' },
            ].map((row, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1.1fr 1fr',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: '#16161F',
                  border: '1px solid #222230',
                  fontSize: 12,
                }}
              >
                <span style={{ color: '#CBD5E1', fontWeight: 500 }}>{row.metric}</span>
                <span style={{ color: '#10B981', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                  ✓ {row.corex}
                </span>
                <span style={{ color: '#64748B', fontSize: 11 }}>{row.legacy}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Power-User Keyboard Matrix */}
        <div
          style={{
            padding: 28,
            borderRadius: 16,
            background: '#111116',
            border: '1px solid #222230',
          }}
        >
          <div style={{ fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", color: '#8B5CF6', letterSpacing: '0.08em', marginBottom: 8 }}>
            FIGMA-GRADE ERGONOMICS
          </div>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 18 }}>
            Zero-Friction Keyboard Command Matrix
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { key: 'V / R / C / T', action: 'Select, Rect, Circle, Text' },
              { key: '⌘ + D', action: 'Instant Duplicate Layer' },
              { key: '⌘ + Z / ⌘ + ⇧ + Z', action: '50-Step Undo & Redo' },
              { key: '⌘ + Alt + C / V', action: 'Copy & Paste Object Style' },
              { key: '⌘ + ] / [', action: 'Z-Order Forward / Backward' },
              { key: "⌘ + '", action: 'Toggle Precision Grid' },
              { key: 'Shift + Arrows', action: '10px Precision Nudge' },
              { key: 'Space + Drag', action: 'Infinite Canvas Pan' },
            ].map((sc, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: '#16161F',
                  border: '1px solid #222230',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#F43F5E', fontWeight: 600 }}>
                  {sc.key}
                </span>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>{sc.action}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW & SHORTCUTS SECTION */}
      <section
        id="workflow"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '32px 24px 80px',
        }}
      >
        <div
          style={{
            padding: '44px 40px',
            borderRadius: 18,
            background: 'linear-gradient(135deg, #13131C 0%, #0E0E14 100%)',
            border: '1px solid #262636',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 32,
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#F43F5E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              READY TO CREATE?
            </div>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: '#F8FAFC', marginBottom: 12 }}>
              Sign in with Google Demo Auth & Enter the Corex Dashboard
            </h2>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
              Experience the complete LernexAI design workspace immediately. Test Google OAuth demo login, create multi-layer designs, generate AI images, and export in 5 studio formats.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button
              onClick={() => setAuthModal({ open: true, mode: 'google' })}
              style={{
                height: 44,
                padding: '0 20px',
                borderRadius: 10,
                background: '#FFFFFF',
                color: '#09090B',
                border: 'none',
                fontSize: 13.5,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                cursor: 'pointer',
              }}
            >
              <GoogleIconSmall />
              <span>Continue with Google</span>
            </button>
            <button
              onClick={() => setAuthModal({ open: true, mode: 'signup' })}
              style={{
                height: 44,
                padding: '0 22px',
                borderRadius: 10,
                background: '#F43F5E',
                color: '#FFFFFF',
                border: 'none',
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Create Free Account →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: '1px solid #1E1E2A',
          padding: '28px 32px',
          background: '#070709',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          fontSize: 12,
          color: '#64748B',
        }}
      >
        <div>
          <strong style={{ color: '#E2E8F0' }}>Corex Studio</strong> &nbsp;·&nbsp; Proprietary Intellectual Property of <strong>LernexAI</strong>
        </div>
        <div>
          Copyright © 2026 LernexAI. All Rights Reserved.
        </div>
      </footer>

      {/* Auth Modal */}
      {authModal.open && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ ...authModal, open: false })}
        />
      )}
    </div>
  )
}
