# onlyoffice相关

onlyoffice开源的文档展示和编辑组件

## 基本使用
```js
// 1 部署onlyoffice服务端

// 2 引入onlyoffice的js文件，文件地址为第一步服务器的地址
<div id="placeholder"></div>
<script type="text/javascript" src="https://documentserver/web-apps/apps/api/documents/api.js"></script>

// 3 调用初始化接口，并传入参数
const docEditor = new DocsAPI.DocEditor("placeholder", config)

// 公司内部获取下面这个配置由后端接口返回，且里面的一些参数是从nacos上获取的，这意味着可以动态修改配置
const config = {
  document: {
    fileType: "docx",
    key: "Khirz6zTPdfd7",
    title: "Example Document Title.docx",
    // 文件url，onlyoffce服务器会去访问这个url拿到文件，要确保onlyoffice能走通这个url
    url: "https://example.com/url-to-example-document.docx", 
  },
  documentType: "word",
  editorConfig: {
    // 编辑保存时用到的url
    callbackUrl: "https://example.com/url-to-callback.ashx",
  },
}
```