import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { mockUsers } from '@/mock'
import type { StudentGroup } from '@/types'

interface GroupListProps {
  groups: StudentGroup[]
}

export function GroupList({ groups }: GroupListProps) {
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Users className="mb-2 h-12 w-12" />
        <p className="text-lg">Нет групп</p>
        <p className="text-sm">Создайте первую группу</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <Link key={group.id} to={`/teacher/groups/${group.id}`}>
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{group.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {group.studentIds.length}{' '}
                    {group.studentIds.length === 1
                      ? 'ученик'
                      : group.studentIds.length >= 2 && group.studentIds.length <= 4
                        ? 'ученика'
                        : 'учеников'}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex -space-x-2">
                {group.studentIds.slice(0, 5).map((sid) => {
                  const student = mockUsers.find((u) => u.id === sid)
                  return (
                    <div
                      key={sid}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium"
                      title={student?.name}
                    >
                      {student?.name?.charAt(0)}
                    </div>
                  )
                })}
                {group.studentIds.length > 5 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                    +{group.studentIds.length - 5}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
