import _ from 'lodash'
import React from 'react'
import { Button } from 'antd'
import { ButtonProps } from 'antd/lib/button'
import { udConfigProvider } from '../../../core'

/**
 * 按钮
 */
const UdButton: React.FC<IUdButton> = (props) => {
  let content = null
  if (props.auth && _.isFunction(props.canUse) && props.canUse(props.auth)) {
    content = <Button {...props}>{props.children}</Button>
  }
  return content
}

UdButton.defaultProps = {
  canUse: udConfigProvider.auth.canUse
}

export interface IUdButton extends ButtonProps {
  /**
   * 权限code
   */
  auth?: string
  /**
   * 判断是否可使用的方法
   * 通常不需要单独传此属性
   * @default uaaApp.canUse
   */
  canUse?: (key: string) => boolean
}

export { UdButton }
