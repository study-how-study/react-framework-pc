import _ from 'lodash'
import moment, { Moment } from 'moment'
import React, { useEffect, useState } from 'react'
import { TimePicker } from 'antd'
import { TimeRangePickerProps } from 'antd/lib/time-picker'
import { Modify } from '../../../typings'

/**
 * 时间范围选择框
 */
const UdTimeRangePicker: React.FC<IUdTimeRangePickerProps> = (props) => {
  const [values, setValues] = useState<Moment[] | undefined>()

  const onChange = (values: any[], formatString: [string, string]) => {
    if (props.onChange) {
      props.onChange(formatString)
    }
  }

  useEffect(() => {
    if (_.isArray(props.value) && props.value[0] && props.value[1]) {

      let start = moment(props.value[0], props.format)
      let end = moment(props.value[1], props.format)

      if (start.isValid() && end.isValid()) {
        setValues([start, end])
      } else {
        setValues(undefined)
      }
    } else {
      setValues(undefined)
    }
  }, [props.value])

  let moreProps: any = {}

  if (Object.prototype.hasOwnProperty.call(props, 'value')) {
    moreProps.value = values
  }

  if (_.isArray(props.defaultValue) && props.defaultValue[0] && props.defaultValue[1]) {
    let start = moment(props.defaultValue[0], props.format)
    let end = moment(props.defaultValue[1], props.format)
    if (start.isValid() && end.isValid()) {
      moreProps.defaultValue = [start, end]
    } else {
      moreProps.defaultValue = null
    }
  }

  return (
    <TimePicker.RangePicker {...props} onChange={onChange} format={props.format} {...moreProps} />
  )
}

UdTimeRangePicker.defaultProps = {
  format: 'HH:mm'
}

export interface IUdTimeRangePickerProps extends Modify<TimeRangePickerProps, {
  defaultValue?: string[]
  value?: string[]
  onChange?(value: [string, string]): void
}> {
  /**
   * 选择时间时的格式
   * @default HH:mm
   */
  format?: string
  /** 
   * 默认值
   */
  defaultValue?: string[]
  /**
   * 当前值
   * 在结合表单使用时会自动注入
   */
  value?: string[]
  /**
   * 值发生改变时
   * 在结合表单使用时会自动注入
   */
  onChange?: (value: [string, string]) => void
}

export { UdTimeRangePicker }
