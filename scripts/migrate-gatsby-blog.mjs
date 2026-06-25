import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const BLOG_DIR = 'content/blog'
const DEFAULT_SOURCE_ROOT = '/Users/ruoduan/dev/my-Gatsby-Blog'

export function normalizeList(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  if (value === undefined || value === null || value === '') return []
  return [String(value)]
}

function formatDate(value) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  return String(value || '')
}

function extractRawField(raw, field) {
  const match = raw.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'))
  if (!match) return undefined

  return match[1].trim().replace(/^['"]|['"]$/g, '')
}

function createSummary(body) {
  return body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[[^\]]+]\([^)]+\)/g, '')
    .replace(/[#>*_`~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)
}

function escapeMdxText(value) {
  const allowedHtmlTags = new Set([
    'a',
    'audio',
    'br',
    'details',
    'font',
    'iframe',
    'img',
    'mark',
    'source',
    'strong',
    'summary',
    'video',
  ])

  return value
    .replace(/<\/?([A-Za-z][A-Za-z0-9-]*)(?=[\s/>])/g, (match, tag) => {
      return allowedHtmlTags.has(String(tag).toLowerCase()) ? match : match.replace('<', '&lt;')
    })
    .replace(
      /<(?!\/?(?:a|audio|br|details|font|iframe|img|mark|source|strong|summary|video)(?=[\s/>]))/gi,
      '&lt;'
    )
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;')
}

function escapeMdxTextOutsideInlineCode(line) {
  return line
    .split(/(`+[^`]*`+)/g)
    .map((part) => (part.startsWith('`') ? part : escapeMdxText(part)))
    .join('')
}

function escapeMdxInMarkdownText(body) {
  const lines = body.split('\n')
  let inCodeFence = false

  return lines
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inCodeFence = !inCodeFence
        return line
      }

      if (inCodeFence) return line
      return escapeMdxTextOutsideInlineCode(line)
    })
    .join('\n')
}

function normalizeLooseCodeBlocks(body) {
  return body.replace(/(^|\n)`\n([\s\S]*?)\n`(?=\n|$)/g, '$1```\n$2\n```')
}

export function normalizeFrontmatter(frontmatter, raw = '', body = '') {
  const summary = frontmatter.description || frontmatter.summary || createSummary(body)

  return {
    title: String(frontmatter.title || ''),
    date: extractRawField(raw, 'date') || formatDate(frontmatter.date),
    tags: normalizeList(frontmatter.tags),
    categories: normalizeList(frontmatter.categories),
    draft: Boolean(frontmatter.draft ?? false),
    summary: summary ? String(summary) : undefined,
    authors: ['default'],
  }
}

export function toMdxSafeBody(body) {
  const safeHtmlBody = normalizeLooseCodeBlocks(body)
    .replace(/<br>/g, '<br />')
    .replace(/\sstyle=["']\s*zoom:\s*([0-9.]+)%\s*;?\s*["']/g, ' data-zoom="$1"')
    .replace(/\s(width|height)=([0-9]+)(?=[\s>])/g, ' $1="$2"')
    .replace(/\s([A-Za-z][\w:-]*)=([^\s"'>{}]+)(?=[\s>])/g, ' $1="$2"')
    .replace(/frameborder=/g, 'frameBorder=')
    .replace(/allowfullscreen=/g, 'allowFullScreen=')
    .replace(/\smarginwidth="[^"]*"/g, '')
    .replace(/\smarginheight="[^"]*"/g, '')
    .replace(/src="\/\//g, 'src="https://')

  return escapeMdxInMarkdownText(safeHtmlBody)
}

function isRemoteAsset(assetPath) {
  return /^(https?:)?\/\//.test(assetPath) || assetPath.startsWith('/') || assetPath.startsWith('#')
}

function cleanAssetPath(assetPath) {
  return decodeURIComponent(assetPath)
    .replace(/^.\//, '')
    .replace(/\?.*$/, '')
    .replace(/&amp;.*$/, '')
}

function rewriteOneAsset(assetPath, slug, assets) {
  if (isRemoteAsset(assetPath)) return assetPath

  const clean = cleanAssetPath(assetPath)
  const fileName = path.basename(clean)
  const sourceAsset = clean.includes('/') ? clean : `${slug}/${clean}`
  assets.add(sourceAsset)

  return `/static/blog/${slug}/${fileName}`
}

export function rewriteAssetRefs(body, slug) {
  const assets = new Set()
  const markdownImagePattern = /(!\[[^\]]*]\()([^)]+)(\))/g
  const htmlImagePattern = /(<img\s+[^>]*src=["'])([^"']+)(["'][^>]*>)/g

  const nextBody = body
    .replace(markdownImagePattern, (_match, prefix, src, suffix) => {
      return `${prefix}${rewriteOneAsset(src, slug, assets)}${suffix}`
    })
    .replace(htmlImagePattern, (_match, prefix, src, suffix) => {
      return `${prefix}${rewriteOneAsset(src, slug, assets)}${suffix}`
    })

  return { body: nextBody, assets: [...assets] }
}

async function findSameStemAsset(dir, fileName) {
  const stem = path.parse(fileName).name

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const match = entries.find((entry) => entry.isFile() && path.parse(entry.name).name === stem)
    return match?.name
  } catch {
    return undefined
  }
}

async function copyAsset({ sourceBlogDir, targetAssetDir, slug, asset }) {
  const directSource = path.join(sourceBlogDir, asset)
  const fallbackSource = path.join(sourceBlogDir, slug, path.basename(asset))
  const fallbackDir = path.join(sourceBlogDir, slug)
  const requestedFileName = path.basename(asset)

  try {
    const targetAsset = path.join(targetAssetDir, slug, requestedFileName)
    await fs.mkdir(path.dirname(targetAsset), { recursive: true })
    await fs.copyFile(directSource, targetAsset)
    return requestedFileName
  } catch {
    try {
      const targetAsset = path.join(targetAssetDir, slug, requestedFileName)
      await fs.mkdir(path.dirname(targetAsset), { recursive: true })
      await fs.copyFile(fallbackSource, targetAsset)
      return requestedFileName
    } catch {
      const sameStemFile = await findSameStemAsset(fallbackDir, requestedFileName)
      if (!sameStemFile) return null

      const targetAsset = path.join(targetAssetDir, slug, sameStemFile)
      await fs.mkdir(path.dirname(targetAsset), { recursive: true })
      await fs.copyFile(path.join(fallbackDir, sameStemFile), targetAsset)
      return sameStemFile
    }
  }
}

export async function migrateAll({ sourceRoot, targetRoot, publicRoot, cleanTarget }) {
  const sourceBlogDir = path.join(sourceRoot, BLOG_DIR)
  const targetBlogDir = path.join(targetRoot, 'data/blog')
  const targetAssetDir = path.join(publicRoot, 'static/blog')

  if (cleanTarget) {
    await fs.rm(targetBlogDir, { recursive: true, force: true })
    await fs.rm(targetAssetDir, { recursive: true, force: true })
  }

  await fs.mkdir(targetBlogDir, { recursive: true })
  await fs.mkdir(targetAssetDir, { recursive: true })

  const entries = await fs.readdir(sourceBlogDir, { withFileTypes: true })
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort()

  const result = { posts: 0, assets: 0, missingAssets: [] }

  for (const fileName of markdownFiles) {
    const slug = fileName.replace(/\.md$/, '')
    const sourceFile = path.join(sourceBlogDir, fileName)
    const raw = await fs.readFile(sourceFile, 'utf8')
    const parsed = matter(raw)
    const safeBody = toMdxSafeBody(parsed.content)
    const rewritten = rewriteAssetRefs(safeBody, slug)
    const frontmatter = normalizeFrontmatter(parsed.data, raw, parsed.content)
    let nextBody = rewritten.body

    for (const asset of rewritten.assets) {
      const copiedFileName = await copyAsset({ sourceBlogDir, targetAssetDir, slug, asset })
      if (copiedFileName) {
        const requestedPath = `/static/blog/${slug}/${path.basename(asset)}`
        const copiedPath = `/static/blog/${slug}/${copiedFileName}`
        nextBody = nextBody.replaceAll(requestedPath, copiedPath)
        result.assets += 1
      } else {
        result.missingAssets.push(asset)
      }
    }

    const output = matter.stringify(nextBody, frontmatter)

    await fs.writeFile(path.join(targetBlogDir, `${slug}.mdx`), output)
    result.posts += 1
  }

  return result
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const sourceRoot = process.argv[2] || DEFAULT_SOURCE_ROOT
  const targetRoot = process.cwd()
  const publicRoot = path.join(targetRoot, 'public')
  const result = await migrateAll({
    sourceRoot,
    targetRoot,
    publicRoot,
    cleanTarget: process.argv.includes('--clean-target'),
  })

  console.log(JSON.stringify(result, null, 2))
}
