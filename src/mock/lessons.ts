import type { Lesson } from '@/types'

export const mockLessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Математика 9 класс',
    teacherId: 'teacher-1',
    groupId: 'group-1',
    dayOfWeek: 0, // Пн
    time: '16:00',
    durationMinutes: 90,
    room: 'Каб. 12',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'lesson-2',
    title: 'Математика 9 класс',
    teacherId: 'teacher-1',
    groupId: 'group-1',
    dayOfWeek: 3, // Чт
    time: '16:00',
    durationMinutes: 90,
    room: 'Каб. 12',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'lesson-3',
    title: 'ЕГЭ — подготовка',
    teacherId: 'teacher-1',
    groupId: 'group-2',
    dayOfWeek: 1, // Вт
    time: '18:00',
    durationMinutes: 120,
    room: 'Каб. 5',
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'lesson-4',
    title: 'Олимпиадная математика',
    teacherId: 'teacher-1',
    groupId: 'group-3',
    dayOfWeek: 5, // Сб
    time: '10:00',
    durationMinutes: 120,
    room: 'Каб. 3',
    createdAt: '2026-02-01T10:00:00Z',
  },
]
