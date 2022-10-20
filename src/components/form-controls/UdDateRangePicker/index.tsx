import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import moment, { Moment } from 'moment'
import { DatePicker } from 'antd'
import { RangePickerDateProps } from 'antd/lib/date-picker/generatePicker'
import { Modify } from '../../../typings'

const { RangePicker } = DatePicker

/**
 * 日期范围选择器
 */
const UdDateRangePicker: React.FC<IUdDateRangePickerProps> = (props) => {

  const [values, setValues] = useState<Moment[] | undefined>()

  const format = props.showTime ? props.showTimeFormat : props.format

  function triggerChange(values: any, formatString: [string, string]) {
    if (props.onChange) {
      if (!props.showTime && props.timeFill) {
        let start = formatString[0] ? formatString[0] + ' 00:00:00' : null
        let end = formatString[1] ? formatString[1] + ' 23:59:59' : null
        props.onChange([start, end])
      } else {
        props.onChange(formatString)
      }
    }
  }

  useEffect(() => {
    if (_.isArray(props.value) && props.value[0] && props.value[1]) {
      setValues([moment(props.value[0]), moment(props.value[1])])
    } else {
      setValues(undefined)
    }
  }, [props.value])

  let moreProps: any = {}

  if (Object.prototype.hasOwnProperty.call(props, 'value')) {
    moreProps.value = values
  }
  if (props.defaultValue) {
    let start = moment(props.defaultValue[0])
    let end = moment(props.defaultValue[1])
    if (start.isValid() && end.isValid()) {
      moreProps.defaultValue = [start, end]
    } else {
      moreProps.defaultValue = null
    }
  }

  return (
    <RangePicker
      {...props}
      format={format}
      onChange={triggerChange}
      {...moreProps}
    />
  )
}

UdDateRangePicker.defaultProps = {
  format: 'YYYY-MM-DD',
  showTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  timeFill: false
}

export interface IUdDateRangePickerProps extends Modify<RangePickerDateProps<any>, {
  defaultValue?: string[]
  value?: string[]
  onChange?(value: [string, string]): void
}> {
  /**
   * 选择日期时的格式
   * @default YYYY-MM-DD
   */
  format?: string
  /**
   * 显示时间时的格式
   * @default YYYY-MM-DD HH:mm:ss
   */
  showTimeFormat?: string
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
   * 自动填充 00:00:00，23:59:59 时间
   * 时间格式为HH:mm:ss，暂时不支持修改
   * 仅在 showTime = false 有效
   * @default false
   */
  timeFill?: boolean
  /**
   * 值发生改变时
   * 在结合表单使用时会自动注入
   */
  onChange?: (value: [string, string]) => void
}

export { UdDateRangePicker }