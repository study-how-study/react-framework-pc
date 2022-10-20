import React from 'react'
import { message } from 'antd'
import { UdSwitch, UdForm } from '../../../../index'

const Demo = () => {
  return (
    <UdForm
      initialValues={{
        name: 'N'
      }}
      items={[
        { name: 'name', label: '测试', children: <UdSwitch checkedValue={'Y'} uncheckedValue={'N'} /> }
      ]}
      onFinish={(values) => {
        message.success(values.name)
      }}
    />
  )
}

export default Demo
