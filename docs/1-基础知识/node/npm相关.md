# npm相关

## npm配置文件所在

在windows环境下

- 项目级 项目根目录.npmrc
- 用户级  %userprofile%\.npmrc  一般是 c:\Users\userName\.npmrc
- 全局  %programfiles%\etc\.npmrc 一般是 c:\program files\nodejs\etc\.npmrc  这个文件默认没有，如果设置过--global，会自动生成这个文件

npm config list可以查看到配置文件路径

```shell
# 这个设置的是用户级
npm config set registry=xxx 

# 这个设置的全局.npmrc文件
npm config set registry=xxx --global
```

pnpm也和npm一样会读取一样的.npmrc配置文件

## npm全局安装的包的位置

npm安装在nodejs目录下，但是全局安装的其他包会被安装到  %appdata%\npm\node_modules里面，一般是C:\Users\你的用户名\AppData\Roaming\npm