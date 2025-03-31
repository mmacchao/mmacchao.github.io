# 对象类型
- 匿名对象类型  \{ a: string, b: string \}
- 接口 interface Person \{ a: string, b: string \}
- 类型别名 type Person = \{ a: string, b: string \}

[type和interface快速参考](https://www.typescriptlang.org/cheatsheets)

## 属性修饰符
- ? 可选修饰符  foo?: string
- readonly 只读修饰符 readonly foo: string，如果readonly修饰的是个对象，那对象内部属性还是可以改的

### 两个对象结构一样，那么有些情况会导致readonly依然可以修改
```ts
interface Person {
  name: string;
  age: number;
}
 
interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}
 
let writablePerson: Person = {
  name: "Person McPersonface",
  age: 42,
};
 
// works
let readonlyPerson: ReadonlyPerson = writablePerson;
 
console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43
```

## 索引签名
\[foo: number\]: string;

```ts
interface StringArray {
  [index: number]: string; // index可以是 string, number, symbol, 模板字符串 和他们的联合类型
}
 
const myArray: StringArray = getStringArray();
const secondItem = myArray[1];
```

两种类型的索引, 数字类型索引的类型必须是字符串索引类型的子类型
```ts
interface Animal {
  name: string;
}
 
interface Dog extends Animal {
  breed: string;
}
 
// Error: indexing with a numeric string might get you a completely separate type of Animal!
interface NotOkay {
  [x: number]: Animal;
// 'number' index type 'Animal' is not assignable to 'string' index type 'Dog'.
  [x: string]: Dog;
}
```

其他属性的类型需要和所有属性的类型兼容
```ts
interface NumberDictionary {
  [index: string]: number;
 
  length: number; // ok
  name: string; // name匹配了字符串索引index，但是返回值确没有匹配，会报错
// Property 'name' of type 'string' is not assignable to 'string' index type 'number'.
}

// 改成联合类型即可
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
}
```

只读索引
```ts
interface ReadonlyStringArray {
  readonly [index: number]: string;
}
 
let myArray: ReadonlyStringArray = getReadOnlyStringArray();
myArray[2] = "Mallory";
// Index signature in type 'ReadonlyStringArray' only permits reading.
```

## 额外属性检查
包含了不存在的属性会报错，解决办法是强制类型转换或者添加索引签名或者将对象分配给另一个变量
```ts
interface SquareConfig {
  color?: string;
  width?: number;
}

// 强制类型转换，opacity属性不存在
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig); 

// 设置索引签名
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any; // 设置索引签名
}

// 将变量分配给单独的变量来使用
let squareOptions = { colour: "red", width: 100 };
// 但是这种方式如果一个属性都没匹配上也会报错
let squareOptions = { colour: "red" };
let mySquare = createSquare(squareOptions);
// Type '{ colour: string; }' has no properties in common with type 'SquareConfig'.
```

## 扩展类型
通过接口扩展
```ts
interface Colorful {
  color: string;
}
 
interface Circle {
  radius: number;
}
 
interface ColorfulCircle extends Colorful, Circle {}
 
const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};
```
## 取并集
通过&运算符取并集
```ts
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}
 
// 得到了 {color: string, radius: number}
type ColorfulCircle = Colorful & Circle; 
```

## 通用对象类型
通过重载实现或者通过泛型实现
```ts
// 重载实现box类型的多样性
function setContents(box: StringBox, newContents: string): void;
function setContents(box: NumberBox, newContents: number): void;
function setContents(box: BooleanBox, newContents: boolean): void;
function setContents(box: { contents: any }, newContents: any) {
  box.contents = newContents;
}

// 泛型
function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}
```
## 一些通用类型
- Array\<Type\> // Array\<number\>
- ReadonlyArray\<Type\> 等效于 readonly Type[]，
- 元组 一种固定数量和类型的Array，只读元组：readonly 元组，等效于 元组 as const

Array就是一个泛型类型
```ts
interface Array<Type> {
  /**
   * Gets or sets the length of the array.
   */
  length: number;
 
  /**
   * Removes the last element from an array and returns it.
   */
  pop(): Type | undefined;
 
  /**
   * Appends new elements to an array, and returns the new length of the array.
   */
  push(...items: Type[]): number;
 
  // ...
}
```

与属性上的readonly修饰符不同，类型readonly修饰符不能根据结构类似重新赋值
```ts
let x: readonly string[] = [];
let y: string[] = [];
 
x = y;
y = x;
// The type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.
```

元组可以有可选属性和剩余属性
```ts
// 可选属性
type Either2dOr3d = [number, number, number?];

// 剩余属性
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```


