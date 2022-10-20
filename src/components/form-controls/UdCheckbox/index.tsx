import React, { useEffect } from 'react'
import { Checkbox } from 'antd'
import { CheckboxProps, CheckboxChangeEvent } from 'antd/lib/checkbox'

/**
 * UdCheckbox
 */
const UdCheckbox: React.FC<UdCheckboxProps> = (props) => {
  let moreProps: Partial<UdCheckboxProps> = {}
  if (props.onChange) {
    moreProps.onChange = (e: CheckboxChangeEvent) => {
      let newValue = e.target.checked ? props.checkedValue : props.uncheckedValue
      props.onChange(newValue)
    }
  }

  if (props.defaultChecked == null) {
    if (props.value === props.checkedValue) {
      moreProps.checked = true
    }
    if (props.value == null || props.value === props.uncheckedValue) {
      moreProps.checked = false
    }
  } else {
    if (props.defaultChecked === props.checkedValue) {
      moreProps.defaultChecked = true
    }
    if (props.defaultChecked === props.uncheckedValue) {
      moreProps.defaultChecked = false
    }
  }

  return <Checkbox {...props} {...moreProps}>{props.children}</Checkbox>
}

UdCheckbox.defaultProps = {
  checkedValue: true,
  uncheckedValue: false
}

export interface UdCheckboxProps extends CheckboxProps {
  /**
   * 不需要手动传递
   * 在结合表单使用时会自动注入
   */
  value?: any
  /**
   * 不需要手动传递
   * 在结合表单使用时会自动注入
   */
  onChange?: any
  /**
   * 选中时的返回的值
   * @default true
   */
  checkedValue?: any
  /**
   * 未选中时返回的值
   * @default false
   */
  uncheckedValue?: any
}

export { UdCheckbox }
