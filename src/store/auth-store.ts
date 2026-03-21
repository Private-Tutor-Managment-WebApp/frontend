import { create } from 'zustand'
import type { User } from '@/types'
import { mockUsers } from '@/mock'

interface AuthState {
  user: User | null
  login: (email: string, password: string) => User | null
  register: (name: string, email: string, password: string, role: User['role']) => User | null
  logout: () => void
  loadSession: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,

  login: (email, password) => {
    const found = mockUsers.find((u) => u.email === email && u.password === password)
    if (found) {
      set({ user: found })
      sessionStorage.setItem('userId', found.id)
      return found
    }
    return null
  },

  register: (name, email, password, role) => {
    const exists = mockUsers.find((u) => u.email === email)
    if (exists) return null

    const newUser: User = {
      id: `${role}-${Date.now()}`,
      name,
      email,
      password,
      role,
    }
    mockUsers.push(newUser)
    set({ user: newUser })
    sessionStorage.setItem('userId', newUser.id)
    return newUser
  },

  logout: () => {
    set({ user: null })
    sessionStorage.removeItem('userId')
  },

  loadSession: () => {
    const userId = sessionStorage.getItem('userId')
    if (userId) {
      const found = mockUsers.find((u) => u.id === userId)
      if (found && found !== get().user) set({ user: found })
    }
  },
}))
