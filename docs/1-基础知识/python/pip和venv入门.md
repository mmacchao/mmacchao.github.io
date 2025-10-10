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

