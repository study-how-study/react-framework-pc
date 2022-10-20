import React, { useState } from 'react'
import { message } from 'antd'
import { UdTimeRangePicker } from '../../../../index'

const Demo = () => {
  const [value, setValue] = useState<string[] | undefined>(['00:00:00', '01:22:12'])

  const change = (value: [string, string]) => {
    message.success(`选择时间为${value.join(',')}`)
    setValue(value)
  }

  return <UdTimeRangePicker onChange={change} value={value} format={'HH:mm:ss'} />
}

export default Demo
