import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useMaterialStore } from '@/store/material-store'
import { useAuthStore } from '@/store/auth-store'
import { Upload, FileText, X } from 'lucide-react'
import type { Material } from '@/types'

interface MaterialFormProps {
  onClose: () => void
}

export function MaterialForm({ onClose }: MaterialFormProps) {
  const user = useAuthStore((s) => s.user)!
  const addMaterial = useMaterialStore((s) => s.addMaterial)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileData, setFileData] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (ev) => setFileData(ev.target?.result as string)
    reader.readAsDataURL(f)
  }

  const removeFile = () => {
    setFile(null)
    setFileData(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !fileData) return

    const fileType = file.name.split('.').pop()?.toLowerCase() ?? ''
    const mat: Material = {
      id: `mat-${Date.now()}`,
      title,
      description,
      teacherId: user.id,
      fileName: file.name,
      fileType,
      fileData,
      createdAt: new Date().toISOString(),
    }
    addMaterial(mat)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mat-title">Название</Label>
        <Input id="mat-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mat-desc">Описание</Label>
        <Textarea id="mat-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Файл <span className="text-destructive">*</span></Label>
        {file ? (
          <div className="flex items-center gap-3 rounded-md border p-3">
            <FileText className="h-5 w-5 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} КБ
              </p>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-md border-2 border-dashed p-6 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Upload className="h-8 w-8" />
            <span className="text-sm">Нажмите, чтобы выбрать файл</span>
            <span className="text-xs">PDF, DOCX, изображения и др.</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Отмена</Button>
        <Button type="submit" disabled={!file}>Добавить</Button>
      </div>
    </form>
  )
}
