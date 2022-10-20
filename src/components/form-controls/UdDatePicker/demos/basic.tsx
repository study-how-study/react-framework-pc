import React, { useState } from 'react'
import { message } from 'antd'
import { UdDatePicker } from '../../../../index'

const Demo = () => {

  const [value, setValue] = useState<string | undefined>('2020-07-21')

  const change = (value: string) => {
    message.success(value)
    setValue(value)
  }

  return <UdDatePicker value={value} onChange={change} />
}

export default Demo
