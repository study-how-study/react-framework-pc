import { useEffect, useRef } from 'react'

/**
 * 只在组件 Unmount 时执行
 */
const useUnmount = (fn: () => void): void => {
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    return () => fnRef.current()
  }, [])
}

export { useUnmount }
