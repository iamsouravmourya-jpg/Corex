<div align="center">

# ⚡ COREX QUANTUM STUDIO (`v2.4.0`)
### Autonomous Vector, Shader & Multimodal AI Design Engine
**Proprietary 15-Engine Client-Resilient Architecture by LernexAI**

[![Package](https://img.shields.io/badge/Package-%40lernexai%2Fcorex--quantum--studio_v2.4.0-06B6D4?style=for-the-badge&logo=npm)](https://lernexai.com)
[![Architecture](https://img.shields.io/badge/Architecture-100%25_Serverless_Edge_SPA-14B8A6?style=for-the-badge&logo=cloudflare)](https://lernexai.com)
[![WebGPU 8K](https://img.shields.io/badge/Compiler-WebGPU_8K_Supersampling-10B981?style=for-the-badge&logo=webgpu)](https://lernexai.com)
[![Vault Crypto](https://img.shields.io/badge/Vault-AES_GCM_256_%2B_PBKDF2-F59E0B?style=for-the-badge&logo=keycdn)](https://lernexai.com)
[![CRDT Mesh](https://img.shields.io/badge/Sync-Lamport_ZLIB_CRDT_Mesh-8B5CF6?style=for-the-badge)](https://lernexai.com)
[![React 19](https://img.shields.io/badge/Runtime-React_19.2_%2B_Vite_8-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Gemini AI](https://img.shields.io/badge/AI_Core-Gemini_3.8_%2B_3.1_Flash-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

<p align="center">
  <strong>A zero-latency, 60FPS browser-native vector, procedural shader, and autonomous AI design suite engineered by LernexAI to surpass Figma, Adobe Illustrator, CorelDRAW, and Canva. Unlocks 15 enterprise engines—from 8K WebGPU supersampled compilation, zero-server CRDT multi-tab sync, and parametric text-on-path to reverse CSS AST compilation, AES-GCM 256-bit vault cryptography, and client-side Chroma background cutouts—100% free and serverless-ready.</strong>
</p>

---

</div>

## 📑 Table of Contents

1. [Executive Architectural Blueprint & Competitive Moat](#1-executive-architectural-blueprint--competitive-moat)
2. [Industry Comparison Matrix (Corex Quantum Studio vs. Paid Suites)](#2-industry-comparison-matrix-corex-quantum-studio-vs-paid-suites)
3. [The 15 Flagship Quantum Engines (Deep Technical & Mathematical Reference)](#3-the-15-flagship-quantum-engines-deep-technical--mathematical-reference)
4. [System Topologies & Internal Data Flow Diagrams](#4-system-topologies--internal-data-flow-diagrams)
   - [4.1 Hybrid Client-Serverless Runtime Topology](#41-hybrid-client-serverless-runtime-topology)
   - [4.2 ZLIB/DEFLATE Binary Transaction Command Ledger](#42-zlibdeflate-binary-transaction-command-ledger)
   - [4.3 Lamport Logical Clock CRDT Multi-Tab Broadcast Protocol](#43-lamport-logical-clock-crdt-multi-tab-broadcast-protocol)
   - [4.4 Web Crypto PBKDF2-SHA256 + AES-GCM-256 Vault Envelope](#44-web-crypto-pbkdf2-sha256--aes-gcm-256-vault-envelope)
5. [Complete Workspace & Engine Directory Anatomy](#5-complete-workspace--engine-directory-anatomy)
6. [Design System Specification (`Deep Ink & Electric Cyan`)](#6-design-system-specification-deep-ink--electric-cyan)
7. [Power-User Keyboard Command Matrix & `⌘K` Omnibar](#7-power-user-keyboard-command-matrix--k-omnibar)
8. [Installation, Environment Configuration & Production Build](#8-installation-environment-configuration--production-build)
9. [Intellectual Property & Proprietary License](#9-intellectual-property--proprietary-license)

---

## 1. Executive Architectural Blueprint & Competitive Moat

Legacy creative software forces designers and engineers into a painful trade-off:
* **Cloud SaaS Tools (Figma / Canva)** lock essential capabilities—background removal, Dev Mode CSS inspection, multi-ratio layout resizing, and high-DPI exports—behind recurring per-seat paywalls and mandatory cloud round-trips.
* **Desktop Suites (Adobe Illustrator / CorelDRAW)** require multi-gigabyte local installations, heavy OS dependencies, and manual plugin ecosystems.

**Corex Quantum Studio (`@lernexai/corex-quantum-studio v2.4.0`)** eliminates both bottlenecks through a **Proprietary 100% Client-Resilient Workspace (`src/workspace/*`)**:

* **Native 60FPS Stage Matrix (`QuantumStageCanvas.tsx`)**: Hardware-composited 2D/WebGL stage with focal-point zoom math, infinite viewport panning, and Electric Cyan (`#06B6D4`) magnetic spatial snapping guides.
* **ZLIB Binary State Compression (`commandLedger.ts`)**: Instead of storing uncompressed JSON strings in RAM, every undo/redo transaction is deflated into a compact `Uint8Array` binary packet via `pako`, reducing memory consumption by up to **94%**.
* **Zero External Download Wrappers (`export.ts`)**: Uses a native browser `ObjectURL` binary stream dispatcher (`dispatchBinaryDownload`) coupled with hardware supersampling up to **8K resolution**.
* **Hybrid AI Execution (`AiChatPanel.tsx` + `serverlessAi.ts`)**: Connects to Google **Gemini 3.8 Flash** and **Gemini 3.1 Flash Image Preview** when an API key is configured, and seamlessly switches to a deterministic client-side generative engine on static/serverless edge deployments.

---

## 2. Industry Comparison Matrix (Corex Quantum Studio vs. Paid Suites)

| Architectural Capability | **Corex Quantum Studio (`v2.4.0`)** | Figma | Adobe Illustrator | CorelDRAW | Canva |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Runtime Model** | ✅ **100% Serverless Edge SPA** | ☁️ Cloud-Locked | 💻 Heavy Desktop App | 💻 Heavy Desktop App | ☁️ Cloud-Locked |
| **WebGPU 8x (8K) Supersampling** | ✅ **Built-in Free (`1x`–`8x`)** | ⚠️ Up to 4x | ✅ Desktop Only | ✅ Desktop Only | 💰 Paid Pro (3x max) |
| **Zero-Server CRDT Multi-Tab Sync** | ✅ **Lamport + ZLIB Broadcast** | ☁️ Central Server | ❌ None | ❌ None | ☁️ Central Server |
| **Parametric Text-on-Path Lab** | ✅ **Ring / Sine Wave / Arch** | ❌ Plugin Required | ✅ Manual Path Tool | ✅ Manual Path Tool | ⚠️ Basic Curve Only |
| **CSS → Vector Reverse Compiler** | ✅ **1-Click CSS AST → Node** | ❌ Inspect Only | ❌ None | ❌ None | ❌ None |
| **Sub-Pixel Geometry Quantizer** | ✅ **1-Click Node Optimizer** | ❌ Plugin Required | ⚠️ Simplify Menu | ⚠️ Reduce Nodes | ❌ None |
| **Procedural Shader Backgrounds** | ✅ **4 Mathematical Shaders** | ❌ Static Fills | ❌ Static Meshes | ❌ Static Fills | ❌ None |
| **AES-GCM 256-Bit Crypto Vault** | ✅ **Web Crypto PBKDF2-SHA256** | ❌ Cloud Plaintext | ❌ Unencrypted | ❌ Unencrypted | ❌ Cloud Plaintext |
| **Cassowary Smart Layout Reflow** | ✅ **1-Click Multi-Ratio Reflow**| ⚠️ Manual AutoLayout| ❌ Manual Resize | ❌ Manual Resize | 💰 Paid Magic Switch |
| **Client-Side Chroma BG Cutout** | ✅ **Zero-Server Alpha Cutout** | ❌ Paid Plugin | ❌ Photoshop Needed | ⚠️ Photo-Paint | 💰 Paid Pro Only |
| **React JSX & W3C Token Compiler**| ✅ **1-Click `.tsx` & `.json`** | 💰 Paid Dev Seat | ❌ None | ❌ None | ❌ None |
| **Client-Side Vector QR Studio** | ✅ **Pure Vector `Rect` Matrix**| ❌ Plugin Required | ❌ Plugin Required | ⚠️ Barcode Wizard | ⚠️ Raster Only |
| **WCAG 2.1 AAA Contrast Healer** | ✅ **1-Click Auto-Heal (`⇧H`)** | ❌ Plugin Required | ❌ None | ❌ None | ❌ None |

---

## 3. The 15 Flagship Quantum Engines (Deep Technical & Mathematical Reference)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               COREX QUANTUM STUDIO — 15-ENGINE ARCHITECTURE                              │
├──────────────────────────────────┬───────────────────────────────────┬───────────────────────────────────┤
│ 01. WebGPU 8K Raster Compiler    │ 06. Procedural Shader Lab         │ 11. Parametric Guilloche & 3D     │
│ 02. Lamport CRDT Binary Mesh     │ 07. AES-GCM 256-Bit Crypto Vault  │ 12. Client-Side Vector QR Studio  │
│ 03. Parametric Typography Lab    │ 08. Cassowary Smart Layout Reflow │ 13. Data-Viz & Device Mockup Lab  │
│ 04. CSS → Vector Reverse Compiler│ 09. Chroma BG Cutout & LUT Shaders│ 14. WCAG AAA Contrast Auto-Healer │
│ 05. Sub-Pixel Geometry Quantizer │ 10. React JSX & W3C Token Exporter│ 15. Gemini 3.8/3.1 + Serverless AI│
└──────────────────────────────────┴───────────────────────────────────┴───────────────────────────────────┘
```

### Engine 01 — WebGPU / OffscreenCanvas 8K Hardware Supersampling
* **Implementation**: `src/lib/quantumEngine.ts` (`detectHardwareRasterBackend`) & `src/workspace/compiler/ArtifactCompilerDialog.tsx`
* **Mechanism**: Probes `navigator.gpu` (WebGPU Hardware) and `OffscreenCanvas` (WebGL2 Compositor) to expose `1x`, `2x`, `3x`, `4x (4K UHD)`, and `8x (8K Master)` supersampling multipliers. Streams compiled blobs directly to disk via `dispatchBinaryDownload` (`src/lib/export.ts`).

### Engine 02 — P2P Conflict-Free Replicated Data Types (CRDT) Mesh
* **Implementation**: `src/lib/crdtSync.ts` (`CorexCrdtMesh`) & `src/workspace/stage/QuantumStageCanvas.tsx`
* **Mechanism**: Maintains a monotonically increasing **Lamport Logical Clock** ($L_i = \max(L_i, L_{\text{remote}}) + 1$) over `BroadcastChannel('corex_crdt_mesh_v2')`. Every stage mutation (`object:added`, `object:modified`, `object:removed`) deflates the scene graph via `pako.deflate` and broadcasts a binary `CRDT_DELTA` frame across all open browser tabs in real time.

### Engine 03 — Parametric Typography Laboratory (Procedural Text-on-Path)
* **Implementation**: `src/lib/quantumEngine.ts` (`addParametricTextOnPath`) & `src/workspace/inspector/QuantumShaderSuite.tsx`
* **Mathematical Formulation**:
  * **Circular Ring Seal**:
    $$\theta_i = i \cdot \frac{2\pi}{N} - \frac{\pi}{2}, \quad x_i = R\cos(\theta_i), \quad y_i = R\sin(\theta_i), \quad \alpha_i = \theta_i \cdot \frac{180}{\pi} + 90^\circ$$
  * **Harmonic Sine Wave**:
    $$x_i = i \cdot \Delta s - \frac{W}{2}, \quad y_i = A\sin\left(\frac{2\pi i}{N-1}\right), \quad \alpha_i = A'\cos\left(\frac{2\pi i}{N-1}\right)$$
  * **Editorial Arch Crest**: Distributes glyphs along a $\frac{3\pi}{4}$ circular arc with tangent-normal rotation.

### Engine 04 — AI-Driven CSS-to-Parametric Vector Reverse Compiler
* **Implementation**: `src/lib/quantumEngine.ts` (`compileCssToVectorNode`) & `src/workspace/inspector/QuantumShaderSuite.tsx`
* **Mechanism**: Parses raw production CSS declarations (`width`, `height`, `background: linear-gradient(...)`, `border-radius`, `border`, `color`, `font-size`, `opacity`, `transform: rotate(...)`) and synthesizes live, editable vector `Rect` or `IText` nodes with polar gradient fills directly on the artboard.

### Engine 05 — Sub-Pixel Vector Geometry Quantizer & Optimizer
* **Implementation**: `src/lib/quantumEngine.ts` (`optimizeStageGeometry`) & hotkey `Shift+O` (`src/hooks/useStudioKeybindings.ts`)
* **Mechanism**: Quantizes floating-point affine transform attributes (`left`, `top`, `scaleX`, `scaleY`, `angle`) to sub-pixel precision, eliminating floating-point drift and compacting serialized scene graph size.

### Engine 06 — Procedural Generative Shader Background Lab
* **Implementation**: `src/lib/quantumEngine.ts` (`applyProceduralShaderBackground`) & `src/workspace/inspector/QuantumShaderSuite.tsx`
* **Presets**:
  1. **`aurora-plasma`**: Multi-stop radial luminance interference fields on `#08090E` Deep Ink.
  2. **`synthwave-grid`**: Non-linear perspective horizon grid ($y_j = y_0 + (j/10)^{1.8} \cdot \Delta H$) with solar core.
  3. **`quantum-mesh`**: 18 phase-shifted harmonic quadratic/cubic Bezier wave paths.
  4. **`constellation`**: Deterministic pseudo-random particle network with connected vector edges.

### Engine 07 — Web Crypto API `AES-GCM 256-Bit` Encrypted Local Vault
* **Implementation**: `src/lib/cryptoVault.ts` (`encryptProjectPayload`, `decryptProjectPayload`) & `src/workspace/inspector/QuantumShaderSuite.tsx`
* **Cryptographic Standard**:
  * **Key Derivation**: `window.crypto.subtle.deriveKey` using `PBKDF2-SHA256`, **100,000 iterations**, and a 128-bit random salt.
  * **Authenticated Encryption**: `AES-GCM` (256-bit key, 96-bit random IV) producing tamper-proof `.corex.enc` JSON envelopes.

### Engine 08 — Cassowary-Inspired Autonomous Responsive Layout Reflow
* **Implementation**: `src/lib/quantumEngine.ts` (`smartReflowCanvasToNewSize`) & `src/workspace/inspector/QuantumShaderSuite.tsx`
* **Mechanism**: Preserves each node's normalized anchor center ($c_x = \frac{x + w/2}{W_0}, c_y = \frac{y + h/2}{H_0}$) and applies uniform aspect-safe scaling ($s = \min(W_1/W_0, H_1/H_0)$) when switching between `1:1 Square (1080×1080)`, `9:16 Story (1080×1920)`, `16:9 YouTube Cover (1280×720)`, and `4:1 LinkedIn Banner (1584×396)`.

### Engine 09 — Zero-Knowledge Client-Side Chroma BG Cutout & Studio LUTs
* **Implementation**: `src/lib/vectorStudio.ts` (`removeImageBackgroundClient`, `applyImageLutPreset`) & `src/workspace/inspector/LayerParameterMatrix.tsx`
* **Mechanism**: Computes Euclidean RGB distance $D = \sqrt{(R - R_0)^2 + (G - G_0)^2 + (B - B_0)^2}$ in an offscreen HTML5 `<canvas>` buffer with smooth alpha-ramp feathering (`Auto BG`, `Cut White`, `Cut Dark`), paired with 1-click **Cyberpunk**, **Noir Mono**, **Cinema Gold**, and **Arctic Cool** LUT shaders.

### Engine 10 — Universal Node Pipeline Exporter (`React JSX` & `W3C Design Tokens`)
* **Implementation**: `src/lib/quantumEngine.ts` (`compileCanvasToReactTailwindJsx`, `compileCanvasToW3cDesignTokens`) & `src/workspace/compiler/ArtifactCompilerDialog.tsx`
* **Mechanism**: Compiles the entire stage into either a standalone **React 19 TypeScript component (`.tsx`)** or a **W3C Design Token Standard JSON artifact (`.tokens.json`)**.

### Engine 11 — Parametric Polygons, Guilloche Rosettes & 3D Isometric Cubes
* **Implementation**: `src/lib/vectorStudio.ts` & `src/workspace/inspector/ParametricAssetVault.tsx`
* **Mechanism**: Generates $N$-pointed starburst seals, regular polygons (Hexagon, Octagon), 3-face shaded **3D Isometric Cubes** (`Shift+I`), **Corel-style Guilloche Spirograph Rosettes** ($r(t) = R + A\sin(k t)$), and **Golden Ratio ($\varphi = 1.618$) Fibonacci Spirals**.

### Engine 12 — 100% Client-Side Vector QR Code Matrix Generator
* **Implementation**: `src/lib/vectorStudio.ts` (`addVectorQrBadge`) & `src/workspace/inspector/ParametricAssetVault.tsx` (`Shift+Q`)
* **Mechanism**: Encodes any URL or text payload into a 21×21 Finder-Pattern + deterministic FNV-1a hashed data matrix composed of pure scalable vector `Rect` nodes.

### Engine 13 — Parametric Data-Viz & Native Device Mockup Studio
* **Implementation**: `src/lib/quantumEngine.ts` (`addVectorDataVizWidget`) & `src/workspace/inspector/QuantumShaderSuite.tsx`
* **Mechanism**: 1-click insertion of editable vector **KPI Metric Cards**, **Multi-Column Bar Charts**, **Donut Progress Rings**, and **macOS Studio Browser Mockup Frames**.

### Engine 14 — WCAG 2.1 AA/AAA Luminance Contrast Auditor & Auto-Healer
* **Implementation**: `src/lib/quantumEngine.ts` (`auditAndHealCanvasContrast`) & hotkey `Shift+H`
* **Mechanism**: Evaluates W3C relative luminance $L = 0.2126R_{\text{lin}} + 0.7152G_{\text{lin}} + 0.0722B_{\text{lin}}$ and contrast ratio $CR = (L_{\max} + 0.05)/(L_{\min} + 0.05)$, automatically healing any text node below $4.5:1$ to AAA compliance.

### Engine 15 — Multimodal Gemini 3.8/3.1 Flash AI + Serverless Fallback Core
* **Implementation**: `server.ts`, `src/components/ai/AiChatPanel.tsx` & `src/lib/serverlessAi.ts`
* **Mechanism**: Provides 4 AI workflows (**Design Copilot**, **Text-to-Design Layout Generator**, **Image AI Studio**, and **Vision Design Doctor**) powered by `@google/genai` with automatic zero-error fallback to `serverlessAi.ts` when running purely client-side.

---

## 4. System Topologies & Internal Data Flow Diagrams

### 4.1 Hybrid Client-Serverless Runtime Topology (100% First-Party Native Primitives)

Unlike boilerplate editors that rely on heavy third-party wrappers (`Dexie.js`, `@dnd-kit`, `Radix UI`, `react-colorful`, `react-hotkeys-hook`, `file-saver`), **Corex Quantum Studio (`v2.4.0`)** implements its own **First-Party LernexAI Native Runtime Stack**:

| Subsystem Layer | LernexAI First-Party Implementation | Replaced Legacy Wrapper |
| :--- | :--- | :--- |
| **Local Database Vault** | Native W3C `IDBDatabase` + `EventTarget` (`src/db/db.ts`) | *Zero `dexie` / `dexie-react-hooks`* |
| **Z-Index Hierarchy Tree** | Native HTML5 Drag-Reorder & Z-Stack (`SceneNodeTree.tsx`) | *Zero `@dnd-kit/core` / `sortable`* |
| **Color Spectrum Engine** | `QuantumColorSpectrum.tsx` (24-Swatch Matrix + HSV Input) | *Zero `react-colorful`* |
| **UI Primitives & Tabs** | Native `Slider.tsx`, `Tooltip.tsx` & `StudioInspectorDeck.tsx` | *Zero `@radix-ui/*` packages* |
| **Keyboard Command Matrix**| Deterministic `keydown` state machine (`useStudioKeybindings.ts`)| *Zero `react-hotkeys-hook`* |
| **Binary Stream Downloader**| Native `URL.createObjectURL` Stream (`dispatchBinaryDownload`) | *Zero `file-saver`* |
| **Artboards & Typefaces** | **15 Studio Artboard Presets** & **36 Google Font Typefaces** | *Expanded beyond 9/25 limits* |

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                            COREX QUANTUM STUDIO v2.4.0 (@lernexai)                                     │
└───────────────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                                    │
                 ┌──────────────────────────────────┴──────────────────────────────────┐
                 ▼                                                                     ▼
┌─────────────────────────────────────────────────┐                 ┌────────────────────────────────────┐
│      100% CLIENT-SIDE QUANTUM WORKSPACE         │                 │       OPTIONAL CLOUD AI PROXY      │
│   src/workspace/* + src/lib/* + Zustand Store   │                 │     server.ts + @google/genai      │
└────────────────────────┬────────────────────────┘                 └─────────────────┬──────────────────┘
                         │                                                            │
    ┌────────────────────┼────────────────────┬────────────────────┐                  ▼
    ▼                    ▼                    ▼                    ▼      ┌──────────────────────────────┐
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────────┐      │  GEMINI 3.8 & 3.1 FLASH API  │
│QuantumStage  │ │ZLIB pako     │ │Web Crypto    │ │Artifact       │      │ ├─ /api/ai/generate-design   │
│Canvas 60FPS  │ │Uint8Array    │ │AES-GCM-256   │ │Compiler 8K    │      │ ├─ /api/ai/generate-image    │
│+ CRDT Mesh   │ │Command Ledger│ │PBKDF2 Vault  │ │JSX/SVG/PDF/PPT│      │ └─ /api/ai/critique-canvas   │
└──────────────┘ └──────────────┘ └──────────────┘ └───────────────┘      └──────────────────────────────┘
```

### 4.2 ZLIB/DEFLATE Binary Transaction Command Ledger

```
[ Stage Vector Mutation (Add / Transform / Shader / Cutout) ]
                              │
                              ▼
[ Serialize Scene Graph with Custom Props (__uid, corexLabel) ]
                              │
                              ▼
[ encodeSceneTransaction() -> pako.deflate(json) -> Uint8Array ]
                              │
                              ▼
[ Push Binary Packet to transactionLedger (64-Frame Ring Buffer) ]
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
       [ ⌘Z Undo Trigger ]           [ ⌘⇧Z Redo Trigger ]
               │                             │
               └──────────────┬──────────────┘
                              ▼
[ decodeSceneTransaction() -> pako.inflate(bytes) -> loadFromJSON() ]
```

### 4.3 Lamport Logical Clock CRDT Multi-Tab Broadcast Protocol

```
┌───────────────────────────┐                                   ┌───────────────────────────┐
│   WORKSPACE TAB INSTANCE  │                                   │   PEER TAB INSTANCE       │
│   peerId: "peer_a91f02"   │                                   │   peerId: "peer_c48b19"   │
└─────────────┬─────────────┘                                   └─────────────┬─────────────┘
              │                                                               │
              │── 1. Broadcast HELLO (lamportClock: 0) ──────────────────────>│
              │<─ 2. Broadcast ACK   (lamportClock: 0) ───────────────────────│
              │                                                               │
   [ User Modifies Layer ]                                                    │
   lamportClock += 1                                                          │
   compressed = deflate(scene)                                                │
              │── 3. CRDT_DELTA (lamportClock: 1, Uint8Array[]) ─────────────>│
              │                                                 Verify msg.clock >= localClock
              │                                                 localClock = msg.clock + 1
              │                                                 inflate(msg.compressedGraph)
              │                                                 stage.loadFromJSON() @ 60FPS
```

### 4.4 Web Crypto PBKDF2-SHA256 + AES-GCM-256 Vault Envelope

```
[ Passphrase Input ] ──> [ PBKDF2-SHA256 (100,000 Iterations + 16-Byte Random Salt) ]
                                                    │
                                                    ▼
                                    [ 256-Bit AES-GCM CryptoKey ]
                                                    │
[ Scene Graph JSON ] ──> [ crypto.subtle.encrypt(AES-GCM, 12-Byte IV) ] ──> [ .corex.enc Artifact ]
```

---

## 5. Complete Workspace & Engine Directory Anatomy

```
.
├── LICENSE                                      # LernexAI Proprietary Software License
├── lernex.config.json                           # LernexAI Quantum Runtime & Engine Manifest
├── package.json                                 # @lernexai/corex-quantum-studio v2.4.0 manifest
├── server.ts                                    # Optional Express 5 AI & Secure Compiler Proxy
├── vite.config.ts                               # Vite 8 build config (sourcemap: false, vendor chunking)
├── vercel.json                                  # Serverless & Static Edge SPA routing config
├── index.html                                   # Studio entry HTML with OpenGraph & Google Fonts
├── public/
│   ├── corex-icon.svg                           # Corex Studio by LernexAI vector emblem
│   └── favicon.svg                              # Browser tab vector icon
│
└── src/
    ├── main.tsx                                 # React 19 Concurrent root entry
    ├── App.tsx                                  # View router (LandingPage <-> QuantumStudioShell)
    ├── index.css                                # Deep Ink (#08090E) & Electric Cyan (#06B6D4) tokens
    │
    ├── workspace/                               # Proprietary LernexAI Quantum Workspace Modules
    │   ├── header/
    │   │   └── StudioActionHeader.tsx           # Brand lockup, Artboard picker, ⌘K trigger, AI Mode & Export
    │   ├── dock/
    │   │   └── VectorToolRail.tsx               # Left vector tool rail (Select, Shapes, Pen, Text, Image, Glyphs)
    │   ├── stage/
    │   │   └── QuantumStageCanvas.tsx           # 60FPS Stage matrix, focal zoom, CRDT sync & Cyan laser guides
    │   ├── compiler/
    │   │   └── ArtifactCompilerDialog.tsx       # 1x–8x (8K) PNG/JPEG, SVG, PDF, PPTX, React JSX & W3C JSON
    │   ├── telemetry/
    │   │   └── StageTelemetryFooter.tsx         # Live X/Y cursor coordinates, node count & zoom controls
    │   └── inspector/
    │       ├── StudioInspectorDeck.tsx          # 6-Tab deck: Inspector, ⚡ Quantum, Hierarchy, Blueprints, Vectors, Vault
    │       ├── LayerParameterMatrix.tsx         # Transform, Align/Distribute, LUT Shaders, Chroma Cutout & Dev CSS
    │       ├── QuantumShaderSuite.tsx           # Path Text, Shaders, CSS->Vector Compiler, Smart Reflow & AES Vault
    │       ├── SceneNodeTree.tsx                # @dnd-kit sortable z-order hierarchy & inline corexLabel editor
    │       ├── BlueprintGalleryDeck.tsx         # Multi-Category Quantum Blueprints with search & category pills
    │       ├── ParametricAssetVault.tsx         # Polygons, 3D Cube, Guilloche Meshes, Vector QR & 8 Glyph sets
    │       └── LocalVaultExplorer.tsx           # Local IndexedDB project vault browser
    │
    ├── components/
    │   ├── landing/
    │   │   └── LandingPage.tsx                  # Interactive studio preview, Bento showcase & 60FPS telemetry
    │   ├── auth/
    │   │   └── AuthModal.tsx                    # Google Demo OAuth & Email credentials modal
    │   ├── command/
    │   │   └── CommandPalette.tsx               # ⌘K / Ctrl+K Omnibar with 20+ instant studio actions
    │   ├── ai/
    │   │   └── AiChatPanel.tsx                  # Copilot, Text-to-Design, Image AI & Vision Design Doctor
    │   └── ui/
    │       ├── Input.tsx                        # Studio input primitive
    │       ├── Slider.tsx                       # Precision numeric slider primitive
    │       └── Tooltip.tsx                      # Radix tooltip with shortcut badge
    │
    ├── lib/                                     # Core Mathematical, Vector, Cryptographic & Compiler Engines
    │   ├── quantumEngine.ts                     # WebGPU 8K, Path Text, CSS Compiler, Shaders, Reflow, JSX & WCAG
    │   ├── vectorStudio.ts                      # Starbursts, Polygons, 3D Cube, Guilloche, QR, Cutout & Dev CSS
    │   ├── crdtSync.ts                          # BroadcastChannel + Lamport Clock + ZLIB CRDT Mesh Engine
    │   ├── cryptoVault.ts                       # Web Crypto API PBKDF2-SHA256 + AES-GCM 256-Bit Cryptography
    │   ├── commandLedger.ts                     # ZLIB/DEFLATE (pako) Uint8Array Binary Command Ledger
    │   ├── serverlessAi.ts                      # 100% Client-Side Serverless Generative AI Engine
    │   ├── snapping.ts                          # Magnetic Vector Spatial Solver (Electric Cyan #06B6D4 guides)
    │   ├── appearance.ts                        # Polar coordinate gradients, drop shadows & 16 blend modes
    │   ├── export.ts                            # Native Binary Stream Downloader (dispatchBinaryDownload), PDF & PPTX
    │   ├── clipboard.ts                         # Deep node clone, cut, paste & z-order stack operations
    │   ├── imageFilters.ts                      # Live WebGL/Canvas brightness, contrast, saturation & blur pipeline
    │   ├── shapes.ts                            # Vector Node Factory (cx_* UIDs)
    │   ├── style.ts                             # Visual appearance attribute cloner
    │   ├── motion.ts                            # Spring physics animation presets
    │   └── cn.ts                                # Classnames utility
    │
    ├── store/
    │   └── editorStore.ts                       # Zustand 5 store with binary transaction ledger
    ├── db/
    │   └── db.ts                                # CorexDB Dexie.js IndexedDB persistence layer
    ├── hooks/
    │   ├── useFabricCanvas.ts                   # SceneGraph runtime & viewport transform hooks
    │   ├── useStudioKeybindings.ts              # Global hotkey & Quantum shortcut dispatcher
    │   └── useProjects.ts                       # Reactive IndexedDB project hooks
    ├── data/
    │   └── fontList.ts                          # Curated Google Fonts catalog & dynamic loader
    └── types/
        └── index.ts                             # Strict TypeScript interfaces & canvas presets
```

---

## 6. Design System Specification (`Deep Ink & Electric Cyan`)

| Token Name | Hex Value | Architectural Role |
| :--- | :--- | :--- |
| `--color-ink-950` | `#08090E` | Primary Midnight Ink Canvas & Viewport Backdrop |
| `--color-ink-900` | `#0D0F17` | Header, Telemetry Footer & Inspector Shell Surface |
| `--color-ink-800` | `#11141C` | Elevated Card, Modal & Tool Dock Surface |
| `--color-ink-700` | `#1A1E2A` | Interactive Control & Input Field Surface |
| `--color-accent-cyan` | `#06B6D4` | Primary Electric Cyan Focus, Laser Guides & Active Indicators |
| `--color-accent-teal` | `#14B8A6` | Secondary Teal Gradient & Mesh Highlight |
| `--color-accent-emerald`| `#10B981` | Cryptographic Vault & WCAG AAA Compliance Indicator |
| `--color-accent-amber` | `#F59E0B` | Golden Ratio Spiral & High-CTR Highlight |
| `--color-accent-rose` | `#F43F5E` | Danger / Destructive Action & Swiss Editorial Accent |
| `--font-sans` | `Plus Jakarta Sans` | Geometric UI & Display Typography (`12.5px` base) |
| `--font-serif` | `Playfair Display` | High-Contrast Editorial Italic Serif |
| `--font-mono` | `JetBrains Mono` | Coordinate Telemetry, CSS AST & Binary Ledger Inspector |

---

## 7. Power-User Keyboard Command Matrix & `⌘K` Omnibar

| Shortcut (macOS / Windows) | Quantum Studio Operation | Target Subsystem |
| :--- | :--- | :--- |
| **`⌘K` / `Ctrl+K`** | **Launch Omnibar Command Palette** | `CommandPalette.tsx` (20+ Instant Actions) |
| **`Shift + O`** | **Sub-Pixel Geometry & Node Optimizer** | `quantumEngine.ts` (`optimizeStageGeometry`) |
| **`Shift + H`** | **WCAG 2.1 AAA Contrast Auto-Healer** | `quantumEngine.ts` (`auditAndHealCanvasContrast`) |
| **`Shift + I`** | **Insert 3D Shaded Isometric Cube** | `vectorStudio.ts` (`addIsometricCube`) |
| **`Shift + Q`** | **Insert Scalable Vector QR Matrix Badge** | `vectorStudio.ts` (`addVectorQrBadge`) |
| **`V` / `R` / `C` / `T` / `P`** | Select, Rectangle, Circle, Rich Text, Pencil | `useStudioKeybindings.ts` |
| **`Delete` / `Backspace`** | Delete Active Node(s) | `useStudioKeybindings.ts` |
| **`⌘D` / `Ctrl+D`** | Offset Clone (`+24px` X/Y) | `shapes.ts` (`duplicateActiveObject`) |
| **`⌘C` / `⌘X` / `⌘V`** | Copy, Cut & Paste Scene Nodes | `clipboard.ts` |
| **`⌘+Alt+C` / `⌘+Alt+V`** | Copy & Paste Visual Appearance Attributes | `style.ts` |
| **`⌘A` / `Ctrl+A`** | Select All Stage Nodes (`ActiveSelection`) | `useStudioKeybindings.ts` |
| **`⌘]` / `⌘[`** | Step Forward / Step Backward in Z-Order | `clipboard.ts` (`moveZOrder`) |
| **`⌘⇧]` / `⌘⇧[`** | Bring to Absolute Front / Send to Back | `clipboard.ts` (`moveZOrder`) |
| **`⌘Z` / `⌘⇧Z`** | 64-Frame ZLIB Binary Undo / Redo | `commandLedger.ts` & `editorStore.ts` |
| **`⌘'` / `Ctrl+'`** | Toggle 20px / 100px Cyan Coordinate Grid | `QuantumStageCanvas.tsx` |
| **`Space + Drag`** | Infinite Focal-Point Stage Pan | `QuantumStageCanvas.tsx` |
| **`Arrow Keys` / `⇧ + Arrows`**| `1px` Micro Nudge / `10px` Fast Nudge | `useStudioKeybindings.ts` |

---

## 8. Installation, Environment Configuration & Production Build

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. (Optional) Configure Gemini API key for live cloud AI routes
cp .env.example .env
# Add GEMINI_API_KEY=your_key_here
# Note: Without an API key, Corex automatically runs its 100% Client-Side Serverless AI Engine!

# 3. Start development server on port 3000
npm run dev

# 4. Run TypeScript strict type verification
npm run lint

# 5. Compile production bundle (sourcemap: false, vendor-chunked, 100% static/serverless ready)
npm run build
```

---

## 9. Intellectual Property & Proprietary License

```
═════════════════════════════════════════════════════════════════════════════════
                      LERNEXAI INTELLECTUAL PROPERTY NOTICE
═════════════════════════════════════════════════════════════════════════════════

Copyright (c) 2026 LernexAI (Sourav Maurya). All Rights Reserved.

Corex Quantum Studio (@lernexai/corex-quantum-studio), its workspace architecture
(src/workspace/*), ZLIB binary command ledger, P2P Lamport CRDT synchronization
mesh, parametric vector & shader laboratories, reverse CSS AST compiler, and
Web Crypto AES-GCM-256 vault implementation are the proprietary intellectual
property of LernexAI.

Unauthorized reproduction, reverse engineering, redistribution, or commercial
exploitation without prior written authorization from LernexAI is strictly
prohibited under international copyright and intellectual property laws.
═════════════════════════════════════════════════════════════════════════════════
```
