import Dexie, { type Table } from 'dexie'
import type { Project } from '@/types'

class CorexDB extends Dexie {
  projects!: Table<Project>

  constructor() {
    super('CorexDB')
    this.version(1).stores({
      projects: 'id, name, updatedAt',
    })
  }
}

export const db = new CorexDB()
