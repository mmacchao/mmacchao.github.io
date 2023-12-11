# 手动完成一个k8s的vue应用部署

## 全手动
1. 前端打包：nodejs环境，
    ```shell
    pnpm i
    pnpm build
    ```
2. docker环境，docker打包并上传到docker hub：写Dockerfile文件，写nginx.conf文件，执行docker的build

    Dockerfile
    ```
    FROM nginx:alpine
    COPY nginx.conf /etc/nginx/
    COPY dist/ /etc/nginx/html/
    ```

    nginx.conf，直接copy的nginx目录下的

    ```shell
    # 进入项目根目录执行，即会在本地生成一个镜像
    docker build -t my-app .

    # 测试docker启动项目，访问localhost:18080查看能否打开主页
    docker run -p 18080:80 my-app

    # 进入容器查看具体目录
    docker ps # 获取容器id
    docker exec -it 容器id /bin/sh

    # 创建docker hub账号, 用户名thinker12，新建仓库my-app，把本地镜像重命名
    docker tag my-app thinker12/my-app:1 # my-app:1其中的1是tag，如果不设置，默认是latest

    # 推送到docker hub，输入docker hub的密码
    docker login -u thinker12

    # 登录成功后推送到docker hub
    docker push thinker12/my-app:1
    ```

3. kubctl工具环境：k8s利用nginx镜像运行项目
    ```shell
    # 创建名称为my-app的deployment，内部会自动生成pod，如果pod挂了，会自动重新生成pod
    kubectl create deployment my-app --image=thinker12/my-app:1

    # 查看deployment
    kubectl get deployments

    # 查看pod
    kubectl get pods
    ```
4. 本地访问
    ```shell
    # pod默认外界是访问不了的，前面我们创建的pod内部的nginx根据配置启动的9000端口，如果直接访问localhost:9000是不行的，需要先创建一个service，由service代理pod，再然后暴露service，我们通过访问service达到访问pod的目的
    # 1. 把my-app暴露出来，会自动创建名称为my-app的service
    kubectl expose deployment my-app --type=LoadBalancer --port=9000

    # 查看创建的services
    kubectl get services

    # 2. 把services暴露出来，下面的命令会给service一个随机端口号，这个端口号，如果一切顺利会自动打开对应的网址
    minikube service my-app
    ```

## 部分步骤改为配置文件

其中k8s生成deployment和service的步骤可以用配置文件来代替

deployment.yml
```shell
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-deployment
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app-pod
        image: thinker12/my-app:1
        ports:
        - containerPort: 9000
```

service.yaml
```shell
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app # 和前面的labels.app保持一致
  ports:
  - protocol: TCP
    port: 1111 # 这个随意
    targetPort: 9000 # 要和containerPort保持一致
    nodePort: 30000 # 这个随意
  type: NodePort
```

运行
```shell
# 生成deployment
kubectl apply -f deployment.yaml

# 生成service
kubectl apply -f service.yaml

# 暴露service
minikube service my-app-service
```

## 镜像上传到docker hub改为上传到自建的Harbor
```shell
# 登出docker hub
docker logout

# 登录网页harbor，新建项目 my-rep, 这一步类似docker hub的用户名，docker登录harbor，默认密码Harbor12345
# 此处如果用localhost登录那没问题，如果用本机ip登录，会自动走https：443，会登录失败，需要手动配置下docker的insecure-registries参数
# 参考 [如何设置非安全的Docker镜像仓库](https://www.51cto.com/article/604342.html)
docker login localhost:80 -u admin -p Harbor12345

# 镜像命名
docker tag my-app localhost/my-rep/my-app:1 

# 推送镜像，要先在harbor里面新建仓库my-rep
docker push localhost/my-rep/my-app:1

# 拉取镜像
docker pull localhost/my-rep/my-app:1

```


修改deployment.yml
```shell
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-deployment-harbor # 修改deployment的名称
spec:
  selector:
    matchLabels:
      app: my-app-harbor # 和下面的labels.app保持一致
  template:
    metadata:
      labels:
        app: my-app-harbor
    spec:
      containers:
      - name: my-app-pod
        image: localhost/my-rep/my-app:1 # 修改镜像
        ports:
        - containerPort: 9000
```

修改service.yaml
```shell
apiVersion: v1
kind: Service
metadata:
  name: my-app-service-harbor
spec:
  selector:
    app: my-app-harbor # 和前面的labels.app保持一致
  ports:
  - protocol: TCP
    port: 1111 # 这个随意
    targetPort: 9000 # 要和containerPort保持一致
    nodePort: 30001 # 这个随意
  type: NodePort
```

```shell
# 暴露service
minikube service my-app-service
```

## 部署过程改用jenkins
- 在win11上面通过wsl安装ubuntu
- 用apt安装jenkins
- 在ubuntu里面安装docker-engine
- ubuntu里面安装minikube和kubectl，执行minikube start --driver=docker创建k8s集群

## 直接操作denkins UI
- 下载代码用插件：安装git插件，就可以不依赖操作系统中的git，手动git步骤还是不少的，要clone，切分支，拉最新代码
- 剩余步骤用shell
  - 前端打包: 安装nodejs插件，可以不依赖操作系统中的node
  - docker构建和上传
  - k8s部署

构建步骤如下
```shell
# 前端打包，我是ubuntu上安装了pnpm
pnpm i && pnpm build

# docker构建并上传
docker build -t my-app .
# 从package.json获取版本号
version=`node -p "require('./package.json').version"`
docker tag my-app "thinker12/my-app:$version"
# 登录docker hub，提前在docker hub创建用户thinker12和创建项目my-app
docker login -u thinker12 -p &kkeQm.czY&%M8L
docker push "thinker12/my-app:$version"

# k8s部署
# 先删除旧的deployment和service
kubectl delete deployment my-app-deployment
kubectl delete service my-app-service 

# 创建新的
kubectl apply -f ./deploy/deployment.yaml
kubectl apply -f ./deploy/service.yaml

# 暴露服务，这一步访问不了minikube，需要手动在win11的命令行中运行
# minikube service my-app-service
```


## 写pipline


## 部署过程改用kubesphere