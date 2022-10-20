import _ from "lodash"
import { useEffect, useRef } from "react"
import { IUdPollingConfig } from "../../../typings"

/**
 * 轮询类，使用new关键字初始化一个轮询实例
 */
const usePolling = (config: IUdPollingConfig): IPollingInstance => {

  const defaultConfig: IUdPollingConfig = {
    duration: 2000,
    immediatelyAction: true,
    action: null,
    shouldContinue: () => false,
    maxFailTimes: 5,
    handleDurction: (durction: number, times: number): number => {
      return durction
    },
    handleFailDurction: (durction: number, failTimes: number) => {
      return failTimes > 3 ? (failTimes - 3) * durction : durction
    }
  }
  const cfg: IUdPollingConfig = _.assign({}, defaultConfig, config)
  const timer = useRef<any>(null)
  const pollingTimes = useRef<number>(0)
  const failTimes = useRef<number>(0)

  useEffect(() => {
    return () => {
      stop()
    }
  }, [])

  /**
   * 发起轮询
   * @returns Promise
   */
  const start: () => Promise<any> = () => {
    failTimes.current = 0
    pollingTimes.current = 0
    return new Promise<any>((resolve, reject) => {
      if (!cfg.action) {
        reject('没有轮询动作')
        stop()
      }
      const polling = (duration: number) => {
        if (timer.current) {
          clearTimeout(timer.current)
        }
        timer.current = setTimeout(() => {
          pollingTimes.current += 1
          cfg.action?.().then(res => {
            failTimes.current = 0 // 轮询成功，清空失败次数
            const isContinue = cfg.shouldContinue(res)
            if (isContinue) {
              polling(cfg.handleDurction!(cfg.duration!, pollingTimes.current))
            } else {
              stop()
              resolve((res))
            }
          }).catch(() => {
            failTimes.current += 1
            pollingTimes.current = 0 // 轮询失败，清空成功轮询次数
            if (cfg.maxFailTimes !== null && failTimes.current >= cfg.maxFailTimes!) {
              stop()
              reject('请求超时')
            } else {
              polling(cfg.handleFailDurction!(cfg.duration!, failTimes.current))
            }
          })
        }, duration)
      }
      if (cfg.immediatelyAction) {
        polling(10)
      } else {
        polling(cfg.duration!)
      }
    })
  }

  /**
   * 停止轮询
   */
  const stop = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }

  return {
    start,
    stop
  }
}
export interface IPollingInstance {
  start: () => Promise<any>
  stop: () => void
}

/**
 * @description xxxx
 */
export { usePolling }

