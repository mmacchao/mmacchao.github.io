// 必须有个导入操作，否则默认是覆盖了axios的配置
// 有了这个导入后就是合并配置了
// import 'axios'
export {}
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    showLoading: boolean,
    abc(): void,
  }
}
