import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import moment, { Moment } from 'moment'
import { DatePicker } from 'antd'
import { PickerDateProps } from 'antd/lib/date-picker/generatePicker'

/**
 * 日期选择器
 */
const UdDatePicker: React.FC<IUdDatePickerProps> = (props) => {
  const [values, setValues] = useState<Moment | undefined>()

  const format = props.showTime ? props.showTimeFormat : props.format

  function triggerChange(value: any) {
    if (props.onChange) {
      props.onChange(value ? moment(value).format(format) : '')
    }
  }

  useEffect(() => {
    if (props.value) {
      let value = moment(props.value)
      if (value.isValid()) {
        setValues(value)
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
  if (props.defaultValue) {
    let defaultValue = moment(props.defaultValue)
    moreProps.defaultValue = defaultValue.isValid() ? defaultValue : null
  }

  return (
    <DatePicker
      {...props}
      format={format}
      onChange={triggerChange}
      {...moreProps}
    />
  )
}

UdDatePicker.defaultProps = {
  format: 'YYYY-MM-DD',
  showTimeFormat: 'YYYY-MM-DD HH:mm:ss'
}

export interface IUdDatePickerProps extends PickerDateProps<any> {
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
  defaultValue?: string
  /**
   * 当前值
   * 在结合表单使用时会自动注入
   */
  value?: string
  /**
   * 值发生改变时
   * 在结合表单使用时会自动注入
   */
  onChange?: (value: string) => void
}

export { UdDatePicker }
