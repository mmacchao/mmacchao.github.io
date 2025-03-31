---
aside: false
---

<script setup lang="ts">
import {useData, UserConfig, useRouter, VitePressData} from 'vitepress';
import {DefaultTheme} from "vitepress";
import {computed, ref} from 'vue';
import {data as allPageData} from './.vitepress/pages.data'


console.log(22, allPageData)

const data: VitePressData = useData()
// 顶部导航
let originNav: DefaultTheme.NavItem[] = data.theme.value.nav
console.log(data, useRouter())
let nav = []
originNav.forEach(item => {
  if (item.items?.length) {
    nav = nav.concat(item.items)
  } else {
    nav.push(item)
  }
})

const SORT_TYPE = {
  createTime: 'createTime',
  nav: 'nav',
  update: 'updateTime',
}

const SORT_TYPES = [
  {value: SORT_TYPE.createTime, label: '创建时间'},
  {value: SORT_TYPE.nav, label: '导航'},
  {value: SORT_TYPE.update, label: '更新时间'},
]
let sortType = ref(SORT_TYPE.nav)

// 具体路径的侧边目录
const sidebar: DefaultTheme.Sidebar = data.theme.value.sidebar

// 古早写在第三方网址的文章
const staticLinks = [
  {text: '记录一次vue2项目升级vue3项目的过程', link: 'https://juejin.cn/post/7246940748167643196', date: '2023-06-21'},
  {text: 'mini-vue学习笔记', link: 'https://juejin.cn/post/7243680440694865980', date: '2023-06-12'},
  {text: '数据库学习笔记', link: 'https://juejin.cn/post/7238445305582190653', date: '2023-05-29'},
  {
    text: 'ElementUI问题处理笔记 - table组件之小计行',
    link: 'https://juejin.cn/post/7237531176587853884',
    date: '2023-05-27'
  },
  {text: '达梦数据库笔记', link: 'https://juejin.cn/post/7237295525707808823', date: '2023-05-26'},
  {
    text: 'Vue3的一次render函数多次执行问题排查',
    link: 'https://juejin.cn/post/7215844385614250021',
    date: '2023-03-29'
  },
  {text: '小程序开发简介', link: 'https://zhuanlan.zhihu.com/p/472446728', date: '2022-02-25'},
  {text: 'Chrome如何禁用表单用户名密码自动填充', link: 'https://zhuanlan.zhihu.com/p/439999982', date: '2021-12-01'},
  {
    text: '试用ECMAScript stage-3的特性top-level-await',
    link: 'https://zhuanlan.zhihu.com/p/258912087',
    date: '2020-09-24'
  },
  {text: '由箭头函数引发的对一些概念的认识', link: 'https://zhuanlan.zhihu.com/p/242329522', date: '2020-09-14'},
  {text: 'bigData解决方案', link: 'https://zhuanlan.zhihu.com/p/216013922', date: '2020-09-09'},
  {text: '重温Promise', link: 'https://zhuanlan.zhihu.com/p/210148646', date: '2020-12-01'},
  {
    text: 'async并发、继发、错误处理、顶层await、Promise',
    link: 'https://zhuanlan.zhihu.com/p/210148646',
    date: '2020-09-01'
  },
  {
    text: '重温DOM事件流，捕获、冒泡、useCapture、passive',
    link: 'https://zhuanlan.zhihu.com/p/203018970',
    date: '2020-08-28'
  },
  {text: 'editconfig介绍', link: 'https://www.jianshu.com/p/163edebead01', date: '2019-07-19'},
  {text: '由图片下方的3px间隙引出的vertical-align', link: 'https://www.jianshu.com/p/1f69633609b0', date: '2019-07-18'},
  {text: 'requireJs绝对路径与配置路径与相对路径', link: 'https://zhuanlan.zhihu.com/p/28618032', date: '2017-08-19'},
].map(item => {
  item.createTime = item.date
  item.updateTime = item.date
  return item
})

console.log(nav)

nav = nav.concat(staticLinks)

const list = computed(() => {
  if (sortType.value === SORT_TYPE.nav) return nav
  if(sortType.value === SORT_TYPE.createTime) {
    let arr = []
    
  }
  return []
})

function getLinkTarget(link) {
  return link ? (link.startsWith('http') ? '_blank' : '_self') : 'self'
}

function getSidebarItems(navItem, sidebar) {
  const key = Object.keys(sidebar).find(activeMatch => navItem.link.indexOf(activeMatch) !== -1)
  if (key) return sidebar[key]
  return []
}

function toggleSort() {
  let idx = SORT_TYPES.findIndex(item => item.value === sortType.value)
  idx += 1
  if (idx >= SORT_TYPES.length) {
    idx = 0
  }
  sortType.value = SORT_TYPES[idx].value
}


</script>

# 所有文章
<div style="text-align: right;">
  <button :class="$style.btn" @click="toggleSort">切换排序方式</button>
  ：{{ SORT_TYPE[sortType]}}
</div>
<ul>
  <li v-for="nav in list">
    <div :class="$style.li">
      <a :href="nav.link" :target="getLinkTarget(nav.link)">{{nav.text}}</a>
      {{nav.date}}
    </div>
    <ul v-if="getSidebarItems(nav, sidebar)?.length > 1">
      <li v-for="item in getSidebarItems(nav, sidebar)" :class="$style.li">
        <a :href="item.link">{{item.text}}</a>
        {{item.date}}
      </li>
    </ul>
  </li>
</ul>

<style module>
.li {
  display: flex;
  justify-content: space-between;
  font-family: '微软雅黑';
}
.btn {
  background: #eee;
  border-radius: 4px;
  cursor: pointer;
  padding: 2px 8px;
  &:hover {
    background: #ddd;
  }
}
</style>

