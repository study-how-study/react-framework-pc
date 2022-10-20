export interface IUdPollingConfig {
  /**
   * 轮询动作，函数返回promise(http请求)
   */
  action: () => Promise<any>
  /**
   * 根据请求结果判断是否需要继续轮询，返回true，继续
   * @default ()=>false
   */
  shouldContinue: (responseData: any) => boolean
  /**
   * 轮询间隔,ms
   * @default 2000
   */
  duration?: number
  /**
   * 是否马上发起请求 （第一次发起轮询请求是否等待间隔时间）
   * @default true
   */
  immediatelyAction?: boolean
  /**
   * 最大允许接口失败次数
   * @default 5
   */
  maxFailTimes?: number | null
  /**
   * 按轮询次数自定义轮询间隔
   * @param {number} durction - 轮询间隔
   * @param {number} pollTimes - 轮询成功的次数
   */
  handleDurction?: (durction: number, pollTimes: number) => number
  /**
 * 按轮询失败次数自定义轮询失败再次发起轮询间隔
 */
  handleFailDurction?: (durction: number, pollTimes: number) => number

}