# SSH学习笔记

## ssh端口转发功能
- 动态转发：本地服务器执行命令实现
- 本地转发：本地服务器执行命令实现，常用于VPN，类似把目标服务器搬到了本地，这样两者就处于同一个网络
- 远程转发：目标服务器上执行命令实现，常用于内网穿透

### 动态转发
类似于本地起了一个代理服务器，请求先转到本地代理服务器，代理服务器再通过ssh服务器转发到实际地址，像正向代理

```shell
$ ssh -D local-port tunnel-host -N
```
上面命令中，-D表示动态转发，local-port是本地端口，tunnel-host是 SSH 服务器，-N表示这个 SSH 连接只进行端口转发，不登录远程 Shell，不能执行远程命令，只能充当隧道。

```shell
# 这种转发采用了 SOCKS5 协议。访问外部网站时，需要把 HTTP 请求转成 SOCKS5 协议，才能把本地端口的请求转发出去。
# 比如本地起了一个2121端口的sock5代理服务器
$ ssh -D 2121 tunnel-host -N
$ curl -x socks5://localhost:2121 https://www.baidu.com # 经由本地代理服务器端口2121，再通过ssh隧道访问百度首页
```


### 本地转发
类似于把服务器搬到了本地，本地转发一般用途是vpn，比如内网有B和C，B不提供直接访问，但C提供了，于是把B的端口映射到A本地，通过C作为ssh隧道实现访问
```shell
$ ssh -L -N -f local-port:target-host:target-port tunnel-host
$ ssh -L -N -f 3000:B:80 tunnel-host
# A通过访问localhost:3000，被ssh转发到B的80端口
```
参数解释：

- L：转发本地端口。
- N：不发送任何命令，只用来建立连接。没有这个参数，会在 SSH 服务器打开一个 Shell。
- f：将 SSH 连接放到后台。没有这个参数，暂时不用 SSH 连接时，终端会失去响应。

### 远程转发
目标内网服务器B上执行命令，把目标端口，比如80映射到ssh服务器上3000端口，A通过访问ssh服务器的3000端口来访问内网B，实现内网穿透
```shell
$ ssh -R -N -f -ssh-port:target-host:target-port tunnel-host
$ ssh -R -N -f 3000:B:80 tunnel-host
# A通过访问tunnel-host:3000，被ssh转发到B的80端口
```
参数解释：

- R：映射指定端口。