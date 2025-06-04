# oauth 2.0简介

参考阮一峰的文章:

[OAuth 2.0 的一个简单解释](https://www.ruanyifeng.com/blog/2019/04/oauth_design.html)

[OAuth 2.0 的四种方式](https://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html)

[GitHub OAuth 第三方登录示例教程](https://www.ruanyifeng.com/blog/2019/04/github-oauth.html)

用于给第三方授权，比如小程序要访问微信用户头像等信息，需要先被授权，或者第三方接入github登录等

## 授权方式
- 授权码
- 隐藏式 - 跳过授权码
- 密码式
- 凭证式

## 授权码
最常用的就是授权码

![授权码.jpg](img/%E6%8E%88%E6%9D%83%E7%A0%81.jpg)

授权码形式，需要先到B网站那登记注册，获取clientId和clientSecret
然后前端根据clientId去B网站获取授权码code，这一步会提示用户登录，获取到的code类似于加密后的密码，后端再根据clientId，clientSecret和code去获取token，后端这一步类似于双重保障，既有code(类似于密码)又有clientSecret

[github登记注册网页](https://github.com/settings/applications/new)

**疑问：**

1. 为什么需要前端去获取code，后端把这两步一起做了可以吗
   - 因为获取code需要用户输入用户名和密码，后端做不了
   

2. 为什么需要clientId，这个是暴露在前端的，似乎并没有什么安全作用
   - 可以标记用户的唯一性


3. 获取token也交由前端处理可以吗
   - 获取token需要用clientSecret，这个相当于密钥，不能暴露给用户，因此需要放到后端处理

## 其他

隐藏授权码形式，前端直接发请求
![隐藏式.jpg](img/%E9%9A%90%E8%97%8F%E5%BC%8F.jpg)