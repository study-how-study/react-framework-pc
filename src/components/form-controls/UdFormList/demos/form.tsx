import _ from 'lodash'
import React, { useState } from 'react'
import { InputNumber } from 'antd'
import { UdForm, UdFormList } from '../../../../index'

const Demo = () => {
  const [values, setValues] = useState('')
  return (
    <>
      <UdForm
        items={[
          { label: '团队名称', name: 'name' },
          {
            label: '成员列表', name: 'users', render: (
              <UdFormList items={[
                { name: 'name', label: '姓名', rules: [{ required: true }, { max: 6 }] },
                { name: 'age', label: '年龄', render: <InputNumber /> }
              ]} />
            )
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
