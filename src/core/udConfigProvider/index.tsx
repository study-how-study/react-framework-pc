import _ from 'lodash'
import React from 'react'
import { notification, Button } from 'antd'
import { AxiosRequestConfig } from 'axios'
import { ITableWatermark, IAxiosErrorTip } from '../../'
import { uaaApp } from '../uaaApp/'

interface IUdConfigProvider {
  /** 请求相关 */
  http: {
    /** 使用 Rpc 包装格式 */
    useRpcWrap: boolean
    /** 使用业务错误处理器 */
    useBizErrorHandler: boolean
    /** 使用系统错误处理器 */
    useSysErrorHandler: boolean
    /** 错误提示方法 */
    errorTip: (tip: IAxiosErrorTip) => void
    /** 设置token到请求中 */
    requestBeforeSetToken: (config: AxiosRequestConfig) => AxiosRequestConfig
    /** 请求发出前 */
    requestBefore: (config: AxiosRequestConfig) => AxiosRequestConfig
    /** 失败时的处理函数 */
    errorHandler: {
      [key in (string | number)]: ((error: any) => void)
    }
  },
  /** 授权相关 */
  auth: {
    canUse?: (key: string) => boolean
  },
  api: {
    /** 请求分页数据时，是否把条件放到 conditions 字段中 */
    useConditionsField: boolean
  },
  ui: {
    getPageContainer: () => Window | HTMLElement,
    table: {
      watermark: ITableWatermark
    }
  }
}

/** 配置服务 */
let udConfigProvider: IUdConfigProvider = {

  http: {
    useRpcWrap: true,
    useBizErrorHandler: true,
    useSysErrorHandler: true,

    errorTip: (tip: IAxiosErrorTip) => {
      let options = _.extend<IAxiosErrorTip>({}, { message: '系统提示' }, tip)
      let traceId = _.get(options.error, 'headers.x-b3-traceid')
      let bizErrorCode = _.get(options.error, 'data.code')
      if (bizErrorCode) {
        let bizErrorCodeNode = <div className='ud-http-error-tip'><span>异常码：</span>{bizErrorCode}</div>
        if (options.description) {
          options.description = <>{options.description}{bizErrorCodeNode}</>
        } else {
          options.description = bizErrorCodeNode
        }
      }
      if (traceId) {
        let traceNode = <div className="ud-http-error-tip"><span>跟踪码：</span>{traceId}</div>
        options.description = <>{options.description}{traceNode}</>
      }

      notification.error(options as any)
    },
    requestBeforeSetToken: (config: AxiosRequestConfig): AxiosRequestConfig => {
      config.headers = config.headers || {}
      if (!config.headers['Authorization']) {
        let token = uaaApp.getToken()
        if (token) {
          config.headers['Authorization'] = token.accessToken
        }
      }
      return config
    },
    requestBefore: (config: AxiosRequestConfig): AxiosRequestConfig => { return config },

    /** 失败时的处理函数 */
    errorHandler: {
      request: (error) => {
        let func = _.get(error, 'config.errorTip', udConfigProvider.http.errorTip)
        func({ message: '请求失败', description: error })
      },
      400: (error: any) => {
        error.config.errorTip({
          message: '错误的请求',
          description: _.get(error, 'data.msg', error.statusText)
        })
      },
      401: (error: any) => {
        notification.error({
          message: '登录超时',
          description: <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ flex: '1' }}>请点击退出按钮后重新登录。</span>
            <Button type="primary" style={{ fontSize: '12px' }} size="small" onClick={() => {
              uaaApp.signOut()
            }}>退出</Button>
          </div>
        })
      },
      403: (error: any) => {
        error.config.errorTip({ message: '没有权限', description: '你的账号没有该操作的权限' })
      },
      404: (error: any) => {
        error.config.errorTip({ description: '请求的资源不存在' })
      },
      500: (error: any) => {
        let msg = ''
        if (error.status == 200) {
          msg = _.get(error, 'data.msg', '系统错误，请稍后重试！')
        } else {
          msg = _.get(error, 'response.data.data.msg', _.get(error, 'response.data.msg', '系统错误，请稍后重试！'))
        }
        error.config.errorTip({ description: msg })
      },
      other: (error: any) => {
        let msg = '系统错误，请稍后重试！'
        if (error.message == 'Network Error') {
          msg = '网络异常，请检查你的网络。'
        } else {
          if (process.env.NODE_ENV == 'development') {
            msg = error.message
          }
        }
        error.config.errorTip({ description: msg })
      }
    }
  },
  auth: {
    canUse: uaaApp.canUse
  },
  api: {
    useConditionsField: true
  },
  ui: {
    getPageContainer: () => {
      return document.querySelector<HTMLElement>('.ud-main') || window
    },
    table: {
      watermark: {
        enable: true,
        color: '#000',
        opacity: 0.06,
        fontSize: 18,
        angle: -20,
        text: () => {
          let info = uaaApp.getSysInfo()
          return info ? info.profile.jobNumber : ''
        },
        width: 120,
        height: 60,
        x: 10,
        y: 25
      }
    }
  }
}

export { udConfigProvider }
