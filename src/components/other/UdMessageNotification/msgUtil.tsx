import _ from 'lodash'
import React from 'react'
import { notification } from 'antd'
import { SoundFilled } from '@ant-design/icons'
import { ArgsProps } from 'antd/lib/notification'
import { IMsgContentHanlder, IUdWebPopupConfig, IWebMsgContent, IWebMsgInfo, IWebMsgServiceOption } from '.'
import { centerMsgBus, http, IMsgBusOnModel } from '../../..'
import MsgPopupContent from './components/MsgPopupContent'

class MsgUtil {
  // 配置对象，跟UdMessageNotification一致
  private option: IMsgUtilOption
  /**
   * 消息静默对象，key为消息类型唯一key,值为静默时间
   **/
  private silenceConfig: ISilenceConfig[] = []
  /* *
   * 语音播放队列相关
   */
  private currentVoice: IWaitPlayVoice = null // 当前需要处理的任务
  private pendingVoice: IWaitPlayVoice = null // 正在处理的任务
  private lastVoice: IWaitPlayVoice = null // 最后一次入队的任务
  private dispatchVoice = (content?: IWebMsgContent) => {
    if (content) {
      let newItem = {
        content: _.cloneDeep(content),
        play: this.playVoice.bind(this),
        next: null,
      }
      if (!this.lastVoice) {
        this.currentVoice = newItem
        this.lastVoice = this.currentVoice
      } else {
        this.lastVoice.next = newItem
        this.lastVoice = this.lastVoice.next
      }
    }
    if (this.pendingVoice || !this.currentVoice) {
      return false
    }
    this.pendingVoice = this.currentVoice
    this.pendingVoice.play(this.pendingVoice.content).then(() => {
      this.pendingVoice = null
      this.currentVoice = this.currentVoice.next
      if (this.currentVoice === null) {
        this.lastVoice = null
        return
      }
      this.dispatchVoice()
    })
  }

  private pendingPopupKeys: string[] = []

  private pendingErrorTip: string = ''

  /* 确认已读 */
  private confirmMsg = (content: IWebMsgContent) => {
    if (!content.autoConfirmOnClick || content.isConfirmed || !content.needConfirm) {
      return false
    }
    const url = centerMsgBus.baseURL + this.option.webMsgServiceOption.confirmUrl
    http.post(url, { ...this.option.msgModel, messageIds: content.id }, { params: centerMsgBus.baseParams }).then(res => {
      content.isConfirmed = true
    })
  }

  // TODO: 弹窗
  private popup = (content: IWebMsgContent) => {
    const needManualClose = !!_.find(content.links, item => item.type === 'CLOSE') || (content.popupCloseDuration === 'NO_CLOSE')
    const key = Math.random() * 1000 + new Date().valueOf().toString()
    // // 如果当前打开的popup数量过大，清除之前的弹窗
    // if (needManualClose) {

    // }

    if (this.option.maxPendingPopupCount && ((this.pendingPopupKeys.length + 1) > this.option.maxPendingPopupCount)) {
      // let outQueuePopupKey = this.pendingPopupKeys.shift()
      return false
    }


    this.pop(content, key, needManualClose)
    this.pendingPopupKeys.push(key)

  }

  // 弹出动作
  private pop = (content, key, needManualClose) => {
    let config: Partial<ArgsProps> = {}
    if (_.isFunction(this.option.popupConfig)) {
      config = this.option.popupConfig(content)
    } else {
      config = this.option.popupConfig
    }
    notification.warning({
      message: content.title,
      icon: <SoundFilled style={{ color: '#F3E957' }} />,
      description: <MsgPopupContent
        content={content}
        onClose={() => {
          notification.close(key)
          this.pendingPopupKeys = _.filter(this.pendingPopupKeys, item => item !== key)
          if (content.autoConfirmOnClick) {
            this.confirmMsg(content)
          }
        }}
        onCloseAll={() => {
          this.closeAllPopup()
        }}
        onContentClick={() => {
          if (content.autoConfirmOnClick) {
            this.confirmMsg(content)
          }
        }}

      />,
      onClose: () => {
        this.pendingPopupKeys = _.filter(this.pendingPopupKeys, item => item !== key)
      },
      duration: needManualClose ? null : (content.popupCloseDuration || 4.5),
      ...config,
      key, // key不允许被自定义
    })
  }


  // 语音提示
  private playVoice = (content: IWebMsgContent): Promise<void> => {
    return new Promise((resolve, reject) => {


      const myAudio = new Audio()
      myAudio.autoplay = true
      myAudio.controls = false
      myAudio.src = content.msgAlertTone
      myAudio.oncanplay = () => {
        myAudio.play().then(() => {
          // 在播放时如果有popup提示
          if (content.autoPopup) {
            this.popup(content)
          }
        }).catch((err) => {
          console.error('语音播放失败', err)
          if (this.pendingErrorTip) {
            return
          }

          const needManualClose = !!_.find(content.links, item => item.type === 'CLOSE') || (content.popupCloseDuration === 'NO_CLOSE')

          let key = new Date().valueOf().toString() + '-error-notic'
          this.pendingErrorTip = key
          notification.error({
            message: '消息提示',
            duration: needManualClose ? null : (_.toNumber(content.popupCloseDuration) || 6),
            key,
            onClose: () => {
              this.pendingErrorTip = ''
            },
            description: <div>
              你有语音消息播放失败，
              <p style={{ textAlign: 'right' }}>
                点击 <a onClick={() => {
                  this.dispatchVoice(content)
                  notification.close(key)
                }}>重新播放</a>
              </p>
            </div>
          })
          resolve()
        })
      }
      myAudio.onended = () => {
        document.body.removeChild(myAudio)
        resolve()
      }
      myAudio.onerror = (err) => {
        console.error('音频播放失败', err)
        notification.error({
          message: '错误',
          description: '语音消息加载失败，请注意查看消息内容'
        })
        resolve()
      }
      document.body.appendChild(myAudio)
      // 此处可能有bug,
    })
  }

  // 初始化
  public init = (config: IMsgUtilOption) => {
    this.option = config
  }

  // 接受消息
  public handleMsg = (data: IWebMsgInfo) => {
    let content = data.content || {} as IWebMsgContent
    content.id = data.id
    content.needConfirm = data.needConfirm

    const key = data.topic + content.messageKey // 用topic跟messageKey来确定当前topic唯一消息类型

    if (_.isFunction(this.option.msgContentHanlder)) {
      content = this.option.msgContentHanlder(content)
    }

    if (!content.autoPopup && !content.msgAlertTone) {
      return false
    }
    const sicConfig = _.find(this.silenceConfig, item => item.key === key)
    // 如果没有静默历史，添加静默
    if (!sicConfig) {
      const newItem: ISilenceConfig = {
        key,
        silenceEndTimestamp: new Date().valueOf() + (content.silenceDuration || 0)
      }
      this.silenceConfig.push(newItem)
    }
    const dateNow = new Date().valueOf()
    if (sicConfig && dateNow < sicConfig.silenceEndTimestamp) {
      // 如果处于静默期，放弃本次消息
      return false
    } else {
      sicConfig && (sicConfig.silenceEndTimestamp = new Date().valueOf() + (content.silenceDuration || 0)) // 更新静默截止时间
      if (content.msgAlertTone) {
        this.dispatchVoice(content)
        return
      }
      if (content.autoPopup) {
        this.popup(content)
      }
    }
  }

  public closeAllPopup = () => {
    this.pendingPopupKeys.map(item => {
      notification.close(item)
    })
    this.pendingPopupKeys = []

    notification.close(this.pendingErrorTip)
    this.pendingErrorTip = ''
  }


}


interface ISilenceConfig {
  key: string
  silenceEndTimestamp: number
}

interface IWaitPlayVoice {
  content: IWebMsgContent,
  play: Function,
  next: IWaitPlayVoice | null,
}

interface IMsgUtilOption {
  /**
   *  站内消息http请求参数和接口配置
   */
  webMsgServiceOption?: IWebMsgServiceOption
  msgModel: IMsgBusOnModel
  /**
   *  notification轻提示配置
   */
  popupConfig?: IUdWebPopupConfig
  maxPendingPopupCount?: number
  msgContentHanlder?: IMsgContentHanlder
}


export default MsgUtil