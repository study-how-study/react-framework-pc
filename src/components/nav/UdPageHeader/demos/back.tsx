import React from 'react'
import { message } from 'antd'
import { UdPageHeader } from '../../../index'

const Demo: React.FC = () => {
  return <>
    <UdPageHeader title="默认返回上一页" onBack={true} />
    <UdPageHeader title="自定义返回逻辑" onBack={() => {
      message.success('点击了后退')
    }} />
  </>
}

export default Demo
