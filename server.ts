import express from 'express'
import { GoogleGenAI } from '@google/genai'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = Number(process.env.PORT) || 3000

app.use(express.json({ limit: '20mb' }))

// Initialize Gemini SDK with API Key
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
const ai = new GoogleGenAI(apiKey ? { apiKey } : undefined)

// Health check & status
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  })
})

// AI Chat & Design Assistant
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], canvasContext } = req.body
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const systemInstruction = `You are Corex AI, an elite creative design director and AI copilot built into the Corex Graphic Design Studio.
Your objectives:
1. Provide expert, inspiring design guidance (color palettes, visual contrast, typography hierarchy, social media post formulas, CTR optimization).
2. When suggesting color palettes, always include the hex codes (#RRGGBB).
3. When providing copy or headlines, offer punchy, high-converting options.
4. Keep answers clean, well-formatted with markdown bullet points.
5. Canvas context if available: ${canvasContext ? JSON.stringify(canvasContext) : 'Standard Canvas'}.`

    const contents = [
      ...history.map((h: any) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(h.content) }],
      })),
      { role: 'user', parts: [{ text: String(message) }] },
    ]

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    })

    const text = response.text || ''

    // Extract hex colors
    const hexMatches = text.match(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)
    const uniqueColors = hexMatches ? Array.from(new Set(hexMatches)).slice(0, 8) : []

    res.json({
      text,
      colors: uniqueColors,
    })
  } catch (error: any) {
    console.error('Gemini Chat API Error:', error)
    res.status(500).json({
      error: error?.message || 'Failed to generate AI response',
      fallbackText: 'Unable to reach Gemini API. Please make sure GEMINI_API_KEY is configured in your project secrets.',
    })
  }
})

// AI Text-to-Canvas Layout Generator (Auto-Draws complete designs)
app.post('/api/ai/generate-design', async (req, res) => {
  try {
    const { prompt, canvasSize = { width: 1080, height: 1080 } } = req.body
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const systemInstruction = `You are Corex AI Layout Engine. The user requests a complete graphic design composition for a canvas with width=${canvasSize.width}, height=${canvasSize.height}.
Generate a structured JSON layout containing background color, shapes, accent cards, and typography text elements that form a visually stunning, balanced, professional graphic design.
Return ONLY valid JSON matching this schema:
{
  "backgroundColor": "#hex",
  "title": "Short title",
  "elements": [
    {
      "type": "rect" | "circle" | "triangle" | "text",
      "left": number,
      "top": number,
      "width": number,
      "height": number,
      "radius": number,
      "fill": "#hex" | "rgba(...)",
      "stroke": "#hex",
      "strokeWidth": number,
      "opacity": number,
      "text": string,
      "fontSize": number,
      "fontFamily": "Sora" | "Inter" | "Playfair Display" | "Space Grotesk" | "Outfit" | "Cabinet Grotesk",
      "fontWeight": "400" | "600" | "700" | "800",
      "textAlign": "left" | "center" | "right",
      "color": "#hex"
    }
  ]
}`

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: `Create graphic design composition for: ${prompt}. Canvas size is ${canvasSize.width}x${canvasSize.height}.` }] }],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    })

    const rawJson = response.text || '{}'
    const designData = JSON.parse(rawJson)

    res.json({ design: designData })
  } catch (error: any) {
    console.error('Design Generation Error:', error)
    res.status(500).json({ error: error?.message || 'Failed to generate design layout' })
  }
})

// AI Canvas Vision Critique & Design Doctor
app.post('/api/ai/critique-canvas', async (req, res) => {
  try {
    const { imageBase64, prompt = 'Critique this graphic design and give constructive design feedback' } = req.body
    if (!imageBase64) {
      return res.status(400).json({ error: 'Canvas image data is required' })
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '')

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: 'image/png',
              },
            },
            {
              text: `${prompt}. Provide:
1. Design Score (e.g. 8.5/10) with brief verdict.
2. Strengths (What looks great).
3. Quick Fixes (Contrast, spacing, readability, alignment).
4. Suggested 3-color palette enhancement.`,
            },
          ],
        },
      ],
    })

    const critiqueText = response.text || ''
    const hexMatches = critiqueText.match(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)
    const uniqueColors = hexMatches ? Array.from(new Set(hexMatches)).slice(0, 6) : []

    res.json({
      critique: critiqueText,
      suggestedColors: uniqueColors,
    })
  } catch (error: any) {
    console.error('Critique API Error:', error)
    res.status(500).json({ error: error?.message || 'Failed to critique canvas' })
  }
})

// Vite middleware in dev or static files in production
const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
} else {
  const { createServer: createViteServer } = await import('vite')
  const vite = await createViteServer({
    server: { middlewareMode: true, host: '0.0.0.0', port },
    appType: 'spa',
  })
  app.use(vite.middlewares)
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Corex AI Studio running on http://0.0.0.0:${port}`)
})
