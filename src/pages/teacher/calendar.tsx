import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useHomeworkStore } from '@/store/homework-store'
import { useLessonStore } from '@/store/lesson-store'
import { useGroupStore } from '@/store/group-store'
import { CalendarView } from '@/components/calendar/calendar-view'
import { LessonForm } from '@/components/calendar/lesson-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Clock } from 'lucide-react'
import type { Lesson } from '@/types'

const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

export function TeacherCalendar() {
  const user = useAuthStore((s) => s.user)!
  const homeworks = useHomeworkStore((s) => s.homeworks).filter((h) => h.teacherId === user.id)
  const lessons = useLessonStore((s) => s.lessons)
  const deleteLesson = useLessonStore((s) => s.deleteLesson)
  const groups = useGroupStore((s) => s.groups)
  const myLessons = lessons.filter((l) => l.teacherId === user.id)

  const [showForm, setShowForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | undefined>()

  const sortedLessons = [...myLessons].sort((a, b) =>
    a.dayOfWeek !== b.dayOfWeek ? a.dayOfWeek - b.dayOfWeek : a.time.localeCompare(b.time)
  )

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingLesson(undefined)
  }

  return (
    <div className="space-y-6">
      <CalendarView homeworks={homeworks} lessons={myLessons} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Расписание занятий</CardTitle>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Добавить занятие
          </Button>
        </CardHeader>
        <CardContent>
          {sortedLessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">Нет регулярных занятий. Добавьте первое!</p>
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
                    <div className="flex items-center gap-2">
                      {group && <Badge variant="secondary">{group.name}</Badge>}
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(lesson)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteLesson(lesson.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={(open) => { if (!open) handleClose() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Редактировать занятие' : 'Новое занятие'}</DialogTitle>
          </DialogHeader>
          <LessonForm onClose={handleClose} editLesson={editingLesson} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
