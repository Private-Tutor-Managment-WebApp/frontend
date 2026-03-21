import { useLocation } from 'react-router-dom'

const titles: Record<string, string> = {
  '/teacher/dashboard': 'Главная',
  '/teacher/homeworks': 'Домашние задания',
  '/teacher/groups': 'Группы',
  '/teacher/materials': 'Материалы',
  '/teacher/calendar': 'Календарь',
  '/student/dashboard': 'Главная',
  '/student/homeworks': 'Мои задания',
  '/student/materials': 'Материалы',
  '/student/calendar': 'Календарь',
}

export function TopBar() {
  const location = useLocation()
  const title = titles[location.pathname] ?? ''

  return (
    <header className="flex h-14 items-center border-b px-6">
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  )
}
