import _ from 'lodash'
import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { ClassValue } from 'classnames/types'
import { Tooltip, Affix } from 'antd'
import { AffixProps } from 'antd/lib/affix'
import { udConfigProvider, Modify } from '../../../'
import { ArrowLeftOutlined, SyncOutlined } from '@ant-design/icons'

/**
 * 页面头部
 */
const UdPageHeader: React.FC<IUdPageHeaderProps> = (props) => {

  const back = () => {
    if (props.onBack === true) {
      window.history.back()
    } else {
      (props.onBack as any)()
    }
  }

  let node = (
    <div className={classNames('ud-page-header', props.className)}>
      <div className="ud-page-header-heading">
        {
          props.title && <span className="ud-page-header-heading-title">{props.title}</span>
        }
        {
          props.subTitle && <span className="ud-page-header-heading-sub-title">{props.subTitle}</span>
        }
      </div>
      <div className="ud-page-header-extra">
        {
          _.isFunction(props.onRefresh) &&
          <Tooltip title="刷新" placement="bottom">
            <SyncOutlined onClick={props.onRefresh} translate={undefined} />
          </Tooltip>
        }
        {
          (props.onBack != null) &&
          <Tooltip title="返回上一页" placement="bottomRight">
            <ArrowLeftOutlined onClick={() => back()} translate={undefined} />
          </Tooltip>
        }
      </div>
    </div>
  )
  if (props.useAffix !== false) {
    node = <Affix className="ud-page-header-affix" offsetTop={0} target={() => udConfigProvider.ui.getPageContainer()} {...props.affixProps}>{node}</Affix>
  }

  return node
}

export interface IUdPageHeaderProps {
  /** 
   * class
   * 始终会带一个 ud-page-header 的 class 
   */
  className?: ClassValue
  /**
   * 标题
   */
  title: ReactNode
  /**
   * 副标题
   */
  subTitle?: ReactNode
  /**
   * 是否使用固钉
   * @default true
   */
  useAffix?: boolean
  /**
   * 固定Props
   */
  affixProps?: Modify<AffixProps, {
    children?: React.ReactElement
  }>
  /**
   * 刷新
   */
  onRefresh?: () => void
  /**
   * 回退，传入 `true` 为返回上一页
   */
  onBack?: boolean | (() => void)
}

export { UdPageHeader }
