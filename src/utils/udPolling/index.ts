import { IUdPollingConfig } from "../../typings"

/**
 * 轮询类，使用new关键字初始化一个轮询实例
 */
class UdPolling {
  constructor(config: IUdPollingConfig) {
    this.action = config.action
    this.shouldContinue = config.shouldContinue
    if (config.duration) {
      this.duration = config.duration
    }
    if (config.immediatelyAction) {
      this.immediatelyAction = config.immediatelyAction
    }
    if (config.maxFailTimes !== undefined) {
      this.maxFailTimes = config.maxFailTimes
    }
    if (config.handleDurction) {
      this.handleDurction = config.handleDurction
    }
    if (config.handleFailDurction) {
      this.handleFailDurction = config.handleFailDurction
    }
  }
  private timer: any = null
  private duration: number = 2000
  private immediatelyAction: boolean = true
  private action: (() => Promise<any>) | null = null
  private shouldContinue: (responseData: any) => boolean = () => false

  private pollingTimes: number = 0
  private failTimes: number = 0
  private maxFailTimes: number | null = 5

  public handleDurction = (durction: number, times: number): number => {
    return durction
  }
  public handleFailDurction = (durction: number, failTimes: number) => {
    return failTimes > 3 ? (failTimes - 3) * durction : durction
  }

  /**
   * 发起轮询
   * @returns Promise
   */
  public start: () => Promise<any> = () => {
    this.failTimes = 0
    this.pollingTimes = 0
    return new Promise<any>((resolve, reject) => {
      if (!this.action) {
        reject('没有轮询动作')
        this.stop()
      }
      const polling = (duration: number) => {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.pollingTimes += 1
          this.action?.().then(res => {
            this.failTimes = 0 // 轮询成功，清空失败次数
            const isContinue = this.shouldContinue(res)
            if (isContinue) {
              polling(this.handleDurction(this.duration, this.pollingTimes))
            } else {
              this.stop()
              resolve((res))
            }
          }).catch(() => {
            this.failTimes += 1
            this.pollingTimes = 0 // 轮询失败，清空成功轮询次数
            if (this.maxFailTimes !== null && this.failTimes >= this.maxFailTimes) {
              this.stop()
              reject('请求超时')
            } else {
              polling(this.handleFailDurction(this.duration, this.failTimes))
            }
          })
        }, duration)
      }
      if (this.immediatelyAction) {
        polling(10)
      } else {
        polling(this.duration)
      }
    })
  }

  /**
   * 停止轮询
   */
  public stop = () => {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }
}

/**
 * @description xxxx
 */
export { UdPolling }