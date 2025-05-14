export function call() {
  console.log('我是base-webpack')
}

console.log('我的base-webpack的内部闭包')
call()

import Vue from 'vue'

console.log('vue2版本：', Vue.version)
new Vue({
  data: {
    a: 1,
  },
  created() {
    console.log('created')
  },
})

export default { call }
