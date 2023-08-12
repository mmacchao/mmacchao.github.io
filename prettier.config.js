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
