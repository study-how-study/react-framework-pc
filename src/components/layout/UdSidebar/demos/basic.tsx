import React, { CSSProperties } from 'react'
import { UdSidebar, UdMain, UdPage } from '../../../index'

let styles: {
  [key in string]: CSSProperties
} = {
  wrap: {
    height: '400px', display: 'flex', position: 'relative'
  },
  sidebarContent: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'
  },
  page: {
    height: '100%', backgroundColor: '#eaedf2', display: 'flex', alignItems: 'center', justifyContent: 'center'
  }
}

const Demo = () => {
  return (
    <div style={styles.wrap}>
      <UdSidebar title="用户管理系统">
        <div style={styles.sidebarContent}>侧边栏主体内容</div>
      </UdSidebar>
      <UdMain>
        <UdPage style={styles.page}>
          子页内容
        </UdPage>
      </UdMain>
    </div>
  )
}

export default Demo
