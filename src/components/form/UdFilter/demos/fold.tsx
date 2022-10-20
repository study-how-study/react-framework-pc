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
        { label: '姓名3', name: 'username3' },
        { label: '姓名4', name: 'username4' },
        { label: '姓名5', name: 'username5' },
        { label: '姓名6', name: 'username6' },
        { label: '姓名7', name: 'username7' },
      ]}
      onSearch={search}
    />
  )
}

export default Demo
