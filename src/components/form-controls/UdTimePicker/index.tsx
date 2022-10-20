import _ from 'lodash'
import moment, { Moment } from 'moment'
import React, { useEffect, useState } from 'react'
import { TimePicker } from 'antd'
import { TimePickerProps } from 'antd/lib/time-picker'
import { Modify } from '../../../typings'

/**
 * 时间选择框
 */
const UdTimePicker: React.FC<IUdTimePickerProps> = (props) => {
  const [values, setValues] = useState<Moment | undefined>()

  const onChange = (value: any) => {
    if (props.onChange) {
      props.onChange(value ? moment(value).format(props.format) : '')
    }
  }

  useEffect(() => {
    if (props.value) {
      let value = moment(props.value, props.format)
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
    let defaultValue = moment(props.defaultValue, props.format)
    moreProps.defaultValue = defaultValue.isValid() ? defaultValue : null
  }

  return (
    <TimePicker
      {...props}
      onChange={onChange}
      format={props.format}
      {...moreProps}
    />
  )
}

UdTimePicker.defaultProps = {
  format: 'HH:mm'
}

export interface IUdTimePickerProps extends Modify<TimePickerProps, {
  onChange?: (value: string) => void
  defaultValue?: string
  value?: string
}> {
  /**
   * 选择时间时的格式
   * @default HH:mm
   */
  format?: string
  /**
   * 值发生改变时
   * 在结合表单使用时会自动注入
  */
  onChange?: (value: string) => void
  /**
   * 默认值
   */
  defaultValue?: string
  /**
   * 当前值
   * 在结合表单使用时会自动注入
   */
  value?: string
}

export { UdTimePicker }
