import React from 'react'
import { Button, message } from 'antd'
import { UdModal, UdModalForm } from '../../../../index'

const Demo: React.FC = () => {

  const openModal = () => {
    UdModal.open({
      title: '新增',
      content: <UdModalForm items={[
        { name: 'name', label: '应用名称', required: true },
        { name: 'creatTime', label: '创建时间' }
      ]} />,
      onOk: (values) => {
        message.success(JSON.stringify(values))
      }
    })
  }

  return <Button type="primary" onClick={openModal}>打开弹窗</Button>
}

export default Demo
