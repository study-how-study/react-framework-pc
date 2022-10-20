import { useEffect } from 'react'

/**
 * 只在组件 mount 时执行
 */
const useMount = (fn: () => void) => {
  useEffect(() => {
    fn()
  }, [])
}

export { useMount }
