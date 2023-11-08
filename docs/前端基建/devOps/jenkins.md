<!--
 * @Author: mazca z867982005@163.com
 * @Date: 2023-11-08 08:22:38
 * @LastEditors: mazca z867982005@163.com
 * @LastEditTime: 2023-11-08 16:45:30
 * @FilePath: \mmacchao.github.io\docs\前端基建\devOps\jenkins.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# jenkins入门

jenkins多用于提交代码后自动构建，并部署代码。它是用java编写的，有很多插件


[实战笔记：Jenkins打造强大的前端自动化工作流](https://juejin.cn/post/6844903591417757710)

 ## 快速入门
 
预期目标：提交代码后自动构建

### jenkins安装和启动
1. 从官网下载war文件，
2. 运行java -jar jenkins.war不过先要下载配置jdk，然后浏览器打开[http://localhost:8080]，看到jenkins控制台可能需要等几分钟
3. 进入浏览器后输入控制台的密码就可以按照步骤新建用户了，进去后可以直接先自动下载默认勾选的一些插件，也可以后续再下载

### 创建任务并主动构建
1. 新建一个任务
2. 指定远程仓库地址
3. 构建环境勾选Node（需要先去插件中心下载node，然后到工具里面配置node具体版本），如果插件中心刷不出来插件，可以在高级设置里面修改插件获取路径为http://mirror.xmission.com/jenkins/updates/update-center.json
4. 构建步骤选PowerShell(需要先去插件中心下载然后到工具里面配置)，并添加pnpm i --no-frozen-lockfile  pnpm build命令
5. 保存后返回执行build now，可以查看控制台，有可能遇到代码下载不了或者命令执行报错问题

### 给任务添加webhook
1. 安装插件Generic Webhook Trigger
2. 修改构建配置，构建触发器那勾选Generic Webhook Trigger，勾选后会弹出提示，有个地址需要注意http://JENKINS_URL/generic-webhook-trigger/invoke，下面token随便填个字符串，一起放到前面路径那，实测码云没有token就得在路径里面添加用户名密码了，token简单些
3. 利用ngrok做一个内网穿透，这样码云才能访问本机部署的jenkins
4. 登录码云，新建仓库，用vue-cli快速初始化一个demo上传，然后进入管理页面 -> webhooks -> 添加地址（就是前面Generic Webhook Trigger里面提升的地址，host用ngrok里面的替换，保证外网能访问） 
5. 提交代码，查看jenkins是否触发了自动构建

## 项目jenkins配置
todo: 写配置文件，避免手动到仓库做各种设置

