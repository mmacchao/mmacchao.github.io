# typescript模块

## 像es6一样导入导出
非typescript编译器可能不识别导出的是ts类型，如esbuild,babel
```ts
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
 
export interface Dog {
  breeds: string[];
  yearOfBirth: number;
}
 
// @filename: app.ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
```

## 加入type关键字
```ts
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";
 
// @filename: valid.ts
import type { Cat, Dog } from "./animal.js";
export type Animals = Cat | Dog;
 
// @filename: app.ts
import type { createCatName } from "./animal.js";
// 'createCatName' cannot be used as a value because it was imported using 'import type'.
const name = createCatName();
```
内联type导入
```ts
// @filename: app.ts
import { createCatName, type Cat, type Dog } from "./animal.js";

export type Animals = Cat | Dog;
const name = createCatName();
```

## 命名空间
通过namespace定义，有点类似与全局变量里面的某个对象，例如 window.Math，定义在多个文件中的同一个namespace，就像写在同一个文件一样，
对于一些直接通过script引入的lib，命名空间还是有点用的，而其他情况下推荐用模块而不是命名空间
```ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```
在一些.d.ts文件中可能会看到这个 
```ts
// 这个等效于 declare namespace A {}, 且推荐使用namespace, module是旧版本的用法
declare module A {
  interface B {
    a: string
  }
}
```
