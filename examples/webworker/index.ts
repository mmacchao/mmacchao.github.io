// 主线程
const worker = new Worker('./worker.js')
worker.addEventListener('message', ({ data }) => {
  console.log(data)
})
worker.postMessage({ a: 1, b: 2 })
