import type { User } from '@/types'

export const mockUsers: User[] = [
  {
    id: 'teacher-1',
    name: 'Анна Петровна Иванова',
    email: 'teacher@example.com',
    password: '123456',
    role: 'teacher',
    avatarUrl: undefined,
  },
  {
    id: 'student-1',
    name: 'Михаил Сергеев',
    email: 'student@example.com',
    password: '123456',
    role: 'student',
  },
  {
    id: 'student-2',
    name: 'Елена Козлова',
    email: 'elena@example.com',
    password: '123456',
    role: 'student',
  },
  {
    id: 'student-3',
    name: 'Дмитрий Волков',
    email: 'dmitry@example.com',
    password: '123456',
    role: 'student',
  },
  {
    id: 'student-4',
    name: 'Ольга Новикова',
    email: 'olga@example.com',
    password: '123456',
    role: 'student',
  },
  {
    id: 'student-5',
    name: 'Александр Морозов',
    email: 'alex@example.com',
    password: '123456',
    role: 'student',
  },
]
