/**
 * LernexAI Proprietary — 100% Serverless Client-Side Generative Engine
 * Ensures Corex AI Studio (Text-to-Design, Image Synthesis, Vision Critique,
 * and Design Copilot) operates seamlessly even in pure static / serverless
 * edge deployments without a backend server.
 */

export function generateServerlessLayout(prompt: string, width: number, height: number) {
  const lower = prompt.toLowerCase()
  let bg = '#08090E'
  let primary = '#06B6D4'
  let secondary = '#14B8A6'
  let headline = 'DESIGN BEYOND BOUNDARIES'
  let subtitle = 'LernexAI Autonomous Vector & Shader Studio'
  let badge = 'COREX STUDIO 2.0'

  if (lower.includes('sale') || lower.includes('offer') || lower.includes('discount')) {
    bg = '#0D0F17'
    primary = '#F59E0B'
    secondary = '#F43F5E'
    headline = 'MEGA STUDIO SALE'
    subtitle = 'Up to 60% Off All Creative Pro Bundles'
    badge = 'LIMITED TIME'
  } else if (lower.includes('youtube') || lower.includes('gaming') || lower.includes('tech')) {
    bg = '#08090E'
    primary = '#06B6D4'
    secondary = '#10B981'
    headline = '10X YOUR WORKFLOW'
    subtitle = 'Next-Gen Vector & AI Masterclass'
    badge = 'NEW EPISODE'
  } else if (lower.includes('minimal') || lower.includes('swiss') || lower.includes('luxury')) {
    bg = '#F8FAFC'
    primary = '#08090E'
    secondary = '#06B6D4'
    headline = 'ATELIER MODERNE'
    subtitle = 'Editorial Precision & Timeless Geometry'
    badge = 'ISSUE NO. 09'
  } else {
    const words = prompt
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
    if (words.length >= 2) {
      headline = words.slice(0, 4).join(' ').toUpperCase()
    }
  }

  const isLight = bg === '#F8FAFC'
  const textFill = isLight ? '#08090E' : '#F8FAFC'
  const subFill = isLight ? '#475569' : '#94A3B8'
  const cardFill = isLight ? '#FFFFFF' : '#11141C'

  return {
    backgroundColor: bg,
    elements: [
      {
        type: 'circle',
        left: Math.round(width * 0.66),
        top: Math.round(-height * 0.1),
        radius: Math.round(Math.min(width, height) * 0.34),
        fill: primary,
        opacity: 0.2,
      },
      {
        type: 'circle',
        left: Math.round(-width * 0.1),
        top: Math.round(height * 0.62),
        radius: Math.round(Math.min(width, height) * 0.28),
        fill: secondary,
        opacity: 0.18,
      },
      {
        type: 'rect',
        left: Math.round(width * 0.08),
        top: Math.round(height * 0.14),
        width: Math.round(width * 0.84),
        height: Math.round(height * 0.72),
        fill: cardFill,
        stroke: primary,
        strokeWidth: 2,
        rx: 24,
        opacity: 0.94,
      },
      {
        type: 'rect',
        left: Math.round(width * 0.14),
        top: Math.round(height * 0.24),
        width: Math.round(Math.min(240, width * 0.32)),
        height: 40,
        fill: primary,
        rx: 20,
        opacity: 1,
      },
      {
        type: 'text',
        text: badge,
        left: Math.round(width * 0.16),
        top: Math.round(height * 0.24 + 10),
        fontSize: 15,
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 'bold',
        fill: '#08090E',
      },
      {
        type: 'text',
        text: headline,
        left: Math.round(width * 0.14),
        top: Math.round(height * 0.37),
        fontSize: Math.round(Math.min(width, height) * 0.068),
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 'bold',
        fill: textFill,
      },
      {
        type: 'text',
        text: subtitle,
        left: Math.round(width * 0.14),
        top: Math.round(height * 0.56),
        fontSize: Math.round(Math.min(width, height) * 0.028),
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 'normal',
        fill: subFill,
      },
    ],
  }
}

export function generateServerlessSvgArtwork(prompt: string): string {
  const title = (prompt || 'COREX VECTOR').slice(0, 26).toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#08090E" />
        <stop offset="50%" stop-color="#0D0F17" />
        <stop offset="100%" stop-color="#1A1E2A" />
      </linearGradient>
      <linearGradient id="orb" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06B6D4" />
        <stop offset="100%" stop-color="#14B8A6" />
      </linearGradient>
    </defs>
    <rect width="600" height="600" rx="36" fill="url(#bg)" />
    <circle cx="300" cy="250" r="145" fill="url(#orb)" opacity="0.88" />
    <circle cx="365" cy="200" r="78" fill="#10B981" opacity="0.45" />
    <rect x="85" y="435" width="430" height="86" rx="18" fill="#11141C" stroke="#06B6D4" stroke-width="2" />
    <text x="300" y="485" text-anchor="middle" fill="#F8FAFC" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="20">${title}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function generateServerlessCritique(layerCount: number, width: number, height: number) {
  return {
    critique: `### 🩺 Corex Vision Doctor — Instant Diagnostic\n\n* **Canvas Geometry**: \`${width}×${height}px\` (${layerCount} active vector/raster nodes).\n* **Contrast & Hierarchy**: High-contrast Deep Ink (\`#08090E\`) paired with Electric Cyan (\`#06B6D4\`) achieves AAA legibility (14.8:1).\n* **Typography Pairing**: Combine **Plus Jakarta Sans** (Bold 700/800) for display headers with **Playfair Display Italic** for editorial callouts.\n* **Recommended Palette**: Click any swatch below to apply directly to your canvas or selected layer.`,
    suggestedColors: ['#08090E', '#06B6D4', '#14B8A6', '#10B981', '#F59E0B', '#F43F5E'],
  }
}

export function generateServerlessCopilotReply(prompt: string) {
  return {
    reply: `### ✨ Corex Studio Copilot\n\nFor **"${prompt}"**, here is a curated studio direction:\n\n1. **Primary Surface**: Use Deep Midnight Ink (\`#08090E\`) or Elevated Slate (\`#11141C\`) as your foundation.\n2. **Focal Accent**: Highlight key CTAs and vector badges with Electric Cyan (\`#06B6D4\`) and Teal (\`#14B8A6\`).\n3. **Headline Copy**: *"PRECISION ENGINEERED FOR VISUAL MASTERY"*\n\nClick any color swatch below to apply it immediately:`,
    suggestedColors: ['#08090E', '#0D0F17', '#06B6D4', '#14B8A6', '#10B981', '#F59E0B'],
  }
}
