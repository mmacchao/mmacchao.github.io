import './node_modules/qiankun/dist/index.umd.js'
console.log(qiankun)
const { registerMicroApps, start } = qiankun

registerMicroApps([
  //   {
  //     name: 'react app', // app name registered
  //     entry: '//localhost:7100',
  //     container: '#yourContainer',
  //     activeRule: '/yourActiveRule',
  //   },
  //   {
  //     name: 'vue app',
  //     entry: { scripts: ['//localhost:7100/main.js'] },
  //     container: '#yourContainer2',
  //     activeRule: '/yourActiveRule2',
  //   },
  {
    name: 'jquery app',
    entry: 'http://127.0.0.1:5500/examples/qiankun/jquery/index.html',
    container: '#sub-container',
    // activeRule: location => location.search.includes('jquery')
    activeRule: '/jquery',
  },
])

start()
