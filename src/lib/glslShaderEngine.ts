/**
 * Corex Studio by LernexAI — Hardware WebGL2 GLSL ES 3.00 Fragment Shader Engine
 *
 * Compiles and executes real GPU fragment kernels (`#version 300 es`) via WebGL2:
 * - Preset 1 (`aurora-plasma`): Multi-octave Domain-Warped Fractal Brownian Motion (FBM)
 * - Preset 2 (`synthwave-grid`): Perspective 3D Ray-Projected Horizon Grid & Solar Disk
 * - Preset 3 (`quantum-mesh`): Iridescent Thin-Film Cosine Interference Field
 * - Preset 4 (`constellation`): Procedural Voronoi Cellular Topology & Deep Nebula
 */
import { Canvas as FabricCanvas, FabricImage } from 'fabric'
import { nanoid } from 'nanoid'
import { useEditorStore } from '@/store/editorStore'

export type GlslShaderPreset =
  | 'aurora-plasma'
  | 'synthwave-grid'
  | 'quantum-mesh'
  | 'constellation'

export interface GlslShaderUniforms {
  seed: number
  scale: number
  warp: number
  hueShift: number
}

export const DEFAULT_GLSL_UNIFORMS: GlslShaderUniforms = {
  seed: 2.4,
  scale: 3.2,
  warp: 1.35,
  hueShift: 0.0,
}

const VERTEX_SHADER_300_ES = `#version 300 es
precision highp float;
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_HEADER_300_ES = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_seed;
uniform float u_scale;
uniform float u_warp;
uniform float u_hueShift;

// Hash & 2D Value Noise for GPU FBM
float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    value += amp * noise2D(p);
    p = rot * p * 2.02 + vec2(u_seed * 0.37);
    amp *= 0.5;
  }
  return value;
}

vec3 hueRotate(vec3 col, float shift) {
  const vec3 k = vec3(0.57735, 0.57735, 0.57735);
  float cosAngle = cos(shift * 6.2831853);
  return col * cosAngle + cross(k, col) * sin(shift * 6.2831853) + k * dot(k, col) * (1.0 - cosAngle);
}
`

const FRAGMENT_KERNELS: Record<GlslShaderPreset, string> = {
  'aurora-plasma': `${FRAGMENT_HEADER_300_ES}
void main() {
  vec2 uv = (v_uv - 0.5) * vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0) * u_scale;
  vec2 q = vec2(
    fbm(uv + vec2(0.0, 0.0)),
    fbm(uv + vec2(5.2, 1.3))
  );
  vec2 r = vec2(
    fbm(uv + u_warp * 3.2 * q + vec2(1.7, 9.2) + 0.15 * u_seed),
    fbm(uv + u_warp * 3.2 * q + vec2(8.3, 2.8) + 0.126 * u_seed)
  );
  float f = fbm(uv + u_warp * 3.5 * r);

  vec3 baseDark = vec3(0.027, 0.031, 0.051);
  vec3 cyanGlow = vec3(0.024, 0.714, 0.831);
  vec3 tealGlow = vec3(0.078, 0.722, 0.651);
  vec3 emeraldCore = vec3(0.063, 0.725, 0.506);

  vec3 col = mix(baseDark, cyanGlow, clamp(f * f * 2.4, 0.0, 1.0));
  col = mix(col, tealGlow, clamp(length(q) * 0.85, 0.0, 1.0));
  col = mix(col, emeraldCore, clamp(r.x * r.y * 1.4, 0.0, 1.0));
  col *= (0.45 + 0.95 * f);
  col = hueRotate(col, u_hueShift);
  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`,

  'synthwave-grid': `${FRAGMENT_HEADER_300_ES}
void main() {
  vec2 uv = v_uv;
  vec2 centered = (uv - 0.5) * vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec3 col = mix(vec3(0.03, 0.035, 0.07), vec3(0.16, 0.04, 0.18), smoothstep(0.0, 0.65, 1.0 - uv.y));

  // Procedural Solar Disk with Scanline Cutouts
  vec2 sunPos = centered - vec2(0.0, 0.12);
  float sunDist = length(sunPos);
  if (sunDist < 0.24) {
    float scan = step(0.18, fract(uv.y * 38.0 + u_seed));
    vec3 sunCol = mix(vec3(0.96, 0.25, 0.37), vec3(0.96, 0.62, 0.04), (uv.y - 0.38) * 3.5);
    col = mix(col, sunCol, scan * smoothstep(0.24, 0.228, sunDist));
  }
  // Solar halo
  col += vec3(0.96, 0.25, 0.45) * (0.032 / (sunDist + 0.08)) * u_warp * 0.45;

  // 3D Perspective Ray-Projected Floor Grid
  if (uv.y < 0.48) {
    float horizon = 0.48 - uv.y;
    float z = 0.18 / max(horizon, 0.002);
    float x = centered.x * z * (u_scale * 0.65);
    float gridX = abs(fract(x + u_seed * 0.2) - 0.5);
    float gridZ = abs(fract(z * 1.4 - u_seed) - 0.5);
    float line = min(gridX, gridZ);
    float glow = smoothstep(0.06, 0.004, line) * exp(-horizon * 2.2);
    col = mix(col, vec3(0.024, 0.82, 0.95), glow);
  }

  col = hueRotate(col, u_hueShift);
  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`,

  'quantum-mesh': `${FRAGMENT_HEADER_300_ES}
vec3 iqCosinePalette(float t) {
  vec3 a = vec3(0.06, 0.10, 0.16);
  vec3 b = vec3(0.18, 0.48, 0.56);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.00, 0.33, 0.67);
  return a + b * cos(6.2831853 * (c * t + d + u_hueShift));
}

void main() {
  vec2 uv = (v_uv - 0.5) * vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0) * u_scale;
  vec2 p = uv;
  for (int i = 1; i < 5; i++) {
    float fi = float(i);
    p.x += (0.42 * u_warp / fi) * sin(fi * 2.4 * p.y + u_seed + fi * 1.1);
    p.y += (0.42 * u_warp / fi) * cos(fi * 2.4 * p.x + u_seed + fi * 1.7);
  }
  float wave = 0.5 + 0.5 * sin(p.x * 2.2 + p.y * 2.2);
  float ridge = smoothstep(0.92, 0.995, abs(sin(p.y * 8.0)));
  vec3 col = iqCosinePalette(wave + 0.15 * length(p));
  col += vec3(0.024, 0.85, 0.92) * ridge * 0.45;
  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`,

  constellation: `${FRAGMENT_HEADER_300_ES}
vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

void main() {
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 uv = (v_uv - 0.5) * aspect * (u_scale * 2.2);
  vec2 i_st = floor(uv);
  vec2 f_st = fract(uv);

  float minDist = 1.0;
  float secondDist = 1.0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 pt = hash22(i_st + neighbor);
      pt = 0.5 + 0.42 * sin(u_seed + 6.2831 * pt);
      vec2 diff = neighbor + pt - f_st;
      float d = length(diff);
      if (d < minDist) {
        secondDist = minDist;
        minDist = d;
      } else if (d < secondDist) {
        secondDist = d;
      }
    }
  }

  float edge = secondDist - minDist;
  float nebula = fbm(uv * 0.45 * u_warp);
  vec3 col = vec3(0.025, 0.032, 0.055);
  col += vec3(0.02, 0.32, 0.45) * nebula;
  // Voronoi topological filaments
  col += vec3(0.024, 0.75, 0.88) * smoothstep(0.045, 0.005, edge) * 0.55;
  // Star core nodes
  col += vec3(0.65, 0.96, 1.0) * smoothstep(0.09, 0.01, minDist);

  col = hueRotate(col, u_hueShift);
  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`,
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Unable to allocate WebGL2 shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`GLSL compile error: ${info}`)
  }
  return shader
}

export function renderGlslShaderToDataUrl(
  preset: GlslShaderPreset,
  width: number,
  height: number,
  uniforms: GlslShaderUniforms = DEFAULT_GLSL_UNIFORMS,
): { dataUrl: string; rendererInfo: string } {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(64, Math.min(4096, Math.round(width)))
  canvas.height = Math.max(64, Math.min(4096, Math.round(height)))

  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: true,
    preserveDrawingBuffer: true,
  })

  if (!gl) {
    throw new Error('WebGL2 context unavailable')
  }

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_300_ES)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_KERNELS[preset])

  const program = gl.createProgram()
  if (!program) throw new Error('Failed to create WebGL2 program')
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`WebGL2 link error: ${gl.getProgramInfoLog(program)}`)
  }

  gl.useProgram(program)

  const quadBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  )

  const posLoc = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.height)
  gl.uniform1f(gl.getUniformLocation(program, 'u_seed'), uniforms.seed)
  gl.uniform1f(gl.getUniformLocation(program, 'u_scale'), uniforms.scale)
  gl.uniform1f(gl.getUniformLocation(program, 'u_warp'), uniforms.warp)
  gl.uniform1f(gl.getUniformLocation(program, 'u_hueShift'), uniforms.hueShift)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

  const debugExt = gl.getExtension('WEBGL_debug_renderer_info')
  const rendererInfo = debugExt
    ? String(gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) || 'WebGL2 Hardware GPU')
    : 'WebGL2 GLSL ES 3.00 GPU'

  const dataUrl = canvas.toDataURL('image/png')

  // Clean up GPU resources
  gl.deleteBuffer(quadBuffer)
  gl.deleteProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)

  return { dataUrl, rendererInfo }
}

export async function applyGlslShaderToStage(
  stage: FabricCanvas,
  preset: GlslShaderPreset,
  uniforms: GlslShaderUniforms = DEFAULT_GLSL_UNIFORMS,
): Promise<string> {
  const w = stage.getWidth()
  const h = stage.getHeight()
  const { dataUrl, rendererInfo } = renderGlslShaderToDataUrl(preset, w, h, uniforms)

  // Remove previous shader surface if present so stage stays clean
  const existing = stage
    .getObjects()
    .find((o: any) => typeof o.corexLabel === 'string' && o.corexLabel.startsWith('GLSL Shader'))
  if (existing) {
    stage.remove(existing)
  }

  const img = await FabricImage.fromURL(dataUrl)
  img.set({ left: 0, top: 0, selectable: true })
  ;(img as any).__uid = `cx_glsl_${nanoid(8)}`
  ;(img as any).corexLabel = `GLSL Shader (${preset})`

  stage.add(img)
  stage.sendObjectToBack(img)
  stage.requestRenderAll()
  useEditorStore.getState().snapshot()
  return rendererInfo
}

export function getGlslFragmentKernelSource(preset: GlslShaderPreset = 'aurora-plasma'): string {
  return `// Corex Quantum Studio v3.0 — WebGL2 GLSL ES 3.00 Fragment Kernel (${preset})
// Copyright (c) 2026 LernexAI. Hardware GPU Procedural Shader.
${FRAGMENT_KERNELS[preset]}`
}

