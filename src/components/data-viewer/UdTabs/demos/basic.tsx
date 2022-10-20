import React from 'react'
import { message } from 'antd'
import { UdTabs, IUdTabItem, IUdContextMenuItemProps, IUdTabsContextMenuItemData } from '../../../../index'

const Demo: React.FC = () => {

  const click = (e: IUdContextMenuItemProps<IUdTabsContextMenuItemData<IUdTabItem>>) => {
    console.log(e)
    message.success(`menu:${e.content} ，tab:${e.data?.currentTab.tab}`)
  }

  return (
    <div>
      <UdTabs
        tabs={[
          { key: '1', tab: '标签1', children: '标签1' },
          { key: '2', tab: '标签2', children: '标签2' },
          { key: '3', tab: '标签3', children: '标签3' },
          { key: '4', tab: '标签4', children: '标签4' },
        ]}
        menus={[
          { content: '菜单1', onClick: click },
          { content: '菜单2', onClick: click },
          { content: '菜单3', onClick: click },
          { content: '菜单4', onClick: click },
        ]}
      />
    </div>
  )
}

export default Demo
