import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useHomeworkStore } from '@/store/homework-store'
import { useGroupStore } from '@/store/group-store'
import { useMaterialStore } from '@/store/material-store'
import { mockUsers } from '@/mock'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { HomeworkForm } from '@/components/homework/homework-form'
import { ArrowLeft, CalendarDays, Paperclip, Edit, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

const statusLabels: Record<string, string> = {
  submitted: 'На проверке',
  graded: 'Оценено',
  returned: 'Возвращено',
}

export function TeacherHomeworkDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const homeworks = useHomeworkStore((s) => s.homeworks)
  const allSubmissions = useHomeworkStore((s) => s.submissions)
  const gradeSubmission = useHomeworkStore((s) => s.gradeSubmission)
  const returnSubmission = useHomeworkStore((s) => s.returnSubmission)
  const deleteHomework = useHomeworkStore((s) => s.deleteHomework)
  const homework = homeworks.find((h) => h.id === id)
  const submissions = allSubmissions.filter((s) => s.homeworkId === id)
  const groups = useGroupStore((s) => s.groups)
  const materials = useMaterialStore((s) => s.materials)
  const [showEdit, setShowEdit] = useState(false)
  const [gradingId, setGradingId] = useState<string | null>(null)
  const [grade, setGrade] = useState('')
  const [comment, setComment] = useState('')

  if (!homework) {
    return <p className="text-muted-foreground">Задание не найдено</p>
  }

  const assignedTo = homework.assignedTo
  const group = assignedTo.type === 'group'
    ? groups.find((g) => g.id === assignedTo.groupId)
    : null
  const assignedStudentNames = assignedTo.type === 'students'
    ? mockUsers.filter((u) => assignedTo.studentIds.includes(u.id)).map((u) => u.name)
    : []

  const hwMaterials = materials.filter((m) => homework.materialIds.includes(m.id))

  const handleGrade = (subId: string) => {
    if (!grade) return
    gradeSubmission(subId, Number(grade), comment)
    setGradingId(null)
    setGrade('')
    setComment('')
  }

  const handleDelete = () => {
    deleteHomework(homework.id)
    navigate('/teacher/homeworks')
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/teacher/homeworks')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{homework.title}</h2>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              Дедлайн: {format(parseISO(homework.deadline), 'd MMMM yyyy, HH:mm', { locale: ru })}
            </span>
            {group && <Badge variant="secondary">{group.name}</Badge>}
            {assignedStudentNames.length > 0 && (
              <Badge variant="secondary">{assignedStudentNames.join(', ')}</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
            <Edit className="mr-2 h-4 w-4" /> Редактировать
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Удалить
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Описание</CardTitle></CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm">{homework.description}</p>
          {hwMaterials.length > 0 && (
            <div className="mt-4 space-y-1">
              <p className="text-sm font-medium">Прикреплённые материалы:</p>
              {hwMaterials.map((m) => (
                <div key={m.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Paperclip className="h-3 w-3" />
                  {m.title} ({m.fileName})
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Сданные работы ({submissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Пока нет сданных работ</p>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => {
                const student = mockUsers.find((u) => u.id === sub.studentId)
                return (
                  <div key={sub.id} className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{student?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(sub.submittedAt), 'd MMM yyyy, HH:mm', { locale: ru })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {sub.grade !== undefined && (
                          <Badge variant="success">Оценка: {sub.grade}</Badge>
                        )}
                        <Badge variant={
                          sub.status === 'submitted' ? 'warning' :
                          sub.status === 'returned' ? 'destructive' : 'success'
                        }>
                          {statusLabels[sub.status]}
                        </Badge>
                      </div>
                    </div>
                    {sub.text && <p className="mt-2 text-sm">{sub.text}</p>}
                    {sub.fileData && (
                      <img
                        src={sub.fileData}
                        alt={sub.fileName ?? 'Фото решения'}
                        className="mt-2 max-h-64 rounded-md border object-contain"
                      />
                    )}
                    {sub.fileName && !sub.fileData && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Paperclip className="h-3 w-3" /> {sub.fileName}
                      </p>
                    )}
                    {sub.teacherComment && (
                      <div className="mt-2 rounded bg-muted p-2 text-sm">
                        <strong>Комментарий:</strong> {sub.teacherComment}
                      </div>
                    )}
                    {(sub.status === 'submitted' || sub.status === 'returned') && (
                      <div className="mt-3">
                        {gradingId === sub.id ? (
                          <div className="space-y-3">
                            <div className="flex items-end gap-2">
                              <div className="space-y-1">
                                <label className="text-xs">Оценка</label>
                                <Input
                                  type="number"
                                  min="1"
                                  max="5"
                                  value={grade}
                                  onChange={(e) => setGrade(e.target.value)}
                                  className="w-20"
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <label className="text-xs">Комментарий</label>
                                <Textarea
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  rows={2}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleGrade(sub.id)}>Оценить</Button>
                              <Button size="sm" variant="outline" onClick={() => {
                                if (comment.trim()) {
                                  returnSubmission(sub.id, comment)
                                  setGradingId(null)
                                  setComment('')
                                  setGrade('')
                                }
                              }}>Вернуть на доработку</Button>
                              <Button size="sm" variant="ghost" onClick={() => setGradingId(null)}>Отмена</Button>
                            </div>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => setGradingId(sub.id)}>
                            Оценить работу
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать задание</DialogTitle>
          </DialogHeader>
          <HomeworkForm onClose={() => setShowEdit(false)} editHomework={homework} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
