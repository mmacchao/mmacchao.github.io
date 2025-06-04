/*
 * @Author: mazhichao mazhichao@jxcc.com
 * @Date: 2025-05-30 10:25:51
 * @LastEditors: mazhichao mazhichao@jxcc.com
 * @LastEditTime: 2025-05-30 11:02:11
 * @FilePath: \cas\cas-server\server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: mazhichao mazhichao@jxcc.com
 * @Date: 2025-05-30 10:25:51
 * @LastEditors: mazhichao mazhichao@jxcc.com
 * @LastEditTime: 2025-05-30 10:34:08
 * @FilePath: \cas\cas-server\server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const app = express()

app.use(express.json())
app.use(
  cors({
    origin: ['http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.static(__dirname))

// 模拟用户数据库
const users = [{ username: 'admin', password: '123456' }]

// JWT密钥
const JWT_SECRET = 'your-jwt-secret'

// 存储已生成的票据和TGT
const tickets = new Map()
const tgts = new Map()

// 登录页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// 登录接口
app.post('/login', (req, res) => {
  const { username, password, service } = req.body
  const user = users.find((u) => u.username === username && u.password === password)

  if (user) {
    // 生成TGT和TGC
    const tgt = Math.random().toString(36).substring(2)
    const tgc = Math.random().toString(36).substring(2)
    tgts.set(tgc, { tgt, username })

    // 设置TGT过期时间（24小时）
    setTimeout(() => tgts.delete(tgc), 24 * 60 * 60 * 1000)

    // 生成ST票据
    const ticket = Math.random().toString(36).substring(2)
    tickets.set(ticket, { username, service })

    // 设置票据过期时间（5分钟）
    setTimeout(() => tickets.delete(ticket), 5 * 60 * 1000)

    // 设置TGC cookie
    res.cookie('TGC', tgc, {
      maxAge: 24 * 60 * 60 * 1000, // 24小时
      // httpOnly: true,
      sameSite: 'lax',
    })

    res.json({ ticket })
  } else {
    res.status(401).json({ message: '用户名或密码错误' })
  }
})

app.get('/logout', (req, res) => {
  // res.clearCookie('TGC', {
  //   // maxAge: 24 * 60 * 60 * 1000,  // 24小时
  //   httpOnly: true,
  //   sameSite: 'lax'
  // })
  const tgc = req.cookies.TGC
  if (tgc) {
    return tgts.remove(tgc)
  }
  res.json({ message: '已退出' })
})

// 验证票据接口
app.post('/validate', (req, res) => {
  const { ticket, service } = req.body
  const ticketData = tickets.get(ticket)

  if (ticketData && ticketData.service === service) {
    // 返回用户信息
    const { username } = ticketData

    // 使用后立即删除票据
    tickets.delete(ticket)

    res.json({ username })
  } else {
    res.status(401).json({ message: '无效的票据' })
  }
})

// 获取ST票据接口
app.post('/ticket', (req, res) => {
  const { service } = req.body
  const tgc = req.cookies.TGC

  if (!tgc) {
    return res.status(401).json({ message: '未登录' })
  }

  const tgtData = tgts.get(tgc)
  if (!tgtData) {
    return res.status(401).json({ message: '无效的TGC' })
  }

  // 生成新的ST票据
  const ticket = Math.random().toString(36).substring(2)
  tickets.set(ticket, { username: tgtData.username, service })

  // 设置票据过期时间（5分钟）
  setTimeout(() => tickets.delete(ticket), 5 * 60 * 1000)

  res.json({ ticket })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`CAS服务器运行在 http://localhost:${PORT}`)
})
