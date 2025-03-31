# uni-app入门

## 简介
[官网文档](https://uniapp.dcloud.net.cn/quickstart-cli.html)

uni-app可以快速创建跨多端的项目，主要有3个平台，H5，小程序，App,语法方面主要是Vue，再加一些内置基础组件，扩展组件，第三方插件，
快速入门的话主要需要了解下如何快速创建项目及扩展组件的使用等

## 快速创建demo
uni-app可以通过2种方式快速创建项目
- HBuilderX的方式: HBuilderX就是可视化操作，但是隐藏了一些细节
- 命令行的形式: 命令行的形式对用一般开发者可能更熟悉，接下来的例子将以命令行的形式快速创建一个demo
    ```shell
    npx degit dcloudio/uni-preset-vue#vite my-vue3-project
    ```
  （如命令行创建失败，请直接访问 [gitee](https://gitee.com/dcloud/uni-preset-vue/repository/archive/vite-ts.zip) 下载模板）


## 运行demo
### 安装依赖
```shell
npm install

npm install sass -D
```
### 预览
- h5的形式
    ```shell
    npm run dev:h5
    ```
- 小程序
    ```shell
    npm run dev:mp-weixin
    ```
    然后看控制台的提示，用**微信开发者工具**打开对应的目录，微信开发者工具需自行安装
- App
    ```shell
    npm run dev:app
    ```
    看控制台提示，用**HBuilderX**打开对应目录，并运行到手机，HBuilderX需自行安装

## 使用扩展组件
扩展组件就是uni-app官方提供的组件，也是用vue写的，就像普通vue组件一样引入注册即可
### 先引入
```shell
npm install @dcloudio/uni-ui -S
```

uni-app官方提供了更简洁的自动引入配置, 在src/pages.json里面加入如下配置即可
```json
{
  // ...其他配置
  "easycom": {
    "autoscan": true,
    "custom": {
      // uni-ui 规则如下配置
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
    }
  }
}
```

## 新建detail页面
在src/pages目录下面新建目录/detail，并创建文件index.vue
```html
<template>
  <view class="content">
    <view class="text-area">
      <text class="title">{{ title }}</text>
      <uni-rate text="1"></uni-rate>
      <view>
        <uni-datetime-picker></uni-datetime-picker>
      </view>
    </view>
  </view>
</template>

<script>
// import UniRate from '@dcloudio/uni-ui/lib/uni-rate/uni-rate.vue'
export default {
  // components: {UniRate},
  data() {
    return {
      title: 'detail',
    }
  },
  onLoad() {},
  methods: {},
}
</script>

<style>

</style>
```
## 从首页跳转到detail页面
uni是uni-app提供的全局对象，上面挂载了很多api，比如路由跳转的uni.navigateTo
```html
<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
      <button @click="gotoDetail">跳转到详情页</button>
      <text>你好啊</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello',
    }
  },
  onLoad() {},
  methods: {
    gotoDetail() {
      uni.navigateTo({url: '../detail/index'})
    }
  },
}
</script>
```
    
