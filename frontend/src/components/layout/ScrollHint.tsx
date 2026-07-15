export function ScrollHint({ activeIndex }: { activeIndex: number }) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 z-[200] hidden -translate-x-1/2 flex-col items-center gap-2 pointer-events-none transition-opacity duration-500 min-[901px]:flex ${
        activeIndex > 0 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className="font-mono text-[0.65rem] tracking-[0.12em] text-text-muted uppercase">Scroll</span>
      <div className="h-10 w-px animate-scroll-line bg-gradient-to-b from-accent to-transparent" />
    </div>
  )
}
