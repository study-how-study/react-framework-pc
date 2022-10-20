import React, { useState } from 'react'
import { message } from 'antd'
import { UdDateRangePicker } from '../../../index'

const Demo = () => {

  const [value, setValue] = useState<string[]>(['2020-06-21', '2020-07-21'])

  const change = (value: [string, string]) => {
    message.success(JSON.stringify(value))
    setValue(value)
  }

  return <UdDateRangePicker value={value} onChange={change} />
}

export default Demo
