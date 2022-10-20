import _ from 'lodash'
import { AxiosPromise } from 'axios'
import { http, IGlobalMessage, IMsgBusOffModel, IMsgBusOnModel, IMsgBusSendModel, PostMessageTypes } from '../../'
import { ICenterMsgBusOptions, ISubscribeMsgModel, IBaseParams, PostMessageHandlers, ICenterMsgBusStatusChange } from './typings'
import { MessageDoctor } from './MessageDetector'
import { RetryWrapper } from './RetryWrapper'
import mitt from 'mitt'

const emitter = mitt()

/**
 * 管理中心全局消息
 * 1、管理中心直接和后端消息中心的收发
 * 2、管理中心做桥接，让子系统通过管理中心和后端消息中心收发
 */
class CenterMsgBus {

  private isready: boolean = false
  private readyList: any[] = []
  private initServiceApi = {
    registerUrl: '/manage/v1/clients/register',
    sendUrl: '/manage/v1/msg/send',
    receiveUrl: '/longPulling/manage/v1/msg/receive',
    updateSubscribeUrl: '/manage/v1/clients/updateSubscribeFilters'
  }
  private options: ICenterMsgBusOptions
  private subscribes: ISubscribeMsgModel[] = []

  private registerRetry = new RetryWrapper({
    retryAction: () => this.register(),
    isError: (res) => {
      let isSuccess: boolean = false
      if (res.originalData.code === 200 && res.originalData.msg == 'success') {
        isSuccess = true
      }
      if (res.status === 204) {
        isSuccess = true
      }
      return !isSuccess
    },
    onDisconnect: () => this.changeStatus({ type: 'register', status: 'error' }),
    onError: (error, retryCount) => this.retryConnect('register', error, retryCount)
  })
  private receiveRetry = new RetryWrapper({
    retryAction: () => this.receive(),
    onReconnect: () => this.changeStatus({ type: 'receive', status: 'success' }),
    onDisconnect: () => this.changeStatus({ type: 'receive', status: 'error' }),
    onError: (error, retryCount) => this.retryConnect('receive', error, retryCount)
  })
  private apis = {
    register: () => {
      return this.registerRetry.pack({
        method: 'GET',
        url: this.baseURL + this.options.serviceUrl.registerUrl,
        params: this.baseParams
      })
    },
    send: (data: any, params: any) => {
      return http.post(this.baseURL + this.options.serviceUrl.sendUrl, data, { params: { ...this.baseParams, ...params } })
    },
    receive: (data: any) => {
      return this.receiveRetry.pack({
        method: 'POST',
        url: this.baseURL + this.options.serviceUrl.receiveUrl,
        data: data,
        params: this.baseParams
      })
    },
    updateSubscribe: (data: any) => {
      return http.post(this.baseURL + this.options.serviceUrl.updateSubscribeUrl, data, { params: this.baseParams })
    }
  }

  private messageDoctor = new MessageDoctor()

  public baseURL = ''
  public baseParams = {} as IBaseParams
  public registered: boolean = false
  public receiving: boolean = false


  /**
   * 初始化，异步。
   * 请调用 reday 或 onStatusChange 来得知是否初始化成功
   */
  public init(options: ICenterMsgBusOptions) {
    options.serviceUrl = options.serviceUrl || this.initServiceApi
    this.options = options
    this.baseURL = options.baseURL
    this.baseParams = {
      clientType: options.clientType,
      instanceId: this.getInstanceId(),
      projectCode: options.projectCode,
      username: _.isFunction(options.username) ? options.username() : options.username
    }
    setTimeout(() => {
      // 消息服务的接口都在技术基础服务下
      this.register()
    }, 4000) // 延迟初始化
  }

  public ready(action?: () => void) {
    if (action) {
      this.readyList.push(action)
    }
    if (this.isready) {
      this.readyList.forEach(n => n())
      this.readyList = []
    }
  }

  public onStatusChange = (hanlder) => {
    emitter.on('status-change', hanlder)
  }
  public onRetry = (hanlder) => {
    emitter.on('retry-connect', hanlder)
  }

  /**
   * 注册消息服务
   */
  private register() {
    return this.apis.register().then(res => {
      window.addEventListener('message', this.postMessageListener.bind(this))
      window.addEventListener('beforeunload', () => {
        this.unmount()
      })
      this.changeStatus({ type: 'register', status: 'success' })
      this.changeStatus({ type: 'receive', status: 'success' })
      this.isready = true
      this.ready()
      this.receive()
    })
  }

  private changeStatus = function (context: ICenterMsgBusStatusChange) {
    if (context.type === 'register') {
      this.registered = context.status === 'success'
    }
    if (context.type === 'receive') {
      this.receiving = context.status === 'success'
    }
    this.options.onStatusChange && this.options.onStatusChange(context)
    emitter.emit('status-change', context)
  }

  private retryConnect = (type: 'register' | 'receive', error, retryCount) => {
    this.options.onRetry && this.options.onRetry(type, error, retryCount)
    emitter.emit('retry-connect', { type, error, retryCount })
  }

  /**
   * 获取实例ID
   */
  private getInstanceId = () => {
    let id = sessionStorage.getItem('msg_register_instanceid')
    if (!id) {
      id = `${this.options.projectCode}-${new Date().getTime()}`
      sessionStorage.setItem('msg_register_instanceid', id)
    }
    return id
  }

  /**
   * PostMessage 接收者
   */
  private postMessageListener(e: any) { // ts 类型报错，实际应该用 MessageEvent<IPostMessage<IGlobalMessage>>
    const { origin, source } = e
    if (!source || !e.data || e.data.type !== PostMessageTypes.GlobalMessageBus || !e.data.data) {
      return
    }
    let data = e.data.data
    if (process.env.REACT_APP_ENV !== 'local' && process.env.REACT_APP_ENV !== 'local2') { // 本地开发时不验证来源
      if (_.isFunction(this.options.checkOrigin) && !this.options.checkOrigin(data.webAppCode, origin)) {
        return console.error('PostMessageListener', '不合法的 origion：' + origin, e)
      }
    }
    if (data.webAction && this.postMessageHandlers[data.webAction]) {
      this.postMessageHandlers[data.webAction](data, source, origin)
    } else {
      console.error('PostMessageListener', '不合法的 webAction：' + data.webAction, e)
    }
  }

  /**
   * PostMessage 消息处理器
   */
  private postMessageHandlers: PostMessageHandlers = {
    /**
     * 发送消息
     */
    send: (globalMessage: IGlobalMessage, source: MessageEventSource, origin: string) => {
      let { topic, tag, ...data } = globalMessage.data as IMsgBusSendModel
      let reply: IGlobalMessage = globalMessage
      let params = {
        CMsgId: globalMessage.webMsgId,
        topic: topic,
        tag: tag
      }
      //TODO: 发送失败后，子系统接收能否分辨出
      this.apis.send(data, params).then(res => {
        reply.data.content = res.data
        this.postMessageReply(reply, source, origin)
      }, (res) => {
        reply.data.content = res.data
        this.postMessageReply(reply, source, origin)
      })
    },
    /**
     * 订阅消息
     */
    on: (globalMessage: IGlobalMessage, source: MessageEventSource, origin: string) => {
      let { webAppCode, webAppInstanceId } = globalMessage
      let data = globalMessage.data as IMsgBusOnModel

      let type = this.subscribes.find(n => n.topic == data.topic && n.tag == data.tag)
      if (type) {
        type.autoCreateTopic = data.autoCreateTopic
        type.consumeType = data.consumeType
        let subscriber = type.subscribers.find(n => n.webAppCode === webAppCode && n.webAppInstanceId && webAppInstanceId)
        if (subscriber) {
          subscriber.source = source
          subscriber.origin = origin
        } else {
          type.subscribers.push({ webAppCode: webAppCode!, webAppInstanceId: webAppInstanceId!, source, origin })
        }
      } else {
        this.subscribes.push({
          ...data,
          subscribers: [{ webAppCode: webAppCode!, webAppInstanceId: webAppInstanceId!, source, origin }]
        })
      }
      this.updateSubscribe().then(res => {
        globalMessage.data.content = res.data
        this.postMessageReply(globalMessage, source, origin)
      }, res => {
        globalMessage.data.content = res.data
        this.postMessageReply(globalMessage, source, origin)
      })
    },
    /**
     * 取消订阅
     */
    off: (globalMessage: IGlobalMessage, source: MessageEventSource, origin: string) => {
      let { webAppCode, webAppInstanceId } = globalMessage
      let data = globalMessage.data as IMsgBusOffModel
      let reply = globalMessage
      reply.data.content = true
      let type = this.subscribes.find(n => n.topic == data.topic && n.tag == data.tag)
      if (type) {
        _.remove(type.subscribers, n => n.webAppCode == webAppCode && n.webAppInstanceId == webAppInstanceId)
        if (type.subscribers.length == 0) {
          _.remove(this.subscribes, type)
          this.updateSubscribe().finally(() => {
            this.postMessageReply(reply, source, origin)
          })
          return
        }
      }
      this.postMessageReply(reply, source, origin)
    },
    /**
     * 子系统卸载
     */
    unmount: (globalMessage: IGlobalMessage, source: MessageEventSource, origin: string) => {
      let { webAppCode, webAppInstanceId } = globalMessage
      // TODO: 确定是否需要用以下的方式进行更新，还是每次都调用接口
      let oldLength = this.subscribes.length
      this.subscribes.forEach(type => {
        _.remove(type.subscribers, n => n.webAppCode === webAppCode && n.webAppInstanceId && webAppInstanceId)
      })
      _.remove(this.subscribes, type => type.subscribers.length == 0)
      if (oldLength != this.subscribes.length) {
        this.updateSubscribe()
      }
      globalMessage.data = true
      this.postMessageReply(globalMessage, source, origin)
    }
  }

  /**
   * PostMessage 回复消息
   */
  private postMessageReply(data: IGlobalMessage, source: MessageEventSource, origin: string) {
    try {
      //ts类型原因
      //@ts-ignore
      source.postMessage({ type: PostMessageTypes.GlobalMessageBus, data }, { targetOrigin: origin })
      return true
    } catch (e) {
      console.error('PostMessageReply Error', e)
      return false
    }
  }

  /**
   * 更新订阅信息
   */
  private updateSubscribe(): AxiosPromise<any> {
    let data = this.subscribes.map(n => {
      return { topic: n.topic, tag: n.tag, autoCreateTopic: n.autoCreateTopic, consumeType: n.consumeType }
    })
    return this.apis.updateSubscribe(data)
  }

  /**
   * 通过长轮询接收消息
   */
  private receive() {
    let data = { maxMessagePerPull: 5 }
    this.apis.receive(data).then(res => {
      let errorIds: string[] = []
      const hasRecord = res.status === 200 && res.data && _.isArray(res.data.records) && res.data.records.length > 0
      if (hasRecord && !_.isEmpty(this.subscribes)) {
        const unconfirmedInfo = res.data.unconfirmedCount?.topicTagUnconfirmedCount
        for (const msg of res.data.records) {
          if (this.messageDoctor.diagnosis(msg.smsgId)) {
            errorIds.push(msg.smsgId)
          } else {
            this.handleRecieveLater(msg, unconfirmedInfo)
          }
        }
      }
      if (errorIds.length > 0) {
        this.messageDoctor.cure(errorIds).then(this.receive.bind(this))
      } else {
        this.receive()
      }
    }, (res) => {
      console.error('Receive Error', res)
    })
  }

  /**
  * 接收消息后 PostMessage 执行 handler
  */
  private handleRecieveLater(msg, unconfirmedInfo) {
    let type = this.subscribes.find(n => n.topic == msg.topic && n.tag == msg.tag)
    if (type && type.subscribers && type.subscribers.length > 0) {
      if (msg.content && typeof msg.content === 'string') {
        try { msg.content = JSON.parse(msg.content) } catch (err) { console.error(err) }
      }
      if (unconfirmedInfo && unconfirmedInfo[msg.topic] && msg.topic) {
        msg.unconfirmedCount = unconfirmedInfo[msg.topic][msg.tag]
      }
      for (const subscribe of type.subscribers) {
        if (subscribe.webAppCode === this.baseParams.projectCode) {
          subscribe.handler && subscribe.handler(msg)
          break
        }
        if (subscribe.source && subscribe.origin) {
          let reply: IGlobalMessage = {
            webAppCode: subscribe.webAppCode,
            webAppInstanceId: subscribe.webAppInstanceId,
            data: msg
          }
          this.postMessageReply(reply, subscribe.source, subscribe.origin)
        }
      }
    }
  }

  public send(msg: IMsgBusSendModel) {
    let { topic, tag, ...data } = { messageBodyType: 'RAW', sync: false, needConfirm: false, sendModule: 'ONLINE_ONLY', ...msg }
    let params = {
      topic: topic,
      tag: tag
    }
    return this.apis.send(data, params)
  }

  public on(msg: IMsgBusOnModel, handler: (e: any) => void) {
    let data: IMsgBusOnModel = { autoCreateTopic: false, consumeType: 'BROADCASTING', ...msg }
    let { projectCode: webAppCode, instanceId: webAppInstanceId } = this.baseParams
    let type = this.subscribes.find(n => n.topic == data.topic && n.tag == data.tag)
    if (type) {
      type.autoCreateTopic = data.autoCreateTopic
      type.consumeType = data.consumeType
      let subscriber = type.subscribers.find(n => n.webAppCode === webAppCode && n.webAppInstanceId && webAppInstanceId && n.handler === handler)
      if (!subscriber) {
        type.subscribers.push({ webAppCode, webAppInstanceId, handler })
      }
    } else {
      this.subscribes.push({ ...data, subscribers: [{ webAppCode, webAppInstanceId, handler }] })
    }
    return this.updateSubscribe()
  }

  public off(msg: IMsgBusOffModel, handler?: (e: any) => void) {
    let data: IMsgBusOffModel = { autoCreateTopic: false, consumeType: 'BROADCASTING', ...msg }
    let { projectCode: webAppCode, instanceId: webAppInstanceId } = this.baseParams
    let type = this.subscribes.find(n => n.topic == data.topic && n.tag == data.tag)
    if (type) {
      if (handler) {
        _.remove(type.subscribers, n => n.webAppCode == webAppCode && n.webAppInstanceId == webAppInstanceId && n.handler == handler)
      } else {
        _.remove(type.subscribers, n => n.webAppCode == webAppCode && n.webAppInstanceId == webAppInstanceId)
      }
      if (type.subscribers.length == 0) {
        _.remove(this.subscribes, type)
        this.updateSubscribe()
      }
    }
  }

  public unmount() {
    let { projectCode: webAppCode, instanceId: webAppInstanceId } = this.baseParams
    // TODO: 确定是否需要用以下的方式进行更新，还是每次都调用接口
    let oldLength = this.subscribes.length
    this.subscribes.forEach(type => {
      _.remove(type.subscribers, n => n.webAppCode === webAppCode && n.webAppInstanceId && webAppInstanceId)
    })
    _.remove(this.subscribes, type => type.subscribers.length == 0)
    if (oldLength != this.subscribes.length) {
      this.updateSubscribe()
    }
  }

}

const centerMsgBus = new CenterMsgBus()

export { centerMsgBus }