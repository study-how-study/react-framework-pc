import React from 'react'
import { message } from 'antd'
import { UdDatePicker } from '../../../../index'

const Demo = () => {

  const change = (value: string) => {
    message.success(value)
  }

  return <UdDatePicker defaultValue={'2020-07-21'} onChange={change} />
}

export default Demo
