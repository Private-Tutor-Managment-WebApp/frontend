import { useAuthStore } from '@/store/auth-store'
import { useHomeworkStore } from '@/store/homework-store'
import { useGroupStore } from '@/store/group-store'
import { StatCard } from '@/components/dashboard/stat-card'
import { StreakCounter } from '@/components/dashboard/streak-counter'
import { AssignmentCard } from '@/components/dashboard/assignment-card'
import { BookOpen, CheckCircle, Clock } from 'lucide-react'

export function StudentDashboard() {
  const user = useAuthStore((s) => s.user)!
  const homeworks = useHomeworkStore((s) => s.homeworks)
  const submissions = useHomeworkStore((s) => s.submissions)
  const groups = useGroupStore((s) => s.groups)

  const myGroups = groups.filter((g) => g.studentIds.includes(user.id))
  const myGroupIds = myGroups.map((g) => g.id)

  const myHomeworks = homeworks.filter((h) =>
    (h.assignedTo.type === 'group' && myGroupIds.includes(h.assignedTo.groupId)) ||
    (h.assignedTo.type === 'students' && h.assignedTo.studentIds.includes(user.id))
  )

  const mySubmissions = submissions.filter((s) => s.studentId === user.id)
  const submittedHwIds = new Set(mySubmissions.map((s) => s.homeworkId))

  const pendingHw = myHomeworks.filter((h) => !submittedHwIds.has(h.id))
  const gradedCount = mySubmissions.filter((s) => s.status === 'graded').length

  const upcoming = [...pendingHw]
    .filter((h) => new Date(h.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Всего заданий" value={myHomeworks.length} icon={BookOpen} />
        <StatCard title="Не сдано" value={pendingHw.length} icon={Clock} />
        <StatCard title="Оценено" value={gradedCount} icon={CheckCircle} />
        <StreakCounter studentId={user.id} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Ближайшие задания</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">Нет предстоящих заданий</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((hw) => (
              <AssignmentCard
                key={hw.id}
                homework={hw}
                linkPrefix="/student/homeworks"
                submitted={submittedHwIds.has(hw.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
