# Chad Lab 

若端的个人博客，基于 Next.js、TypeScript、Contentlayer、Tailwind CSS 和 shadcn/ui 构建。

本项目基于 [next-blog-skyplume-template](https://github.com/ruoduan-hub/next-blog-skyplume-template) 模板构建。

This project is built on the [next-blog-skyplume-template](https://github.com/ruoduan-hub/next-blog-skyplume-template) template.

このプロジェクトは [next-blog-skyplume-template](https://github.com/ruoduan-hub/next-blog-skyplume-template) テンプレートを基に構築されています。

## 内容

- 文章：`data/blog`
- 作者信息：`data/authors/default.mdx`
- 个人资料与音乐：`data/profile.ts`
- 静态资源：`public/static`
- Gitalk 评论：`components/comments/GitalkComments.tsx`

## 常用命令

```bash
yarn dev
yarn build
yarn migrate:blog
yarn verify:migration
```

## 迁移说明

老博客来源：`/Users/ruoduan/dev/my-Gatsby-Blog`

迁移脚本会读取老项目 `content/blog` 下的 Markdown 文章，保留标题、发布时间、标签、分类和正文内容，并将本地图片资源复制到 `public/static/blog`。旧文章中的部分 HTML 和 MDX 不兼容语法会在迁移层转换为 Next.js/React 可渲染格式。

评论继续使用 Gitalk。为了保留旧评论数据，新站会优先使用旧站文章 URL 作为 Gitalk issue 标识。
