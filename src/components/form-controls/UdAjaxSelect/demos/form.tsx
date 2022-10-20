import React from 'react'
import { message } from 'antd'
import { UdForm, UdAjaxSelect } from '../../../../index'

const Demo = () => {
  return (
    <UdForm
      initialValues={{
        city: 32
      }}
      items={[
        { name: 'city', label: '选择城市', children: <UdAjaxSelect query="http://10.4.100.71:7300/mock/5f1e2923354a5600202741f3/uaf/ajax-select/basic" /> }
      ]}
      onFinish={(values) => {
        message.success("选中的值为：" + values.city)
      }}
    />
  )
}

export default Demo
