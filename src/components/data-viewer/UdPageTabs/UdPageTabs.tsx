import _ from 'lodash'
import React, { MutableRefObject, ReactNode, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation, matchPath, match, withRouter } from 'react-router-dom'
import { message } from 'antd'
import { ReloadOutlined, CloseOutlined } from '@ant-design/icons'
import { IRouteItem, UdTabs, UdRouterFallback } from '../../../'
import { IUdPageTabItem, IUdPageTabsProps, IUdTabPageProps, UdPageTabsInstance } from './typings'
import './style.less'

const UdPageTabs: React.FC<IUdPageTabsProps> = (props) => {

  const location = useLocation()
  const history = useHistory()

  const [tabs, setTabs] = useState<IUdPageTabItem[]>([])
  const [currentTabKey, setCurrentTabKey] = useState('')

  const [homePageComponent, setHomePageComponent] = useState<any>()

  const instance: MutableRefObject<UdPageTabsInstance> = useRef<UdPageTabsInstance>()

  instance.current = useMemo(() => ({
    tabs, setTabs,
    getTab: (key: string) => {
      return tabs.find(n => n.key == key)
    },
    setTabTitle: (title: ReactNode, key: string) => {
      let tab = instance.current.getTab(key)
      if (tab) {
        tab.tab = title
        setTabs([...tabs])
      }
    },

    activeHomeTab: () => {
      history.push({ pathname: '/' })
    },
    activeTab: (key: string) => {
      let tab = tabs.find(n => n.key === key)
      if (tab) {
        history.push({ pathname: tab.pathname, search: tab.search, state: tab.state })
      }
    },
    activeTabByIndex: (index: number) => {
      let tab = tabs[index]
      if (tab) {
        history.push({ pathname: tab.pathname, search: tab.search, state: tab.state })
      }
    },

    remountTab: (key: string) => {
      let tab = tabs.find(n => n.key === key)
      if (tab) {
        let newTabs = [...tabs]
        tab.actions['remount']()
        setTabs(newTabs)
      }
    },
    refreshTab: (key: string) => {
      let tab = tabs.find(n => n.key === key)
      if (tab) {
        if (_.isFunction(tab.actions['refresh'])) {
          tab.actions['refresh']()
        } else {
          let newTabs = [...tabs]
          tab.actions['remount']()
          setTabs(newTabs)
        }
      }
    },

    closeTab: (key: string) => {
      let newTabs = [...tabs]
      let index = _.findIndex(newTabs, n => n.key === key)
      _.remove(newTabs, n => n.key === key)
      setTabs(newTabs);
      if (key == currentTabKey) {
        if (index > 0) {
          instance.current.activeTabByIndex(index - 1)
        } else if (newTabs.length > 0) {
          instance.current.activeTabByIndex(index + 1)
        } else {
          instance.current.activeHomeTab()
        }
      }
    },
    closeOtherTab: (key: string) => {
      let newTabs = [...tabs]
      let index = _.findIndex(newTabs, n => n.key === key)
      _.remove(newTabs, n => n.key !== key)
      instance.current.activeTabByIndex(index)
      setTabs(newTabs)
    },
    closeLeftTab: (key: string) => {
      let newTabs = [...tabs]
      let index = _.findIndex(newTabs, n => n.key === key)
      let currentIndex = _.findIndex(newTabs, n => n.key === currentTabKey)
      _.remove(newTabs, (n, i) => i < index)
      if (index > currentIndex) {
        instance.current.activeTabByIndex(index)
      }
      setTabs(newTabs)
    },
    closeRightTab: (key: string) => {
      let newTabs = [...tabs]
      let index = _.findIndex(newTabs, n => n.key === key)
      let currentIndex = _.findIndex(newTabs, n => n.key === currentTabKey)
      _.remove(newTabs, (n, i) => i > index)
      if (index < currentIndex) {
        instance.current.activeTabByIndex(index)
      }
      setTabs(newTabs)
    },
    closeAllTab: () => {
      instance.current.activeHomeTab()
      setTabs([])
    }
  }), [tabs])

  useEffect(() => {
    let route = props.routes.find(n => n.path === '/')
    if (route && route.component) {
      setHomePageComponent(route.component)
    }
  }, [props.routes])

  useEffect(() => {
    if (location.pathname === '/') {
      return
    }
    let newTabs = [...tabs]

    let change = (newTabKey: string) => {
      if (newTabKey != currentTabKey) {
        let oldTab = newTabs.find(n => n.key == currentTabKey)
        if (oldTab && oldTab.btns) {
          oldTab.btns = buildTabBtns(currentTabKey, ['close'])
        }
      }
      setTabs(newTabs)
      setCurrentTabKey(newTabKey)
    }

    let tab = newTabs.find(n => n.pathname === location.pathname && n.search === location.search)
    if (tab) {
      tab.btns = buildTabBtns(tab.key, ['remount', 'close'])
      change(tab.key)
    } else {
      let matchResult: match<any> | null = null
      let routeItem = props.routes.find(n => {
        matchResult = matchPath(location.pathname, { path: n.path, exact: n.exact })
        return matchResult != null
      })
      if (routeItem && matchResult) {
        tab = buildTab(routeItem, matchResult as IUdTabPageProps)
        newTabs.push(tab)
        change(tab.key)
      } else {
        message.error('不存在的页面')
      }
    }
    if (props.onTabChange && tab) {
      props.onTabChange(tab)
    }
  }, [location])


  const buildTab = (routeItem: IRouteItem, matchResult: IUdTabPageProps) => {
    let tabKey = _.uniqueId('tab-')
    let tab: IUdPageTabItem = {
      key: tabKey,
      routeItem,
      pathname: location.pathname,
      state: location.state,
      search: location.search,
      match: matchResult,
      customId: routeItem.customId as string,
      originTabKey: currentTabKey,
      actions: {}
    } as unknown as IUdPageTabItem

    tab.tab = props.renderTabTitle(routeItem, matchResult)
    tab.actions['remount'] = () => tab.children = buildTabContent(tab)
    tab.btns = buildTabBtns(tabKey, ['remount', 'close'])
    tab.children = buildTabContent(tab)
    return tab
  }

  const buildTabBtns = (tabKey: string, btns: ('remount' | 'close')[]) => {
    let all = {
      'remount': { key: 'remount', tooltip: '重新加载', node: <ReloadOutlined key="remount" onClick={() => instance.current.remountTab(tabKey)} /> },
      'close': { key: 'close', tooltip: '关闭', node: <CloseOutlined key="close" onClick={() => instance.current.closeTab(tabKey)} /> }
    }
    return btns.map(n => all[n])
  }

  const buildTabContent = (tab: IUdPageTabItem) => {
    let Component = withRouter(tab.routeItem.component)
    let componentProps: IUdTabPageProps = tab.match as IUdTabPageProps
    if (tab.routeItem.meta) {
      componentProps.meta = tab.routeItem.meta
    }
    componentProps.originTabKey = currentTabKey
    componentProps.tabKey = tab.key
    componentProps.addTabAction = (name, action) => {
      tab.actions[name] = action
    }
    componentProps.setTabRefreshAction = (action) => {
      tab.actions['refresh'] = action
    }
    componentProps.tabs = {
      setTabTitle: (title: ReactNode, tabKey?: string) => {
        instance.current.setTabTitle(title, tabKey || tab.key)
      },
      remountTab: (tabKey?: string) => {
        instance.current.remountTab(tabKey || tab.key)
      },
      refreshTab: (tabKey?: string) => {
        instance.current.refreshTab(tabKey || tab.key)
      },
      closeTab: (tabKey?: string) => {
        instance.current.closeTab(tabKey || tab.key)
      },
      refreshOriginTabAndCloseTab: () => {
        instance.current.refreshTab(tab.originTabKey)
        instance.current.closeTab(tab.key)
      }
    }
    return (
      <Suspense fallback={<UdRouterFallback />}>
        <Component {...componentProps} />
      </Suspense>
    )
  }

  const getMenus = (index: number) => {
    let tabKey = tabs[index].key
    let menus = [
      { content: '关闭', onClick: () => instance.current.closeTab(tabKey) },
      { content: '关闭其他', onClick: () => instance.current.closeOtherTab(tabKey) },
      { content: '关闭到左侧', onClick: () => instance.current.closeLeftTab(tabKey) },
      { content: '关闭到右侧', onClick: () => instance.current.closeRightTab(tabKey) },
      { content: '全部关闭', onClick: () => instance.current.closeAllTab() },
      { content: '重新加载', onClick: () => instance.current.remountTab(tabKey) }
    ]
    return menus
  }

  const useHomePage = (!Array.isArray(tabs) || tabs.length == 0) && homePageComponent
  const HomePageComponent = homePageComponent

  return (
    <>
      {
        !useHomePage && (
          <UdTabs
            className="ud-page-tabs"
            tabs={tabs}
            menus={getMenus}
            type="card"
            animated={false}
            hideAdd={true}
            activeKey={currentTabKey}
            onChange={instance.current.activeTab}
          />
        )
      }
      {useHomePage && (
        <Suspense fallback={<UdRouterFallback />}>
          {<HomePageComponent />}
        </Suspense>
      )}
    </>
  )
}

export { UdPageTabs }
