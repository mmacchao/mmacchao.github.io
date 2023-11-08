/*
 * @Author: mazca z867982005@163.com
 * @Date: 2023-11-07 13:46:55
 * @LastEditors: mazca z867982005@163.com
 * @LastEditTime: 2023-11-07 14:33:27
 * @FilePath: \mmacchao.github.io\examples\qiankun\single-spa\app1\app1.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const render = () => {
  document.querySelector('#sub-container').innerHTML = '你好, 我是jquery子应用' + Math.random()
  return Promise.resolve()
}

;((global) => {
  global['app1'] = {
    bootstrap: () => {
      console.log('purehtml bootstrap')
      return Promise.resolve()
    },
    mount: () => {
      console.log('purehtml mount')
      return render()
    },
    unmount: () => {
      console.log('purehtml unmount')
      return Promise.resolve()
    },
  }
})(window)
