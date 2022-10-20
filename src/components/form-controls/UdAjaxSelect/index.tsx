import _ from 'lodash'
import { AxiosPromise } from 'axios'
import React, { useState, useEffect, ReactElement, ReactNode } from 'react'
import { Select } from 'antd'
import { SelectProps } from 'antd/lib/select'
import { http } from '../../..'

const { Option } = Select

function UdAjaxSelect(props: UdAjaxSelectProps) {

  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [params, setParams] = useState<any>({})

  let { mapping } = props

  useEffect(() => {
    if (props.queryAfterMount) {
      query(props)
    }
    if (_.isString(props.query) && props.params) {
      setParams(props.params)
    }
  }, [])

  useEffect(() => {
    if (_.isString(props.query) && !_.isEqual(params, props.params)) {
      query(props)
    }
  }, [props.params])

  const query = (props: UdAjaxSelectProps) => {
    setLoading(true)
    let promise: Promise<any>

    if (_.isString(props.query)) {
      let params = _.omitBy(props.params, _.isNil)
      if (_.isEmpty(params) && props.paramsIsEmptyNoQuery) {
        promise = new Promise((resolve) => resolve([]))
      } else {
        if (props.method == 'GET') {
          promise = http.get(props.query, { params })
        } else {
          promise = http.post(props.query, params)
        }
      }
    } else if (_.isFunction(props.query)) {
      promise = (props.query() as any)
    } else {
      promise = props.query as any
    }

    promise.then((res: any) => {
      let dataSource
      if (_.isFunction(props.transformResponse)) {
        dataSource = props.transformResponse(res)
      } else {
        dataSource = _.get(res, 'data.content', _.get(res, 'data', []))
      }
      props.onQuerySuccess && props.onQuerySuccess(dataSource)
      setDataSource(dataSource)
    }).finally(() => {
      setLoading(false)
    })
  }

  function buildOptions() {
    let options: ReactNode[] = []
    if (_.isArray(dataSource) && dataSource.length > 0) {
      let func: (value: any, index: number, array: any[]) => ReactNode
      if (mapping == 'array') {
        func = UdAjaxSelect.defaultMappingSchemes.array
      } else if (_.isFunction(mapping)) {
        func = mapping
      } else if (_.isObject(mapping)) {
        func = ((value: any, index: number, array: any[]) => {
          return <Option key={value[(mapping as any).value]} value={value[(mapping as any).value]} title={value[(mapping as any).title]}>{value[(mapping as any).title]}</Option>
        })
      } else {
        func = UdAjaxSelect.defaultMappingSchemes.default
      }
      dataSource.forEach((value, index, array) => {
        options.push(func(value, index, array))
      })
    }
    return options
  }

  return (
    <Select
      loading={loading}
      showSearch
      optionFilterProp="children"
      getPopupContainer={triggerNode => triggerNode.parentNode}
      filterOption={(input: string, option: any) => {
        let text = option.children || ''
        if (_.isArray(option.children)) {
          text = option.children.join('')
        }
        return text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }}
      {...props}
    >
      {buildOptions()}
    </Select>
  )
}

UdAjaxSelect.defaultProps = {
  paramsIsEmptyNoQuery: false,
  queryAfterMount: true,
  method: 'POST',
  allowClear: true,
  mapping: 'default'
}

UdAjaxSelect.defaultMappingSchemes = {
  default: (value: any, index: number, array: any[]) => {
    return <Option key={value.value} value={value.value} title={value.title}>{value.title}</Option>
  },
  array: (value: any, index: number, array: any[]) => {
    return <Option key={value} value={value} title={value}>{value}</Option>
  }
}

export interface UdAjaxSelectProps extends SelectProps<any> {
  /**
   * 挂载后发起查询
   * @default true
   */
  queryAfterMount?: boolean
  /**
   * 请求方式
   * 仅在 query 为 string 类型时有效
   * @default POST
   */
  method?: 'GET' | 'POST'
  /** 
   * 数据查询方法
   */
  query?: string | (() => (Promise<any> | AxiosPromise<any>)) | (Promise<any> | AxiosPromise<any>)
  /**
   * 请求参数
   * 仅在 query 为 string 类型时有效
   */
  params?: any
  /**
   * 当时参数为空时，不发起请求。
   * 并将列表清空
   * @default false
   */
  paramsIsEmptyNoQuery?: boolean
  /** 
   * 转换接口返回的数据
   */
  transformResponse?: (res: any) => any[]
  /** 
   * 用于把数据映射成 Select.Option 的方法 
   * 默认使用 title 和 value 字段
   * @default default
   * @type 'default' | 'array' | { title: string, value: string } | ((value: any, index: number, array: any[]) => ReactElement)
   */
  mapping?: 'default' | 'array' | { title: string, value: string } | ((value: any, index: number, array: any[]) => ReactElement)
  /**
   * 数据查询成功后
   */
  onQuerySuccess?: (data: any) => void
}

export { UdAjaxSelect }
