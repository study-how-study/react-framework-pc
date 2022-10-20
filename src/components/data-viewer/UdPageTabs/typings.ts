import { ReactNode } from 'react'
import { match } from 'react-router-dom'
import { IRouteItem, IUdTabItem } from '../../..'

export interface IUdPageTabsProps {
  /** 路由表 */
  routes: IRouteItem[]
  /** 标签页标题渲染方法 */
  renderTabTitle: (routeItem: IRouteItem, match: match<any>) => ReactNode
  /** 标签页切换后 */
  onTabChange?: (tab: IUdPageTabItem) => void
}

export interface IUdPageTabItem extends IUdTabItem {
  routeItem: IRouteItem
  pathname: string
  search: string
  state: any
  match: match<any>
  customId: string
  originTabKey?: string
  actions: {
    [key: string]: TabAction
  }
}

export interface IUdTabPageProps<M = any, P = any> extends match<P> {
  /** 路由元数据 */
  meta: M
  /** 标签页控制对象 */
  tabs: UdPageTabsOperator
  /** 标签页标识 */
  tabKey: string
  /** 来源标签页的标识 */
  originTabKey: string
  /** 添加标签页动作，可供其他标签页调用 */
  addTabAction: (name: string, action: TabAction) => void
  /**
   * 设置标签页刷新动作
   * 重新载入和刷新有区别
   * 重新载入是组件会销毁重新创建个新组件。
   * 刷新仅重新获取数据，所以无法统一处理完所有页面，个别页面需要此功能时，还需要手动通过此方法进行设置
   */
  setTabRefreshAction: (action: TabAction) => void
}

export type TabAction = (...params: any[]) => any

export interface UdPageTabsInstance {
  tabs: IUdPageTabItem[]
  setTabs: React.Dispatch<React.SetStateAction<IUdPageTabItem[]>>
  getTab: (key: string) => IUdPageTabItem | null,
  setTabTitle: (title: ReactNode, key: string) => void

  activeHomeTab: () => void
  activeTab: (key: string) => void
  activeTabByIndex: (index: number) => void

  /** 重新挂载Tab内容组件 */
  remountTab: (key: string) => void
  /** 
   * 调用Tab内容组件刷新方法（
   * 如果没有设定刷新方法，则调用 remountTab 方法 
   */
  refreshTab: (key: string) => void

  closeTab: (key: string) => void
  closeOtherTab: (key: string) => void
  closeLeftTab: (key: string) => void
  closeRightTab: (key: string) => void
  closeAllTab: () => void
}

export interface UdPageTabsOperator {
  /**
   * 设置标签页标题
   * 如果不传入tabKey，则设置自身
   */
  setTabTitle: (title: ReactNode, tabKey?: string) => void
  /**
   * 重新挂载标签页
   * 如果不传入tabKey，则重新挂载自身
   */
  remountTab: (tabKey?: string) => void
  /**
   * 刷新标签页
   * 如果不传入tabKey，则刷新自身
   */
  refreshTab: (tabKey?: string) => void
  /**
   * 关闭标签页
   * 如果不传入tabKey，则关闭自身
   */
  closeTab: (tabKey?: string) => void
  /**
   * 刷新来源标签页并关闭自身标签页
   */
  refreshOriginTabAndCloseTab: () => void
}