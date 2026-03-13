# diy遥控器

## 主板选择

pdd买了个 Arduino uno主板，下载arduino ide，连接硬件，并编程

如果没有硬件，可以在线wokwi模拟仿真  https://wokwi.com/projects/458092724237573121  也可以安装vscode插件本地仿真  本地需要搭配PlatformIO编译

## 软件开发工具

如果是开发Arduino uno主板，可选的开发工具有两种
- arduino ide: arduino官方出品的ide
- vscode + arduino: arduino官方出品插件，后台还是调用arduino ide进行编译
- vscode + platformIO: 专业嵌入式开发，arduino被作为基础库引入 #include <Arduino.h>

## vscode+platformIO开发

这个开发比官方ide要多写一些配置，且代码是标准的.cpp，arduino官方ide代码是.ino结尾的

flatformio.ini
```
[env:uno]
platform = atmelavr
board = uno
framework = arduino
lib_deps = 
    IRremote
```

写完代码，需要编译，然后上传到硬件中

## 硬件仿真wokwi

可以先在线上画出硬件图，然后下载到本地，但是在vscode中需要额外添加配置wokwi.toml

wokwi.toml
```
[wokwi]
version = 1
firmware = '.pio/build/uno/firmware.hex' ; 指定运行platformio编译好的文件
elf = '.pio/build/uno/firmware.elf'
```


