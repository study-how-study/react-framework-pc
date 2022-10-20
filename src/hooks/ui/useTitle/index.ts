import { useEffect, useRef } from 'react'

function useTitle(title: string = '', options: IUseTitleOptions = useTitle.defaultOptions) {
  const titleRef = useRef(document.title)
  document.title = title

  useEffect(() => {
    if (options && options.restoreOnUnmount) {
      return () => {
        document.title = titleRef.current
      }
    }
  }, [])
}

useTitle.defaultOptions = {
  restoreOnUnmount: false
} as IUseTitleOptions

export interface IUseTitleOptions {
  /**
   * 卸载时是否还原
   */
  restoreOnUnmount?: boolean
}

export { useTitle }
