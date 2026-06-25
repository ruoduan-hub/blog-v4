'use client'

import { motion } from 'motion/react'
import Link from '@/components/Link'
import { Button } from '@/components/ui/button'
import { profile } from '@/data/profile'

type LabHeroProps = {
  postCount: number
}

const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

export function LabHero({ postCount }: LabHeroProps) {
  return (
    <section className="grid gap-8 pt-10 pb-12 md:grid-cols-[1fr_220px] md:items-end">
      <div className="max-w-3xl">
        <motion.p
          custom={0}
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mb-3 text-xs font-medium tracking-widest text-gray-500 uppercase dark:text-gray-400"
        >
          Chad Lab
        </motion.p>
        <motion.h1
          custom={1}
          variants={stagger}
          initial="initial"
          animate="animate"
          className="text-4xl leading-tight font-semibold tracking-normal text-gray-950 sm:text-5xl dark:text-gray-50"
        >
          我的 Web 开发技术随笔
        </motion.h1>
        <motion.p
          custom={2}
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mt-6 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300"
        >
          {profile.intro}
        </motion.p>
        <motion.div
          custom={3}
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mt-8 flex flex-wrap gap-3"
        >
          <Button render={<Link href="/blog" />}>浏览文章</Button>
          <Button variant="outline" render={<Link href="/about" />}>
            关于我
          </Button>
        </motion.div>
      </div>
      <motion.div
        custom={0}
        variants={stagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 text-center dark:border-gray-800 dark:bg-gray-800"
      >
        <div className="bg-white p-4 dark:bg-gray-950">
          <p className="text-2xl font-semibold text-gray-950 dark:text-gray-50">{postCount}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">文章</p>
        </div>
        <div className="bg-white p-4 dark:bg-gray-950">
          <p className="text-2xl font-semibold text-gray-950 dark:text-gray-50">
            {profile.music.length}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">曲目</p>
        </div>
      </motion.div>
    </section>
  )
}
