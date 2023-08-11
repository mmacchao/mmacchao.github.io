# prettier的使用
[prettier官网](https://www.prettier.cn/docs/index.html)

[prettier官网对于自己与eslint等的对比](https://www.prettier.cn/docs/comparison.html)

prettier是个格式化插件，与eslint存在部分功能重复，但在格式化方面更加强大，可以配合eslint-config-prettier或者stylelint-config-prettier来关闭eslint中prettier已有的功能或者冲突的功能

## 安装
[官网安装教程](https://www.prettier.cn/docs/install.html)
```shell
# --save-exact表示固定版本号，即不用 ^ ~ 等
pnpm add --save-dev --save-exact prettier
```
**创建配置文件 prettier.config.js**
```js
// 每个配置项的测试命令
// pnpm prettier temp.html --write

// 一些常用配置说明
module.exports = {
  printWidth: 100, // 一行超过100个字符就换行，默认是80
  semi: false, // 行尾是否加分号，默认true
  // vue单文件组件中，是否对script中的根内容进行缩进， 默认false，设置为false可以少占用一次tab空间
  vueIndentScriptAndStyle: false,
  singleQuote: true, // 使用单引号代替双引号, 默认false
  trailingComma: 'all', // 是否允许尾逗号，比如对象末尾的逗号，函数参数末尾，函数调用末尾，默认all
  proseWrap: 'never', // md文件超出printWidth后是否换行，never 强制一段文字都在一行， 默认值preserve，表示不做任何操作
  // html标签内的空格是否保留, 默认值css
  // css: 对于inline元素，和strict行为一样，对于block元素，删除所有空格, 如果超出了printWidth，不带标签换行
  // strict: 行内元素（span）内部如果有多个空格或者换行，保留一个空格，因为多个空格和一个是一样的效果
  //         block元素，内部有多个空格也是保留一个空格，换行也会转回不换行，只保留一个空格，如果一行内容超出了printWidth且没有空格，block元素会带着标签换行，保证不出现空格
  //         <div
  //          >内容</div
  //         > // 这就是带标签换行, 保证和原先一样没有空格，即空格敏感型
  // ignore：删除标签所有两侧所有空格
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'lf', // 换行符用哪个符号，默认lf, auto表示保留文件原先的换行符，如果一个文件有多种换行符，默认取第一行的换行符
}

```

**创建过滤文件.prettierignore**
```
/dist/*
.local
/node_modules/**

**/*.svg
**/*.sh

/public/*
```

**对项目进行一次全局格式化**
```shell
pnpm exec prettier --write .
```

## 编辑器集成
[官网编辑器集成说明](https://prettier.io/docs/en/editors)

[webstorm配置文件保存后自动应用prettier](https://prettier.io/docs/en/webstorm)

## 添加git hook，提交时自动格式化
```shell
# 安装husky，方面写git hook的工具， 安装lint-staged, lint-staged只会处理staged中的文件
pnpm add --save-dev husky lint-staged

# 初始化husky，主要就是创建了.husky文件夹，如果你遇到了问题，可以看后续的关于husky初始化的问题介绍，或者直接看官网
pnpm exec husky install

# 添加prepare命令，这样项目组其他人 pnmp i之后会自动执行pnpm prepare，就能实现husky的初始化
npm pkg set scripts.prepare="husky install"

# 添加git hooks, 在commit时候会先执行pnpm exec lint-staged，执行这个命令时需要有个配置文件，也可以把配置写在package.json里面，参照下面的package.json里面的配置
pnpm exec husky add .husky/pre-commit "pnpm exec lint-staged"

# 把生成的hook文件提交到git, 共享给其他成员
git add .husky/pre-commit
```

**在package.json里面添加lint-staged**
```json
{
  "lint-staged": {
    "**/*": "prettier --write --ignore-unknown"
  }
}
```
现在git commit时会先执行pnpm exec lint-staged, 如果格式化失败，本次提交也会失败

### husky初始化的问题
[husky初始化目录与.git目录不同时的解决方案](https://typicode.github.io/husky/guide.html#custom-directory)

当husky初始化目录与.git目录不同时，需要手动在package.json里面添加命令，指定目录
```json
{
  "scripts": {
    "prepare": "cd .. && husky install front/.husky"
  }
}
```
同时添加的hook也要先打开目录
```shell
pnpm exec husky add .husky/pre-commit "cd front && pnpm exec lint-staged" 
```


