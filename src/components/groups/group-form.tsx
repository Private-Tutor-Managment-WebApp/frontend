import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGroupStore } from '@/store/group-store'
import { useAuthStore } from '@/store/auth-store'
import { mockUsers } from '@/mock'
import type { StudentGroup } from '@/types'

interface GroupFormProps {
  onClose: () => void
  editGroup?: StudentGroup
}

export function GroupForm({ onClose, editGroup }: GroupFormProps) {
  const user = useAuthStore((s) => s.user)!
  const addGroup = useGroupStore((s) => s.addGroup)
  const updateGroup = useGroupStore((s) => s.updateGroup)
  const students = mockUsers.filter((u) => u.role === 'student')

  const [name, setName] = useState(editGroup?.name ?? '')
  const [selectedStudents, setSelectedStudents] = useState<string[]>(
    editGroup?.studentIds ?? []
  )

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editGroup) {
      updateGroup(editGroup.id, { name, studentIds: selectedStudents })
    } else {
      const group: StudentGroup = {
        id: `group-${Date.now()}`,
        name,
        teacherId: user.id,
        studentIds: selectedStudents,
        createdAt: new Date().toISOString(),
      }
      addGroup(group)
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="group-name">Название группы</Label>
        <Input
          id="group-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Ученики</Label>
        <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border p-2">
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
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Отмена</Button>
        <Button type="submit">{editGroup ? 'Сохранить' : 'Создать'}</Button>
      </div>
    </form>
  )
}
