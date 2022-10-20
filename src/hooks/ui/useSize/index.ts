import { useState, useLayoutEffect, MutableRefObject } from 'react'

export type Size = { width?: number; height?: number }

function useSize(target: MutableRefObject<HTMLElement | undefined | null>): Size {
  const [state, setState] = useState<Size>(() => {
    const el = target.current
    return { width: el?.clientWidth, height: el?.clientHeight }
  })

  useLayoutEffect(() => {
    const el = target.current
    if (!el) {
      return () => { }
    }

    const resizeObserver = new window.ResizeObserver((entries: any) => {
      entries.forEach((entry: any) => {
        setState({
          width: entry.target.clientWidth,
          height: entry.target.clientHeight,
        })
      })
    })

    resizeObserver.observe(el)
    return () => {
      resizeObserver.disconnect()
    }
  }, [typeof target === 'function' ? undefined : target])

  return state
}

export { useSize }