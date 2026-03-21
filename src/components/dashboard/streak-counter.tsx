import { useEffect, useState } from 'react'
import { useStreak } from '@/hooks/use-streak'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame } from 'lucide-react'

interface StreakCounterProps {
  studentId: string
}

export function StreakCounter({ studentId }: StreakCounterProps) {
  const { streak, totalSubmissions } = useStreak(studentId)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    const milestones = [5, 10, 20, 30, 50]
    if (milestones.includes(streak)) {
      setToastMessage(`${streak} дней подряд! Так держать!`)
      setShowToast(true)
      const timer = setTimeout(() => setShowToast(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [streak])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Серия сдач</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className={streak > 0 ? 'streak-animate' : ''}>
            <Flame
              className={`h-12 w-12 ${streak > 0 ? 'text-warning' : 'text-muted-foreground'}`}
            />
          </div>
          <div>
            <p className="text-3xl font-bold">
              {streak} {streak === 1 ? 'день' : streak >= 2 && streak <= 4 ? 'дня' : 'дней'}
            </p>
            <p className="text-sm text-muted-foreground">
              Всего сдано: {totalSubmissions}
            </p>
          </div>
        </div>
        {showToast && (
          <div className="mt-3 rounded-md bg-warning/10 p-3 text-sm text-warning">
            🎉 {toastMessage}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
