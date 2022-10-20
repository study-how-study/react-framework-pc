import { useCallback, useRef } from 'react'

export type noop = (...args: any[]) => any

/**
 * 持久化 function
 */
function usePersistFn<T extends noop>(fn: T) {
  const ref = useRef<any>(() => {
    throw new Error('渲染时无法调用函数')
  })

  ref.current = fn

  const persistFn = useCallback(((...args) => ref.current(...args)), [ref])

  return persistFn
}

export { usePersistFn }
