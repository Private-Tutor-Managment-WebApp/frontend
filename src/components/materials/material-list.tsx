import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Trash2, Download } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { Material } from '@/types'

interface MaterialListProps {
  materials: Material[]
  canDelete?: boolean
  onDelete?: (id: string) => void
}

function handleDownload(mat: Material) {
  if (!mat.fileData) return
  const a = document.createElement('a')
  a.href = mat.fileData
  a.download = mat.fileName
  a.click()
}

export function MaterialList({ materials, canDelete, onDelete }: MaterialListProps) {
  if (materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <FileText className="mb-2 h-12 w-12" />
        <p className="text-lg">Нет материалов</p>
        <p className="text-sm">Здесь будут учебные материалы</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {materials.map((mat) => (
        <Card key={mat.id}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{mat.title}</p>
              <p className="text-sm text-muted-foreground">{mat.description}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary">{mat.fileType.toUpperCase()}</Badge>
                <span className="text-xs text-muted-foreground">
                  {mat.fileName} · {format(parseISO(mat.createdAt), 'd MMM yyyy', { locale: ru })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {mat.fileData && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(mat)}
                  title="Скачать"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              {canDelete && onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(mat.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
