import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Paperclip } from 'lucide-react'
import { format, parseISO, isPast } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { Homework } from '@/types'

interface AssignmentCardProps {
  homework: Homework
  linkPrefix: string
  submitted?: boolean
}

export function AssignmentCard({ homework, linkPrefix, submitted }: AssignmentCardProps) {
  const overdue = isPast(parseISO(homework.deadline))

  return (
    <Link to={`${linkPrefix}/${homework.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{homework.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {homework.description}
              </p>
            </div>
            {submitted !== undefined && (
              <Badge variant={submitted ? 'success' : overdue ? 'destructive' : 'secondary'}>
                {submitted ? 'Сдано' : overdue ? 'Просрочено' : 'Не сдано'}
              </Badge>
            )}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {format(parseISO(homework.deadline), 'd MMMM yyyy', { locale: ru })}
            </span>
            {homework.materialIds.length > 0 && (
              <span className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                {homework.materialIds.length}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
