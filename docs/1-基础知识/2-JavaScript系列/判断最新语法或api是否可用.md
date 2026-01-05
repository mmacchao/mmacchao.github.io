# 如何判断最新语法或api是否可用

## webpack项目

语法是由babel进行转换的，浏览器不存在的api是由core-js提供的，因此看最新的语法或者api是否可用需要判断
 
- babel是否会转换语法，core-js是否提供了api
- 浏览器是否原生支持语法或api

### 判断当前项目支持的浏览器版本

看babel.target配置，如果没有就看browserslist的配置

比如vue-cli的项目一般的browserslist配置为：
- \> 1%   caniuse里面被某个浏览器版本被标记为使用人数依然大于1%的
- last 2 versions   最新的2个稳定版本，不一定是2个，可能多个，一般这个版本比 > 1%的版本新多了，所以生效的会是>1%
- not dead 

查看具体的浏览器版本号
```shell
npx browserslist  # 这个会具体列出当前最低支持的浏览器版本号
```

### 判断api是否可用

现在有个ES2025的api, RegExp.escape，这个api会转码一些正则中用到的特殊字符

1. 先到caniuse里面，发现chrome到136版本才支持
2. 查看项目的支持的chrome版本：npx browserslist  发现只支持到112
3. 查看项目中的core-js是否提供了这个api，目前的版本是3.8.3，这是个比较老的版本了，需要升级到最新版本才支持
4. 升级core-js，在chrome@112中就可以安全的使用RegExp.escape了，或者单独安装 polyfill 包（如 regexp.escape npm 包）,然后再main.js中引入

### 判断新语法是否可用

1. 看babel启用的插件中是否能转换，一般是@babel/preset-env，查看里面是否有插件能转换
2. 如果没有那就要升级@babel/preset-env或者手动在babel配置中添加对应插件了
3. 如果项目支持的浏览器版本较高，那么就不需要转换了

比如：@babel/preset-env也存在对应的插件@babel/plugin-proposal-logical-assignment-operators，因此可以使用

但是项目不会去转换这个语法，因为babel判断chrome@112已经支持，如果还有其他版本的浏览器不支持，那babel还是会

**实测是否会转换：**
```
# 需要项目中先安装@babel/cli和@babel/core保持一样的版本
pnpm babel test.js

# test.js文件测试内容
let a = 0
a ||= 1

# 如果没有转换，把babel的targets降级为ie11尝试或者直接更换怎个babel配置
presets: [
  ['@babel/preset-env', {
    targets: {
      ie: '11'
    }
  }]
]
```

### 有些变动babel也无能为力，只能等待浏览器支持，比如正则的变动，模块的变动等

ES2025新语法：Duplicate Named Capture Groups 允许在正则表达式的不同分支中重复使用相同的捕获组名称

这个正则语法的变动，babel转换不了，除非babel自己实现一个正则语法解析器

```js
// ❌ 之前的困境
// 方法1：使用不同的组名（语义不清）
const dateRegex = /(?<year1>[0-9]{4})-[0-9]{2}|[0-9]{2}-(?<year2>[0-9]{4})/;
const match = str.match(dateRegex);
const year = match.groups.year1 || match.groups.year2; // 需要手动合并

// ✅ ES2025：允许重复命名
const dateRegex = /(?<year>[0-9]{4})-[0-9]{2}|[0-9]{2}-(?<year>[0-9]{4})/;
const match = str.match(dateRegex);
const year = match.groups.year; // 直接访问，自动选择匹配的分支
```


