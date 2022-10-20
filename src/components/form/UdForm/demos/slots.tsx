import React, { useState } from 'react'
import { Alert, Row, Col, Form, Input } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { UdForm, UdDatePicker, UdDateRangePicker } from '../../../../index'

const Demo = () => {

  const [result, setResult] = useState('')

  const layouts = UdForm.defaultLayouts.horizontal

  const submit = (values: Store) => {
    setResult(JSON.stringify(values, null, 4))
  }

  return (
    <>
      <UdForm
        header={<Row><Col {...layouts.tailFormItemLayout}><h3>用户信息</h3></Col></Row>}
        items={[
          { label: '姓名', name: 'username' },
          { label: '密码', name: 'password', children: <Input.Password /> },
          { label: '生日', name: 'birthday', children: <UdDatePicker /> },
          { label: '有效期', name: 'date1|date2', children: <UdDateRangePicker /> },
        ]}
        footer={<Alert message="请填写你的真实信息" />}
        onFinish={submit}
      >
        {
          <Form.Item label="其他" name="other" {...layouts}>
            <Input />
          </Form.Item>
        }
      </UdForm>
      <pre>{result}</pre>
    </>
  )
}

export default Demo
