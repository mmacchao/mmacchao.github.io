---
aside: false
---

<script setup lang="ts">
import { useData, UserConfig, VitePressData } from 'vitepress';
import { DefaultTheme } from "vitepress"; 

const data: VitePressData = useData()
let nav: DefaultTheme.NavItem[] = data.theme.value.nav.slice(2)
const sidebar: DefaultTheme.Sidebar = data.theme.value.sidebar
nav = nav.concat([
    {text: '记录一次vue2项目升级vue3项目的过程', link: 'https://juejin.cn/post/7246940748167643196', date: '2023-06-21'},
    {text: 'mini-vue学习笔记', link: 'https://juejin.cn/post/7243680440694865980', date: '2023-06-12'},
    {text: '数据库学习笔记', link: 'https://juejin.cn/post/7238445305582190653', date: '2023-05-29'},
    {text: 'ElementUI问题处理笔记 - table组件之小计行', link: 'https://juejin.cn/post/7237531176587853884', date: '2023-05-27'},
    {text: '达梦数据库笔记', link: 'https://juejin.cn/post/7237295525707808823', date: '2023-05-26'},
    {text: 'Vue3的一次render函数多次执行问题排查', link: 'https://juejin.cn/post/7215844385614250021', date: '2023-03-29'},
    {text: '小程序开发简介',  link: 'https://zhuanlan.zhihu.com/p/472446728', date: '2022-02-25'},
    {text: 'Chrome如何禁用表单用户名密码自动填充',  link: 'https://zhuanlan.zhihu.com/p/439999982', date: '2021-12-01'},
    {text: '试用ECMAScript stage-3的特性top-level-await',  link: 'https://zhuanlan.zhihu.com/p/258912087', date: '2020-09-24'},
    {text: '由箭头函数引发的对一些概念的认识',  link: 'https://zhuanlan.zhihu.com/p/242329522', date: '2020-09-14'},
    {text: 'bigData解决方案',  link: 'https://zhuanlan.zhihu.com/p/216013922', date: '2020-09-09'},
    {text: '重温Promise',  link: 'https://zhuanlan.zhihu.com/p/210148646', date: '2020-12-01'},
    {text: 'async并发、继发、错误处理、顶层await、Promise',  link: 'https://zhuanlan.zhihu.com/p/210148646', date: '2020-09-01'},
    {text: '重温DOM事件流，捕获、冒泡、useCapture、passive',  link: 'https://zhuanlan.zhihu.com/p/203018970', date: '2020-08-28'},
    {text: 'editconfig介绍', link: 'https://www.jianshu.com/p/163edebead01', date: '2019-07-19'},
    {text: '由图片下方的3px间隙引出的vertical-align', link: 'https://www.jianshu.com/p/1f69633609b0', date: '2019-07-18'},
    {text: 'requireJs绝对路径与配置路径与相对路径', link: 'https://zhuanlan.zhihu.com/p/28618032', date: '2017-08-19'},
])
</script>

# 所有文章

<ul>
<li v-for="nav in nav" >
    <div :class="$style.li">
        <a :href="nav.link" :target="nav.link.startsWith('http') ? '_blank' : '_self'">{{nav.text}}</a>
        {{nav.date}}    
    </div>
    <ul v-if="sidebar[nav.activeMatch]?.length === 1">
        <li v-for="item in sidebar[nav.activeMatch][0].items" :class="$style.li">
            <a :href="item.link" >{{item.text}}</a>
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

</style>

