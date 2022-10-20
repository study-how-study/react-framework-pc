import React from 'react'
import { Button, message } from 'antd'
import { UdModal } from '../../../../index'

const Demo: React.FC = () => {

  const openModal = () => {
    UdModal.open({
      title: '弹框基本用法',
      content: <div>类型为 ReactNode</div>,
      onOk: () => {
        message.success('点击确定')
      },
      onCancel: () => {
        message.error('点击取消')
      }
    })
  }

  const openConfirm = () => {
    UdModal.confirm({
      content: `确定要删除吗？${new Date().getTime()}`,
      onOk: () => {
        message.success('点击确定')
      },
      onCancel: () => {
        message.error('点击取消')
      }
    })
  }

  return (
    <Button.Group>
      <Button type="primary" onClick={openModal}>打开弹窗</Button>
      <Button type="primary" onClick={openConfirm}>Confirm</Button>
    </Button.Group>
  )
}

export default Demo
