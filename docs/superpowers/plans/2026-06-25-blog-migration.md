# Blog Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 迁移旧 Gatsby 博客到当前 Next.js + TypeScript 模板，并用新技术栈重建完整个人实验室体验。

**Architecture:** 旧站只作为内容和功能参考。文章通过一次性 Node 迁移脚本转换到 `data/blog/**/*.mdx`，本地资源迁到 `public/static/**`，页面和功能用 Next App Router、Contentlayer、Tailwind v4、shadcn 组件和 client component 重建。

**Tech Stack:** Next.js 15, React 19, TypeScript, Contentlayer2, pliny, Tailwind v4, shadcn/ui, Gitalk, Node built-in test runner.

## Global Constraints

- 文章标题、正文语义和发布时间必须保持旧站原值。
- 模板自带文章、作者、项目、站点文案必须替换为 Ruoduan 个人博客内容。
- 文章路由只使用 `/blog/slug`，不做旧根路径 redirect。
- 搜索使用新模板 kbar/search.json，不迁移 Algolia。
- 评论继续使用 Gitalk，并复现旧站评论 id 策略，避免历史评论丢失。
- 不直接迁移 Gatsby、Material UI、Algolia、旧动画库或旧组件实现。
- UI 优先使用 shadcn 按需组件，不重复造已有基础组件。
- 新增文档和必要代码注释使用中文。
- 动画必须尊重 `prefers-reduced-motion`，不能影响文章阅读性能。
- 密钥和第三方配置通过环境变量管理，不硬编码到源码。

---

## File Structure

- Create: `components.json` - shadcn/ui 项目配置。
- Create: `lib/utils.ts` - shadcn `cn()` 工具函数。
- Create: `components/ui/button.tsx` - shadcn Button。
- Create: `components/ui/accordion.tsx` - shadcn Accordion。
- Create: `components/ui/badge.tsx` - shadcn Badge。
- Create: `components/ui/separator.tsx` - shadcn Separator。
- Create: `components/ui/dialog.tsx` - shadcn Dialog, 用于可选的搜索/评论提示扩展。
- Create: `data/profile.ts` - Ruoduan 个人资料、社交链接、技术栈、站点历史、音乐列表。
- Create: `data/gitalk-legacy-ids.ts` - 旧评论 id 映射表，如验证结果需要。
- Create: `.env.example` - Gitalk 和站点配置示例。
- Create: `scripts/__tests__/migrate-gatsby-blog.test.mjs` - 迁移脚本单元测试。
- Create: `scripts/migrate-gatsby-blog.mjs` - Gatsby 内容迁移脚本。
- Create: `scripts/verify-blog-migration.mjs` - 迁移结果校验脚本。
- Create: `components/mdx/ProseImage.tsx` - MDX 普通图片渲染，兼容远程图片和旧 HTML。
- Create: `components/mdx/ProseIframe.tsx` - MDX iframe 包装，控制比例和 CSP 需求。
- Create: `components/comments/GitalkComments.tsx` - Gitalk client component。
- Create: `components/about/ProfileHero.tsx` - about 顶部个人信息。
- Create: `components/about/SocialLinks.tsx` - 社交链接。
- Create: `components/about/TechStack.tsx` - 技术栈 accordion。
- Create: `components/about/SiteHistory.tsx` - 站点历史 accordion。
- Create: `components/about/MusicLibrary.tsx` - 音乐播放器列表。
- Create: `components/home/LabHero.tsx` - 首页个人实验室 hero。
- Create: `components/home/PostFeed.tsx` - 首页文章流。
- Modify: `package.json` - 添加 `gitalk` 和 shadcn 相关依赖，新增迁移/校验脚本。
- Modify: `contentlayer.config.ts` - 增加 `categories` 可选字段和摘要兼容。
- Modify: `components/MDXComponents.tsx` - 接入 `ProseImage`、`ProseIframe`。
- Modify: `components/Comments.tsx` - 切换到 Gitalk 加载逻辑。
- Modify: `data/siteMetadata.js` - 替换站点信息，保留 kbar 搜索。
- Modify: `data/authors/default.mdx` - 替换作者信息。
- Modify: `data/headerNavLinks.ts` - 清理 starter nav。
- Modify: `app/Main.tsx` - 首页替换为个人实验室风格。
- Modify: `app/about/page.tsx` - 重建 about 页面。
- Modify: `app/blog/page.tsx` and `layouts/ListLayout.tsx` - 中文化列表文案，适配迁移文章。
- Modify: `layouts/PostLayout.tsx` and `layouts/PostSimple.tsx` - 中文化文章导航和评论入口。
- Modify: `next.config.js` - 允许必要 media/frame 来源。
- Delete: `data/blog/**/*.mdx` starter 示例文章。
- Delete or stop linking: `app/projects/page.tsx`, `data/projectsData.ts` starter 项目入口，除非替换为真实项目。

---

### Task 1: Add shadcn Foundation and Runtime Dependencies

**Files:**
- Create: `components.json`
- Create: `lib/utils.ts`
- Create: `components/ui/button.tsx`
- Create: `components/ui/accordion.tsx`
- Create: `components/ui/badge.tsx`
- Create: `components/ui/separator.tsx`
- Create: `components/ui/dialog.tsx`
- Modify: `package.json`
- Modify: `yarn.lock`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string`
- Produces: `Button`, `Accordion`, `Badge`, `Separator`, `Dialog` components under `@/components/ui/*`
- Produces: installed `gitalk` package for `GitalkComments`

- [ ] **Step 1: Verify shadcn is absent**

Run:

```bash
test ! -f components.json
test ! -d components/ui
```

Expected: both commands exit `0`. If either fails because shadcn already exists, inspect the existing files and reuse them instead of overwriting.

- [ ] **Step 2: Initialize shadcn with project defaults**

Run:

```bash
yarn dlx shadcn@latest init -d
```

Expected: `components.json`, `lib/utils.ts`, and shadcn dependencies are added. Keep Tailwind v4 and the existing `@/` path alias.

- [ ] **Step 3: Add required shadcn components**

Run:

```bash
yarn dlx shadcn@latest add button accordion badge separator dialog
```

Expected: files appear under `components/ui/`.

- [ ] **Step 4: Add Gitalk dependency**

Run:

```bash
yarn add gitalk
```

Expected: `package.json` contains `"gitalk"` and `yarn.lock` is updated.

- [ ] **Step 5: Audit generated defaults**

Open `components/ui/button.tsx` and `components/ui/accordion.tsx`. Confirm they use `cn` from `@/lib/utils`, do not hardcode starter copy, and do not introduce broad global CSS.

- [ ] **Step 6: Commit**

```bash
git add package.json yarn.lock components.json lib/utils.ts components/ui
git commit -m "chore: add shadcn ui foundation"
```

---

### Task 2: Replace Starter Identity with Ruoduan Profile Data

**Files:**
- Create: `data/profile.ts`
- Create: `.env.example`
- Modify: `data/siteMetadata.js`
- Modify: `data/authors/default.mdx`
- Modify: `data/headerNavLinks.ts`
- Modify: `data/projectsData.ts`

**Interfaces:**
- Produces: `profile` object with `name`, `socialLinks`, `skills`, `siteHistory`, `music`
- Produces: `.env.example` keys used by comments and analytics
- Consumes: shadcn foundation from Task 1 only indirectly

- [ ] **Step 1: Create profile data**

Create `data/profile.ts` with this shape:

```ts
export type SocialLink = {
  label: string
  href: string
}

export type MusicTrack = {
  title: string
  description: string
  src: string
}

export const profile = {
  name: 'Ruoduan',
  handle: 'ruoduan-hub',
  title: '前端开发工程师',
  email: 'z.ruoduan@gmail.com',
  location: 'China',
  intro: '记录前端、工程化、Node.js、Python、部署和个人折腾的技术实验室。',
  quote: '我们逆水行舟，奋力向前，直至被推回到往昔岁月。',
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/ruoduan-hub' },
    { label: '知乎', href: 'https://www.zhihu.com/people/ruoduan/activities' },
    { label: '掘金', href: 'https://juejin.cn/user/2559318800733111/posts' },
    {
      label: '抖音',
      href: 'https://www.douyin.com/user/MS4wLjABAAAAfI8zw_OOjs8BNCdbVEjadn0mvib_BH8aZVlMEozfKt7tgufYvaxtzCT2Ik9OaYY_',
    },
  ] satisfies SocialLink[],
  interests: ['Coding', '音乐', '吉他', '民谣', '游戏'],
  skills: {
    languages: ['TypeScript & JavaScript', 'Python', 'HTML & CSS', 'Bash Script', 'C', 'Dart'],
    frontend: ['React', 'Vue', 'Electron', 'Flutter GetX', 'WeChat Mini Program'],
    backend: ['NestJS', 'Express.js', 'Django', 'Flask', 'Puppeteer', 'NumPy & Pandas'],
    ops: ['Docker & Docker Compose', 'Linux Develop', 'MySQL', 'SQLite', 'MongoDB', 'Serverless'],
  },
  siteHistory: [
    '2024年6月14日 use loremflickr.com | rm unsplash',
    '2024年03月08日 Comment use Gitalk',
    '2024年02月18日 更新 Avatar & Guitar Video',
    '2023年12月09日 更新 Header 烟花效果',
    '2023年11月26日 更新吉他曲目',
    '2022年4月 框架升级到 V4 版本',
    '2021年7月 增加 Search 功能',
    '2020年2月 使用 Gatsby',
    '2019年3月 切换到 VuePress',
    '2018年7月 使用 Hexo 正式搭建博客',
  ],
  music: [
    {
      src: '/static/music/老男孩-(片段).m4a',
      title: '老男孩 - ruoduan .cover 筷子兄弟',
      description: '也许永远都不会跟她说出那句话 注定我要浪迹天涯 怎么能有牵挂。',
    },
    {
      src: '/static/music/我是真的爱上你-cover王杰.m4a',
      title: '我是真的爱上你 - ruoduan .cover 王杰',
      description: '你有一双会说话的眼睛 你有善解人意的心。',
    },
    {
      src: '/static/music/晴天-coverJay.m4a',
      title: '晴天 - ruoduan .cover 周杰伦',
      description: '刮风这天 我试过握着你手 但偏偏 雨渐渐 大到我看你不见。',
    },
    {
      src: '/static/music/玫瑰.mp3',
      title: '玫瑰 - ruoduan .cover 贰佰',
      description: '玫瑰你在哪里，你说你爱过的人都已经离去。',
    },
    {
      src: '/static/music/忽然2.0.mp3',
      title: '忽然 - ruoduan .cover 李志',
      description: '幻想朝西的生活 幻想着你被害怕定格的角落最后，我一个人就越走越孤单',
    },
    {
      src: '/static/music/纸短情长.mp3',
      title: '纸短情长（粗糙版）- ruoduan .cover 烟把儿',
      description: '岁月无法停留，流云的等候',
    },
    {
      src: '/static/music/南山南.m4a',
      title: '南山南 - ruoduan（指弹）.cover 马頔',
      description: '他不再和谁谈论相逢的孤岛，因为心里早已荒无人烟',
    },
    {
      src: '/static/music/告白气球.m4a',
      title: '告白气球 - ruoduan（指弹）.cover 周杰伦',
      description: '我手一杯，品尝你的美，留下唇印的嘴',
    },
  ] satisfies MusicTrack[],
}
```

- [ ] **Step 2: Replace site metadata**

Modify `data/siteMetadata.js`:

```js
const siteMetadata = {
  title: "Ruoduan' Blog",
  author: 'Ruoduan',
  headerTitle: 'Ruoduan Lab',
  description: '若端的个人技术实验室，记录前端、工程化、Node.js、Python 和折腾实践。',
  language: 'zh-cn',
  theme: 'system',
  siteUrl: 'https://www.ruoduan.cn',
  siteRepo: 'https://github.com/ruoduan-hub',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: 'z.ruoduan@gmail.com',
  github: 'https://github.com/ruoduan-hub',
  zhihu: 'https://www.zhihu.com/people/ruoduan/activities',
  juejin: 'https://juejin.cn/user/2559318800733111/posts',
  locale: 'zh-CN',
  stickyNav: false,
  analytics: {},
  newsletter: { provider: '' },
  comments: {
    provider: 'gitalk',
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}

module.exports = siteMetadata
```

- [ ] **Step 3: Replace author profile**

Modify `data/authors/default.mdx`:

```mdx
---
name: Ruoduan
avatar: /static/images/avatarImg.jpg
occupation: 前端开发工程师
company: Ruoduan Lab
email: z.ruoduan@gmail.com
github: https://github.com/ruoduan-hub
layout: AuthorLayout
---

若端，前端开发工程师。这里记录前端、工程化、Node.js、Python、部署和个人折腾实践。

喜欢把博客当成长期实验室：写代码，也记录迁移、踩坑、音乐和一些不太标准但真实的探索。
```

- [ ] **Step 4: Simplify nav**

Modify `data/headerNavLinks.ts`:

```ts
const headerNavLinks = [
  { href: '/', title: 'Home' },
  { href: '/blog', title: 'Blog' },
  { href: '/tags', title: 'Tags' },
  { href: '/about', title: 'About' },
]

export default headerNavLinks
```

- [ ] **Step 5: Clear starter projects**

Modify `data/projectsData.ts`:

```ts
interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = []

export default projectsData
```

- [ ] **Step 6: Add environment example**

Create `.env.example`:

```bash
NEXT_PUBLIC_GITALK_CLIENT_ID=
NEXT_PUBLIC_GITALK_CLIENT_SECRET=
NEXT_PUBLIC_GITALK_REPO=GatsbtBlogCommentStore
NEXT_PUBLIC_GITALK_OWNER=ruoduan-hub
NEXT_PUBLIC_GITALK_ADMIN=ruoduan-hub
NEXT_UMAMI_ID=
```

- [ ] **Step 7: Run type-aware build check**

Run:

```bash
yarn build
```

Expected: build may still fail because starter articles are not migrated yet, but no failure should reference `data/profile.ts`, `data/siteMetadata.js`, `data/authors/default.mdx`, or `data/headerNavLinks.ts`.

- [ ] **Step 8: Commit**

```bash
git add data/profile.ts .env.example data/siteMetadata.js data/authors/default.mdx data/headerNavLinks.ts data/projectsData.ts
git commit -m "feat: replace starter identity with ruoduan profile"
```

---

### Task 3: Build and Test Gatsby Content Migration Tooling

**Files:**
- Create: `scripts/__tests__/migrate-gatsby-blog.test.mjs`
- Create: `scripts/migrate-gatsby-blog.mjs`
- Create: `scripts/verify-blog-migration.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `normalizeFrontmatter(frontmatter: Record<string, unknown>): Record<string, unknown>`
- Produces: `toMdxSafeBody(body: string): string`
- Produces: `rewriteAssetRefs(body: string, slug: string): { body: string; assets: string[] }`
- Produces: `migrateAll(options: { sourceRoot: string; targetRoot: string; publicRoot: string; cleanTarget: boolean }): Promise<MigrationResult>`

- [ ] **Step 1: Write failing migration tests**

Create `scripts/__tests__/migrate-gatsby-blog.test.mjs`:

```js
import assert from 'node:assert/strict'
import test from 'node:test'
import {
  normalizeFrontmatter,
  rewriteAssetRefs,
  toMdxSafeBody,
} from '../migrate-gatsby-blog.mjs'

test('normalizeFrontmatter keeps title and date and normalizes tags', () => {
  const result = normalizeFrontmatter({
    title: 'React-mode[进阶] React模式梳理',
    date: '2020-04-07',
    tags: 'React',
    categories: 'React',
  })

  assert.equal(result.title, 'React-mode[进阶] React模式梳理')
  assert.equal(result.date, '2020-04-07')
  assert.deepEqual(result.tags, ['React'])
  assert.deepEqual(result.categories, ['React'])
  assert.deepEqual(result.authors, ['default'])
  assert.equal(result.draft, false)
})

test('toMdxSafeBody converts common raw HTML into MDX-safe syntax', () => {
  const input =
    '<br>\\n<iframe frameborder="no" marginwidth="0" marginheight="0" src="//music.163.com/outchain/player?id=1"></iframe>'

  const result = toMdxSafeBody(input)

  assert.match(result, /<br \\/>/)
  assert.match(result, /frameBorder="no"/)
  assert.match(result, /src="https:\\/\\/music\\.163\\.com/)
  assert.doesNotMatch(result, /marginwidth=/)
  assert.doesNotMatch(result, /marginheight=/)
})

test('rewriteAssetRefs rewrites local assets to public static blog paths', () => {
  const { body, assets } = rewriteAssetRefs(
    '![flow](./reactHook-Typescript从入门到实践/ReactHook redex.png)',
    'reactHook-Typescript从入门到实践'
  )

  assert.equal(
    body,
    '![flow](/static/blog/reactHook-Typescript从入门到实践/ReactHook redex.png)'
  )
  assert.deepEqual(assets, ['reactHook-Typescript从入门到实践/ReactHook redex.png'])
})
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
node --test scripts/__tests__/migrate-gatsby-blog.test.mjs
```

Expected: FAIL because `scripts/migrate-gatsby-blog.mjs` does not exist.

- [ ] **Step 3: Implement migration helpers and CLI**

Create `scripts/migrate-gatsby-blog.mjs` with these exported helpers:

```js
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const BLOG_DIR = 'content/blog'

export function normalizeList(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  if (value === undefined || value === null || value === '') return []
  return [String(value)]
}

export function normalizeFrontmatter(frontmatter) {
  const summary = frontmatter.description || frontmatter.summary || ''
  return {
    title: String(frontmatter.title || ''),
    date: frontmatter.date,
    tags: normalizeList(frontmatter.tags),
    categories: normalizeList(frontmatter.categories),
    draft: Boolean(frontmatter.draft ?? false),
    summary: summary ? String(summary) : undefined,
    authors: ['default'],
  }
}

export function toMdxSafeBody(body) {
  return body
    .replace(/<br>/g, '<br />')
    .replace(/frameborder=/g, 'frameBorder=')
    .replace(/allowfullscreen=/g, 'allowFullScreen=')
    .replace(/\\smarginwidth="[^"]*"/g, '')
    .replace(/\\smarginheight="[^"]*"/g, '')
    .replace(/src="\\/\\//g, 'src="https://')
}

function isRemoteAsset(assetPath) {
  return /^(https?:)?\\/\\//.test(assetPath) || assetPath.startsWith('/') || assetPath.startsWith('#')
}

function cleanAssetPath(assetPath) {
  return assetPath
    .replace(/^\\.\\//, '')
    .replace(/\\?.*$/, '')
    .replace(/&amp;.*$/, '')
}

export function rewriteAssetRefs(body, slug) {
  const assets = new Set()

  const rewrite = (assetPath) => {
    if (isRemoteAsset(assetPath)) return assetPath
    const clean = cleanAssetPath(assetPath)
    const fileName = clean.includes('/') ? clean.split('/').slice(1).join('/') : clean
    const sourceAsset = clean.includes('/') ? clean : `${slug}/${clean}`
    assets.add(sourceAsset)
    return `/static/blog/${slug}/${fileName}`
  }

  const markdownImagePattern = /(!\\[[^\\]]*\\]\\()([^)]+)(\\))/g
  const htmlImagePattern = /(<img\\s+[^>]*src=["'])([^"']+)(["'][^>]*>)/g

  const nextBody = body
    .replace(markdownImagePattern, (_match, prefix, src, suffix) => `${prefix}${rewrite(src)}${suffix}`)
    .replace(htmlImagePattern, (_match, prefix, src, suffix) => `${prefix}${rewrite(src)}${suffix}`)

  return { body: nextBody, assets: [...assets] }
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

  const result = { posts: 0, assets: 0, missingAssets: [] }

  for (const fileName of markdownFiles) {
    const slug = fileName.replace(/\\.md$/, '')
    const sourceFile = path.join(sourceBlogDir, fileName)
    const raw = await fs.readFile(sourceFile, 'utf8')
    const parsed = matter(raw)
    const frontmatter = normalizeFrontmatter(parsed.data)
    const safeBody = toMdxSafeBody(parsed.content)
    const rewritten = rewriteAssetRefs(safeBody, slug)
    const output = matter.stringify(rewritten.body, frontmatter)

    await fs.writeFile(path.join(targetBlogDir, `${slug}.mdx`), output)
    result.posts += 1

    for (const asset of rewritten.assets) {
      const sourceAsset = path.join(sourceBlogDir, asset)
      const targetAsset = path.join(targetAssetDir, slug, path.basename(asset))
      try {
        await fs.mkdir(path.dirname(targetAsset), { recursive: true })
        await fs.copyFile(sourceAsset, targetAsset)
        result.assets += 1
      } catch {
        result.missingAssets.push(asset)
      }
    }
  }

  return result
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const sourceRoot = process.argv[2] || '/Users/ruoduan/dev/my-Gatsby-Blog'
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
```

- [ ] **Step 4: Add package scripts**

Modify `package.json`:

```json
{
  "scripts": {
    "migrate:blog": "node scripts/migrate-gatsby-blog.mjs /Users/ruoduan/dev/my-Gatsby-Blog --clean-target",
    "verify:migration": "node scripts/verify-blog-migration.mjs /Users/ruoduan/dev/my-Gatsby-Blog"
  }
}
```

Keep existing scripts.

- [ ] **Step 5: Implement migration verification script**

Create `scripts/verify-blog-migration.mjs`:

```js
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

const sourceFiles = await listPosts(sourceBlogDir, '.md')
const targetFiles = await listPosts(targetBlogDir, '.mdx')

if (sourceFiles.length !== targetFiles.length) {
  throw new Error(`文章数量不一致：旧站 ${sourceFiles.length}，新站 ${targetFiles.length}`)
}

for (const sourceFile of sourceFiles) {
  const slug = sourceFile.replace(/\\.md$/, '')
  const targetFile = `${slug}.mdx`
  if (!targetFiles.includes(targetFile)) {
    throw new Error(`缺少迁移文章：${targetFile}`)
  }

  const source = matter(await fs.readFile(path.join(sourceBlogDir, sourceFile), 'utf8')).data
  const target = matter(await fs.readFile(path.join(targetBlogDir, targetFile), 'utf8')).data

  if (String(source.title) !== String(target.title)) {
    throw new Error(`标题不一致：${sourceFile}`)
  }

  if (String(source.date) !== String(target.date)) {
    throw new Error(`发布时间不一致：${sourceFile}`)
  }

  if (!Array.isArray(target.tags)) {
    throw new Error(`tags 必须是数组：${targetFile}`)
  }

  if (!Array.isArray(target.authors) || !target.authors.includes('default')) {
    throw new Error(`authors 缺失 default：${targetFile}`)
  }
}

console.log(`迁移校验通过：${targetFiles.length} 篇文章`)
```

- [ ] **Step 6: Run tests to verify pass**

Run:

```bash
node --test scripts/__tests__/migrate-gatsby-blog.test.mjs
```

Expected: PASS for all migration helper tests.

- [ ] **Step 7: Commit**

```bash
git add scripts/migrate-gatsby-blog.mjs scripts/verify-blog-migration.mjs scripts/__tests__/migrate-gatsby-blog.test.mjs package.json
git commit -m "feat: add gatsby blog migration tooling"
```

---

### Task 4: Migrate Articles and Static Assets

**Files:**
- Delete: existing `data/blog/**/*.mdx` starter posts
- Create: migrated `data/blog/*.mdx`
- Create: `public/static/blog/**`
- Create: `public/static/music/**`
- Create: `public/static/images/avatarImg.jpg`
- Create: `public/static/about/we_p.png`
- Create: `public/static/about/al_p.png`

**Interfaces:**
- Consumes: `scripts/migrate-gatsby-blog.mjs`
- Produces: migrated Contentlayer-compatible blog content
- Produces: migrated static assets referenced by posts and profile

- [ ] **Step 1: Run migration**

Run:

```bash
yarn migrate:blog
```

Expected output includes:

```json
{
  "posts": 81
}
```

If `missingAssets` is non-empty, inspect each path. Fix `rewriteAssetRefs` for nested relative paths, then rerun.

- [ ] **Step 2: Copy static music**

Run:

```bash
mkdir -p public/static/music
find /Users/ruoduan/dev/my-Gatsby-Blog/static/music -maxdepth 1 -type f \( -name '*.mp3' -o -name '*.m4a' \) -exec cp {} public/static/music/ \;
```

Expected: `public/static/music` contains 8 audio files.

- [ ] **Step 3: Copy about images**

Run:

```bash
mkdir -p public/static/about public/static/images
cp /Users/ruoduan/dev/my-Gatsby-Blog/static/images/avatarImg.jpg public/static/images/avatarImg.jpg
cp /Users/ruoduan/dev/my-Gatsby-Blog/content/assets/we_p.png public/static/about/we_p.png
cp /Users/ruoduan/dev/my-Gatsby-Blog/content/assets/al_p.png public/static/about/al_p.png
```

Expected: avatar and donation images exist in public static paths.

- [ ] **Step 4: Verify migration**

Run:

```bash
yarn verify:migration
find data/blog -type f -name '*.mdx' | wc -l
find public/static/music -type f | wc -l
```

Expected:

```text
迁移校验通过：81 篇文章
      81
       8
```

- [ ] **Step 5: Commit**

```bash
git add data/blog public/static/blog public/static/music public/static/images/avatarImg.jpg public/static/about
git commit -m "feat: migrate gatsby blog content"
```

---

### Task 5: Harden Contentlayer and MDX Rendering

**Files:**
- Create: `components/mdx/ProseImage.tsx`
- Create: `components/mdx/ProseIframe.tsx`
- Modify: `components/MDXComponents.tsx`
- Modify: `contentlayer.config.ts`
- Modify: `next.config.js`

**Interfaces:**
- Consumes: migrated MDX from Task 4
- Produces: `ProseImage(props: React.ImgHTMLAttributes<HTMLImageElement>)`
- Produces: `ProseIframe(props: React.IframeHTMLAttributes<HTMLIFrameElement>)`

- [ ] **Step 1: Add Contentlayer categories field**

Modify the `Blog` fields in `contentlayer.config.ts`:

```ts
categories: { type: 'list', of: { type: 'string' }, default: [] },
```

Keep existing fields unchanged.

- [ ] **Step 2: Create ProseImage**

Create `components/mdx/ProseImage.tsx`:

```tsx
import type { ImgHTMLAttributes } from 'react'

export default function ProseImage({ alt = '', className = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`my-8 max-w-full rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 ${className}`}
      {...props}
    />
  )
}
```

- [ ] **Step 3: Create ProseIframe**

Create `components/mdx/ProseIframe.tsx`:

```tsx
import type { IframeHTMLAttributes } from 'react'

export default function ProseIframe(props: IframeHTMLAttributes<HTMLIFrameElement>) {
  return (
    <span className="my-8 block overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <iframe
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block min-h-24 w-full"
        {...props}
      />
    </span>
  )
}
```

- [ ] **Step 4: Register MDX components**

Modify `components/MDXComponents.tsx`:

```tsx
import ProseImage from './mdx/ProseImage'
import ProseIframe from './mdx/ProseIframe'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  img: ProseImage,
  iframe: ProseIframe,
  BlogNewsletterForm,
}
```

- [ ] **Step 5: Update CSP for music embeds and local media**

Modify `next.config.js` CSP:

```js
media-src 'self' blob: data: *.s3.amazonaws.com;
frame-src giscus.app music.163.com;
```

Keep the rest of `ContentSecurityPolicy` intact.

- [ ] **Step 6: Build and fix MDX compile errors**

Run:

```bash
yarn build
```

Expected: PASS. If MDX compile errors identify raw HTML or invalid JSX in a migrated post, update `toMdxSafeBody` in Task 3 and rerun `yarn migrate:blog`, then repeat this build.

- [ ] **Step 7: Commit**

```bash
git add contentlayer.config.ts components/MDXComponents.tsx components/mdx next.config.js scripts/migrate-gatsby-blog.mjs data/blog
git commit -m "fix: harden migrated mdx rendering"
```

---

### Task 6: Implement Gitalk Comments with Legacy Matching

**Files:**
- Create: `components/comments/GitalkComments.tsx`
- Create: `data/gitalk-legacy-ids.ts`
- Modify: `components/Comments.tsx`
- Modify: `layouts/PostLayout.tsx`
- Modify: `layouts/PostSimple.tsx`
- Modify: `app/about/page.tsx` later in Task 7 consumes this

**Interfaces:**
- Produces: `getGitalkId(slug: string): string`
- Produces: `GitalkComments({ slug }: { slug: string })`
- Consumes: env keys from `.env.example`

- [ ] **Step 1: Create legacy id helper**

Create `data/gitalk-legacy-ids.ts`:

```ts
export const gitalkLegacyIds: Record<string, string> = {}

export function getGitalkId(slug: string) {
  const legacyId = gitalkLegacyIds[slug]
  if (legacyId) return legacyId

  const oldPath = `/${slug}/`
  return oldPath.length > 50 ? oldPath.slice(0, 50) : oldPath
}
```

- [ ] **Step 2: Create Gitalk client component**

Create `components/comments/GitalkComments.tsx`:

```tsx
'use client'

import 'gitalk/dist/gitalk.css'

import { useEffect, useId, useMemo } from 'react'
import Gitalk from 'gitalk'
import { getGitalkId } from '@/data/gitalk-legacy-ids'

type GitalkCommentsProps = {
  slug: string
}

function readAdmins() {
  return (process.env.NEXT_PUBLIC_GITALK_ADMIN || 'ruoduan-hub')
    .split(',')
    .map((admin) => admin.trim())
    .filter(Boolean)
}

export default function GitalkComments({ slug }: GitalkCommentsProps) {
  const reactId = useId()
  const containerId = useMemo(() => `gitalk-${reactId.replace(/:/g, '')}`, [reactId])

  const missingConfig =
    !process.env.NEXT_PUBLIC_GITALK_CLIENT_ID || !process.env.NEXT_PUBLIC_GITALK_CLIENT_SECRET

  useEffect(() => {
    if (missingConfig) return

    const gitalk = new Gitalk({
      clientID: process.env.NEXT_PUBLIC_GITALK_CLIENT_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_GITALK_CLIENT_SECRET || '',
      repo: process.env.NEXT_PUBLIC_GITALK_REPO || 'GatsbtBlogCommentStore',
      owner: process.env.NEXT_PUBLIC_GITALK_OWNER || 'ruoduan-hub',
      admin: readAdmins(),
      id: getGitalkId(slug),
      distractionFreeMode: false,
    })

    gitalk.render(containerId)
  }, [containerId, missingConfig, slug])

  if (missingConfig) {
    return (
      <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
        Gitalk 评论需要配置 NEXT_PUBLIC_GITALK_CLIENT_ID 和 NEXT_PUBLIC_GITALK_CLIENT_SECRET。
      </div>
    )
  }

  return <div id={containerId} className="text-left" />
}
```

- [ ] **Step 3: Replace Comments loader**

Modify `components/Comments.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import GitalkComments from '@/components/comments/GitalkComments'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)

  if (loadComments) {
    return <GitalkComments slug={slug} />
  }

  return (
    <Button type="button" variant="outline" onClick={() => setLoadComments(true)}>
      加载评论
    </Button>
  )
}
```

- [ ] **Step 4: Pass slug consistently**

Confirm `layouts/PostLayout.tsx` and `layouts/PostSimple.tsx` call:

```tsx
<Comments slug={slug} />
```

Expected: no change needed unless the call was removed during earlier edits.

- [ ] **Step 5: Verify legacy issue strategy**

Run a local build:

```bash
yarn build
```

Then manually inspect a few old Gitalk issues in `ruoduan-hub/GatsbtBlogCommentStore` and fill `gitalkLegacyIds` if historical ids do not match `/${slug}/`. If network is unavailable, leave the map empty and document that runtime validation is still required before production deploy.

- [ ] **Step 6: Commit**

```bash
git add components/Comments.tsx components/comments/GitalkComments.tsx data/gitalk-legacy-ids.ts layouts/PostLayout.tsx layouts/PostSimple.tsx
git commit -m "feat: add gitalk comments"
```

---

### Task 7: Rebuild About Page and Personal Media Experience

**Files:**
- Create: `components/about/ProfileHero.tsx`
- Create: `components/about/SocialLinks.tsx`
- Create: `components/about/TechStack.tsx`
- Create: `components/about/SiteHistory.tsx`
- Create: `components/about/MusicLibrary.tsx`
- Modify: `app/about/page.tsx`

**Interfaces:**
- Consumes: `profile` from `@/data/profile`
- Consumes: `Comments` from `@/components/Comments`
- Consumes: shadcn `Accordion`, `Badge`, `Button`, `Separator`

- [ ] **Step 1: Create SocialLinks**

Create `components/about/SocialLinks.tsx`:

```tsx
import Link from '@/components/Link'
import { Button } from '@/components/ui/button'
import type { SocialLink } from '@/data/profile'

export default function SocialLinks({ links, email }: { links: SocialLink[]; email: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild variant="default">
        <a href={`mailto:${email}`}>Email</a>
      </Button>
      {links.map((link) => (
        <Button key={link.href} asChild variant="outline">
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create ProfileHero**

Create `components/about/ProfileHero.tsx`:

```tsx
import Image from 'next/image'
import { profile } from '@/data/profile'
import SocialLinks from './SocialLinks'

export default function ProfileHero() {
  return (
    <section className="grid gap-8 py-10 md:grid-cols-[1fr_220px] md:items-end">
      <div className="space-y-5">
        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">Ruoduan Lab</p>
        <h1 className="text-4xl font-bold tracking-tight text-gray-950 text-balance dark:text-gray-50 md:text-5xl">
          个人技术实验室
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          {profile.intro}
        </p>
        <blockquote className="border-l border-gray-300 pl-4 text-gray-700 dark:border-gray-700 dark:text-gray-300">
          {profile.quote}
        </blockquote>
        <SocialLinks links={profile.socialLinks} email={profile.email} />
      </div>
      <Image
        src="/static/images/avatarImg.jpg"
        alt="Ruoduan avatar"
        width={220}
        height={220}
        priority
        className="rounded-2xl border border-gray-200 object-cover dark:border-gray-800"
      />
    </section>
  )
}
```

- [ ] **Step 3: Create TechStack**

Create `components/about/TechStack.tsx`:

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { profile } from '@/data/profile'

const groups = [
  ['语言', profile.skills.languages],
  ['前端', profile.skills.frontend],
  ['后端与数据', profile.skills.backend],
  ['工程与部署', profile.skills.ops],
] as const

export default function TechStack() {
  return (
    <section className="py-10">
      <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-50">技术栈</h2>
      <Accordion type="multiple" defaultValue={['语言', '前端']} className="mt-5">
        {groups.map(([name, items]) => (
          <AccordionItem key={name} value={name}>
            <AccordionTrigger>{name}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
```

- [ ] **Step 4: Create SiteHistory**

Create `components/about/SiteHistory.tsx`:

```tsx
import { profile } from '@/data/profile'

export default function SiteHistory() {
  return (
    <section className="py-10">
      <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-50">关于本站</h2>
      <ol className="mt-5 space-y-3 border-l border-gray-200 pl-5 dark:border-gray-800">
        {profile.siteHistory.map((item) => (
          <li key={item} className="text-gray-700 dark:text-gray-300">
            {item}
          </li>
        ))}
      </ol>
    </section>
  )
}
```

- [ ] **Step 5: Create MusicLibrary**

Create `components/about/MusicLibrary.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { profile } from '@/data/profile'

export default function MusicLibrary() {
  const [open, setOpen] = useState(true)

  return (
    <section className="py-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-50">My Guitar Song</h2>
        <Button type="button" variant="outline" onClick={() => setOpen((value) => !value)}>
          {open ? '收起' : '展开'}
        </Button>
      </div>
      {open && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {profile.music.map((track) => (
            <article
              key={track.src}
              className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
            >
              <h3 className="font-medium text-gray-950 dark:text-gray-50">{track.title}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {track.description}
              </p>
              <audio className="mt-4 w-full" controls preload="none">
                <source src={track.src} />
                <track kind="captions" label={track.title} />
                您的浏览器不支持该音频格式。
              </audio>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 6: Replace about page**

Modify `app/about/page.tsx`:

```tsx
import Comments from '@/components/Comments'
import MusicLibrary from '@/components/about/MusicLibrary'
import ProfileHero from '@/components/about/ProfileHero'
import SiteHistory from '@/components/about/SiteHistory'
import TechStack from '@/components/about/TechStack'
import { Separator } from '@/components/ui/separator'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: '关于我' })

export default function Page() {
  return (
    <div className="space-y-4">
      <ProfileHero />
      <Separator />
      <TechStack />
      <Separator />
      <SiteHistory />
      <Separator />
      <MusicLibrary />
      <Separator />
      <section className="py-10" id="comment">
        <h2 className="mb-5 text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-50">
          留言
        </h2>
        <Comments slug="about" />
      </section>
    </div>
  )
}
```

- [ ] **Step 7: Build verify**

Run:

```bash
yarn build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add app/about/page.tsx components/about
git commit -m "feat: rebuild about experience"
```

---

### Task 8: Refresh Home, Lists, and Post Layout Copy

**Files:**
- Create: `components/home/LabHero.tsx`
- Create: `components/home/PostFeed.tsx`
- Modify: `app/Main.tsx`
- Modify: `layouts/PostLayout.tsx`
- Modify: `layouts/PostSimple.tsx`
- Modify: `layouts/ListLayout.tsx`
- Modify: `layouts/ListLayoutWithTags.tsx`
- Modify: `app/blog/page.tsx` if needed
- Modify: `app/projects/page.tsx` if projects route remains linked elsewhere

**Interfaces:**
- Consumes: `CoreContent<Blog>[]` post list from `app/page.tsx`
- Produces: `LabHero()`
- Produces: `PostFeed({ posts, maxDisplay }: { posts: CoreContent<Blog>[]; maxDisplay: number })`

- [ ] **Step 1: Create LabHero**

Create `components/home/LabHero.tsx`:

```tsx
import Link from '@/components/Link'
import { Button } from '@/components/ui/button'

export default function LabHero() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl space-y-5">
        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">Ruoduan Lab</p>
        <h1 className="text-4xl font-bold tracking-tight text-gray-950 text-balance dark:text-gray-50 md:text-6xl">
          记录代码、系统和一些折腾。
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          这里是若端的个人技术实验室，主要写前端、工程化、Node.js、Python、部署和实践复盘。
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/blog">阅读文章</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about">关于我</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create PostFeed**

Create `components/home/PostFeed.tsx`:

```tsx
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

export default function PostFeed({ posts, maxDisplay = 8 }) {
  return (
    <section className="py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-50">最新文章</h2>
        <Link href="/blog" className="text-sm font-medium text-primary-600 dark:text-primary-400">
          全部文章
        </Link>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {posts.slice(0, maxDisplay).map((post) => {
          const { slug, date, title, summary, tags } = post
          return (
            <li key={slug} className="py-7">
              <article className="grid gap-3 md:grid-cols-[9rem_1fr]">
                <time dateTime={date} className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(date, siteMetadata.locale)}
                </time>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold tracking-tight">
                    <Link href={`/blog/${slug}`} className="text-gray-950 dark:text-gray-50">
                      {title}
                    </Link>
                  </h3>
                  {summary && (
                    <p className="max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {summary}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
```

- [ ] **Step 3: Replace homepage**

Modify `app/Main.tsx`:

```tsx
import LabHero from '@/components/home/LabHero'
import PostFeed from '@/components/home/PostFeed'

const MAX_DISPLAY = 8

export default function Home({ posts }) {
  return (
    <>
      <LabHero />
      <PostFeed posts={posts} maxDisplay={MAX_DISPLAY} />
    </>
  )
}
```

- [ ] **Step 4: Chinese post layout copy**

Modify article navigation labels in `layouts/PostLayout.tsx`:

```tsx
<h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
  标签
</h2>
```

```tsx
上一篇
下一篇
返回博客
```

Also remove `Discuss on Twitter` and `View on GitHub` links unless they point to real Ruoduan repository content.

- [ ] **Step 5: Chinese list copy**

Modify `layouts/ListLayout.tsx` and `layouts/ListLayoutWithTags.tsx` visible copy:

```tsx
const title = '全部文章'
const noPosts = '没有找到文章。'
const paginationPrevious = '上一页'
const paginationNext = '下一页'
```

Use the existing component structure and only replace visible copy and spacing where needed.

- [ ] **Step 6: Remove projects route from nav or make empty state explicit**

Because `data/headerNavLinks.ts` no longer links `/projects`, no user-facing projects route should be visible. If `app/projects/page.tsx` remains, change the page title to `项目` and render a clear empty state instead of Google/Time Machine starter projects.

- [ ] **Step 7: Build verify**

Run:

```bash
yarn build
```

Expected: PASS, and generated search output includes migrated posts.

- [ ] **Step 8: Commit**

```bash
git add app/Main.tsx components/home layouts app/projects/page.tsx
git commit -m "feat: refresh blog reading experience"
```

---

### Task 9: Final Verification, Responsive QA, and Cleanup

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-06-25-blog-migration-design.md` only if implementation discovers a real design change
- Modify: any migrated MDX files that still fail compile due to compatibility syntax

**Interfaces:**
- Consumes: all previous tasks
- Produces: verified migrated blog

- [ ] **Step 1: Search for starter content**

Run:

```bash
rg -n "TailwindBlog|Next\\.js Starter Blog|Tails Azimuth|Stanford|A Search Engine|The Time Machine|Demo Blog|Read more|All Posts|Latest" app components data layouts README.md
```

Expected: no matches, except historical mentions in migrated posts if they came from old content.

- [ ] **Step 2: Verify article and asset counts**

Run:

```bash
yarn verify:migration
find data/blog -type f -name '*.mdx' | wc -l
find public/static/blog -type f | wc -l
find public/static/music -type f | wc -l
```

Expected: `81` migrated articles, non-zero blog assets, `8` music files.

- [ ] **Step 3: Run build**

Run:

```bash
yarn build
```

Expected: PASS. Confirm `public/search.json`, feed, and sitemap generation complete.

- [ ] **Step 4: Run lint**

Run:

```bash
yarn lint
```

Expected: PASS or only existing template lint-script incompatibility. If `next lint` is unsupported in Next 15, replace the script with an ESLint CLI command scoped to `app components layouts scripts data`.

- [ ] **Step 5: Start dev server**

Run:

```bash
yarn start
```

Expected: Next dev server starts, usually at `http://localhost:3000`.

- [ ] **Step 6: Browser QA**

Open and inspect:

```text
http://localhost:3000/
http://localhost:3000/blog
http://localhost:3000/about
http://localhost:3000/blog/hello
```

Verify:

- 首页不是 starter 样式和文案。
- `/blog` 显示迁移文章。
- `/about` 显示个人资料、技术栈、站点历史、音乐播放器、评论入口。
- 文章页图片、代码块、iframe 不破版。
- 搜索弹层能搜到中文文章标题。
- 深色模式可用。
- 移动端 390px 宽度无文本溢出。
- Gitalk 缺 env 时有明确提示；有 env 时加载评论。

- [ ] **Step 7: Update README**

Replace template README sections with project-specific notes:

````md
# Ruoduan Blog

若端的个人技术实验室博客，基于 Next.js、TypeScript、Tailwind v4、Contentlayer 和 shadcn/ui。

## Development

```bash
yarn install
yarn start
```

## Content Migration

```bash
yarn migrate:blog
yarn verify:migration
```

Gitalk 评论需要配置 `.env.local`，参考 `.env.example`。
````

- [ ] **Step 8: Final commit**

```bash
git add README.md app components data layouts contentlayer.config.ts next.config.js package.json yarn.lock public scripts
git commit -m "feat: complete ruoduan blog migration"
```

---

## Self-Review Checklist

- Spec coverage: all confirmed migration decisions have tasks.
- Placeholder scan: no unresolved marker words or vague deferred implementation steps.
- Type consistency: `profile`, `MusicTrack`, `SocialLink`, `GitalkComments`, `getGitalkId`, `ProseImage`, `ProseIframe`, `LabHero`, and `PostFeed` names are consistent across tasks.
- Test path: migration helpers have Node tests before script use.
- Verification path: final plan includes migration count, build, lint, browser QA, starter-content search, and README update.
