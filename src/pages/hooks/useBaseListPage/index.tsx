import _ from 'lodash'
import { AxiosResponse } from 'axios'
import React, { ReactNode, useState, ReactElement, useMemo, useRef, useEffect, Dispatch, SetStateAction } from 'react'
import classNames from 'classnames'
import { ClassValue } from 'classnames/types'
import { useLocation } from 'react-router-dom'
import { BackTop, Form, message } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { FormInstance } from 'antd/lib/form'
import { GetRowKey, TablePaginationConfig, SorterResult, TableCurrentDataSource, Key } from 'antd/lib/table/interface'
import { IUdFormItem, IUdColumn, UdFilter, UdTable, usePersistFn, useUrlQueryParams, IListQueryParams, UdPage, UdPageHeader, IListRes, http, IUdTableProps, UdTableExportFormats, formUtils, BaseListPage, routeUtils, udConfigProvider, IBaseListPageSlots, TabAction, UdSequencePager } from '../../..'
import { IUdPaginationConfig } from '../..'

function useBaseListPage<T = any>(initialConfig: IUseBaseListPageProps<T>) {

  let cfg: IUseBaseListPageProps<T> = _.defaultsDeep({}, initialConfig, useBaseListPage.defaultConfig)

  if (cfg.paginationModel === 'SEQUENCE_PAGER') {
    cfg.defaultQueryParams = {
      size: 10,
      direction: 'NEXT',
      dataId: '',
      conditions: {},
      v: 0,
      ...cfg.defaultQueryParams
    }
  } else {
    cfg.defaultQueryParams = {
      page: 1,
      size: 10,
      conditions: {},
      v: 0,
      ...cfg.defaultQueryParams
    }
  }

  const location = useLocation()

  let inited = useRef<boolean>(false)
  let defaultQueryParams = useRef(cfg.defaultQueryParams!)
  let queryParams = useRef(cfg.defaultQueryParams!)
  const [urlQueryParams, pushUrlQueryParams] = useUrlQueryParams(defaultQueryParams.current)
  const [querying, setQuerying] = useState(false)
  const [pagination, setPagination] = useState<(false | IUdPaginationConfig)>(() => {
    return _.defaultsDeep({}, initialConfig.pagination, useBaseListPage.defaultConfig.pagination)
  })
  const [dataSource, setDataSource] = useState<any[]>([])
  const [selectedRows, setSelectedRows] = useState<T[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [filterForm] = Form.useForm()

  const pageContainer = useMemo(() => cfg.pageContainer || udConfigProvider.ui.getPageContainer(), [cfg.pageContainer])

  const tableKey = useMemo(() => {
    if (cfg.tableKey) {
      return cfg.tableKey
    }
    let key = _.trimStart(location.pathname.split('/').join('-'), '-')
    return key == '' ? '/' : key
  }, [cfg.tableKey])

  const [tableProps, setTableProps] = useState<IUdTableProps>(() => {
    let useRowSelection = cfg.useRowSelection || (cfg.leftBtns && cfg.leftBtns.length > 0)
    if (useRowSelection && cfg.useRowSelectionDefaultHandler) {
      return _.defaultsDeep({}, {
        rowSelection: {
          onChange: (keys: string[], rows: any[]) => {
            if (tableProps && tableProps.rowSelection) {
              tableProps.rowSelection.selectedRowKeys = keys
            }
            setTableProps(tableProps)
            setSelectedRows(rows)
            setSelectedRowKeys(keys)
          }
        }
      }, initialConfig.tableProps)
    }
    return cfg.tableProps
  })

  let page: IUseBaseListPage = {
    states: {
      querying, dataSource, selectedRows, setSelectedRows, selectedRowKeys, setSelectedRowKeys, queryParams: queryParams.current, pagination,
      setQuerying, setDataSource, tableProps, setTableProps
    },
    actions: {},
    lifecycles: {},
    refs: {
      filterForm: filterForm
    }
  } as IUseBaseListPage

  function handleSearch(values: Store) {
    if (cfg.onFilterSearch) {
      cfg.onFilterSearch(values)
    }
    let p: Partial<IListQueryParams> = {
      conditions: values,
      v: new Date().getTime()
    }
    if (pagination !== false) {
      p.page = 1
      p.direction = 'NEXT'
      p.dataId = ''
    }
    page.actions.changeParams(p)
  }

  function handleReset() {
    if (!cfg.searchAfterReset) {
      setDataSource([])
      if (pagination) {
        setPagination({ total: 0, current: 1 })
      }
    }
  }

  function handleDataSource(res: AxiosResponse<IListRes<any>>) {
    let data = []
    if (res.data) {
      data = (res.data as any)[BaseListPage.resFieldKeys.content] || res.data
    }
    if (_.isFunction(page.lifecycles.handleDataSourceAfter)) {
      data = page.lifecycles.handleDataSourceAfter(data, res)
    }
    return data
  }

  function handleTableChange(pagination: TablePaginationConfig, filters: Record<string, Key[] | null>, sorter: SorterResult<T> | SorterResult<T>[], extra: TableCurrentDataSource<T>) {
    let conditions = queryParams.current.conditions!
    if (!_.isArray(sorter)) {
      conditions.orderType = sorter.order
      conditions.orderBy = sorter.field
    }
    let p: Partial<IListQueryParams> = {
      conditions: conditions,
      v: new Date().getTime()
    }
    if (pagination) {
      if (cfg.paginationModel === 'FRONTED_PAGER') {
        let pager = pagination as TablePaginationConfig
        pager.current = pagination.current
        pager.pageSize = pagination.pageSize
        setPagination(pager)
        return
      } else {
        p.page = pagination.current
        p.size = pagination.pageSize
      }
    }
    page.actions.changeParams(p)
  }

  page.actions.changeParams = (params?: any, merge: boolean = true) => {
    let newParams = queryParams.current
    if (params) {
      newParams = merge ? _.extend({}, queryParams.current, params) : params
    }
    if (cfg.saveParamsWithUrl) {
      let currentUrlParams = routeUtils.searchStringToObject(location.search, defaultQueryParams.current)
      let cloneNewParams = _.cloneDeep(newParams)
      delete cloneNewParams.v
      delete currentUrlParams.v
      if (_.isEqual(cloneNewParams, currentUrlParams)) {
        page.actions.query()
      } else {
        pushUrlQueryParams(newParams, cfg.pushUrlQueryParamsMerge)
      }
    } else {
      queryParams.current = newParams
      page.actions.query()
    }
  }

  useEffect(() => {
    _.isFunction(cfg.setTabRefreshAction) && cfg.setTabRefreshAction(page.actions.query)
  }, [])

  useEffect(() => {
    if (cfg.saveParamsWithUrl) {
      queryParams.current = urlQueryParams
    }
    if (!inited.current || cfg.saveParamsWithUrl) {
      if (inited.current) {
        page.actions.query()
      } else {
        inited.current = true
        if (cfg.queryAfterMount) {
          page.actions.query()
        }
      }
      if (page.refs.filterForm && _.isFunction(page.refs.filterForm.setFieldsValue)) {
        formUtils.setValues(page.refs.filterForm, cfg.conditions, queryParams.current.conditions)
      }
    }
  }, [urlQueryParams])

  page.actions.getQueryParams = () => {
    let params = queryParams.current
    let req: any = {}
    let fixedConditionsIsRef = initialConfig.fixedConditions && Object.keys(initialConfig.fixedConditions).length == 1 && (typeof initialConfig.fixedConditions.current) === 'object'
    let fixedConditions = fixedConditionsIsRef ? initialConfig.fixedConditions.current : initialConfig.fixedConditions
    if (pagination) {
      if (cfg.paginationModel === 'SEQUENCE_PAGER') {
        req = {
          size: params.size,
          direction: params.direction,
          dataId: params.dataId,
        }
      } else {
        req = {
          size: params.size,
          page: params.page
        }
      }

      if (udConfigProvider.api.useConditionsField) {
        req.conditions = {
          ...fixedConditions, ...params.conditions
        }
      } else {
        req = { ...req, ...fixedConditions, ...params.conditions }
      }
    } else {
      req = { ...fixedConditions, ...params.conditions }
    }
    return _.isFunction(page.lifecycles.getQueryParamsAfter) ? page.lifecycles.getQueryParamsAfter(req) : req
  }

  page.actions.query = usePersistFn(() => {
    setQuerying(true)
    page.refs.filterForm.validateFields().then(() => {
      let params = page.actions.getQueryParams()

      let send = () => {

        if (!cfg.keepSelectedRows && tableProps && tableProps.rowSelection && selectedRowKeys && selectedRowKeys.length > 0) {
          tableProps.rowSelection.selectedRowKeys = []
          setSelectedRows([])
          setSelectedRowKeys([])
          setTableProps(tableProps)
        }

        let promise: Promise<AxiosResponse<IListRes>>
        if (_.isFunction(cfg.queryApi)) {
          promise = cfg.queryApi(params)
        } else {
          if (cfg.method == 'GET') {
            promise = http.get<IListRes>(cfg.queryApi as string, { params })
          } else {
            promise = http.post<IListRes>(cfg.queryApi as string, params)
          }
        }
        promise.then(res => {
          if (pagination && res.data) {
            if (cfg.paginationModel === 'FRONTED_PAGER') {
              pagination.current = queryParams.current.page
              pagination.pageSize = queryParams.current.size
              pagination.total = (res.data as any).length
            } else if (cfg.paginationModel === 'SEQUENCE_PAGER') {
              pagination.hasPrevious = (res.data as any)[BaseListPage.resFieldKeys.hasPrevious]
              pagination.hasNext = (res.data as any)[BaseListPage.resFieldKeys.hasNext]
              pagination.firstDataId = (res.data as any)[BaseListPage.resFieldKeys.firstDataId]
              pagination.lastDataId = (res.data as any)[BaseListPage.resFieldKeys.lastDataId]
              pagination.pageSize = (res.data as any)[BaseListPage.resFieldKeys.size]
              pagination.numberOfElements = (res.data as any)[BaseListPage.resFieldKeys.numberOfElements]
            }
            else {
              pagination.current = (res.data as any)[BaseListPage.resFieldKeys.number]
              pagination.pageSize = (res.data as any)[BaseListPage.resFieldKeys.size]
              pagination.total = (res.data as any)[BaseListPage.resFieldKeys.totalElements]
            }
          }
          let data = handleDataSource(res)
          if (pagination && pagination.current && pagination.current > 1 && (data == null || data.length == 0)) {
            page.actions.changeParams({ page: pagination.current - 1 })
          } else {
            setPagination(pagination)
            setDataSource(data)
          }
        }, res => {
          if (cfg.paginationModel !== 'SEQUENCE_PAGER') {
            if (pagination !== false) {
              pagination.total = 0
              setPagination(pagination)
            }
            setDataSource([])
          }

        }).finally(() => {
          setQuerying(false)
        })
      }

      if (_.isFunction(page.lifecycles.queryBefore)) {
        let beforeResult = page.lifecycles.queryBefore(params) as any
        if (beforeResult === false) {
          setQuerying(false)
          return
        }
        if (beforeResult && beforeResult.then) {
          beforeResult.then(send).catch(() => {
            setQuerying(false)
          })
        } else {
          send()
        }
      } else {
        send()
      }
    }, (errors) => {
      message.error('???????????????????????????????????????????????????')
      setQuerying(false)
    })
  })

  page.render = (slots?: IBaseListPageSlots) => {
    let sortValues = []
    let conditions = queryParams.current.conditions!
    if (conditions['orderBy']) {
      sortValues.push({ key: conditions['orderBy'], value: conditions['orderType'] })
    }
    return (
      <UdPage className={classNames('list-page', cfg.className)}>
        {
          cfg.title && (
            <UdPageHeader
              title={cfg.title} subTitle={cfg.subTitle}
              onBack={cfg.onBack} onRefresh={page.actions.query}
              useAffix={cfg.useHeaderAffix} affixProps={{ target: () => pageContainer }}
            />
          )
        }
        {slots && slots.header}
        {
          _.isArray(cfg.conditions) && cfg.conditions.length > 0 && (
            <UdFilter
              form={page.refs.filterForm}
              loading={querying}
              items={cfg.conditions}
              initialValues={{ ...cfg.defaultQueryParams.conditions, ...cfg.conditionInitialValues }}
              useFold={cfg.useFilterFold}
              useResetBtn={cfg.useResetBtn}
              searchBtnText={cfg.searchBtnText}
              searchAfterReset={cfg.searchAfterReset}
              onSearch={handleSearch}
              onReset={handleReset}
            />
          )
        }
        {slots && slots.filterBelow}
        {
          _.isArray(cfg.columns) && cfg.columns.length > 0 && (
            <UdTable
              rowKey={cfg.rowKey as string} // TODO ??????????????????????????????????????????????????????
              loading={querying}
              sortValues={sortValues}
              // pagination={pagination}
              pagination={(cfg.paginationModel === 'DEFAULT' || cfg.paginationModel === 'FRONTED_PAGER') ? pagination : false}
              {...tableProps}
              tableKey={tableKey}
              onChange={handleTableChange}
              columns={cfg.columns}
              dataSource={dataSource}
              useColumnCustomize={cfg.useColumnCustomize}
              keepSelectedRows={cfg.keepSelectedRows}
              useRowSelectionDefaultHandler={cfg.useRowSelectionDefaultHandler}
              useExport={cfg.useExport}
              leftBtns={cfg.leftBtns}
              rigthBtns={cfg.rigthBtns}
              pageContainer={pageContainer}
              buttonBelow={slots && slots.buttonBelow}
            />
          )
        }
        {
          cfg.paginationModel === 'SEQUENCE_PAGER' && pagination &&
          <UdSequencePager
            pageSize={pagination.pageSize}
            pageSizeOption={pagination.pageSizeOptions}
            hasNext={pagination.hasNext}
            hasPrevious={pagination.hasPrevious}
            lastDataId={pagination.lastDataId}
            firstDataId={pagination.firstDataId}
            numberOfElements={pagination.numberOfElements}
            onChange={(value) => {
              let p: Partial<IListQueryParams> = {
                v: new Date().getTime(),
                ...value
              }
              page.actions.changeParams(p)
            }}
          />
        }
        {slots && slots.footer}
        {pageContainer && <BackTop target={() => pageContainer} visibilityHeight={100} />}
      </UdPage>
    )
  }

  return page
}

useBaseListPage.defaultConfig = {
  useHeaderAffix: true,
  method: 'POST',
  queryApi: '',
  queryAfterMount: true,
  saveParamsWithUrl: true,
  searchAfterReset: true,
  useResetBtn: true,
  useFilterFold: true,
  rowKey: 'id',
  useColumnCustomize: true,
  keepSelectedRows: false,
  useRowSelectionDefaultHandler: true,
  useExport: true,
  defaultQueryParams: {
    page: 1,
    size: 10,
    direction: 'NEXT',
    dataId: '',
    conditions: {},
    v: 0
  },
  paginationModel: 'DEFAULT',
  pagination: {
    showTotal: (total: number, range: [number, number]) => `??? ${total} ???, ?????? ${range[0]}-${range[1]}`,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '40', '60', '100', '150', '200'],
    hasNext: false,
    hasPrevious: false,
    firstDataId: null,
    lastDataId: null
  },
  pushUrlQueryParamsMerge: false
} as IUseBaseListPageProps

export type BaseListPageInitialConfig<T> = Partial<IUseBaseListPageProps<T>> | ((
  page: IUseBaseListPage<T>
) => Partial<IUseBaseListPageProps<T>>)

export interface IUseBaseListPage<T = any> {
  states: Readonly<IUseBaseListPageStates<T>>
  actions: {
    // config: (cfg: IUseBaseListPageProps<T>) => void,
    query: () => void
    getQueryParams: () => any
    /**
     * ?????????????????????????????????
     * @param merge ?????????????????????????????????????????????true
     */
    changeParams: (params?: any, merge?: boolean) => void
  },
  lifecycles: IUseBaseListPageLifecycles<T>,
  refs: Readonly<IUseBaseListPageRefs>,
  render: (slots?: IBaseListPageSlots) => ReactElement<any, any> | null
}

export interface IUseBaseListPageStates<T = any> {
  /**
   * ???????????? id ??????
   */
  selectedRowKeys: string[] | number[]
  setSelectedRowKeys: Dispatch<React.SetStateAction<string[]>>
  /**
   * ??????????????????
   */
  selectedRows: T[]
  setSelectedRows: Dispatch<React.SetStateAction<T[]>>
  /**
   * ???????????????
   */
  dataSource: T[]
  /**
   * ?????????????????????
   */
  setDataSource: Dispatch<SetStateAction<T[]>>
  /**
   * ????????????
   */
  querying: boolean
  /**
   * ??????????????????
   */
  setQuerying: Dispatch<SetStateAction<boolean>>
  /**
   * ??????????????????
   */
  queryParams: IListQueryParams
  /**
   * ??????????????????
   */
  pagination: false | IUdPaginationConfig

  tableProps: IUdTableProps
  setTableProps: Dispatch<IUdTableProps>
}

export interface IUseBaseListPageLifecycles<T> {
  /**
   * ?????????????????????
   * ???????????????????????????
   */
  getQueryParamsAfter: (params: any) => any
  /**
   * ???????????????
   * ???????????????????????????????????????
   */
  queryBefore: (params: Store) => (void | boolean | Promise<void>)
  /**
   * ??????DataSource???
   * ?????????????????????????????????????????????
   */
  handleDataSourceAfter: (data: T[], res: AxiosResponse<IListRes<any>>) => T[]
}

export interface IUseBaseListPageRefs {
  /**
   * ????????????????????????
   */
  filterForm: FormInstance
}

export interface IUseBaseListPageProps<T = any> {
  /**
   * ?????? ClassName
   */
  className?: ClassValue
  /**
   * ????????????
   */
  pageContainer?: HTMLElement
  /**
   * ??????
   */
  title?: string
  /**
   * ?????????
   */
  subTitle?: string
  /**
   * ??????????????????
   */
  onBack?: boolean | (() => void)
  /**
   * ????????????????????????
   * @default true
   */
  useHeaderAffix?: boolean
  /**
   * ?????????????????????
   * @default POST
   */
  method?: 'GET' | 'POST'
  /**
   * ??????API
   */
  queryApi: string | ((data: any) => Promise<any>)
  /**
   * ?????????????????????????????????
   * @default true
   */
  queryAfterMount?: boolean
  /**
   * ??????????????????
   * @default { page: 1, size: 10, conditions: {}, v: 0 }
   */
  defaultQueryParams?: Partial<IListQueryParams>
  /**
   * ????????????????????????url?????????
   * @default true
   */
  saveParamsWithUrl?: boolean
  /**
   * ?????????????????????
   * ?????? useRef ???????????????
   */
  fixedConditions?: Store | React.MutableRefObject<any>
  /** 
   * ??????????????????
   * @type IUdFormItem[]
   */
  conditions?: IUdFormItem[]
  /** 
   * ?????????????????????
   */
  conditionInitialValues?: Store
  /**
   * ????????????????????????????????????
   * @default true
   */
  searchAfterReset?: boolean
  /**
   * ??????????????????
   * @default true
   */
  useResetBtn?: boolean
  /**
   * ????????????????????????????????????
   * @default true
   */
  useFilterFold?: boolean
  /**
   * ??????????????????
   * @default ??????
   */
  searchBtnText?: string

  /**
   * ???????????????
   */
  onFilterSearch?: (values: Store) => void
  /**
   * ?????????????????????
   * @type (ReactNode | (() => ReactNode))[]
   */
  leftBtns?: (ReactNode | (() => ReactNode))[]
  /**
   * ?????????????????????
   * @type (ReactNode | (() => ReactNode))[]
   */
  rigthBtns?: (ReactNode | (() => ReactNode))[]
  /**
   * ??????????????????????????????key
   * ?????????????????????????????????????????????????????????
   * @default ????????????????????????
   */
  tableKey?: string
  /**
   * ?????? row key
   * @default id
   */
  rowKey?: string | GetRowKey<T>
  /**
   * ?????????????????????
   * ?????????????????????????????????
   */
  columns?: IUdColumn<T>[]
  /**
   * ??????props
   */
  tableProps?: IUdTableProps<T>
  /**
   * ??????????????????????????????
   * @default false
   */
  keepSelectedRows?: boolean

  /**
   * ????????????
   * ????????????????????????
   */
  pagination?: false | IUdPaginationConfig
  /**
   * ???????????????????????????
   * ?????? leftBtns ?????????????????????????????????
   */
  useRowSelection?: boolean
  /**
   * ????????????????????? RowSelection ?????????
   * @default true
   */
  useRowSelectionDefaultHandler?: boolean
  /** 
   * ???????????????????????? 
   * @default true
   */
  useColumnCustomize?: boolean
  /**
   * ????????????????????????
   */
  useExport?: boolean | UdTableExportFormats[]
  /**
   * ???????????????????????????
   * ?????????????????? UdPageTabs ??????????????????
   */
  setTabRefreshAction?: (action: TabAction) => void

  /**
   * ????????????????????????url?????????????????????????????????
   * @default false
   */
  pushUrlQueryParamsMerge?: boolean

  /**
   * ????????????
   * @default `DEFAULT`
   *
   * `DEFAULT`: ????????????????????????antd????????????
   * `SEQUENCE_PAGER`: ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
   * `FRONTED_PAGER`: ???????????????????????????????????????????????????????????????????????????????????????
   */
  paginationModel?: 'DEFAULT' | 'SEQUENCE_PAGER' | 'FRONTED_PAGER'
}

export { useBaseListPage }