/**
 * LernexAI Proprietary — Corex Pre-Bundled Media, Hybrid CDN & Template Asset Vault (Step 1)
 *
 * Dual-Utility Architecture:
 * 1. Manual User Discovery: Zero-latency local vector/cutout graphics, 3D mockups, gradient orbs & badges.
 * 2. Autonomous Corex Bot Resolver: Semantically indexed assets (0% CORS errors, 0ms offline data-URI
 *    rendering + optional high-res CORS-safe CDN streams).
 */

export type CorexAssetCategory =
  | 'tech-ai'
  | 'creator-cutout'
  | 'device-mockup'
  | 'ecommerce-sale'
  | 'podcast-music'
  | 'minimal-editorial'
  | 'fitness-sport'
  | 'gradient-orb'
  | 'vector-badge'

export interface CorexVaultAsset {
  id: string
  name: string
  category: CorexAssetCategory
  tags: string[]
  /** Instant 0ms offline-safe SVG Data URI (100% zero-CORS guaranteed) */
  localDataUri: string
  /** Optional CORS-safe high-res stock photo stream for hybrid mode */
  onlineImageUrl?: string
  /** Whether the Corex Bot should prefer the crisp local SVG cutout or hybrid photo */
  preferredSource: 'local-svg' | 'hybrid-photo'
  aspectRatio: number
  defaultWidthRatio: number
  alphaMasked: boolean
  accentColor: string
}

export interface CorexDomainArchetype {
  id: string
  name: string
  category: CorexAssetCategory
  keywords: string[]
  recommendedCanvasLabel: string
  width: number
  height: number
  bgHex: string
  primaryHex: string
  secondaryHex: string
  accentHex: string
  textHex: string
  mutedTextHex: string
  cardHex: string
  glslPreset: 'aurora-plasma' | 'synthwave-grid' | 'quantum-mesh' | 'constellation' | null
  defaultBadge: string
  defaultHeadline: string
  defaultSubtitle: string
  defaultCta: string
}

function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`
}

/**
 * Pre-Bundled Local & Hybrid Asset Catalog
 * Every item contains a rich, scalable vector/glassmorphic SVG graphic embedded directly in Corex
 * so offline execution and 60FPS bot painting never fail or block on network latency.
 */
export const COREX_ASSET_VAULT: CorexVaultAsset[] = [
  {
    id: 'vault-ai-quantum-core',
    name: '3D Quantum AI Neural Core',
    category: 'tech-ai',
    tags: ['ai', 'tech', 'quantum', 'neural', 'cyber', 'youtube', 'thumbnail', 'saas', 'future', 'bot'],
    preferredSource: 'local-svg',
    aspectRatio: 1,
    defaultWidthRatio: 0.34,
    alphaMasked: true,
    accentColor: '#06B6D4',
    onlineImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    localDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" width="420" height="420">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.55"/>
            <stop offset="60%" stop-color="#14B8A6" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="#08090E" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="prism" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#22D3EE"/>
            <stop offset="50%" stop-color="#06B6D4"/>
            <stop offset="100%" stop-color="#0F766E"/>
          </linearGradient>
          <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.24"/>
            <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.05"/>
          </linearGradient>
        </defs>
        <circle cx="210" cy="210" r="195" fill="url(#glow)"/>
        <circle cx="210" cy="210" r="150" fill="none" stroke="#06B6D4" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="8 6"/>
        <circle cx="210" cy="210" r="118" fill="none" stroke="#14B8A6" stroke-opacity="0.45" stroke-width="2"/>
        <polygon points="210,68 332,138 332,282 210,352 88,282 88,138" fill="url(#glass)" stroke="#22D3EE" stroke-width="2.5"/>
        <polygon points="210,68 332,138 210,210 88,138" fill="#22D3EE" fill-opacity="0.22"/>
        <polygon points="210,210 332,138 332,282 210,352" fill="#06B6D4" fill-opacity="0.16"/>
        <polygon points="210,112 294,160 294,260 210,308 126,260 126,160" fill="url(#prism)" stroke="#F8FAFC" stroke-opacity="0.6" stroke-width="1.5"/>
        <circle cx="210" cy="210" r="34" fill="#08090E" stroke="#22D3EE" stroke-width="3"/>
        <circle cx="210" cy="210" r="14" fill="#22D3EE"/>
        <circle cx="210" cy="68" r="6" fill="#F8FAFC"/>
        <circle cx="332" cy="138" r="6" fill="#22D3EE"/>
        <circle cx="332" cy="282" r="6" fill="#14B8A6"/>
        <circle cx="210" cy="352" r="6" fill="#F8FAFC"/>
        <circle cx="88" cy="282" r="6" fill="#14B8A6"/>
        <circle cx="88" cy="138" r="6" fill="#22D3EE"/>
      </svg>
    `),
  },
  {
    id: 'vault-saas-dashboard-mockup',
    name: 'Glassmorphic SaaS Analytics Card',
    category: 'device-mockup',
    tags: ['saas', 'dashboard', 'app', 'ui', 'mockup', 'startup', 'chart', 'product', 'tech', 'analytics'],
    preferredSource: 'local-svg',
    aspectRatio: 1.35,
    defaultWidthRatio: 0.42,
    alphaMasked: true,
    accentColor: '#14B8A6',
    localDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 400" width="540" height="400">
        <defs>
          <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#111625" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="#0B0E17" stop-opacity="0.98"/>
          </linearGradient>
          <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#22D3EE"/>
            <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.2"/>
          </linearGradient>
          <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#06B6D4"/>
            <stop offset="50%" stop-color="#10B981"/>
            <stop offset="100%" stop-color="#22D3EE"/>
          </linearGradient>
        </defs>
        <rect x="16" y="16" width="508" height="368" rx="28" fill="url(#cardBg)" stroke="#22D3EE" stroke-opacity="0.35" stroke-width="2"/>
        <circle cx="48" cy="46" r="6" fill="#F43F5E"/>
        <circle cx="68" cy="46" r="6" fill="#F59E0B"/>
        <circle cx="88" cy="46" r="6" fill="#10B981"/>
        <rect x="116" y="38" width="160" height="16" rx="8" fill="#1E293B"/>
        <rect x="410" y="34" width="86" height="24" rx="12" fill="#06B6D4" fill-opacity="0.18" stroke="#06B6D4" stroke-width="1"/>
        <rect x="44" y="84" width="140" height="76" rx="16" fill="#161C2E" stroke="#334155" stroke-width="1"/>
        <rect x="60" y="100" width="64" height="10" rx="5" fill="#64748B"/>
        <rect x="60" y="122" width="96" height="22" rx="6" fill="#F8FAFC"/>
        <rect x="200" y="84" width="140" height="76" rx="16" fill="#161C2E" stroke="#06B6D4" stroke-opacity="0.4" stroke-width="1"/>
        <rect x="216" y="100" width="64" height="10" rx="5" fill="#06B6D4"/>
        <rect x="216" y="122" width="96" height="22" rx="6" fill="#10B981"/>
        <rect x="356" y="84" width="140" height="76" rx="16" fill="#161C2E" stroke="#334155" stroke-width="1"/>
        <rect x="372" y="100" width="64" height="10" rx="5" fill="#64748B"/>
        <rect x="372" y="122" width="96" height="22" rx="6" fill="#22D3EE"/>
        <rect x="44" y="182" width="452" height="174" rx="20" fill="#0D111C" stroke="#1E293B" stroke-width="1.5"/>
        <rect x="76" y="276" width="28" height="56" rx="8" fill="url(#barGrad)"/>
        <rect x="128" y="246" width="28" height="86" rx="8" fill="url(#barGrad)"/>
        <rect x="180" y="260" width="28" height="72" rx="8" fill="url(#barGrad)"/>
        <rect x="232" y="218" width="28" height="114" rx="8" fill="url(#barGrad)"/>
        <rect x="284" y="236" width="28" height="96" rx="8" fill="url(#barGrad)"/>
        <rect x="336" y="198" width="28" height="134" rx="8" fill="url(#barGrad)"/>
        <rect x="388" y="210" width="28" height="122" rx="8" fill="url(#barGrad)"/>
        <rect x="440" y="188" width="28" height="144" rx="8" fill="url(#barGrad)"/>
        <path d="M 90 270 Q 150 220, 200 245 T 310 205 T 454 185" fill="none" stroke="url(#lineGlow)" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'vault-creator-portrait-cutout',
    name: 'Tech Creator Studio Cutout Badge',
    category: 'creator-cutout',
    tags: ['creator', 'youtube', 'person', 'portrait', 'speaker', 'founder', 'vlog', 'thumbnail', 'avatar'],
    preferredSource: 'local-svg',
    aspectRatio: 1,
    defaultWidthRatio: 0.35,
    alphaMasked: true,
    accentColor: '#06B6D4',
    onlineImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    localDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" width="420" height="420">
        <defs>
          <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#06B6D4"/>
            <stop offset="50%" stop-color="#10B981"/>
            <stop offset="100%" stop-color="#F59E0B"/>
          </linearGradient>
          <linearGradient id="avatarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1E293B"/>
            <stop offset="100%" stop-color="#0F172A"/>
          </linearGradient>
        </defs>
        <circle cx="210" cy="210" r="184" fill="#06B6D4" fill-opacity="0.12"/>
        <circle cx="210" cy="210" r="162" fill="url(#avatarFill)" stroke="url(#ring)" stroke-width="8"/>
        <circle cx="210" cy="168" r="54" fill="#22D3EE" fill-opacity="0.88"/>
        <path d="M 112 324 C 122 252, 298 252, 308 324" fill="#06B6D4" fill-opacity="0.75"/>
        <rect x="140" y="148" width="140" height="34" rx="17" fill="#08090E" stroke="#22D3EE" stroke-width="3"/>
        <line x1="158" y1="165" x2="195" y2="165" stroke="#22D3EE" stroke-width="4" stroke-linecap="round"/>
        <line x1="225" y1="165" x2="262" y2="165" stroke="#10B981" stroke-width="4" stroke-linecap="round"/>
        <circle cx="332" cy="96" r="24" fill="#10B981" stroke="#08090E" stroke-width="5"/>
        <polyline points="321,96 329,104 344,88" fill="none" stroke="#08090E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `),
  },
  {
    id: 'vault-ecommerce-luxury-pod',
    name: 'Luxury Sale & Offer Emblem',
    category: 'ecommerce-sale',
    tags: ['sale', 'discount', 'offer', 'black friday', 'shop', 'ecommerce', 'fashion', 'deal', 'promo'],
    preferredSource: 'local-svg',
    aspectRatio: 1,
    defaultWidthRatio: 0.34,
    alphaMasked: true,
    accentColor: '#F59E0B',
    onlineImageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    localDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" width="420" height="420">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDE68A"/>
            <stop offset="50%" stop-color="#F59E0B"/>
            <stop offset="100%" stop-color="#F43F5E"/>
          </linearGradient>
        </defs>
        <circle cx="210" cy="210" r="185" fill="#F59E0B" fill-opacity="0.12"/>
        <circle cx="210" cy="210" r="154" fill="#11141C" stroke="url(#goldGrad)" stroke-width="6"/>
        <circle cx="210" cy="210" r="134" fill="none" stroke="#FDE68A" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="6 6"/>
        <polygon points="210,76 242,148 320,156 260,208 278,284 210,244 142,284 160,208 100,156 178,148" fill="url(#goldGrad)" fill-opacity="0.25" stroke="url(#goldGrad)" stroke-width="3"/>
        <rect x="118" y="172" width="184" height="76" rx="18" fill="#08090E" stroke="url(#goldGrad)" stroke-width="2.5"/>
        <text x="210" y="221" text-anchor="middle" fill="#F8FAFC" font-family="sans-serif" font-weight="900" font-size="36" letter-spacing="2">VIP DROP</text>
      </svg>
    `),
  },
  {
    id: 'vault-podcast-sonic-wave',
    name: 'Studio Podcast Sonic Emblem',
    category: 'podcast-music',
    tags: ['podcast', 'audio', 'music', 'spotify', 'episode', 'mic', 'voice', 'radio', 'show'],
    preferredSource: 'local-svg',
    aspectRatio: 1,
    defaultWidthRatio: 0.34,
    alphaMasked: true,
    accentColor: '#10B981',
    localDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" width="420" height="420">
        <defs>
          <linearGradient id="sonic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#10B981"/>
            <stop offset="100%" stop-color="#06B6D4"/>
          </linearGradient>
        </defs>
        <circle cx="210" cy="210" r="176" fill="#10B981" fill-opacity="0.1"/>
        <circle cx="210" cy="210" r="145" fill="#0D111C" stroke="url(#sonic)" stroke-width="4"/>
        <rect x="182" y="114" width="56" height="104" rx="28" fill="url(#sonic)"/>
        <path d="M 152 190 A 58 58 0 0 0 268 190" fill="none" stroke="#F8FAFC" stroke-width="8" stroke-linecap="round"/>
        <line x1="210" y1="248" x2="210" y2="296" stroke="#F8FAFC" stroke-width="8" stroke-linecap="round"/>
        <line x1="174" y1="296" x2="246" y2="296" stroke="#10B981" stroke-width="8" stroke-linecap="round"/>
        <rect x="108" y="178" width="10" height="44" rx="5" fill="#06B6D4"/>
        <rect x="86" y="156" width="10" height="88" rx="5" fill="#10B981"/>
        <rect x="302" y="178" width="10" height="44" rx="5" fill="#06B6D4"/>
        <rect x="324" y="156" width="10" height="88" rx="5" fill="#10B981"/>
      </svg>
    `),
  },
  {
    id: 'vault-fitness-power-crest',
    name: 'High-Voltage Performance Crest',
    category: 'fitness-sport',
    tags: ['gym', 'fitness', 'workout', 'sport', 'energy', 'training', 'health', 'power', 'motivation'],
    preferredSource: 'local-svg',
    aspectRatio: 1,
    defaultWidthRatio: 0.32,
    alphaMasked: true,
    accentColor: '#10B981',
    localDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" width="420" height="420">
        <defs>
          <linearGradient id="volt" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#10B981"/>
            <stop offset="100%" stop-color="#22D3EE"/>
          </linearGradient>
        </defs>
        <polygon points="210,36 366,126 366,294 210,384 54,294 54,126" fill="#0B0F19" stroke="url(#volt)" stroke-width="6"/>
        <polygon points="234,92 132,224 206,224 182,328 292,192 216,192" fill="url(#volt)"/>
      </svg>
    `),
  },
  {
    id: 'vault-ambient-cyan-orb',
    name: 'Electric Cyan Ambient Sphere',
    category: 'gradient-orb',
    tags: ['orb', 'gradient', 'glow', 'ambient', 'background', 'sphere', 'light'],
    preferredSource: 'local-svg',
    aspectRatio: 1,
    defaultWidthRatio: 0.45,
    alphaMasked: true,
    accentColor: '#06B6D4',
    localDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <radialGradient id="orbCyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.65"/>
            <stop offset="55%" stop-color="#06B6D4" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#06B6D4" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="196" fill="url(#orbCyan)"/>
      </svg>
    `),
  },
]

/**
 * Curated Domain Archetypes used by the Autonomous Corex Planner (Step 2)
 */
export const COREX_DOMAIN_ARCHETYPES: CorexDomainArchetype[] = [
  {
    id: 'archetype-yt-tech',
    name: 'Viral Tech & AI YouTube Thumbnail',
    category: 'tech-ai',
    keywords: ['youtube', 'thumbnail', 'yt', 'tech', 'ai', 'coding', 'developer', 'viral', 'video', 'tutorial', 'cyber'],
    recommendedCanvasLabel: 'YouTube High-CTR Thumbnail',
    width: 1280,
    height: 720,
    bgHex: '#07080D',
    primaryHex: '#06B6D4',
    secondaryHex: '#14B8A6',
    accentHex: '#22D3EE',
    textHex: '#F8FAFC',
    mutedTextHex: '#94A3B8',
    cardHex: '#111522',
    glslPreset: 'aurora-plasma',
    defaultBadge: 'COREX AI STUDIO • EPISODE LIVE',
    defaultHeadline: 'NEXT-GEN AI WORKFLOW',
    defaultSubtitle: '60FPS Autonomous Vector & WebGL2 Shader Pipeline',
    defaultCta: 'WATCH MASTERCLASS →',
  },
  {
    id: 'archetype-ig-saas',
    name: 'Instagram SaaS & Product Launch Post',
    category: 'device-mockup',
    keywords: ['instagram', 'ig', 'post', 'carousel', 'saas', 'startup', 'launch', 'product', 'app', 'ui', 'dashboard'],
    recommendedCanvasLabel: 'Instagram Square (1:1)',
    width: 1080,
    height: 1080,
    bgHex: '#080A11',
    primaryHex: '#14B8A6',
    secondaryHex: '#06B6D4',
    accentHex: '#10B981',
    textHex: '#F8FAFC',
    mutedTextHex: '#94A3B8',
    cardHex: '#121624',
    glslPreset: 'quantum-mesh',
    defaultBadge: 'PRODUCT LAUNCH v1.0',
    defaultHeadline: 'BUILD 10X FASTER',
    defaultSubtitle: 'Zero-Latency Cloud & Local Vector Design System',
    defaultCta: 'TRY FREE TODAY',
  },
  {
    id: 'archetype-sale-promo',
    name: 'High-Conversion E-Commerce Sale Drop',
    category: 'ecommerce-sale',
    keywords: ['sale', 'discount', 'offer', 'black friday', 'shop', 'fashion', 'deal', 'promo', 'store', 'ecommerce'],
    recommendedCanvasLabel: 'Instagram Square (1:1)',
    width: 1080,
    height: 1080,
    bgHex: '#09090E',
    primaryHex: '#F59E0B',
    secondaryHex: '#F43F5E',
    accentHex: '#FDE68A',
    textHex: '#F8FAFC',
    mutedTextHex: '#CBD5E1',
    cardHex: '#16131E',
    glslPreset: 'synthwave-grid',
    defaultBadge: 'LIMITED TIME FLASH DROP',
    defaultHeadline: 'UP TO 60% OFF PRO',
    defaultSubtitle: 'Exclusive Sovereign Collection • Instant Access',
    defaultCta: 'CLAIM OFFER NOW',
  },
  {
    id: 'archetype-podcast-cover',
    name: 'Spotify & Apple Podcast Cover Art',
    category: 'podcast-music',
    keywords: ['podcast', 'spotify', 'audio', 'music', 'episode', 'talk', 'interview', 'show', 'radio'],
    recommendedCanvasLabel: 'Spotify / Apple Podcast Cover',
    width: 1400,
    height: 1400,
    bgHex: '#07090E',
    primaryHex: '#10B981',
    secondaryHex: '#06B6D4',
    accentHex: '#34D399',
    textHex: '#F8FAFC',
    mutedTextHex: '#94A3B8',
    cardHex: '#101722',
    glslPreset: 'constellation',
    defaultBadge: 'THE FOUNDER FREQUENCY',
    defaultHeadline: 'DEEP TECH DIALOGUES',
    defaultSubtitle: 'Hosted by Sourav Maurya • Weekly New Episodes',
    defaultCta: 'STREAM ON SPOTIFY',
  },
  {
    id: 'archetype-fitness-poster',
    name: 'High-Voltage Fitness & Training Poster',
    category: 'fitness-sport',
    keywords: ['gym', 'fitness', 'workout', 'sport', 'training', 'athletic', 'energy', 'coach'],
    recommendedCanvasLabel: 'Exhibition Poster (4:5)',
    width: 1200,
    height: 1500,
    bgHex: '#07090D',
    primaryHex: '#10B981',
    secondaryHex: '#06B6D4',
    accentHex: '#22D3EE',
    textHex: '#F8FAFC',
    mutedTextHex: '#94A3B8',
    cardHex: '#111722',
    glslPreset: 'aurora-plasma',
    defaultBadge: 'ELITE PERFORMANCE CLUB',
    defaultHeadline: 'UNLEASH YOUR PEAK',
    defaultSubtitle: 'Strength • Conditioning • High-Velocity Labs',
    defaultCta: 'JOIN THE SQUAD',
  },
  {
    id: 'archetype-minimal-editorial',
    name: 'Swiss Minimalist Editorial Composition',
    category: 'minimal-editorial',
    keywords: ['minimal', 'editorial', 'swiss', 'clean', 'luxury', 'poster', 'magazine', 'architecture', 'modern'],
    recommendedCanvasLabel: 'Exhibition Poster (4:5)',
    width: 1200,
    height: 1500,
    bgHex: '#F8FAFC',
    primaryHex: '#08090E',
    secondaryHex: '#06B6D4',
    accentHex: '#0F172A',
    textHex: '#08090E',
    mutedTextHex: '#475569',
    cardHex: '#FFFFFF',
    glslPreset: null,
    defaultBadge: 'ARCHIVE EDITION NO. 01',
    defaultHeadline: 'FORM FOLLOWS PRECISION',
    defaultSubtitle: 'A Study in Geometric Balance & Spatial Typography',
    defaultCta: 'EXPLORE EXHIBITION',
  },
]

/**
 * Resolves the best matching pre-bundled asset for any natural language user prompt
 */
export function resolveVaultAssetForPrompt(
  prompt: string,
  preferredCategory?: CorexAssetCategory,
): CorexVaultAsset {
  const lower = prompt.toLowerCase()

  if (preferredCategory) {
    const byCategory = COREX_ASSET_VAULT.find((a) => a.category === preferredCategory)
    if (byCategory) return byCategory
  }

  let bestAsset = COREX_ASSET_VAULT[0]
  let bestScore = -1

  for (const asset of COREX_ASSET_VAULT) {
    let score = 0
    for (const tag of asset.tags) {
      if (lower.includes(tag)) score += 3
    }
    if (score > bestScore) {
      bestScore = score
      bestAsset = asset
    }
  }

  return bestAsset
}

/**
 * Resolves the best domain archetype for a natural language user prompt
 */
export function resolveArchetypeForPrompt(prompt: string): CorexDomainArchetype {
  const lower = prompt.toLowerCase()
  let best = COREX_DOMAIN_ARCHETYPES[0]
  let maxHits = 0

  for (const arch of COREX_DOMAIN_ARCHETYPES) {
    let hits = 0
    for (const kw of arch.keywords) {
      if (lower.includes(kw)) hits += 2
    }
    if (hits > maxHits) {
      maxHits = hits
      best = arch
    }
  }

  return best
}
