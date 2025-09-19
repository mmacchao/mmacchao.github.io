/*
 * @Description: 发送微信消息
 * @Version: 1.0
 * @Author: mazhichao mazhichao@jxcc.com
 * @Date: 2025-9-19 10:33:01
 */

import fetch from 'node-fetch'
import { getConfig, startEncrypt } from './encrypt.mjs'
// import { config } from './config.mjs';

const config = getConfig()
// startEncrypt()

/**
 * 发送微信消息
 * @param {string} content 消息内容
 * @param {string} title 消息标题，可选
 */
export async function sendWxMessage(content, title = '消息通知') {
  const url = 'https://wxpusher.zjiecode.com/api/send/message'

  const body = {
    appToken: config.wxPusher.token,
    content: content,
    // summary: title,
    contentType: 2, // 1=文本, 2=html, 3=markdown
    uids: [config.wxPusher.uid],
    url: '', // 点击消息跳转的链接，可选
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()

    if (data.code === 1000) {
      console.log('消息发送成功')
    } else {
      console.error('发送失败')
    }
  } catch (err) {
    console.error('发送异常:', err)
  }
}

// 测试发送
// sendWxMessage('这是一条测试消息', '测试标题');
