import { useMemo } from 'react'
import { useHomeworkStore } from '@/store/homework-store'
import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns'

export function useStreak(studentId: string) {
  const submissions = useHomeworkStore((s) => s.submissions)

  return useMemo(() => {
    const studentSubs = submissions
      .filter((s) => s.studentId === studentId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    if (studentSubs.length === 0) return { streak: 0, totalSubmissions: 0 }

    const uniqueDays = [...new Set(
      studentSubs.map((s) => startOfDay(parseISO(s.submittedAt)).toISOString())
    )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    let streak = 1
    for (let i = 1; i < uniqueDays.length; i++) {
      const diff = differenceInCalendarDays(
        parseISO(uniqueDays[i - 1]),
        parseISO(uniqueDays[i])
      )
      if (diff === 1) {
        streak++
      } else {
        break
      }
    }

    // Check if the streak is current (last submission today or yesterday)
    const lastDay = parseISO(uniqueDays[0])
    const today = startOfDay(new Date())
    const daysSinceLast = differenceInCalendarDays(today, lastDay)
    if (daysSinceLast > 1) {
      streak = 0
    }

    return { streak, totalSubmissions: studentSubs.length }
  }, [submissions, studentId])
}
