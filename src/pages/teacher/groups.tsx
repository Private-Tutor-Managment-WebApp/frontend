import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useGroupStore } from '@/store/group-store'
import { GroupList } from '@/components/groups/group-list'
import { GroupForm } from '@/components/groups/group-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

export function TeacherGroups() {
  const user = useAuthStore((s) => s.user)!
  const groups = useGroupStore((s) => s.groups).filter((g) => g.teacherId === user.id)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Мои группы ({groups.length})</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Создать группу
        </Button>
      </div>

      <GroupList groups={groups} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новая группа</DialogTitle>
          </DialogHeader>
          <GroupForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
