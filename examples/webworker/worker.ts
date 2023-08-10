importScripts('./sub-worker.js')
function add(a: number, b: number) {
  return a + b
}

self.addEventListener('message', (e) => {
  const {data} = e
  self.postMessage(add(data.a, data.b))
  self.postMessage(add2(data.a+1, data.b))
})
