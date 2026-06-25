'use client'

import { motion } from 'motion/react'
import type { Blog } from 'contentlayer/generated'
import { formatDate } from 'pliny/utils/formatDate'
import type { CoreContent } from 'pliny/utils/contentlayer'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'

type PostFeedProps = {
  posts: CoreContent<Blog>[]
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

export function PostFeed({ posts }: PostFeedProps) {
  if (!posts.length) {
    return <p className="py-10 text-sm text-gray-500 dark:text-gray-400">还没有文章。</p>
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-800">
      {posts.map((post, index) => {
        const { slug, date, title, summary, tags } = post

        return (
          <motion.li
            key={slug}
            custom={index}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="py-8"
          >
            <article className="grid gap-4 md:grid-cols-[132px_1fr] md:items-start">
              <time
                dateTime={date}
                className="text-sm font-medium text-gray-500 dark:text-gray-400"
                suppressHydrationWarning
              >
                {formatDate(date, siteMetadata.locale)}
              </time>
              <div>
                <h2 className="text-2xl leading-8 font-semibold tracking-normal">
                  <Link href={`/blog/${slug}`} className="text-gray-950 dark:text-gray-50">
                    {title}
                  </Link>
                </h2>
                <div className="mt-2 flex flex-wrap">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
                {summary && (
                  <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-400">
                    {summary}
                  </p>
                )}
                <Link
                  href={`/blog/${slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-gray-950 underline underline-offset-4 dark:text-gray-50"
                  aria-label={`阅读文章：${title}`}
                >
                  继续阅读
                </Link>
              </div>
            </article>
          </motion.li>
        )
      })}
    </ul>
  )
}
