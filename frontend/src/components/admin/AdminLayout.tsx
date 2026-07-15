import { NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/work-history', label: 'Work History', end: false },
  { to: '/admin/projects', label: 'Projects', end: false },
  { to: '/admin/skills', label: 'Skills', end: false },
  { to: '/admin/blog', label: 'Blog Posts', end: false },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-dvh bg-bg text-text">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-bg-alt p-6">
        <span className="mb-8 font-mono text-xs tracking-[0.1em] text-text-muted uppercase">Admin</span>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-accent text-white' : 'text-text-muted hover:bg-card hover:text-text'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
          <span className="truncate text-xs text-text-muted">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:border-accent hover:text-text"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
