# vscode编辑器设置

原先一直是用webstorm编辑器，现在cursor很强大，为学习cursor的使用，准备切换到cursor，因此学习下vscode的各种设置，cursor基本是套壳vscode

cursor需要各种插件才能达到webstorm的程度

## 配置文件介绍

ctrl+shift+P 可以打开命令搜索行， 搜索 settings json会列出配置文件

### 分类
- 默认配置，defaultSettings.json 此配置只读，根据当前启用的插件配置加vscode默认配置动态生成，里面包含各配置的可选值和描述
- 用户配置 此配置类似于全局默认配置，在cursor/settings.json
- profile配置 此配置类似于用户配置，在cursor/profiles/xxx/settings.json可以在编辑器左下角选择新建配置文件，用户配置就是默认的profile
- 工作区配置，在项目目录下 .vscode/settings.json

工作区配置优先级最高，同时一般通过ctrl+,打开的可视化配置界面，上面tab会提示你改的是全局配置还是工作区配置

### 具体配置文件
并非所有配置都在一个文件
- settings.json // 主题，格式化等配置
- keybindings.json // 快捷键配置
- extensions.json // 关联插件列表，这个一般只能界面调整，文件是压缩过的，所以安装的插件是跟随用户配置的，切换用户配置插件需重新安装

导出配置时会包含上述文件，另外还有一些其他界面设置也会被导出

## 主题、格式化等settings.json

- 主题：Monokai Pro，里面的sun配色还行

可以在项目目录新建.vscode/settings.json

```json
{
  "workbench.colorCustomizations": {
    "editor.background": "#FDF6E3" // 配置编辑区背景色
  }
}
```

## 快捷键keybindings.json

原始ctrl + shift + k，改成自己的习惯 ctrl + d
Ctrl+Shift+P 打开命令面板 搜索Preferences: Open Keyboard Shortcuts (JSON)，直接编辑用户配置文件keybinds.json
  
```jsonc
[
  {
    "key": "ctrl+d", // 删除行
    "command": "editor.action.deleteLines",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+e", // 打开最近打开过的文件
    "command": "workbench.action.quickOpen"
  },
  {
    "key": "ctrl+alt+l", // 格式化
    "command": "editor.action.formatDocument"
  },
  {
    "key": "ctrl+alt+down", // 复制行
    "command": "editor.action.copyLinesDownAction"
  },
  {
    "key": "shift+alt+down", // 向下移动行
    "command": "editor.action.moveLinesDownAction"
  },
  {
    "key": "shift+alt+up", // 向上移动行
    "command": "editor.action.moveLinesUpAction"
  }
]
```

### 最近编辑文件

## 自定义新的编辑器

1. 导入vscode配置
2. 查看配置的主题Atom One Light是否下载成功，是否生效，也可以使用新编辑器的默认主题

## 修改git的更改组

默认git会把所有未追踪的文件列出来，可以设置"git.untrackedChanges": "hidden", 隐藏未追踪文件或者separate，分组显示
