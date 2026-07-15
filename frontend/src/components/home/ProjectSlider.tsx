import { useEffect, useRef, useState, type TouchEvent } from 'react'
import type { Project } from '../../lib/types'
import { ProjectCard } from './ProjectCard'

const AUTO_MS = 3000
const GAP_PX = 20
const MOBILE_QUERY = '(max-width: 900px)'

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches)

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY)
    const handler = () => setIsMobile(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return isMobile
}

export function ProjectSlider({ projects }: { projects: Project[] }) {
  const isMobile = useIsMobile()
  const useSlider = isMobile || projects.length > 3

  if (!useSlider) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    )
  }

  return <SliderView projects={projects} isMobile={isMobile} />
}

function SliderView({ projects, isMobile }: { projects: Project[]; isMobile: boolean }) {
  const perPage = isMobile ? 1 : 3
  const numPages = Math.max(1, Math.ceil(projects.length / perPage))

  const viewportRef = useRef<HTMLDivElement>(null)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [current, setCurrent] = useState(0)
  const pingDirRef = useRef(1)
  const touchStartRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    setViewportWidth(el.clientWidth)
    const observer = new ResizeObserver(() => setViewportWidth(el.clientWidth))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setCurrent((c) =>
      isMobile ? ((c % numPages) + numPages) % numPages : Math.max(0, Math.min(c, numPages - 1)),
    )
  }, [numPages, isMobile])

  useEffect(() => {
    if (!isMobile || numPages <= 1) return
    const timer = setInterval(() => {
      setCurrent((c) => {
        let dir = pingDirRef.current
        if (c + dir >= numPages) dir = -1
        if (c + dir < 0) dir = 1
        pingDirRef.current = dir
        return c + dir
      })
    }, AUTO_MS)
    return () => clearInterval(timer)
  }, [isMobile, numPages])

  function goTo(page: number) {
    setCurrent(isMobile ? ((page % numPages) + numPages) % numPages : Math.max(0, Math.min(page, numPages - 1)))
  }

  function handleTouchStart(e: TouchEvent) {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function handleTouchEnd(e: TouchEvent) {
    const dx = touchStartRef.current.x - e.changedTouches[0].clientX
    const dy = touchStartRef.current.y - e.changedTouches[0].clientY
    if (Math.abs(dy) >= Math.abs(dx) || Math.abs(dx) < 30) return
    goTo(dx > 0 ? current + 1 : current - 1)
  }

  const cardWidth = perPage === 1 ? viewportWidth : (viewportWidth - (perPage - 1) * GAP_PX) / perPage

  return (
    <div>
      <div ref={viewportRef} className="w-full overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div
          className="project-slider-track flex flex-nowrap gap-5"
          style={{ transform: `translateX(${-(current * (viewportWidth + GAP_PX))}px)` }}
        >
          {projects.map((project) => (
            <div key={project.id} style={{ flex: `0 0 ${cardWidth}px`, maxWidth: `${cardWidth}px` }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          aria-label="Previous slide"
          disabled={!isMobile && current === 0}
          onClick={() => goTo(current - 1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-border bg-card text-text-muted transition-colors hover:border-accent hover:text-text hover:shadow-[0_0_10px_var(--accent-glow)] disabled:opacity-25"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex items-center gap-[0.4rem]">
          {Array.from({ length: numPages }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`relative h-1.5 w-1.5 rounded-full transition-transform after:absolute after:-inset-1.5 after:content-[''] ${
                i === current ? 'scale-150 bg-accent' : 'bg-border hover:bg-text-muted'
              }`}
            />
          ))}
        </div>

        <button
          aria-label="Next slide"
          disabled={!isMobile && current === numPages - 1}
          onClick={() => goTo(current + 1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-border bg-card text-text-muted transition-colors hover:border-accent hover:text-text hover:shadow-[0_0_10px_var(--accent-glow)] disabled:opacity-25"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
