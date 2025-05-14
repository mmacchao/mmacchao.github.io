import './assets/main.css'

import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import singleSpaVue from 'single-spa-vue'

// 支持应用独立运行、部署，不依赖于基座应用
if (!window.singleSpaNavigate) {
  const app = createApp(App)
  app.use(router)
  app.mount('#app')
} else {
}

// 基于基座应用，导出生命周期函数
const vueLifecycle = singleSpaVue({
  createApp,
  appOptions: {
    el: '#mircoApp',
    render: () => h(App),
  },
  handleInstance: (app) => {
    app.use(router)
  },
})

export function bootstrap(props) {
  console.log('app1 bootstrap')
  return vueLifecycle.bootstrap(() => {})
}

export function mount(props) {
  console.log('app1 mount')
  return vueLifecycle.mount(() => {})
}

export function unmount(props) {
  console.log('app1 unmount')
  return vueLifecycle.unmount(() => {})
}

window.app2 = {
  bootstrap,
  mount,
  unmount,
}
