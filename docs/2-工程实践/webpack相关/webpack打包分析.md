# webpack打包入门

## 一个基础的webpack打包

## 打包成库时的模式 output.library.type: var commonjs  module amd umd
- 模块格式
  - var 支持导出为全局变量
  - commonjs  node模块格式，用module.exports导出，require同步导入，有些特殊版本是用exports导出，在node程序里面，cjs文件要使用esm模块需要动态导入import()
  - amd 前端早期的模块导入方式 define([], () => {})导出, require导入
  - umd 同时支持commonjs和amd和var
  - module 现代esm模块，通过import 和 export导入导出
- 宿主是如何处理第三方包的，是否会转译第三方包
  - webpack本身不做转译工作，由babel转译，babel默认不转译node_modules包
- 通过external排除指定包，由宿主环境提供

## 库模式依赖第三方包
- 把第三方打包进自己的包
- 排除第三方包，有宿主环境提供，通过配置external
- 宿主提供时，如何确保和自己需要的依赖版本不冲突（这个可以由第三方包在代码中判断）
- 打包进自己的包后，宿主又提供了一份不一样的版本，会发生什么(那就是存在两个版本，不同的地方用不同的版本，存在未知风险)
- 编译第三方包时，三方包的dependencies和项目的dependencies依赖版本不一致会发生什么
  - webpack5默认先找三方包下的node_modules，再往上，因此如果三方包external了一个包，如果这个包又在dependencies里面，这样宿主编译三方包时就会加载宿主提供的包
  - 这个涉及包的寻找机制
    - node:  [require.resolve](https://juejin.cn/post/6844904055806885895)，默认从package的node_modules一级一级往上找 参考
    - webpack: [enhanced-resolve](https://juejin.cn/post/6844904056633327630)，相比node的require.resolve增加了很多功能
