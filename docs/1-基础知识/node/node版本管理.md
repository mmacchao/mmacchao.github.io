# node版本管理

- nvm 只能全局切换node版本
- volta 可以指定项目使用的node版本，原理就是执行node实际是先执行volta的命令，volta再去执行node
- pnpm 可以全局切换node，但是存在切旧版本node切不回来的问题

一般使用nvm即可，如果有频繁切换node版本的情况，可以使用volta

## nvm-windows

到https://github.com/coreybutler/nvm-windows这个地址下载最新版nvm-windows，此软件c#开发

nvm安装目录在 C:\Users\<你的用户名>\AppData\Roaming\nvm，同时‘nvm use node版本’后会通过symlink把node链接到%programfiles%\nodejs

nvm会把不同的nodejs下载到自己的目录，nvm use后把指定nodejs目录软连接到%programfiles%\nodejs

nvm可能会下载失败，可以配置为淘宝源，避免下载失败，修改nvm安装目录下的setting.txt
```
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

```shell
nvm install 18
nvm list
nvm use
```

## pnpm
```shell
pnpm env use --global
```

pnpm存在切换到旧版本node后，切不回来，旧版本node执行不了pnpm

## Volta

可以同时固定node版本和npm或者pnpm等的版本