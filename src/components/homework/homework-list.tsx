import type { Homework } from '@/types'
import { AssignmentCard } from '@/components/dashboard/assignment-card'

interface HomeworkListProps {
  homeworks: Homework[]
  linkPrefix: string
  studentId?: string
  submissions?: { homeworkId: string }[]
}

export function HomeworkList({ homeworks, linkPrefix, submissions }: HomeworkListProps) {
  if (homeworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-lg">Нет заданий</p>
        <p className="text-sm">Здесь пока пусто</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {homeworks.map((hw) => {
        const submitted = submissions
          ? submissions.some((s) => s.homeworkId === hw.id)
          : undefined
        return (
          <AssignmentCard
            key={hw.id}
            homework={hw}
            linkPrefix={linkPrefix}
            submitted={submitted}
          />
        )
      })}
    </div>
  )
}
