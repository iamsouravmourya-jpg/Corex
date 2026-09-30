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

### 1. 🎨 The Canvas Subsystem (`src/components/canvas/`)
* **Coordinate Space & Matrix Transformation**: Supports dynamic viewport scaling from `0.25x` to `4.0x` with center-locked zoom anchors and coordinate translation matrices.
* **Smart Alignment & Snapping Engine**: Real-time bounding box intersection algorithms calculate nearest center and edge guide thresholds with dynamic red overlay guides.
* **Layer Composite Shaders**: 16 hardware-accelerated canvas blend modes (`multiply`, `screen`, `overlay`, `difference`, `hard-light`, etc.).
* **Live Shader Filter Pipelines**: Convolutions and color transforms for real-time adjustments to brightness, contrast, saturation, and Gaussian blur.

### 2. 🤖 Autonomous Gemini 3.8 Flash AI Engine (`server.ts` & `src/components/ai/`)
* **Text-to-Design Autonomous Layout**: Translates natural language prompts into balanced JSON geometry schemas, injecting coordinated cards, badge accents, background colors, and structured typography hierarchy in under 2 seconds.
* **Design Doctor (Multimodal Vision Analysis)**: Rasterizes the active canvas viewport into Base64 PNG payloads and streams it to Gemini Vision for holistic critique on visual weight, contrast ratios, typography balance, and alignment.
* **Design Copilot**: Context-aware design advisor capable of extracting hex color palettes (`#RRGGBB`) and instant 1-click text insertion.

### 3. ⚡ State Management & History Stack (`src/store/editorStore.ts`)
* **Zustand 5 with `subscribeWithSelector`**: Granular slice subscriptions eliminate unnecessary React component re-renders during 60FPS pointer events.
* **50-Step Delta History Stack**: High-efficiency JSON snapshots with debounced batching for undo (`⌘Z`) and redo (`⌘⇧Z`) states.

### 4. 🗂️ Figma-Grade Layer & Grouping Hierarchy (`src/components/panels/LayersPanel.tsx`)
* **@dnd-kit Drag-and-Drop Reordering**: Direct z-index manipulation on Fabric.js canvas stack.
* **Layer Property Controls**: Visibility toggle (`eye`), locking toggle (`padlock`), duplicate, delete, and inline layer renaming.

### 5. 📦 High-Fidelity Export Compilers (`src/components/export/ExportModal.tsx`)
* **High-DPI Raster Engine**: Canvas supersampling at `1x`, `2x`, and `3x` resolution multipliers with optional alpha transparency channel.
* **Vector SVG Compiler**: Exports scalable SVG with embedded font references and vector paths.
* **jsPDF Engine**: Compiles precise vector coordinates directly into PDF documents for print workflows.
* **PptxGenJS Native Slide Builder**: Generates native editable Microsoft PowerPoint presentation files without server processing.

---

## 📂 Codebase Anatomy & Directory Map

```
.
├── server.ts                      # Express backend proxy with @google/genai routes
├── vercel.json                    # Edge & production routing configuration
├── src/
│   ├── main.tsx                   # React 19 application root entry
│   ├── App.tsx                    # Top-level workspace layout orchestrator
│   ├── index.css                  # Tailwind CSS v4 design token definitions
│   │
│   ├── components/
│   │   ├── ai/                    # 🤖 AI Mode & Gemini Assistant
│   │   │   └── AiChatPanel.tsx    # Text-to-design, Vision critique & Copilot UI
│   │   ├── canvas/                # 🎨 Canvas rendering & interaction
│   │   │   ├── CanvasBoard.tsx    # Fabric.js viewport & coordinate sync
│   │   │   └── SnappingGuides.ts  # Alignment snapping math algorithms
│   │   ├── toolbar/               # 🛠️ Left tool palette
│   │   │   └── Toolbar.tsx        # Vector tool selection (Select, Shapes, Text, Pen)
│   │   ├── topbar/                # ⚡ Header controls
│   │   │   └── TopBar.tsx         # AI Mode trigger, undo/redo, size picker, export
│   │   ├── panels/                # 🎛️ Right inspector panels
│   │   │   ├── PropertiesPanel.tsx# Fill, stroke, shadows, blend modes, filters
│   │   │   ├── LayersPanel.tsx    # Drag-and-drop layer reordering tree
│   │   │   ├── TemplatePanel.tsx  # Ready-to-use marketing & social templates
│   │   │   ├── StickerPanel.tsx   # 310+ offline categorized vector emoji
│   │   │   ├── ProjectsPanel.tsx  # IndexedDB saved project manager
│   │   │   └── RightPanel.tsx     # Tabbed inspector container & AI overlay
│   │   ├── export/                # ⬇️ File compilers
│   │   │   └── ExportModal.tsx    # PNG, JPEG, SVG, PDF, PPTX export pipeline
│   │   ├── statusbar/             # 📊 Bottom workspace status & zoom
│   │   └── ui/                    # 🧩 Accessible Radix UI primitives
│   │
│   ├── store/
│   │   └── editorStore.ts         # Zustand global state & history manager
│   ├── db/
│   │   └── index.ts               # Dexie.js IndexedDB schema & CRUD operations
│   ├── hooks/
│   │   ├── useFabricCanvas.ts     # Fabric.js lifecycle & hook integration
│   │   └── useKeyboardShortcuts.ts# Global hotkeys listener
│   ├── lib/
│   │   ├── shapes.ts              # Shape & text instantiation helpers
│   │   ├── templates.ts           # Pre-built design templates
│   │   ├── motion.ts              # Framer Motion spring physics curves
│   │   └── fonts.ts               # Google Fonts dynamic loader
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
git clone https://github.com/shreyansh001boy-tech/craftora.git
cd craftora

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
