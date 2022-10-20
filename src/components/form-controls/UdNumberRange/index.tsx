import _ from 'lodash'
import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { ClassValue } from 'classnames/types'
import { InputNumber } from 'antd'
import { InputNumberProps } from 'antd/lib/input-number'
import { SizeType } from 'antd/lib/config-provider/SizeContext'

const UdNumberRange: React.FC<IUdNumberRangeProps> = (props) => {

  const triggerChange = (value: [number | undefined, number | undefined]) => {
    if (props.onChange) {
      props.onChange(value)
    }
  }

  let commonProps = {
    step: props.step,
    disabled: props.disabled,
    size: props.size,
    formatter: props.formatter,
    parser: props.parser,
    decimalSeparator: props.decimalSeparator,
    precision: props.precision,
    placeholder: props.placeholder
  }

  const values = _.isArray(props.value) ? props.value : []

  return (
    <div className={classNames('ud-number-range', props.className)}>
      <InputNumber
        {...commonProps}
        {...props.begin}
        className={classNames('ud-number-range-begin', props.begin?.className)}
        value={values[0]}
        onChange={(val: any) => {
          triggerChange([val, values[1]])
        }} />
      <span className="ud-number-range-divider">{props.divider}</span>
      <InputNumber
        {...commonProps}
        {...props.end}
        className={classNames('ud-number-range-end', props.begin?.className)}
        value={values[1]}
        onChange={(val: any) => {
          triggerChange([values[0], val])
        }} />
    </div>
  )
}

UdNumberRange.defaultProps = {
  divider: '-'
}

export interface IUdNumberRangeProps {
  /**
   * class
   * 不管传没传，都会有一个 ud-number-range 的 className
   */
  className?: ClassValue
  /**
   * 开始输入框的props
   * 优先级高于外层属性
   */
  begin?: InputNumberProps
  /**
   * 结束输入框的props
   * 优先级高于外层属性
   */
  end?: InputNumberProps
  /**
   * 分隔符
   * @default -
   */
  divider?: ReactNode
  /**
   * 每次改变步数，可以为小数
   */
  step?: number
  /**
   * 禁用
   */
  disabled?: boolean
  /**
   * 输入框大小
   */
  size?: SizeType
  /**
   * 指定输入框展示值的格式
   */
  formatter?: (value: number | string | undefined) => string
  /**
   * 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用
   */
  parser?: (displayValue: string | undefined) => number | string
  /**
   * 小数点
   */
  decimalSeparator?: string
  /**
   * 数值精度
   */
  precision?: number
  /**
   * placeholder
   */
  placeholder?: string
  /**
   * 默认值
   */
  defaultValue?: string[]
  /**
   * 当前值
   * 在结合表单使用时会自动注入
   */
  value?: number[]
  /**
   * 值发生改变时
   * 在结合表单使用时会自动注入
   */
  onChange?: (value: [number | undefined, number | undefined]) => void
}

export { UdNumberRange }