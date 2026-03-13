# c++

## 环境

需要安装c++编译器，可以参考菜鸟教程

## 模块

c++20之前一直都是 #include，这类似直接复制粘贴，有可能会导致函数命名重复
c++20之后类似现在的导入导出

### 编写一个util模块

需要两个文件：
- util.h 定义文件类型typescript .d.ts
- util.cpp 源文件

util.h模块编写时需要加上include guard
```c++
#ifndef UTIL_H  // 这定义了一个标签，避免文件引入时被重复复制粘贴
#define UTIL_H

// 这里写你的代码声明...
void add();
boolean sum();
#endif
```

util.cpp
```c++
#include "util.h"

void add() {};
boolean sum() {};
```