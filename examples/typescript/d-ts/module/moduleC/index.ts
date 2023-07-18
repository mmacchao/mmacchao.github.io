function c() {
  console.log(789)
}
// typescript的特殊的默认导出语法，导入时需要 import c = require('...')
// 这是兼容commonjs和amd的语法，只能运行在node环境，但是配合webpack，webpack会自动转换模块导入导出语句以支持浏览器
export = c
