import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, CheckCircle2, ShieldCheck, Lock, Mail, User as UserIcon } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

interface AuthModalProps {
  initialMode?: 'signin' | 'signup' | 'google'
  onClose: () => void
}

const DEMO_GOOGLE_ACCOUNTS = [
  {
    name: 'Sourav Maurya',
    email: 'iamsouravmaurya@gmail.com',
    role: 'Founder · LernexAI Pro',
    initials: 'SM',
    color: '#06B6D4',
  },
  {
    name: 'Aarav Verma',
    email: 'aarav.design@lernexai.com',
    role: 'Lead Creative Director',
    initials: 'AV',
    color: '#14B8A6',
  },
]

function GoogleBrandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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

export function AuthModal({ initialMode = 'signup', onClose }: AuthModalProps) {
  const { setUser } = useEditorStore()
  const [mode, setMode] = useState<'signin' | 'signup' | 'google'>(initialMode)
  const [name, setName] = useState('Sourav Maurya')
  const [email, setEmail] = useState('iamsouravmaurya@gmail.com')
  const [password, setPassword] = useState('••••••••••••')
  const [authenticating, setAuthenticating] = useState(false)
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState<string | null>(null)

  const completeLogin = (userData: { name: string; email: string; provider: 'google' | 'email' | 'demo' }) => {
    setAuthenticating(true)
    setTimeout(() => {
      setUser({
        name: userData.name,
        email: userData.email,
        plan: 'Corex Pro · LernexAI',
        provider: userData.provider,
      })
      onClose()
    }, 650)
  }

  const handleGoogleAccountSelect = (acc: typeof DEMO_GOOGLE_ACCOUNTS[0]) => {
    setSelectedGoogleEmail(acc.email)
    completeLogin({
      name: acc.name,
      email: acc.email,
      provider: 'google',
    })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    completeLogin({
      name: mode === 'signup' ? name.trim() || 'Corex Creator' : email.split('@')[0] || 'Sourav Maurya',
      email: email.trim() || 'creator@lernexai.com',
      provider: 'email',
    })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(8, 9, 14, 0.82)',
          backdropFilter: 'blur(14px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
        }}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 420,
            background: '#0D0F17',
            border: '1px solid #1A1E2A',
            borderRadius: '1.5rem',
            boxShadow: '0 24px 64px rgba(8, 9, 14, 0.85), 0 6px 16px rgba(6, 182, 212, 0.12)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Top Accent Line */}
          <div
            style={{
              height: 3,
              width: '100%',
              background: 'linear-gradient(90deg, #06B6D4 0%, #14B8A6 50%, #10B981 100%)',
            }}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 30,
              height: 30,
              borderRadius: '0.5rem',
              background: '#11141C',
              border: '1px solid #1A1E2A',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={15} />
          </button>

          <div style={{ padding: '28px 28px 24px' }}>
            {/* Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
                <defs>
                  <linearGradient id="authLogoGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
                <circle cx="14" cy="14" r="13" fill="url(#authLogoGrad)" />
                <path
                  d="M20 9C18.3 7.75 16.24 7 14 7C9.03 7 5 10.69 5 15C5 19.31 9.03 23 14 23C16.24 23 18.3 22.25 20 21"
                  stroke="#08090E"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 16, color: '#F8FAFC', letterSpacing: '-0.03em' }}>
                  Corex Studio
                </div>
                <div style={{ fontSize: 10.5, color: '#64748B' }}>
                  LernexAI Creative Cloud · Demo Auth
                </div>
              </div>
            </div>

            {mode === 'google' ? (
              /* GOOGLE OAUTH DEMO ACCOUNT CHOOSER */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <GoogleBrandIcon />
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9' }}>
                    Sign in with Google
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: '#94A3B8', marginBottom: 18, lineHeight: 1.6 }}>
                  Choose a demo Google account to launch straight into your Corex Studio workspace:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                  {DEMO_GOOGLE_ACCOUNTS.map((acc) => {
                    const isSelected = selectedGoogleEmail === acc.email && authenticating
                    return (
                      <button
                        key={acc.email}
                        onClick={() => handleGoogleAccountSelect(acc)}
                        disabled={authenticating}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '0.75rem',
                          background: isSelected ? 'rgba(6, 182, 212, 0.14)' : '#11141C',
                          border: isSelected ? '1px solid #06B6D4' : '1px solid #1A1E2A',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 150ms ease',
                        }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            background: acc.color,
                            color: '#08090E',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: 13,
                            flexShrink: 0,
                          }}
                        >
                          {acc.initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>
                            {acc.name}
                          </div>
                          <div style={{ fontSize: 11.5, color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {acc.email}
                          </div>
                          <div style={{ fontSize: 10, color: '#06B6D4', marginTop: 2 }}>
                            {acc.role}
                          </div>
                        </div>
                        {isSelected ? (
                          <CheckCircle2 size={18} color="#06B6D4" />
                        ) : (
                          <ArrowRight size={15} color="#64748B" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {authenticating && (
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: '0.5rem',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#6EE7B7',
                      fontSize: 11.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Google token verified! Opening Corex Studio Dashboard...</span>
                  </div>
                )}

                <button
                  onClick={() => setMode('signup')}
                  style={{
                    width: '100%',
                    padding: '9px',
                    background: 'transparent',
                    border: '1px solid #1A1E2A',
                    borderRadius: '0.5rem',
                    color: '#94A3B8',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  ← Use email & password instead
                </button>
              </div>
            ) : (
              /* STANDARD SIGN UP / SIGN IN FORM + GOOGLE BUTTON */
              <div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 800, color: '#F8FAFC', marginBottom: 4 }}>
                  {mode === 'signup' ? (
                    <>
                      Create your{' '}
                      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', color: '#06B6D4' }}>
                        Studio
                      </span>{' '}
                      account
                    </>
                  ) : (
                    'Welcome back to Corex'
                  )}
                </h2>
                <p style={{ fontSize: 12.5, color: '#94A3B8', marginBottom: 18 }}>
                  {mode === 'signup'
                    ? 'Start designing with 60FPS vector tools & Gemini 3.8 Flash AI.'
                    : 'Sign in to access your saved projects, templates, and AI studio.'}
                </p>

                {/* Google OAuth Primary CTA */}
                <button
                  type="button"
                  onClick={() => setMode('google')}
                  disabled={authenticating}
                  style={{
                    width: '100%',
                    height: 42,
                    borderRadius: '0.75rem',
                    background: '#F8FAFC',
                    color: '#08090E',
                    border: '1px solid #E2E8F0',
                    fontSize: 13,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    boxShadow: '0 6px 16px rgba(6, 182, 212, 0.12)',
                    marginBottom: 16,
                  }}
                >
                  <GoogleBrandIcon />
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1, height: 1, background: '#1A1E2A' }} />
                  <span style={{ fontSize: 10.5, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    or continue with email
                  </span>
                  <div style={{ flex: 1, height: 1, background: '#1A1E2A' }} />
                </div>

                {/* Email Form */}
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {mode === 'signup' && (
                    <div>
                      <label style={{ fontSize: 11.5, fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: 5 }}>
                        Full Name
                      </label>
                      <div style={{ position: 'relative' }}>
                        <UserIcon size={14} style={{ position: 'absolute', left: 11, top: 12, color: '#64748B' }} />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Sourav Maurya"
                          required
                          style={{
                            width: '100%',
                            height: 38,
                            paddingLeft: 34,
                            paddingRight: 12,
                            borderRadius: '0.5rem',
                            background: '#11141C',
                            border: '1px solid #1A1E2A',
                            color: '#F8FAFC',
                            fontSize: 13,
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: 5 }}>
                      Work Email
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={14} style={{ position: 'absolute', left: 11, top: 12, color: '#64748B' }} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@lernexai.com"
                        required
                        style={{
                          width: '100%',
                          height: 38,
                          paddingLeft: 34,
                          paddingRight: 12,
                          borderRadius: '0.5rem',
                          background: '#11141C',
                          border: '1px solid #1A1E2A',
                          color: '#F8FAFC',
                          fontSize: 13,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: 5 }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={14} style={{ position: 'absolute', left: 11, top: 12, color: '#64748B' }} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          height: 38,
                          paddingLeft: 34,
                          paddingRight: 12,
                          borderRadius: '0.5rem',
                          background: '#11141C',
                          border: '1px solid #1A1E2A',
                          color: '#F8FAFC',
                          fontSize: 13,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authenticating}
                    style={{
                      marginTop: 4,
                      height: 42,
                      borderRadius: '0.75rem',
                      background: 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#08090E',
                      fontSize: 13.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 6px 16px rgba(6, 182, 212, 0.25)',
                    }}
                  >
                    <span>
                      {authenticating
                        ? 'Launching Studio Workspace...'
                        : mode === 'signup'
                          ? 'Create Studio Account'
                          : 'Sign In to Dashboard'}
                    </span>
                    <ArrowRight size={14} />
                  </button>
                </form>

                {/* Switch Mode Footer */}
                <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: '#94A3B8' }}>
                  {mode === 'signup' ? (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signin')}
                        style={{ background: 'none', border: 'none', color: '#06B6D4', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Sign In
                      </button>
                    </>
                  ) : (
                    <>
                      New to Corex Studio?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        style={{ background: 'none', border: 'none', color: '#06B6D4', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Create Free Account
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Security Footer */}
          <div
            style={{
              padding: '10px 28px',
              background: '#08090E',
              borderTop: '1px solid #1A1E2A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 10.5,
              color: '#64748B',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <ShieldCheck size={13} color="#10B981" />
              Instant Demo Session Ready
            </span>
            <span>LernexAI Identity</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
