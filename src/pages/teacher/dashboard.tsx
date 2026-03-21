import { useAuthStore } from '@/store/auth-store'
import { useHomeworkStore } from '@/store/homework-store'
import { useGroupStore } from '@/store/group-store'
import { useMaterialStore } from '@/store/material-store'
import { StatCard } from '@/components/dashboard/stat-card'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { AssignmentCard } from '@/components/dashboard/assignment-card'
import { BookOpen, Users, FileText, CheckCircle } from 'lucide-react'

export function TeacherDashboard() {
  const user = useAuthStore((s) => s.user)!
  const homeworks = useHomeworkStore((s) => s.homeworks).filter((h) => h.teacherId === user.id)
  const submissions = useHomeworkStore((s) => s.submissions)
  const groups = useGroupStore((s) => s.groups).filter((g) => g.teacherId === user.id)
  const materials = useMaterialStore((s) => s.materials).filter((m) => m.teacherId === user.id)

  const pendingSubmissions = submissions.filter((s) => s.status === 'submitted')
  const upcomingHw = [...homeworks]
    .filter((h) => new Date(h.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Задания" value={homeworks.length} icon={BookOpen} />
        <StatCard title="Группы" value={groups.length} icon={Users} />
        <StatCard title="Материалы" value={materials.length} icon={FileText} />
        <StatCard
          title="Ожидают проверки"
          value={pendingSubmissions.length}
          icon={CheckCircle}
          description="непроверенных работ"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Ближайшие дедлайны</h2>
          {upcomingHw.length === 0 ? (
            <p className="text-sm text-muted-foreground">Нет предстоящих дедлайнов</p>
          ) : (
            upcomingHw.map((hw) => (
              <AssignmentCard key={hw.id} homework={hw} linkPrefix="/teacher/homeworks" />
            ))
          )}
        </div>
        <RecentActivity />
      </div>
    </div>
  )
}
