import { DefaultTheme, DefaultTheme as DefaultTheme$1, defineConfig, UserConfig } from 'vitepress'
// import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar';

// 直接copy的源码，用于生成nav和sidebar
import AutoNavPlugin from './vitepress-auto-configure-nav-sidebar-main/src'

const { nav, sidebar } = AutoNavPlugin({
  ignoreFolders: ['.vitepress', 'assets', 'img', 'work', 'life'], // 需要排除的一些目录
  ignoreFiles: ['todo.md', 'article-list.md', 'temp.js', 'temp.md', 'temp'], // 需要排除的一些文件
  dirPrefix: '',
  filePrefix: '',
  // showNavIcon:false,
  // showSideIcon:true,
  // isCollapse: true,
  // collapsed: true,
  // singleLayerNav:false,
  // hiddenFilePrefix: '.',
})

export type SidebarItem2 = DefaultTheme.SidebarItem & {
  // 文章写于哪一天
  date?: string
}
// console.log(11)

// 默认的sidebar嵌套了2层目录，目前是把两层目录都移除
const newSidebar = {}
Object.entries(sidebar).forEach(([key, [subFolder]]) => {
  subFolder.items.forEach((item) => {
    sortFileOrFolder(item.items || [])
    // 只有一条就不要侧边栏
    if (item.items?.length > 1) {
      newSidebar[`${key}${item.text}/`] = item.items
    }
  })
})

function sortFileOrFolder(list) {
  return list.sort((a, b) => {
    return a.text > b.text ? 1 : -1
  })
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // base: '/docs/',
  title: '学习旅程',
  description: '记录个人学习的网站',
  lang: 'zh-CN',
  lastUpdated: true,
  ignoreDeadLinks: true,
  themeConfig: {
    sidebar: newSidebar,
    nav: [
      { text: '所有文章', link: '/article-list' },
      ...nav.map((item) => {
        return {
          ...item,
          items: (item.items || [])
            .sort((a, b) => {
              return a.text > b.text ? 1 : -1
            })
            .map((item) => {
              item.text = item.text.split('-').pop()
              return item
            }),
          text: item.text.split('-').pop(),
        }
      }),
    ],
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
