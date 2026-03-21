import { create } from 'zustand'
import type { Homework, Submission } from '@/types'
import { mockHomeworks, mockSubmissions } from '@/mock'

interface HomeworkState {
  homeworks: Homework[]
  submissions: Submission[]
  addHomework: (hw: Homework) => void
  updateHomework: (id: string, data: Partial<Homework>) => void
  deleteHomework: (id: string) => void
  addSubmission: (sub: Submission) => void
  gradeSubmission: (id: string, grade: number, comment: string) => void
  returnSubmission: (id: string, comment: string) => void
}

export const useHomeworkStore = create<HomeworkState>((set) => ({
  homeworks: mockHomeworks,
  submissions: mockSubmissions,

  addHomework: (hw) =>
    set((s) => ({ homeworks: [...s.homeworks, hw] })),

  updateHomework: (id, data) =>
    set((s) => ({
      homeworks: s.homeworks.map((h) => (h.id === id ? { ...h, ...data } : h)),
    })),

  deleteHomework: (id) =>
    set((s) => ({ homeworks: s.homeworks.filter((h) => h.id !== id) })),

  addSubmission: (sub) =>
    set((s) => ({ submissions: [...s.submissions, sub] })),

  gradeSubmission: (id, grade, comment) =>
    set((s) => ({
      submissions: s.submissions.map((sub) =>
        sub.id === id
          ? { ...sub, grade, teacherComment: comment, status: 'graded' as const }
          : sub
      ),
    })),

  returnSubmission: (id, comment) =>
    set((s) => ({
      submissions: s.submissions.map((sub) =>
        sub.id === id
          ? { ...sub, teacherComment: comment, status: 'returned' as const }
          : sub
      ),
    })),
}))
