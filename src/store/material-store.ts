import { create } from 'zustand'
import type { Material } from '@/types'
import { mockMaterials } from '@/mock'

interface MaterialState {
  materials: Material[]
  addMaterial: (mat: Material) => void
  updateMaterial: (id: string, data: Partial<Material>) => void
  deleteMaterial: (id: string) => void
}

export const useMaterialStore = create<MaterialState>((set) => ({
  materials: mockMaterials,

  addMaterial: (mat) =>
    set((s) => ({ materials: [...s.materials, mat] })),

  updateMaterial: (id, data) =>
    set((s) => ({
      materials: s.materials.map((m) => (m.id === id ? { ...m, ...data } : m)),
    })),

  deleteMaterial: (id) =>
    set((s) => ({ materials: s.materials.filter((m) => m.id !== id) })),
}))
