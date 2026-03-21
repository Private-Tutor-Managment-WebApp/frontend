import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useHomeworkStore } from '@/store/homework-store'
import { HomeworkList } from '@/components/homework/homework-list'
import { HomeworkForm } from '@/components/homework/homework-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

export function TeacherHomeworks() {
  const user = useAuthStore((s) => s.user)!
  const homeworks = useHomeworkStore((s) => s.homeworks).filter((h) => h.teacherId === user.id)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Все задания ({homeworks.length})</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Создать задание
        </Button>
      </div>

      <HomeworkList homeworks={homeworks} linkPrefix="/teacher/homeworks" />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новое задание</DialogTitle>
          </DialogHeader>
          <HomeworkForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
