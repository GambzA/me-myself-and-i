const LABELS = ['About Me', 'Work History', 'Projects', 'Contact']

interface NavDotsProps {
  activeIndex: number
  onSelect: (index: number) => void
}

export function NavDots({ activeIndex, onSelect }: NavDotsProps) {
  return (
    <nav
      aria-label="Section navigation"
      className="fixed top-1/2 right-3 z-[200] flex -translate-y-1/2 flex-col gap-2.5 max-[900px]:right-3 max-[480px]:hidden"
    >
      {LABELS.map((label, i) => (
        <button
          key={label}
          aria-label={label}
          onClick={() => onSelect(i)}
          className={`relative h-2 w-2 rounded-full border-[1.5px] transition-all duration-300 after:absolute after:-inset-2.5 after:content-[''] ${
            i === activeIndex
              ? 'scale-[1.4] border-accent bg-accent shadow-[0_0_10px_var(--accent-glow)]'
              : 'border-text-dim bg-border'
          }`}
        />
      ))}
    </nav>
  )
}
