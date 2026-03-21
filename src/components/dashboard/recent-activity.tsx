import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useHomeworkStore } from '@/store/homework-store'
import { mockUsers } from '@/mock'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

const statusLabels: Record<string, string> = {
  submitted: 'Сдано',
  graded: 'Оценено',
  returned: 'Возвращено',
}

const statusVariants: Record<string, 'default' | 'success' | 'warning'> = {
  submitted: 'default',
  graded: 'success',
  returned: 'warning',
}

export function RecentActivity() {
  const submissions = useHomeworkStore((s) => s.submissions)
  const homeworks = useHomeworkStore((s) => s.homeworks)

  const recent = [...submissions]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5)

  if (recent.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">Последняя активность</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Пока нет активности</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Последняя активность</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recent.map((sub) => {
          const hw = homeworks.find((h) => h.id === sub.homeworkId)
          const student = mockUsers.find((u) => u.id === sub.studentId)
          return (
            <div key={sub.id} className="flex items-center justify-between rounded-md border p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{student?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{hw?.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={statusVariants[sub.status]}>
                  {statusLabels[sub.status]}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(parseISO(sub.submittedAt), 'd MMM', { locale: ru })}
                </span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
