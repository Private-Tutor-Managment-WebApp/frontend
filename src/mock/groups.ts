import type { StudentGroup } from '@/types'

export const mockGroups: StudentGroup[] = [
  {
    id: 'group-1',
    name: 'Математика 9 класс',
    teacherId: 'teacher-1',
    studentIds: ['student-1', 'student-2', 'student-3'],
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'group-2',
    name: 'Математика 11 класс (ЕГЭ)',
    teacherId: 'teacher-1',
    studentIds: ['student-4', 'student-5'],
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'group-3',
    name: 'Олимпиадная математика',
    teacherId: 'teacher-1',
    studentIds: ['student-1', 'student-5'],
    createdAt: '2026-02-01T10:00:00Z',
  },
]
