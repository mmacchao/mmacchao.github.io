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
一种早期的模块组织形式，等效于创建全局变量，使用时要用script把所有文件引入，或者合并所有编译文件，有了es6的module后就不推荐使用了
```ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
  export class A {
    
  }
}

// 编译后的文件
"use strict";
var Validation;
(function (Validation) {
  class A {
  }
  Validation.A = A;
})(Validation || (Validation = {}));
```
多个文件通过``/// <reference path="Validation.ts" />`这种形式引入，有点类似script标签
