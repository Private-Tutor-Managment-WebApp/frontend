import { useAuthStore } from '@/store/auth-store'
import { useHomeworkStore } from '@/store/homework-store'
import { useGroupStore } from '@/store/group-store'
import { useLessonStore } from '@/store/lesson-store'
import { CalendarView } from '@/components/calendar/calendar-view'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

export function StudentCalendar() {
  const user = useAuthStore((s) => s.user)!
  const homeworks = useHomeworkStore((s) => s.homeworks)
  const groups = useGroupStore((s) => s.groups)
  const lessons = useLessonStore((s) => s.lessons)

  const myGroups = groups.filter((g) => g.studentIds.includes(user.id))
  const myGroupIds = myGroups.map((g) => g.id)

  const myHomeworks = homeworks.filter((h) =>
    (h.assignedTo.type === 'group' && myGroupIds.includes(h.assignedTo.groupId)) ||
    (h.assignedTo.type === 'students' && h.assignedTo.studentIds.includes(user.id))
  )

  const myLessons = lessons.filter((l) => myGroupIds.includes(l.groupId))

  const sortedLessons = [...myLessons].sort((a, b) =>
    a.dayOfWeek !== b.dayOfWeek ? a.dayOfWeek - b.dayOfWeek : a.time.localeCompare(b.time)
  )

  return (
    <div className="space-y-6">
      <CalendarView homeworks={myHomeworks} lessons={myLessons} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Моё расписание</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedLessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">У вас пока нет регулярных занятий</p>
          ) : (
            <div className="space-y-2">
              {sortedLessons.map((lesson) => {
                const group = groups.find((g) => g.id === lesson.groupId)
                return (
                  <div key={lesson.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                        <Clock className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{dayNames[lesson.dayOfWeek]}, {lesson.time}</span>
                          <span>· {lesson.durationMinutes} мин</span>
                          {lesson.room && <span>· {lesson.room}</span>}
                        </div>
                      </div>
                    </div>
                    {group && <Badge variant="secondary">{group.name}</Badge>}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
