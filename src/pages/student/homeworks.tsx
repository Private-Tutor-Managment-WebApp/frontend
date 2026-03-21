import { useAuthStore } from '@/store/auth-store'
import { useHomeworkStore } from '@/store/homework-store'
import { useGroupStore } from '@/store/group-store'
import { HomeworkList } from '@/components/homework/homework-list'

export function StudentHomeworks() {
  const user = useAuthStore((s) => s.user)!
  const homeworks = useHomeworkStore((s) => s.homeworks)
  const submissions = useHomeworkStore((s) => s.submissions)
  const groups = useGroupStore((s) => s.groups)

  const myGroups = groups.filter((g) => g.studentIds.includes(user.id))
  const myGroupIds = myGroups.map((g) => g.id)

  const myHomeworks = homeworks.filter((h) =>
    (h.assignedTo.type === 'group' && myGroupIds.includes(h.assignedTo.groupId)) ||
    (h.assignedTo.type === 'students' && h.assignedTo.studentIds.includes(user.id))
  )

  const mySubmissions = submissions.filter((s) => s.studentId === user.id)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Мои задания ({myHomeworks.length})</h2>
      <HomeworkList
        homeworks={myHomeworks}
        linkPrefix="/student/homeworks"
        submissions={mySubmissions}
      />
    </div>
  )
}
