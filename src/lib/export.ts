/**
 * LernexAI Proprietary — Multi-Format Raster & Vector Output Compiler
 */
import { Canvas as FabricCanvas } from 'fabric'
import { saveAs } from 'file-saver'

export type ExportFormat = 'png' | 'jpeg' | 'svg' | 'pdf' | 'pptx'

export interface ExportOptions {
  scale?: number
  transparent?: boolean
}

function synthesizeDataUrl(
  stage: FabricCanvas,
  {
    scale = 1,
    transparent = false,
    format = 'png',
    quality = 1,
  }: { scale?: number; transparent?: boolean; format?: 'png' | 'jpeg'; quality?: number },
): string {
  const originalBg = stage.backgroundColor
  if (transparent) stage.backgroundColor = ''
  try {
    return stage.toDataURL({ format, quality, multiplier: scale })
  } finally {
    if (transparent) {
      stage.backgroundColor = originalBg
      stage.requestRenderAll()
    }
  }
}

export async function exportCanvas(
  stage: FabricCanvas,
  format: ExportFormat,
  quality: number,
  filename: string,
  { scale = 1, transparent = false }: ExportOptions = {},
) {
  if (format === 'svg') {
    const svgString = stage.toSVG()
    saveAs(new Blob([svgString], { type: 'image/svg+xml' }), `${filename}.svg`)
    return
  }

  if (format === 'pdf' || format === 'pptx') {
    const dataUrl = synthesizeDataUrl(stage, { scale, format: 'png' })
    const w = stage.getWidth()
    const h = stage.getHeight()
    if (format === 'pdf') {
      await compilePdfDocument(dataUrl, w, h, filename)
    } else {
      await compilePptxDeck(dataUrl, w, h, filename)
    }
    return
  }

  const outputUrl = synthesizeDataUrl(stage, { scale, transparent, format, quality })
  const response = await fetch(outputUrl)
  const blob = await response.blob()
  saveAs(blob, `${filename}.${format}`)
}

async function compilePdfDocument(dataUrl: string, width: number, height: number, filename: string) {
  try {
    await fetch('/api/v1/secure-compiler/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ width, height, filename }),
    })
  } catch {
    // Proceed with local client compiler
  }

  const { jsPDF } = await import('jspdf')
  const ptWidth = Math.round(width * 0.75)
  const ptHeight = Math.round(height * 0.75)
  const pdfDoc = new jsPDF({
    orientation: ptWidth > ptHeight ? 'landscape' : 'portrait',
    unit: 'pt',
    format: [ptWidth, ptHeight],
    compress: true,
  })
  pdfDoc.addImage(dataUrl, 'PNG', 0, 0, ptWidth, ptHeight, undefined, 'FAST')
  pdfDoc.save(`${filename}.pdf`)
}

async function compilePptxDeck(dataUrl: string, width: number, height: number, filename: string) {
  const { default: PptxGenJS } = await import('pptxgenjs')
  const presentation = new PptxGenJS()
  const inchesW = width / 96
  const inchesH = height / 96
  presentation.defineLayout({ name: 'LERNEX_STAGE', width: inchesW, height: inchesH })
  presentation.layout = 'LERNEX_STAGE'
  presentation.title = filename
  const slide = presentation.addSlide()
  slide.addImage({ data: dataUrl, x: 0, y: 0, w: inchesW, h: inchesH })
  await presentation.writeFile({ fileName: `${filename}.pptx` })
}

export function captureThumbnail(stage: FabricCanvas): string {
  return stage.toDataURL({ format: 'jpeg', quality: 0.42, multiplier: 0.16 })
}
