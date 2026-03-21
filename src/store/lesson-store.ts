import { create } from 'zustand'
import type { Lesson } from '@/types'
import { mockLessons } from '@/mock'

interface LessonState {
  lessons: Lesson[]
  addLesson: (lesson: Lesson) => void
  updateLesson: (id: string, data: Partial<Lesson>) => void
  deleteLesson: (id: string) => void
}

export const useLessonStore = create<LessonState>((set) => ({
  lessons: mockLessons,

  addLesson: (lesson) =>
    set((s) => ({ lessons: [...s.lessons, lesson] })),

  updateLesson: (id, data) =>
    set((s) => ({
      lessons: s.lessons.map((l) => (l.id === id ? { ...l, ...data } : l)),
    })),

  deleteLesson: (id) =>
    set((s) => ({ lessons: s.lessons.filter((l) => l.id !== id) })),
}))
