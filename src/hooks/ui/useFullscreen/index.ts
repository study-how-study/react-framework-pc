import { useLayoutEffect, useRef } from 'react'
import screenfull from 'screenfull'
import { useBoolean } from '../../state/useBoolean'
import { BasicTarget, getTargetElement } from '../../../utils/dom'

export interface Options {
  onExitFull?: () => void
  onFull?: () => void
}

interface Callback {
  setFull: () => void
  exitFull: () => void
  toggleFull: () => void
}
const defaultOptions: Options = {
  onExitFull: Function,
  onFull: Function
}
type Value = boolean
type Result = [Value, Callback]
const useFullscreen = (target: BasicTarget, options?: Options): Result => {
  const { onExitFull, onFull } = options || defaultOptions
  const onExitFullRef = useRef(onExitFull)
  onExitFullRef.current = onExitFull

  const onFullRef = useRef(onFull)
  onFullRef.current = onFull

  const [state, toggle] = useBoolean(false)

  useLayoutEffect(() => {
    /* 非全屏时，不需要监听任何全屏事件 */
    if (!state) {
      return
    }

    const el = getTargetElement(target)
    if (!el) {
      return
    }

    /* 监听退出 */
    const onChange = () => {
      if (screenfull.isEnabled) {
        const { isFullscreen } = screenfull
        toggle(isFullscreen)
      }
    }

    if (screenfull.isEnabled) {
      try {
        screenfull.request(el as HTMLElement)
        toggle(true)
        if (onFullRef.current) {
          onFullRef.current()
        }
      } catch (error) {
        toggle(false)
        if (onExitFullRef.current) {
          onExitFullRef.current()
        }
      }
      screenfull.on('change', onChange)
    }

    /* state 从 true 变为 false，则关闭全屏 */
    return () => {
      if (screenfull.isEnabled) {
        try {
          screenfull.off('change', onChange)
          screenfull.exit()
        } catch (error) { }
      }
      if (onExitFullRef.current) {
        onExitFullRef.current()
      }
    }
  }, [state, typeof target === 'function' ? undefined : target])

  const toggleFull = () => toggle()

  return [
    !!state,
    {
      setFull: () => toggle(true),
      exitFull: () => toggle(false),
      toggleFull,
    },
  ]
}

export { useFullscreen }