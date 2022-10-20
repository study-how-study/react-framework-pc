import _ from 'lodash'
import { AxiosResponse } from 'axios'
import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { BackTop } from 'antd'
import { FormInstance } from 'antd/lib/form'
import { TablePaginationConfig } from 'antd/lib/table'
import { SorterResult, Key } from 'antd/lib/table/interface'
import { Store } from 'antd/lib/form/interface'
import { IBaseListPageProps, IBaseListPageState, IUdPaginationConfig } from './typings'
import { BasePage, IListQueryParams, IBaseListPageSlots } from '../..'
import { udConfigProvider, UdPage, UdPageHeader, UdFilter, UdTable, formUtils, IListRes, http, routeUtils, IUdTabPageProps, UdSequencePager } from '../../..'

/**
 * 通用基础列表页基类
 */
class BaseListPage<
  P extends IBaseListPageProps = IBaseListPageProps,
  S extends IBaseListPageState = IBaseListPageState,
  QP extends IListQueryParams = IListQueryParams>
  extends BasePage<P, S, QP> {

  public static resFieldKeys: {
    content: string,
    number: string
    numberOfElements: string
    size: string
    totalElements: string
    totalPages: string
    hasNext: string
    hasPrevious: string
    firstDataId: string
    lastDataId: string
  } = {
      content: 'content',
      number: 'number',
      numberOfElements: 'numberOfElements',
      size: 'size',
      totalElements: 'totalElements',
      totalPages: 'totalPages',
      hasNext: 'hasNext',
      hasPrevious: 'hasPrevious',
      firstDataId: 'firstDataId',
      lastDataId: 'lastDataId'
    }

  public static defaultStates: IBaseListPageState = {
    title: '',
    method: 'POST',
    queryApi: '',
    queryAfterMount: true,
    rowKey: 'id',
    columns: [],
    pagination: {
      showTotal: (total: number, range: [number, number]) => `共 ${total} 项, 当前 ${range[0]}-${range[1]}`,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '40', '60', '100', '150', '200'],
      hasNext: false,
      hasPrevious: false,
      firstDataId: null,
      lastDataId: null
    },
    dataSource: [],
    tableProps: {},
    selectedRowKeys: [],
    selectedRows: [],
    useColumnCustomize: true,
    useExport: true,
    useFilterFold: true,
    useHeaderAffix: true,
    searchBtnText: '搜索',
    searchAfterReset: true,
    saveParamsWithUrl: true,
    useResetBtn: true,
    paginationModel: 'DEFAULT',
  }

  /** 默认查询参数 */
  protected defaultQueryParams: QP = {
    page: 1,
    size: 10,
    direction: 'NEXT',
    dataId: '',
    conditions: {},
    v: 0
  } as any

  /** 固定参数 */
  protected baseQueryParams: Store = {}

  /** 条件过滤器的表单对象 */
  protected filterForm: FormInstance = {} as FormInstance

  /** 滚动条容器 */
  protected pageContainer = udConfigProvider.ui.getPageContainer()

  componentWillMount(otherState?: Partial<S>) {
    if ((this.props as unknown as IUdTabPageProps).setTabRefreshAction) {
      (this.props as unknown as IUdTabPageProps).setTabRefreshAction(this.query)
    }
    if (this.state.paginationModel === 'SEQUENCE_PAGER') {
      this.defaultQueryParams = {
        size: 10,
        direction: 'NEXT',
        dataId: '',
        conditions: {},
        v: 0
      } as QP
    } else {
      this.defaultQueryParams = {
        page: 1,
        size: 10,
        conditions: {},
        v: 0
      } as QP
    }

    if (this.state.saveParamsWithUrl) {
      this.processSearchString(this.props.location.search)
    } else {
      this.queryParams = _.cloneDeep(this.defaultQueryParams)
    }
    let state: IBaseListPageState = _.defaultsDeep({}, this.props, this.state, {
      pagination: {
        current: this.queryParams.page || this.defaultQueryParams.page,
        pageSize: this.queryParams.size || this.defaultQueryParams.size,

      },
    }, otherState, BaseListPage.defaultStates)

    if (state.useTableRowSelection || (state.leftBtns && state.leftBtns.length > 0)) {
      state.tableProps = _.defaultsDeep({}, state.tableProps, {
        rowSelection: {
          onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
            let tableProps = this.state.tableProps
            if (tableProps && tableProps.rowSelection) {
              tableProps.rowSelection.selectedRowKeys = selectedRowKeys
            }
            this.setState({ selectedRowKeys, selectedRows, tableProps })
          }
        }
      })
    }

    if (!state.tableKey) {
      const locationUrl = this.props.location.pathname
      state.tableKey = _.trimStart(locationUrl.split('/').join('-'), '-')
      if (state.tableKey == '') {
        state.tableKey = '/'
      }
    }
    this.setState(state)
  }

  componentDidMount() {
    this.queryParamsChanged(true)
  }

  componentWillReceiveProps(nextProps: P) {
    if (this.state.saveParamsWithUrl && this.props.location.search != nextProps.location.search) {
      this.processSearchString(nextProps.location.search)
      this.queryParamsChanged()
    }
  }

  render(slot?: IBaseListPageSlots) {
    let sortValues = []
    if (this.queryParams.conditions['orderBy']) {
      sortValues.push({ key: this.queryParams.conditions['orderBy'], value: this.queryParams.conditions['orderType'] })
    }

    let paginationData = (this.state.pagination || {}) as IUdPaginationConfig


    return (
      <UdPage className={classNames('list-page', this.state.className)}>
        {
          this.state.title && <UdPageHeader title={this.state.title} subTitle={this.state.subTitle}
            onBack={this.state.onBack} onRefresh={this.query} useAffix={this.state.useHeaderAffix}
            affixProps={{ target: () => this.pageContainer }} />
        }
        {slot && slot.header}
        {
          _.isArray(this.state.conditions) && this.state.conditions.length > 0 && (
            <UdFilter
              getForm={(ref) => this.filterForm = ref}
              loading={this.state.querying}
              items={this.state.conditions}
              initialValues={this.state.conditionInitialValues}
              useFold={this.state.useFilterFold}
              searchBtnText={this.state.searchBtnText}
              searchAfterReset={this.state.searchAfterReset}
              onSearch={this.handleSearch}
              useResetBtn={this.state.useResetBtn}
            />
          )
        }
        {slot && slot.filterBelow}
        {
          this.state.columns && this.state.columns.length > 0 && (
            <UdTable
              rowKey={this.state.rowKey}
              loading={this.state.querying}
              sortValues={sortValues}
              pagination={(this.state.paginationModel === 'DEFAULT' || this.state.paginationModel === 'FRONTED_PAGER') ? this.state.pagination : false}
              {...this.state.tableProps}
              columns={this.state.columns}
              dataSource={this.state.dataSource}
              onChange={this.handleTableChange}
              tableKey={this.state.tableKey}
              useColumnCustomize={this.state.useColumnCustomize}
              useExport={this.state.useExport}
              leftBtns={this.state.leftBtns}
              rigthBtns={this.state.rigthBtns}
              pageContainer={this.pageContainer}
              buttonBelow={slot && slot.buttonBelow}
            />
          )
        }
        {
          this.state.paginationModel === 'SEQUENCE_PAGER' && this.state.pagination &&
          <UdSequencePager
            pageSize={paginationData.pageSize}
            pageSizeOption={paginationData.pageSizeOptions}
            hasNext={paginationData.hasNext}
            hasPrevious={paginationData.hasPrevious}
            lastDataId={paginationData.lastDataId}
            firstDataId={paginationData.firstDataId}
            numberOfElements={paginationData.numberOfElements}
            onChange={(value) => {
              let p: Partial<IListQueryParams> = {
                v: new Date().getTime(),
                ...value
              }
              this.handleParamsChange<IListQueryParams>(p)
            }}
          />
        }
        {slot && slot.footer}
        {this.pageContainer && <BackTop target={() => this.pageContainer} visibilityHeight={100} />}
      </UdPage>
    )
  }

  /**
   * url参数发生改变时
   */
  protected queryParamsChanged = (init?: boolean) => {
    if (init == true || this.state.saveParamsWithUrl) {
      if (init) {
        if (this.state.queryAfterMount) {
          this.query()
        }
      } else {
        this.query()
      }
      if (this.filterForm && _.isFunction(this.filterForm.setFieldsValue)) {
        formUtils.setValues(this.filterForm, this.state.conditions, this.queryParams.conditions)
      }
    }
  }

  /**
   * 查询
   */
  protected query = () => {
    this.setState({ querying: true })
    let params = this.getQueryParams()
    let beforeResult = this.queryBefore(params) as any
    if (beforeResult === false) {
      this.setState({ querying: false })
      return
    }
    let send = () => {
      let tableProps = this.state.tableProps
      if (!tableProps.keepSelectedRows && tableProps && tableProps.rowSelection && this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) {
        tableProps.rowSelection.selectedRowKeys = []
        this.setState({ tableProps, selectedRows: [], selectedRowKeys: [] })
      }
      let promise: Promise<AxiosResponse<IListRes>>
      if (_.isFunction(this.state.queryApi)) {
        promise = this.state.queryApi(params)
      } else {
        if (this.state.method == 'GET') {
          promise = http.get<IListRes>(this.state.queryApi as string, { params })
        } else {
          promise = http.post<IListRes>(this.state.queryApi as string, params)
        }
      }
      promise.then(res => {
        let pagination = this.state.pagination as IUdPaginationConfig | false
        if (pagination && res.data) {
          if (this.state.paginationModel === 'FRONTED_PAGER') {
            pagination.current = this.queryParams.page || this.defaultQueryParams.page
            pagination.pageSize = this.queryParams.size || this.defaultQueryParams.size
            pagination.total = (res.data as any).length
          } else if (this.state.paginationModel === 'SEQUENCE_PAGER') {
            pagination.hasPrevious = (res.data as any)[BaseListPage.resFieldKeys.hasPrevious]
            pagination.hasNext = (res.data as any)[BaseListPage.resFieldKeys.hasNext]
            pagination.firstDataId = (res.data as any)[BaseListPage.resFieldKeys.firstDataId]
            pagination.lastDataId = (res.data as any)[BaseListPage.resFieldKeys.lastDataId]
            pagination.pageSize = (res.data as any)[BaseListPage.resFieldKeys.size]
            pagination.numberOfElements = (res.data as any)[BaseListPage.resFieldKeys.numberOfElements]
          } else {
            pagination.current = (res.data as any)[BaseListPage.resFieldKeys.number]
            pagination.pageSize = (res.data as any)[BaseListPage.resFieldKeys.size]
            pagination.total = (res.data as any)[BaseListPage.resFieldKeys.totalElements]
          }
        }
        let data = this.preHandleDataSource(res)
        if (pagination && pagination.current && pagination.current > 1 && (data == null || data.length == 0)) {
          this.handleParamsChange({ page: pagination.current - 1 })
        } else {
          this.setState({ dataSource: data, pagination })
        }
      }, res => {
        let pagination = this.state.pagination as IUdPaginationConfig | false
        if (pagination) {
          pagination.total = 0
        }
        if (this.state.paginationModel !== 'SEQUENCE_PAGER') {
          this.setState({ dataSource: [], pagination })
        }

      }).finally(() => {
        this.setState({ querying: false })
      })
    }
    if (beforeResult && beforeResult.then) {
      beforeResult.then(send).catch(() => {
        this.setState({ querying: false })
      })
    } else {
      send()
    }
  }

  /**
   * 查询之前处理
   */
  protected queryBefore = (params: any): (Promise<void> | boolean | void) => {
    return true
  }

  /**
   * 预处理接口返回的数据
   */
  protected preHandleDataSource = (res: AxiosResponse<IListRes<any>>) => {
    let data = []
    if (res.data) {
      data = (res.data as any)[BaseListPage.resFieldKeys.content] || res.data
    }
    return this.handleDataSource(data, res)
  }

  /**
   * 处理接口返回的数据
   */
  protected handleDataSource = (data: any, res: AxiosResponse<IListRes<any>>) => {
    return data
  }

  /**
   * 参数发生改变时
   */
  protected handleParamsChange<T = any>(params?: any, merge: boolean = true) {
    let query = this.queryParams
    if (params) {
      query = merge ? _.extend({}, this.queryParams, params) : params as QP
    }
    if (this.state.saveParamsWithUrl) { // 判断是否需要将参数写到url地址中
      let defaultUrlSearch = routeUtils.searchStringToObject(this.props.history.location.search, this.defaultQueryParams)
      let copyQuery = _.cloneDeep(query)
      delete copyQuery.v
      delete defaultUrlSearch.v
      let isSame = _.isEqual(copyQuery, defaultUrlSearch)
      if (!isSame) {
        this.pushQueryParams(query, false)
      } else {
        this.queryParams = query
        this.query()
      }
    } else {
      this.queryParams = query
      this.query()
    }
  }

  /** 
   * 处理条件过滤器查询事件
   */
  protected handleSearch = (values: any) => {
    if (this.state.onFilterSearch) {
      this.state.onFilterSearch(values)
    }
    let p: Partial<IListQueryParams> = {
      conditions: values,
      v: new Date().getTime()
    }
    if (this.state.pagination) {
      p.page = 1
      p.direction = 'NEXT'
      p.dataId = ''
    }
    this.handleParamsChange<IListQueryParams>(p)
  }

  /**
   * 获取查询参数
   * 如果查询参数非常特别可重写此方法
   */
  protected getQueryParams = () => {
    if (this.state.pagination) {
      let req: any = {}
      if (this.state.paginationModel === 'SEQUENCE_PAGER') {
        req = {
          size: this.queryParams.size,
          direction: this.queryParams.direction,
          dataId: this.queryParams.dataId,
        }
      } else {
        req = {
          size: this.queryParams.size,
          page: this.queryParams.page,
        }
      }

      if (udConfigProvider.api.useConditionsField) {
        req.conditions = {
          ...this.baseQueryParams, ...this.queryParams.conditions
        }
      } else {
        req = { ...req, ...this.baseQueryParams, ...this.queryParams.conditions }
      }
      return req
    } else {
      return { ...this.baseQueryParams, ...this.queryParams.conditions }
    }
  }

  /**
   * 处理 表格分页、排序、过滤功能相关数据发生改变事件
   */
  protected handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, Key[] | null>, sorter: SorterResult<any> | SorterResult<any>[], extra: any) => {
    let conditions = this.queryParams.conditions
    // TODO 暂时不支持多列排序
    if (!_.isArray(sorter)) {
      conditions.orderType = sorter.order
      conditions.orderBy = sorter.field
    }
    let p: Partial<IListQueryParams> = {
      conditions: conditions,
      v: new Date().getTime()
    }
    if (this.state.pagination) {
      if (this.state.paginationModel === 'FRONTED_PAGER') {
        let pager = this.state.pagination as IUdPaginationConfig
        pager.current = pagination.current || this.defaultQueryParams.page
        pager.pageSize = pagination.pageSize || this.defaultQueryParams.size
        this.setState({ pagination: pager })
        return
      } else {
        p.page = pagination.current || this.defaultQueryParams.page
        p.size = pagination.pageSize || this.defaultQueryParams.size
      }
    }
    this.handleParamsChange<IListQueryParams>(p)
  }

  /**
   * 是否有选中的行
   */
  protected existSelectedRow = () => {
    return this.selectedRowCount > 0
  }

  /**
   * 表格已选中行数
   */
  protected get selectedRowCount(): number {
    if (this.state && this.state.selectedRowKeys) {
      return this.state.selectedRowKeys.length
    }
    return 0
  }

}

export { BaseListPage }
