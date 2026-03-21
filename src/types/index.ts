export type UserRole = 'teacher' | 'student'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  avatarUrl?: string
}

export interface StudentGroup {
  id: string
  name: string
  teacherId: string
  studentIds: string[]
  createdAt: string
}

export type AssignedTo =
  | { type: 'group'; groupId: string }
  | { type: 'students'; studentIds: string[] }

export interface Homework {
  id: string
  title: string
  description: string
  teacherId: string
  assignedTo: AssignedTo
  deadline: string
  materialIds: string[]
  createdAt: string
}

export type SubmissionStatus = 'submitted' | 'graded' | 'returned'

export interface Submission {
  id: string
  homeworkId: string
  studentId: string
  text: string
  fileName?: string
  fileData?: string
  submittedAt: string
  status: SubmissionStatus
  grade?: number
  teacherComment?: string
}

export interface Lesson {
  id: string
  title: string
  teacherId: string
  groupId: string
  dayOfWeek: number // 0=Mon, 1=Tue, ..., 6=Sun
  time: string // "HH:mm"
  durationMinutes: number
  room?: string
  createdAt: string
}

export interface Material {
  id: string
  title: string
  description: string
  teacherId: string
  fileName: string
  fileType: string
  fileData?: string
  createdAt: string
}
