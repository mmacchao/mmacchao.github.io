interface Person {
  name: string
  age: number
  say?: () => void
}
type Arr = [1, 2, 3]

// 过滤属性
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
let bar = {a: 1, b: 2, c: 3}
let foo: MyPick<typeof bar, 'a' | 'c'> = {a: 4, c: 9}

// 只读
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P]
}

type readOnlyPerson = MyReadonly<Person>

// 元组转对象
type TupleToObj<T extends readonly (keyof any)[]> = {
  [P in T[number]]: P
}
const tuple = ['a', 'b', 'c'] as const
type tuple2Obj = TupleToObj<typeof tuple>

// 第一个元素
type First<T extends any[]> = T extends [infer F, ...infer R] ? F : never
// type First<T extends any[]> = T[0]

type first = First<Arr>

// 获取元组长度
type GetLen<T extends readonly any[]> = T['length']

// 扩展Readonly表现
type A = {a: string}
type RA = Readonly<A>
type IsExtend<T, K> = T extends K ? true : false
type a = IsExtend<A, RA> // true

// 实现Exclude
type Ex1 = {a: string} | {b: number} | number
type Ex2 = Exclude<Ex1, {a: string}>
type MyExclude<T, U> = T extends U ? never : T
type Ex3 = MyExclude<Ex1, { a: string }>

// Awaited<Promise<Type>> // 获取Type
type AwaitedType<T extends Promise<any>> = T extends Promise<infer U> ? U : never
type AT = AwaitedType<Promise<string>>
type AT2 = Awaited<Promise<number>>

// if
type If<C extends boolean, T, F> = C extends true ? T : F

// Concat
type Concat<A extends any[], B extends any[]> = [...A, ...B]

// Include
type Includes<A extends any[], B> = {
  [K in A[number]]: true
}[B] extends true ? true : false
type i1 = Includes<[1, 2, 3], '3'>

type IEqual<T,U> = (<X>()=>X extends T ? 1:2) extends (<X>()=>X extends U ? 1 : 2) ? true :false
type ie<T> = (<X>()=>X) extends T ? 1 : 2
type ie2 = ie<() => void>

type Includes2<T extends readonly any[], U> = T extends [infer V, ...infer R]
  ? IEqual<V, U> extends true
    ? true
    : Includes2<R, U>
  : false;
// 有错误
type ie3 = Includes2<['1','2','3'], '4'>

/**
 * 中等难度
 */
// 获取函数返回类型
type MyReturnType<T> = T extends (...arg: any[]) => infer F ? F : never
type rt = MyReturnType<() => string>

// 删除指定属性
// 1
type MyPick2<O, T extends keyof O> = {
  [K in T]: O[K]
}
type MyOmit<O, K> = MyPick2<O, MyExclude<keyof O, K>>

// 2
type MyOmit2<O, K> = {
  [P in keyof O as P extends MyExclude<keyof O, K> ? P : never]: O[P]
}
type mo2 = MyOmit2<{ a: string, b: number }, 'a'>

// 使属性只读
// 使用include过滤出K
type MyReadonly2<T, K> = {
  // 过滤出只读属性
  readonly [P in keyof T as P extends K ? P : never]: T[P]
} & {
  [P in keyof T as P extends K ? never : P]: T[P]
}
type MyReadonly3<T, K> = T & {
  // 过滤只读属性
  readonly [P in keyof T as P extends K ? P : never]: T[P]
}

type mr = MyReadonly2<{ a: string, b: number }, 'a'>
type mr3 = MyReadonly3<{ a: string, b: number }, 'a'>

// 深度遍历
type IsObj<T> = keyof T extends never ? false : true
type DeepReadonly<T> = {
  readonly [P in keyof T]: IsObj<T[P]> extends true ? DeepReadonly<T[P]> : T[P]
}
type dr = {a: string, b: {a: number}}
type dr1 = DeepReadonly<dr>

// 元组转unionType
type Tuple2Union<T extends any[]> = T[number]
type tu = Tuple2Union<[1,2]>

// 链式调用
type Chainable<O = {}> = {
  option<K extends string, V>
  (
    key: K extends keyof O ? never : K,
    value: V): Chainable<O & {[key in K]: V}>
  get(): O
}
// 定义类型，不需要实现
declare const ca: Chainable
ca.option('foo', 123).option('abc', 124)

// 返回数组最后一个元素
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never
type la = Last<[1, 2]>

// 弹出最后一个元素，并返回
type Pop<T extends any[]> = T extends [...infer R, infer L] ? R : never
type pop = Pop<[1, 2, 3]>
let popA: pop = [1,2]

// 实现Promise.all
declare function PromiseAll<T extends readonly unknown[]>(args: readonly [...T]):
  Promise<{[P in keyof T]: T[P] extends Promise<infer R> ? R : T[P]}>
const p1 = Promise.resolve(3)
const p2 = 2
const p3 = new Promise<string>((resolve) => {
  setTimeout(resolve, 100, 'foo')
})
const pa = PromiseAll([p1, p2, p3])
type p1T = keyof typeof p1

// 根据指定的属性和值找到类型
type LookUp<UnionType, V> = UnionType extends {type: V} ? UnionType : never
type lu1 = {
  type: 'cat',
  name: string,
}
type lu2 = {
  type: 'dog'
}
type lu3 = LookUp<lu1 | lu2, 'cat'>

// trim left
type TWhiteSpace = ' ' | '\n' | '\t'
type TrimLeft<S extends string> = S extends `${TWhiteSpace}${infer R}` ? TrimLeft<R> : S
type tl = TrimLeft<'  hello world '>

// trim right
type TrimRight<S extends string> = S extends `${infer R}${TWhiteSpace}` ? TrimRight<R> : S
type tr = TrimRight<'  hello world   '>

// trim
type Trim<S extends string> = TrimLeft<TrimRight<S>>
type tm = Trim<'  hello world  '>

// 首字母大写
type MyCapitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : never
type mc = MyCapitalize<'abcd'>

// Replace
type Replace<S extends string, From extends string, To extends string> =
  From extends '' ? S : S extends `${infer F}${From}${infer L}` ? `${F}${To}${L}` : S
type rp = Replace<'i am a man', 'man', 'woman'>

// replaceAll
type ReplaceAll<S extends string, From extends string, To extends string> =
  From extends '' ? S : S extends `${infer F}${From}${infer L}` ? `${ReplaceAll<F, From, To>}${To}${ReplaceAll<L, From, To>}}` : S
type rpa = ReplaceAll<'i am a boy boy haha', 'boy', 'girl'>

// 追加参数
type AppendParam<Fn extends (...args: any[]) => any, A> = Fn extends (...args: infer T) => infer R ? (...args: [...T, A]) => R : never
type fn1 = (a: string) => number
type fn2 = AppendParam<fn1, 'number'>

// 将联合类型转换为排列数组
type Permutation<UnionType, C = UnionType> = [UnionType] extends [never] ? [] : UnionType extends any ? [UnionType, ...Permutation<Exclude<C, UnionType>>] : never
type pm = Permutation<'a' | 'b' | 'c'>
const pm1: pm = ['a', 'b', 'c']

// 字符串长度，转换为数组然后直接得length
type LenOfString<S extends string, T extends any[] = []> = S extends `${infer F}${infer R}` ? LenOfString<R, [F, ...T]> : T['length']
type ls = LenOfString<'abc'>
const ls1: ls = 3

// 数组展平，extends + infer + 递归
type Flatten<T extends any[]> = T extends [infer F, ...infer R] ? [...(F extends any[] ? Flatten<F> : [F]), ...Flatten<R>] : T
type fl = Flatten<[1, [2, [3, 4]]]>
const f11: fl = [1, 2, 3, 4]

// 向对象中添加新字段
// merge让最终结果更优美
type Merge<T> = {
  [P in keyof T] : T[P]
}
type AppendKey<O, K extends string, V> = Merge<{
  [P in keyof O]: O[P]
} & {
  [P in K]: V
}>
type ak = AppendKey<{ a: string }, 'b', number>

// 是否时联合类型
type IsUnion<T,U = T> = T extends U ? (U extends T ? false : true) : false
type iu = IsUnion<string|number> // true
const iu1: iu = false
// 原理解析（联合类型的extends，只有有一次为假就是假）
// 1. string extends string|number -> 第一个extends判断为真
// 2. number extends string|number -> 第一个extends判断为真 -> 两次都为真说明第一个extends为真，进入第二个extends
// 3. string extends string|number -> string extends string -> 第二个extends为真
// 4. string extends string|number -> number extends string -> 第二个extends为假 -> 有一次为假，第二个extends的最终结果为假，结束，返回true

declare let x: <T>() => T extends number ? 1 : 2
declare let y: <T>() => T extends number ? 1 : 2
declare let z: <T>() => T extends string ? 1 : 2

var str: string = '1'
str = 2 // 报错

x = 100 // 报错
x = y
x = z // 报错
y = z // 报错



