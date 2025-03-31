<!--
 * @Author: mazca z867982005@163.com
 * @Date: 2023-11-06 08:25:52
 * @LastEditors: mazca z867982005@163.com
 * @LastEditTime: 2023-11-06 16:29:57
 * @FilePath: \mmacchao.github.io\docs\前端基建\devOps\k8s.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# k8s入门

解决多主机情况下的容器化集群部署问题，相比Docker-Compose只能单主机多容器部署，k8s是Google开源的多主机容器编排工具

[官网入门教程](https://kubernetes.io/zh-cn/docs/tutorials/hello-minikube/)

[K8S介绍和集群环境搭建](https://juejin.cn/post/7258469240733614141)

[手把手带你玩转k8s-win10上搭建k8s集群](https://juejin.cn/post/6856407118669742094?searchId=202311061018198200ADBF3F5782B9AB7C)

【推荐】：[k8s从入门到放弃(1)：介绍&上手](https://juejin.cn/post/6844903792882761741)

## 环境准备
- docker安装，可以直接安装docker desktop
- kubectl：kubernetes命令行运行工具
- minikube：Minikube 是一种轻量级的 Kubernetes 实现，一个本地版本的k8s，便于单机学习k8s

### minikube安装
```shell
# 通过chocolatey安装minikube，直接下载exe也可以大概35M
choco install minikube
```

### 启动minikube
接下来的minikube start就费劲了，要下载一些东西，可能是k8s镜像，具体要下载些什么我也没搞清楚，而我这边大概花了4个小时总算是ok了，可以进行minikube dashboard了，然后创建Deployment又失败了，镜像下载不下来，把镜像地址直接改成docker的镜像名称总算ok了

**部署一个应用**
```shell
# 官网的--image=registry.k8s.io/e2e-test-images/agnhost:2.39，我本地下载不下来
kubectl create deployment hello-node --image=opsdockerimage/e2e-test-images-agnhost:2.39 -- /agnhost netexec --http-port=8080
```
至此，官网中的你好，minikube总算ok了

**进入pod内部**
```shell
# 进入pod，并打开控制台
kubectl exec -ti <your-pod-name>  -- /bin/sh
```

**外部访问应用**
```shell
# 1. 通过kubectl proxy创建一个代理，适用用debug场景
# 启动代理
kubectl proxy 

# 打开浏览器访问或者用curl访问http://localhost:8001/api/v1/namespaces/default/pods/$Pod_Name:8080/proxy/
curl http://localhost:8001/api/v1/namespaces/default/pods/hello-node-7b78d97f55-l6czv:8080/proxy/

# 2. 创建Service，真正对外暴露服务
# 获取deployment
kubectl get deployment

# 创建service，指定代理内部8080端口，本地访问端口会在service起动后随机生成
kubectl expose deployment hello-node --type=LoadBalancer --port=8080

# 查看service
kubectl get service

# minikube启动一个代理访问service，正常k8s创建了service后就可以直接访问了，但是如果是driver用的docker且是在wsl或者win环境，则不能直接访问，因此minikube提供了service命令
# 详细介绍参考 https://minikube.sigs.k8s.io/docs/handbook/accessing/#using-minikube-service-with-tunnel
minikube service hello-node
```

## k8s部署nginx并能访问
现在集群中创建secret用于访问harbor
```shell
# docker-server不要用localhost或者127.0.0.1，ifconfig 找到eth0对应的ip
kubectl create secret docker-registry harbor-secret-local --docker-server=172.22.109.126 --docker-username=admin --docker-password=Harbor12345
```

创建deployment和service

这一步有个坑，如果你的harbor只启用了http，那这一步image下载不下来，默认会走https去下载，需要配置下minikube [参考](https://minikube.sigs.k8s.io/docs/handbook/registry/#enabling-insecure-registries)
```shell
# minikube配置指定镜像仓库用http去下载
minikube delete # 先删除现有仓库，这一步不能省
minikube start --insecure-registry=172.22.109.126
```

deployment.yml
```shell
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
        app: nginx # 定义key: value，service中也可以配置相同的selector来匹配pod
    spec:
      containers:
      - name: nginx
        image: 172.22.109.126/my-rep/nginx:1.0.0
        ports:
        - containerPort: 80
      imagePullSecrets:
      - name: harbor-secret # 对应前面创建的secret
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80 # 内网端口
    targetPort: 80 # pod暴露的端口
    nodePort: 30080 # 外网端口，service设置为NodePort类型时设置生效，也可以不设置系统自动分配
  type: NodePort
```

## ingress入门

[在 Minikube 环境中使用 NGINX Ingress 控制器配置 Ingress](https://kubernetes.io/zh-cn/docs/tasks/access-application-cluster/ingress-minikube/)

[Kubernetes服務發現之Ingress](https://tw511.com/a/01/9803.html)

ingress用于在service上再抽象一层，避免所有的service都去暴露端口，不便管理

## configMap入门

[K8S ConfigMap使用](https://zhuanlan.zhihu.com/p/109111916)

## todo
学习k8s配置文件



