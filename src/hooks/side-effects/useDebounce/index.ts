import _ from 'lodash'
import { useRef, useEffect, useState } from 'react'
import { useCreation } from '../../../'

function debounceFn<T extends Fn>(fn: T, time?: number, options?: DebounceOptions): ReturnValue<T> {
  const fnRef = useRef<Fn>(fn)
  fnRef.current = fn
  time = time ? time : 1000

  const debounced = useCreation(
    () =>
      _.debounce((...args: any) => {
        fnRef.current(...args)
      }, time, options),
    []
  )

  return {
    run: (debounced as any) as T,
    cancel: debounced.cancel
  }
}

function debounceValue<T = undefined>(value: T, time?: number, options?: DebounceOptions) {
  const [debounced, setDebounced] = useState(value)
  const { run } = debounceFn(() => {
    setDebounced(value)
  }, time, options)

  useEffect(() => {
    run()
  }, [value])

  return debounced
}

function useDebounce(type: Function, time?: number, options?: DebounceOptions): ReturnValue<Fn>

function useDebounce<T = undefined>(type: T, time?: number, options?: DebounceOptions): T

function useDebounce<T = undefined>(type: Function | T, time?: number, options?: DebounceOptions) {
  if (_.isFunction(type)) {
    const { run, cancel } = debounceFn(type, time, options)
    return { run, cancel } as ReturnValue<Fn>
  } else {
    const debounced = debounceValue(type, time, options)
    return debounced as T
  }
}

useDebounce.defaultOptions = {
  leading: false,
  trailing: true
}

export interface DebounceOptions {
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

interface ReturnValue<T extends Fn> {
  run: T
  cancel: () => void
}


export { useDebounce }


