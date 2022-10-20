import React from 'react'
import { message } from 'antd'
import { UdCheckbox } from '../../../../index'

const Demo = () => {

  const change = (value: boolean) => {
    message.success(value.toString())
  }

  return <UdCheckbox defaultChecked={true} onChange={change}>是否记住密码</UdCheckbox>
}

export default Demo
