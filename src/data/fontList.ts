/**
 * LernexAI Proprietary — 36 Curated Studio Typeface Catalog & Dynamic Font Loader
 */
import type { Canvas as FabricCanvas } from 'fabric'

export const FONT_LIST = [
  'Plus Jakarta Sans',
  'Playfair Display',
  'JetBrains Mono',
  'Space Grotesk',
  'Syne',
  'Outfit',
  'Cabinet Grotesk',
  'Clash Display',
  'Sora',
  'DM Sans',
  'Manrope',
  'Urbanist',
  'Bricolage Grotesque',
  'Instrument Serif',
  'Fraunces',
  'Cormorant Garamond',
  'Bodoni Moda',
  'Cinzel',
  'Libre Baskerville',
  'EB Garamond',
  'Bebas Neue',
  'Anton',
  'Oswald',
  'Righteous',
  'Unbounded',
  'Orbitron',
  'Chakra Petch',
  'Rajdhani',
  'Teko',
  'Archivo Black',
  'Fira Code',
  'Space Mono',
  'IBM Plex Mono',
  'Pacifico',
  'Dancing Script',
  'Caveat',
] as const

export type FontFamily = (typeof FONT_LIST)[number]

const loadedTypefaces = new Set<string>(['Plus Jakarta Sans', 'Playfair Display', 'JetBrains Mono'])

export async function loadGoogleFont(
  familyName: string,
  stage?: FabricCanvas | null,
): Promise<void> {
  if (!loadedTypefaces.has(familyName)) {
    loadedTypefaces.add(familyName)
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(familyName)}:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&display=swap`
    document.head.appendChild(link)
  }
  try {
    await document.fonts.load(`16px "${familyName}"`)
  } catch {
    // Fallback to system stack if offline
  }
  if (stage) {
    stage.getObjects().forEach((node: any) => {
      if (typeof node.initDimensions === 'function') node.initDimensions()
    })
    stage.requestRenderAll()
  }
}
