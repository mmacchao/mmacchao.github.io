# k8s配置文件解析

## volume执行逻辑

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${APP_NAME}
  namespace: ${METADATA_NAMESPACE}
spec:
  strategy:
    type: RollingUpdate
  selector:
    matchLabels:
      app: ${APP_NAME}
  replicas: 1
  template:
    metadata:
      labels:
        app: ${APP_NAME}
    spec:
      containers:
        - name: ${APP_NAME}
          image: ${FULL_IMAGE}
          ports:
            - containerPort: 80
          resources:
            limits:
              cpu: ${LIMIT_CPU}
              memory: ${LIMIT_MEMORY}
            requests:
              cpu: 100m
              memory: 200Mi
          volumeMounts:
            - mountPath: /var/log/nginx
              name: nginxlog
            - mountPath: /etc/nginx/conf.d/nginx.conf
              name: web-nginx-config
              subPath: nginx.conf
            - mountPath: /etc/nginx/conf.d/headers.conf
              name: web-nginx-config
              subPath: headers.conf

      volumes:
        - name: nginxlog
          emptyDir: {}
        - name: web-nginx-config
          configMap:
            name: ${APP_NAME}-nginx-config
            items:
              - key: nginx.conf
                path: nginx.conf
              - key: headers.conf
                path: headers.conf

```
**volumes.configMap.items的字段解析**
items[0].key: nginx.conf → 从 ConfigMap 提取 nginx.conf
items[0].path: nginx.conf → volume 中文件名为 nginx.conf
volumeMounts[1].subPath: nginx.conf → 挂载 volume 中的 nginx.conf
volumeMounts[1].mountPath: /etc/nginx/conf.d/nginx.conf → 容器内最终路径