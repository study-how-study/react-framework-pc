import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { ClassValue } from 'classnames/types'

/**
 * 工具栏
 */
const UdToolbar: React.FC<IUdToolbarProps> = (props) => {
  return (
    (props.other || props.children) ? (
      <div className={classNames('ud-toolbar', props.className)}>
        <div className="ud-toolbar-other">{props.other}</div>
        <div className="ud-toolbar-main">{props.children}</div>
      </div>
    ) : null
  )
}

export interface IUdToolbarProps {
  /** 
   * class
   * 始终会带一个 ud-toolbar 的 class 
   */
  className?: ClassValue
  /**
   * 左侧区域
   */
  other?: ReactNode
  /**
   * 右侧区域
   */
  children?: ReactNode
}

export { UdToolbar }
