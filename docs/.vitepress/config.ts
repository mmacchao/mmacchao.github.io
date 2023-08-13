import { DefaultTheme, DefaultTheme as DefaultTheme$1, defineConfig, UserConfig } from 'vitepress'

export type SidebarItem2 = DefaultTheme.SidebarItem & {
  // 文章写于哪一天
  date?: string
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // base: '/docs/',
  title: '学习旅程',
  description: '记录个人学习的网站',
  lang: 'zh-CN',
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '所有文章', link: '/article-list' },
      { text: 'JavaScript系列', link: '/JavaScript系列/start', activeMatch: '/JavaScript系列/' },
      { text: '前端基建', link: '/前端基建/start', activeMatch: '/前端基建/' },
      { text: 'typescript', link: '/ts/start', activeMatch: '/ts/' },
      { text: 'vue-router系列', link: '/vue-router/vue-router', activeMatch: '/vue-router/' },
      { text: 'markdown系列', link: '/markdown/markdown-demo', activeMatch: '/markdown/' },
      { text: 'vitepress系列', link: '/vitepress/getstarted', activeMatch: '/vitepress/' },
      { text: 'monorepo系列', link: '/monorepo/start', activeMatch: '/monorepo/' },
      { text: 'uni-app', link: '/uni-app/start', activeMatch: '/uni-app/' },
      {
        text: '其他',
        items: [
          { text: '日常开发', link: '/daily/内存优化/memory', activeMatch: '/daily/' },
          { text: '浏览器相关', link: '/浏览器相关/cache', activeMatch: '/浏览器相关/' },
          { text: 'flutter', link: '/flutter/start', activeMatch: '/flutter/' },
        ],
      },
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
            {
              text: 'markdown基础语法',
              link: '/markdown/markdown-demo',
              date: '2023-07-02',
            } as SidebarItem2,
            {
              text: 'markdown扩展语法',
              link: '/markdown/markdown-extend',
              date: '2023-07-02',
            } as SidebarItem2,
            {
              text: 'vitepress md语法',
              link: '/markdown/markdown-examples',
              date: '2023-07-02',
            } as SidebarItem2,
          ],
        },
      ],
      '/JavaScript系列/': [
        {
          text: '参考',
          items: [
            {
              text: '严格模式介绍',
              link: '/JavaScript系列/start',
              date: '2023-08-13',
            } as SidebarItem2,
          ],
        },
      ],
      '/vitepress/': [
        {
          text: '参考',
          items: [
            { text: '入门', link: '/vitepress/getstarted', date: '2023-07-02' } as SidebarItem2,
            {
              text: '自动部署到github个人站点',
              link: '/vitepress/github',
              date: '2023-07-02',
            } as SidebarItem2,
          ],
        },
      ],
      '/vue-router/': [
        {
          text: '参考',
          items: [
            {
              text: 'api练习demo',
              link: '/vue-router/vue-router',
              date: '2023-07-02',
            } as SidebarItem2,
          ],
        },
      ],
      '/monorepo/': [
        {
          text: '参考',
          items: [
            { text: 'monorepo入门', link: '/monorepo/start', date: '2023-07-03' } as SidebarItem2,
            { text: 'pnpm入门', link: '/monorepo/pnpm入门', date: '2023-07-12' } as SidebarItem2,
          ],
        },
      ],
      '/uni-app/': [
        {
          text: '参考',
          items: [
            { text: 'uni-app入门', link: '/uni-app/start', date: '2023-07-05' } as SidebarItem2,
          ],
        },
      ],
      '/ts/': [
        {
          text: '参考',
          items: [
            { text: 'typescript入门', link: '/ts/start', date: '2023-07-05' } as SidebarItem2,
            { text: '常见类型', link: '/ts/base', date: '2023-07-07' } as SidebarItem2,
            { text: '缩小类型范围', link: '/ts/narrowing', date: '2023-07-07' } as SidebarItem2,
            { text: '函数', link: '/ts/fn', date: '2023-07-07' } as SidebarItem2,
            { text: '对象', link: '/ts/obj', date: '2023-07-08' } as SidebarItem2,
            { text: '类型操作', link: '/ts/type-manipulation', date: '2023-07-08' } as SidebarItem2,
            { text: '模块', link: '/ts/module', date: '2023-07-12' } as SidebarItem2,
            { text: '声明文件', link: '/ts/d.ts', date: '2023-07-12' } as SidebarItem2,
            { text: '内置类型操作函数', link: '/ts/type-fn', date: '2023-07-18' } as SidebarItem2,
            { text: '类型体操', link: '/ts/类型体操', date: '2023-08-04' } as SidebarItem2,
          ],
        },
      ],
      '/flutter/': [
        {
          text: '参考',
          items: [
            { text: 'flutter入门', link: '/flutter/start', date: '2023-07-06' } as SidebarItem2,
          ],
        },
      ],
      '/daily/': [
        {
          text: '参考',
          items: [
            {
              text: '内存优化',
              link: '/daily/内存优化/memory',
              date: '2023-07-29',
            } as SidebarItem2,
          ],
        },
      ],
      '/前端基建/': [
        {
          text: '参考',
          items: [
            { text: '前端基建', link: '/前端基建/start', date: '2023-08-05' } as SidebarItem2,
            { text: 'prettier', link: '/前端基建/prettier', date: '2023-08-11' } as SidebarItem2,
            { text: 'eslint', link: '/前端基建/eslint', date: '2023-08-11' } as SidebarItem2,
          ],
        },
      ],
      '/浏览器相关/': [
        {
          text: '参考',
          items: [
            { text: '前端缓存介绍', link: '/浏览器相关/cache', date: '2023-08-12' } as SidebarItem2,
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/mmacchao/mmacchao.github.io' }],

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    outline: {
      label: '当前页',
    },
  },
})
