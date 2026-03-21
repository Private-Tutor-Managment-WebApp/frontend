import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGroupStore } from '@/store/group-store'
import { useHomeworkStore } from '@/store/homework-store'
import { mockUsers } from '@/mock'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GroupForm } from '@/components/groups/group-form'
import { HomeworkList } from '@/components/homework/homework-list'
import { ArrowLeft, Edit, Trash2, User } from 'lucide-react'

export function TeacherGroupDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const group = useGroupStore((s) => s.groups.find((g) => g.id === id))
  const deleteGroup = useGroupStore((s) => s.deleteGroup)
  const allHomeworks = useHomeworkStore((s) => s.homeworks)
  const homeworks = allHomeworks.filter(
    (h) => h.assignedTo.type === 'group' && h.assignedTo.groupId === id
  )
  const [showEdit, setShowEdit] = useState(false)

  if (!group) {
    return <p className="text-muted-foreground">Группа не найдена</p>
  }

  const students = mockUsers.filter((u) => group.studentIds.includes(u.id))

  const handleDelete = () => {
    deleteGroup(group.id)
    navigate('/teacher/groups')
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/teacher/groups')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад
      </Button>

      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-bold">{group.name}</h2>
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
        <CardHeader>
          <CardTitle className="text-base">Ученики ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-sm text-muted-foreground">В группе пока нет учеников</p>
          ) : (
            <div className="space-y-2">
              {students.map((s) => (
                <div key={s.id} className="flex items-center gap-3 rounded-md border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Задания группы ({homeworks.length})</h3>
        <HomeworkList homeworks={homeworks} linkPrefix="/teacher/homeworks" />
      </div>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать группу</DialogTitle>
          </DialogHeader>
          <GroupForm onClose={() => setShowEdit(false)} editGroup={group} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
