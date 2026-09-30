<div align="center">

# ⚡ COREX STUDIO — AI-POWERED DESIGN SUITE

### Next-Generation Autonomous Vector & Graphic Design Engine

[![LernexAI IP](https://img.shields.io/badge/IP-LernexAI_Proprietary-FF0055?style=for-the-badge&logo=shield)](https://lernexai.com)
[![React 19](https://img.shields.io/badge/React-19.2_Concurrent-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Fabric.js](https://img.shields.io/badge/Engine-Fabric.js_7_ESM-E34F26?style=for-the-badge)](https://fabricjs.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini 3.8 Flash](https://img.shields.io/badge/AI-Gemini_3.8_Flash_Vision-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

<p align="center">
  <strong>A high-throughput, browser-native design studio engineered with sub-millisecond 60FPS vector mechanics, autonomous Gemini 3.8 Flash layout generation, and zero-latency client-side persistence.</strong>
</p>

---

</div>

## 🌐 Overview & Architectural Moat

**Corex Studio** is an ultra-fast, professional-grade vector composition suite built for creators, marketers, and power users. Unlike traditional cloud design suites that bottleneck behind remote servers, Corex runs on a **hybrid client-first architecture**:

1. **Sub-millisecond Canvas Engine**: Pure Fabric.js 7 ESM coordinate transforms, hardware-accelerated filters, and affine matrix calculations running directly in the browser's GPU compositor.
2. **Autonomous AI Design Copilot**: Powered by **Google Gemini 3.8 Flash** via `@google/genai` to generate full canvas layouts, critique design balance with multimodal vision, and synthesize color harmonies.
3. **Zero-Server Local Persistence**: Complete IndexedDB schema orchestration via **Dexie.js**, ensuring 100% data privacy and offline resilience.
4. **Studio-Grade Export Pipelines**: Client-side raster and vector compilers producing up to 3x Ultra-HD PNG/JPEG, lossless SVG, print-ready PDF, and native PowerPoint PPTX slides.

---

## 🏛️ Deep Technical Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             COREX STUDIO RUNTIME                            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│     CLIENT WORKSPACE (SPA)    │             │      BACKEND AI PROXY (TS)    │
│  React 19 + Vite 8 + Zustand  │             │   Express 5 + @google/genai   │
└───────────────┬───────────────┘             └───────────────┬───────────────┘
                │                                             │
    ┌───────────┼───────────┐                                 │
    ▼           ▼           ▼                                 ▼
┌────────┐ ┌────────┐ ┌───────────┐               ┌───────────────────────────┐
│Fabric  │ │Dexie.js│ │Export     │               │  GEMINI 3.8 FLASH ENGINE  │
│Canvas  │ │Indexed │ │Pipelines  │               │ ├─ Text-to-Canvas Engine  │
│Engine  │ │Database│ │jsPDF/PPTX │               │ ├─ Multimodal Vision Doctor│
└────────┘ └────────┘ └───────────┘               │ └─ Design Copilot Stream  │
                                                  └───────────────────────────┘
```

---

## 💎 Core Subsystems & Engineering Breakdown

### 1. 🎨 LernexAI Deep Ink & Cyan/Teal Design System (`src/index.css`)
* **Deep Ink Surface Scale**: Built upon `#08090E` (ink-950), `#0D0F17` (ink-900), `#11141C` (ink-800), and `#1A1E2A` (ink-700) for a rich, low-fatigue creator environment.
* **Electric Cyan & Teal Accents**: Primary interactive highlights powered by `#06B6D4` (Cyan) and `#14B8A6` (Teal), backed by `#10B981` (Emerald), `#F59E0B` (Amber), and `#F43F5E` (Rose).
* **Dual Typography Engine**: **Plus Jakarta Sans** for crisp UI reading and **Playfair Display** (italic serif) for high-end editorial headings.
* **Component Radii & Hover Shadows**: 0.5rem to 1.5rem rounded card systems with `0 6px 16px rgba(6, 182, 212, 0.12)` cyan hover glows.

### 2. 🎨 The Canvas Subsystem & Magnetic Solver (`src/components/canvas/` & `src/lib/snapping.ts`)
* **Stage Matrix Viewport**: Supports dynamic viewport scaling from `0.25x` to `4.0x` with center-locked zoom anchors and focal wheel translation.
* **Magnetic Vector Spatial Solver (`src/lib/snapping.ts`)**: Real-time orthogonal anchor projection (origin, midpoint, terminus) rendering Electric Cyan (`#06B6D4`) laser guide lines with glowing box-shadows.
* **Layer Composite Shaders**: 16 hardware-accelerated canvas blend modes (`multiply`, `screen`, `overlay`, `difference`, `hard-light`, etc.).
* **Live Shader Filter Pipelines**: Convolutions and color transforms for real-time adjustments to brightness, contrast, saturation, and Gaussian blur.

### 3. 🤖 Autonomous Gemini 3.8 & 3.1 Flash AI Engine (`server.ts` & `src/components/ai/`)
* **Text-to-Design Autonomous Layout**: Translates natural language prompts into balanced JSON geometry schemas, injecting coordinated cards, badge accents, background colors, and structured typography hierarchy in under 2 seconds.
* **AI Image Creation & Editing (`gemini-3.1-flash-image-preview`)**: Generates bespoke visual assets or edits active canvas artwork directly from text prompts via `/api/ai/generate-image`.
* **Design Doctor (Multimodal Vision Analysis)**: Rasterizes the active canvas viewport into Base64 PNG payloads and streams it to Gemini Vision for holistic critique on visual weight, contrast ratios, typography balance, and alignment.
* **Design Copilot**: Context-aware design advisor capable of extracting hex color palettes (`#RRGGBB`) and instant 1-click text insertion.

### 4. 🚀 Interactive Landing Page & Demo Auth Flow (`src/components/landing/` & `src/components/auth/`)
* **Editorial Landing Experience (`LandingPage.tsx`)**: Full-viewport scrollable showcase featuring an interactive 3-column live studio preview, 6-card architectural Bento grid, performance benchmark matrix, and keyboard ergonomics guide.
* **Google OAuth Demo & Sign-Up Flow (`AuthModal.tsx`)**: Realistic Google Account chooser (`iamsouravmaurya@gmail.com` / `lernexai.com`) and email sign-up/sign-in flow that transitions directly into the authenticated Studio Dashboard.

### 5. ⚡ Binary Transaction Command Ledger (`src/lib/commandLedger.ts` & `src/store/editorStore.ts`)
* **ZLIB/DEFLATE Binary Compression (`pako`)**: Scene graph transitions are compressed into binary `Uint8Array` frames via `encodeSceneTransaction` and `decodeSceneTransaction`, eliminating plain-text history arrays.
* **GoF Command Pattern (`CanvasCommand` / `MoveElementCommand`)**: Atomic coordinate and state mutations with 64-frame binary undo (`⌘Z`) and redo (`⌘⇧Z`) buffers.

### 6. 🗂️ Figma-Grade Layer & Grouping Hierarchy (`src/components/panels/LayersPanel.tsx`)
* **@dnd-kit Drag-and-Drop Reordering**: Direct z-index manipulation on the scene stack.
* **Layer Property Controls**: 1-click layer duplication, visibility toggle (`eye`), locking toggle (`padlock`), delete, and inline `corexLabel` layer renaming.

### 7. 📦 High-Fidelity Export Compilers (`src/components/export/ExportModal.tsx` & `server.ts`)
* **High-DPI Raster Engine**: Canvas supersampling at `1x`, `2x`, and `3x` resolution multipliers with optional alpha transparency channel.
* **Vector SVG Compiler**: Exports scalable SVG with embedded font references and vector paths.
* **Hybrid PDF Compiler (`/api/v1/secure-compiler/export-pdf` + `jsPDF`)**: Server-verified vector compilation into 96DPI print-ready PDF documents.
* **PptxGenJS Native Slide Builder**: Generates native editable Microsoft PowerPoint (`LERNEX_STAGE`) presentation files.

---

## 📂 Codebase Anatomy & Directory Map

```
.
├── LICENSE                        # LernexAI Proprietary Software License
├── server.ts                      # Express backend proxy with @google/genai & compiler routes
├── vercel.json                    # Edge & production routing configuration
├── public/
│   ├── corex-icon.svg             # Custom Corex Studio by LernexAI vector emblem
│   └── favicon.svg                # Browser tab vector icon
├── src/
│   ├── main.tsx                   # React 19 application root entry
│   ├── App.tsx                    # View router (LandingPage <-> EditorLayout)
│   ├── index.css                  # Deep Ink & Cyan/Teal design token definitions
│   │
│   ├── components/
│   │   ├── landing/               # 🌐 Product Showcase & Entry
│   │   │   └── LandingPage.tsx    # Interactive studio preview, Bento grid & benchmarks
│   │   ├── auth/                  # 🔐 Authentication & Session
│   │   │   └── AuthModal.tsx      # Google Demo Auth chooser & Email Sign Up/Sign In
│   │   ├── ai/                    # 🤖 AI Mode & Gemini Assistant
│   │   │   └── AiChatPanel.tsx    # Copilot, Text-to-Design, Image AI & Vision Doctor
│   │   ├── canvas/                # 🎨 Canvas rendering & interaction
│   │   │   └── CanvasBoard.tsx    # Stage matrix viewport, focal zoom/pan & sync
│   │   ├── toolbar/               # 🛠️ Left tool palette
│   │   │   └── Toolbar.tsx        # Vector tool selection (Select, Shapes, Text, Pen)
│   │   ├── topbar/                # ⚡ Header controls
│   │   │   └── TopBar.tsx         # Brand lockup, inline project title, AI trigger, profile
│   │   ├── panels/                # 🎛️ Right inspector panels
│   │   │   ├── PropertiesPanel.tsx# Fill, stroke, shadows, blend modes, filters
│   │   │   ├── LayersPanel.tsx    # Drag-and-drop layer reordering & duplication
│   │   │   ├── TemplatePanel.tsx  # Multi-layer Corex Studio layout blueprints
│   │   │   ├── StickerPanel.tsx   # Corex Vector Primitives & 8 Glyph Collections
│   │   │   ├── ProjectsPanel.tsx  # IndexedDB saved project vault
│   │   │   └── RightPanel.tsx     # Inspector / Hierarchy / Blueprints / Vectors / Vault
│   │   ├── export/                # ⬇️ File compilers
│   │   │   └── ExportModal.tsx    # PNG, JPEG, SVG, PDF, PPTX export pipeline
│   │   ├── statusbar/             # 📊 Bottom workspace status & zoom
│   │   │   └── StatusBar.tsx      # Live X/Y coordinates, layer count & zoom controls
│   │   └── ui/                    # 🧩 Accessible UI primitives
│   │
│   ├── store/
│   │   └── editorStore.ts         # Zustand global state & Uint8Array binary ledger
│   ├── db/
│   │   └── db.ts                  # CorexDB Dexie.js IndexedDB schema
│   ├── hooks/
│   │   ├── useFabricCanvas.ts     # Corex SceneGraph runtime & viewport hooks
│   │   ├── useKeyboardShortcuts.ts# Global hotkeys listener
│   │   └── useProjects.ts         # Live IndexedDB project queries
│   ├── lib/
│   │   ├── commandLedger.ts       # ZLIB/DEFLATE (pako) Binary Transaction Command Pattern
│   │   ├── appearance.ts          # Polar coordinate gradients, shadows & 16 blend modes
│   │   ├── clipboard.ts           # Object copy/cut/paste & Z-order operations
│   │   ├── export.ts              # High-DPI raster, SVG, PDF & PPTX compilers
│   │   ├── imageFilters.ts        # Live WebGL/Canvas brightness, contrast, blur shaders
│   │   ├── motion.ts              # Kinetic spring physics curves
│   │   ├── shapes.ts              # Corex Vector Node Factory (cx_* UIDs)
│   │   ├── snapping.ts            # Magnetic Vector Spatial Solver (Cyan laser guides)
│   │   └── style.ts               # Object appearance copy/paste engine
│   └── types/
│       └── index.ts               # Strict TypeScript interface declarations
```

---

## ⌨️ Power-User Keyboard Command Matrix

| Shortcut (macOS / Windows) | Action Description |
|---|---|
| `V` | Select & Transform Pointer Tool |
| `R` | Draw Rectangle |
| `C` | Draw Circle / Oval |
| `T` | Insert Editable Rich Text |
| `P` | Freehand Drawing Pencil |
| `Delete` / `Backspace` | Delete Selected Object(s) |
| `Ctrl+D` / `⌘D` | Duplicate Object with offset |
| `Ctrl+C` / `Ctrl+V` | Copy & Paste Elements |
| `Ctrl+Alt+C` / `Ctrl+Alt+V` | Copy Style & Paste Appearance Attributes |
| `Ctrl+A` / `⌘A` | Select All Objects on Canvas |
| `Ctrl+]` / `Ctrl+[` | Bring Forward / Send Backward |
| `Ctrl+Shift+]` / `Ctrl+Shift+[` | Bring to Front / Send to Back |
| `Ctrl+Z` / `⌘Z` | Undo (50-level history) |
| `Ctrl+Shift+Z` / `⌘⇧Z` | Redo |
| `Ctrl+'` / `⌘'` | Toggle Precision Grid Overlay |
| `Arrow Keys` | Nudge 1px precision alignment |
| `Shift + Arrow Keys` | Fast Nudge 10px |
| `Escape` | Clear selection |

---

## 🚀 Installation & Local Development

### Prerequisites
* Node.js `v20+` or `v22+`
* NPM `v10+`

### Setup Instructions

```bash
# 1. Clone the project repository
git clone https://github.com/lernexai/corex-studio.git
cd corex-studio

# 2. Install all dependencies with legacy peer dependency resolution
npm install --legacy-peer-deps

# 3. Configure your environment secrets
cp .env.example .env
# Add your GEMINI_API_KEY in .env

# 4. Start the full-stack development server (Express + Vite)
npm run dev

# 5. Build for production deployment
npm run build
```

---

## 🔒 Intellectual Property & Proprietary Rights

```
═════════════════════════════════════════════════════════════════════════════════
                      LERNEXAI INTELLECTUAL PROPERTY NOTICE
═════════════════════════════════════════════════════════════════════════════════

Copyright (c) 2026 LernexAI. All Rights Reserved.

This software, source code, underlying algorithms, user interface designs, and 
associated documentation are the proprietary and confidential intellectual 
property of LernexAI.

Unauthorized copying, modification, distribution, reverse engineering, sublicensing,
or commercial deployment of this software without explicit written authorization
from LernexAI is strictly prohibited.
═════════════════════════════════════════════════════════════════════════════════
```

<div align="center">
  <br />
  <strong>Engineered with precision by LernexAI</strong>
</div>
