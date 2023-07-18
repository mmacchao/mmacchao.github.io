import axios from 'axios'

axios.interceptors.request.use((config) => {
  config.showLoading = false
  config.abc()
  console.log(config.url)
  return config
})
