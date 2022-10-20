import React, { ReactNode, CSSProperties } from 'react'
import classNames from 'classnames'
import { ClassValue } from 'classnames/types'

const UdPage: React.FC<IUdPageProps> = (props: IUdPageProps) => {
  return <div style={props.style} className={classNames('ud-page', props.className)}>{props.children}</div>
}

export interface IUdPageProps {
  /**
   * 样式
   */
  style?: CSSProperties
  /**
   * class
   * 不管传没传，都会有一个 `ud-page` 的 className
   */
  className?: ClassValue
  /**
   * 内容
   */
  children?: ReactNode
}

export { UdPage }
