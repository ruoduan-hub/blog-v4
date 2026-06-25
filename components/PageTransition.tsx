'use client'

import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      {children}
    </motion.div>
  )
}
