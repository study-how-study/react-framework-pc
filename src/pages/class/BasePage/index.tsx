import _ from 'lodash'
import { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { routeUtils } from '../../..'

/**
 * 基础页面
 * 让页面支持url参数相关功能
 */
class BasePage<P extends RouteComponentProps = RouteComponentProps, S = {}, QP = any> extends Component<P, S> {

  /**
   * 默认query-string参数，
   * 必须给每个参数设定合理的默认值
   * 如果没设置默认值，将不会获取此参数
   */
  protected defaultQueryParams: QP = {} as QP
  /**
   * 查询参数
   */
  protected queryParams: QP = {} as QP

  constructor(props: P) {
    super(props)
  }

  componentWillMount() {
    this.processSearchString(this.props.location.search)
  }

  componentWillReceiveProps(nextProps: P) {
    if (this.props.location.search != nextProps.location.search) {
      this.processSearchString(nextProps.location.search)
      this.queryParamsChanged()
    }
  }

  /**
   * push Url查询参数
   * @param params 要改变的参数
   * @param merge true：合并，false：替换
   */
  protected pushQueryParams<T = any>(params?: Partial<T>, merge: boolean = true): void {
    let query = this.queryParams
    if (params) {
      if (merge) {
        query = _.extend({}, this.queryParams, params)
      } else {
        query = params as QP
      }
    }
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: routeUtils.objectToSearchString(query)
    })
  }

  /** 
   * url查询参数发生改变后
   * 子类在需要的时候重写此方法 
   */
  protected queryParamsChanged = () => {
    if (process.env.NODE_ENV == 'development') {
    }
  }

  /**
   * 处理url查询参数字符串
   * @param searchString 需要处理的 url query string
   * @description 处理完后，直接将结果赋值给 this.queryParams
   */
  protected processSearchString(searchString: string): void {
    this.queryParams = routeUtils.searchStringToObject(searchString, this.defaultQueryParams)
  }

}

export { BasePage }
