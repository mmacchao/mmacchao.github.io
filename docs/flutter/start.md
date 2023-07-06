# flutter入门
[flutter官方中文文档](https://flutter.cn/docs/get-started/install)

参考：[前端 Flutter 劝退指南](https://juejin.cn/post/6844903937527513102)

## 简介
Flutter能一套代码应用于android, ios, web, PC，跨平台的福音

## 快速开始一个Hello world
1. 环境配置

    下载[flutter](https://docs.flutter.dev/get-started/install), 下载完成后解压，将flutter\bin加入环境变量PATH，就可以在命令行中运行flutter了，[官方flutter环境变量配置参考](https://flutter.cn/docs/get-started/install/windows)
2. 初始化项目
   新建项目可以通过编辑器可视化操作，也可以用命令行，下面都用命令行的形式写demo
    ```shell
    flutter create my_app
    cd my_app
    ```
3. 运行项目
    通过下面的命令查看可以运行到哪些环境
    ```shell
    flutter devices
    # 结果大概如下
    # M2012K11AC (mobile)  android-arm64  • Android 12 (API 31)
    # Windows (desktop)    windows-x64    • Microsoft Windows [版本 10.0.22621.1848]
    # Chrome (web)         web-javascript • Google Chrome 114.0.5735.199
    # Edge (web)
    ```
    - 运行到web
    ```shell
    flutter run -d chrome
    ```
    - 运行到android，默认会自动寻找安卓设备，需要先手机开启开发者模式，并连接电脑，同时要安装android studio，[查看官方Android开发环境配置](https://flutter.cn/docs/get-started/install/windows)
    ```shell
    flutter run # flutter run -d m2012k11ac
    ```
    - 运行到windows，需要先安装visual studio，并且安装时勾选[使用 C++ 的桌面开发]，[查看官方PC应用开发所需环境配置](https://flutter.cn/docs/platform-integration/desktop)
    ```shell
    flutter run -d windows
    ```
4. 入口文件在/lib/main.dart里面
5. 热跟新

   修改文件保存后会自动热更新，如果没有的话在服务启动的控制台中按“r”键

