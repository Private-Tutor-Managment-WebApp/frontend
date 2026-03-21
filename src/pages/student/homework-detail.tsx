import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useHomeworkStore } from '@/store/homework-store'
import { useMaterialStore } from '@/store/material-store'
import { useAuthStore } from '@/store/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SubmissionForm } from '@/components/homework/submission-form'
import { ArrowLeft, CalendarDays, Paperclip, Send } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

const statusLabels: Record<string, string> = {
  submitted: 'На проверке',
  graded: 'Оценено',
  returned: 'Возвращено',
}

export function StudentHomeworkDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)!
  const homeworks = useHomeworkStore((s) => s.homeworks)
  const allSubmissions = useHomeworkStore((s) => s.submissions)
  const homework = homeworks.find((h) => h.id === id)
  const submissions = allSubmissions.filter((s) => s.homeworkId === id && s.studentId === user.id)
  const materials = useMaterialStore((s) => s.materials)
  const [showSubmit, setShowSubmit] = useState(false)

  if (!homework) {
    return <p className="text-muted-foreground">Задание не найдено</p>
  }

  const hwMaterials = materials.filter((m) => homework.materialIds.includes(m.id))
  const latestSubmission = submissions[submissions.length - 1]
  const canSubmit = !latestSubmission || latestSubmission.status === 'returned'

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/student/homeworks')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{homework.title}</h2>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            Дедлайн: {format(parseISO(homework.deadline), 'd MMMM yyyy, HH:mm', { locale: ru })}
          </div>
        </div>
        {canSubmit && (
          <Button onClick={() => setShowSubmit(true)}>
            <Send className="mr-2 h-4 w-4" /> {latestSubmission ? 'Сдать повторно' : 'Сдать работу'}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Описание</CardTitle></CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm">{homework.description}</p>
          {hwMaterials.length > 0 && (
            <div className="mt-4 space-y-1">
              <p className="text-sm font-medium">Материалы:</p>
              {hwMaterials.map((m) => (
                <div key={m.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Paperclip className="h-3 w-3" />
                  {m.fileData ? (
                    <a
                      href={m.fileData}
                      download={m.fileName}
                      className="text-primary hover:underline"
                    >
                      {m.title} ({m.fileName})
                    </a>
                  ) : (
                    <span>{m.title} ({m.fileName})</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {submissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Мои ответы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {submissions.map((sub) => (
              <div key={sub.id} className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {format(parseISO(sub.submittedAt), 'd MMM yyyy, HH:mm', { locale: ru })}
                  </span>
                  <div className="flex items-center gap-2">
                    {sub.grade !== undefined && (
                      <Badge variant="success">Оценка: {sub.grade}</Badge>
                    )}
                    <Badge variant={
                      sub.status === 'graded' ? 'success' :
                      sub.status === 'returned' ? 'destructive' : 'warning'
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
                    <strong>Комментарий преподавателя:</strong> {sub.teacherComment}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Dialog open={showSubmit} onOpenChange={setShowSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сдать работу</DialogTitle>
          </DialogHeader>
          <SubmissionForm homeworkId={homework.id} onClose={() => setShowSubmit(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
