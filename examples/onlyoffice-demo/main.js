import { createJWT } from './jwt.js'
import { config } from './config.js'
new Vue({
  el: '#app',
  data() {
    return {
      connector: null,
      apiUrl: config.result.api,
      officeConfig: config.result.config,
      // 编辑器配置
      editorConfig: {
        // 文档模板URL（示例）
        documentUrl: 'https://example.com/blank.docx',
        // OnlyOffice文档服务地址（配置为不同源）
        docServiceUrl: 'http://localhost',
        documentType: 'text', // text, spreadsheet, presentation
        key: 'doc-' + Date.now(), // 唯一文档标识符
      },

      // 变量配置
      variables: [
        { name: 'client_name', label: '客户名称', description: '文档接收方名称' },
        { name: 'date', label: '当前日期', description: '文档创建日期（YYYY-MM-DD）' },
        { name: 'contract_id', label: '合同编号', description: '自动生成的合同ID' },
        { name: 'total_amount', label: '总金额', description: '合同总金额（含税）' },
        { name: 'company', label: '公司名称', description: '您的公司全称' },
        { name: 'signature', label: '电子签名', description: '电子签名占位符' },
      ],

      // 状态变量
      editorStatus: 'waiting', // waiting, loading, ready, error
      isDragging: false,
      currentVariable: null,
      currentOrigin: window.location.origin,
      showMessage: false,
      messageText: '',
      messageTimeout: null,
    }
  },
  computed: {
    // 编辑器完整URL
    editorUrl() {
      const config = this.editorConfig
      const params = {
        file: config.documentUrl,
        docServiceUrl: config.docServiceUrl,
        documentType: config.documentType,
        key: config.key,
      }

      // 实际使用中需要构建更复杂的URL
      return `${config.docServiceUrl}/web-apps/apps/api/documents/api.js?${this.encodeParams(
        params,
      )}`
    },

    // 编辑器状态文本
    editorStatusText() {
      const statusMap = {
        waiting: '等待初始化编辑器',
        loading: '编辑器加载中',
        ready: '已准备就绪 - 可拖拽变量',
        error: '连接错误 - 点击重新连接',
      }
      return statusMap[this.editorStatus] || this.editorStatus
    },
  },
  mounted() {
    this.initEditor()
    window.addEventListener('message', this.handleMessage)
    window.addEventListener('dragover', this.globalDragOver)
    window.addEventListener('drop', this.globalDrop)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleMessage)
    window.removeEventListener('dragover', this.globalDragOver)
    window.removeEventListener('drop', this.globalDrop)
  },
  methods: {
    // 初始化编辑器
    async initEditor() {
      this.editorStatus = 'loading'
      this.showMessage = false

      const config = {
        document: {
          fileType: 'docx',
          key: '',
          title: 'test.docx',
          url: 'http://10.99.241.226:3001/test.docx',
        },

        documentType: 'word',
        editorConfig: {
          lang: 'zh',
          mode: 'edit',
          // callbackUrl: "https://example.com/url-to-callback.ashx",
        },
      }
      // config.token = await createJWT(config, "IXIpaSaQctikEuI61euCjUSSE6O1nO");
      const docEditor = new DocsAPI.DocEditor('onlyoffice', this.officeConfig)
      // this.connector = docEditor.createConnector()

      // 在实际应用中，需要在这里加载OnlyOffice JS API并初始化
      setTimeout(() => {
        // 模拟加载成功
        if (Math.random() > 0.2) {
          // 80%成功率模拟
          this.editorStatus = 'ready'
          this.showStatus('编辑器已成功加载')
        } else {
          this.editorStatus = 'error'
          this.showStatus('编辑器加载失败，请重试', true)
        }
      }, 2000)
    },

    // 处理iframe加载
    onFrameLoaded() {
      console.log('编辑器框架加载完成')

      // 跨域消息发送到iframe（仅示例）
      const frame = this.$refs.editorFrame
      const message = {
        type: 'init',
        config: this.editorConfig,
      }

      // 实际应用中需要在这里初始化OnlyOffice编辑器
      setTimeout(() => {
        frame.contentWindow.postMessage(JSON.stringify(message), this.editorConfig.docServiceUrl)
      }, 500)
    },

    // 处理跨域消息
    handleMessage(event) {
      if (event.origin !== this.editorConfig.docServiceUrl) return

      try {
        const message = JSON.parse(event.data)
        console.log('收到消息:', message)

        if (message.type === 'editorReady') {
          this.editorStatus = 'ready'
          this.showStatus('编辑器已准备就绪')
        } else if (message.type === 'cursorPosition') {
          // 可以更新光标位置状态
        }
      } catch (e) {
        console.error('解析消息失败:', e)
      }
    },

    // 开始拖拽变量
    startDrag(event, variable) {
      this.isDragging = true
      this.currentVariable = variable
      event.dataTransfer.setData('text/plain', variable.name)
      event.dataTransfer.setData('application/json', JSON.stringify(variable))
    },

    // 结束拖拽
    endDrag() {
      this.isDragging = false
      this.currentVariable = null
    },

    // 全局拖拽覆盖事件（解决浏览器默认行为）
    globalDragOver(e) {
      if (this.isDragging) {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      }
    },

    // 全局放置事件处理
    globalDrop(e) {
      if (this.isDragging && this.editorStatus === 'ready') {
        e.preventDefault()

        try {
          // 获取变量数据
          const data = JSON.parse(e.dataTransfer.getData('application/json'))
          this.insertVariable(data)
        } catch (error) {
          console.error('变量插入失败:', error)
          this.showStatus('变量插入失败: ' + error.message, true)
        }
      }
      this.isDragging = false
    },

    // 跨域插入变量到OnlyOffice
    insertVariable(variable) {
      if (!this.$refs.editorFrame) {
        this.showStatus('编辑器未准备好', true)
        return
      }

      // 在实际应用中，这里会通过postMessage发送命令
      // const message = {
      //   type: 'insertVariable',
      //   name: variable.name,
      //   value: `\${${variable.name}}`,
      //   position: null // 实际应用中这里会发送光标位置
      // };

      // const message = {
      //   command: 'insertText', // 命令名称
      //   text: '${var}' // 要插入的文本
      // };
      //
      // const frame = this.$refs.editorFrame.querySelector('iframe');
      // frame.contentWindow.postMessage(JSON.stringify(message), this.editorConfig.docServiceUrl);

      this.connector.executeMethod('PasteText', ['你好啊'])

      this.showStatus(`已插入变量: \${${variable.name}}`)
    },

    // URL参数编码（简化）
    encodeParams(params) {
      return Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&')
    },

    // 显示状态消息
    showStatus(text, isError = false) {
      this.messageText = text
      this.showMessage = true

      if (this.messageTimeout) clearTimeout(this.messageTimeout)
      this.messageTimeout = setTimeout(() => {
        this.showMessage = false
      }, 3000)
    },
  },
})
