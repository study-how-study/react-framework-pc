import { useEffect, useRef } from 'react'

/**
 * 定时器
 * @param callback 执行的方法
 * @param delay 间隔时间
 * @param options 其他选项
 */
function useInterval(callback: Function, delay?: number | null, options: IUseIntervalOptions = useInterval.defaultOptions) {

  const immediate = options.immediate

  const fn = useRef<Function>(() => { })
  fn.current = callback

  useEffect(() => {
    if (delay === null) {
      return
    } else {
      if (immediate) {
        fn.current()
      }
      const interval = setInterval(() => fn.current(), delay)
      return () => clearInterval(interval)
    }
  }, [delay])
}

useInterval.defaultOptions = {
  immediate: false
} as IUseIntervalOptions

export interface IUseIntervalOptions {
  /**
   * 是否立即执行
   */
  immediate?: boolean
}

export { useInterval }
