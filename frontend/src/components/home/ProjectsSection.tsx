import { useState } from 'react'
import type { ProjectCategory } from '../../lib/types'
import { ProjectSlider } from './ProjectSlider'

export function ProjectsSection({ categories }: { categories: ProjectCategory[] }) {
  const [activeKey, setActiveKey] = useState(categories[0]?.key)
  const active = categories.find((c) => c.key === activeKey) ?? categories[0]

  if (!active) return null

  return (
    <div className="flex w-full flex-col items-center">
      <h2 className="mb-10 text-center text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em] text-text">
        My <span className="text-accent">Projects</span>
      </h2>

      <div className="mb-10 flex gap-1 rounded-xl border border-border bg-card p-1">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setActiveKey(category.key)}
            className={`rounded-[9px] px-7 py-2.5 text-sm font-medium tracking-[0.01em] transition-all ${
              category.key === active.key
                ? 'bg-accent text-white shadow-[0_0_20px_var(--accent-glow)]'
                : 'text-text-muted hover:bg-border hover:text-text'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="w-full">
        {active.description && (
          <p className="mx-auto mb-4 max-w-[520px] text-center text-[0.9rem] leading-[1.7] text-text-muted">
            {active.description}
          </p>
        )}
        <ProjectSlider projects={active.projects} />
      </div>
    </div>
  )
}
