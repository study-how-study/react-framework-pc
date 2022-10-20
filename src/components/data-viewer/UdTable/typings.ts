import React, { ReactElement, ReactNode } from 'react'
import { ColumnProps, TableProps } from 'antd/lib/table'
import { SortOrder } from 'antd/lib/table/interface'
import { Store } from 'antd/lib/form/interface'
import { FormInstance, FormItemProps, FormProps, RuleObject } from 'antd/lib/form'
import { Modify } from '../../..'

export interface IUdTableProps<T = any> extends Modify<TableProps<T>, {
  columns?: IUdColumn<T>[]
  sortValues?: {
    key: string
    value: SortOrder
  }[]
}> {
  rowKey?: string
  /**
   * 表格唯一标识
   * @default 项目标识 + 页面路径
   */
  tableKey?: string
  /**
   * 列配置
   */
  columns?: IUdColumn<T>[]
  /** 
   * 是否允许自定义显示列
   * 使用此功能必须保住tableKey是一个有效的值
   * @default true
   */
  useColumnCustomize?: boolean
  /**
   * 编辑表单props
   */
  formProps?: FormProps
  /**
   * 是否可编辑，配置后 keepSelectedRows 固定为false, useRowSelectionDefaultHandler 固定为true
   */
  editable?: boolean
  /**
   * 允许导出
   * @default true
   */
  useExport?: boolean | UdTableExportFormats[]
  /**
   * Toolbar 是否使用固钉
   */
  useToolbarAffix?: boolean
  /**
   * 工具栏左边按钮
   * @type (ReactNode | (() => ReactNode))[] | ReactNode
   */
  leftBtns?: (ReactNode | (() => ReactNode))[] | ReactNode
  /**
   * 工具栏右边按钮
   * @type (ReactNode | (() => ReactNode))[] | ReactNode
   */
  rigthBtns?: (ReactNode | (() => ReactNode))[] | ReactNode
  /**
   * 页面容器
   */
  pageContainer?: Window | HTMLElement
  /**
   * 水印配置
   */
  watermark?: ITableWatermark
  /**
   * column 默认最大宽度，单位 px
   * @default 1000
   */
  columnDefaultMaxWidth?: number
  /**
   * buttonBelow 按钮下方插入的元素
   */
  buttonBelow?: ReactNode
  /**
   * 编辑表单时，错误提示显示模式
   * 在 size = small 时，此属性值固定为 tooltip
   * @default default
   */
  formErrorTipMode?: 'default' | 'tooltip'
  /**
   * 使用框架内置的 RowSelection 处理器
   * keepSelectedRows=false时才有用
   * @default true
   */
  useRowSelectionDefaultHandler?: boolean
  /**
   * 分页时保留选中行数据
   * editable = true时， keepSelectedRows固定为false（编辑表格不允许跨页选中）
   * @default false
   */
  keepSelectedRows?: boolean
}

export interface IUdColumn<T = any> extends ColumnProps<T> {
  /** 
   * 原始的 title
   * 通常不需要传，内部会根据 title 得到
   */
  rawTitle?: ReactNode
  /** 
   * 最小宽度
   * 优先级低于 fixedWidth 中的 min-width 
   */
  minWidth?: string
  /** 
   * 最大宽度
   * 优先级低于 fixedWidth 中的 max-width
   */
  maxWidth?: string
  /** 
   * 固定宽度
   * min-width 和 max-width
   */
  fixedWidth?: string
  /** 
   * 样式
   * 优先级高于 fixedWidth、minWidth 和 maxWidth
   * @type React.CSSProperties | ((text: any, record: T, index: number) => React.CSSProperties)
   */
  style?: React.CSSProperties | ((text: any, record: T, index: number) => React.CSSProperties)
  /**
   * 编辑时的验证规则
   */
  rules?: RuleObject[]
  /**
   * 是否必填
   * @default false
   */
  required?: boolean
  /**
   * 是否可编辑
   * @default false
   */
  editable?: boolean | ((text: any, record: T, index: number) => boolean)
  /**
   * 编辑器控件
   * @type ReactElement | ((text: any, row: any, index: number) => ReactElement)
   */
  editor?: ReactElement | ((text: any, row: any, index: number) => ReactElement)
  /**
   * 编辑期间值发生改变时
   */
  onValueChange?: (value: any, row: any, index: number) => void
  /**
   * 表单项Props
   */
  formItemProps?: Partial<FormItemProps>
  /**
   * 允许用户配置为隐藏
   * @default true
   */
  allowHide?: boolean
  /** 
   * 数据类型
   * @default string
   */
  dataType?: 'string' | 'number' | 'boolean' | 'date'
}

export interface UdTableInstance {
  /**
  * 表格容器DOM
  */
  tableWrapper: HTMLDivElement
  /**
   * 表单实例对象
   * 请勿轻易使用该对象来修改表单项的值，会产生一些问题。
   * 要设置表单项的值，请使用下面的 setRows 等方法
   */
  form: FormInstance

  /**
   * 设置数据源
   */
  setDataSource: (data: any[]) => void

  /**
   * 获取数据
   * 不传参数表示获取数据数据
   */
  getRows: (filter?: (value: any, index: number, array: any[]) => any) => Store[]
  /**
   * 验证并获取数据
   */
  getRowsAndValidate: (filter?: (value: any, index: number, array: any[]) => any) => Promise<Store[]>
  /**
   * 获取选中的行
   */
  getSelectedRows: () => Store[]
  /**
   * 验证并获取选中的行
   */
  getSelectedRowsAndValidate: () => Promise<Store[]>
  /**
   * 通过行key获取数据
   */
  getRowsByKeys: (keys: any | any[]) => Store[]
  /**
   * 验证并通过行key获取数据
   */
  getRowsByKeysAndValidate: (keys: any | any[]) => Promise<Store[]>
  /**
   * 通过索引获取数据
   */
  getRowsByIndex: (indexs: number | number[]) => Store[]
  /**
   * 验证并通过索引获取数据
   */
  getRowsByIndexAndValidate: (indexs: number | number[]) => Promise<Store[]>

  /**
   * 添加一条或多条数据到末尾
   */
  pushRows: (rows: Store | Store[]) => void
  /**
   * 插入一条或多条数据到指定位置
   */
  insertRows: (rows: Store | Store[], index: number) => void

  /**
   * 删除选中的行
   */
  deleteSelectedRows: () => void
  /**
   * 弹出提示确认后再删除选中的行
   */
  deleteSelectedRowsAndConfirm: () => Promise<any>
  /**
   * 通过行Key删除一条或多条数据
   */
  deleteRowsByKeys: (keys: any | any[]) => void
  /**
   * 弹出提示确认后再通过行Key删除一条或多条数据
   */
  deleteRowsByKeysAndConfirm: (keys: any | any[]) => Promise<any>
  /**
   * 通过索引删除一条或多条数据
   */
  deleteRowsByIndex: (indexs: number | number[]) => void
  /**
   * 弹出提示确认后再通过索引删除一条或多条数据
   */
  deleteRowsByIndexAndConfirm: (indexs: number | number[]) => Promise<any>

  /**
   * 设置所有行的值
   */
  setRows: (value: Store, filter?: (value: any, index: number, array: any[]) => any) => void
  /**
   * 通过行Key设置相关行的值
   */
  setRowsByKeys: (value: Store, keys: any[]) => void
  /**
   * 设置选中行的值
   */
  setSelectedRows: (value: Store) => void
  /**
   * 通过索引设置相关行的值
   */
  setRowsByIndex: (value: Store, indexs: number | number[]) => void
}

/**
 * 水印配置
 */
export interface ITableWatermark {
  enable: boolean
  color: string
  opacity: number
  fontSize: number
  angle: number
  text: (() => string) | string
  width: number
  height: number
  x: number
  y: number
}

/**
 * 导出格式
 */
export type UdTableExportFormats = 'xlsx' | 'csv' | 'txt'
