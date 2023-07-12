# 依据代码自动缩小类型范围
为避免类型问题导致的运行时错误，我们常会在js中写很多类型判断，而ts同样能识别这些类型判断进而给出合适的提示

作用：通过多种方式来使得联合类型可以正常使用而不会报错，

## 在if判断中进行的范围缩小
- typeof // "string" "number"  "boolean" "bigint" "symbol" "undefined" "object" "function"
- 非运算符! , 0, 0n,  '', null, undefined, NaN，视为0
- in运算符
    ```ts
    type Fish = { swim: () => void };
    type Bird = { fly: () => void };
    
    function move(animal: Fish | Bird) {
    if ("swim" in animal) {
    return animal.swim();
    }
    
    return animal.fly();
    }
    ```
- instanceof

## return语句
```ts
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input; // 如果到达这个return，后面的语句自动推断出不可访问
  }
  return padding + input; 
}
```

## 类型谓词 type predicates
定义一个返回类型为类型谓词的函数，当使用某个变量调用后，ts会缩小该变量的类型到指定类型
```ts
// 定义一个返回类型谓词的函数
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

// 使用这个特殊函数后，ts自动将pet推断为Fish
if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

## 复杂类型自动推断
```ts
interface Circle {
  kind: "circle";
  radius: number;
}
 
interface Square {
  kind: "square";
  sideLength: number;
}
 
type Shape = Circle | Square;
function getArea(shape: Shape) {
  if (shape.kind === "circle") { // 通过这个if判断可以将shape自动缩小为Circle
    return Math.PI * shape.radius ** 2;
  }
}
```

## 详尽性检查
避免出现未考虑到的情况，用一个never类型来进行详尽检查
```ts
interface Triangle {
  kind: "triangle";
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
     //报错： Type 'Triangle' is not assignable to type 'never'.
      return _exhaustiveCheck;
  }
}
```


