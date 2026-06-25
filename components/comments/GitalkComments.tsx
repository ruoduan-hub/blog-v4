'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type Gitalk from 'gitalk'
import { getGitalkId, getLegacyCommentUrl } from '@/data/gitalk-legacy-ids'

type GitalkCommentsProps = {
  slug: string
  title?: string
}

type GitalkRuntimeOptions = Gitalk.GitalkOptions & {
  url: string
}

function parseAdmins(value?: string) {
  return (value || 'ruoduan-hub')
    .split(',')
    .map((admin) => admin.trim())
    .filter(Boolean)
}

function getGitalkConfig(slug: string, title?: string) {
  const config = {
    clientID: process.env.NEXT_PUBLIC_GITALK_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_GITALK_CLIENT_SECRET,
    repo: process.env.NEXT_PUBLIC_GITALK_REPO || 'GatsbtBlogCommentStore',
    owner: process.env.NEXT_PUBLIC_GITALK_OWNER || 'ruoduan-hub',
    admin: parseAdmins(process.env.NEXT_PUBLIC_GITALK_ADMIN),
    id: getGitalkId(slug),
    title: title || slug,
    url: getLegacyCommentUrl(slug),
  }

  return {
    config,
    missingKeys: Object.entries(config)
      .filter(
        ([key, value]) => ['clientID', 'clientSecret', 'repo', 'owner'].includes(key) && !value
      )
      .map(([key]) => key),
  }
}

export function GitalkComments({ slug, title }: GitalkCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string>()
  const { config, missingKeys } = useMemo(() => getGitalkConfig(slug, title), [slug, title])

  useEffect(() => {
    if (missingKeys.length > 0 || !containerRef.current) return undefined

    let mounted = true
    const container = containerRef.current
    container.innerHTML = ''
    setError(undefined)

    import('gitalk')
      .then(({ default: GitalkConstructor }) => {
        if (!mounted) return

        const gitalkOptions: GitalkRuntimeOptions = {
          clientID: config.clientID || '',
          clientSecret: config.clientSecret || '',
          repo: config.repo,
          owner: config.owner,
          admin: config.admin,
          id: config.id,
          title: config.title,
          url: config.url,
          labels: ['Gitalk'],
          language: 'zh-CN',
          distractionFreeMode: false,
        }

        const gitalk = new GitalkConstructor(gitalkOptions)

        gitalk.render(container)
      })
      .catch(() => {
        if (mounted) setError('评论模块加载失败，请稍后刷新重试。')
      })

    return () => {
      mounted = false
      container.innerHTML = ''
    }
  }, [config, missingKeys.length])

  if (missingKeys.length > 0) {
    return (
      <p className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
        Gitalk 评论未配置：缺少 {missingKeys.join(', ')}。
      </p>
    )
  }

  return (
    <div className="gitalk-shell text-left">
      {error && (
        <p className="mb-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          {error}
        </p>
      )}
      <div ref={containerRef} />
    </div>
  )
}
