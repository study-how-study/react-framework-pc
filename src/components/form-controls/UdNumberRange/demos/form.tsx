import React, { useState } from 'react'
import { UdForm, UdNumberRange } from '../../../../index'

const Demo = () => {

  const [values, setValues] = useState('')

  return (
    <>
      <UdForm
        initialValues={{
          numberB1: 10.10,
          numberB2: 28.28
        }}
        items={[
          { name: 'numberA1|numberA2', label: '年龄', render: <UdNumberRange precision={0} /> },
          {
            name: 'numberB1|numberB2', label: '金额', render:
              <UdNumberRange
                precision={2}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value ? value.replace(/\$\s?|(,*)/g, '') : ''}
              />
          }
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
