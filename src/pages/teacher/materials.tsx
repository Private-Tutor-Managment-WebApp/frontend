import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useMaterialStore } from '@/store/material-store'
import { MaterialList } from '@/components/materials/material-list'
import { MaterialForm } from '@/components/materials/material-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

export function TeacherMaterials() {
  const user = useAuthStore((s) => s.user)!
  const materials = useMaterialStore((s) => s.materials)
  const deleteMaterial = useMaterialStore((s) => s.deleteMaterial)
  const myMaterials = materials.filter((m) => m.teacherId === user.id)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Мои материалы ({myMaterials.length})</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Добавить материал
        </Button>
      </div>

      <MaterialList materials={myMaterials} canDelete onDelete={deleteMaterial} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новый материал</DialogTitle>
          </DialogHeader>
          <MaterialForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
