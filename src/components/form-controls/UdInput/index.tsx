import React from 'react'
import { Input, InputProps } from 'antd'

const UdInput: React.FC<IUdInputProps> = (props) => {

  let { useTrim, ...standardProps } = props

  const onBlur = (e: any) => {
    if (useTrim) {
      let value = props.value as string
      if (value) {
        let newValue = value.trim()
        if (value != newValue) {
          e.target.value = newValue
          props.onChange && props.onChange(e)
        }
      }
    }
    props.onBlur && props.onBlur(e)
  }

  return (
    <Input {...standardProps} onBlur={onBlur} />
  )
}

UdInput.defaultProps = {
  useTrim: true
}

interface IUdInputProps extends InputProps {
  /**
   * 前后去除空格
   * @default true
   */
  useTrim?: boolean
}

export { UdInput }