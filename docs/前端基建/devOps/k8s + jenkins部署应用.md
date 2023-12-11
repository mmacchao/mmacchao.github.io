# k8s + jenkins部署应用
这里的k8s有两层意义，第一层就是把jenkins的agent部署到k8s里面，以实现各种一次性的独立的构建环境，第二层意义是把项目代码部署到k8s里面

前面走了一遍手动构建镜像，然后手动push pull镜像到自建仓库，再手动部署镜像到minikube，现在用jenkins把这些步骤都自动化

说明：以下的操作是在win11专业版上进行的，安装wsl2，在win上面用linux，jenkins直接安装在linux里面

## 必备环境
- 安装wsl2,选ubuntu, 后续操作都是在ubuntu中进行
- 安装jenkins 
- 安装docker engine和docker-compose
- 安装minikube
- 安装kubectl
- 安装harbor

### wsl2安装ubuntu
[如何使用 WSL 在 Windows 上安装 Linux](https://learn.microsoft.com/zh-cn/windows/wsl/install)
```shell
# 会自动安装ubuntu
wsl --install
```

### 安装jenkins
[Jenkins Debian Packages](https://pkg.jenkins.io/debian/)
大概步骤就是先下载个啥.asc文件，然后转换成jenkins.list，再然后更新仓库列表，然后就能找到jenkins官方下载地址下载安装

### 安装docker engine
[安装docker engine的ubuntu版本](https://docs.docker.com/engine/install/ubuntu/)

安装好后用docker info，测试是否ok，第一次engine可能启动比较慢会导致docker info提示连不上，可以稍等会儿，后续每次docker engine会跟随系统自动启动

如果按上面的链接操作安装，则直接安装了docker compose plugin，就可以通过docker compose执行原先的docker-compose命令，或者单独安装一个docker-compose

[独立安装docker-compose](https://docs.docker.com/compose/install/standalone/)

ps: sudo docker run hello-world可能镜像会下载不了，需要魔法

[如何设置非安全的Docker镜像仓库](https://www.51cto.com/article/604342.html)
```json
// 这一步是为了后续能以http的形式访问本地harbor
// 修改下 /etc/docker/daemon.json
// 添加这么一段，文件如果不存在就新建一个
 {
   "insecure-registries":["你的ubuntu ip"]
 }
```



### 安装minikube
[安装minikube](https://minikube.sigs.k8s.io/docs/start/)

```shell
# 安装好后执行，这一步依赖docker，会下载相关镜像生成一个minikube container
minikube start --drvier=docker --insecure-registry=linux的ip地址
```

### 安装kubectl
[在 Linux 系统中安装并设置 kubectl](https://kubernetes.io/zh-cn/docs/tasks/tools/install-kubectl-linux/)

### 安装harbor
[harbor安装参考](https://cloud.tencent.com/developer/article/2159173)

这个安装没有参考官方，感觉官方的安装写的贼复杂，harbor安装依赖docker和docker-compose

```shell
# 从github下载最新的安装包，包里面有相关docker镜像，几百M，下载估计比较慢
# 1. liunx下载命令，或者用win下载，然后拷贝到linux, 所有版本列表https://github.com/goharbor/harbor/releases
wget https://github.com/goharbor/harbor/releases/download/v2.7.4/harbor-offline-installer-v2.7.4.tgz

# 2. 解压，并修改配置文件
tar zxf harbor-offline-installer-v2.7.4.tgz

# 默认有个harbor.yml.tmpl，直接从这个文件复制下，然后修改harbor.yml
cp harbor.yml.tmpl harbor.yml
```

harbor.yml的部分
```shell
# The IP address or hostname to access admin UI and registry service.
# DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.
hostname: 172.22.109.126 # 地址就按上面提示的用ubuntu的ip，可以通过ifconfig，找到eth0开头的那一段，就是ubuntu的ip

# http related config
http:
  # port for http, default is 80. If https enabled, this port will redirect to https port
  port: 80

# https相关的都注释掉，这个搞起来麻烦，当然这一块简单了，后面docker和minikube都需要特别处理下这个问题
# https related config
# https:
#   # https port for harbor, default is 443
#   port: 443
#   # The path of cert and key files for nginx
#   certificate: /root/certs/reg.westos.org.crt
#   private_key: /your/private/key/path
```

```shell

# 3. 进入解压后的harbor目录
./prepare # 做一些准备工作

# 取出里面的镜像，创建container，这一步可能遇到permission denied，就是没权限，那可以加上 sudo ./install.sh
# 我用的就是 sudo ./install.sh，但又碰上找不到/root/.docker/docker-desktop/docker.sock的问题，可能是因为我先装过win版的docker desktop导致的
# 后面用了软连接处理的 ln s /var/run/docker.sock /root/.docker/docker-desktop/docker.sock
./install.sh 

# 浏览器访问
# 直接打开localhost就行，默认是80端口
```

## 具体步骤
- 进入wsl2
- 启动minikube
- 启动harbor
- 启动jenkins，访问jenkins的web控制台，安装k8s的各种插件
- 构建集成kubectl和使用root用户的jenkins agent镜像
- 编写k8s的deployment.yml文件，编写Jenkinsfile，编写Dockerfile
- 创建pipline项目，填写项目信息，流水线选择pipline script from scm，填入信息，保存，执行构建，构建成功后用minikube service serviceName暴露服务，用浏览器查看

### 进入wsl2
可以搜索wsl，或者ubuntu就可以进入

### 启动minikube
```shell
# 安装好后执行，这一步依赖docker，会下载相关镜像生成一个minikube container
# insecure的意思是允许以http的形式访问本地harbor，前面harbor不是图简单直接把https注释了吗
minikube start --driver=docker --insecure-registry=linux的ip地址
```

### 启动harbor
再走一遍 ./install的安装步骤，就能启动了，目前没整明白为啥harbor没有自动启动

访问localhost，输入默认用户名 “admin” 默认密码 “Harbor12345”，创建仓库

### 启动jenkins并访问jenkins的web控制台
```shell
# 启动
nohup jenkins &

# 从log中找到jenkins初始化需要的字符串
tail nohup.out
```

访问localhost:8080, 进入后安装k8s相关插件
- Kubernetes plugin：用于实现jenkins agent的k8s部署 [参考插件官网](https://plugins.jenkins.io/kubernetes/)
- Kubernetes :: Pipeline :: DevOps Steps  作用没搞懂
- [Kubernetes CLI Plugin](https://plugins.jenkins.io/kubernetes-cli/)：用于实现kubectl连接远程k8s cluster，提供用户名密码和远程k8s cluster给它，就可以安装kubectl，然后操作远程k8s cluster了

添加安全凭证，后续的Jenkinsfile编写需要用到这些凭证，系统管理 -> 凭据管理 -> 添加凭据
- gitee: 用于git拉代码，选username with password，id填入gitee，可以任意起名字，后续编写Jenkinsfile指定这个名字即可
- harbor：用于登录harbor，选username with password，id填入harbor
- sa-secret: 用于访问k8s cluster，选择secret text，填入token，id设置为sa-secret，token按下面的步骤获取

1. 创建用于访问k8s cluster的凭据
```shell
# 创建serviceAccount，这一步没怎么研究，就跟着网上的走
# 创建一个名为jenkins-robot的sa
kubectl create serviceaccount jenkins-sa

# 绑定角色啥的，没太懂
kubectl create rolebinding jenkins-sa-binding --clusterrole=cluster-admin --serviceaccount=default:jenkins-sa
```

2. 创建secret绑定到对应的serviceAccount
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: sa-secret # 指定secret的名字
  annotations:
    kubernetes.io/service-account.name: "jenkins-sa" # 绑定到jenkins-sa这个serviceAccount上
type: kubernetes.io/service-account-token
```

3. 查看找到secret对应的token并复制token
```shell
kubectl describe secret sa-secret
# 得到一大堆字符串，类似下面这种，复制其中token字段的值
#Name:         sa-secret
#Namespace:    default
#
#Type:  kubernetes.io/service-account-token
#
#Data
#====
#ca.crt:     1111 bytes
#extra:      4 bytes
#namespace:  7 bytes
#token:      eyJhbGciOiJSUzI1NiIsImtpZCI6InNFNTdsTTBMSnUyQWNLNU4tLXl2S1Q0aDdzYm1USnFZWGtlbTRTdWhrZ00ifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6InNhLXNlY3JldCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiZTUyMTAyMDAtMGFhMS00Mjc2LWE4N2QtMjVhNTdkNjdlOTRkIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50OmRlZmF1bHQ6ZGVmYXVsdCJ9.TrL5U-3GeYW5DORcG6Rk7CC2pGa0AO_pZ8O1Ia7vIKxiZq1STvQyewtJiBSUcpKPUmsTe60uWLR6_1MY3-7EESGx3G-XUIRtF9Bt5HGEnhfZn6-BGP0brXYQXhfMcssQdePYroO9N9N3LQnyMroCHyCFhamU_-gIKNgotLiE8xO-kA5v6FFgK3rzohex-qQyOEJRDoaIESvo-FlxDu2Ai8KXsTvd0wKTG1s-C5XtgUPczJuHUW8bHepuwimUsvtB4vI_XoygaeicOT_uajd9Hh5tVeX4pzl_vwSolrH-dVwEGjUCoEVp6-wDjs5ox0GEz4tFvQzIcL8pFbjPHuOibw
```

创建cloud，创建即可，后续的kubernetes plugin的podTemplate不指定cloud会自动使用这个

系统管理 -> clouds -> new cloud，填入名称k8s，选择kubernetes，如果没有这个选项也许你还没安装kubernetes plugin
```yaml
# 1. Kubernetes 地址: 用下面的命令获取，取第一个
kubectl cluster-info

# 2. 勾选 “禁用 HTTPS 证书检查”

# 3. 凭据选择前面创建的sa-secret然后连接测试，通过了表示可以连接到k8s cluster,即后续的jenkins agent可以部署到k8s上

# 4.Jenkins 地址： 不填就会用jenkins系统配置里面的地址，填的话不要用localhost或者127
#   Jenkins 通道不用填
# 保存即可
```

### 构建集成kubectl和使用root用户的jenkins agent镜像

构建自己的agent镜像
```Dockerfile
# 这个版本应该是随意的，我写这个是前面使用过程中发现我安装的kubernets plugins自动用的这个版本，也可以用最新版吧
FROM jenkins/inbound-agent:3192.v713e3b_039fb_e-1
# 修改为root用户启动，这一步很重要，默认jenkins agent用的是jenkins用户启动，会导致访问不了主机的docker.sock
# 不过也可以配置 kubernets plugins的runAsUser参数， runAsUser: '0', 也表示用root用户启动
USER root

# 这一步kubectl的版本号，需要保持和host一致，可以通过 kubectl version查看版本
ARG KUBECTL_VERSION=1.28.4

# Install kubectl (same version of aws esk)
RUN curl -sLO https://storage.googleapis.com/kubernetes-release/release/v${KUBECTL_VERSION}/bin/linux/amd64/kubectl && \
    mv kubectl /usr/bin/kubectl && \
    chmod +x /usr/bin/kubectl

ENTRYPOINT ["/usr/local/bin/jenkins-agent"]
```

```shell
# 构建镜像并推送
docker build -t localhost/my-rep/agent1:latest

docker push localhost/my-rep/agent1:latest
```

### 编写Dockerfile,Jenkinsfile,k8s配置文件
先在gitee上创建个项目，然后用vue-cli进行下初始化，在新建个deploy目录，在里面创建deployment.yml, Dockerfile和Jenkinsfile放在根目录

Dockerfile
```Dockerfile
# 从docker hub下载nginx镜像，然后复制dist目录下的文件到/usr/share/nginx/html/，因为nginx启动后，主页默认在这个目录
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
```

创建一个secret
```shell
kubectl create secret docker-registry my-docker-secret \
  --docker-username=admin \
  --docker-password=Harbor12345 \
  --docker-server=你的ubuntu ip
```

k8s deployment.yml
```shell
# 创建deployment，名称为nginx，使用镜像为IMAGE_PATH，这是个占位字符，后续在pipline中会用正则把它替换成真正的镜像地址
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: IMAGE_PATH
          ports:
            - containerPort: 80
      imagePullSecrets:
        - name: my-docker-secret # 指定一个前面创建的docker-registry类型的secret,用于拉取harbor镜像
---
# 创建一个service，用于暴露pod的80端口
apiVersion: v1 
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
      nodePort: 80
  type: NodePort
```

Jenkinsfile
```shell

def HARBOR_URL = '172.22.109.126'
// podTemplate用法是kubernetes plugins提供的，也可以用配置式语法，都差不多，kubernetes plugins官网能看到各种用法
// 
podTemplate(volumes: [
        // 挂载主机的docker，然后可以使用docker命令，类似于win上的快捷方式，不过这一步要用前面自己构建的容器，否则默认的启动用户没有访问docker.sock的权限
        hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock'), 
        hostPathVolume(mountPath: '/usr/bin/docker', hostPath: '/usr/bin/docker'),
        hostPathVolume(mountPath: '/home/jenkins/agent/.pnpm-store', hostPath: '/root/.local/share/pnpm/'), // 挂载pnpm的全局存储库，减小pnpm安装包的时间，这一步如果有问题也可以去除
        
    ], 
    // 或者配置 runAsUser: '0'也可以启用root用户
    // 配置容器信息，自己构建容器，加入了kubectl和使用root用户
    containers: [
        containerTemplate(
            name: "jnlp",
            image: "${HARBOR_URL}/my-rep/agent1:latest"
        ),
        containerTemplate(name: "nodejs", image: "node:18-alpine", command: 'sleep', args: '99d') // 要加上sleep命令，否则container启动后自动关闭，没搞懂为啥
    ]) {
    node(POD_LABEL) {
        
        // 拉取代码并打包
        stage("clone") {
           git credentialsId: 'gitee', url: 'https://gitee.com/mazca/test-jenkins.git'
           container("nodejs") {
                sh '''npm install -g pnpm@7 
                    pnpm i
                    pnpm build
                '''
            }
        }

        // 构建镜像
        stage("build") {
            echo "开始构建docker镜像"
            sh "docker build -t ${HARBOR_URL}/my-rep/nginx:${env.BUILD_NUMBER} ."
            echo "构建结束"
        }
        // 上传镜像到私有镜像库
        stage("publish") {
            // 获取harbor的用户命和密码
           withCredentials([usernamePassword(credentialsId: 'harbor', passwordVariable: 'HARBOR_SECRET_PSW', usernameVariable: 'HARBOR_SECRET_USR')]) {
                echo "开始推送镜像"
                sh "docker login -u ${HARBOR_SECRET_USR} -p ${HARBOR_SECRET_PSW} http://${HARBOR_URL}"
                sh "docker push ${HARBOR_URL}/my-rep/nginx:${env.BUILD_NUMBER}"
                echo "推送结束"
            }
        }
        // 进行k8s发布
        stage("deploy") {
            // withKubeConfig由kubernetes cli提供，用于访问k8s cluster
              // 这一步配置内网ip很重要
              // 这个serverUrl不是通过kubectl cluster-info得到的那个，那个是外部访问的ip，而这里因为agent是部署在k8s里面的，和k8s cluster在同一个内部网络，需要用内网地址
              // kubectl get services 得到下面的参数，取kubernetes这个ip加端口
              // kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP        23h
              // nginx-service   NodePort    10.108.227.72   <none>        80:30080/TCP   23h
             withKubeConfig(credentialsId: 'sa-secret', serverUrl: 'https://10.96.0.1:443') {
               // 进入deploy目录，因为我项目的配置文件都放在了deploy目录下
                dir('deploy') {
                    def image_name = "${HARBOR_URL}\\/my-rep\\/nginx:${env.BUILD_NUMBER}"
                    echo "替换image路径"
                    sh "sed -i 's/IMAGE_PATH/${image_name}/g' deployment.yml"
                    echo "部署app"
                    sh "kubectl apply -f deployment.yml"
                    echo "部署结束，可以通过执行minikube service nginx-service得到一个可访问的地址"
                    
                }
            }
        }
    }
}
```

## todo
- 添加nodejs环境
- 介绍了解KubeSphere



