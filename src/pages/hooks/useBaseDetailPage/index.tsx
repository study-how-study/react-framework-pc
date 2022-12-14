import _ from 'lodash'
import { AxiosResponse } from 'axios'
import React, { useState, ReactElement, ReactNode, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import classNames from 'classnames'
import { ClassValue } from 'classnames/types'
import { Spin, BackTop, Affix } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { UdPage, UdPageHeader, udConfigProvider, http, IUdDetailProps, UdDetail } from '../../..'

function useBaseDetailPage<T = any>(config: IUseBaseDetailPageConfig) {

  let cfg: IUseBaseDetailPageConfig = _.defaultsDeep({}, config, useBaseDetailPage.defaultConfig)

  const params = useParams<any>()

  const [querying, setQuerying] = useState(false)
  const [dataSource, setDataSource] = useState<T>({} as any)
  const pageContainer = useMemo(() => {
    return cfg.pageContainer || udConfigProvider.ui.getPageContainer()
  }, [cfg.pageContainer])

  const page = {
    states: { querying, dataSource },
    actions: {},
    lifecycles: {}
  } as IUseBaseDetailPage

  useEffect(() => {
    page.actions.query()
  }, [])

  page.actions.query = () => {
    setQuerying(true)

    let queryParams = page.actions.getQueryParams()

    let promise: Promise<AxiosResponse<T>>
    if (_.isFunction(cfg.queryApi)) {
      promise = cfg.queryApi(queryParams)
    } else {
      if (cfg.method == 'GET') {
        promise = http.get<T>(cfg.queryApi as string, { params: queryParams })
      } else {
        promise = http.post<T>(cfg.queryApi as string, queryParams)
      }
    }
    promise.then(res => {
      let data = res.data
      if (_.isFunction(page.lifecycles.handleDataSourceAfter)) {
        data = page.lifecycles.handleDataSourceAfter(data, res)
      }
      setDataSource(data)
    }).finally(() => {
      setQuerying(false)
    })
  }

  page.actions.getQueryParams = () => {
    return _.isFunction(cfg.params) ? cfg.params(params) : cfg.params
  }

  page.render = (slots) => {
    let body: ReactNode = null
    if (cfg.detail) {
      body = <UdDetail
        dataSource={dataSource}
        {...cfg.detail}
      />
    } else {
      body = slots && slots.body
    }

    let footer: ReactNode = null
    if (slots && slots.footer) {
      footer = <div className="detail-footer">{slots.footer}</div>
      if (pageContainer && cfg.useFooterAffix) {
        footer = <Affix offsetBottom={0} target={() => pageContainer}>{footer}</Affix>
      }
    }
    return (
      <UdPage className={classNames('detail-page', cfg.className)}>
        {
          cfg.title && (
            <UdPageHeader
              title={cfg.title} subTitle={cfg.subTitle}
              onBack={cfg.onBack} onRefresh={page.actions.query}
              useAffix={cfg.useHeaderAffix} affixProps={{ target: () => pageContainer }}
            />
          )
        }
        <Spin spinning={querying}>
          <div className="detail-body">
            {body}
          </div>
          {footer}
        </Spin>
        {cfg.useBackTop && pageContainer && <BackTop target={() => pageContainer} visibilityHeight={100} />}
      </UdPage>
    )
  }

  return page
}

useBaseDetailPage.defaultConfig = {
  onBack: true,
  method: 'GET',
  params: (params: any) => {
    return { id: params.id }
  },
  useHeaderAffix: true,
  useFooterAffix: true,
  useBackTop: true
} as Partial<IUseBaseDetailPageConfig>

export interface IUseBaseDetailPage<T = any> {
  states: Readonly<IUseBaseDetailPageStates<T>>
  actions: {
    query: () => void
    getQueryParams: () => any
  },
  lifecycles: IUseBaseDetailPageLifecycles<T>,
  render: (slots?: IUseBaseDetailPageSlots) => ReactElement<any, any> | null
}

export interface IUseBaseDetailPageStates<T> {
  querying: boolean
  dataSource: T
}

export interface IUseBaseDetailPageLifecycles<T> {
  /**
   * ?????? DataSource ???
   * ?????? DataSource ???
   * ?????????????????????????????????????????????
   */
  handleDataSourceAfter: (data: any, res: AxiosResponse<any>) => T
}

export interface IUseBaseDetailPageSlots {
  body?: ReactNode
  footer?: ReactNode
}

export interface IUseBaseDetailPageConfig {
  /**
   * ?????? ClassName
   * ?????????????????? detail-page
   */
  className?: ClassValue
  /**
   * ????????????
   */
  pageContainer?: HTMLElement
  /**
   * ?????????????????????
   * @default GET
   */
  method?: 'GET' | 'POST'
  /**
   * ??????API
   */
  queryApi: string | ((params: any) => Promise<any>)
  /**
   * ????????????
   * @default (params: any) => { return { id: params.id } }
   */
  params?: Store | ((params: any) => Store)
  /**
   * ??????
   */
  title?: string
  /**
   * ?????????
   */
  subTitle?: string
  /**
   * ????????????????????????
   * @default ???????????????
   */
  onBack?: boolean | (() => void)
  /**
   * ????????????????????????
   * @default true
   */
  useHeaderAffix?: boolean
  /**
   * ????????????????????????
   * @default true
   */
  useFooterAffix?: boolean
  /**
   * ?????? BackTop
   * @default true
   */
  useBackTop?: boolean
  /**
   * ????????????
   * ????????? UdDetail ??????
   * ??????????????? render ??? body ??????
   */
  detail?: IUdDetailProps
}

export { useBaseDetailPage }
