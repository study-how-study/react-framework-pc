/// <reference types="node" />
import 'axios'
import { IAxiosErrorTip, IRes } from '.'

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * app运行所在的环境
     * local：开发人员自己的电脑
     * dev：开发团队用的测试服务器
     * test：测试团队用的测试服务器
     * prod：正式运行服务器
     */
    REACT_APP_ENV: 'local' | 'local2' | 'dev' | 'test' | 'test2' | 'prod'
    NODE_ENV: 'development' | 'production' | 'test'
    PUBLIC_URL: string
  }
}

declare module 'axios' {

  export interface AxiosRequestConfig {
    useRpcWrap?: boolean
    useBizErrorHandler?: boolean
    useSysErrorHandler?: boolean

    errorTip?: (tip: IAxiosErrorTip) => void

    requestBeforeSetToken?: (config: AxiosRequestConfig) => AxiosRequestConfig
    requestBefore?: (config: AxiosRequestConfig) => AxiosRequestConfig

    errorHandler?: {
      [key in any]: any
    }

  }

  export interface AxiosResponse<T = any> {
    data: T
    originalData: IRes<T>
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request?: any
  }

}

declare global {
  interface Window { ResizeObserver: any }
}