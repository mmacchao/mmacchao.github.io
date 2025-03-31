# java入门
[demo仓库地址 ](https://github.com/mmacchao/java-demo) 

## 纯java项目
- 新建MyApp.java
- 编译 javac Myapp.java，生成MyApp.class
- 运行 java MyApp

## 准备工作
- 安装jdk，测试 java --version
- 安装maven 测试 mvn

## 用maven包管理工具创建后端服务
- 新建pom.xml文件，配置项目名称, 打包类型jar还是war, 配置开发tomcat插件
- 安装依赖 mvn dependency:resolve
- 编写servlet类，提供后端接口服务
- mvn package 打出war包 myapp.war，package前会自动更新依赖
- war包放入tomcat的webapp目录，执行 tomcat/bin/startup.bat启动tomcat，tomcat会自动解压war包 访问 http://localhost:8080/myapp

## 创建数据库，实现注册登录功能
- 创建数据库 base
- use base; 创建表user
- 启动一个vite，新建登录页面 npm create vite@latest my-vue-app -- --template vue
- 创建login servet，引入json处理的包，接收json，返回json

## 数据库引入第三方库mybatis
- pom.xml中添加mybatis
- 添加mybatis配置文件 model mapper接口 mapper配置文件
- controller中手动新建mapper实例

## servlet改成spring mvc
- 添加spring-mvc.xml配置，配置扫描controller包
- 引入jackson
- 修改servlet为@Controller
- mybatis实例改成使用注解引入@Autowired

踩坑：spring各组件版本不统一问题；po, vo等未添加getter，导致json序列化失败

## 引入spring-boot
- 传统项目和spring-mvc项目的入口文件都在web.xml，而spring-boot的入口文件在继承了SpringBootServletInitializer的类，一般定义为Application.java
- spring-boot项目不需要web.xml，因为内部集成了tomcat插件，但是也可以使用外部maven的tomcat插件启动开发模式，此时入口文件还是web.xml，也可用没有web.xml，但是其内部实现机制原因会调用继承了SpringBootServletInitializer的类，实现spring-boot项目的初始化
- 和spring-mvc比基本就是换了个配置文件，同时内置tomcat

踩坑：spring-boot项目用maven:tomcat7插件启动失败，idea配置本地tomcat启动没问题，直接运行Application.java也没问题，原因未知，可能是版本问题

## 创建多个包，互相引用
- 父子包，如果目录不是父子结构，需要额外配置路径参数

## mybatis改成mybatis-plus
- mybatis-plus是mybatis的超集，加入了更多简便功能，但也可以使用全部的mybatis能力
- 添加mybatis-plus依赖，移除mybatis依赖，mybatis-plus会自动引入mybatis
- 修改application.yml，添加mybatis-plus配置，移除mybatis配置
- 修改mapper文件，改成继承BaseMapper
- 修改model，添加@TableName("user")注解

踩坑：启动报错，mapper初始化失败，pom文件中mybatis依赖未全部移除

## 加入nacos，添加动态配置功能

## 加入dubbo和nacos
- 下载并启动nacos，默认自带数据库Derby，也可以启动时改为连接外部数据库如mysql，但是要提前建好相应的表
- 


## 加入redis

## 加入seata