# 用vitepress快速搭建个人博客

## 本地安装vitepress
```
npm install -D vitepress
```

## 初始化项目
```
vitepress init
```
![file](https://vitepress.dev/assets/vitepress-init.dfe5638e.png)

## 启动服务
生成的package.json里面的scripts
```json
{
  ...
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  ...
}
```
启动服务
```
npm run docs:dev
```

