import { IRouteItem } from '.'
import { ReactNode } from 'react'
import { RouteComponentProps } from 'react-router-dom'

/** Uaa子系统原始登录信息 */
export interface IUaaOriginLoginInfo {
  Authorization: IUaaTokenData
  systemInfo: IUaaAppInfo
  systemSelectKey: string
  urls: {
    [key: string]: string
  }
}

/** Uaa子系统授权信息 */
export interface IUaaTokenData {
  accessToken: string
  accessTokenExpireTime: string
  refreshToken: string
  refreshTokenExpireTime: string
}

/** Uaa子系统信息 */
export interface IUaaAppInfo {

  /** 当前用户信息 */
  profile: IUaaUserProfile

  /** 各子系统前端访问地址 */
  webUrls: {
    [id: string]: string
  }
  /** 各子系统后端接口地址 */
  urls: {
    [id: string]: string
  }

  /** 包含的所有权限code */
  authorities: string[]

  /** 未知 */
  attributes: any

  /** 菜单及其相关权限 */
  generalMenus: IUaaMenu[]
}

export interface IUaaUserProfile {
  id: string
  username: string
  jobNumber: string
  name: string
  phone: any
  department: any
  orgDimensionCode: string
  orgUnitCode: string
  erhOrgUnitCode: string
  title: string
  userType: string
  dept: any
  post: any
}

/** Uaa子系统菜单 */
export interface IUaaMenu {
  /** 顺序 */
  orderIndex?: number
  /** 唯一标识 */
  customId: string
  /** 显示文本 */
  text: string
  /** 所属子系统code */
  application?: string
  /** 图标名 */
  icon?: string | null
  /** 类型 */
  type?: 'GROUP' | 'INNER_LINK' | 'BLANK_LINK' | 'RESOURCE_INNER_LINK' | 'RESOURCE_BLANK_LINK'
  /** 菜单点击后链接的地址，新系统才会使用。具体可询问 胡耀 */
  link?: string
  /** 子级 */
  items?: IUaaMenu[]
}


/** Uaa子系统启动参数 */
export interface IUaaAppStartOptions {
  /** 子系统Code */
  appCode: string
  /** 路由数组表 */
  routes: IRouteItem[]
  /** 根据菜单customId查找跳转地址和菜单关系，默认值为：true */
  autoMapMenu?: boolean

  /** 管理中心(UAA)页面地址，不设置则使用默认的 */
  centerUrl?: string

  /** 
   * 登录组件
   * 用于子系统拥有独立登录界面时使用。
   */
  loginComponent?: ReactNode

  loginApiBaseUrl?: string

  /**
   * 使用全局消息
   * @default true
   */
  useMsgBus?: boolean

  /** 本地开发所需相关信息 */
  local?: IUaaAppStartLocalOptions

  pageLoader?: (path: string) => React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>

  /** 启动react时的render方法 */
  success: (entry?: IUaaOtherEntry | null) => void
  /**
   * 框架开启用户活跃监听，uaa子系统与uaa跨域导致uaa无法监听子系统iframe事件时需要开启
   * @default false
   */
  useActiveWatcher?: boolean

  otherEntry?: IUaaOtherEntry[]
}

/** Uaa子系统本地启动参数 */
export interface IUaaAppStartLocalOptions {
  /** 本地开发，是否使用本地测试菜单 */
  useLocalMenu: boolean
  /** 本地开发，测试使用的菜单 */
  menus: IUaaMenu[]
  /** 本地开发，应用服务接口地址，为空时则使用授权服务返回的地址 */
  apiBaseUrl?: string
  /** 本地开发，授权服务接口地址 */
  loginApiBaseUrl: string
  /** 本地开发，登录时自动填入的账号 */
  username?: string
  /** 本地开发，登录时自动填入的密码 */
  password?: string
}

export interface IUaaOtherEntry {
  name?: string
  path: string
  /** 
   * 入口类型
   * 决定他的启动方式
   * standard 和主入口一样
   * extra-authorize 不检查菜单权限
   * @default standard
   */
  type?: 'standard' | 'extra-authorize'
  component: React.ComponentType<any>
}
