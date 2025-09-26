// 加密逻辑
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// import { config } from './config.mjs'

// 使用 AES-256-CBC 加密
export function encryptConfig(password, obj, outputFile) {
  const data = JSON.stringify(obj)
  const key = crypto.scryptSync(password, 'salt', 32) // 从口令派生 32字节密钥
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()])

  // 输出: iv + 加密内容（都转成 hex）
  const result = iv.toString('hex') + encrypted.toString('hex')
  outputFile = path.join(__dirname, outputFile)
  fs.writeFileSync(outputFile, result, 'utf8')

  console.log(`加密完成，已生成: ${outputFile}`)
}

export function startEncrypt() {
  // 使用方法: node encrypt.mjs mypassword
  const password = process.argv[2]
  if (!password) {
    console.error('请提供密码: node encrypt.mjs <password>')
    process.exit(1)
  }

  encryptConfig(password, config, 'config.enc')
}

// 解密函数
function decryptConfig(password, encryptedFile) {
  const encryptedHex = fs.readFileSync(encryptedFile, 'utf8')
  const iv = Buffer.from(encryptedHex.slice(0, 32), 'hex') // 前 16 字节是 iv
  const encrypted = Buffer.from(encryptedHex.slice(32), 'hex')

  const key = crypto.scryptSync(password, 'salt', 32)
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)

  let decrypted = decipher.update(encrypted)
  decrypted = Buffer.concat([decrypted, decipher.final()])

  return JSON.parse(decrypted.toString())
}

export function getConfig() {
  // 从命令行获取 -p 参数
  const args = process.argv
  const pIndex = args.indexOf('-p')
  if (pIndex === -1 || !args[pIndex + 1]) {
    console.error('请用 -p 指定密码，例如: node server.js -p xxx')
    process.exit(1)
  }
  const password = args[pIndex + 1]

  // 解密配置
  const config = decryptConfig(password, 'config.enc')
  console.log('解密成功，配置内容:', config)
  return config
}
