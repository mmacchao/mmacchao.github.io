# python入门

## python版本管理


### 切换python全局版本
python支持手动安装多个版本，根据PATH环境变量中的出现的第一个作为全局生效版本

python本身提供了py命令，查看所有安装版本和切换版本
```shell
py -0    # 查看所有可用版本
py -3.8  # 使用 Python 3.8 运行
py -3.10 # 使用 Python 3.10 运行
```

### 创建虚拟环境时指定版本
```shell
# 创建指定版本的虚拟环境
python3.10 -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 查看当前版本
python --version

```
