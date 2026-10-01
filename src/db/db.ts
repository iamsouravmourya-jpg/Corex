/**
 * LernexAI Proprietary — Zero-Dependency Native IndexedDB Storage Engine
 * Replaces external Dexie.js with direct W3C IDBDatabase transactions and
 * reactive EventTarget state synchronization.
 */
import type { Project } from '@/types'

const DB_NAME = 'LernexQuantumVault_v2'
const STORE_NAME = 'studio_projects'
const DB_VERSION = 1

const vaultEvents = new EventTarget()

function openVaultDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const dbInstance = req.result
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        const store = dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('updatedAt', 'updatedAt', { unique: false })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export const db = {
  projects: {
    async toArray(): Promise<Project[]> {
      const idb = await openVaultDatabase()
      return new Promise((resolve, reject) => {
        const tx = idb.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const req = store.getAll()
        req.onsuccess = () => {
          const items = (req.result as Project[]) || []
          items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
          resolve(items)
        }
        req.onerror = () => reject(req.error)
      })
    },
    async put(project: Project): Promise<void> {
      const idb = await openVaultDatabase()
      await new Promise<void>((resolve, reject) => {
        const tx = idb.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const req = store.put(project)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })
      vaultEvents.dispatchEvent(new Event('vault:mutated'))
    },
    async delete(id: string): Promise<void> {
      const idb = await openVaultDatabase()
      await new Promise<void>((resolve, reject) => {
        const tx = idb.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const req = store.delete(id)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })
      vaultEvents.dispatchEvent(new Event('vault:mutated'))
    },
    async get(id: string): Promise<Project | undefined> {
      const idb = await openVaultDatabase()
      return new Promise((resolve, reject) => {
        const tx = idb.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const req = store.get(id)
        req.onsuccess = () => resolve(req.result as Project | undefined)
        req.onerror = () => reject(req.error)
      })
    },
  },
  subscribe(listener: () => void): () => void {
    vaultEvents.addEventListener('vault:mutated', listener)
    return () => vaultEvents.removeEventListener('vault:mutated', listener)
  },
}
