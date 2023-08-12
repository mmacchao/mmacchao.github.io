# 浏览器缓存
http缓存分为强缓存，协商缓存，启发式缓存

**参考：**

[前端HTTP缓存你真的了解吗？强缓存？协商缓存？启发式缓存？](https://juejin.cn/post/7264597522030329910)

[中高级前端工程师都需要熟悉的技能--前端缓存](https://juejin.cn/post/7127194919235485733?searchId=20230812142201BC2BE92568F2609E2CBD)

[前端缓存最佳实践](https://juejin.cn/post/6844903737538920462?searchId=202308121418561A92224BBAF70A9DF0EC)

## 强缓存
时间没过期，直接用缓存
- expires 

  http1.0定义的，设置一个固定时间，与本地时间对比，过期后就失效，基本不再使用
  缺点：与本地时间对比，本地时间可能不准
- cache-control

  http1.1定义的，有6个值，优先级高于expires，可以同时存在多个值
  - max-age
    缓存存活时间，以s为单位
  - s-maxage
    代理服务器上的缓存存活时间
  - public
    可以同时在代理服务器和浏览器缓存
  - private
    只能在浏览器缓存
  - no-cache
    不走强缓存，直接进行协商缓存
  - no-store
    强缓存，协商缓存都不走，直接发请求

## 协商缓存
要发一个请求给后台，带上ETag或者last-modified的值，如果没变返回304，然后继续取缓存
- last-modified
  response中返回一个文件修改时间
- if-modified-since
  request中把last-modified的值放在if-modified-since中，如果返回304，表示继续用缓存
  缺点：改了文件名再改回，也会使缓存失效，或者在1s内完成文件修改，缓存却还有效，因为last-modified以秒为单位
- ETag 
  http1.1中定义的，response中的字段，文件hash，优先级高于last-modified
- if-none-match
  request中的字段，值是response中得到的ETag值，服务器会计算文件hash然后与传过来的对比
  缺点：etag的计算会消耗服务器性能，可以看看express中etag的计算方式

## 启发式缓存
如果没有Expires和Cache-Control字段，浏览器会自己设置一个强缓存时间

缓存有效期计算公式：**(date - last-modified ) * 10%**，取响应报头中 date 与 last-modified 值之差的百分之十作为缓存时间
  