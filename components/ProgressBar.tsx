'use client'

import { motion, useAnimate } from 'motion/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function ProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [scope, animate] = useAnimate()

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      await animate(scope.current, { scaleX: [0, 0.25], opacity: 1 }, { duration: 0.08 })
      if (cancelled) return
      await animate(scope.current, { scaleX: 0.55 }, { duration: 0.12 })
      if (cancelled) return
      await animate(scope.current, { scaleX: 0.82 }, { duration: 0.15 })
      if (cancelled) return
      await animate(scope.current, { scaleX: 0.96 }, { duration: 0.25 })
      if (cancelled) return
      await animate(scope.current, { scaleX: 1 }, { duration: 0.05 })
      await animate(scope.current, { opacity: 0 }, { duration: 0.15 })
      if (!cancelled) {
        animate(scope.current, { scaleX: 0 }, { duration: 0 })
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [pathname, searchParams, animate, scope])

  return (
    <motion.div
      ref={scope}
      initial={{ scaleX: 0, opacity: 0 }}
      className="pointer-events-none fixed top-0 left-0 right-0 z-[9999] h-[2px] origin-left bg-primary-500"
    />
  )
}
