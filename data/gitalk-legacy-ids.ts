const LEGACY_SITE_URL = 'https://www.ruoduan.cn'
const GITHUB_LABEL_LIMIT = 50

export const gitalkLegacyIds: Record<string, string> = {}

function normalizeLegacySlug(slug: string) {
  return slug.replace(/^blog\//, '').replace(/^\/+|\/+$/g, '')
}

export function getLegacyCommentUrl(slug: string) {
  const normalizedSlug = normalizeLegacySlug(slug)
  if (!normalizedSlug) return LEGACY_SITE_URL

  return `${LEGACY_SITE_URL}/${normalizedSlug}/`
}

/**
 * 旧 Gatsby 博客没有显式传 Gitalk id，Gitalk 默认使用 window.location.href。
 * 新站路由变为 /blog/:slug，但评论标识仍优先使用旧文章 URL，避免历史评论 issue 失联。
 */
export function getGitalkId(slug: string) {
  const normalizedSlug = normalizeLegacySlug(slug)
  const legacyId = gitalkLegacyIds[normalizedSlug]
  if (legacyId) return legacyId

  const legacyUrl = getLegacyCommentUrl(normalizedSlug)
  if (legacyUrl.length <= GITHUB_LABEL_LIMIT) return legacyUrl

  const legacyPath = `/${normalizedSlug}/`
  if (legacyPath.length <= GITHUB_LABEL_LIMIT) return legacyPath

  return legacyPath.slice(0, GITHUB_LABEL_LIMIT)
}
