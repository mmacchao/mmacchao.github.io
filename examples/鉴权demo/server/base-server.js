// 基本鉴权

const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())

// GitHub OAuth 配置
const clientId = ''
const clientSecret = ''

// 处理GitHub OAuth回调
app.get('/callback', async (req, res) => {
  const code = req.query.code

  try {
    // 使用code换取access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    )

    res.json(tokenResponse.data)
  } catch (error) {
    console.error('Error exchanging code for token:', error)
    res.status(500).json({ error: 'Failed to exchange code for token' })
  }
})

// 启动服务器
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
