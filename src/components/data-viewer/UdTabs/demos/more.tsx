import _ from 'lodash'
import React, { useState } from 'react'
import { useMount, UdTabs, IUdTabItem, IUdContextMenuItemProps, IUdTabsContextMenuItemData } from '../../../../index'

const Demo: React.FC = () => {

  const [tabs, setTabs] = useState<IUdTabItem[]>([])
  const [current, setCurrent] = useState('')

  useMount(() => {
    add()
  })

  const add = () => {
    let items = [...tabs]
    let key = _.uniqueId('tab-').toString()
    items.push({
      key: key,
      tab: '标签' + key,
      children: <p>{'标签' + key}</p>
    })
    setTabs(items)
    setCurrent(key)
  }

  const close = (item: IUdContextMenuItemProps<IUdTabsContextMenuItemData<IUdTabItem>>) => {
    let newTabs = _.clone(tabs)
    let index = _.findIndex(newTabs, n => n.key === item.data!.currentTab.key)
    _.remove(newTabs, n => n.key === item.data!.currentTab.key)
    if (item.data!.currentTab.key == current) {
      if (index > 0) {
        tabChangeByIndex(index - 1)
      } else if (newTabs.length > 0) {
        tabChangeByIndex(index + 1)
      } else {
        setCurrent('')
      }
    }
    setTabs(newTabs)
  }

  const closeOther = (item: IUdContextMenuItemProps<IUdTabsContextMenuItemData<IUdTabItem>>) => {
    let newTabs = _.clone(tabs)
    let index = _.findIndex(newTabs, n => n.key === item.data!.currentTab.key)
    _.remove(newTabs, n => n.key !== item.data!.currentTab.key)
    tabChangeByIndex(index)
    setTabs(newTabs)
  }

  const closeLeft = (item: IUdContextMenuItemProps<IUdTabsContextMenuItemData<IUdTabItem>>) => {
    let newTabs = _.clone(tabs)
    let index = _.findIndex(newTabs, n => n.key === item.data!.currentTab.key)
    let currentIndex = _.findIndex(newTabs, n => n.key === current)
    _.remove(newTabs, (n, i) => i < index)
    if (index > currentIndex) {
      tabChangeByIndex(index)
    }
    setTabs(newTabs)
  }

  const closeRight = (item: IUdContextMenuItemProps<IUdTabsContextMenuItemData<IUdTabItem>>) => {
    let newTabs = _.clone(tabs)
    let index = _.findIndex(newTabs, n => n.key === item.data!.currentTab.key)
    let currentIndex = _.findIndex(newTabs, n => n.key === current)
    _.remove(newTabs, (n, i) => i > index)
    if (index < currentIndex) {
      tabChangeByIndex(index)
    }
    setTabs(newTabs)
  }

  const closeAll = (item: IUdContextMenuItemProps<IUdTabsContextMenuItemData<IUdTabItem>>) => {
    setTabs([])
    setCurrent('')
  }

  const tabChangeByIndex = (index: number) => {
    let tab = tabs[index]
    if (tab) {
      setCurrent(tab.key)
    }
  }

  const tabEdit = (e: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action == 'remove') {
      let tab = tabs.find(n => n.key === e)
      if (tab) {
        close({ data: { currentTab: tab, currentIndex: -1 } })
      }
    } else {
      add()
    }
  }

  const tabChange = (activeKey: string) => {
    setCurrent(activeKey)
  }

  return (
    <div>
      <UdTabs
        type="editable-card"
        tabs={tabs}
        menus={[
          { content: '关闭', onClick: close },
          { content: '关闭其他', onClick: closeOther },
          { content: '关闭到左侧', onClick: closeLeft },
          { content: '关闭到右侧', onClick: closeRight },
          { content: '全部关闭', onClick: closeAll }
        ]}
        activeKey={current}
        onEdit={tabEdit}
        onChange={tabChange}
      />
    </div>
  )
}

export default Demo
