import { ReactNode } from 'react'
import { Store } from 'antd/lib/form/interface'

export interface IListQueryParams {
  page: number
  size: number
  conditions: Store
  direction: 'NEXT' | 'PREVIOUS',
  dataId: string | number | null,
  v: number
}

export interface IBaseListPageSlots {
  /**
   * 页头下方区域
   */
  header?: ReactNode
  /**
   * 检索条件下方区域
   */
  filterBelow?: ReactNode
  /**
   * 检索操作按钮下方区域
   */
  buttonBelow?: ReactNode
  /**
   * 页面底部区域
   */
  footer?: ReactNode
}