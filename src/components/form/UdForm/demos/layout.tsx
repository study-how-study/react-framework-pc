import React, { useState } from 'react'
import { Button, Input } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { UdForm, UdDatePicker, UdDateRangePicker, UdFormLayout } from '../../../../index'

const Demo = () => {

  const [result, setResult] = useState('')
  const [layout, setLayout] = useState<UdFormLayout>('horizontal')

  const layouts: UdFormLayout[] = ['horizontal', 'inline', 'vertical', 'grid']

  const submit = (values: Store) => {
    setResult(JSON.stringify(values, null, 4))
  }

  return (
    <>
      <Button.Group style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #e8e8e8', width: '100%' }}>
        {
          layouts.map(item => (
            <Button type={layout == item ? 'primary' : 'default'} onClick={() => setLayout(item)}>{item}</Button>
          ))
        }
      </Button.Group>
      <UdForm
        layout={layout}
        items={[
          { label: '姓名', name: 'username', required: true, col: { span: 8 } },
          { label: '密码', name: 'password', children: <Input.Password />, required: true, col: { span: 8 } },
          { label: '生日', name: 'birthday', children: <UdDatePicker />, col: { span: 8 } },
          { label: '有效期', name: 'date1|date2', children: <UdDateRangePicker />, col: { span: 12 } },
          layout != 'inline' && { label: '个人描述', name: 'desc', children: <Input.TextArea rows={5} />, col: { span: 24 } },
        ]}
        onFinish={submit}
      />
      <pre>{result}</pre>
    </>
  )
}

export default Demo
