import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useHomeworkStore } from '@/store/homework-store'
import { useAuthStore } from '@/store/auth-store'
import { ImagePlus, X } from 'lucide-react'
import type { Submission } from '@/types'

interface SubmissionFormProps {
  homeworkId: string
  onClose: () => void
}

export function SubmissionForm({ homeworkId, onClose }: SubmissionFormProps) {
  const user = useAuthStore((s) => s.user)!
  const addSubmission = useHomeworkStore((s) => s.addSubmission)
  const [text, setText] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPhotoError('')
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setPhotoError('Можно прикрепить только изображения (JPG, PNG и т.д.)')
      return
    }

    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!photoFile || !photoPreview) {
      setPhotoError('Фото решения обязательно')
      return
    }

    const sub: Submission = {
      id: `sub-${Date.now()}`,
      homeworkId,
      studentId: user.id,
      text,
      fileName: photoFile.name,
      fileData: photoPreview,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
    }
    addSubmission(sub)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sub-text">Комментарий</Label>
        <Textarea
          id="sub-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напишите комментарий к решению..."
        />
      </div>

      <div className="space-y-2">
        <Label>Фото решения <span className="text-destructive">*</span></Label>
        {photoPreview ? (
          <div className="relative">
            <img
              src={photoPreview}
              alt="Превью"
              className="max-h-48 w-full rounded-md border object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7"
              onClick={removePhoto}
            >
              <X className="h-4 w-4" />
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">{photoFile?.name}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-md border-2 border-dashed p-6 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ImagePlus className="h-8 w-8" />
            <span className="text-sm">Нажмите, чтобы добавить фото</span>
            <span className="text-xs">JPG, PNG, WEBP</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
        {photoError && (
          <p className="text-sm text-destructive">{photoError}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Отмена</Button>
        <Button type="submit">Отправить</Button>
      </div>
    </form>
  )
}
