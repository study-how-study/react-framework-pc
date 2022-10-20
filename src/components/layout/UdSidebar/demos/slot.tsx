import React, { CSSProperties } from 'react'
import { Input } from 'antd'
import { UdSidebar } from '../../../index'

let styles: {
  [key in string]: CSSProperties
} = {
  wrap: {
    height: '400px', display: 'flex', position: 'relative'
  },
  sidebarContent: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'
  }
}

const Demo = () => {
  return <div style={styles.wrap}>
    <UdSidebar
      title={<Input.Search style={{ width: '100%', margin: '0 6px' }} />}
      footer={<div>底部内容</div>}
    >
      <div style={styles.sidebarContent}>侧边栏主体内容</div>
    </UdSidebar>
  </div>
}

export default Demo
