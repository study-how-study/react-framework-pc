import { IUdMessageInfo, IUdMessageServiceConfig, IUdMessageServiceEmitType, IUdMessageServiceUserInfo, IUdMessageSubscribeConfig } from "./typings"
import { Client, IMessage, IPublishParams, StompConfig } from "@stomp/stompjs";
import SockJS from 'sockjs-client'
import { EventEmitter } from 'eventemitter3'
import _ from "lodash";

class UdMessageService {
  private userInfo: IUdMessageServiceUserInfo | null = null
  private headers: { [key: string]: any } = {}
  private stompClientConfig: StompConfig = {}
  private clientGlobalSessionId: string = ''
  private emitter = new EventEmitter<IUdMessageServiceEmitType>()

  public client: Client = null
  public defaultSubscribeConfig: IUdMessageSubscribeConfig = {
    receiveOfflineMessage: true
  }

  private maxReConnectTimes: number = 100
  private connectTimes: number = 0
  constructor(config: IUdMessageServiceConfig) {
    if (config.maxReConnectTimes) {
      this.maxReConnectTimes = config.maxReConnectTimes
    }
    this.userInfo = config.userInfo
    this.headers = {
      authentication: _.isFunction(config.token) ? config.token() : config.token,
      userInfo: JSON.stringify(this.userInfo)
    }
    this.stompClientConfig = {
      connectHeaders: this.headers,
      reconnectDelay: config.reconnectDelay,
      heartbeatIncoming: config.heartbeatIncoming,
      heartbeatOutgoing: config.heartbeatOutgoing,
      onConnect: (frame) => this.onConnected(frame),
      webSocketFactory: () => SockJS(config.gatewayUrl + "/websocket"),
      onStompError: (frame) => { this.onDisconnect(frame) },
      onWebSocketClose: (frame) => this.onDisconnect(frame),
      onDisconnect: (frame) => this.onDisconnect(frame),
      beforeConnect: () => {
        // 增加链接次数
        this.connectTimes += 1
        if (this.connectTimes > this.maxReConnectTimes) {
          this.emit('overMaxReconnectTimes', '连接超时')
          return Promise.reject(`消息服务重连次数已超过最大次数${this.maxReConnectTimes}, 连接超时`)
        }
        if (this.client && _.isFunction(config.token)) {
          const newToken = config.token()
          if (!this.headers.token || (this.headers.token && newToken !== this.headers.authentication)) {
            this.client.configure({ connectHeaders: { ...this.headers, authentication: newToken } })
          }
        }
      }
    }
  }
  private onDisconnect = (frame) => {
    this.emit('disConnected', frame)
  }
  private onConnected = (frame) => {
    this.connectTimes = 0  // 重置链接次数
    this.clientGlobalSessionId = frame.headers['user-name']
    this.emit('connected', frame)
  }
  /**
    * 请求接收脱机离线消息
    */
  public getOfflineMessages = () => {
    this.client.publish({
      destination: '/app/requestReceiveOfflineMessage',
      headers: this.headers,
      body: JSON.stringify({ pageSize: 100, page: 1 })
    });
  }


  public connect = () => {
    if (!this.client) {
      this.client = new Client(this.stompClientConfig);
    }
    this.connectTimes = 0
    this.client.activate()
  }

  public subscribe = (config?: IUdMessageSubscribeConfig) => {
    config = { ...this.defaultSubscribeConfig, ...config || {} }
    if (!this.client) {
      this.emit('error', '未初始化完成')
      return
    }

    /**
 * 消息中心业务消息订阅
 */
    this.client.subscribe('/topic/message/business_' + this.clientGlobalSessionId, (message: IMessage) => {
      const payload = JSON.parse(message.body);
      console.log("消息中心业务消息订阅: ", payload)
      this.emit('message', payload)
    }, this.headers);

    if (config.receiveOfflineMessage) {
      /**
       * 订阅个人离线消息
       */
      this.client.subscribe('/topic/personnel/offline_' + this.clientGlobalSessionId, (message: IMessage) => {
        const payload: IUdMessageInfo[] = JSON.parse(message.body);
        // 离线消息是列表
        console.log("个人离线消息: ", payload)
        this.emit('message', payload)
      }, this.headers);
      this.getOfflineMessages()
    }

    if (this.userInfo.userIdentification) {
      this.client.subscribe('/topic/personnel/' + this.userInfo.userIdentification, (message: IMessage) => {
        const payload = JSON.parse(message.body);
        console.log("个人订阅: ", payload)
        this.emit('message', payload)
      }, this.headers);
    }

    if (!this.userInfo.storeCode) {
      return
    }

    const storeCodes = _.isArray(this.userInfo.storeCode) ? this.userInfo.storeCode : [this.userInfo.storeCode]
    if (storeCodes.length > 0) {
      for (let code of storeCodes) {
        this.client.subscribe('/topic/store/' + code, (message: IMessage) => {
          const payload = JSON.parse(message.body);
          console.log("门店订阅: ", payload)
          this.emit('message', payload)
        }, this.headers);
      }
    }
  }

  /**
   * 确认消息已读
   * @param messageIds string[] 已读消息id集合
   */
  public confirmRead = (messageIds: string[]) => {
    console.log("messageId", messageIds)
    const data: IPublishParams = {
      destination: '/app/message/confirmRead',
      headers: this.headers,
      body: JSON.stringify(messageIds)
    }
    this.client.publish(data);
  }


  /**
   * 触发事件
   */
  private emit(name: IUdMessageServiceEmitType, data?: any) {
    this.emitter.emit(name, data)
  }

  /**
   * 订阅事件
   */
  public on(name: IUdMessageServiceEmitType, call: (...args: any) => any) {
    this.emitter.on(name, call)
  }

  /**
   * 一次性订阅事件
   */
  public once(name: IUdMessageServiceEmitType, call: (...args: any) => any) {
    this.emitter.once(name, call)
  }

}

export default UdMessageService