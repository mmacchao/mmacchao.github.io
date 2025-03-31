# 类型定义文件
参考：[巧妙利用TypeScript模块声明帮助你解决声明拓展](https://zhuanlan.zhihu.com/p/542379032)

参考：[JavaScript 和 TypeScript 交叉口 —— 类型定义文件(*.d.ts)](https://juejin.cn/post/6844903508987265038)

## 简介
为了给js文件添加类型，以及给第三方库扩展类型，typescript推出了.d.ts文件类型，这里面是不能有具体实现的。当你引入一个js文件时，tsc会自动寻找同目录下同名的.d.ts文件，用于静态类型分析，
当然你没有这个.d.ts文件，tsc也不会有啥异常，但ts的核心功能——静态类型判断，就没了

## 常见应用
- 为项目中的js添加类型定义 - 新建一个同名的.d.ts文件，放在同一个目录下(我的猜测：如果不放在同一目录或者名字不一样，tsc不能判断这个.d.ts文件是对应js的定义文件)
  
  参考官方定义文件：[Module: Function](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-function-d-ts.html)
- 扩展npm库中的类型定义 - 新建一个任意命名的.d.ts文件，放在项目任意目录中，tsconfig.json中没有配置相关路径的话，默认加载项目所有.d.ts文件
  ```ts
  // 扩展axios，需要有个import或者export语句，这样才是定义模块类型，没有的话就是定义全局类型，会导致覆盖掉npm中的类型定义
  export {}
  declare module 'axios' {
    // 模块内的接口声明会自动合并
    interface AxiosRequestConfig {
      showLoading: boolean; // 是否显示全局loading
    }
  }
  ```

## 全局定义文件
全局定义就是给全局变量添加类型定义，全局变量的使用是不需要导入的

如果在.d.ts文件中没有任何的import, export语句, 那么所有的declare定义都被认为是全局定义，比如你没有安装@types/jquery，
那么如何手动添加jquery的类型定义，如下: 添加一个.d.ts文件，放在项目任意目录下
```ts
// global.d.ts
declare function $(selector: string): {html(str: string): void}
```
如何在有import，export语句的文件中定义全局类型呢？
```ts
declare global {
  declare function funA(): void;
}
```

## .d.ts文件的查找
在没有tsconfig.json文件的时候，需要手动通过reference的形式指定如何查找对应的声明文件
```ts
// 通过typescript的三斜杠形式，引入对应的.d.ts文件
/// <reference path="global.d.ts" />
type a = MyGlobalClass
$('#app').html('<p>你好，.d.ts</p>')
console.log(myGlobalVariable);

myGlobalFunction();

console.log(myGlobalObject.prop);

const myObject = new MyGlobalClass('John');
myObject.sayHello();
```
如果项目中有tsconfig.json后，可以设置一个空的tsconfig.json,那么其中的include会默认包含整个项目所有的.ts和.d.ts文件，
所以就不再需要通过reference引入声明文件了
```json
// tsconfig.json
{
  "compilerOptions": { 
    "target": "ES6"
  },
}
```
