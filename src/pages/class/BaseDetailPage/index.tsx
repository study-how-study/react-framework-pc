import _ from 'lodash'
import React, { ReactNode } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import classNames from 'classnames'
import { ClassValue } from 'classnames/types'
import { Spin, Affix, BackTop } from 'antd'
import { BasePage } from '../..'
import { udConfigProvider, UdPage, UdPageHeader } from '../../..'

/** 
 * 基本详情页
 */
class BaseDetailPage<
  P extends IBaseDetailPageProps = IBaseDetailPageProps,
  S extends IBaseDetailPageState = IBaseDetailPageState>
  extends BasePage<P, S> {

  protected pageContainer = udConfigProvider.ui.getPageContainer()

  static defaultStates: Partial<IBaseDetailPageState> = {
    title: '',
    queryAction: (() => {
      if (process.env.NODE_ENV == 'development') {
        throw new Error('必须在子类中重写此状态，发起数据请求并且返回Promise。')
      }
    }) as any,
    querying: false,
    dataSource: {},
    useHeaderAffix: true,
    useFooterAffix: true,
    useBackTop: true
  }

  componentWillMount(otherState?: Partial<S>) {
    super.componentWillMount()
    let state = _.defaultsDeep({}, otherState, this.state, BaseDetailPage.defaultStates)
    this.setState(state)
  }

  componentDidMount() {
    this.query()
  }

  render(slot?: {
    body?: ReactNode
    footer?: ReactNode
  }) {
    let { title, querying } = this.state
    if (_.isFunction(title)) {
      title = title()
    }
    let footer: ReactNode = null
    if (slot && slot.footer) {
      footer = <div className="detail-footer">{slot.footer}</div>
      if (this.pageContainer && this.state.useFooterAffix) {
        footer = <Affix offsetBottom={0} target={() => this.pageContainer}>{footer}</Affix>
      }
    }

    return (
      <UdPage className={classNames('detail-page', this.state.className)}>
        {
          title && <UdPageHeader title={this.state.title} subTitle={this.state.subTitle}
            onRefresh={this.query} onBack={this.onBack}
            useAffix={this.state.useHeaderAffix} affixProps={{ target: () => this.pageContainer }} />
        }
        <Spin spinning={querying}>
          <div className="detail-body">
            {slot && slot.body}
          </div>
          {footer}
        </Spin>
        {this.state.useBackTop && this.pageContainer && <BackTop target={() => this.pageContainer} visibilityHeight={100} />}
      </UdPage>
    )
  }

  /** 
   * 发起查询 
   */
  protected query = () => {
    this.setState({ querying: true });
    this.state.queryAction().then(res => {
      let data = this.handleDataSource(res)
      this.setState({ dataSource: data })
    }).finally(() => {
      this.setState({ querying: false })
    })
  }

  /** 
   * query 成功后处理数据
   */
  protected handleDataSource = (res: any) => {
    return res.data
  }

  /** 
   * 返回
   */
  protected onBack = () => {
    window.history.back()
  }

}

export interface IBaseDetailPageProps<Params extends { [K in keyof Params]?: string } = {}> extends RouteComponentProps<Params> {

}

export interface IBaseDetailPageState {
  /**
   * 标题
   * @type ReactNode | (() => ReactNode)
   */
  title: ReactNode | (() => ReactNode)
  /**
   * 副标题
   * @type ReactNode | (() => ReactNode)
   */
  subTitle?: ReactNode | (() => ReactNode)
  /**
   * 查询API
   */
  queryAction: () => Promise<any>
  /**
   * 查询状态
   */
  querying?: boolean
  /**
   * 详情数据源
   */
  dataSource?: any
  /**
   * 页面 ClassName
   */
  className?: ClassValue
  /**
   * 页头是否使用固钉
   * @default true
   */
  useHeaderAffix?: boolean
  /**
   * 页脚是否使用固钉
   * @default true
   */
  useFooterAffix?: boolean
  /**
   * 使用 BackTop
   * @default true
   */
  useBackTop?: boolean
}

export { BaseDetailPage }
