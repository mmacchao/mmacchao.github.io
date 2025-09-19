// server.js
import express from 'express'
import fs from 'fs'
import path from 'path'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import { models, sequelize } from './db.mjs'
import { sendWxMessage } from './wx-msg.mjs'

async function insertMessage(data) {
  try {
    // 插入一条记录
    const msg = await models.user_message.create({
      messageId: data.id,
      message: data.text || data.description,
      origin_json: data,
      create_at: data.created_at,
      create_time: Date.now(),
      user_id: data.user_id,
      user_name: data.user?.screen_name || '',
    })

    console.log('插入成功:')
  } catch (err) {
    console.error('插入失败:', err)
  } finally {
    // await sequelize.close();
  }
}

const PORT = process.env.PORT || 3000
const API_KEY = process.env.API_KEY || 'change_this_to_a_secret_key' // 建议改为环境变量

const app = express()

// 安全与跨域
app.use(helmet())
// 如果你要从 xueqiu.com 的控制台直接发起请求，允许该源（示例）
app.use(
  cors({
    origin: function (origin, cb) {
      // allow requests from any origin during testing:
      cb(null, true)
      // 生产请改为： cb(null, ['https://xueqiu.com'])
    },
  }),
)

app.use(bodyParser.json({ limit: '1mb' }))

// 接收推送的 endpoint
app.post('/hook', async (req, res) => {
  const key = req.header('x-api-key') || ''
  if (key !== API_KEY) {
    return res.status(401).json({ ok: false, message: 'invalid api key' })
  }

  try {
    const list = req.body.list
    let newItem
    for (const item of list) {
      const existing = await models.user_message.findOne({ where: { messageId: item.id } })
      if (!existing) {
        insertMessage(item)
        newItem = item
      }
    }
    if (newItem) {
      sendWxMessage(newItem.text || newItem.description)
    }
    res.json({ ok: true })
    return
  } catch (err) {
    console.error('[数据库] 写入失败', err)
    res.status(500).json({ ok: false, message: '数据库错误' })
  } finally {
    // await sequelize.close();
  }

  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`)
  console.log(`POST /hook 需要在 header 带 x-api-key: ${API_KEY}`)
})
