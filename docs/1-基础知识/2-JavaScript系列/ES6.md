# ES6的一些特性

## import.meta
参考：[import.meta](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import.meta)
- es2020引入的特性，规范没有要求包含任何属性，但是宿主环境一般会定义import.meta.url import.meta.resolve
- import是关键字，import.meta并不是访问属性而是特殊的表达式语法，import.meta在js模块之外不可用
- 可以任意修改
- vite中的import.meta.glob是非运行时，在编译阶段会被替换

### import.meta.url

在nodejs中运行，会得到file:///开头的文件url
在浏览器中运行，会得到以http开头的文件url

从命令行直接运行 node moduleA.mjs?someURLInfo=5会报错，因为其解析方式是把整个url作为文件名而不是作为url，会出现找不到的报错
命令行直接运行时可以通过后面接参数来获取node moduleA.mjs --a=1，通过process.argv获取

**获取查询参数**
```js
// index.mjs
// 直接在nodejs中运行index.mjs，会得到
import ModauleA from './moduleA.mjs?someURLInfo=5'

// moduleA.mjs
new URL(import.meta.url).searchParams.get("someURLInfo"); // 5
console.log(import.meta.url)
```

**根据相对路径解析文件**

之前commonjs有__dirname可以获取文件夹路径
```js
const fs = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "someFile.txt");
fs.readFile(filePath, "utf8").then(console.log);
```

之后es模块
```js
import fs from "node:fs/promises";

const fileURL = new URL("./someFile.txt", import.meta.url);
fs.readFile(fileURL, "utf8").then(console.log);
```

### import.meta.resolve

用于获取文件的绝对路径，它支持获取node_modules里面的文件

```js
// new URL('lodash', import.meta.url)获取不了，这会解析为 ./lodash
const filePath = await import.meta.resolve('lodash')
// 支持查询参数
const filePath2 = await import.meta.resolve('./temp.mjs?a=1')

```

**和require.resolve的区别**

- require.resolve是同步的，import.meta.resolve是异步的
- require.resolve不能在esm模块中运行
- require.resolve获取的文件路径，例如D:\temp\temp.js，而import.meta.resolve获取的是url，例如 file:///d:/temp/temp.js