# Typescript入门
[typescript官网](https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html)

typescript就是给js加了类型，文件后缀改成了.ts，然后用tsc将.ts转换为.js，它有一个默认的转换规则，也可以写一个tsconfig.json来配置转换规则

## 简单demo
1. 新建start.ts文件
```ts
function greeter(person: string) {
  return "Hello, " + person;
}
 
let user = "Jane User";
 
document.body.textContent = greeter(user);
```
2. 编译成start.js，执行tsc start.ts即可，不过要先安装typescript，才能执行tsc命令，可以全局安装，也可以本地安装
```shell
npm i typescript -g 
# 打开start.ts所在的目录
tsc start.ts
# 同目录下会生成start.js
```
::: tip
有ts语法错误也是可以编译成功的，可以通过后面跟上命令--noEmitOnError来禁止语法错误时的编译
:::

编译后的**start.js**,只是把类型定义去除了
```js
function greeter(person) {
    return "Hello, " + person;
}
var user = "Jane User";
document.body.textContent = greeter(user);
```

## tsconfig.json说明
tsc后面可以跟很多编译参数，比如 tsc start.ts --noEmit --allowJs --checkJs --onEmitOnError

可以把参数写在tsconfig.json里面，编译时如果没写编译命令会往上自动寻找并应用tsconfig.json
可以通过命令快速生成tsconfig.json文件
```shell
tsc --init
```

## 一些常用编译参数介绍
```json
{
  "compilerOptions": {
    "allowJs": false, // 是否允许项目中存在js，默认是false，对于老项改成ts很有用
    "checkJs": false  // 是否检测js中的类型错误
  }
}
```

## 与构建工具vite结合
vite默认支持ts文件，构建时会自动编译ts文件，但它用的esbuild编译的，而且是只支持编译，不会进行类型检查，也就意味着你即使报了ts类型错误也不影响项目运行

vite给的建议是
- 开发时，依赖IDE给出ts错误提示，或者单独运行 tsc --noEmit --watch，或者使用vite-plugin-checker，可以在浏览器上报ts错误
- 构建生产版本时，可以在vite构建命令之外运行 tsc --noEmit, --noEmit表示不生成编译后的js文件，只报告类型错误，检查到类型错误自行处理即可
