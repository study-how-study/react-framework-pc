import React, { useState } from 'react'
import { UdForm, UdTextArea } from '../../../../index'

const Demo = () => {

  const [values, setValues] = useState('')

  return (
    <>
      <UdForm
        items={[
          { name: 'text1', label: '去掉前后空格', render: <UdTextArea />, required: true },
          { name: 'text2', label: '不去掉前后空格', render: <UdTextArea useTrim={false} />, required: true }
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
