# pnpm简介

参考链接：[都2022年了，pnpm快到碗里来！](https://zhuanlan.zhihu.com/p/457698236)

## pnpm安装
- 通过corepack安装，这样你可以在项目中指定pnpm版本，如果不指定，corepack自动会安装pnpm最新版本，corepack最低需要node16
- 通过npm i -g pnpm，这个是把pnpm安装在nodejs的目录下面，切换node版本后需要重新安装，且只能有一个pnpm版本
- 通过pnpm官方链接安装

更推荐通过corepack在项目中固定pnpm的版本

## 如果频繁切换node版本，怎么确保不需要重新 pnpm i

切换node版本后，如果全局安装的是不同的pnpm版本，那么就需要重新pnpm i，这时可以在项目中使用corepack固定pnpm版本，同时启用corepack，不要使用npm i -g pnpm

## pnpm配置文件所在

一些常规配置通过pnpm config set默认会改到和npm一样的配置文件里面

pnpm独有的配置文件为 %localappdata%\pnpm\config\rc  C:\Users\用户名\AppData\Local\pnpm\config\rc

这个配置文件默认不存在，修改过配置后才会生成

```shell
# 这个修改会写入%localappdata%\pnpm\config\rc文件，如果加了--global还是会写入这个文件
pnpm config set store abc
```

## pnpm 缓存目录

```shell
# 获取缓存目录，在c盘和d盘得到的是不同的缓存目录
# 但是如果你显示的配置过store-dir，那么就会得到同一个缓存目录，但是跨盘符是不能使用hard-link的，这几乎等于store失效，pnpm会完全复制一份需要安装的包
pnpm store path
```

## pnpm符号链接和nodejs的寻址

### pnpm 的硬链接 / 符号链接，为什么 Node.js 能正常 `require` / `import`

pnpm 看起来把依赖“拆散了”，但 **Node.js 的模块解析规则 + 文件系统链接机制** 正好能配合得上。

**项目内的 `.pnpm` 目录**

   ```
   node_modules/.pnpm/
     lodash@4.17.21/node_modules/lodash
   ```

  * 这里的 `lodash` 目录里的文件
  * 👉 **硬链接（hard link）** 指向 store 里的真实文件

3. **项目的 `node_modules`**

   ```
   node_modules/lodash -> .pnpm/lodash@4.17.21/node_modules/lodash
   ```

  * 👉 这是一个 **符号链接（symlink）**

---

### Node.js 如何解析模块（关键点）

Node.js 的模块解析规则（简化）：

1. `require('lodash')`
2. 从当前目录开始，向上查找：

   ```
   ./node_modules/lodash
   ../node_modules/lodash
   ../../node_modules/lodash
   ```
3. 找到目录后：

  * 读取 `package.json`
  * 找 `main` / `exports`
  * 加载对应文件

**重点**：
👉 Node.js **不会区分真实目录还是符号链接**

只要：

* 路径存在
* 文件可读

解析就能继续。


### 那 Node.js 不会因为路径不同加载两次吗？

这是很多人最关心的点。

#### Node.js 的模块缓存规则

```js
require.cache[resolvedFilename]
```

缓存 key 是：

👉 **解析后的真实路径（realpath）**

Node.js 会：

```text
symlink path
  ↓ realpath()
真实文件路径
```

所以：

* 同一个包版本
* 同一个物理文件（硬链接）

👉 **只会加载一次**

pnpm 正是利用了这一点。

---

