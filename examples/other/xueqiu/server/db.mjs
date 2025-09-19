import { Sequelize } from 'sequelize'
import initModels from './models/init-models.js' // sequelize-auto 生成的

// 生成vo
// pnpm sequelize-auto -h localhost -d xueqiu -u root -x 123456 -p 3306 -o "D:\\tmp\\models" -l js

// 连接数据库
const sequelize = new Sequelize('xueqiu', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '+08:00', // 设置时区为北京时间
  port: 3306,
  logging: false,
  // logging: console.log, // 生产环境可以关掉
  dialectOptions: {
    charset: 'utf8mb4',
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  pool: {
    afterConnect: (connection, done) => {
      // 强制每次连接使用 utf8mb4
      connection.query('SET NAMES utf8mb4;', (err) => done(err, connection))
    },
  },
})

// 初始化 models
const models = initModels(sequelize)

export { sequelize, models }
