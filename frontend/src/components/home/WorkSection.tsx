import { formatPeriod } from '../../lib/format'
import type { SkillGroup, WorkHistoryEntry } from '../../lib/types'

interface WorkSectionProps {
  workHistory: WorkHistoryEntry[]
  skillGroups: SkillGroup[]
}

export function WorkSection({ workHistory, skillGroups }: WorkSectionProps) {
  return (
    <div className="flex w-full flex-col items-start gap-10 max-[900px]:gap-10 md:flex-row md:gap-16">
      <div className="flex-1">
        <h2 className="mb-8 text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em] text-text">
          Work <span className="text-accent">History</span>
        </h2>

        <div className="relative pl-6 before:absolute before:top-1.5 before:left-0 before:bottom-0 before:w-px before:bg-[linear-gradient(to_bottom,var(--color-accent),var(--color-accent-2),transparent)]">
          {workHistory.map((entry, i) => (
            <div
              key={entry.id}
              className={`relative pl-5 ${i === workHistory.length - 1 ? 'pb-0' : 'pb-8'}`}
            >
              <div className="absolute top-1.5 -left-7 h-[9px] w-[9px] rounded-full border-2 border-bg-alt bg-accent shadow-[0_0_8px_var(--accent-glow)]" />
              <span className="mb-1 block font-mono text-[0.72rem] tracking-[0.05em] text-accent-2">
                {formatPeriod(entry.start_date, entry.end_date)}
              </span>
              <h3 className="mb-0.5 text-[0.95rem] leading-snug font-semibold text-text">{entry.role}</h3>
              <p className="text-[0.82rem] text-text-muted">
                {entry.company}
                {entry.company_note && <span className="ml-1 text-[0.8rem] text-accent">{entry.company_note}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <h2 className="mb-8 text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em] text-text">
          Skills <span className="text-accent">&amp; Tools</span>
        </h2>

        <div className="flex flex-col gap-[1.1rem]">
          {skillGroups.map((group) => (
            <div key={group.id}>
              <h4 className="mb-[0.45rem] font-mono text-[0.7rem] tracking-[0.1em] text-text-muted uppercase">
                {group.label}
              </h4>
              <div className="flex flex-wrap gap-[0.4rem]">
                {group.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className={`inline-block rounded-md border px-[0.65rem] py-1 text-xs font-medium transition-all hover:border-accent hover:text-text ${
                      skill.is_accent
                        ? 'border-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_15%,transparent)] text-[color-mix(in_srgb,var(--color-accent)_90%,white)]'
                        : 'border-border bg-card text-text-muted'
                    }`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
