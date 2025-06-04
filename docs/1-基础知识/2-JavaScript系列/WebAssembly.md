# WebAssembly简介

参考：[万字长文,看这一篇就够了！WebAssembly原理剖析与生产应用](https://zhuanlan.zhihu.com/p/620767652)

[MDN - WebAssembly](https://developer.mozilla.org/zh-CN/docs/WebAssembly)
[MDN - WebAssembly 概念](https://developer.mozilla.org/zh-CN/docs/WebAssembly/Guides/Concepts)

WebAssembly 有一套完整的语义，但作为开发者并不需要去了解它，开发者依然可以继续使用自己熟悉的编程语言，由各个语言的编译器将其编译成Wasm格式后运行在浏览器内置的Wasm虚拟机中

上面参考文章提出Wasm更倾向于是一个应用在web场景中的编译领域新技术

WebAssembly解决的问题：
- CPU计算密集型任务
  - 快原因：
    1. asm.js比js快的原因：去掉大部分的自动GC机制，然后改成了强类型语言，编译器能够更大程度地进行优化
    2. wasm比asm.js快的原因：绕过JS 直接生成机器码；解析快，因为其直接被编译为二进制；更好的利用cpu特性；编译工具链优化
  - 但并没有比js快太多，大概就2倍，不通测试场景差异很大
- PC端应用移植到Web端，通过把c++，rust等语言编写的代码通过编译转为wasm，实现PC端应用移植到Web端。
- 依赖WASI实现在服务端的应用，WASI类似jvm，使WebAssembly摆脱了浏览器

## 编译 C/C++ 为 WebAssembly
[参考MDN](https://developer.mozilla.org/zh-CN/docs/WebAssembly/Guides/C_to_Wasm)

## 理解 WebAssembly 文本格式
WebAssembly虽然是二进制格式，但也提供了相应的文本表示