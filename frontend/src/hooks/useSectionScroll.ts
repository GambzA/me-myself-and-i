import { useCallback, useEffect, useRef, useState } from 'react'

const ANIMATION_MS = 1150
const WHEEL_COOLDOWN_MS = 900
const TOUCH_COOLDOWN_MS = 900
const TOUCH_THRESHOLD_PX = 40

export function useSectionScroll(sectionCount: number) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentIndexRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  const goToSection = useCallback(
    (index: number) => {
      if (index < 0 || index >= sectionCount) return
      if (isAnimatingRef.current) return

      isAnimatingRef.current = true
      const target = sectionRefs.current[index]
      if (target) target.scrollTop = 0

      setCurrentIndex(index)
      setTimeout(() => {
        isAnimatingRef.current = false
      }, ANIMATION_MS)
    },
    [sectionCount],
  )

  useEffect(() => {
    let wheelCooldown = false
    let touchCooldown = false
    let touchStartX = 0
    let touchStartY = 0

    function handleWheel(e: WheelEvent) {
      e.preventDefault()
      if (isAnimatingRef.current || wheelCooldown) return
      wheelCooldown = true
      setTimeout(() => {
        wheelCooldown = false
      }, WHEEL_COOLDOWN_MS)
      goToSection(currentIndexRef.current + (e.deltaY > 0 ? 1 : -1))
    }

    function handleTouchStart(e: TouchEvent) {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }

    function handleTouchEnd(e: TouchEvent) {
      if (isAnimatingRef.current || touchCooldown) return

      const deltaX = touchStartX - e.changedTouches[0].clientX
      const deltaY = touchStartY - e.changedTouches[0].clientY

      if (Math.abs(deltaX) > Math.abs(deltaY)) return // horizontal swipe → slider handles it
      if (Math.abs(deltaY) < TOUCH_THRESHOLD_PX) return

      const section = sectionRefs.current[currentIndexRef.current]
      if (!section) return
      const atTop = section.scrollTop <= 2
      const atBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 2

      if (deltaY > 0 && !atBottom) return
      if (deltaY < 0 && !atTop) return

      touchCooldown = true
      setTimeout(() => {
        touchCooldown = false
      }, TOUCH_COOLDOWN_MS)
      goToSection(currentIndexRef.current + (deltaY > 0 ? 1 : -1))
    }

    function handleKeydown(e: KeyboardEvent) {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        goToSection(currentIndexRef.current + 1)
      }
      if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        goToSection(currentIndexRef.current - 1)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [goToSection])

  const setSectionRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      sectionRefs.current[index] = el
    },
    [],
  )

  return { currentIndex, goToSection, setSectionRef }
}
