/**
 * LernexAI Proprietary — Reactive Native IndexedDB Vault Hook
 * Zero external dexie-react-hooks dependency.
 */
import { useState, useEffect } from 'react'
import { db } from '@/db/db'
import type { Project } from '@/types'

export function useProjects(): Project[] | undefined {
  const [projects, setProjects] = useState<Project[] | undefined>(undefined)

  useEffect(() => {
    let active = true
    const refresh = () => {
      void db.projects.toArray().then((list) => {
        if (active) setProjects(list)
      })
    }
    refresh()
    const unsubscribe = db.subscribe(refresh)
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return projects
}

export async function saveProject(project: Project) {
  await db.projects.put(project)
}

export async function deleteProject(id: string) {
  await db.projects.delete(id)
}

export async function getProject(id: string) {
  return db.projects.get(id)
}
