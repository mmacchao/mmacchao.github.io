# js严格模式介绍
通过在文件或者函数内顶部添加"use strict"可以启用严格模式，严格模式主要是减少了一些旧js不合理之处

参考：[Javascript 严格模式详解](https://www.ruanyifeng.com/blog/2013/01/javascript_strict_mode.html)

## 严格模式的改变
- 未声明的变量不再自动赋值给全局变量，而是报错
- 静态绑定，旧js允许运行时确定属性和方法属于哪个对象，比如with语句内部，
  - 禁止使用with语句
  - eval现在有自己的作用域
- 增强的安全措施
  - 禁止顶级函数中的this指向全局对象，现在this会等于undefined
  - 禁止在函数内部遍历调用栈
  ```js
  function f1(){
    "use strict";
    f1.caller; // 报错
    f1.arguments; // 报错
  }
  f1();
  ```
- 禁止删除变量，可以删除configurable设置为true的对象属性
- 显示报错，对不可赋值属性赋值或者其他情况
- 重名错误
  - 对象属性不能重复
  - 函数参数名不能重复
- 禁止o开头的8进制语法
- arguments限制
  - arguments现在是关键字了，不允许作为变量名或者参数名或者赋值
  - arguments不再追踪参数变化
  - 禁止使用arguments.callee
- 函数必须声明在顶层
- 新增了很多保留字

## 其他说明
ESM模块会忽略"use strict", 内部自动启用严格模式, esm模块即内部用了es6的import export语法的文件

webpack打包工具会自动给esm模块顶部添加use strict
  
