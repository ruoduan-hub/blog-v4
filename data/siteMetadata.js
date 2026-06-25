/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: "Chad's Blog",
  author: 'Chad',
  headerTitle: 'Chad Lab',
  description: '若端的个人技术实验室，记录前端、工程化、Node.js、Python 和探索实践。',
  language: 'zh-cn',
  theme: 'system',
  siteUrl: 'https://www.ruoduan.cn',
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: 'z.ruoduan@gmail.com',
  github: 'https://github.com/ruoduan-hub',
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
