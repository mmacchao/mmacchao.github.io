import { call } from '@mymono/base-webpack'
// const {call} = require('@mymono/base-webpack')
call()

import { createApp, version } from 'vue'
console.log('vue3版本：', version)

const app = createApp({
  /* 根组件选项 */
})
