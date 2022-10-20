import React, { ReactNode, useState } from 'react'
import classNames from 'classnames'
import { Icon } from '@ant-design/compatible'
import { uaaApp } from '../../../core'

/**
 * 左侧边栏
 */
const UdSidebar: React.FC<IUdSidebarProps> = (props) => {

  let [collapse, setCollapse] = useState(false)

  return (
    !uaaApp.fromOtherSystem && (
      <>
        <div className={classNames('ud-sidebar', { 'collapse': collapse })}>
          <div className="ud-sidebar-title">{props.title}</div>
          <div className="ud-sidebar-body">{props.children}</div>
          {props.footer && <div className="ud-sidebar-footer">{props.footer}</div>}
        </div>
        <div className={classNames('ud-sidebar-collapse', { 'collapse': collapse })}>
          <div className="ud-sidebar-collapse-bg" onClick={() => setCollapse(!collapse)}>
            <Icon type={collapse ? 'menu-unfold' : 'menu-fold'} className="icon" />
          </div>
        </div>
      </>
    )
  )
}

export interface IUdSidebarProps {
  /**
   * 标题
   */
  title: ReactNode
  /**
   * 主体
   */
  children?: ReactNode
  /**
   * 底部
   */
  footer?: ReactNode
}

export { UdSidebar }
