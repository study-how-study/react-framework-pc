import { IGlobalMessage } from '..'

export interface IBaseParams {
  clientType: string
  instanceId: string
  projectCode: string
  username: string
}

export interface ICenterMsgBusOptions {
  /** 消息中心，后端接口地址前缀 */
  baseURL: string
  /** 消息中心，客户端类型，通常值为：ManageUser */
  clientType: string
  /** 消息中心，项目代号，通常值为：uaa */
  projectCode: string
  /** 用户名 */
  username: string | (() => string)
  /** 
   * 检查 PostMessage Origin 是否合法
   * 不传表示不做检查
   */
  checkOrigin?: (appCode: string, origin: string) => boolean
  /**
   * 消息中心，后端接口地址
   * 不传则使用内置的地址。
   */
  serviceUrl?: {
    /** 注册接口 */
    registerUrl: string
    /** 发送接口 */
    sendUrl: string
    /** 接收接口 */
    receiveUrl: string
    /** 更新订阅接口 */
    updateSubscribeUrl: string
  }
  /**
   * 状态发生改变
   */
  onStatusChange?: (data: ICenterMsgBusStatusChange) => void
  /**
   * 发生重试
   */
  onRetry?: (category: IRetryCategory, error: any, retryCount: number) => void
}

/** 重试分类 */
export type IRetryCategory = 'register' | 'receive' | 'updateSubscribe'

export type PostMessageHandlers = {
  [key: string]: (globalMessage: IGlobalMessage, source: MessageEventSource, origin: string) => void
}

export interface ICenterMsgBusStatusChange {
  type: 'register' | 'receive' | 'updateSubscribe',
  status: 'success' | 'error'
  msg?: string
}

export interface ISubscribeMsgModel {
  topic: string
  tag: string
  autoCreateTopic?: boolean
  consumeType?: 'BROADCASTING' | 'CLUSTERING'
  subscribers: ISubscriber[]
}

export interface ISubscriber {
  // 中心订阅标识
  webAppCode: string
  webAppInstanceId: string
  source?: MessageEventSource
  origin?: string
  handler?: (e: any) => void
}
