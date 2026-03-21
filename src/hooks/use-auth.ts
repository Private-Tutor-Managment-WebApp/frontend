import { useAuthStore } from '@/store/auth-store'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)
  const register = useAuthStore((s) => s.register)
  const logout = useAuthStore((s) => s.logout)
  const loadSession = useAuthStore((s) => s.loadSession)
  return { user, login, register, logout, loadSession }
}
