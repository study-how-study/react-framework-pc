import _ from 'lodash'
import pathToRegexp from 'path-to-regexp'
import React, { ReactNode, useState, useRef, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { ClassValue } from 'classnames/types'
import { Menu } from 'antd'
import { Icon } from '@ant-design/compatible'
import { routeUtils, useMount } from '../../../'

const SubMenu = Menu.SubMenu

/**
 * 菜单
 */
const UdMenu: React.FC<IUdMenuProps> = (props) => {

  const history = useHistory()
  const location = useLocation()
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const menuNodes = useRef<ReactNode[] | undefined>()

  function handleOpenAndSelected(path: string) {
    let opens: string[] = []
    let selecteds: string[] = []
    let pathObj = routeUtils.parsePath(path)

    const match = (item: IMenuItem) => {

      let matchInner = (relevants: any[]) => {
        for (let i = 0; i < relevants.length; i++) {
          let regex = pathToRegexp(relevants[i])
          if (pathObj.path.match(regex)) {
            return true
          }
        }
        return null
      }

      if (_.isArray(item.relevantPaths) && item.relevantPaths.length > 0) {
        if (matchInner(item.relevantPaths)) {
          return true
        }
      }
      if (props.relevants && props.relevants[item.key]) {
        if (matchInner(props.relevants[item.key])) {
          return true
        }
      }
      if (item.path && item.path === path) {
        return true
      }
      return false
    }

    const recursion = (items: IMenuItem[], parents: string[]) => {
      for (const item of items) {
        if (match(item)) {
          selecteds.push(item.key)
          opens = opens.concat(parents)
        }
        if (item.children) {
          parents.push(item.key)
          recursion(item.children, parents)
          parents.pop()
        }
      }
    }

    recursion(props.menus, [])
    setOpenKeys(opens)
    setSelectedKeys(selecteds)
  }

  function findMenuByKey(key: string): IMenuItem | null {
    let result: IMenuItem | null = null
    const recursion = (items: IMenuItem[]) => {
      for (const item of items) {
        if (item.key == key) {
          result = item
        }
        if (result == null && item.children) {
          recursion(item.children)
        }
      }
    }
    recursion(props.menus)
    return result
  }

  function buildMenu(items: IMenuItem[]): ReactNode[] | undefined {
    if (!_.isArray(items) || items.length == 0) {
      return
    }
    let nodes = []
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        nodes.push(
          <SubMenu key={item.key} title={buildMenuTitle(item, true)}>
            {buildMenu(item.children)}
          </SubMenu>
        )
      } else {
        nodes.push(<Menu.Item key={item.key}>{buildMenuTitle(item, false)}</Menu.Item>)
      }
    }
    return nodes
  }

  function buildMenuTitle(menu: IMenuItem, hasChildren: boolean): ReactNode {
    let icon = menu.icon
    if (menu.icon && menu.icon != 'fa fa-list') {
      if (_.isString(menu.icon)) {
        icon = <Icon type={menu.icon} />
      }
    } else {
      icon = <Icon />
    }
    let content = <span className="name" title={_.isString(menu.text) ? menu.text : ''}>{menu.text}</span>
    if (hasChildren) {
      return <>{icon}{content}</>
    } else {
      return <a href={menu.externalUrl || menu.path} target={menu.target}>{icon}{content}</a>
    }
  }

  function menuClick(e: any) {
    let menu = findMenuByKey(e.key)
    if (menu) {
      if (props.onMenuItemClick) {
        props.onMenuItemClick(menu)
      } else {
        let path = menu.path
        if (path) {
          if (props.extraPaths && props.extraPaths[e.key]) {
            path = props.extraPaths[e.key](path)
          }
          if (menu.jumpMode !== 'a') {
            e.domEvent.preventDefault()
            history.push(path)
          }
        }
      }
    }
  }

  function menuOpenChange(openKeys: any) {
    setOpenKeys(openKeys)
  }

  useMount(() => {
    let nodes = buildMenu(props.menus)
    menuNodes.current = nodes
  })

  useEffect(() => {
    handleOpenAndSelected(location.pathname)
  }, [location.pathname])

  return (
    <div className="ud-menu">
      <Menu
        inlineIndent={10} theme="light" mode="inline"
        onClick={menuClick}
        onOpenChange={menuOpenChange}
        openKeys={openKeys}
        selectedKeys={selectedKeys}>
        {menuNodes.current}
      </Menu>
    </div>
  )
}

export interface IUdMenuProps {
  /**
   * class
   * 始终会带一个 ud-menu 的 class
   */
  className?: ClassValue
  /** 
   * 菜单集合
   */
  menus: IMenuItem[]
  /**
   * 点击菜单项事件
   * 可通过此参数来自定义点击后的跳转逻辑
   */
  onMenuItemClick?: (item: IMenuItem) => void
  /**
   * 菜单和路由的额外关联关系
   */
  relevants?: IMenuRelevants
  /**
   * 扩展路径
   */
  extraPaths?: IMenuExtraPath
}

export interface IMenuItem {
  /** 
   * Key
   * 可使用 customId
   */
  key: string
  /** 
   * 显示内容
   */
  text: ReactNode
  /** 
   * 跳转路径 
   */
  path?: string
  /**
   * 外部地址，超链接地址
   * 可用于 菜单超链接地址和点击菜单地址 为不同的地址
   * 为空时，则取 path 属性。
   */
  externalUrl?: string
  /**
   * 打开方式
   * 空：表示本窗口
   * _blank：新窗口
   */
  target?: '_blank'
  /**
   * 跳转方式
   * route: 前端路由模式
   * a: 超链接跳转
   * @default route
   */
  jumpMode?: 'route' | 'a'
  /** 
   * 图标，string：antd icon name
   * @type string | ReactNode
   */
  icon?: string | ReactNode
  /** 
   * 子菜单
   */
  children?: IMenuItem[],
  /** 
   * 关联其他路径 
   */
  relevantPaths?: (string | RegExp)[]
}

export interface IMenuRelevants {
  [customId: string]: (string | RegExp)[]
}

export interface IMenuExtraPath {
  [key: string]: (path: string) => string
}

export { UdMenu }
