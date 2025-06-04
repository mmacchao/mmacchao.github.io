# GitHub OAuth2 登录示例

这是一个使用GitHub OAuth2实现第三方登录的示例项目，包含前端页面和Node.js后端服务。

## 项目设置

1. 首先在GitHub上创建一个新的OAuth应用：
   - 访问 GitHub Settings -> Developer settings -> OAuth Apps -> New OAuth App
   - 填写应用信息：
     - Application name: 你的应用名称
     - Homepage URL: `http://localhost:3000`
     - Authorization callback URL: `http://localhost:3000/callback`

2. 获取到Client ID和Client Secret后，更新配置：
   - 在`index.html`中替换`YOUR_CLIENT_ID`为你的Client ID
   - 在`server.js`中替换`YOUR_CLIENT_ID`和`YOUR_CLIENT_SECRET`为对应值

## 安装依赖

```bash
npm install
```

## 运行项目

1. 启动后端服务：
```bash
npm start
```

2. 使用浏览器打开`index.html`

## 功能说明

- 点击"Login with GitHub"按钮开始OAuth2授权流程
- 授权成功后显示用户头像、用户名和邮箱（如果可见）
- 支持登出功能

## 技术栈

- 前端：原生JavaScript + HTML + CSS
- 后端：Node.js + Express
- 第三方服务：GitHub OAuth2 API

## 注意事项

- 这是一个示例项目，实际生产环境中需要添加更多的安全措施
- 确保不要将Client Secret提交到代码仓库中
- 生产环境中应该使用HTTPS来保护数据传输