import React, { useState } from 'react'
import { message, Button } from 'antd'
import { UdCheckbox } from '../../../../index'

const Demo = () => {

  const [value, setValue] = useState<string>('N')

  const change = (value: string) => {
    setValue(value)
    message.success(value.toString())
  }

  return (
    <>
      <p>
        <Button onClick={() => { setValue(value === 'Y' ? 'N' : 'Y') }}>切换</Button>
      </p>
      <UdCheckbox value={value} checkedValue={'Y'} uncheckedValue={'N'} onChange={change}>是否记住密码</UdCheckbox>
    </>
  )
}

export default Demo
