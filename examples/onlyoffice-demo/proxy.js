// Node.js (Express) 示例
const express = require('express')
const httpProxy = require('http-proxy')
const app = express()

app.get('/proxy/:url*', (req, res) => {
  const targetUrl = req.params.url + req.params[0]
  httpProxy.createProxyServer().web(req, res, {
    target: targetUrl,
    changeOrigin: true,
    secure: false,
  })
})

app.listen(443)
