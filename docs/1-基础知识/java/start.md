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

## 加入nacos，dubbo，添加动态配置功能和注册中心
- nacos提供了动态配置功能和服务发现功能
- 下载nocos服务端，以单例模式启动服务端后，打开 http://localhost:8848/nacos 就可以进入控制台
- 需了解命名空间、group的概念
- 远程服务访问可以用FeignClient、RestTemplate、Dubbo等

踩坑：包的版本问题导致nacos和dubbo一起时总是启动失败

## 加入seata
- 分布式事务包
- 下载seata服务端，默认是以file的形式启动的， 修改配置文件registry.conf或者新版本为application.yml文件，改为启用nacos作为服务注册中心
```yml
# 部分seata服务端配置
seata:
  registry:
    # support: nacos, eureka, redis, zk, consul, etcd3, sofa
    type: nacos
    nacos:
      server-addr: "127.0.0.1:8848"
      namespace: ""
      group: "DEFAULT_GROUP"
      cluster: ""
      username: ""
      password: ""
  store:
    # support: file 、 db 、 redis
    mode: file

  service:
    vgroup-mapping:
      my_test_tx_group: default
```

踩坑：包的版本问题，导致业务服务怎么都找不到seata的服务，spring-cloud-alibaba-dependencies自带了seata的依赖，服务端和客户端版本最好保持一致，最后是直接用spring-cloud-alibaba-dependencies自带的1.3.0版本运行成功的

## 加入redis
- redis支持string hash list set sortedSet
- redis的数据库名从0开始，不能修改
- redis没有用户的概念，可以设置密码
- 多个项目可以起多个redis服务，不建议通过database区分，因为database并不是完全隔离，另外redis占用内存不多

## lombok
Lombok 是一个 Java 开发工具库，旨在通过简单的注解简化冗余的样板代码（Boilerplate Code），提升开发效率和代码可维护性。它通过编译时注解处理技术（基于 JSR 269 规范）自动生成代码，无需手动编写重复的 getter、setter、equals 等方法
- @Data 组合注解 包含 @Getter、@Setter、@ToString、@EqualsAndHashCode 和 @RequiredArgsConstructor
- @Slf4j/@Log4j2：自动注入日志对象（如 log.info()）
- lombok需要配合编辑器的lombok插件使用，因为其是编译阶段生成的代码，编辑器在没有插件的情况下会解析不了代码


## log4j
Log4j 是 Apache 软件基金会下的开源 Java 日志框架，旨在为开发者提供灵活、高效的日志记录功能。它通过分级管理日志信息、自定义输出格式和目的地，帮助开发者监控程序运行状态、调试代码并优化系统性能

## 写一个简易的redis 和redis-cli
- 客户端通过Socket，服务端通过ServiceSocket通信，分别执行一个while循环，循环通过PrintWriter发送数据，BufferedReader读取数据

## 单点登录cas
- CAS（Central Authentication Service，中央认证服务）认证中心是一种基于单点登录（SSO）协议的身份认证系统，旨在为用户提供统一的身份验证服务，允许用户通过一次登录访问多个相互信任的应用系统
- 分为服务端和客户端
- 类似的系统有OAuth 2.0，SAML
