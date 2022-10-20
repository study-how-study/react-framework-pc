import { ReactNode } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { ClassValue } from 'classnames/types'
import { Store } from 'antd/lib/form/interface'
import { TablePaginationConfig } from 'antd/lib/table/interface'
import { IUdFormItem, IUdColumn, IUdTableProps, UdTableExportFormats } from '../../..'

export interface IBaseListPageProps<Params extends { [K in keyof Params]?: string } = {}>
  extends RouteComponentProps<Params> {
  /**
   * 页面标题
   */
  title?: string
}

export interface IBaseListPageState<T = any> {
  /**
   * 页面 ClassName
   */
  className?: ClassValue
  /**
   * 标题
   */
  title?: string
  /**
   * 副标题
   */
  subTitle?: string
  /**
   * 标题栏的返回
   */
  onBack?: boolean | (() => void)
  /**
   * 页头是否使用固钉
   * @default true
   */
  useHeaderAffix?: boolean
  /**
   * 查询接口的类型
   * @default POST
   */
  method?: 'GET' | 'POST'
  /**
   * 查询API
   */
  queryApi: string | ((data: any) => Promise<any>)
  /**
   * 页面挂载后是否发起查询
   * @default true
   */
  queryAfterMount?: boolean

  /**
   * 检索状态
   */
  querying?: boolean
  /** 
   * 检索条件集合
   */
  conditions?: IUdFormItem[]
  /** 
   * 检索条件初始值
   */
  conditionInitialValues?: Store
  /**
   * 检索条件重置之后发起搜索
   * @default true
   */
  searchAfterReset?: boolean
  /**
   * 启用条件过滤器的折叠功能
   * @default true
   */
  useFilterFold?: boolean
  /**
   * 搜索按钮文本
   * @default 搜索
   */
  searchBtnText?: string
  /**
   * 搜索后回调
   */
  onFilterSearch?: (values: Store) => void
  /**
   * 左边按钮
   * @type (ReactNode | (() => ReactNode))[]
   */
  leftBtns?: (ReactNode | (() => ReactNode))[]
  /**
   * 右边按钮
   * @type (ReactNode | (() => ReactNode))[]
   */
  rigthBtns?: (ReactNode | (() => ReactNode))[]
  /**
   * 表格在此应用中的唯一key
   * 如果不传，将会根据页面地址自定生成一个。
   */
  tableKey?: string
  /**
   * 表格 row key
   */
  rowKey?: string
  /**
   * 表格列定义集合
   */
  columns: IUdColumn<T>[]
  /**
   * 表格数据源
   * 通常无须手动赋值
   */
  dataSource?: T[]
  /**
   * 表格props
   */
  tableProps?: IUdTableProps<T>
  /**
   * 分页配置
   * 通常无须手动赋值
   */
  pagination?: false | IUdPaginationConfig
  /**
   * 启用表格行选择功能
   * 如果 leftBtns 有值，也会启用此功能。
   */
  useTableRowSelection?: boolean
  /**
   * table 表格勾选 id 集合
   * 通常无须手动赋值
   */
  selectedRowKeys?: string[] | number[]
  /**
   * table 表格勾选数据
   * 通常无须手动赋值
   */
  selectedRows?: T[]
  /** 
   * 使用表格自定义列 
   * @default true
   */
  useColumnCustomize?: boolean
  /**
   * 允许导出表格数据
   */
  useExport?: boolean | UdTableExportFormats[]
  /**
   * 将请求参数保存到url地址上，并支持浏览器前进后退
   */
  saveParamsWithUrl?: boolean
  /**
   * 是否使用重置搜索条件按钮
   * @default true
   */
  useResetBtn?: boolean,

  /**
   * 分页模式
   * @default `DEFAULT`
   * 
   * `DEFAULT`: 默认，使用正常的antd分页组件
   * `SEQUENCE_PAGER`: 使用深度分页组件，后端按索引深度查询分页，只提供上一页和下一页，用于列表数据量大的场景
   * `FRONTED_PAGER`: 前端分页，不请求接口，用于一次获取所有数据并需要分页的场景
   */
  paginationModel?: 'DEFAULT' | 'SEQUENCE_PAGER' | 'FRONTED_PAGER'
}

export interface IUdPaginationConfig extends TablePaginationConfig {
  /**
   * 是否有下一页-列表的简单分页模式需要接受haxNext参数
   */
  hasNext?: boolean
  numberOfElements?: number | null
  hasPrevious?: boolean
  firstDataId?: string | number | null
  lastDataId?: string | number | null
}
