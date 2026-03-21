import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGroupStore } from '@/store/group-store'
import { useHomeworkStore } from '@/store/homework-store'
import { useMaterialStore } from '@/store/material-store'
import { useAuthStore } from '@/store/auth-store'
import { mockUsers } from '@/mock'
import type { Homework } from '@/types'

interface HomeworkFormProps {
  onClose: () => void
  editHomework?: Homework
}

export function HomeworkForm({ onClose, editHomework }: HomeworkFormProps) {
  const user = useAuthStore((s) => s.user)!
  const groups = useGroupStore((s) => s.groups).filter((g) => g.teacherId === user.id)
  const materials = useMaterialStore((s) => s.materials).filter((m) => m.teacherId === user.id)
  const addHomework = useHomeworkStore((s) => s.addHomework)
  const updateHomework = useHomeworkStore((s) => s.updateHomework)

  const students = mockUsers.filter((u) => u.role === 'student')

  const [title, setTitle] = useState(editHomework?.title ?? '')
  const [description, setDescription] = useState(editHomework?.description ?? '')
  const [assignType, setAssignType] = useState<'group' | 'students'>(
    editHomework?.assignedTo.type ?? 'group'
  )
  const [groupId, setGroupId] = useState(
    editHomework?.assignedTo.type === 'group' ? editHomework.assignedTo.groupId : ''
  )
  const [selectedStudents, setSelectedStudents] = useState<string[]>(
    editHomework?.assignedTo.type === 'students' ? editHomework.assignedTo.studentIds : []
  )
  const [deadline, setDeadline] = useState(
    editHomework ? editHomework.deadline.slice(0, 16) : ''
  )
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    editHomework?.materialIds ?? []
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (assignType === 'group' && !groupId) return
    if (assignType === 'students' && selectedStudents.length === 0) return

    const assignedTo = assignType === 'group'
      ? { type: 'group' as const, groupId }
      : { type: 'students' as const, studentIds: selectedStudents }

    if (editHomework) {
      updateHomework(editHomework.id, {
        title,
        description,
        assignedTo,
        deadline: new Date(deadline).toISOString(),
        materialIds: selectedMaterials,
      })
    } else {
      const hw: Homework = {
        id: `hw-${Date.now()}`,
        title,
        description,
        teacherId: user.id,
        assignedTo,
        deadline: new Date(deadline).toISOString(),
        materialIds: selectedMaterials,
        createdAt: new Date().toISOString(),
      }
      addHomework(hw)
    }
    onClose()
  }

  const toggleMaterial = (id: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hw-title">Название</Label>
        <Input id="hw-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hw-desc">Описание</Label>
        <Textarea id="hw-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Назначить</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={assignType === 'group' ? 'default' : 'outline'}
            onClick={() => setAssignType('group')}
          >
            Группе
          </Button>
          <Button
            type="button"
            size="sm"
            variant={assignType === 'students' ? 'default' : 'outline'}
            onClick={() => setAssignType('students')}
          >
            Ученикам
          </Button>
        </div>
      </div>

      {assignType === 'group' ? (
        <div className="space-y-2">
          <Label>Группа</Label>
          <Select value={groupId} onValueChange={setGroupId}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите группу" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((g) => (
                <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Ученики</Label>
          <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">
            {students.map((s) => (
              <label key={s.id} className="flex items-center gap-2 rounded p-1 text-sm hover:bg-accent">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(s.id)}
                  onChange={() => toggleStudent(s.id)}
                  className="rounded"
                />
                {s.name}
              </label>
            ))}
          </div>
          {selectedStudents.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Выбрано: {selectedStudents.length}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="hw-deadline">Дедлайн</Label>
        <Input
          id="hw-deadline"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>

      {materials.length > 0 && (
        <div className="space-y-2">
          <Label>Материалы</Label>
          <div className="space-y-1">
            {materials.map((mat) => (
              <label key={mat.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(mat.id)}
                  onChange={() => toggleMaterial(mat.id)}
                  className="rounded"
                />
                {mat.title}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Отмена</Button>
        <Button type="submit">{editHomework ? 'Сохранить' : 'Создать'}</Button>
      </div>
    </form>
  )
}
