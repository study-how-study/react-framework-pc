
import { useRef, useState, useEffect } from "react"
import { useCreation } from '../../../'
import _ from "lodash"

function throttleFn<T extends Fn>(fn: T, time?: number, options?: ThrottleOptions): ReturnValue<T> {
  const fnRef = useRef<Fn>(fn)
  fnRef.current = fn
  time = time ? time : 1000

  const throttled = useCreation(
    () =>
      _.throttle(
        (...args: any) => {
          fnRef.current(...args)
        }, time, options),
    []
  );

  return {
    run: (throttled as any) as T,
    cancel: throttled.cancel
  }
}

function throttleValue<T>(value: T, time?: number, options?: ThrottleOptions) {
  const [throttled, setThrottled] = useState(value)

  const { run } = throttleFn(() => {
    setThrottled(value)
  }, time, options)

  useEffect(() => {
    run()
  }, [value])

  return throttled
}

function useThrottle(type: Function, time?: number, options?: ThrottleOptions): ReturnValue<Fn>

function useThrottle<T = undefined>(type: T, time?: number, options?: ThrottleOptions): T

function useThrottle<T = undefined>(type: Function | T, time?: number, options?: ThrottleOptions) {
  if (_.isFunction(type)) {
    const { run, cancel } = throttleFn(type, time, options)
    return {
      run,
      cancel
    }
  } else {  
    const throttled = throttleValue(type, time, options)
    return throttled as T
  }
}

useThrottle.defaultOptions = {
  leading: false,
  trailing: true
}

export interface ThrottleOptions {
  /**
 * 是否在上升沿触发副作用函数
 */
  leading?: boolean
  /**
 * 是否在下降沿触发副作用函数
 */
  trailing?: boolean
}

type Fn = (...args: any) => any

export interface ReturnValue<T extends Fn> {
  run: T;
  cancel: () => void;
}


export { useThrottle } 