import React from 'react'
import { UdLayout, UdSidebar, UdMain, UdPage, UdPageHeader } from '../../../index'

const Demo = () => {
  return (
    <UdLayout style={{ height: '70vh' }}>
      <UdSidebar title="测试系统">
        侧边栏内容
      </UdSidebar>
      <UdMain>
        <UdPage>
          <UdPageHeader title="用户列表" />
          <div>其他内容</div>
        </UdPage>
      </UdMain>
    </UdLayout>
  )
}

export default Demo
