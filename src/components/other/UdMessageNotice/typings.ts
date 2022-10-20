import { ArgsProps } from "antd/lib/notification"

export type IUdMessageType = 'TEXT' | 'LINK' | 'VOICE' | 'TEMPLATE'

export interface IUdMessageInfo {
  //消息ID
  messageId: string
  /**
   * 消息分类：通知、消息、待办
   */
  category: string
  //消息业务标识ID
  businessId: string
  /**
   * 业务系统消息分组
   */
  businessMessageGroup: string
  //来源项目
  sourceProjectCode: string
  //消息类型 LINK=链接消息 VOICE=语音消息 TEXT=文本消息   TEMPLATE=模板消息
  messageType: IUdMessageType
  // 视图类型  长期展示直到已读,自动展示自动消失,语音消息自动播放,语音消息手动播放,静默消息

  /**
   * 消息标题
   */
  title: string
  /**
   * 消息内容
   */
  content: string
  /**
   * 语音地址,有就播放语音
   */
  alertTone: string
  links: IUdMsgLink[]

  /**
   * 是否自动弹窗
   */
  autoPopup: boolean
  /**
   * 弹窗自动关闭时长
   */
  autoCloseDuration: number

  /**
   * 消息确认已读的时机 MANUAL-需要用户手动确认  AUTO_AFTER_DISPLAY-展示后自动确认已读
   */
  readConfirmType: 'MANUAL' | 'AUTO_AFTER_DISPLAY'

  /**
   * 消息元数据-业务系统自定义消息数据
   */
  metadata: { [key: string]: any }

  // 以下为消息服务发送的消息内容
  // 业务系统消息发送时间
  sendTime: Date,
  businessType?: 'ACK' | 'OFFLINE_TOTAL'
  data?: any
  messageIds?: string[]

  readStatus?: 'READED' | 'WAIT_READ'
}

export interface IUdMessageServiceUserInfo {
  storeCode: string | string[]
  userIdentification: string | number
  userIdentificationName: string
  deviceId: string
  deviceType: "BROWSER"
}


export interface IUdMessageServiceConfig {
  /**
   * 消息服务网关地址
   */
  gatewayUrl: string
  /**
   * 断开后重连间隔
   */
  reconnectDelay: number
  /**
   * 心跳输入间隔
   */
  heartbeatIncoming: number
  /**
   * 服务器检测到多久无心跳断开连接
   */
  heartbeatOutgoing: number
  /**
   * 用户信息
   */
  userInfo: IUdMessageServiceUserInfo
  /**
   * 用户token
   */
  token: string | (()=>string)
  /**
   * 最大重连次数
   */
   maxReConnectTimes?: number
}

export type IUdMessageServiceEmitType = 'error' | 'connected' | 'disConnected' | 'connecting' | 'message' | 'overMaxReconnectTimes' /* | string | symbol */
export interface IUdMessageSubscribeConfig {
  /**
   * 是否接收离线消息
   * @default true
   */
  receiveOfflineMessage?: boolean
}

export interface IUdMsgLink {
  title: string
  type: 'INNER_LINK' | 'BLANK_LINK'
  url: string
}

export type IUdWebNoticePopupConfig = Partial<ArgsProps> | ((content: IUdMessageInfo) => Partial<ArgsProps>)

export type IUdMsgContentHanlder = (content: IUdMessageInfo) => IUdMessageInfo

export interface IUdMessageServiceApis {
  messageList: string
}
