import _ from 'lodash'
import mitt from 'mitt'
import { uaaApp, IPostMessage, PostMessageTypes } from '../..'

const emitter = mitt()
const webAppInstanceId = new Date().getTime().toString()

const generateWebMsgId = () => {
  return `${uaaApp.appCode}_${new Date().getTime()}_${_.uniqueId('msg_')}`
}

const listener = (e: MessageEvent) => {
  const { type, data } = e.data
  if (type === PostMessageTypes.GlobalMessageBus) {
    const origin = e.origin
    if (origin === uaaApp.centerUrl) {
      let meitKey = data.webMsgId
      if (_.isEmpty(meitKey) && data.data && data.data.topic) {
        meitKey = `${data.data.topic}@${data.data.tag}`
      }
      !_.isEmpty(meitKey) && emitter.emit(meitKey, data)
    } else {
      console.warn(`message origin：${origin}和center url：${uaaApp.centerUrl} 不一致`)
    }
  }
}

const offAndClear = (key: string) => {
  emitter.off(key)
  let item = emitter.all.get(key)
  if (item && item.length == 0) {
    emitter.all.delete(key)
  }
}

const sendMessage = <T = any>(model: IGlobalMessage): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    model.webAppCode = uaaApp.appCode
    model.webAppInstanceId = webAppInstanceId
    model.webMsgId = generateWebMsgId()
    let msg: IPostMessage<IGlobalMessage> = { type: PostMessageTypes.GlobalMessageBus, data: model }
    if (uaaApp.sendMessage(msg)) {
      let timer = setTimeout(() => {
        offAndClear(model.webMsgId)
        reject({ msg: '超时' })
      }, 60 * 1000)
      emitter.on(model.webMsgId, (res: any) => {
        clearTimeout(timer)
        offAndClear(model.webMsgId)
        resolve(res)
      })
    } else {
      reject({ msg: '发送消息失败' })
    }
  })
}

const uaaMsgBus = {
  /**
   * 初始化
   * 一般不需要手动调用，默认会在uaaApp启动成功后内部进行调用
   */
  init: () => {
    window.addEventListener('message', listener)
    window.addEventListener('beforeunload', () => {
      sendMessage({ webAction: 'unmount' })
    })
  },
  /** 
   * 主动发送消息
   */
  send: <T = any>(msg: IMsgBusSendModel) => {
    let data: IMsgBusSendModel = { messageBodyType: 'RAW', sync: false, needConfirm: false, sendModule: 'ONLINE_ONLY', ...msg }
    if (data.messageBodyType == 'RAW' && data.content && typeof data.content !== 'string') {
      data.content = JSON.stringify(data.content)
    }
    return sendMessage<T>({ webAction: 'send', data })
  },
  /**
   * 订阅消息
   */
  on: <T = any>(msg: IMsgBusOnModel, handler: (e: any) => void) => {
    let data: IMsgBusOnModel = { autoCreateTopic: false, consumeType: 'BROADCASTING', ...msg }
    return sendMessage<T>({ webAction: 'on', data }).then(res => {
      emitter.on(`${data.topic}@${data.tag}`, handler)
    })
  },
  /**
   * 取消订阅
   */
  off: <T = any>(msg: IMsgBusOffModel, handler?: (e: any) => void) => {
    let data: IMsgBusOnModel = { autoCreateTopic: false, consumeType: 'BROADCASTING', ...msg }
    let type = `${data.topic}@${data.tag}`
    emitter.off(type, handler)
    let item = emitter.all.get(type)
    if (!item || (item && item.length == 0)) {
      sendMessage<T>({ webAction: 'off', data }).then(() => {
        emitter.all.delete(type)
      })
    }
  }
}

export interface IMsgBusSendModel {
  /**
   * 消息主题
   */
  topic: string
  /**
   * 消息标签
   */
  tag: string
  /**
   * 消息内容类型
   * RAW: 原始数据
   * BASE64: Base64编码
   * GZIP_BASE64: Gzip压缩转Base64编码
   * @default RAW
   */
  messageBodyType?: 'RAW' | 'BASE64' | 'GZIP_BASE64'
  /**
   * 是否为同步消息
   * @default false
   */
  sync?: boolean
  /**
   * 消费后需要确认
   * @default false
   */
  needConfirm?: boolean
  /**
   * 消息发送模式
   * ONLINE_ONLY: 只推送到在线用户
   * ALL: 推送到所有用户,离线或过期用户也会收到
   * @default ONLINE_ONLY
   */
  sendModule?: 'ONLINE_ONLY' | 'ALL'
  /**
   * 消息内容
   */
  content?: any
}

export interface IMsgBusOnModel {
  /**
   * 消息主题
   */
  topic: string
  /**
   * 消息标签
   */
  tag: string
  /**
   * 是否自动创建 topic
   * @default false
   */
  autoCreateTopic?: boolean
  /**
   * 消费模式
   * BROADCASTING: 广播模式
   * CLUSTERING: 集群模式
   * @default BROADCASTING
   */
  consumeType?: 'BROADCASTING' | 'CLUSTERING'
}

export interface IMsgBusOffModel extends IMsgBusOnModel {

}

export interface IGlobalMessage<T = any> {
  /**
   * 子系统代号
   */
  webAppCode?: string
  /**
   * 子系统实例标识
   * 未来可能会出现 一个子系统，在 管理中心打开多个的情况（目前不会）
   */
  webAppInstanceId?: string
  /**
   * 全局消息动作类型
   */
  webAction?: 'send' | 'on' | 'off' | 'unmount'
  /**
   * 消息编号
   * 用于 PostMessage 通讯时，做消息关联。
   */
  webMsgId?: string
  /**
   * 携带的数据
   */
  data?: T
}

export { uaaMsgBus }