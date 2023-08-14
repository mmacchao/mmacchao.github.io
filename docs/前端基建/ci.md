# ci/cd介绍
常用的ci/cd工具
- Jenkins
- GitLab CI/CD
- GitHub Actions
- Circle CI
- Travis CI

## GitHub Actions介绍
参考：[GitHub Actions 入门教程](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

特点：action可以引用其他人写好的，且action可以做成代码仓库，然后可以通过userName/repoName来引用action。官方的actions都放在找个github.com/actions里面了

### 基本概念
- workflow
- job
- step
- action

### workflow
以文件的形式存在，放在仓库的.github/workflows文件夹中，github会自动识别和运行里面的.yml文件

配置字段很多，详见[官方文档](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

本博客的配置文件如下
```yaml
name: Deploy # 名称
on: # 什么时候执行这个workflow
  workflow_dispatch: {}
  push:
    branches:
      - master
jobs: # 一些列的jobs
  deploy: # job_id
    runs-on: ubuntu-latest # 运行环境
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps: # deploy这个job对应的一系列运行步骤
      - uses: actions/checkout@v3 # 使用官方提供的action, 拉取代码
        name: checkout
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v3 # 官方action，安装node
        name: install node.js
        with:
          node-version: 16
          cache: npm
      - uses: pnpm/action-setup@v2 # 使用pnpm官方提供的action，安装pnpm
        name: Install pnpm
        with:
          version: 7
          run_install: false
      - name: Get pnpm store directory # 手动写脚本，获取store_path
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - uses: actions/cache@v3 # 官方action，用于缓存依赖
        name: Setup pnpm cache
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies # 手动写脚本，安装依赖
        run: pnpm install
      - name: Build # 手动写脚本，执行构建命令
        run: pnpm build
      - uses: actions/configure-pages@v2 # 官方action
      - uses: actions/upload-pages-artifact@v1 # 官方action，上传文件
        with:
          path: docs/.vitepress/dist
      - name: Deploy # 官方action，部署到指定服务器
        id: deployment
        uses: actions/deploy-pages@v1
```





## yaml配置文件介绍
用来写配置文件，比json好用，一般文件名以.yml为后缀，用＃表示注释
参考: [YAML 语言教程](https://www.ruanyifeng.com/blog/2016/07/yaml.html)

[js-yaml在线测试](http://nodeca.github.io/js-yaml/)

基本语法规则
> - 大小写敏感
> - 使用缩进表示层级关系
> - 缩进时不允许使用Tab键，只允许使用空格。
> - 缩进的空格数目不重要，只要相同层级的元素左侧对齐即可

**常用数据格式**
- 对象
- 数组
- 纯量
  - 字符串
  - 布尔值
  - 整数
  - 浮点数
  - Null
  - 时间
  - 日期
  
### 数组
以连线词开头
```yaml
- Cat
- Dog
- Goldfish
# 类似数组 [ 'Cat', 'Dog', 'Goldfish' ]
```

### 数组对象嵌套
```yaml
steps:
  - name: test1
    run: run1
  - name: test2
    run:
      - run1
      - run2

# 转为js  {steps: [{name: 'test1', run: 'run1'}, {name: 'test2', run: ['run1', 'run2']}]}
```

### 字符串
多行文字, 会自动把换行符转为空格
```yaml
str: 这是一段
  多行
  字符串
# { str: '这是一段 多行 字符串' }
```

用竖线表示保留换行
```yaml
this: |
  Foo
  Bar
that: >
  Foo
  Bar
# { this: 'Foo\nBar\n', that: 'Foo Bar\n' }
```