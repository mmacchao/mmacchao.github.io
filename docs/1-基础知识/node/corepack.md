## corepack包管理器

vue-vben-admin使用了corepack用来指定使用pnpm且指定使用具体版本的pnpm

corepack是node官方出品，安装node16后会自动同时在node_modules里面安装npm, corepack。不过corepack在低版本的node中需要手动启用
为什么又出现了一个corepack: 估计node的npm竞争不过pnpm, yarn, 所以干脆又在外面再套了一层来管理npm, pnpm, yarn

```shell
# 安装最新版本的corepack
# (最后先卸载原先的pnpm，我也没实验corepack安装的pnpm是否会自动覆盖原先的pnpm)
npm i -g corepack

# 手动启用corepack, 这一步会生成npm pnpm yarn命令，现在就可以使用pnpm命令了
# （安装的corepack比较新的话也可能不用这一步）
corepack enable

# 执行pnpm命令，项目指定了pnpm版本的话就会安装并使用对应的版本
# 安装可能失败，需要在项目中的npmrc中配置regirsty或者设置系统环境变量COREPACK_NPM_REGISTRY=https://registry.npmmirror.com
# - 如果项目中有package.json字段且指定了"packageManager": "pnpm@10.22.0",那么会自动安装pnpm@10.22.0
# - 如果有package.json且指定了engines.pnpm >=10.0.0，同时pnpm指向了未卸载的原先全局安装的pnpm@7 会提示需要大于版本10
# - 如果没有package.json会安装最新版本的pnpm
pnpm -v
```

如果没有启用corepack，手动安装了pnpm，那么packageManager, engines.pnpm字段都不会起作用，但也能正常工作

因此如果未启用corepack的话，还是可以任意使用包管理器的