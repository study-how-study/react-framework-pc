import React from 'react'
import { message } from 'antd'
import { UdPageHeader } from '../../../index'

const Demo: React.FC = () => {
  return <UdPageHeader title="用户列表" subTitle="我是副标题" onBack={true} onRefresh={() => {
    message.success('点击了刷新')
  }} />
}

export default Demo
