<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-11-02 16:05:01
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-11-03 15:58:36
 * @FilePath: \mmacchao.github.io\docs\前端基建\devOps\docker.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# Docker简介
可以将各种服务打包放到docker里面，然后就可以在linux系统下运行服务了，类似于开发的win应用打包成一个exe，其他人就可以快速使用了。docker类似于虚拟机。

[Docker官网文档](https://docs.docker.com/get-started/overview/)

[中文文档](http://www.dockerinfo.net/document)

[为什么会需要Docker？](https://www.zhihu.com/question/621025546/answer/3203496233)

[docker安装Ubuntu以及ssh连接](https://www.cnblogs.com/mengw/p/11413461.html)

## Docker解决了什么问题
没有docker时服务迁移可能运行不正常，配置一样，有可能操作系统不一样导致出问题，为解决操作系统一致性问题可以考虑用虚拟机安装同样的操作系统，但是硬件浪费大，且启动慢，docker帮你处理了操作系统的问题

## Docker快速入门
> [参考官网快速入门](https://docs.docker.com/get-started/)

### 前置工作
[安装Docker Desktop](https://docs.docker.com/desktop/install/windows-install/)，这是一个GUI程序方便快速进行可视化操作，同时安装完成后可以运行docker命令，后续操作可以直接用docker命令也可以操作docker desktop程序

### 获取Demo源码
```shell
git clone https://github.com/docker/getting-started-app.git
```

### 打包镜像
1. 切换到项目根目录，创建Dockerfile文件，文件内容如下
```docker
# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
EXPOSE 3000
```
2. 打包镜像
```shell
# 在项目根目录执行，生成了一个名称为getting-started的镜像
docker build -t getting-started .
```

### 运行容器

用docker命令运行镜像，可以同时启动多个容器，每个容器中的镜像可以一样
```shell
# 指定运行端口为8090，同时内部映射到3000，然后就可以浏览器访问localhost:8090了
docker run -dp 127.0.0.1:8090:3000 getting-started
docker ps # 查看容器列表
```

### 更新代码后更新容器
```shell
# 1. 修改代码后重新打包镜像
docker build -t getting-started .

# 2. 停止正在运行的旧容器，否则会占用端口
docker ps # 显示所有容器
docker stop <the-container-id> # 停止某个容器的运行
docker rm <the-container-id> # 删除指定容器，可以不删，不影响后续操作

# 3. 重新启动新容器
docker run -dp 127.0.0.1:3000:3000 getting-started
```

### 分享镜像
```shell
# 1. 创建自己的仓库，登录[docker hub](https://hub.docker.com/)，注册，然后创建一个仓库，命名为getting-started

# 2. 登录docker hub
docker login -u YOUR-USER-NAME

# 3. 给getting-started镜像一个新的名字
docker tag getting-started YOUR-USER-NAME/getting-started
docker image ls # 查看所有镜像

# 4. 把镜像推送到docker hub
docker push YOUR-USER-NAME/getting-started

# 5. 后续运行镜像时，如果本地没有会自动从docker hub上寻找并下载
```

### 数据持久化

每个容器有自己的文件系统，删除容器后对应的文件修改也会删除，那如何保留容器修改的文件呢，可以通过创建volume，然后把容器中的目录链接到volume
```shell
# 1. 创建一个volume，名称叫todo-db
docker volume create todo-db 

# 2. 启动容器，并且将新容器的某个路径指向前面创建的volume
# 在getting-started这个例子中，页面数据存储在/etc/todos目录下，因此把容器中的这个目录持久化即可
docker run -dp 127.0.0.1:3000:3000 --mount type=volume,src=todo-db,target=/etc/todos getting-started

# 3. 删除旧容器重新启动容器，可以看到数据得到了保留
docker ps # 查看所有容器
docker rm -f 容器id

# 4. 查看volume的存储位置
docker volume inspect
```

### 在容器中访问本地机器文件
前面的volume只是可以保存容器的中文件，而bind的模式可以直接访问操作本地机器指定文件夹
```shell
# 1. 切换到项目根目录，打开控制台执行命令，运行一个abuntu镜像并在里面再打开内部控制台
# %cd%表示本地目录即当前项目根目录，/src表示容器中的目录，操作容器中的src目录中的文件等效于操作本地目录
docker run -it --mount "type=bind,src=%cd%,target=/src" ubuntu bash

# 2. 查看容器目录列表并打开容器中的src目录
ls
cd src
ls # 查看src目录下的列表

# 3. 新建文件
touch myfile.txt
ls # 可以看到已经有了myfile.txt

# 4. 打开本地目录，可以看到新创建的文件，手动删除文件后，重新在容器中查看文件，已经没了
ls # 文件没了
```

### 多个容器的通信
```shell
# 1. 创建network，处于同一个network的不同容器才能通信
docker network create todo-app

# 2. 启动一个mysql容器，给容器一个网络别名mysql便于其他容器通过名字链接它
docker run -d `
    --network todo-app --network-alias mysql `
    -v todo-mysql-data:/var/lib/mysql `
    -e MYSQL_ROOT_PASSWORD=secret `
    -e MYSQL_DATABASE=todos `
    mysql:8.0

# 3. 登录容器中的mysql，查看刚刚创建的数据库todos是否存在
docker exec -it <mysql-container-id> mysql -u root -p

show database

# 4. 启动服务链接到mysql，以直接链接本地目录的方式启动app，修改项目文件保存后可以实现查看效果
docker run -dp 127.0.0.1:3000:3000 `
  -w /app -v "$(pwd):/app" `
  --network todo-app `
  -e MYSQL_HOST=mysql `
  -e MYSQL_USER=root `
  -e MYSQL_PASSWORD=secret `
  -e MYSQL_DB=todos `
  node:18-alpine `
  sh -c "yarn install && yarn run dev"

# 5. 查看服务控制台是否链接成功
docker logs -f <container-id>

# 6. 打开浏览器添加几个条目，然后打开mysql控制台查看数据库中是否有数据
docker exec -it <mysql-container-id> mysql -p todos

mysql> select * from todo_items;
```

### 更简易的多容器通信
通过创建一个compose file，可以更便捷的实现多容器启动

在项目根目录下创建compose.yaml
```shell
services:
  app:
    image: node:18-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - 127.0.0.1:3000:3000
    working_dir: /app
    volumes:
      - ./:/app
    environment:
      MYSQL_HOST: mysql
      MYSQL_USER: root
      MYSQL_PASSWORD: secret
      MYSQL_DB: todos

  mysql:
    image: mysql:8.0
    volumes:
      - todo-mysql-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: todos

volumes:
  todo-mysql-data:
```

打开项目根目录启动容器
```shell
docker compose up -d
```

查看输出信息，访问localhost:3000
```shell
docker compose logs -f
```

关闭所有容器
```shell
docker compose down
```

### 如何加快镜像构建速度
参考：[掌握了Docker Layer Caching才敢自称精通Dockerfile](https://cloud.tencent.com/developer/article/1633016)

Dockerfile文件中的每一行都会生成一个layer，后续再次构建如果没有变化会复用上一次的layer缓存（COPY命令会检测文件是否变动）但是如果某一个layer没有走缓存，那后续所有的layer都不会再缓存，因此建议把不变的操作放前面，会变动的操作放后面
```docker
# 最开始的Dockerfile
# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /app
# 每次文件变动，这个copy layer都不会缓存，导致下一行的安装依赖缓存也失效了，因此可以把下面的一行移上去
COPY . .    
RUN yarn install --production
CMD ["node", "src/index.js"]
EXPOSE 3000

# 优化后的Dockerfile
# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
 # 必须先复制package.json，因为后续的install依赖这个文件
COPY package.json yarn.lock ./ 
RUN yarn install --production
COPY . .
CMD ["node", "src/index.js"]
```

**创建.dockerignore文件，不需要复制本地的node_modules，加快构建速度**
```
node_modules
```




