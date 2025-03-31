# 前端基建工作

- 代码格式
  - editConfig
  - pretter
  - eslint
  - git在windows平台检出自动把换行符转换为CRLF的问题

## 代码格式

### git导致的crlf问题
参考：[Git 多平台换行符问题(LF or CRLF)](http://kuanghy.github.io/2017/03/19/git-lf-or-crlf)

在windows系统上，git有个默认配置core.autocrlf=true，表示push时转换为 LF，pull时转换为 CRLF，于是产生了如下问题：

项目配置了editConfig，默认换行符是LF，而pull下来的代码是CRLF，因此你只要随便改动一点后，编辑器会自动把文件换行符从CRLF改成LF。
这就导致diff很难看

**core.autocrlf的三种配置**
```shell
# 这个是在windows系统上的默认值
# push转为LF，pull转为CRLF
config --global core.autocrlf true

# push转为LF，pull不进行转换
config --global core.autocrlf input

# push和pull都不转换
config --global core.autocrlf false
```

**怎么解决**

```shell
# 查看当前值
git config --global core.autocrlf

# 修改core.autocrlf为input
# 一般项目都会配置文件换行符为LF，如果你有项目在使用CRLF的换行符配置，那下面这个配置会影响它
git config --global core.autocrlf input
# 项目中每个成员都需要这样手动设置一番吗，有没有项目级别的配置文件？

# 查看是否修改成功
git config --global core.autocrlf
```


**git的配置文件说明**

[官网配置说明](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%88%9D%E6%AC%A1%E8%BF%90%E8%A1%8C-Git-%E5%89%8D%E7%9A%84%E9%85%8D%E7%BD%AE)

git配置文件
- /etc/gitconfig // 软件安装目录，针对所有用户
- C:\Users\$USER\.gitconfig  // 针对当前登录用户，crlf转换取的就是这个配置，我们通过命令行配置也是改的这个地方
- .git/config // 项目中的git配置，
```shell
# 查看所有配置文件及其所在位置
git config --list --show-origin
```





