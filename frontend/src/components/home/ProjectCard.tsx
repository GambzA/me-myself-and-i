import type { Project } from '../../lib/types'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[0_8px_30px_var(--accent-glow)]">
      <div className="aspect-video w-full bg-[linear-gradient(135deg,var(--color-bg-alt)_0%,var(--color-border)_100%)]">
        {project.image_url && (
          <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="p-5">
        <h4 className="mb-1.5 flex flex-wrap items-center gap-2 text-[0.95rem] font-semibold text-text">
          {project.title}
          {project.is_investor && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(253,230,138,0.2)] bg-[rgba(253,230,138,0.08)] px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.06em] text-[#fde68a] uppercase shadow-[0_0_6px_rgba(253,230,138,0.15),0_0_14px_rgba(253,230,138,0.06)] [text-shadow:0_0_8px_rgba(253,230,138,0.5)]">
              Investor
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 drop-shadow-[0_0_3px_rgba(253,230,138,0.7)]"
              >
                <path d="M12 2 L13.6 10.4 L22 12 L13.6 13.6 L12 22 L10.4 13.6 L2 12 L10.4 10.4 Z" />
              </svg>
            </span>
          )}
        </h4>
        {project.description && (
          <p className="mb-3.5 text-[0.82rem] leading-relaxed text-text-muted">{project.description}</p>
        )}
        {project.link_url && (
          <a
            href={project.link_url}
            target="_blank"
            rel="noopener"
            className="text-[0.82rem] font-medium text-accent-2 transition-colors hover:text-accent"
          >
            View Project →
          </a>
        )}
      </div>
    </div>
  )
}
