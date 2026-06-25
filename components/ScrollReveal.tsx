'use client'

import { motion, type Variants } from 'motion/react'
import { type ReactNode } from 'react'

const defaultTransition = {
  duration: 0.5,
  ease: [0.25, 0.1, 0.25, 1] as const,
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const variants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ...defaultTransition, delay },
    },
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}
