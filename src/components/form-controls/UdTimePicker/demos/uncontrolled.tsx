import React from 'react'
import { message } from 'antd'
import { UdTimePicker } from '../../../../index'

const Demo = () => {
  const change = (value: string) => {
    message.success(value)
  }

  return <UdTimePicker defaultValue={'12:00'} onChange={change} />
}

export default Demo
