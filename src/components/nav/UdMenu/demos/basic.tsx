import React from 'react'
import { UdMenu, IMenuItem, UdSidebar, UdLayout } from '../../../index'

const Demo: React.FC = () => {

  const menus: IMenuItem[] = [
    { key: '1', text: '首页', path: '/' },
    {
      key: '2', text: '指南', children: [
        { key: '3', text: '介绍', path: '/guide/introduce' },
        { key: '4', text: '快速上手', path: '/guide/started' },
        { key: '5', text: '主题', path: '/guide/theme', target: '_blank', jumpMode: 'a' },
      ]
    }
  ]




  return (
    <UdLayout style={{ height: '300px' }}>
      <UdSidebar title="测试菜单">
        <UdMenu menus={menus} />
      </UdSidebar>
    </UdLayout>
  )
}

export default Demo
