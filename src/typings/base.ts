import { AxiosResponse } from 'axios'
import { ReactNode } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { FormInstance } from 'antd/lib/form'


export type Modify<T, R> = Omit<T, keyof R> & R

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

export declare type RenderChildren = (form: FormInstance) => React.ReactNode

export declare type ChildrenType = React.ReactElement | RenderChildren | React.ReactElement[] | null


/** Api返回的统一结构 */
export interface IRes<T = any> {
  /** 业务响应码，200表示成功。 */
  code: number
  /** 业务数据 */
  data: T
  /** 消息内容，成功时为：success，失败时为错误消息 */
  msg: string | 'success'
  /** 响应时间戳 */
  ts: number
}

/** 列表页返回的统一结构 */
export interface IListRes<T = any> {
  content: T[]
  /** 当前页码 */
  number: number
  numberOfElements: number
  /** 每页大小 */
  size: number
  /** 总条数 */
  totalElements: number
  /** 总分页 */
  totalPages: number
}

/** 路由项信息 */
export interface IRouteItem<T = any> {
  /** 名称（可以为空，但值必须唯一）*/
  name?: string
  /** 访问路径 */
  path?: string | string[]
  /** 控制权限的唯一标识 */
  customId?: string | string[]
  /** 准确匹配 */
  exact?: boolean
  /** 组件 */
  component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
  /** 
   * 直接使用Route
   * 设置后将忽略 path,exact,component,children 属性 
   * 设置后 name 将不会自动生成
  */
  route?: ReactNode
  /** 子路由 */
  children?: IRouteItem[]
  /** 元数据 */
  meta?: T
}

export interface IColSpan {
  span?: number
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  xxl?: number
}

export interface IAxiosErrorTip {
  error: AxiosResponse
  message?: string | ReactNode
  description?: string | ReactNode
  onClose?: () => void
}

/**
 * PostMessage 模型
 */
export interface IPostMessage<T = any> {
  type: PostMessageTypes
  data?: T
}

/**
 * 消息类型
 */
export enum PostMessageTypes {
  /**
   * 刷新token
   */
  RefreshToken = 'RefreshToken',
  /** 
   * 获取token、权限等信息 
   */
  GetLoginInfo = 'LoginInfo',
  /**
   * 获取原始的系统、菜单、token、权限等信息
   */
  GetOriginLoginInfo = 'OriginLoginInfo',
  /**
   * 退出登录
   */
  Logout = 'Logout',
  /**
   * 子系统url地址发生改变
   */
  ChangeUrl = 'ChangeUrl',
  /**
   * 打开模态框
   */
  OpenModal = 'openModal',
  /**
   * 打开其他子系统的页面
   */
  OpenOtherSubSystemPage = 'OpenOtherSubSystemPage',
  /**
   * 与后端的统一消息服务
   */
  GlobalMessageBus = 'GlobalMessageBus',
  /**
   * 更新用户活跃时间
   */
  ActiveWatcherUpdataLastTime = 'ActiveWatcherUpdataLastTime',
  /**
   * 子系统保存补充授权信息
   */
  SaveMount = 'SaveMount',
  /**
   * 子系统获取补充授权信息
   */
  GetInitData = 'GetInitData',
}
