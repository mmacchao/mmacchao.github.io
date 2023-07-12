## 基础
1. ts的目的是为了找到程序中更多合法的 bug，比如访问对象上不存在的属性
2. 在类型系统能够正确地进行类型推断的时候，最好不要手动添加类型注解了，比如定义一个string变量：let msg = 'hello', ts可以自动推导出msg的类型
3. 默认情况下ts会把代码转成es3, 可以通过 --target es2015，转换成较新的代码
4. strict: true,可以一次性开启全部严格性设置，有两个选项需特别尽量打开
 
   参考：[Typescript 严格模式有多严格？](https://juejin.cn/post/6844903985007050765)
   - strictNullChecks，默认null,undefined可以赋值给任意类型，启用这个配置后就不允许了
   - noImplicitAny 在遇到被隐式推断为 any 类型的变量时就会抛出一个错误

## 常见类型
- string、number、boolean、bigint、symbol // 基本类型
- number[], Array\<number\> // 数组
- any
- (a: string, b: number) => number // 函数
- {a: string, b?: string} // 对象，b可选，那么b类似于 b: string | undefined
- string | number // 联合类型

## 类型别名
- type Pinter = \{ x: number, y: number \} 或者 type ID = string | number

## 接口
接口声明是命名对象类型的另一种方式
- interface Point \{ x: number; y: number; \}

## 类型别名与接口的区别
他们很相似，类型别名不能重新开放类型以添加新的属性，而接口始终是可扩展的

```ts
interface Window {
  title: string
}

interface Window {
  ts: TypeScriptAPI
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
```

```ts
type Window = {
  title: string
}

type Window = {
  ts: TypeScriptAPI
}
// Error: Duplicate identifier 'Window'.
```

## 类型断言
- as语法 obj.a as string
- 尖括号语法 \<string\>obj.a
- "hello" as number // 报错，明显不能转
- expr as any as T // 应对上面的情况，用2个as加any强制转

## 文字类型
- "left" // let a: left = 'left'; a只能被赋值left, 类似于const定义变量的效果
- 'left' | 'right' | 'center' // 用于联合类型比较好用
- -1 | 0 | 1
- 文字类型推理
```ts
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
// Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.

// 为解决上面的报错
// Change 1:
const req = { url: "https://example.com", method: "GET" as "GET" }; // 把req.method变成const类型
// Change 2
handleRequest(req.url, req.method as "GET");

// change 3
const req = { url: "https://example.com", method: "GET" } as const; // 所有内部属性都不能再修改了
```

## 非空断言
变量后面跟上!, 忽略null, undefined报错提示，仅在strictNullChecks启用时生效

作用就是可以去除ts的报错，因为有时候你明确知道代码不会为null，但是ts就是推断不出来
```ts
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
liveDangerously(123) // 这里你明确传了数字，但上面如果x不加!还是会报错
```

## 枚举
- enum \{A, B\}
- enum const \{A, B\}
  枚举不像其他类型一样会在编译后移除，而是会添加到运行时的东西
