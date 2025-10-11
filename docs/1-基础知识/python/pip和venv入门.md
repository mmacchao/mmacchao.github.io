# pip和venv

pip是python的官方包管理器，类似npm和maven

pip默认把包安装在python安装目录下的site-packages下面，pip默认是类似maven中央统一仓库，但又有一些不同，pip对于同一个包的不同版本，不会同时安装，而是替换。这是pip的设计理念，同一个包不允许同时存在多个版本。但是这导致多个项目需要不同的包很难搞。于是venv出现了。

## venv
python为了支持类似npm每个项目独立安装包的功能，先由社区发展出了virtualenv模块，后面python3.3引入了官方的venv模块，因此如果是安装的早期python版本，需要引入virtualenv模块

```python
# python3.3之前需要用社区virtualenv版本
pip install virtualenv
virtualenv venv(目录名称)

# 官方版本
python -m venv venv(目录名称)

# 激活虚拟环境（其实就是修改了PATH，使python指向项目所在python）
# 可以不激活，使用时补全项目python路径即可
venv\Scripts\activate
# 或者直接指定python
venv\Scripts\python -m pip install requests   # Windows
```

virtualenv 或 venv模块做了两事
- 创建项目专属python，可能是从全局python软连接过来的
- 创建激活虚拟环境脚本

## poetry入门

### 🧩 简单解释

**Poetry** 是一个用来 **管理 Python 项目的依赖和打包的工具**。
可以理解成是：

> Python 世界里的 “npm + package.json + virtualenv” 的组合。

它帮你解决三个核心问题：

1. **项目依赖管理**（自动安装、更新包）
2. **虚拟环境管理**（自动创建隔离的 Python 环境）
3. **项目打包发布**（生成 wheel 包、上传到 PyPI）

---

### ⚙️ 传统方式 vs Poetry 方式

| 功能   | 传统方式（pip + venv）           | Poetry 方式                            |
| ---- | -------------------------- | ------------------------------------ |
| 安装依赖 | `pip install requests`     | `poetry add requests`                |
| 管理依赖 | requirements.txt           | pyproject.toml                       |
| 虚拟环境 | 手动创建 `python -m venv venv` | 自动创建                                 |
| 打包发布 | setup.py, MANIFEST.in      | 一键 `poetry build` / `poetry publish` |

---

### poetry安装

```shell
# 使用win上的powershell安装，安装目录在%APPDATA%\pypoetry，
# 这会为poetry创建一个独立的venv环境，这个独立的环境固化了安装poetry时的python版本，因此后续全局python版本切换不影响这个poetry的python版本
# 同时会创建一个类似超链接%APPDATA%\Python\Scripts
# 把%APPDATA%\Python\Scripts加入PATH就可以命令行使用poetry了
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -

# 查看是否安装成功
poetry --version
```

### 安装依赖
```shell
# 自动创建虚拟环境并安装全部依赖
poetry install # 这会在把项目依赖安装在全局缓存目录

# 在项目目录下安装依赖
# 修改virtualenvs.in-project为true，就会在项目目录下创建.venv目录并安装依赖
# virtualenvs.in-project默认值是空，就会安装在全局缓存目录
# 如果已经全局缓存中已经安装了，这个值为true也不会生效，需要先remove掉全局缓存中的目录
# %APPDATA%\pypoetry在这个目录下会有config.toml配置文件，只有修改过配置，才会生成这个文件
poetry config virtualenvs.in-project true
```

### 激活虚拟环境
```shell
# 旧版本可以 poetry shell，新版不行了
# 激活环境就是在当前shell，修改PATH变量，使python指向虚拟环境的python
poetry env activate  # 这会打印出当前环境的activate文件，需要手动复制文件路径然后执行


# 不激活虚拟环境直接执行命令，通过poetry run可以起到类似激活虚拟环境的效果
poetry run python demo.py
```



