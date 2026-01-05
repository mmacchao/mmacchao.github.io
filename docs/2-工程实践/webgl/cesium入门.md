# cesium入门

cesium可以渲染3D地球，基于webgl技术实现，webgl在win11环境下是先转为opengl的api再转为调用directx

- ctrl + 左键：以屏幕中间的点旋转整个地球
- 左键：以地球自身中心旋转球体，类似自转
- 右键拖动、滚轮：都是缩放

地球的渲染其实是很多小图片拼接而成，图层默认用的微软地图，这个需要魔法才能加载

国内可以使用天地图提供的资源 http://lbs.tianditu.gov.cn/server/MapService.html  页面最底部有使用方式