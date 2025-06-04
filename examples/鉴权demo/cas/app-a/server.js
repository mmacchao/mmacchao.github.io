const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(express.static(__dirname))

// JWT密钥（实际应用中应该使用环境变量）
const JWT_SECRET = 'your-jwt-secret'

// 主页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// 验证票据
app.post('/validate-ticket', async (req, res) => {
  const { ticket } = req.body

  try {
    const response = await fetch('http://localhost:3000/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticket,
        service: 'http://localhost:3001',
      }),
    })

    if (response.ok) {
      const { username } = await response.json()
      // 生成JWT
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' })
      res.cookie('jwt', token, { maxAge: 3600000 }) // 1小时过期
      res.json({ success: true })
    } else {
      res.status(401).json({ message: '无效的票据' })
    }
  } catch (error) {
    res.status(500).json({ message: '服务器错误' })
  }
})

// 验证JWT token
app.get('/verify-token', (req, res) => {
  // const authHeader = req.headers.authorization;
  const token = req.cookies.jwt
  if (!token) {
    return res.status(401).json({ message: '未提供token' })
  }

  // const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET)
    res.json({ valid: true })
  } catch (error) {
    res.status(401).json({ message: '无效的token' })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`应用A运行在 http://localhost:${PORT}`)
})
