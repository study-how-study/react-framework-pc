import React from 'react'
import { message } from 'antd'
import { UdSwitch } from '../../../../index'

const Demo = () => {

  const change = (value: boolean) => {
    message.success(value.toString())
  }

  return <UdSwitch defaultChecked={true} onChange={change} />
}

export default Demo
