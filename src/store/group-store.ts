import { create } from 'zustand'
import type { StudentGroup } from '@/types'
import { mockGroups } from '@/mock'

interface GroupState {
  groups: StudentGroup[]
  addGroup: (group: StudentGroup) => void
  updateGroup: (id: string, data: Partial<StudentGroup>) => void
  deleteGroup: (id: string) => void
}

export const useGroupStore = create<GroupState>((set) => ({
  groups: mockGroups,

  addGroup: (group) =>
    set((s) => ({ groups: [...s.groups, group] })),

  updateGroup: (id, data) =>
    set((s) => ({
      groups: s.groups.map((g) => (g.id === id ? { ...g, ...data } : g)),
    })),

  deleteGroup: (id) =>
    set((s) => ({ groups: s.groups.filter((g) => g.id !== id) })),
}))
