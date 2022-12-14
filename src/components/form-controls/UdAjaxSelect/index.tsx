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
   * ?????????????????????
   * @default true
   */
  queryAfterMount?: boolean
  /**
   * ????????????
   * ?????? query ??? string ???????????????
   * @default POST
   */
  method?: 'GET' | 'POST'
  /** 
   * ??????????????????
   */
  query?: string | (() => (Promise<any> | AxiosPromise<any>)) | (Promise<any> | AxiosPromise<any>)
  /**
   * ????????????
   * ?????? query ??? string ???????????????
   */
  params?: any
  /**
   * ??????????????????????????????????????????
   * ??????????????????
   * @default false
   */
  paramsIsEmptyNoQuery?: boolean
  /** 
   * ???????????????????????????
   */
  transformResponse?: (res: any) => any[]
  /** 
   * ???????????????????????? Select.Option ????????? 
   * ???????????? title ??? value ??????
   * @default default
   * @type 'default' | 'array' | { title: string, value: string } | ((value: any, index: number, array: any[]) => ReactElement)
   */
  mapping?: 'default' | 'array' | { title: string, value: string } | ((value: any, index: number, array: any[]) => ReactElement)
  /**
   * ?????????????????????
   */
  onQuerySuccess?: (data: any) => void
}

export { UdAjaxSelect }
