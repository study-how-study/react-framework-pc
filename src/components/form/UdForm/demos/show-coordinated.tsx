import React, { useState } from 'react'
import { Select } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { UdForm } from '../../../../index'

const Option = Select.Option

const Demo = () => {

  const [result, setResult] = useState('')
  const [country, setCountry] = useState('cn')

  function submit(values: Store) {
    setResult(JSON.stringify(values, null, 4))
  }

  function formValuesChange(changedValues: Store, values: Store) {
    if (changedValues.country !== undefined) {
      setCountry(changedValues.country)
    }
  }

  return (
    <>
      <UdForm
        onValuesChange={formValuesChange}
        initialValues={{
          country: 'cn'
        }}
        items={[
          { label: '姓名', name: 'username' },
          {
            label: '国家', name: 'country', children: (
              <Select>
                <Option value="cn">中国</Option>
                <Option value="other">外国</Option>
              </Select>
            )
          },
          country == 'cn' && { label: '身份证', name: 'id' },
          country == 'cn' && { label: '民族', name: 'minzu' },
          { label: '生日', name: 'password' },
        ]}
        onFinish={submit}
      />
      <pre>{result}</pre>
    </>
  )
}

export default Demo
