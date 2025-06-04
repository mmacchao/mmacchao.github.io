<!--
 * @Author: mazhichao mazhichao@jxcc.com
 * @Date: 2025-05-30 10:26:53
 * @LastEditors: mazhichao mazhichao@jxcc.com
 * @LastEditTime: 2025-05-30 10:57:45
 * @FilePath: \cas\README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# CAS单点登录演示系统

这是一个使用CAS（Central Authentication Service）实现的单点登录演示系统，包含一个CAS服务器和两个业务系统。系统使用JWT进行本地会话管理。

## 项目结构

```
├── cas-server/     # CAS认证服务器
│   └── server.js   # 服务器实现
├── app-a/          # 业务系统A
│   └── server.js   # 系统A实现
├── app-b/          # 业务系统B
│   └── server.js   # 系统B实现
└── package.json    # 项目依赖配置
```

## 功能特点

- CAS集中认证服务
- JWT本地会话管理
- 跨系统单点登录
- 票据（Ticket）一次性使用
- 会话状态本地化

## 运行方式

1. 安装依赖：
```bash
npm install
```

2. 启动服务：

启动CAS服务器（端口3000）：
```bash
npm run start:cas
```

启动应用A（端口3001）：
```bash
npm run start:app-a
```

启动应用B（端口3002）：
```bash
npm run start:app-b
```

3. 访问应用：
- CAS服务器：http://localhost:3000
- 应用A：http://localhost:3001
- 应用B：http://localhost:3002

## 测试账号

- 用户名：admin
- 密码：123456

## 工作流程

1. 用户访问应用A或应用B
2. 如果未登录，重定向到CAS服务器
3. 在CAS服务器完成认证
4. CAS服务器生成票据并重定向回应用
5. 应用验证票据并创建本地JWT会话
6. 用户可以在应用A和B之间自由切换，无需重新登录

## 注意事项

- 本演示系统仅用于学习目的，不建议在生产环境中直接使用
- JWT密钥在实际应用中应该使用环境变量配置
- 用户数据在实际应用中应该使用数据库存储