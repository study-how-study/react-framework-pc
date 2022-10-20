import React, { CSSProperties, ReactNode } from 'react'
import classNames from 'classnames'
import { ClassValue } from 'classnames/types'

/**
 * 页面整体布局
 */
const UdLayout: React.FC<IUdLayoutProps> = (props: IUdLayoutProps) => {
  return (
    <div style={props.style} className={classNames('ud-layout', props.className)}>
      {props.children}
    </div>
  )
}

export interface IUdLayoutProps {
  /**
   * 样式
   */
  style?: CSSProperties
  /**
   * class
   * 不管传没传，都会有一个 `ud-layout` 的 className
   */
  className?: ClassValue
  /**
   * 内容
   */
  children?: ReactNode
}

export { UdLayout }
