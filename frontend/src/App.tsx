import { BrowserRouter, Route, Routes } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import { HomePage } from './pages/HomePage'
import { BlogIndexPage } from './pages/BlogIndexPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { LoginPage } from './pages/admin/LoginPage'
import { ProtectedRoute } from './components/admin/ProtectedRoute'
import { AdminLayout } from './components/admin/AdminLayout'
import { DashboardPage } from './pages/admin/DashboardPage'
import { WorkHistoryAdminPage } from './pages/admin/WorkHistoryAdminPage'
import { ProjectsAdminPage } from './pages/admin/ProjectsAdminPage'
import { SkillsAdminPage } from './pages/admin/SkillsAdminPage'
import { BlogAdminPage } from './pages/admin/BlogAdminPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="work-history" element={<WorkHistoryAdminPage />} />
            <Route path="projects" element={<ProjectsAdminPage />} />
            <Route path="skills" element={<SkillsAdminPage />} />
            <Route path="blog" element={<BlogAdminPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
