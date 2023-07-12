# 类型操作
ts允许通过运算符来生成其他类型
- 泛型 有点类似js中的变量
- keyof
- Typeof
- 索引访问类型
- 条件类型
- 映射类型
- 模板文字类型

## 通用接口
```ts
interface GenericIdentityFn {
  // Type仅对函数可用
  <Type>(arg: Type): Type;
}

// Type对内部所有元素都可用
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}
 
function identity<Type>(arg: Type): Type {
  return arg;
}
 
let myIdentity: GenericIdentityFn = identity;
```

## 通用类
和通用接口很相似
```ts
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}
 
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```
**泛型类仅在其实例端而不是其静态端是通用的，因此在使用类时，静态成员不能使用类的类型参数**

## 通用约束
通过继承实现一些泛型约束
```ts
interface Lengthwise {
  length: number;
}
 
function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}
```
使用keyof
```ts
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}
 
let x = { a: 1, b: 2, c: 3, d: 4 };
 
getProperty(x, "a");
getProperty(x, "m");
// Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

## 在泛型中使用类类型
```ts
function create<Type>(c: { new (): Type }): Type {
  return new c();
}
```

## keyof运算符
```ts
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
// type A = number
 
type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
// type M = string | number
```

## typeof
```ts
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
    
// type P = {
//     x: number;
//     y: number;
// }
```
typeof后面只能跟变量名或者属性，而不能是语句
```ts
// Meant to use = ReturnType<typeof msgbox>
let shouldContinue: typeof msgbox("Are you sure you want to continue?");
// error: ',' expected.
```

## 索引类型
```ts
type Person = { age: number; name: string; alive: boolean };
type I1 = Person["age" | "name"];
     
type I1 = string | number
 
type I2 = Person[keyof Person];
     
type I2 = string | number | boolean
 
type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];
     
type I3 = string | boolean
```
使用number获取数组元素的类型
```ts
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];
 
type Person = typeof MyArray[number];
       
type Person = {
    name: string;
    age: number;
}
type Age = typeof MyArray[number]["age"];
     
type Age = number
// Or
type Age2 = Person["age"];
      
type Age2 = number
```
```ts
const key = "age";
type Age = Person[key];
// Type 'key' cannot be used as an index type.
// 'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?
```

## 条件类型
通过extends关键字进行类似js中的三元运算
```ts
type Flatten<T> = T extends any[] ? T[number] : T;
 
// Extracts out the element type.
type Str = Flatten<string[]>;
     
// type Str = string
 
// Leaves the type alone.
type Num = Flatten<number>;
     
// type Num = number
```
### infer关键字
在条件判断中引入新的泛型变量
```ts
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;
```
当从具有多个调用签名的类型（例如重载函数的类型）进行推断时，将从最后一个签名进行推断
```ts
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;
 
type T1 = ReturnType<typeof stringOrNum>;
     
// type T1 = string | number
```
### 条件类型的分配性
```ts
type ToArray<Type> = Type extends any ? Type[] : never;
 
type StrArrOrNumArr = ToArray<string | number>;
           
// type StrArrOrNumArr = string[] | number[]
```
为避免extends的这种情况，可以用中括号把extends两侧的Type包裹
```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
 
// 'StrArrOrNumArr' is no longer a union.
type StrArrOrNumArr = ToArrayNonDist<string | number>;
```

## 映射类型
通常会使用keyof来创建映射类型
```ts
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
type Features = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<Features>;

// type FeatureOptions = {
//   darkMode: boolean;
//   newUserProfile: boolean;
// }
```
通过修饰符readonly和?和减号(-)来影响属性的可变性和可选性
```ts
// Removes 'readonly' attributes from a type's properties
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};
 
type LockedAccount = {
  readonly id: string;
  readonly name: string;
};
 
type UnlockedAccount = CreateMutable<LockedAccount>;
           
// type UnlockedAccount = {
//     id: string;
//     name: string;
// }

// Removes 'optional' attributes from a type's properties
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = Concrete<MaybeUser>;

// type User = {
//   id: string;
//   name: string;
//   age: number;
// }
```
属性通过as改名或者移除
```ts
// 属性名改大写
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};
 
interface Person {
    name: string;
    age: number;
    location: string;
}
 
type LazyPerson = Getters<Person>;
         
// type LazyPerson = {
//     getName: () => string;
//     getAge: () => number;
//     getLocation: () => string;
// }

// Remove the 'kind' property
type RemoveKindField<Type> = {
  [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};

interface Circle {
  kind: "circle";
  radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;

type KindlessCircle = {
  radius: number;
}
```

## 模板文字类型
```ts
// 基础用法
type World = "world";

type Greeting = `hello ${World}`;

// 进阶用法
type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};
 
/// Create a "watched object" with an `on` method
/// so that you can watch for changes to properties.
declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});

person.on("firstNameChanged", () => {});

// Prevent easy human error (using the key instead of the event name)
person.on("firstName", () => {});
// Argument of type '"firstName"' is not assignable to parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.
```

## 内置的一些字符串类型操作函数
- UpperCase
- LowerCase
- Capitalize // 首字母大写
