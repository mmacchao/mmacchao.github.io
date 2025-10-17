# 如果通过AI获取项目的网关配置信息、鉴权、用户上下文设置逻辑

## 网关和鉴权
项目使用了spring-cloud-gateway，所有业务系统都走网关再路由到业务系统，路由配置写在了网关的nacos线上配置里面。鉴权由网关统一进行

经过拷打cursor，了解了spring-boot的自动配置功能，鉴权相关由基础平台组完成，业务网关只需在pom中依赖基础平台组的包即可（即在classpath加入相关jar包）

只要classpath中引入了jar包，spring-boot会自动发现包的全局过滤器配置，然后过滤器中实现了鉴权的相关逻辑

鉴权逻辑：
- 获取ticket和token
- 调用sso的校验接口
- 返回校验结果

根据ai回复 这里每次都要走sso的ticket和token校验可以优化，token可以自己解析校验，token失效再走sso的校验

全程不需要业务系统参与，业务系统网关唯一要做的就是在pom.xml引入基础平台的包

## 用户上下文

业务系统可以通过getUserInfo获取到上下文，但是并没有发现哪个地方有解析jwt来设置用户信息的地方

继续拷打cursor，结果在基础平台的包中找到了UserInfoInterceptor，里面有解析jwt的逻辑。是通过注册spring mvc拦截器实现每次请求前设置用户信息的逻辑

依然是不需要业务系统写代码 引入基础平台的包即可，启用spring-boot的自动发现配置功能即可