import React from 'react'
import { message } from 'antd'
import { UdTimeRangePicker } from '../../../../index'

const Demo = () => {
  const change = (value: string[]) => {
    message.success(`选择时间为${value.join(',')}`)
  }

  return <UdTimeRangePicker defaultValue={['12:00', '01:02']} onChange={change} />
}

export default Demo
