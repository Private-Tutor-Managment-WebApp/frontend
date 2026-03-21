import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLessonStore } from '@/store/lesson-store'
import { useGroupStore } from '@/store/group-store'
import { useAuthStore } from '@/store/auth-store'
import type { Lesson } from '@/types'

const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

interface LessonFormProps {
  onClose: () => void
  editLesson?: Lesson
}

export function LessonForm({ onClose, editLesson }: LessonFormProps) {
  const user = useAuthStore((s) => s.user)!
  const groups = useGroupStore((s) => s.groups).filter((g) => g.teacherId === user.id)
  const addLesson = useLessonStore((s) => s.addLesson)
  const updateLesson = useLessonStore((s) => s.updateLesson)

  const [title, setTitle] = useState(editLesson?.title ?? '')
  const [groupId, setGroupId] = useState(editLesson?.groupId ?? '')
  const [dayOfWeek, setDayOfWeek] = useState(editLesson?.dayOfWeek?.toString() ?? '')
  const [time, setTime] = useState(editLesson?.time ?? '')
  const [duration, setDuration] = useState(editLesson?.durationMinutes?.toString() ?? '90')
  const [room, setRoom] = useState(editLesson?.room ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupId || dayOfWeek === '') return

    const data = {
      title,
      groupId,
      dayOfWeek: Number(dayOfWeek),
      time,
      durationMinutes: Number(duration),
      room: room || undefined,
    }

    if (editLesson) {
      updateLesson(editLesson.id, data)
    } else {
      const lesson: Lesson = {
        id: `lesson-${Date.now()}`,
        teacherId: user.id,
        ...data,
        createdAt: new Date().toISOString(),
      }
      addLesson(lesson)
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="lesson-title">Название</Label>
        <Input id="lesson-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

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

      <div className="space-y-2">
        <Label>День недели</Label>
        <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите день" />
          </SelectTrigger>
          <SelectContent>
            {dayNames.map((name, i) => (
              <SelectItem key={i} value={i.toString()}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lesson-time">Время</Label>
          <Input id="lesson-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lesson-duration">Длительность (мин)</Label>
          <Input
            id="lesson-duration"
            type="number"
            min="30"
            max="240"
            step="15"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lesson-room">Кабинет (необязательно)</Label>
        <Input id="lesson-room" value={room} onChange={(e) => setRoom(e.target.value)} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Отмена</Button>
        <Button type="submit">{editLesson ? 'Сохранить' : 'Создать'}</Button>
      </div>
    </form>
  )
}
