# Product

## Register

brand

## Users

主要用户是阅读技术文章、查找实践记录、了解 Ruoduan 个人经历和兴趣的人。访问场景以桌面端深度阅读和移动端快速查找为主，用户需要稳定的文章索引、清晰的标签导航、可搜索内容和可继续讨论的评论入口。

## Product Purpose

这是 Ruoduan 的个人技术实验室博客。它用于沉淀前端、Node.js、Python、工程化、算法、部署和个人折腾记录，同时承载 about、音乐、站点历史和个人社交入口。成功标准是旧 Gatsby 博客内容完整迁入 Next.js 模板，模板示例信息全部替换为 Ruoduan 个人信息，阅读体验、搜索、评论、RSS 和 sitemap 在新技术栈下稳定工作。

## Brand Personality

技术感、实验性、个人化。界面应像一个长期维护的个人实验室：克制、清晰、可阅读，但保留音乐、轻量动画和折腾痕迹。文案可以自然、直接、带一点个人口吻，避免模板化营销语气。

## Anti-references

不要保留 Tailwind Next.js Starter Blog 的示例身份、示例文章、示例作者或默认项目文案。不要把 Gatsby、Material UI、Algolia、旧动画库和旧组件实现直接搬进新项目。不要做花哨但影响阅读的常驻烟花、重型动画、过度装饰卡片或 AI 紫色渐变风格。不要把旧站硬编码的密钥、Sentry DSN、Gitalk client secret 或第三方 token 提交到客户端代码。

## Design Principles

1. 内容先于装饰：文章正文、发布时间、标签和搜索结果必须稳定、清晰、可访问。
2. 新实现优先：旧 Gatsby 站只作为功能和内容参考，迁移功能用 Next.js、TypeScript、Tailwind v4 和 shadcn 风格组件重建。
3. 个人实验室感：about、音乐和首页可以表达个人兴趣，但动效必须有目的，不能妨碍阅读和性能。
4. 安全配置外置：评论、统计、搜索和第三方服务配置通过环境变量管理，避免敏感信息进入版本控制。
5. 模板身份清零：所有 starter blog 示例内容、作者信息、文章和无关项目入口都替换为 Ruoduan 的真实内容。

## Accessibility & Inclusion

目标至少满足 WCAG AA 的文本对比度和键盘可访问性。主题模式继续尊重系统偏好并保留手动切换。动画必须支持 `prefers-reduced-motion`，音乐播放器必须使用原生可访问控件或等价语义控件，评论、搜索和导航都应支持键盘操作。
