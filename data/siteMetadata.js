/** @type {import("pliny/config").PlinyConfig } */
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
  newsletter: {
    provider: '',
  },
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
