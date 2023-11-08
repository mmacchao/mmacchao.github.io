# qiankun入门
类似于后端的微服务，避免前端变成巨石应用，又有点类似于vue-router这种路由插件，官方的说法是类似于一个jquery，只需要调用几个API就可以完成微前端改造，内部基于single-spa实现css和js隔离，和iframe有什么区别？

[qiankun官网](https://qiankun.umijs.org/zh/guide)

[2023微前端技术方案选型](https://juejin.cn/post/7236021829000691771)

## 入门Demo

### 创建主应用
1. 创建index.html，创建main.js
3. 在main.js里面引入qiankun，并定义路由
3. 在index.html里面引入main.js，并写好几个菜单切换按钮，每个菜单的导航路径就是上面的路由，可以直接用history.push进行路由切换

### 创建purehtml子应用
1. 创建html, js
2. js里面给global.purehtml对象添加生命周期函数，一般在mount函数里面进行子页面初始化

然后就可以启动主应用和子应用，然后浏览器访问主应用了，可以用vscode的live server启动应用

## single-spa入门

[single-spa官网](https://zh-hans.single-spa.js.org/docs/getting-started-overview)

[微前端框架 之 single-spa 从入门到精通](https://juejin.cn/post/6862661545592111111)

1. 创建主应用html, js
2. 创建子应用js


## single-spa和qiankun的对比
[前端微服务：single-spa与qiankun的区别](https://juejin.cn/post/7011767759432318984)

qiankun是基于single-spa开发的，qiankun实现的额外功能有

1. 自动加载子应用，不像single-spa需要自己写加载逻辑
2. 隔离子应用的js和css
3. qiankun可以加载html entry，而single-spa只能加载js entry
