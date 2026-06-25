import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const sourceRoot = process.argv[2] || '/Users/ruoduan/dev/my-Gatsby-Blog'
const sourceBlogDir = path.join(sourceRoot, 'content/blog')
const targetBlogDir = path.join(process.cwd(), 'data/blog')

async function listPosts(dir, ext) {
  const files = await fs.readdir(dir)
  return files.filter((file) => file.endsWith(ext)).sort()
}

function normalizeDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value)
}

const sourceFiles = await listPosts(sourceBlogDir, '.md')
const targetFiles = await listPosts(targetBlogDir, '.mdx')

if (sourceFiles.length !== targetFiles.length) {
  throw new Error(`文章数量不一致：旧站 ${sourceFiles.length}，新站 ${targetFiles.length}`)
}

for (const sourceFile of sourceFiles) {
  const slug = sourceFile.replace(/\.md$/, '')
  const targetFile = `${slug}.mdx`

  if (!targetFiles.includes(targetFile)) {
    throw new Error(`缺少迁移文章：${targetFile}`)
  }

  const source = matter(await fs.readFile(path.join(sourceBlogDir, sourceFile), 'utf8')).data
  const target = matter(await fs.readFile(path.join(targetBlogDir, targetFile), 'utf8')).data

  if (String(source.title) !== String(target.title)) {
    throw new Error(`标题不一致：${sourceFile}`)
  }

  if (normalizeDate(source.date) !== normalizeDate(target.date)) {
    throw new Error(`发布时间不一致：${sourceFile}`)
  }

  if (!Array.isArray(target.tags)) {
    throw new Error(`tags 必须是数组：${targetFile}`)
  }

  if (!Array.isArray(target.categories)) {
    throw new Error(`categories 必须是数组：${targetFile}`)
  }

  if (!Array.isArray(target.authors) || !target.authors.includes('default')) {
    throw new Error(`authors 缺失 default：${targetFile}`)
  }
}

console.log(`迁移校验通过：${targetFiles.length} 篇文章`)
