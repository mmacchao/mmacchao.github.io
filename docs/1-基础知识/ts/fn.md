# 函数

## 类型定义
```ts
// 简单形式
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

// 类型别名
type Fn = (a: string) => void

// 带属性的函数，和对象还是有点不同的
type Fn = { 
  foo: string,
  (a: string): void
}

// 对象类型
type Obj = {
  foo: string,
  fn: (a: string) => void,
}

// 构造函数
type Fn = {
  new (a: string): void
}

// 有些对象，例如 JavaScript 的Date对象，可以使用或不使用new. 您可以任意组合同一类型的调用和构造签名：
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): string;
}

// 通用函数，利用泛型实现
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

## 函数返回值推断
```ts
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}
 
// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
```

## 指定类型参数
```ts
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}

const arr = combine([1, 2, 3], ["hello"]);
// Type 'string' is not assignable to type 'number'.

// 可以手动指定Type
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

## 编写良好泛型函数的指南
```ts
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}
 
function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0];
}
 
// a: number (good)
const a = firstElement1([1, 2, 3]);
// b: any (bad)
const b = firstElement2([1, 2, 3]);
```

### 尽可能少的类型参数
```ts
// good, 只有一个Type泛型
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}
 
// bad 有2个泛型 Type和Func
function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func);
}
```

### 类型参数应该出现两次
```ts 
// 这里Str只被用到了一次
function greet<Str extends string>(s: Str) {
  console.log("Hello, " + s);
}
 
greet("world");

// 更简单的版本
function greet(s: string) {
  console.log("Hello, " + s);
}
```

## 回调中的可选参数
加?即是可选参数，但是调用时确会报错，怎么解决，函数重载
```ts
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed());
  // 'i' is possibly 'undefined'.
});
```

## 函数重载
编写一定数量的函数签名（通常是两个或更多），然后是函数体
```ts
// 此示例中，我们编写了两个重载：一个接受一个参数，另一个接受三个参数。前两个签名称为重载签名
// 从外部看不到实现的签名。当编写重载函数时，您应该始终在函数的实现之上有两个或多个签名。
function makeDate(timestamp: number): Date; // 函数签名
function makeDate(m: number, d: number, y: number): Date; // 函数签名
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date { // 实际函数体
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
// No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
```
实现签名还必须与重载签名兼容。例如，这些函数有错误，因为实现签名与重载不正确匹配：
```ts
function fn(x: boolean): void;
// Argument type isn't right
function fn(x: string): void;
// 实现签名的参数类型与重载签名不兼容
function fn(x: boolean) {}
```
```ts
function fn(x: string): string;
// Return type isn't right
function fn(x: number): boolean;
// 实现签名的返回类型与重载签名不兼容
function fn(x: string | number) {
  return "oops";
}
```
::: tip
对于参数个数相同但是类型不同，应优先考虑联合类型而不是重载，可选参数可以优先考虑重载
:::
```ts
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
  return x.length;
}

function len(x: any[] | string) {
  return x.length;
}
```

## 在函数中声明this
将this放在第一个参数来定义this的类型，这是定义this的特殊形式，因为this是个关键字，不能充当变量名称
```ts
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}
 
const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin;
});
```

## 其他ts类型
- void // 与undefined不同
- object
- unknown // 与any类似，但是unknown类型不能执行任何属性访问操作
- never 
- Function

### never
```ts
// 返回never意味着函数抛出异常或终止程序
function fn(x: string | number) {
  if (typeof x === "string") {
// do something
  } else if (typeof x === "number") {
// do something else
 } else {
    x; // has type 'never'!
  }
}
```

## 其余参数
```ts
// Inferred type is number[] -- "an array with zero or more numbers",
// not specifically two numbers
const args = [8, 5];
const angle = Math.atan2(...args);
// A spread argument must either have a tuple type or be passed to a rest parameter.

// 解决办法
const args = [8, 5] as const; // 将args变成只读元组(tuple)
```

## 参数结构
```ts
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}

// 或者
// Same as prior example
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```

## 函数的可分配性
通过类型别名定义的返回void的函数，其应用时可以不返回void
```ts
type voidFunc = () => void;
 
const f1: voidFunc = () => {
  return true; // ok
};
```

直接定义的返回void的函数类型，不能再返回其他值
```ts
function f2(): void {
  return true; // error
}
 
const f3 = function (): void {
  return true; // error
};
```

