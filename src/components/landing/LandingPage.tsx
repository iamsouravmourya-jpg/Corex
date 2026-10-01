import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Wand2,
  ScanEye,
  Download,
  ArrowRight,
  Image as ImageIcon,
  Sliders,
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
  const [previewAccent, setPreviewAccent] = useState('#06B6D4')

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
        background: '#08090E',
        color: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
        fontSize: '16px',
        lineHeight: 1.75,
        position: 'relative',
      }}
    >
      {/* Ambient Cyan & Teal Atmospheric Mesh */}
      <div
        style={{
          position: 'fixed',
          top: -180,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1020,
          height: 480,
          background:
            'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.14) 0%, rgba(20, 184, 166, 0.09) 45%, transparent 75%)',
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
          height: 68,
          background: 'rgba(8, 9, 14, 0.84)',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid #1A1E2A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <defs>
              <linearGradient id="navCyanGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
            <circle cx="14" cy="14" r="13" fill="url(#navCyanGrad)" />
            <path
              d="M20 9C18.3 7.75 16.24 7 14 7C9.03 7 5 10.69 5 15C5 19.31 9.03 23 14 23C16.24 23 18.3 22.25 20 21"
              stroke="#08090E"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 19, letterSpacing: '-0.03em' }}>
              <span style={{ color: '#F8FAFC' }}>Core</span>
              <span style={{ color: '#06B6D4' }}>x</span>
            </span>
            <span style={{ fontSize: 11, color: '#64748B', fontFamily: "'JetBrains Mono', monospace" }}>
              by LernexAI
            </span>
          </div>
        </div>

        {/* Clean Unboxed Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" style={{ fontSize: 13.5, color: '#94A3B8', textDecoration: 'none', fontWeight: 500 }}>
            Architecture
          </a>
          <a href="#ai-engine" style={{ fontSize: 13.5, color: '#94A3B8', textDecoration: 'none', fontWeight: 500 }}>
            Gemini AI Suite
          </a>
          <a href="#workflow" style={{ fontSize: 13.5, color: '#94A3B8', textDecoration: 'none', fontWeight: 500 }}>
            Benchmarks
          </a>
        </nav>

        {/* Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setAuthModal({ open: true, mode: 'signin' })}
            style={{
              height: 38,
              padding: '0 16px',
              background: '#11141C',
              border: '1px solid #1A1E2A',
              borderRadius: '0.5rem',
              color: '#E2E8F0',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthModal({ open: true, mode: 'google' })}
            style={{
              height: 38,
              padding: '0 16px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '0.5rem',
              color: '#08090E',
              fontSize: 13,
              fontWeight: 700,
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
              height: 38,
              padding: '0 18px',
              background: 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '0.5rem',
              color: '#08090E',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(6, 182, 212, 0.22)',
            }}
          >
            <span>Sign Up Free</span>
            <ArrowRight size={14} />
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
          padding: '76px 24px 64px',
          textAlign: 'center',
        }}
      >
        {/* Clean Unboxed Typographic Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            color: '#06B6D4',
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          COREX QUANTUM STUDIO v3.0 &nbsp;·&nbsp; 18-ENGINE LERNEXAI CORE &nbsp;·&nbsp; WEBGL2 GLSL + OPFS VAULT
        </motion.div>

        {/* Display Headline Combining Plus Jakarta Sans + Playfair Display */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2.6rem, 5vw + 1rem, 4.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.08,
            maxWidth: 940,
            margin: '0 auto 24px',
            color: '#F8FAFC',
          }}
        >
          Autonomous Vector, GLSL Shader & AI Studio for{' '}
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 50%, #10B981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Visual Mastery.
          </span>
        </motion.h1>

        {/* Lead Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{
            fontSize: '1.05rem',
            color: '#94A3B8',
            lineHeight: 1.75,
            maxWidth: 740,
            margin: '0 auto 36px',
          }}
        >
          Experience a borderless, soft-edge 60FPS vector & WebGL2 `#version 300 es` fragment shader studio fused with contextual glassmorphic floating tools, OPFS `.cxbin` binary disk storage, CSG vector booleans, 3D axonometric extrusion, and 10-pipeline 8K compilation.
        </motion.p>

        {/* Primary CTA Cluster */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => setAuthModal({ open: true, mode: 'google' })}
            style={{
              height: 48,
              padding: '0 24px',
              borderRadius: '0.75rem',
              background: '#F8FAFC',
              color: '#08090E',
              border: '1px solid #E2E8F0',
              fontSize: 14.5,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(6, 182, 212, 0.12)',
            }}
          >
            <GoogleIconSmall />
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => setAuthModal({ open: true, mode: 'signup' })}
            style={{
              height: 48,
              padding: '0 26px',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)',
              color: '#08090E',
              border: '1px solid rgba(255,255,255,0.22)',
              fontSize: 14.5,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(6, 182, 212, 0.28)',
            }}
          >
            <span>Sign Up & Open Dashboard</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={handleInstantDemo}
            style={{
              height: 48,
              padding: '0 20px',
              borderRadius: '0.75rem',
              background: '#11141C',
              color: '#E2E8F0',
              border: '1px solid #1A1E2A',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            }}
          >
            <Play size={13} fill="#06B6D4" color="#06B6D4" />
            <span>Instant Demo Login</span>
          </button>
        </motion.div>

        {/* Sub-CTA Metadata Line */}
        <div style={{ fontSize: 12.5, color: '#64748B', marginBottom: 52 }}>
          Instant browser workspace &nbsp;·&nbsp; No credit card required &nbsp;·&nbsp; Local IndexedDB + Gemini Cloud AI
        </div>

        {/* INTERACTIVE LIVE STUDIO WORKSPACE PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: '#0D0F17',
            border: '1px solid #1A1E2A',
            borderRadius: '1.5rem',
            boxShadow: '0 32px 80px rgba(8, 9, 14, 0.85), 0 6px 16px rgba(6, 182, 212, 0.12)',
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          {/* Preview Window Top Bar */}
          <div
            style={{
              height: 46,
              background: '#11141C',
              borderBottom: '1px solid #1A1E2A',
              padding: '0 20px',
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
                Corex Studio — Brand_Identity_2026.corex (1080×1080)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>Accent Palette:</span>
              {['#06B6D4', '#14B8A6', '#10B981', '#F59E0B', '#F43F5E'].map((col) => (
                <button
                  key={col}
                  onClick={() => setPreviewAccent(col)}
                  aria-label={`Preview accent ${col}`}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '0.375rem',
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
                  padding: '5px 12px',
                  borderRadius: '0.5rem',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)',
                  border: 'none',
                  color: '#08090E',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Open Full Studio →
              </button>
            </div>
          </div>

          {/* Simulated 3-Column Studio Interface */}
          <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr 270px', minHeight: 420 }}>
            {/* Left Layers & Tools Column */}
            <div style={{ background: '#0D0F17', borderRight: '1px solid #1A1E2A', padding: 18 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                Scene Layer Tree (5)
              </div>
              {[
                { name: 'Primary CTA Pill', type: 'Vector Rect' },
                { name: 'Playfair Serif Title', type: 'Display' },
                { name: 'AI Generated Asset', type: 'Gemini 3.1' },
                { name: 'Cyan Ambient Glow', type: 'Radial Shader' },
                { name: 'Deep Ink Artboard', type: '1080 × 1080' },
              ].map((layer, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '9px 10px',
                    borderRadius: '0.5rem',
                    background: idx === 1 ? '#1A1E2A' : 'transparent',
                    borderLeft: idx === 1 ? `2.5px solid ${previewAccent}` : '2.5px solid transparent',
                    marginBottom: 6,
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
              title="Click to launch interactive editor"
              style={{
                background: '#08090E',
                backgroundImage: 'radial-gradient(#1A1E2A 1px, transparent 1px)',
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
                  padding: '38px 34px',
                  borderRadius: '1rem',
                  background: '#0D0F17',
                  border: `2px solid ${previewAccent}`,
                  boxShadow: `0 24px 64px rgba(8,9,14,0.75), 0 6px 24px ${previewAccent}26`,
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
                  LERNEXAI DESIGN SYSTEM
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: 'italic',
                    fontSize: 30,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    lineHeight: 1.2,
                    marginBottom: 10,
                  }}
                >
                  Design Beyond Boundaries.
                </div>
                <div style={{ fontSize: 13.5, color: '#94A3B8', marginBottom: 24, lineHeight: 1.6 }}>
                  Click anywhere on this artboard to launch the live 60FPS Corex Studio Dashboard.
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    borderRadius: '0.5rem',
                    background: previewAccent,
                    color: '#08090E',
                    fontSize: 12.5,
                    fontWeight: 800,
                  }}
                >
                  <span>ENTER STUDIO WORKSPACE</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>

            {/* Right AI Copilot Inspector */}
            <div style={{ background: '#0D0F17', borderLeft: '1px solid #1A1E2A', padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: '#F8FAFC', marginBottom: 12 }}>
                  <Sparkles size={14} color={previewAccent} />
                  <span>Corex AI Copilot</span>
                </div>
                <div style={{ padding: 12, borderRadius: '0.75rem', background: '#11141C', border: '1px solid #1A1E2A', fontSize: 12, color: '#CBD5E1', lineHeight: 1.6, marginBottom: 14 }}>
                  "Create a luxury editorial poster with deep ink background, Playfair Display serif headline, and cyan glow."
                </div>
                <div style={{ fontSize: 11.5, color: '#10B981', marginBottom: 8 }}>
                  ✓ 5 vector layers synthesized
                </div>
                <div style={{ fontSize: 11.5, color: '#14B8A6', marginBottom: 8 }}>
                  ✓ Contrast ratio: 15.4:1 (AAA)
                </div>
                <div style={{ fontSize: 11.5, color: '#06B6D4' }}>
                  ✓ Gemini 3.1 Image AI active
                </div>
              </div>

              <button
                onClick={() => setAuthModal({ open: true, mode: 'google' })}
                style={{
                  width: '100%',
                  height: 38,
                  borderRadius: '0.5rem',
                  background: '#1A1E2A',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  color: '#F8FAFC',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Launch AI Mode →
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
          <div style={{ fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", color: '#06B6D4', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            PROPRIETARY ARCHITECTURE
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', color: '#F8FAFC', lineHeight: 1.2 }}>
            Engineered for{' '}
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', color: '#14B8A6' }}>
              Next-Generation
            </span>{' '}
            Creative Teams
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
              icon: <Wand2 size={20} color="#06B6D4" />,
              kicker: 'WEBGL2 GLSL ES 3.00 SHADERS',
              title: 'Hardware GPU Procedural Shaders',
              desc: 'Compiles and executes real GPU fragment kernels (#version 300 es) including 5-octave Domain-Warped FBM Aurora Plasma, 3D Ray-Projected Synthwave Horizon, and Voronoi Cellular Nebulae.',
            },
            {
              icon: <ImageIcon size={20} color="#14B8A6" />,
              kicker: 'CSG BOOLEANS & 3D EXTRUSION',
              title: 'Parametric Math & 3D Relief Lab',
              desc: 'Synthesize Gielis Superformula stars, Lissajous harmonic phase waves, CSG Boolean Union/Subtract/Intersect/XOR contours, and 12-layer 3D axonometric relief extrusions.',
            },
            {
              icon: <ScanEye size={20} color="#10B981" />,
              kicker: 'GEMINI 3.8 + 3.1 FLASH AI',
              title: 'Autonomous AI & Vision Doctor',
              desc: 'Floating glassmorphic AI Copilot for Text-to-Canvas vector synthesis, Gemini 3.1 Flash image generation, and multimodal Vision Doctor contrast & composition diagnostics.',
            },
            {
              icon: <Sliders size={20} color="#F59E0B" />,
              kicker: 'BORDERLESS CREATIVE STUDIO UX',
              title: 'Contextual Floating Glass Pods',
              desc: 'Zero harsh IDE borders. Left Scene Hierarchy & OPFS Vault tree paired with on-demand floating glass creation windows and a dedicated streamlined Right Properties Deck.',
            },
            {
              icon: <Download size={20} color="#F43F5E" />,
              kicker: '10-PIPELINE 8K COMPILER',
              title: 'WebGPU 8K & Code Compilation',
              desc: 'Compile artboards to 1x–8x (8K) PNG/JPEG, SVG, 96DPI PDF, native PPTX, React 19 .tsx components, W3C Design Tokens .json, standalone HTML5 bundles, GLSL .frag, and CSS Modules.',
            },
            {
              icon: <Shield size={20} color="#06B6D4" />,
              kicker: 'OPFS .CXBIN + AES-GCM-256 VAULT',
              title: 'Binary Disk Vault & Lamport CRDT',
              desc: 'Persists DEFLATE-compressed .cxbin binary artifacts with SHA-256 digests to the W3C Origin Private File System (OPFS) alongside 64-frame ZLIB undo/redo and multi-tab CRDT sync.',
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              style={{
                padding: 28,
                borderRadius: 20,
                background: '#11141C',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.28)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: '#181C2B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {feat.icon}
              </div>
              <div style={{ fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", color: '#06B6D4', letterSpacing: '0.06em' }}>
                {feat.kicker}
              </div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.75, margin: 0 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON & KEYBOARD ERGONOMICS SECTION */}
      <section
        id="workflow"
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
            borderRadius: 20,
            background: '#11141C',
          }}
        >
          <div style={{ fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", color: '#06B6D4', letterSpacing: '0.08em', marginBottom: 8 }}>
            PERFORMANCE BENCHMARK
          </div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 18 }}>
            Why Creators Switch to Corex Quantum v3.0
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { metric: 'Shader & Vector Core', corex: '60FPS + WebGL2 GLSL 3.00', legacy: 'Static 2D DOM Fills' },
              { metric: 'Workspace Ergonomics', corex: 'Borderless + Floating Glass', legacy: 'Cluttered Boxed IDE' },
              { metric: '10-Target Compiler', corex: '8K PNG, SVG, TSX, HTML5, GLSL', legacy: 'Paywalled / 1x-2x Only' },
              { metric: 'Storage & Crypto Vault', corex: 'OPFS .cxbin + AES-GCM-256', legacy: 'Unencrypted Cloud Lock' },
              { metric: 'State & P2P Sync', corex: 'ZLIB Uint8Array + Lamport CRDT', legacy: 'Heavy Server Polling' },
            ].map((row, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1.1fr 1fr',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: '#0D0F17',
                  fontSize: 12.5,
                }}
              >
                <span style={{ color: '#CBD5E1', fontWeight: 600 }}>{row.metric}</span>
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
            borderRadius: 20,
            background: '#11141C',
          }}
        >
          <div style={{ fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", color: '#14B8A6', letterSpacing: '0.08em', marginBottom: 8 }}>
            PRO-STUDIO ERGONOMICS
          </div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 18 }}>
            Zero-Friction Keyboard Command Matrix
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { key: 'V / R / O / L / T / B', action: 'Select, Rect, Oval, Line, Text, Brush' },
              { key: 'F / ⌘ + K', action: 'Floating Elements / Command Omnibar' },
              { key: '⌘ + Z / ⌘ + ⇧ + Z', action: '64-Frame ZLIB Binary Undo & Redo' },
              { key: 'Alt + S / Alt + P', action: 'Sample & Apply Node Style' },
              { key: '⇧ + M / ⇧ + G', action: 'GLSL Aurora Shader / Toggle Grid' },
              { key: '⇧ + O / ⇧ + H', action: 'Sub-Pixel Quantizer / Heal Contrast' },
              { key: '⇧ + I / ⇧ + Q', action: '3D Isometric Cube / Vector QR' },
              { key: 'Space + Drag', action: 'Infinite Focal-Point Stage Pan' },
            ].map((sc, idx) => (
              <div
                key={idx}
                style={{
                  padding: '11px 14px',
                  borderRadius: 12,
                  background: '#0D0F17',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#22D3EE', fontWeight: 600 }}>
                  {sc.key}
                </span>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>{sc.action}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '24px 24px 80px',
        }}
      >
        <div
          style={{
            padding: '44px 40px',
            borderRadius: '1.5rem',
            background: 'linear-gradient(135deg, #11141C 0%, #0D0F17 100%)',
            border: '1px solid #1A1E2A',
            boxShadow: '0 6px 16px rgba(6, 182, 212, 0.12)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 32,
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#06B6D4', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              READY TO CREATE?
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: '#F8FAFC', marginBottom: 12, lineHeight: 1.25 }}>
              Sign in with Google Demo Auth & Enter the{' '}
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', color: '#06B6D4' }}>
                Corex Dashboard
              </span>
            </h2>
            <p style={{ fontSize: 14.5, color: '#94A3B8', lineHeight: 1.75, margin: 0 }}>
              Experience the complete LernexAI design workspace immediately. Test Google OAuth demo login, create multi-layer designs, generate AI images, and export in 5 studio formats.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button
              onClick={() => setAuthModal({ open: true, mode: 'google' })}
              style={{
                height: 46,
                padding: '0 22px',
                borderRadius: '0.75rem',
                background: '#F8FAFC',
                color: '#08090E',
                border: 'none',
                fontSize: 14,
                fontWeight: 700,
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
                height: 46,
                padding: '0 24px',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)',
                color: '#08090E',
                border: 'none',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 6px 16px rgba(6, 182, 212, 0.25)',
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
          borderTop: '1px solid #1A1E2A',
          padding: '28px 32px',
          background: '#08090E',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          fontSize: 12.5,
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
