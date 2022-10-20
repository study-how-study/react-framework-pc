/**
 * 站内消息组件
 * @description 接受一个类型的topic， 处理消息收发
 *  */
import _ from 'lodash'
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { SoundFilled } from '@ant-design/icons'
import { ArgsProps } from 'antd/lib/notification'
import { IUdModelProps, UdModal } from '../..'
import { centerMsgBus, http, ICenterMsgBusStatusChange, IMsgBusOnModel } from '../../..'
import ModalMessageCard, { IProjectCode } from './ModalMessageCard'
import MsgUtil from './msgUtil'


const UdMessageNotification = (props: IUdMessageNotificationProps) => {
  const [unconfirmedQuantity, setUnconfirmedQuantity] = useState<number | null>(0)  // 未读消息数量
  const [serviceStatus, setServiceStatus] = useState<ICenterMsgBusStatusChange>()
  const msgUtil = useRef<MsgUtil>()

  const option = { ...UdMessageNotification.defaultOption, ...props }
  const { msgModel } = option

  useEffect(() => {
    msgUtil.current = new MsgUtil()
    msgUtil.current.init({
      popupConfig: option.popupConfig,
      webMsgServiceOption: option.webMsgServiceOption,
      maxPendingPopupCount: option.maxPendingPopupCount,
      msgModel: option.msgModel,
      msgContentHanlder: option.msgContentHanlder
    }) // 传入http请求相关参数，可能需要跟消息中心交互（通过notification标记已读）
  }, [])

  // centerMsgBus订阅
  useEffect(() => {
    getUnconfirmedMessageCount()
    centerMsgBus.ready(() => {
      centerMsgBus.on(msgModel, msgHanlder)
    })
    centerMsgBus.onStatusChange((data)=> {
      setServiceStatus(data)
    })
  }, [])

  const getUnconfirmedMessageCount = useCallback(() => {
    // 获取未读消息数量
    http.get(centerMsgBus.baseURL + option.webMsgServiceOption.unconfirmedCountUrl, { params: centerMsgBus.baseParams, useBizErrorHandler: false, useSysErrorHandler: false }).then((res => {
      let topicUnconfirmedInfo = res.data?.topicTagUnconfirmedCount
      if (topicUnconfirmedInfo && topicUnconfirmedInfo[msgModel.topic]) {
        setUnconfirmedQuantity(topicUnconfirmedInfo[msgModel.topic][msgModel.tag] || 0)
      }
    }))
  }, [])

  // 打开消息总览弹窗
  const openMessageCard = () => {
    let cardProsp = props.msgCardModalProps
    if (cardProsp && _.isFunction(cardProsp)) {
      cardProsp = cardProsp(props)
    }
    UdModal.open({
      title: '系统消息',
      width: '1000px',
      content: <ModalMessageCard
        getUnconfirmedMessageCount={getUnconfirmedMessageCount}
        webMsgServiceOption={option.webMsgServiceOption}
        msgModel={option.msgModel}
        {...option.getProjectCodes && { getProjectCodes: option.getProjectCodes }}
        msgContentHanlder={props.msgContentHanlder}
        onReadAll={() => {
          msgUtil.current.closeAllPopup()
        }}
      />,
      footer: null,
      ...cardProsp
    })
    getUnconfirmedMessageCount()
  }

  // 消息处理
  const msgHanlder = useCallback((e) => {
    const data: IWebMsgInfo = e || {}
    if (data.unconfirmedCount || data.unconfirmedCount === 0) {
      setUnconfirmedQuantity(data.unconfirmedCount)
    }
    msgUtil.current.handleMsg(data)
  }, [])

  const quantityRender = (count) => {
    if (count > 99) {
      return '99+'
    }
    return count
  }

  return (
    <div className='ud-message-notification' onClick={openMessageCard}>

      {option.icon}
      <span>系统消息</span>
      {
        unconfirmedQuantity ?
          <span className='unread-quantity'>{quantityRender(unconfirmedQuantity)}</span> :
          null
      }
    </div>
  )
}

UdMessageNotification.defaultOption = {
  icon: <SoundFilled className='ud-notice-icon' style={{ color: '#d9dee4' }} />,
  webMsgServiceOption: {
    getMessageUrl: '/manage/v1/clients/getMessage',
    offlineUrl: '/manage/v1/clients/offline',
    confirmUrl: '/manage/v1/msg/confirm',
    confirmAllUrl: '/manage/v1/msg/confirmAll',
    unconfirmedCountUrl: '/manage/v1/msg/unconfirmedCount',

  },
  maxPendingPopupCount: 3

} as IUdMessageNotificationProps

export interface IUdMessageNotificationProps {
  /**
   *  订阅主题
   **/
  msgModel: IMsgBusOnModel
  /**
   *  站内消息http请求参数和接口配置
   */
  webMsgServiceOption?: IWebMsgServiceOption
  /**
   *  notification轻提示配置
   **/
  popupConfig?: IUdWebPopupConfig
  /**
   * 消息展示栏的图标
   **/
  icon?: ReactNode
  /**
   *  高级搜索配置项目筛选
   **/
  getProjectCodes?: () => Array<IProjectCode>;

  msgCardModalProps?: IMsgCardModalProps | ((options: IUdMessageNotificationProps) => IMsgCardModalProps)

  maxPendingPopupCount?: number

  /**
   * 消息内容处理函数
   *  */
  msgContentHanlder?: IMsgContentHanlder
}

interface IMsgCardModalProps extends Partial<IUdModelProps> { }
export interface IWebMsgServiceOption {
  getMessageUrl: string
  offlineUrl: string
  confirmUrl: string
  confirmAllUrl: string
  unconfirmedCountUrl: string
}

export interface IWebMsgInfo {
  cmsgId: string
  content: IWebMsgContent
  dequeueCount: number
  messageBodyType: 'RAW' | 'BASE64' | 'GZIP_BASE64'
  needConfirm: boolean
  smsId: string
  tag: string
  topic: string
  unconfirmedCount: number
  id: string | number
}

export interface IWebMsgContent {
  id: string | number
  /**
   * 消息key
   * @description 消息Key和topic组成消息主题的唯一key，用于设置独立静默时间
   * */
  messageKey: string
  /**
   * @description 内容标题
   * */
  title: string
  /**
   * @description 内容主体
   * */
  content: string
  /**
   * 点击时是否自动确认已读
   * */
  autoConfirmOnClick: boolean
  /**
   *  是否自动弹窗
   * */
  autoPopup: boolean
  /**
   *  消息提示语音播报地址
   * @description 有语音地址就会进行语音播报
   * */
  msgAlertTone: string | null | undefined
  /**
   *  链接和动作内容
   * @description 根据type类型来确定动作类型
   * */
  links: IMsgLink[] // 操作的链接
  /**
   * 静默时长
   * @description 弹窗、语音类消息需要静默，根据messageKey来设置独立的静默时长
   */
  silenceDuration: number
  needConfirm: boolean
  isConfirmed: boolean
  /**
   * 右上角弹窗的保持时间，为NO_CLOSE时，不自动关闭
   */
  popupCloseDuration?: 'NO_CLOSE' | number
}
export interface IMsgLink {
  title: string
  type: 'INNER_LINK' | 'BLANK_LINK' | 'CLOSE'
  url: string
}

export type IUdWebPopupConfig = Partial<ArgsProps> | ((content: IWebMsgContent) => Partial<ArgsProps>)

export type IMsgContentHanlder = (content: IWebMsgContent) => IWebMsgContent

export { UdMessageNotification }