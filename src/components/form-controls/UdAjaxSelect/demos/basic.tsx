import React, { useState } from 'react'
import { UdAjaxSelect } from '../../../../index'

const Demo = () => {

  const [value, setValue] = useState()

  const change = (value: any) => {
    setValue(value)
  }

  return (
    <UdAjaxSelect
      style={{ width: '200px' }}
      value={value}
      onChange={change}
      query="http://10.4.100.71:7300/mock/5f1e2923354a5600202741f3/uaf/ajax-select/basic"
    />
  )
}

export default Demo
