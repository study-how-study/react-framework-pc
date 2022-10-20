import React, { useState } from 'react'
import { Input, Select } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { UdForm, UdDatePicker, UdDateRangePicker } from '../../../../index'

const { Option } = Select

const Demo = () => {

  const [result, setResult] = useState('')

  const submit = (values: Store) => {
    setResult(JSON.stringify(values, null, 4))
  }

  return (
    <>
      <UdForm
        items={[
          { label: '姓名', name: 'username' },
          { label: '密码', name: 'password', children: <Input.Password /> },
          { label: '生日', name: 'birthday', children: <UdDatePicker /> },
          {
            label: '爱好', name: 'hobby', children: <Select placeholder="自定义placeholder内容">
              <Option value="a">篮球</Option>
              <Option value="b">足球</Option>
              <Option value="c">游泳</Option>
            </Select>
          },
          { label: '有效期', name: 'date1|date2', children: <UdDateRangePicker /> },
        ]}
        onFinish={submit}
      />
      <pre>{result}</pre>
    </>
  )
}

export default Demo
