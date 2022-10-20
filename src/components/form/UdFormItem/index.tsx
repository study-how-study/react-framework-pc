import _ from 'lodash'
import React from 'react'
import classNames from 'classnames'
import { Input, Tooltip, DatePicker, Form } from 'antd'
import { FormInstance, FormItemProps, Rule } from 'antd/lib/form'
import { Modify, ChildrenType, formUtils, IColSpan, UdDateRangePicker, UdAjaxSelect, UdInput } from '../../..'
import { UdDatePicker } from '../../form-controls/UdDatePicker'
import { UdTimeRangePicker } from '../../form-controls/UdTimeRangePicker'

const UdFormItem: React.FC<IUdFormItemProps> = (props) => {

  const getControl = (): ChildrenType => {
    let control
    let children = props.render || props.children
    if (children) {
      if (_.isFunction(children) && props.form) {
        control = children(props.form) as any
      } else {
        control = children
      }
    } else {
      control = props.defaultControl == 'UdInput' ? <UdInput /> : <Input />
    }

    let placeholder: string = `请输入${props.label}`
    let controlProps: any = { allowClear: true, placeholder: placeholder, ...control.props }

    if (!control.props || !control.props.placeholder) {
      if (control.type && (control.type['SECRET_COMBOBOX_MODE_DO_NOT_USE'] || control.type.name === UdAjaxSelect.name)) {
        controlProps.placeholder = `请选择${props.label}`
      } else {
        let excludes = [UdDateRangePicker.name, DatePicker.name, UdDatePicker.name, UdTimeRangePicker.name]
        if (!props.label || excludes.includes(control.type.name)) {
          delete controlProps.placeholder
        }
      }
    }

    return React.cloneElement(control, controlProps)
  }

  let label = props.label
  if (props.labelUseTooltip) {
    label = <Tooltip placement="top" title={props.label}>{props.label as any}</Tooltip>
  }

  let rules: Rule[] = props.rules && props.rules.length > 0 ? _.clone(props.rules) : []
  if (props.required) {
    rules.push({ required: true })
  }

  if (props.id) {
    if (process.env.NODE_ENV == 'development') {
      console.error('UdFormItem控件 id 字段已停止使用，请更换为 name 字段。', props.id)
    }
  }

  const { id, form, col, ...stdProps } = props // 避免把多余的props，不然这些props体现在最终的html结构上。

  return (
    <Form.Item
      className={classNames('ud-form-item', props.name ? ('ud-form-item-' + formUtils.getItemKey(props)) : '', props.className)}
      {...stdProps}
      label={label}
      rules={rules}
    >
      {getControl()}
    </Form.Item>
  )
}

UdFormItem.defaultProps = {
  labelUseTooltip: false,
  defaultControl: 'UdInput'
}

export interface IUdFormItemProps extends IUdFormItem {
  /**
   * 表单实例对象
   * 在配合UdForm使用时会自动传入
   */
  form?: FormInstance | null
}

export interface IUdFormItem extends Modify<FormItemProps, {
  /** 
   * 传入符合antd表单控件的组件
   * @default `<UdInput />`
   */
  children?: ChildrenType
}> {
  /**
   * label 使用 Tooltip
   * @default false
   */
  labelUseTooltip?: boolean
  /** 
   * 兼容老版，等同于 children
   * 传入符合antd表单控件的组件
   * @default `<UdInput />`
   */
  render?: ChildrenType
  /**
   * 精简的colProps
   * 单独使用 UdFormItem 组件时无效
   * 目前 UdForm、UdFilter 支持此属性
   */
  col?: IColSpan
  /**
   * 默认控件类型
   * @default UdInput
   */
  defaultControl?: 'Input' | 'UdInput'
}

export { UdFormItem }
