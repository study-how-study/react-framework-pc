import _ from 'lodash'
import axios, { AxiosRequestConfig } from 'axios'
import { udConfigProvider } from '../../'

const httpFactory = {
  create: (config?: AxiosRequestConfig) => {
    const http = axios.create(config)

    http.interceptors.request.use(options => {
      let cfg = _.extend<AxiosRequestConfig>({}, udConfigProvider.http, options)
      cfg.headers = cfg.headers || {}
      if (cfg.url && cfg.url.indexOf('http') == 0) {
        cfg.baseURL = ''
      }
      if (cfg.requestBeforeSetToken) {
        cfg = cfg.requestBeforeSetToken(cfg)
      }
      if (cfg.useRpcWrap) {
        cfg.headers['x-rpc-wrap'] = '1'
      }
      if (cfg.requestBefore) {
        cfg = cfg.requestBefore(cfg)
      }
      return cfg
    }, error => {
      let func = _.get(error, 'config.errorHandler.request', udConfigProvider.http.errorHandler.request)
      if (_.isFunction(func)) {
        func(error)
      }
      return Promise.reject(error)
    })

    http.interceptors.response.use(res => {
      if (res.status === 200) {
        if (res.config.useRpcWrap) {
          if (res.data.code === 200 || res.data.message == 'success') {
            res.originalData = res.data
            res.data = res.data.data
            return Promise.resolve(res)
          } else {
            if (res.config.useBizErrorHandler) {
              if (_.isFunction(res.config.errorHandler![res.data.code])) {
                res.config.errorHandler![res.data.code](res)
              } else {
                res.config.errorTip!({ description: res.data.msg, error: res })
              }
            }
            return Promise.reject(res)
          }
        } else {
          return Promise.resolve(res)
        }
      } else if (res.status === 204) {
        return Promise.resolve(res)
      } else {
        res.config.errorTip!({ description: res.statusText, error: res })
      }
      return Promise.reject(res)
    }, error => {
      if (error.config && error.config.useSysErrorHandler) {
        let handler = error.config.errorHandler.other
        if (error.response) {
          if (_.isFunction(error.config.errorHandler[error.response.status])) {
            handler = error.config.errorHandler[error.response.status]
          }
        }
        handler(error)
      }
      return Promise.reject(error)
    })

    return http
  }
}

/** 
 * ajax 请求对象
 */
const http = httpFactory.create()

export { http, httpFactory }
