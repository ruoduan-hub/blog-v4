# Blog Migration Design

## 背景

当前仓库 `/Users/ruoduan/dev/blog-v4` 是基于 Tailwind Next.js Starter Blog 的新模板，技术栈为 Next.js 15、React 19、TypeScript、Tailwind v4、Contentlayer 和 pliny。旧博客位于 `/Users/ruoduan/dev/my-Gatsby-Blog`，技术栈为 Gatsby、Markdown、MDX、Material UI、Algolia、Gitalk、Google reCAPTCHA、自定义动画和音乐组件。

本次迁移目标是把旧博客完整迁到新模板中，同时清理 starter blog 的示例身份。旧代码只作为功能和内容参考，不直接复制 Gatsby、Material UI 或旧动画库实现。

## 已确认决策

- 迁移方案：Next 原生内容迁移 + 新组件重建体验。
- 设计方向：个人实验室，技术感更强，保留音乐、动效和折腾感。
- 文章路由：只使用新模板 `/blog/slug`，不做旧 Gatsby 根路径 redirect。
- 搜索：使用新项目现有 kbar/search.json 机制，不迁移 Algolia。
- 评论：继续使用 Gitalk，并保持旧 GitHub issue 仓库映射，避免历史评论数据丢失。
- UI：优先使用 shadcn 按需组件，不引入 Material UI，不重复造已有基础组件。
- 文档和注释：新增项目文档和必要代码注释使用中文。

## 迁移范围

### 必须迁移

- 旧站 `content/blog/*.md` 下的全部文章。
- 旧站文章资源目录中的本地图片、gif 等静态资源。
- 旧站 `src/pagex/about/about.mdx` 中关于我、技术栈、站点历史和个人说明内容。
- 旧站个人信息：站点名称、作者、描述、邮箱、GitHub、知乎、掘金、抖音链接、音乐列表。
- Gitalk 评论功能，用新 Next.js client component 实现。
- about 页面音乐播放器，用原生 audio 和新 UI 实现。
- 新站 starter metadata、示例作者、示例文章、示例文案的替换。

### 不直接迁移

- Gatsby GraphQL 查询、gatsby-node 页面生成逻辑。
- Material UI 组件和样式。
- Algolia 上传和前端 InstantSearch 组件。
- 旧 `rc-texty`、`rc-tween-one`、`rc-queue-anim` 实现。
- 旧站硬编码密钥、Sentry DSN、Gitalk client secret、Algolia admin key。
- 旧站根路径文章 URL。

### 可重做的体验

- 首页轻量技术实验室动效。
- about 页面音乐/社交/站点历史模块。
- 文章页阅读增强，例如目录、标签、上一篇/下一篇、评论入口和返回顶部。
- 赞赏区，如果旧资源 `we_p.png`、`al_p.png` 存在且用户仍希望展示。

## 内容迁移设计

### 文章源

新站继续使用 `data/blog/**/*.mdx` 作为唯一文章源。旧站 `content/blog/*.md` 会迁移为 `.mdx` 文件，并删除模板自带示例文章。

### Frontmatter 规则

迁移脚本只做结构兼容，不改文章语义：

- `title` 保持旧值。
- `date` 保持旧值，不调整发布时间。
- `tags: React` 转为 `tags: ['React']`。
- `categories` 保留为 Contentlayer 可选字段，迁移时按旧值写入 frontmatter；页面可以暂不展示，但元数据不能丢失。
- 补充 `authors: ['default']`。
- 补充 `draft: false`。
- `summary` 可由旧站 excerpt 逻辑生成，也可以缺省让页面显示空摘要；实现计划中优先选择从正文前 160 字生成，避免首页空白。
- 如果旧文已有 `description`，迁移为 `summary`。

### 正文兼容转换

为保证 MDX 编译通过，迁移时允许做语法兼容转换：

- `<br>` 转为 `<br />`。
- HTML 属性如 `frameborder`、`marginwidth`、`marginheight` 转为 React 兼容属性或移除。
- `<img style="zoom:50%;" />` 转成 Markdown 图片或兼容 JSX 样式。
- 相对图片路径改成 `/static/blog/<slug>/<asset>`。
- 协议相对 iframe URL 如 `//music.163.com/...` 转为 `https://music.163.com/...`。

这些转换不改变文章文字、代码块内容和发布时间。

### 静态资源

- 文章内本地资源迁到 `public/static/blog/<slug>/...`。
- 音乐迁到 `public/static/music/...`。
- 头像和赞赏图片迁到 `public/static/images/...` 或 `public/static/about/...`。
- `next.config.js` 的 image remotePatterns 需要补充旧文章使用的可信远程图片域名，或在 MDX 中保留普通 `<img>` 以降低 Next Image 远程配置成本。

## 功能设计

### 搜索

沿用新项目 `siteMetadata.search.provider = 'kbar'`。Contentlayer 构建时生成 `public/search.json`，搜索结果来自迁移后的文章。旧 Algolia 配置和依赖不迁移。

### Gitalk 评论

新增 client component 封装 Gitalk：

- 仅在浏览器端加载 Gitalk，避免 SSR 报错。
- 使用旧评论仓库配置保持历史数据：`repo: GatsbtBlogCommentStore`，`owner: ruoduan-hub`，`admin: ['ruoduan-hub']`。
- `clientID` 和 `clientSecret` 通过环境变量读取，不写入源码。
- Gitalk id 必须复现旧站 issue id 策略，优先使用旧站根路径 canonical URL 或旧 slug 生成 id，而不是新 `/blog/slug` 路径。实现阶段必须抽样验证历史 issue label；若 Gitalk 历史数据使用了截断、hash 或特殊路径，需要生成 `data/gitalk-legacy-ids.ts` 映射表。
- 评论组件提供缺配置状态，避免生产构建缺 env 时页面崩溃。

### About 页面

about 页面由 Next.js 页面和组件组成：

- 个人简介和引用。
- GitHub Langs 外链图片。
- 技术栈 accordion。
- 站点历史 accordion。
- 社交链接区：email、GitHub、知乎、掘金、抖音。
- 音乐列表播放器。
- Gitalk 评论区。

页面文字保留中文，组件命名使用 PascalCase，数据从独立配置文件读取，避免把长列表写死在页面组件中。

### 音乐播放器

新增音乐数据配置和播放器组件：

- 使用原生 `<audio controls>` 或 shadcn 风格容器封装。
- 支持列表展开/收起。
- 音频源来自 `/static/music/...`。
- 键盘可操作，避免自定义不可访问播放器。
- 移动端单列，桌面端两列或不规则但清晰的网格。

### 轻量动效

设计读法为个人实验室：

- `DESIGN_VARIANCE: 6`
- `MOTION_INTENSITY: 4`
- `VISUAL_DENSITY: 3`

动效只用于层级、反馈和个人气质表达。默认避免重型 canvas 常驻动画。若重做烟花效果，应作为用户触发或首页轻量背景，不影响阅读页性能，并尊重 `prefers-reduced-motion`。

## 站点信息替换

需要替换以下 starter 内容：

- `data/siteMetadata.js`：title、author、headerTitle、description、language、siteUrl、siteRepo、email、GitHub、社交链接、comments、search、newsletter。
- `data/authors/default.mdx`：替换为 Ruoduan 作者信息和中文简介。
- `data/headerNavLinks.ts`：保留 Home、Blog、Tags、About；Projects 是否保留取决于是否有真实项目数据，默认移除 starter Projects。
- `app/Main.tsx`：替换 Latest、Read more、All Posts 等英文模板文案。
- `data/blog`：删除模板文章和示例 nested-route 文章。
- `data/projectsData.ts`：若无真实项目，移除页面入口或替换为真实项目。

## 组件边界

建议新增或修改的组件边界：

- `data/profile.ts`：个人资料、社交链接、技术栈、站点历史、音乐列表。
- `components/about/ProfileHero.tsx`：about 顶部个人信息。
- `components/about/SocialLinks.tsx`：社交链接。
- `components/about/MusicLibrary.tsx`：音乐列表播放器。
- `components/comments/GitalkComments.tsx`：Gitalk client component。
- `components/blog/LabPostList.tsx`：首页或列表页文章展示。
- `scripts/migrate-gatsby-blog.mjs`：一次性迁移脚本。

如需 shadcn，应先检查项目是否已有 shadcn 配置；没有则按需初始化并添加组件，避免把默认样式原封不动保留。

## 测试与验收

### 自动检查

- 运行迁移脚本后，迁移文章数量等于旧站 `content/blog/*.md` 数量。
- 检查每篇迁移文章都有 `title`、`date`、`tags`、`authors`。
- 检查迁移后 `date` 与旧 frontmatter 一致。
- 检查 Markdown 中引用的本地资源在 `public/static/blog` 存在。
- 运行 `yarn build`，确认 Contentlayer 和 Next 编译通过。
- 运行项目 lint 或可用的类型检查命令。

### 手动验收

- 首页不再出现 starter blog 示例内容。
- `/blog` 文章列表显示旧站文章。
- 任意旧文章可通过 `/blog/slug` 打开。
- about 页面展示个人简介、技术栈、站点历史、音乐播放器和评论入口。
- 搜索能搜到迁移文章。
- Gitalk 能加载旧评论仓库，缺环境变量时显示明确提示。
- 深色模式、移动端布局和键盘导航可用。

## 风险与处理

- Gitalk 历史评论匹配是实现前置验证项。新站文章路径使用 `/blog/slug`，但 Gitalk id 要按旧站根路径或映射表生成，不能默认使用新路径创建全新 issue。
- 旧文章包含原始 HTML 和非标准属性，MDX 编译可能失败。迁移脚本需要先转换常见模式，再通过构建结果迭代补齐。
- 旧文章远程图片域名较多，全部纳入 Next Image remotePatterns 成本高。优先让 MDX 图片渲染兼容普通图片或只为本地图片使用 Next Image。
- Gitalk client secret 放在前端并不是真正保密。为保留 Gitalk 兼容性可沿用其常见模式，但必须通过环境变量管理，并在文档中说明风险。
- 不做旧路径 redirect 会损失旧 URL 的 SEO 承接，这是用户已确认的取舍。

## 实施顺序

1. 建立项目上下文和个人资料配置。
2. 编写迁移脚本并迁移文章、图片、音乐、头像等资源。
3. 清理 starter blog 示例文章和元信息。
4. 重做 about 页面和音乐播放器。
5. 新增 Gitalk 评论组件。
6. 调整首页、列表页、导航和作者信息。
7. 构建、检查搜索索引、验证代表性文章。
8. 做设计和可访问性收尾。
