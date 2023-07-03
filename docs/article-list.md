---
aside: false
---

<script setup>
import { useData } from 'vitepress'

const data = useData()
const nav = data.theme.value.nav
const sidebar = data.theme.value.sidebar
</script>

# 所有文章

- [记录一次vue2项目升级vue3项目的过程](https://juejin.cn/post/7246940748167643196)
- [mini-vue学习笔记](https://juejin.cn/post/7243680440694865980)
- [数据库学习笔记](https://juejin.cn/post/7238445305582190653)
- [ElementUI问题处理笔记 - table组件之小计行](https://juejin.cn/post/7237531176587853884)
- [达梦数据库笔记](https://juejin.cn/post/7237295525707808823)
- [Vue3的一次render函数多次执行问题排查](https://juejin.cn/post/7215844385614250021)
<ul>
<li v-for="nav in nav.slice(2)">
    <a :href="nav.link">{{nav.text}}</a>
    <ul v-if="sidebar[nav.activeMatch]?.length === 1">
        <li v-for="item in sidebar[nav.activeMatch][0].items" :class="$style.li">
            <a :href="item.link">{{item.text}}</a>
            {{item.date}}
        </li>
    </ul>m 
</li>
</ul>

<style module>
.li {
    display: flex;
    justify-content: space-between;
}
</style>

