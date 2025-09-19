# 一个监听雪球用户发言，并推送到wxpusher和本地数据库的小应用

前置条件：
- 本地安装mysql，设置root/123456，新建xueqiu数据库，执行server/db/create.sql，创建表
- 注册wxpusher

## 运行客户端
先复制client.js，最前面拼接“javascript:”，然后保存为书签，浏览器打开任意雪球页面，点击书签，开始获取用户消息，并推送到本地服务器

## 运行本地服务器
```shell
node server -p xxx(解密参数的密钥)
```