import React, { useState } from 'react'
import { UdForm, UdTimeRangePicker } from '../../../../index'

const Demo = () => {
  const [values, setValues] = useState('')

  return (
    <>
      <UdForm
        items={[
          { label: '姓名', name: 'name' },
          { label: '年龄', name: 'age' },
          { label: '有效时间', name: 'time', render: <UdTimeRangePicker /> },
        ]}
        onFinish={(values) => {
          setValues(JSON.stringify(values, null, 4))
        }}
      />
      <pre>{values}</pre>
    </>
  )
}

export default Demo
