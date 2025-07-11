# vite热更新不生效

- keep-alive导致的不生效：开发模式下禁用即可
- jsx导致热更新不生效

## jsx导致不生效问题

vue2项目从接入vite4（vite-plugin-vue2只支持到vite4）后，陆续有些页面不能热更新，一直未找到原因。

以下记录一次排查热更新无效的过程：

1. 多轮比对可以热更新页面和不能热更新页面的代码情况，未找到解决方案
2. 询问chatGPT为什么部分页面能热更新，其中给出了用vite-plugin-inspect检查代码的方案，了解到了这个插件
   - vite-plugin-inspect插件用于展示业务组件是如何被vite各种插件进行转换的
   - 经过多轮比对能更新和不能更新页面编译后差异情况，发现不能更新页面都是jsx页面
3. vite-plugin-vue2支持jsx，去到github查找issue，有人提出这个jsx热更新问题，似乎没有被解决
4. 升级插件为官方@vitejs/plugin-vue2，@vitejs/plugin-vue2-jsx，依然存在问题
5. 升级到vite6，问题解决

思考：如果依然未解决，是否可以自行研究vite热更新原理及vite-plugin-vue2源码，自行解决这个问题呢？

## 再次问题排查

参考：[Vite5.0 moduleGraph软失效(soft invalidate)浅析](https://juejin.cn/post/7325725026618474534)

[Vite 源码（六）解析 importAnalysis 插件](https://juejin.cn/post/7046344441653067790)

使用过程中发现依然有部分文件不能热更新，比如add.vue，改模板内容会重新加载add.vue，但是改js内容，只会重新加载add.vue，不会加载js文件add.vue?type=script&lang.jsx

> add.vue，add.vue?type=script&lang.jsx有什么区别？明明只是查询参数不同，为何是两个不同的文件？只是vite启动了一个服务器transformMiddleware，同时会拦截.vue请求，并根据不同的查询参数生成不同的文件，此文件磁盘中不存在。类似于调用后端接口动态拼接文件内容并返回


排查过程：用webstorm的调试模式启动vite，断点调试
- vite版本：6.3.5
- vite源码文件dist/node/chunks/dep-DBxKXgDP.js
- vite监听文件变化watcher.on("change"
- 执行onHMRUpdate，
- 在handleHMRUpdate收集需要热更新的模块hotMap，执行更新hmr(environment)，然后updateModules，然后使模块失效invalidateModule（通过添加失效标记）,
  - hotMap一般只包含修改的一个文件
  - hotMap.options.modules 需要热更新的模块
  - module.importedModules内部导入的模块，也需要热更新，比如add.vue中lang=jsx中的js内容就是被处理成一个单独的import导入的，此时js改动也需要把js文件热更新
- invalidateModule 使模块失效，就是给模块增加加个时间lastHMRTimestamp，后续这个值会被用到
  - 使得add.vue失效，同时遍历其父引用importers，使父引用失效，过程中会有个seen缓存，避免循环引用问题
  - add.vue -> .auto.js -> router/index.js -> main.js -> router/router.js -> store/permission.js -> store/index.js -> add.vue?script&lang.jsx
  - 转了一圈，终于找到了add.vue?script&lang.jsx，这算是bug吗，不能直接找一下add.vue内部的引用吗。
  - 如果移除add.vue?script中的store引用，果然js热更新失效
- 给客户端发送socket消息通知更新
- 客户端通过import动态获取文件add.vue，同时add.vue中的import main from 'add.vue?type=script&lang.jsx&t=123253543'，其中的时间戳t只有被标记为热更新时才会被vite添加，否则不会加载这个文件
- vite服务端拦截请求，transformMiddleware -> transformRequest -> doTransform -> environment.moduleGraph.getModuleByUrl(url)
- 执行插件的load和transform: loadAndTransform，获取转换后的结果
- 在vite:import-analysis插件（vite内置插件）中根据lastHMRTimestamp是否大于0执行动态替换.vue文件中的import语句，加入时间戳获取新文件
- 获取到新文件后，重新注册组件或者替换render和options等属性后执行render或者$forceUpdate

**草率的结论**：如果add.vue?script中没有引入store，又没有其他方式通过add.vue一步步的链接到add.vue?script，则add.vue?script不会被标记为热更新，解决方案便是找到add.vue的某个父级引用，然后在add.vue中引入它形成一个循环引用？

如果有更好的解决方案还请评论告知。