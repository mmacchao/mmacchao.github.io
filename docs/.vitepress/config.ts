import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // base: '/docs/',
  title: "学习旅程",
  description: "记录个人学习的网站",
  lang: 'zh-CN',
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '所有文章', link: '/article-list' },
      { text: 'markdown系列', link: '/markdown/markdown-demo', activeMatch: '/markdown/' },
      { text: 'vitepress系列', link: '/vitepress/getstarted', activeMatch: '/vitepress/' },
      { text: 'vue-router系列', link: '/vue-router/vue-router', activeMatch: '/vue-router/' },
      { text: 'monorepo系列', link: '/monorepo/start', activeMatch: '/monorepo/' }
    ],

    sidebar: {
      // '/': [
      //   {
      //     text: '文章列表',
      //     items: [
      //       { text: 'vue-router学习笔记', link: '/vue-router' },
      //     ]
      //   }
      // ],
      '/markdown/': [
        {
          text: '参考',
          items: [
            { text: 'markdown基础语法', link: '/markdown/markdown-demo', date: '2023-07-02' },
            { text: 'markdown扩展语法', link: '/markdown/markdown-extend',  date: '2023-07-02' },
            { text: 'vitepress md语法', link: '/markdown/markdown-examples',  date: '2023-07-02' },
          ]
        }
      ],
      '/vitepress/': [
        {
          text: '参考',
          items: [
            { text: '入门', link: '/vitepress/getstarted',  date: '2023-07-02' },
            { text: '自动部署到github个人站点', link: '/vitepress/github',  date: '2023-07-02' },
          ]
        }
      ],
      '/vue-router/': [
        {
          text: '参考',
          items: [
            { text: 'api练习demo', link: '/vue-router/vue-router',  date: '2023-07-02' },
          ]
        }
      ],
      '/monorepo/': [
        {
          text: '参考',
          items: [
            { text: 'monorepo入门', link: '/monorepo/start',  date: '2023-07-03' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mmacchao/mmacchao.github.io' }
    ],

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    outline: {
      label: '当前页'
    }



  }
})
