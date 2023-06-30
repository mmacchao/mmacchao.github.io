import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '文章', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '文章列表',
        items: [
          { text: 'hello world', link: '/hello' },
          { text: 'demo1', link: '/markdown-examples' },
          { text: 'demo2', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
