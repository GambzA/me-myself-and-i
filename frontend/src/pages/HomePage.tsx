import { useEffect, useState } from 'react'
import { NavDots } from '../components/layout/NavDots'
import { Section } from '../components/layout/Section'
import { SectionLabel } from '../components/layout/SectionLabel'
import { ScrollHint } from '../components/layout/ScrollHint'
import { AboutSection } from '../components/home/AboutSection'
import { WorkSection } from '../components/home/WorkSection'
import { ProjectsSection } from '../components/home/ProjectsSection'
import { ContactSection } from '../components/home/ContactSection'
import { useSectionScroll } from '../hooks/useSectionScroll'
import { api } from '../lib/api'
import type { Homepage } from '../lib/types'

const SECTION_COUNT = 4

export function HomePage() {
  const { currentIndex, goToSection, setSectionRef } = useSectionScroll(SECTION_COUNT)
  const [data, setData] = useState<Homepage | null>(null)

  useEffect(() => {
    api.get<Homepage>('/api/homepage').then(setData)
  }, [])

  if (!data) {
    return <div className="flex h-dvh items-center justify-center bg-bg text-text-muted">Loading…</div>
  }

  return (
    <div className="h-dvh overflow-hidden bg-bg">
      <NavDots activeIndex={currentIndex} onSelect={goToSection} />
      <SectionLabel activeIndex={currentIndex} />
      <ScrollHint activeIndex={currentIndex} />

      <Section
        index={0}
        activeIndex={currentIndex}
        sectionRef={setSectionRef(0)}
        bgClassName="bg-bg before:absolute before:-top-[200px] before:-right-[100px] before:h-[600px] before:w-[600px] before:rounded-full before:bg-[radial-gradient(circle,var(--accent-glow)_0%,transparent_70%)] before:content-[''] before:pointer-events-none"
        innerClassName="px-6 py-18 md:px-16 md:py-0"
      >
        <AboutSection />
      </Section>

      <Section
        index={1}
        activeIndex={currentIndex}
        sectionRef={setSectionRef(1)}
        bgClassName="bg-bg-alt"
        innerClassName="px-6 py-18 md:px-16 md:py-0"
      >
        <WorkSection workHistory={data.work_history} skillGroups={data.skill_groups} />
      </Section>

      <Section
        index={2}
        activeIndex={currentIndex}
        sectionRef={setSectionRef(2)}
        bgClassName="bg-bg"
        innerClassName="px-6 py-18 md:px-16 md:py-8 max-h-full overflow-y-auto [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin]"
      >
        <ProjectsSection categories={data.project_categories} />
      </Section>

      <Section
        index={3}
        activeIndex={currentIndex}
        sectionRef={setSectionRef(3)}
        bgClassName="bg-bg-alt before:absolute before:-top-[100px] before:-right-[100px] before:h-[500px] before:w-[500px] before:rounded-full before:bg-[radial-gradient(circle,var(--accent-glow),transparent_70%)] before:content-[''] before:pointer-events-none"
        innerClassName="px-6 py-18 md:px-16 md:py-0"
      >
        <ContactSection />
      </Section>
    </div>
  )
}
