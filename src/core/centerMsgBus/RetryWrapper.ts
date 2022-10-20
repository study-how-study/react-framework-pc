import { AxiosRequestConfig } from 'axios'
import { http } from '..'

/**
 * 重试机制包装器
 */
class RetryWrapper {

  public retryCount = 0
  public options: IRetryWrapperOptions

  constructor(options: IRetryWrapperOptions) {
    this.options = {
      schemes: [
        [10, 5 * 1000],
        [60, 60 * 1000],
        [90, 90 * 1000]
      ],
      ...options
    }
  }

  public pack(requestConfig: AxiosRequestConfig) {

    requestConfig.useBizErrorHandler = false
    requestConfig.useSysErrorHandler = false

    let promise = http.request(requestConfig)

    let errorHandler = (error: any) => {
      if (this.retryCount === 0) {
        this.options.onDisconnect && this.options.onDisconnect(error)
      }
      this.retryCount++
      this.options.onError && this.options.onError(error, this.retryCount)

      let scheme = this.options.schemes.find(n => this.retryCount <= n[0])
      let delay = scheme ? scheme[1] : this.options.schemes[this.options.schemes.length - 1][1]
      setTimeout(() => this.options.retryAction(), delay)
    }

    promise.then(res => {
      if (this.options.isError && this.options.isError(res)) {
        errorHandler(res)
      } else {
        if (this.retryCount > 0) {
          this.retryCount = 0
          this.options.onReconnect && this.options.onReconnect()
        }
      }
    }, errorHandler)
    return promise
  }

}

export interface IRetryWrapperOptions {
  /**
   * 需要重试的方法
   */
  retryAction: () => void
  /**
   * 重试时间方案
   * [10, 5 * 1000]，表示 小于等于 10 次，每次等待 5 秒钟。
   */
  schemes?: [number, number][]
  /**
   * 正常返回数据，但需要根据数据判断是不是出错的情况下使用
   */
  isError?: (res: any) => boolean
  /**
   * 重新连接后
   */
  onReconnect?: () => void
  /**
   * 断开连接后
   */
  onDisconnect?: (errory: any) => void
  /**
   * 发生错误后
   */
  onError?: (error: any, retryCount: number) => void
}

export { RetryWrapper }