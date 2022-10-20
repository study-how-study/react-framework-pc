import React from 'react'
import { message } from 'antd'
import { UdDateRangePicker } from '../../../../index'

const Demo = () => {

  const change = (value: [string, string]) => {
    message.success(JSON.stringify(value))
  }

  return <UdDateRangePicker defaultValue={['2020-06-21', '2020-07-21']} onChange={change} />
}

export default Demo
