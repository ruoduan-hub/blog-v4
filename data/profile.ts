export type SocialLink = {
  label: string
  href: string
}

export type MusicTrack = {
  title: string
  description: string
  src: string
}

export type SiteStackNote = {
  title: string
  description: string
}

export const profile = {
  name: 'Chad',
  handle: 'ruoduan-hub',
  title: 'Web全栈开发工程师',
  email: 'z.ruoduan@gmail.com',
  location: 'China',
  intro: '记录Web开发、工程化、Node.js、Python、部署和个人折腾的技术实验室。',
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
    '2026年6月26日(Vibe Coding) ClaudeCode、Codex、接力完成BlogV4 —— Nextjs全新技术架构迁移',
    '2024年6月14日 use loremflickr.com | rm unsplash',
    '2024年03月08日 Comment use Gitalk（Leancloud 节点关闭数据丢失）',
    '2024年02月18日 更新 Avatar & Guitar Video',
    '2023年12月09日 更新 Header 烟花效果',
    '2023年11月26日 更新吉他曲目',
    '2023年09月09日 添加 OpenAI DALL.E 绘图工具',
    '2023年4月 迁移阿里云服务器，使用 Vercel + Serverless 部署',
    '2023年3月 重构 Gatsby，升级到 V5 版本，使用 Node.js 18 构建',
    '2022年11月25日 添加 Google reCAPTCHA',
    '2022年4月 框架升级到 V4 版本，更新 webpack 5、React 18 等插件',
    '2021年8月 移除 antd，使用 material-ui 并优化 typographyjs',
    '2021年7月 增加 Sentry 错误监控',
    '2021年7月 增加 Algolia Search 功能',
    '2021年3月 增加 Valine-Admin 评论管理后台（已移除）',
    '2021年2月 重构 Gatsby 博客',
    '2020年2月 使用 Gatsby',
    '2019年3月 切换到 VuePress',
    '2018年7月 使用 Hexo 正式搭建博客',
  ],
  siteStackNotes: [
    {
      title: '当前版本',
      description: 'Next.js、TypeScript、Contentlayer、Tailwind CSS、shadcn/ui、Gitalk。',
    },
    {
      title: '旧站能力',
      description: 'Gatsby、MDX、Github Actions、Sitemap、SEO、暗色模式、搜索、评论系统。',
    },
    {
      title: '部署方式',
      description: '从 CentOS7、Nginx、certbot 迁移到 Vercel CI/CD 与 Serverless。',
    },
  ] satisfies SiteStackNote[],
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
