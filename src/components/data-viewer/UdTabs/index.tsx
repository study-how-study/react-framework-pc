import _ from 'lodash'
import React, { ReactNode, useEffect } from 'react'
import classNames from 'classnames'
import { Tabs, Tooltip } from 'antd'
import { TabPaneProps, TabsProps } from 'antd/lib/tabs'
import { IUdContextMenuItem, IUdContextMenuItemProps, useContextMenu } from '../../..'

const TabPane = Tabs.TabPane

const UdTabs: React.FC<IUdTabsProps> = (props) => {

  const { bindContextMenu, triggerElement } = useContextMenu()

  useEffect(() => {
    return bindContextMenu((e) => {
      let dom = _.find<HTMLDivElement>(e.path, (node: HTMLElement) => node.classList && node.classList.contains('ant-tabs-tab'))
      if (dom && dom.parentNode) {
        let index = Array.from(dom.parentNode.children).indexOf(dom)
        if (_.isFunction(props.menus)) {
          return props.menus(index)
        }

        if (props.menus) {
          return props.menus.map((item) => {
            if (React.isValidElement(item)) {
              return item
            } else {
              return { ...(item as IUdTabsContextMenuItemProps), ...{ data: { currentTab: props.tabs[index], currentIndex: index } } }
            }
          })
        }
      }
    })
  })

  const { tabs, menus, ...tabsProps } = props

  return (
    <div className={classNames('ud-tabs-wrapper', props.className)} ref={(e) => {
      e && (triggerElement.current = e.querySelector<HTMLElement>('.ant-tabs-nav-list')!)
    }}>
      <Tabs {...tabsProps}>
        {tabs.map(item => {
          let { btns, tab, children, ...other } = item
          if (btns && btns.length > 0) {
            tab = (
              <span className="ud-tabs-tabpane-senior">
                <span className="ud-tabs-tabpane-senior-text">{tab}</span>
                <span className="ud-tabs-tabpane-senior-btns" onClick={(e) => e.stopPropagation()}>
                  {btns.map(n => (
                    n.tooltip ? <Tooltip key={n.key} placement="bottom" title={n.tooltip}>{n.node}</Tooltip> : n.node
                  ))}
                </span>
              </span>
            )
          }
          return <TabPane tab={tab} {...other}>{children}</TabPane>
        })}
      </Tabs>
    </div>
  )
}

export interface IUdTabsProps extends TabsProps {
  tabs: IUdTabItem[]
  menus?: ((index: number) => IUdContextMenuItem[] | void) | IUdTabsContextMenuItem[]
}

export interface IUdTabItem<T = any> extends TabPaneProps {
  key: string
  tab: ReactNode
  btns?: IUdTabItemBtn[]
  data?: T
}

export interface IUdTabItemBtn {
  key: string
  tooltip?: string
  node: ReactNode
}


export interface IUdTabsContextMenuItemProps<T = IUdTabItem> extends IUdContextMenuItemProps<IUdTabsContextMenuItemData<T>> {
  data: IUdTabsContextMenuItemData<T>
  onClick?: (e: IUdContextMenuItemProps<IUdTabsContextMenuItemData<T>>) => void
}

export interface IUdTabsContextMenuItemData<T = IUdTabItem> {
  currentTab: T
  currentIndex: number
}

export type IUdTabsContextMenuItem = ReactNode | IUdTabsContextMenuItemProps

export { UdTabs }
