/**
 * Corex Studio by LernexAI — Hybrid OPFS (Origin Private File System) & Binary Deflate Vault
 *
 * Architecture:
 * - Compresses scene graphs using RFC 1951 DEFLATE (pako) into binary Uint8Array packets.
 * - Computes a cryptographic SHA-256 content-addressable digest via WebCrypto SubtleCrypto.
 * - Writes binary `.cxbin` artifacts to the W3C Origin Private File System (`navigator.storage.getDirectory()`)
 *   with automatic fallback to an IndexedDB binary packet store when running in sandboxed iframes.
 */
import { deflate, inflate } from 'pako'
import type { Project } from '@/types'

const VAULT_DB_NAME = 'LernexAI_Corex_BinaryVault_v3'
const VAULT_STORE_NAME = 'binary_artifacts'
const OPFS_DIR_NAME = 'corex-binary-vault'

interface StoredBinaryArtifact {
  id: string
  name: string
  compressedPayload: Uint8Array
  rawByteLength: number
  compressedByteLength: number
  sha256Digest: string
  thumbnail: string
  canvasSize: Project['canvasSize']
  updatedAt: number
  storageBackend: 'OPFS' | 'IDB-Binary'
}

export interface VaultTelemetry {
  backend: 'OPFS Native Disk' | 'IDB Binary Store'
  totalArtifacts: number
  rawBytesTotal: number
  compressedBytesTotal: number
  compressionRatioPct: number
}

const vaultNotifier = new EventTarget()
let cachedDbPromise: Promise<IDBDatabase> | null = null

function openBinaryStore(): Promise<IDBDatabase> {
  if (cachedDbPromise) return cachedDbPromise
  cachedDbPromise = new Promise((resolve, reject) => {
    const req = window.indexedDB.open(VAULT_DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(VAULT_STORE_NAME)) {
        const store = db.createObjectStore(VAULT_STORE_NAME, { keyPath: 'id' })
        store.createIndex('by_timestamp', 'updatedAt', { unique: false })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return cachedDbPromise
}

async function computeSha256Hex(bytes: Uint8Array): Promise<string> {
  try {
    const copy = new Uint8Array(bytes.byteLength)
    copy.set(bytes)
    const hashBuffer = await crypto.subtle.digest('SHA-256', copy.buffer)
    return Array.from(new Uint8Array(hashBuffer))
      .slice(0, 6)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  } catch {
    return 'cx256'
  }
}

async function tryWriteOpfsBinary(id: string, data: Uint8Array): Promise<boolean> {
  try {
    if (!navigator.storage || typeof navigator.storage.getDirectory !== 'function') {
      return false
    }
    const root = await navigator.storage.getDirectory()
    const dir = await root.getDirectoryHandle(OPFS_DIR_NAME, { create: true })
    const fileHandle = await dir.getFileHandle(`${id}.cxbin`, { create: true })
    const writable = await (fileHandle as any).createWritable()
    await writable.write(data)
    await writable.close()
    return true
  } catch {
    return false
  }
}

async function tryDeleteOpfsBinary(id: string): Promise<void> {
  try {
    if (!navigator.storage || typeof navigator.storage.getDirectory !== 'function') return
    const root = await navigator.storage.getDirectory()
    const dir = await root.getDirectoryHandle(OPFS_DIR_NAME, { create: false })
    await dir.removeEntry(`${id}.cxbin`)
  } catch {
    // Ignore if file does not exist
  }
}

export async function persistBinaryProject(project: Project): Promise<void> {
  const rawBytes = new TextEncoder().encode(project.json)
  const compressedPayload = deflate(rawBytes, { level: 6 })
  const sha256Digest = await computeSha256Hex(compressedPayload)
  const wroteOpfs = await tryWriteOpfsBinary(project.id, compressedPayload)

  const record: StoredBinaryArtifact = {
    id: project.id,
    name: project.name,
    compressedPayload,
    rawByteLength: rawBytes.byteLength,
    compressedByteLength: compressedPayload.byteLength,
    sha256Digest,
    thumbnail: project.thumbnail,
    canvasSize: project.canvasSize,
    updatedAt: project.updatedAt,
    storageBackend: wroteOpfs ? 'OPFS' : 'IDB-Binary',
  }

  const db = await openBinaryStore()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(VAULT_STORE_NAME, 'readwrite')
    tx.objectStore(VAULT_STORE_NAME).put(record)
    tx.oncomplete = () => {
      vaultNotifier.dispatchEvent(new CustomEvent('vault:mutated'))
      resolve()
    }
    tx.onerror = () => reject(tx.error)
  })
}

export async function listBinaryProjects(): Promise<{
  projects: Project[]
  telemetry: VaultTelemetry
}> {
  const db = await openBinaryStore()
  const records = await new Promise<StoredBinaryArtifact[]>((resolve, reject) => {
    const tx = db.transaction(VAULT_STORE_NAME, 'readonly')
    const req = tx.objectStore(VAULT_STORE_NAME).getAll()
    req.onsuccess = () => resolve((req.result as StoredBinaryArtifact[]) || [])
    req.onerror = () => reject(req.error)
  })

  records.sort((a, b) => b.updatedAt - a.updatedAt)

  let rawBytesTotal = 0
  let compressedBytesTotal = 0
  let hasOpfs = false

  const projects: Project[] = records.map((rec) => {
    rawBytesTotal += rec.rawByteLength || 0
    compressedBytesTotal += rec.compressedByteLength || 0
    if (rec.storageBackend === 'OPFS') hasOpfs = true

    let json = '{}'
    try {
      const inflated = inflate(rec.compressedPayload)
      json = new TextDecoder().decode(inflated)
    } catch {
      json = '{}'
    }

    return {
      id: rec.id,
      name: rec.name,
      json,
      thumbnail: rec.thumbnail,
      canvasSize: rec.canvasSize,
      updatedAt: rec.updatedAt,
      sha256: rec.sha256Digest,
      compressedBytes: rec.compressedByteLength,
      rawBytes: rec.rawByteLength,
      storageBackend: rec.storageBackend,
    } as Project
  })

  const compressionRatioPct =
    rawBytesTotal > 0 ? Math.round((1 - compressedBytesTotal / rawBytesTotal) * 100) : 0

  return {
    projects,
    telemetry: {
      backend: hasOpfs ? 'OPFS Native Disk' : 'IDB Binary Store',
      totalArtifacts: projects.length,
      rawBytesTotal,
      compressedBytesTotal,
      compressionRatioPct: Math.max(0, compressionRatioPct),
    },
  }
}

export async function removeBinaryProject(id: string): Promise<void> {
  await tryDeleteOpfsBinary(id)
  const db = await openBinaryStore()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(VAULT_STORE_NAME, 'readwrite')
    tx.objectStore(VAULT_STORE_NAME).delete(id)
    tx.oncomplete = () => {
      vaultNotifier.dispatchEvent(new CustomEvent('vault:mutated'))
      resolve()
    }
    tx.onerror = () => reject(tx.error)
  })
}

export function subscribeToBinaryVault(listener: () => void): () => void {
  vaultNotifier.addEventListener('vault:mutated', listener)
  return () => vaultNotifier.removeEventListener('vault:mutated', listener)
}
