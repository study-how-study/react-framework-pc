import _ from 'lodash'

/**
 * 消息医生
 */
class MessageDoctor {

  private historys: string[] = []
  private maximumHistory: number
  private suspendTime: number

  constructor(maximumHistory: number = 30, suspendTime: number = 10000) {
    this.maximumHistory = maximumHistory
    this.suspendTime = suspendTime
  }

  /**
   * 诊断是否有错
   * 依据：最近消息id不重复
   * @returns true 有错
   * @returns false 正常
   */
  public diagnosis(messageServerId: string) {
    if (_.isEmpty(messageServerId)) {
      return false
    }
    if (this.historys.includes(messageServerId)) {
      return true
    } else {
      if (this.historys.length >= this.maximumHistory) {
        this.historys.shift()
      }
      this.historys.push(messageServerId)
    }
    return false
  }

  /**
   * 治疗
   * 手段：休息一段时间
   */
  public cure(messageServerIds: string[]) {
    // TODO: 以后需要把有问题的 id 传回后端
    console.log('出现重复的服务端消息ID', messageServerIds)
    // 休息一段时间
    return new Promise((resolve) => setTimeout(resolve, this.suspendTime))
  }

}

export { MessageDoctor }