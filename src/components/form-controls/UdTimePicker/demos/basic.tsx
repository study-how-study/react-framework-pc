import { message } from 'antd'
import React, { useState } from 'react'
import { UdTimePicker } from '../../../../index'

const Demo = () => {
  const [value, setValue] = useState<string | undefined>('11:45:00')

  const change = (value: string) => {
    message.success(value)
    setValue(value)
  }

  return <UdTimePicker value={value} onChange={change} format={'HH:mm:ss'} />
}

export default Demo
