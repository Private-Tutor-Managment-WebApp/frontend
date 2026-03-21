import { useMaterialStore } from '@/store/material-store'
import { MaterialList } from '@/components/materials/material-list'

export function StudentMaterials() {
  const materials = useMaterialStore((s) => s.materials)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Учебные материалы ({materials.length})</h2>
      <MaterialList materials={materials} />
    </div>
  )
}
