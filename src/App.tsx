import { useEffect, Component, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import { AppLayout } from '@/components/layout/app-layout'
import { LoginPage } from '@/pages/login-page'
import { RegisterPage } from '@/pages/register-page'
import { TeacherDashboard } from '@/pages/teacher/dashboard'
import { TeacherHomeworks } from '@/pages/teacher/homeworks'
import { TeacherHomeworkDetail } from '@/pages/teacher/homework-detail'
import { TeacherGroups } from '@/pages/teacher/groups'
import { TeacherGroupDetail } from '@/pages/teacher/group-detail'
import { TeacherMaterials } from '@/pages/teacher/materials'
import { TeacherCalendar } from '@/pages/teacher/calendar'
import { StudentDashboard } from '@/pages/student/dashboard'
import { StudentHomeworks } from '@/pages/student/homeworks'
import { StudentHomeworkDetail } from '@/pages/student/homework-detail'
import { StudentMaterials } from '@/pages/student/materials'
import { StudentCalendar } from '@/pages/student/calendar'
import type { UserRole } from '@/types'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, color: 'red' }}>
          <h2>Ошибка приложения</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, marginTop: 8 }}>{this.state.error.stack}</pre>
          <button onClick={() => { this.setState({ error: null }); window.history.back() }} style={{ marginTop: 16 }}>
            Назад
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: UserRole }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }
  return <>{children}</>
}

function App() {
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    useAuthStore.getState().loadSession()
  }, [])

  return (
    <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="teacher">
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="homeworks" element={<TeacherHomeworks />} />
          <Route path="homeworks/:id" element={<TeacherHomeworkDetail />} />
          <Route path="groups" element={<TeacherGroups />} />
          <Route path="groups/:id" element={<TeacherGroupDetail />} />
          <Route path="materials" element={<TeacherMaterials />} />
          <Route path="calendar" element={<TeacherCalendar />} />
        </Route>

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="homeworks" element={<StudentHomeworks />} />
          <Route path="homeworks/:id" element={<StudentHomeworkDetail />} />
          <Route path="materials" element={<StudentMaterials />} />
          <Route path="calendar" element={<StudentCalendar />} />
        </Route>

        <Route
          path="*"
          element={
            user ? (
              <Navigate to={`/${user.role}/dashboard`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
