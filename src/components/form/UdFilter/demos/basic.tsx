import React from 'react'
import { message } from 'antd'
import { UdFilter } from '../../../../index'

const Demo = () => {

  const search = (values: any) => {
    message.info(JSON.stringify(values))
  }

  return (
    <UdFilter
      items={[
        { label: '姓名1', name: 'username1' },
        { label: '姓名2', name: 'username2' },
        { label: '姓名3', name: 'username3' }
      ]}
      onSearch={search}
    />
  )
}

export default Demo
