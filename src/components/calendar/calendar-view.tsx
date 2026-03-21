import { useState, useMemo } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, parseISO, isToday,
  addMonths, subMonths, getDay,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Homework, Lesson } from '@/types'

interface CalendarViewProps {
  homeworks: Homework[]
  lessons?: Lesson[]
}

// Convert JS getDay() (0=Sun) to our format (0=Mon)
function toDayOfWeek(date: Date): number {
  const d = getDay(date)
  return d === 0 ? 6 : d - 1
}

export function CalendarView({ homeworks, lessons = [] }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const start = startOfWeek(monthStart, { weekStartsOn: 1 })
    const end = endOfWeek(monthEnd, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const hwByDate = useMemo(() => {
    const map = new Map<string, Homework[]>()
    homeworks.forEach((hw) => {
      const key = format(parseISO(hw.deadline), 'yyyy-MM-dd')
      const arr = map.get(key) ?? []
      arr.push(hw)
      map.set(key, arr)
    })
    return map
  }, [homeworks])

  const lessonsByDay = useMemo(() => {
    const map = new Map<number, Lesson[]>()
    lessons.forEach((l) => {
      const arr = map.get(l.dayOfWeek) ?? []
      arr.push(l)
      map.set(l.dayOfWeek, arr)
    })
    return map
  }, [lessons])

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base">
          {format(currentMonth, 'LLLL yyyy', { locale: ru })}
        </CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-px">
          {weekDays.map((d) => (
            <div key={d} className="p-2 text-center text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}
          {days.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd')
            const dayHomeworks = hwByDate.get(dateKey) ?? []
            const dayLessons = lessonsByDay.get(toDayOfWeek(day)) ?? []
            const inMonth = isSameMonth(day, currentMonth)
            const allEvents = [
              ...dayLessons.map((l) => ({ type: 'lesson' as const, id: l.id, label: `${l.time} ${l.title}` })),
              ...dayHomeworks.map((hw) => ({ type: 'homework' as const, id: hw.id, label: hw.title })),
            ]

            return (
              <div
                key={dateKey}
                className={cn(
                  'min-h-[80px] rounded-md border p-1',
                  !inMonth && 'opacity-30',
                  isToday(day) && 'border-primary bg-primary/5'
                )}
              >
                <span className={cn(
                  'text-xs',
                  isToday(day) && 'font-bold text-primary'
                )}>
                  {format(day, 'd')}
                </span>
                <div className="mt-1 space-y-0.5">
                  {allEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className={cn(
                        'truncate rounded px-1 py-0.5 text-[10px]',
                        ev.type === 'lesson'
                          ? 'bg-success/10 text-success'
                          : 'bg-primary/10 text-primary'
                      )}
                      title={ev.label}
                    >
                      {ev.label}
                    </div>
                  ))}
                  {allEvents.length > 3 && (
                    <div className="text-[10px] text-muted-foreground">
                      +{allEvents.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-success" /> Занятия
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" /> Дедлайны
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
