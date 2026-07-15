import type { ReactNode, Ref } from 'react'

interface SectionProps {
  index: number
  activeIndex: number
  bgClassName: string
  innerClassName: string
  sectionRef: Ref<HTMLElement>
  children: ReactNode
}

export function Section({ index, activeIndex, bgClassName, innerClassName, sectionRef, children }: SectionProps) {
  const state = index === activeIndex ? 'is-active' : index < activeIndex ? 'is-above' : ''

  return (
    <section
      ref={sectionRef}
      className={`section relative flex items-center justify-center max-[900px]:items-start max-[900px]:justify-start ${state} ${bgClassName}`}
    >
      <div className={`section-inner w-full max-w-[1200px] ${innerClassName}`}>{children}</div>
    </section>
  )
}
