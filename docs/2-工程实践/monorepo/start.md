# monorepo入门

[带你了解更全面的 Monorepo - 优劣、踩坑、选型](https://juejin.cn/post/7215886869199896637)

[Vue3源码01 : 代码管理策略-monorepo](https://juejin.cn/post/7075629428671250445)

[Vue3 源码解析（一）—— 包管理](https://zhuanlan.zhihu.com/p/380376771)

## monorepo简介
monorepo不是某个库或者软件，而是一种项目代码管理方式的称呼，即将多个项目放在一个仓库里面进行统一管理，每个项目可以单独发布到npm，那么具体怎么统一管理呢？
可以手工或者使用工具软件，首先明白如何手动管理，然后工具就是把手动管理的动作自动化而已

## 手动管理

现在有2个独立的项目**projectA，projectB**,改造成monorepo的组织形式为
```
- root 
    - projectA
        - index.js
        - package.json
    - projectB
        - index.js
        - package.json
```
**其中项目projectB引用了projectA**
::: tip
例子采用commonjs写法，因此可以不用打包工具直接在node环境运行
:::

运行projectB的代码需要如下步骤：
```shell
cd projectB
npm install
node index.js
```
projectA/index.js
```js
function foo() {
  console.log('A')
}
module.exports = {
  foo,
}
```
projectA/package.json
```json
{
  "name": "@monorepo/A",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}

```
projectB/index.js
```js
const foo = require('@monorepo/A').foo
foo()
console.log('B')
```

projectB/package.json
```json
{
  "name": "C",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    // 通过相对路径的方式，执行npm install后会安装本地依赖，"@monorepo/A"为projectA/package.json里面的name字段值
    "@monorepo/A": "../projectA" 
  },
  "author": "",
  "license": "ISC"
}
```

### 需要的手动操作如下：
- 每个项目的依赖安装
- 有些被依赖的项目可能需要先执行构建命令：npm run build
- 在projectB/package.json里面，需要用相对路径的方式引入projectA

## pnpm的workspace管理
[pnpm官方workspace介绍](https://pnpm.io/zh/workspaces)
- 创建pnpm-workspace.yaml
```yaml
packages:
  # all packages in direct subdirs of packages/
  - 'packages/*'
  # all packages in subdirs of components/
  - 'components/**'
  # exclude packages that are inside test directories
  - '!**/test/**'
```
projectB/package.json
```json
{
  "name": "C",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    // 现在可以正常写版本号了，会优先自动从本地寻找包
    // 也可以用workspace协议，即 "@monorepo/A": "workspace:*"
    "@monorepo/A": "^1.0.0"
  },
  "author": "",
  "license": "ISC"
}
```
在根目录执行
```shell
pnpm install
cd packages/projectB
node index.js
```
### 相比手动管理的优势：
- 在项目根目录执行一次依赖安装即可
- 被依赖的版本号不再需要写相对路径了

## npm的workspace管理
[npm官方workspace简介](https://docs.npmjs.com/cli/v8/using-npm/workspaces)

在根目录创建package.json，并添加workspaces字段
```json
{
  "name": "my-workspaces-powered-project",
  "workspaces": [
    "packages/projectA"
  ]
}
```
projectB/package.json
```json
{
  "name": "C",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@monorepo/A": "^1.0.0"
  },
  "author": "",
  "license": "ISC"
}

```
执行 npm install之后，会自动在根目录的node_modules里面创建projectA的快捷键
在根目录执行
```shell
npm install
cd packages/projectB
node index.js
```
相比手动管理的优势和[pnpm](#相比手动管理的优势)一样

## [查看例子源码](https://github.com/mmacchao/mmacchao.github.io/tree/master/examples/monorepo)

