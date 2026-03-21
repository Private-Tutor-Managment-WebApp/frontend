import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import {
  LayoutDashboard, BookOpen, Users, FileText,
  CalendarDays, LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const teacherLinks = [
  { to: '/teacher/dashboard', label: 'Главная', icon: LayoutDashboard },
  { to: '/teacher/homeworks', label: 'Домашние задания', icon: BookOpen },
  { to: '/teacher/groups', label: 'Группы', icon: Users },
  { to: '/teacher/materials', label: 'Материалы', icon: FileText },
  { to: '/teacher/calendar', label: 'Календарь', icon: CalendarDays },
]

const studentLinks = [
  { to: '/student/dashboard', label: 'Главная', icon: LayoutDashboard },
  { to: '/student/homeworks', label: 'Задания', icon: BookOpen },
  { to: '/student/materials', label: 'Материалы', icon: FileText },
  { to: '/student/calendar', label: 'Календарь', icon: CalendarDays },
]

export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  if (!user) return null

  const links = user.role === 'teacher' ? teacherLinks : studentLinks
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sidebar">
      <div className="flex items-center gap-3 p-6">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">
            {user.role === 'teacher' ? 'Преподаватель' : 'Ученик'}
          </p>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <Separator />

      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </div>
    </aside>
  )
}
