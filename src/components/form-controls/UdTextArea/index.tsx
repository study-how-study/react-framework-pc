import React from 'react'
import { Input, InputProps } from 'antd'
import { TextAreaProps } from 'antd/lib/input'

const UdTextArea: React.FC<IUdTextAreaProps> = (props) => {

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
    <Input.TextArea {...standardProps} onBlur={onBlur} />
  )
}

UdTextArea.defaultProps = {
  useTrim: true
}

interface IUdTextAreaProps extends TextAreaProps {
  /**
   * 前后去除空格
   * @default true
   */
  useTrim?: boolean
}

export { UdTextArea }