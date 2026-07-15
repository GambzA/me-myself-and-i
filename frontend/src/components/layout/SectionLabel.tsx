const NAMES = ['About Me', 'Work History', 'Projects', 'Contact']
const NUMS = ['01', '02', '03', '04']

export function SectionLabel({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="fixed bottom-4 left-4 z-[200] flex items-center gap-3 pointer-events-none transition-opacity duration-300 sm:bottom-8 sm:left-8">
      <span className="font-mono text-[0.7rem] tracking-[0.1em] text-accent">{NUMS[activeIndex]}</span>
      <span className="text-xs font-medium tracking-[0.08em] text-text-muted uppercase">
        {NAMES[activeIndex]}
      </span>
    </div>
  )
}
