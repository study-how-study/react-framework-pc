import React from 'react'
import { Button } from 'antd'
import { UdToolbar } from '../../../index'

const Demo: React.FC = () => {
  return (
    <UdToolbar other={
      <Button.Group>
        <Button type="primary">批量通过</Button>
        <Button>批量驳回</Button>
      </Button.Group>
    }>
      <Button.Group>
        <Button type="primary">新增记录</Button>
        <Button>导出</Button>
      </Button.Group>
    </UdToolbar>
  )
}

export default Demo
