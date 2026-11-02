<div align="center">

```
   ██████╗ ██████╗ ██████╗ ███████╗██╗  ██╗     ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗
  ██╔════╝██╔═══██╗██╔══██╗██╔════╝╚██╗██╔╝     ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
  ██║     ██║   ██║██████╔╝█████╗   ╚███╔╝      ███████╗   ██║   ██║   ██║██║  ██║██║   ██║
  ██║     ██║   ██║██╔══██╗██╔══╝   ██╔██╗      ╚════██║   ██║   ██║   ██║██║  ██║██║   ██║
  ╚██████╗╚██████╔╝██║  ██║███████╗██╔╝ ██╗     ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
   ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝     ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
```

# Corex Studio

**Describe a design in one sentence. Corex builds it as editable layers — not a flat screenshot.**

React 19 · Vite 8 · Fabric.js 7 · Zustand 5 · TypeScript 6 (strict) · Express 5 · Tailwind 4

</div>

---

## The one idea

Every AI image generator gives you a PNG. You can look at it, you cannot edit it. Corex inverts that: the model authors a **scene spec** (a structured JSON description of a design), and Corex compiles that spec into individually selectable Fabric objects — headline text, kicker pill, accent geometry, background gradient, image slot. Every part is real, named, and editable.

The second half is the inverse: the same scene graph is a **code emitter**. One document exports as PNG/JPEG/WebP, SVG, PDF, PPTX — or as React JSX, standalone HTML, CSS, W3C design tokens and GLSL.

```
 brief  ──►  Gemini scene spec  ──►  normalize  ──►  compile to plan  ──►  bot paints
 "neon        { layers: [            clamped boxes     BotRenderTask[]       18 named,
  podcast     text, shapes,           valid hex        ordered by group      unlocked layers
  cover"      image, background] }    unique z                               on the stage
```

Without a Gemini key the same spec shape comes from a deterministic local composer, so the studio still works offline — with less inventive layouts.

Source: [`sceneSpec.ts`](src/lib/ai/sceneSpec.ts) · [`sceneDirector.ts`](src/lib/ai/sceneDirector.ts) · [`sceneCompiler.ts`](src/lib/ai/sceneCompiler.ts) · [`CorexBotSequencer.tsx`](src/workspace/bot/CorexBotSequencer.tsx)

---

## Status legend

This project is under active construction. Every feature below carries one of three labels, and the label is the honest one:

| Label | Meaning |
| :--- | :--- |
| **Verified** | Typechecks, ships in the production build, and was exercised in a real browser (headless Chrome over CDP) with DOM/pixel evidence. |
| **Built** | Code is complete and typechecked, but has not had a browser pass yet. |
| **In build** | An agent is writing it right now. It may not compile. Do not judge it yet. |

---

## What is in the box

### Editing core

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Layers | **Verified** | Named Fabric objects (`corexLabel` + `__uid`), inline rename, visibility, lock, z-order stack, multi-select via `⌘A`. |
| Undo / redo | **Verified** | DEFLATE-compressed `Uint8Array` ledger; a bot run commits as a single undo frame. |
| Themes | **Verified** | Aurora token set (`--cx-*`) with day/night toggle, persisted in `localStorage`, pre-paint bootstrap so there is no flash — and an external `theme-boot.js` so production CSP (`script-src 'self'`) does not block it. |
| Geometry & appearance | **Verified** | X/Y/W/H/rotation, solid/linear/radial fill, opacity, stroke, corner radius, align/distribute actions. |
| Copy / cut / paste / duplicate | **Built** | `⌘C ⌘X ⌘V ⌘D`, style sampler with `Alt+S` / `Alt+P`. |
| Arrow-key nudge | **Verified** | 1px, or 10px with `Shift`. |

### Vector tools

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Pen tool** | **Verified** | Click = corner, drag = smooth handle, `Alt`-drag breaks the mirror, `Shift` constrains to 45°, click the first anchor to close, `Enter` commits. |
| **Node editor** | **Verified** | Drag anchors, drag/detach handles, click a segment to split it with de Casteljau. Geometry is re-pinned so the grabbed node follows the cursor exactly under an affine transform. |
| **Path operations** | **Verified** | Unite / Minus Back / Intersect / Exclude (real boolean geometry), Outline Stroke, Simplify (RDP), Reverse, Join, Cut Node, Segment→Curve, Normalize. Browser-proven: 6 selected shapes → 1 `Union of …` layer. Curve sources are flattened, so booleans on curves return polygon approximations — the panel says so. |
| Path booleans on arbitrary Fabric nodes | **Verified** | Polygons, groups, strokes and images are flattened to scene-space contours (`polygonBoolean.ts`), then re-emitted as `Path`. |
| Vector lab | **Verified** | Superformula, Lissajous, guilloche, isometric cube, QR badges, background cutout, LUT colour grading. |

### Layout & systems

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Auto-layout** | **Built** | Row/column stacks with gap, padding, primary/counter alignment, 6 presets, plus per-object pin constraints that survive parent resize. |
| **Components / instances** | **Built** | Turn a selection into a component, place instances from the local library, override slots per instance, push master edits to all instances, detach. Slot identity survives undo. |
| **Design styles** | **Verified** | Extract colour/type/effect styles from the canvas, link layers, apply, detach. Browser-proven: *"Extracted 1 new style · linked 4 layers."* |
| **Smart guides** | **Built** | Edge/center magnets, equal-spacing detection, grid fallback, distance pills. Painted on a separate scene-unit overlay so it coexists with the legacy cyan aligner. |
| **Rich text** | **Built** | Per-range styling inside one text object (weight, size, colour, background, underline/strike), letter-spacing, line-height, case transforms, 6 type pairs, fit-to-box binary search. |
| **Prototype player** | **Built** | Link screens into flows, preview as a click-through with transitions in a device frame. Runs locally, no server. |
| **Frames / artboards** | **In build** | Nested frame containers with clipping and frame-scoped coordinates. |
| **Effects stack** | **In build** | Ordered, toggleable, non-destructive effects (shadow / blur / …) layered on any object. |
| **Comments + presence** | **In build** | Pinned threads and live cursors over the existing `BroadcastChannel` transport. Identity is a neutral demo persona — no real names, e-mails or phone numbers. |

### AI

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Brief → layered design | **Verified** | End point wired to Gemini; verified offline through the local composer (18 named layers from one brief). Not yet exercised with a live API key from this repo. |
| AI chat / critique / image generation | **Built** | `/api/ai/chat`, `/api/ai/critique-canvas`, `/api/ai/generate-image`, all keyed off the server, never the client. |
| Layout & palette taste | **In build** | Spacing scales, type ramps, hierarchy scoring and composition presets applied to the scene spec before compile. |
| Offline fallback | **Verified** | No key → `{ degraded: true, reason: "not_configured" }` → deterministic local composer. |

### Export

| Target | Status | Notes |
| :--- | :--- | :--- |
| PNG / JPEG / WebP | **Built** | Real raster pipeline with scale multiplier, quality and alpha control. **No AVIF** — no browser ships an AVIF encoder from a canvas, and claiming otherwise was a lie we removed. |
| SVG | **Built** | Real vector serialisation of the scene graph. |
| PDF / PPTX | **Built** | `jsPDF` / `pptxgenjs` document packing with embedded fonts and laid-out text. |
| React JSX / HTML / CSS / W3C tokens / GLSL | **Built** | Generated from the same scene graph in the compiler dialog. |

### Platform

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Local vault | **Built** | OPFS `.cxbin` files, DEFLATE + SHA-256 digests. |
| Encryption at rest | **Built** | WebCrypto PBKDF2-SHA256 → AES-GCM-256. |
| Multi-tab sync | **Partial** | `BroadcastChannel` + Lamport ordering. Last-writer-wins mesh, **not** a per-field CRDT merge. |
| WebGL2 shaders | **Built** | `#version 300 es` fragment kernels rendered offscreen into Fabric images; 4 presets. |
| GPU detection | **Honest, limited** | WebGPU is probed with `requestAdapter()` and only labelled "WebGPU Hardware" when an adapter truly exists. Rendering itself is OffscreenCanvas supersampling (1×–8×), not a WebGPU compute pipeline. |

---

## What this is **not**

Read this before comparing it to Figma or Illustrator.

- **Not a replacement for Figma.** Auto-layout, components, frames, styles and prototyping exist or are landing, but there is no cloud document backend, no plugin ecosystem, and no multiplayer server — presence is per-browser-tab over `BroadcastChannel`.
- **Not Illustrator.** The pen tool, node editing and path booleans are real; artboards-on-artboards, print colour management, meshes and the long tail of vector micro-features are not.
- **Not Canva.** No template marketplace, no stock library, no brand-kit enforcement.
- **Not production-hardened.** There is no automated test suite and no CI. Verification is manual and scripted: `tsc`, production build, production boot, and headless-Chrome scripts against the built app.
- **Not benchmarked against a live model.** The AI path is structurally verified, not quality-verified. A full mock-test pass with real API keys is a planned phase.

What it does have that those tools mostly do not: a natural-language brief that resolves into a fully editable layered document in one step, and code export from that same scene graph.

---

## Getting started

```bash
npm install
cp .env.example .env        # optional — add GEMINI_API_KEY for the AI path
npm run dev                 # http://localhost:3000
```

| Script | What it does |
| :--- | :--- |
| `npm run dev` | Express 5 + Vite middleware on `PORT` (default 3000) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | `tsc -b` then `vite build` |
| `npm run start:prod` | Serve `dist/` with `NODE_ENV=production` |

Environment (all optional — nothing here needs a secret to boot):

| Variable | Purpose |
| :--- | :--- |
| `GEMINI_API_KEY` / `GOOGLE_API_KEY` | Enables the AI path |
| `GEMINI_MODEL` | Chat/vision model, default `gemini-2.5-flash` |
| `GEMINI_IMAGE_MODEL` | Image model, default `gemini-2.5-flash-image` |
| `PORT` | Server port, default `3000` |
| `APP_ORIGIN` | Added to the production CSP `connect-src` |
| `ALLOWED_HOSTS` | Extra Vite dev hosts (comma-separated) |

Server routes: `/api/health`, `/api/ai/chat`, `/api/ai/generate-design`, `/api/ai/critique-canvas`, `/api/ai/generate-image`. AI routes are rate-limited and never echo stack traces.

---

## Keyboard map

**Tools**

| Keys | Action |
| :--- | :--- |
| `V` | Select |
| `R` | Insert rectangle |
| `O` | Insert ellipse |
| `L` | Insert line |
| `P` | Pen tool |
| `B` | Brush / pencil |
| `T` | Insert text |
| `F` | Toggle the Elements / Blueprints rail pod |

**Pen tool**

| Keys | Action |
| :--- | :--- |
| Click / drag | Corner point / smooth point |
| `Alt` + drag | Break the handle mirror |
| `Shift` | Constrain to 45° |
| Click first anchor | Close the path |
| `Enter` | Commit the path |
| `Backspace` | Drop the last node |
| `Esc` | Leave the tool |

While the pen is active it owns `Enter` / `Esc` / `Backspace` / `Delete`, so global bindings step aside.

**Editing**

| Keys | Action |
| :--- | :--- |
| `⌘K` / `Ctrl+K` | Command palette |
| `⌘Z` / `⌘⇧Z` / `⌘Y` | Undo / redo |
| `⌘C` `⌘X` `⌘V` | Copy / cut / paste |
| `⌘D` | Duplicate (+24px offset) |
| `⌘A` | Select all |
| `⌘]` / `⌘[` | Bring forward / send backward (`Shift` = front / back) |
| `Alt+S` / `Alt+P` | Sample / apply style |
| `Delete` / `Backspace` | Delete selection |
| `Esc` | Deselect |
| Arrow keys | Nudge 1px (`Shift` = 10px) |

**Path operations** (mirrors the Path ops panel)

| Keys | Action |
| :--- | :--- |
| `Alt+Shift+U` | Unite |
| `Alt+Shift+M` | Minus Back |
| `Alt+Shift+I` | Intersect |
| `Alt+Shift+X` | Exclude |
| `Alt+Shift+Y` | Simplify |
| `Alt+Shift+R` | Reverse |
| `Alt+Shift+J` | Join |
| `Alt+Shift+O` | Outline stroke |
| `Alt+Shift+K` | Cut node |
| `Alt+Shift+C` | Segment → curve |
| `Alt+Shift+N` | Normalize |

These use `Alt+Shift` on purpose: the `Ctrl+Shift` variants (`I`, `J`, `O`, `R`, `C`) are browser/DevTools shortcuts and would never reach the page.

**View & stage**

| Keys | Action |
| :--- | :--- |
| `+` / `−` / `0` | Zoom in / out / reset |
| `Space` + drag | Pan |
| `Shift+G` | Toggle grid |
| `Shift+O` | Optimize geometry |
| `Shift+H` | Audit and heal contrast |
| `Shift+M` | Compile aurora-plasma shader |
| `Shift+I` | Insert isometric cube |
| `Shift+Q` | Insert QR badge |

---

## Project map

```
index.html                    landing shell + theme bootstrap
public/theme-boot.js          pre-paint theme (external, CSP-safe)
server.ts                     Express 5: Vite middleware in dev, Gemini routes, CSP, rate limits
corex.config.json             engine manifest

src/
├── App.tsx                   landing ↔ studio router, stage empty state
├── main.tsx                  React root
├── index.css                 Aurora tokens for both themes
│
├── lib/
│   ├── ai/                   sceneSpec, sceneDirector, sceneCompiler, aiClient, brief,
│   │                         textLayout, audit, layoutTaste, paletteTaste, localCopilot
│   ├── export/               index, raster, svg, pdf, pptx, filename, download, base64
│   ├── vector/               penTool (pure pen math), nodeEditor (Fabric bridge),
│   │                         pathGeometry, pathOps, polygonBoolean, superformula,
│   │                         colorGrading, assetInsert
│   ├── layout/               autoLayout, constraints
│   ├── components/           componentModel, componentRegistry, useComponentSync
│   ├── text/                 richText (range engine), textStyles
│   ├── styles/               designStyles, useStyleLinks
│   ├── snapping/             smartGuides (pure), plus legacy snapping.ts
│   ├── frames/               frameModel, frameOps
│   ├── effects/              effectModel, effectRenderer
│   ├── proto/                protoModel, protoRuntime
│   ├── collab/               commentsStore, commentsUI, presence
│   ├── qr/                   qrEncoder
│   ├── agenticPlanner.ts     plan ↔ BotRenderTask[] contract
│   ├── quantumEngine.ts      codegen, booleans, reflow, contrast, GPU probe
│   ├── glslShaderEngine.ts   WebGL2 fragment kernels
│   ├── storageEngine.ts      OPFS .cxbin vault
│   ├── cryptoVault.ts        PBKDF2 + AES-GCM
│   ├── crdtSync.ts           BroadcastChannel + Lamport mesh
│   └── clipboard.ts / style.ts / shapes.ts / appearance.ts / motion.ts / fabricDefaults.ts
│
├── workspace/
│   ├── header/               top bar, search, export entry, theme toggle
│   ├── dock/                 tool rail + floating pods
│   ├── stage/                QuantumStageCanvas (Fabric host), guides/ overlays
│   ├── pen/                  usePenTool, PenToolOverlay, PenOptionsBar
│   ├── inspector/            inspector deck + Design/Effects/Assets/AI panels
│   ├── proto/                InteractionPanel, PreviewPlayer
│   ├── collab/               CommentsLayer, CommentsPanel, PresenceCursors
│   ├── bot/                  CorexBotSequencer (paints the plan)
│   ├── compiler/             ArtifactCompilerDialog (JSX/HTML/CSS/tokens/GLSL)
│   └── telemetry/            stage status bar
│
├── components/
│   ├── ai/                   AiChatPanel, PlanEditor, RunMonitor, BotTab
│   ├── command/              CommandPalette
│   ├── landing/              LandingPage
│   └── ui/                   Input, Slider, Tooltip, ThemeToggle, color spectrum
│
├── hooks/                    useFabricCanvas, useStudioKeybindings, useProjects
├── data/                     asset vault, font list
├── store/editorStore.ts      Zustand: scene, ledger, theme, tools, panels, bot, projects
└── types/index.ts            Tool, LayerItem, CanvasSize, Project
```

Rendering note: the stage scales with a CSS transform on a wrapper, **not** with Fabric's `viewportTransform`. Anything overlaid on the canvas must therefore be sized in scene units and divide its stroke widths by the display scale.

---

## How this was verified

All of it by hand, in this order:

1. `npx tsc --noEmit` — zero errors.
2. `npm run build` — production bundle.
3. Boot `npm run start:prod`, hit `/api/health`.
4. Drive the built app in headless Chrome over the DevTools Protocol: click through the UI, dispatch real mouse/keyboard events, screenshot, and assert on DOM text, layer counts and pixels.

Not verified, openly: model output quality, multi-machine collaboration, and every panel that is currently labelled *Built* or *In build*.

---

## License

Proprietary. See [LICENSE](LICENSE). Copyright (c) 2026 Sourav Maurya.
