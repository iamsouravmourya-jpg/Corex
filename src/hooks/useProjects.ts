/**
 * Corex Studio by LernexAI — Reactive Binary Vault Hook (OPFS + DEFLATE)
 */
import { useState, useEffect } from 'react'
import {
  listBinaryProjects,
  persistBinaryProject,
  removeBinaryProject,
  subscribeToBinaryVault,
  type VaultTelemetry,
} from '@/lib/storageEngine'
import type { Project } from '@/types'

export function useProjects(): Project[] | undefined {
  const [projects, setProjects] = useState<Project[] | undefined>(undefined)

  useEffect(() => {
    let mounted = true
    const sync = () => {
      listBinaryProjects()
        .then(({ projects: list }) => {
          if (mounted) setProjects(list)
        })
        .catch(() => {
          if (mounted) setProjects([])
        })
    }
    sync()
    const unsubscribe = subscribeToBinaryVault(sync)
    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  return projects
}

export function useVaultTelemetry(): VaultTelemetry | null {
  const [telemetry, setTelemetry] = useState<VaultTelemetry | null>(null)

  useEffect(() => {
    let mounted = true
    const sync = () => {
      listBinaryProjects()
        .then(({ telemetry: t }) => {
          if (mounted) setTelemetry(t)
        })
        .catch(() => {})
    }
    sync()
    const unsubscribe = subscribeToBinaryVault(sync)
    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  return telemetry
}

export async function saveProject(project: Project): Promise<void> {
  await persistBinaryProject(project)
}

export async function deleteProject(id: string): Promise<void> {
  await removeBinaryProject(id)
}
