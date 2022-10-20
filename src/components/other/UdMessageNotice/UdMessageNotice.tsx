import React, { useEffect, useRef, useState } from 'react'
import { LoadingOutlined, QuestionCircleOutlined, SoundFilled } from "@ant-design/icons";
import { Client } from "@stomp/stompjs";
import { Popover, PopoverProps, Tooltip } from "antd";
import { UdModal } from "../../fallback/UdModal";
import ModalMessageCard, { IUdMessageCardModalApi } from "./ModalMessageCard";
import NoticePanel from "./NoticePanel";
import { IUdMessageInfo, IUdMessageServiceApis, IUdMessageServiceUserInfo, IUdMsgContentHanlder, IUdMsgLink } from './typings';
import UdMessageService from './UdMessageService';
import _ from 'lodash';
import msgHanlder from './messageHanlder';
import { pannelMsgCountOverCrop } from './utils';

interface IUdMessageNoticeProps {
  // 网关地址
  gatewayUrl: string
  token: string | (() => string)
  userIdentification: string | number
  userIdentificationName: string
  messageSourceSystem?: any[] | (() => Promise<any[]>)
  storeCode?: string | string[]
  deviceId?: string
  deviceType?: "BROWSER"
  // 重新连接延迟
  reconnectDelay?: number,
  // 心跳输入
  heartbeatIncoming?: number,
  // 心跳传出
  heartbeatOutgoing?: number,
  customMsgHanlder?: (message: IUdMessageInfo) => Function | false
  msgContentHanlder?: IUdMsgContentHanlder
  pannelPopConfig?: PopoverProps
  onLinkTap?: (link: IUdMsgLink, message: IUdMessageInfo) => string | false
  serviceApis?: IUdMessageServiceApis
  maxPendingPopupCount?: number
  maxReConnectTimes?: number
  onOverMaxReconnectTImes?: (error: any) => void
}

interface IUdMessageNoticeState {
  // 未确认消息数量
  unconfirmedQuantity: number
  // 加载状态
  loading: boolean,
  // 是否已连接
  connected: boolean,
  // 客户端
  stompClient: Client | any
  // 客户端全局ID
  clientGlobalSessionId: string
  // 消息列表
  messageList: IUdMessageInfo[]
  // 已读列表
  readList: string[]
}

const UdMessageNotice: React.FC<IUdMessageNoticeProps> = (props) => {
  const defaultProps: Partial<IUdMessageNoticeProps> = {
    storeCode: '',
    reconnectDelay: 10000,
    heartbeatIncoming: 5000,
    heartbeatOutgoing: 10000,
    deviceId: window.navigator.userAgent,
    deviceType: 'BROWSER',
  }
  const config = _.assign({}, defaultProps, props)
  const userInfo: IUdMessageServiceUserInfo = {
    storeCode: config.storeCode,
    userIdentification: config.userIdentification,
    userIdentificationName: config.userIdentificationName,
    deviceId: config.deviceId,
    deviceType: config.deviceType
  }
  const msgService = useRef<UdMessageService>(new UdMessageService({
    gatewayUrl: config.gatewayUrl,
    reconnectDelay: config.reconnectDelay,
    heartbeatIncoming: config.heartbeatIncoming,
    heartbeatOutgoing: config.heartbeatOutgoing,
    userInfo,
    token: config.token,
    maxReConnectTimes: config.maxReConnectTimes
  }))
  // const msgHanlder = useRef<MessageHanlder>()

  const [loading, setLoading] = useState<boolean>(false)
  const [connected, setConnected] = useState<boolean>(false)
  const [unconfirmedQuantity, setUnconfirmedQuantity] = useState<number>(0)
  const [messageList, setMessageList] = useState<any[]>([])
  const [readList, setReadList] = useState<any[]>([])

  const [overTime, setOverTime] = useState<boolean>(false)


  const messageBoardRef = useRef<IUdMessageCardModalApi>()

  const fetchOfflinMsg = useRef<boolean>(false)

  useEffect(() => {
    initMsgService()
    initMsgUtils()
  }, [])

  useEffect(() => {
    const unReadCount = _.filter(messageList, item => readList.indexOf(item.messageId) === -1).length
    if (unReadCount > 100) {
      fetchOfflinMsg.current = true
    }
    setUnconfirmedQuantity(unReadCount)
    if (unReadCount <= 100 && fetchOfflinMsg.current) {
      fetchOfflinMsg.current = false
      msgService.current.getOfflineMessages()
    }
  }, [messageList, readList])

  /**
   * 初始化消息服务
   */
  const initMsgService = () => {
    msgService.current.connect()
    setLoading(true)
    msgService.current.on('connected', () => {
      setOverTime(false)
      setConnected(true)
      setLoading(false)
      msgService.current.subscribe()
    })
    msgService.current.on('disConnected', (data) => {
      console.log('消息中心ws链接失败', data)
      setConnected(false)
      setLoading(true)
    })
    msgService.current.on('message', (data) => {
      handleMessage(data)
    })
    msgService.current.on('overMaxReconnectTimes', (data) => {
      handleOverTimes(data)
    })
  }

  const handleConfirmRead = (messageIds: string[]) => {
    msgService.current.confirmRead(messageIds)
    // setUnconfirmedQuantity(cur => cur - messageIds.length)
  }

  /**
   * 初始化消息处理
   */
  const initMsgUtils = () => {
    // msgHanlder = new MessageHanlder()
    msgHanlder.init({
      onConfirmRead: handleConfirmRead,
      msgContentHanlder: props.msgContentHanlder,
      onLinkTap: props.onLinkTap,
      maxPendingPopupCount: props.maxPendingPopupCount !== undefined ? props.maxPendingPopupCount : 3 // 必须限制最大弹窗数量
    })
  }

  /**
   * 接收消息
   * @param message
   */
  const handleMessage = (message: IUdMessageInfo | IUdMessageInfo[]) => {
    if (_.isArray(message)) {
      let list = [...message]
      if (props.msgContentHanlder) {
        list = message.map(item => {
          return props.msgContentHanlder(item)
        })
      }
      setMessageList(cur => {
        const newList = pannelMsgCountOverCrop([...list, ...cur], 3000)
        return _.uniqBy(newList, 'messageId')
      })
      return
    }
    if (message.businessType == "ACK") {
      if (message.data.handleStatus) {
        setReadList(cur => {
          return [...cur, ...message.data.messageIds]
        })
        messageBoardRef.current && messageBoardRef.current.setReadList(message.data.messageIds)
      }
      return
    }
    // 离线消息总数量
    if (message.businessType == "OFFLINE_TOTAL") {
      setUnconfirmedQuantity(message.data)
      return
    }


    let messageItem = { ...message }
    if (props.msgContentHanlder) {
      messageItem = props.msgContentHanlder(message)
    }

    setMessageList(cur => {
      if (_.find(cur, item => item.messageId === messageItem.messageId)) {
        return cur
      } else {
        const newList = pannelMsgCountOverCrop([messageItem, ...cur], 3000)
        return newList
      }
    })
    // setUnconfirmedQuantity((cur) => cur + 1)

    if (props.customMsgHanlder) {
      const hanlder = props.customMsgHanlder(message)
      if (hanlder) {
        hanlder(message)
        return
      }
    }
    msgHanlder.handleMsg(message)
  }

  /**
   * 清除已读
   */
  const clearReaded = () => {
    setMessageList(_.filter(messageList, item => readList.indexOf(item.messageId) === -1))
  }



  // TODO: 打开更多消息弹窗
  const openMessageCard = () => {
    UdModal.open({
      title: '系统消息',
      width: '80%',
      className: 'ud-message-card-modal',
      wrapClassName: 'ud-message-card-wrap',
      centered: true,
      content: <ModalMessageCard
        gatewayUrl={props.gatewayUrl}
        ref={messageBoardRef}
        userIdentification={props.userIdentification}
        messageSourceSystem={props.messageSourceSystem}
        serviceApis={props.serviceApis}
        storeCode={props.storeCode}
      />,
      footer: null,
    });
  }


  /**
 * 数量渲染
 */
  const quantityRender = () => {
    if (unconfirmedQuantity > 99) {
      return '99+'
    }
    return unconfirmedQuantity
  }

  /**
   * 链接超时处理
   */
  const handleOverTimes = (error: any) => {
    setOverTime(true)
    config.onOverMaxReconnectTImes && config.onOverMaxReconnectTImes(error)
  }

  return (
    <>
      <div className='ud-message-notification'>
        {
          overTime ?
            <span>
              连接超时
              <Tooltip title='网络问题或登录过期，可能导致连接超时。点击重试或重新登录'>
                <QuestionCircleOutlined translate={undefined} />
              </Tooltip>
              <a
                style={{ marginLeft: '10px' }}
                onClick={() => {
                  setOverTime(false)
                  msgService.current.client = null
                  msgService.current.connect()
                }}>重试</a>

            </span>  // TODO:
            :
            <Popover overlayClassName="ud-message-popover"
              mouseEnterDelay={0.3}
              mouseLeaveDelay={0.5}
              {...props.pannelPopConfig || {}}
              trigger={loading ? [] : (props.pannelPopConfig?.trigger || ['hover'])}
              // trigger={'click'}
              content={<NoticePanel
                messageList={messageList}
                readList={readList}
                onShowMore={() => {
                  openMessageCard()
                }}
                onClearReaded={() => {
                  clearReaded()
                }}
              // onConfirmRead={handleConfirmRead}
              // onLinkTap={props.onLinkTap}
              />
              }
            >
              <span className='ud-notice-bar'>
                {loading ?
                  <LoadingOutlined translate={undefined} className='loading-icon' />
                  :
                  <SoundFilled className='ud-notice-icon' style={{ color: '#d9dee4' }} />
                }

                <span>系统消息</span>
                {(unconfirmedQuantity > 0 && !loading)
                  ? <span className='unread-msg-quantity'>{quantityRender()}</span>
                  : null
                }
              </span>

            </Popover>
        }

      </div>
    </>
  )
}

export { UdMessageNotice }
