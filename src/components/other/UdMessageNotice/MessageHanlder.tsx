import _ from 'lodash'
import React from 'react'
import { notification } from 'antd'
import { SoundFilled } from '@ant-design/icons'
import { ArgsProps } from 'antd/lib/notification'
import { IUdMsgContentHanlder, IUdMessageInfo, IUdWebNoticePopupConfig, IUdMsgLink } from '.'
import { centerMsgBus, http, IMsgBusOnModel } from '../../..'
import MsgPopupContent from './NoticePanel/MsgPopupContent'

class MessageHanlder {
  // 配置对象，跟UdMessageNotification一致
  public option: IMsgUtilOption
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
  public dispatchVoice = (content?: IUdMessageInfo, callback?: () => Promise<any>) => {
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

    // 外部调用语音播放，也使用播放队列避免冲突
    if (callback) {
      const playAwait = callback()
      playAwait.then(() => {
        this.pendingVoice = null
        this.currentVoice = this.currentVoice.next
        if (this.currentVoice === null) {
          this.lastVoice = null
          return
        }
        this.dispatchVoice()
      })
      return
    }
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
  private confirmMsg = (content: IUdMessageInfo) => {
    if (this.option.onConfirmRead) {
      this.option.onConfirmRead([content.messageId])
    }
  }

  // TODO: 弹窗
  private popup = (content: IUdMessageInfo) => {
    // TODO:
    const needManualClose = (content.autoCloseDuration == -1)
    const key = Math.random() * 1000 + new Date().valueOf().toString()
    // // 如果当前打开的popup数量过大，清除之前的弹窗 TODO:

    // 超过最大可弹窗数量，不弹窗
    if (this.option.maxPendingPopupCount && ((this.pendingPopupKeys.length + 1) > this.option.maxPendingPopupCount)) {
      // let outQueuePopupKey = this.pendingPopupKeys.shift()
      return false
    }


    this.pop(content, key, needManualClose)
    this.pendingPopupKeys.push(key)

  }

  // 弹出动作
  private pop = (content: IUdMessageInfo, key, needManualClose) => {
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
          this.confirmMsg(content)
        }}
        onCloseAll={() => {
          this.closeAllPopup()
        }}
        onContentClick={() => {
          // if (content.autoConfirmReadedAfterDisplay) {
          //   this.confirmMsg(content)
          // }
        }}
        // onLinkTap={this.option.onLinkTap}
      />,
      onClose: () => {
        this.pendingPopupKeys = _.filter(this.pendingPopupKeys, item => item !== key)
        if (content.readConfirmType === 'AUTO_AFTER_DISPLAY') {
          this.confirmMsg(content)
        }
      },
      duration: needManualClose ? null : (content.autoCloseDuration || 4.5) / 1000,
      ...config,
      key, // key不允许被自定义
    })
  }


  // 语音提示
  private playVoice = (content: IUdMessageInfo): Promise<void> => {
    return new Promise((resolve, reject) => {
      const myAudio = new Audio()
      myAudio.autoplay = true
      myAudio.controls = false
      myAudio.src = content.alertTone
      myAudio.oncanplay = () => {
        let result = myAudio.play()
        if(!result) {
          result = new Promise((resolve, reject)=> {
            resolve()
          })
        }
        
        result.then(() => {
          // 在播放时如果有popup提示
          if (content.autoPopup) {
            this.popup(content)
          }else {
            if(content.readConfirmType === 'AUTO_AFTER_DISPLAY') {
              console.log('确认已读', content.messageId)
              this.confirmMsg(content)
            }
          }
        }).catch((err) => {
          console.error('语音播放失败', err)
          if (this.pendingErrorTip) {
            return
          }
          const needManualClose = (content.autoCloseDuration == -1)
          let key = new Date().valueOf().toString() + '-error-notic'
          this.pendingErrorTip = key
          notification.error({
            message: '消息提示',
            duration: needManualClose ? null : (_.toNumber(content.autoCloseDuration) || 6),
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
  public handleMsg = (data: IUdMessageInfo) => {
    const metadata = data.metadata || {}
    const key = data.businessId + data.businessMessageGroup || '' // 当前消息的分组，有业务系统可消息分组字段决定

    // if (_.isFunction(this.option.msgContentHanlder)) {
    //   data = this.option.msgContentHanlder(data)
    // }

    if (!data.autoPopup && !data.alertTone) {
      return false
    }
    const sicConfig = _.find(this.silenceConfig, item => item.key === key)
    // 如果没有静默历史，添加静默
    if (!sicConfig) {
      const newItem: ISilenceConfig = {
        key,
        silenceEndTimestamp: new Date().valueOf() + (_.toNumber(metadata.silenceDuration) || 0)
      }
      this.silenceConfig.push(newItem)
    }
    const dateNow = new Date().valueOf()
    if (sicConfig && (dateNow < sicConfig.silenceEndTimestamp)) {
      // 如果处于静默期，放弃本次消息
      return false
    } else {
      sicConfig && (sicConfig.silenceEndTimestamp = new Date().valueOf() + (metadata.silenceDuration || 0)) // 更新静默截止时间
      if (data.alertTone) {
        this.dispatchVoice(data)
        return
      }
      if (data.autoPopup) {
        this.popup(data)
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
  content: IUdMessageInfo,
  play: Function,
  next: IWaitPlayVoice | null,
}

interface IMsgUtilOption {
  /**
   *  站内消息http请求参数和接口配置
   */
  onConfirmRead: (messageIds: string[]) => void
  /**
   *  notification轻提示配置
   */
  popupConfig?: IUdWebNoticePopupConfig
  maxPendingPopupCount?: number
  msgContentHanlder?: IUdMsgContentHanlder
  onLinkTap?: (link: IUdMsgLink, message: IUdMessageInfo) => string | false
}

const msgHanlder = new MessageHanlder()
export default msgHanlder