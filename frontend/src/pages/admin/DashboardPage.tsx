import { Link } from 'react-router'

const CARDS = [
  { to: '/admin/work-history', label: 'Work History', desc: 'Manage your career timeline entries.' },
  { to: '/admin/projects', label: 'Projects', desc: 'Manage project categories and project cards.' },
  { to: '/admin/skills', label: 'Skills', desc: 'Manage skill groups and individual skill tags.' },
  { to: '/admin/blog', label: 'Blog Posts', desc: 'Write, edit, and publish blog posts.' },
]

export function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-text">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent"
          >
            <h2 className="mb-2 font-semibold text-text">{card.label}</h2>
            <p className="text-sm text-text-muted">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
