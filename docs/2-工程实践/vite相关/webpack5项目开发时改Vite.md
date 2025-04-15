# webpack5开发时转vite

项目页面多了后webpack热更新太慢了，因此打算开发模式使用vite，打包避免出现问题还是使用webpack

也可以参考[Webpack to Vite](https://github.com/originjs/webpack-to-vite/blob/main/README-zh.md)，这是个自动转换的库，手动切换遇到问题可以到这个库文档中看下是否已有解决方案

步骤：
- 使用[create-vue](https://github.com/vuejs/create-vue)创建一个vue2的基于vite的项目  
```shell
pnpm create vue@2
```
- 创建项目后查看package.json，vue插件默认是@vite/plugin-vue2和@vite/plugin-vue2-jsx，这两个插件只支持vue2.7，项目用的还是2.6，因此把这两个插件移除，改成vite-plugin-vue2，这个插件支持jsx模式，不需要额外的vite-plugin-vue2-jsx
- vite是版本3，也可以用4
- 把新建项目的vite.config.js复制到webpack项目里面
- 在项目根目录新建index.html，vite默认取根目录的index.html
- 处理jsx：含有jsx语法时，需要js改成jsx，vue页面需要加上lang="jsx"，可以加入插件vite-plugin-lang-jsx，自动改，不过js的自动改似乎有问题，因此只启用了vue文件的自动改，js改为手动更改为jsx后缀，插件用法改成 langJsx()\[1]
- 处理环境变量：vite-plugin-env-compatible
- 处理require.context：@originjs/vite-plugin-require-context
- 处理项目代码的commonjs语法问题：@originjs/vite-plugin-commonjs，这个插件有些语法不支持，比如项目项目里面有个settings.js
  ```js
  # 用的commonjs导出
  modules.exports = {foo: 'foo', bar: 'bar'}
  
  # 使用方式一，这种插件能转换
  import settings from '@/settings'
  
   # 使用方式二，这种插件转换不了
  import {foo} from '@/settings'
  
  # 只能直接把settings.js改掉
  ```
- 处理externals: vite-plugin-externals
- 项目原自动生成路由的webpack插件改vite插件，原vue文件中的自定义config快写vite插件移除
- 项目依赖问题
  - el-select-tree：virtual-tree依赖vue2.7，项目上并未使用虚拟组件，webpack没有报错猜测是因为webpack做了tree-shake，vite会报错，这个比较暴力，直接改包的源码，每次包重新安装都得重新改一遍。或者使用pnpm的patch命令，避免团队成员都需要去改动三方包
  - 另一个项目依赖采用了省略文件名的导入，导致vite不支持
  ```js
  // 依赖内部的写法，导入./bar/index.js文件，省略了index.js，
  import foo from './bar'
  
  // 如果只是省略后缀，还ok，index都省略了，暂时没找到好的解决办法
  // 最终也是用的pnpm patch，直接改源码
  
  // 本来三方项目都是引用打包好的版本，不会有这个问题，
  // 但是项目有些地方使用不规范，直接引入了三方包的源码，导致有这个问题
  ```
- vite-plugin-vue2  适配vue2.6版本 
  - vite-plugin-lang-jsx插件自动添加jsx
  - 踩坑：index.html文件引入了cdn版本vue，未配置external，导致element-ui里面的vue和项目的vue不是同一个而出现各种奇怪错误
  - js文件中用到了jsx的要改成jsx后缀，虽然vite-plugin-lang-jsx提供的js自动改jsx，但会有一些报错
- @vite/plugin-vue2 适配vue2.7版本，这个版本还需为jsx单独引入插件 @vite/plugin-vue2-jsx
  - 踩坑：jsx始终搞不定

## 最终版的vite.config.ts文件
```ts
import { defineConfig, loadEnv } from 'vite'
import { createVuePlugin as vue } from 'vite-plugin-vue2'
import envCompatible from 'vite-plugin-env-compatible'
import requireContext from '@originjs/vite-plugin-require-context'
import langJsx from 'vite-plugin-lang-jsx'
import { fileURLToPath, URL } from 'node:url'
import fileWater from './auto-router'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import removeConfigBlock from './loaders/vite-config-loader'

export default defineConfig(({ mode }) => {
  // 获取环境变量
  const env = loadEnv(mode, process.cwd(), ['VUE_APP_'])
  const BASE_URL = env.VUE_APP_PROXY_URL
  return {
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    plugins: [
      // 处理vue文件中的自定义快
      removeConfigBlock(),
      // 提供类似webpack中的externals功能
      viteExternalsPlugin({
        vue: 'Vue',
        axios: 'axios',
        vuex: 'Vuex',
        'element-ui': 'ELEMENT'
      }),
      // 项目代码中的commonjs转esm
      viteCommonjs({
        include: ['settings.js', 'theme.js']
      }),
      // 提供require.context
      requireContext(),
      // 兼容process.env功能，vite默认的是import.meta.env
      envCompatible(),
      // 自动给vue文件加上lang="jsx"，langJsx()是同时给js和vue文件加jsx，但是js加了项目上有问题，就只应用vue文件
      langJsx()[1],
      // 转换vue文件
      vue({ jsx: true }),
      // 自动生成路由
      fileWater()
    ]
  }
})

```

## 新增的开发依赖项
```json
{
  "@originjs/vite-plugin-commonjs": "^1.0.3",
  "@originjs/vite-plugin-require-context": "^1.0.9",
  // 工具函数用于编写vite插件
  "@rollup/pluginutils": "^5.1.4",
  "vite": "4",
  "vite-plugin-env-compatible": "^2.0.1",
  "vite-plugin-externals": "^0.6.2",
  "vite-plugin-lang-jsx": "^1.5.3",
  "vite-plugin-vue2": "^2.0.3",
}
```
