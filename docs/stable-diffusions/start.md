# stable diffusions入门
这是一个拥有txt2img,img2img功能的开源程序，后面由某个国外大佬做出了网页客户端webui，然后你就可以进行可视化操作了
再然后又有国内大佬对这个网页端进行了汉化和加入了一些其他便捷功能。学习这个等效于学习软件的使用

## 安装
直接下载B站秋叶大佬的视频中给出的百度盘链接[Stable Diffusion整合包v4.2发布](https://www.bilibili.com/video/BV1iM4y1y7oA/)

下载完成后解压，打开软件即可在浏览器中操作

## 学习途径
[推荐B站的视频学习资源](https://space.bilibili.com/1814756990/channel/collectiondetail?sid=1285674)

## 界面元素介绍
[秋叶软件界面介绍](https://www.bilibili.com/read/cv22661198)
![界面](https://i0.hdslb.com/bfs/article/watermark/58e248f667f8932526774d1835ccf8f3f25d7009.png@1256w_630h_!web-article-pic.avif)

- Stable Diffusion 模型
- 提示词 prompt
- 负面提示词
- 迭代步数
- 采样方法 ：一般模型会推荐使用某个采样方法
- 宽度、高度
- 提示词引导系数
- 随机种子

## 提示词分类
- 人物及主体特征
    - 服饰穿搭 white dress
    - 发型特色 blonde hair, long hair
    - 五官特点 small eyes, big mouth
    - 面部表情 smiling
    - 肢体动作 stretching arms
- 场景特征
    - 室内、室外 indoor / outdoor
    - 大场景 forest、city、street
    - 小细节 tree、bush、white flower
- 环境光照
    - 白天黑夜 day night
    - 特定时段 morning sunset
    - 光环境 sunlight bright dark
    - 天空 blue sky starry sky
- 补充：画幅视角
    - 距离 close-up，distant
    - 人物比例 full body upper body
    - 观察视角 from above，view of back
    - 镜头类型 wide angle，sony A7 Ⅲ
- 画质提示词
- 画风提示词

## 提示词帮助网站
- [勾选提示词](https://ai.dawnmark.cn/) 
- [openart](https://openart.ai/) 偏欧美 抄作业
- [arthub](
- /)  偏二次元和亚洲 抄作业

## 图生图

## 图片放大
默认图片是512*512，设置太大会爆显存，可以先生成一张，再用文生图中的高分辨率修复
重绘幅度尽量控制在0.3-0.5
- 文生图中的高分辨率修复
- 图生图中的直接调大尺寸
- 图生图中的脚本 - SD upscale -> 这个可以把图片放的很大，原理是切块放大然后拼接，这就导致分片后不能很好的应用提示词
- 附加功能 - 存放大图片，重绘幅度为0

## 全身照脸部问题
- 用adetailer扩展插件自动局部重绘
- 手动布局蒙蔽重绘

## 手的问题
control-net处理

## 在线图片生成网站
- [seaArt](https://www.seaart.ai/home)
