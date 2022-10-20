import React, { useState } from 'react'
import { message, Button } from 'antd'
import { UdSwitch } from '../../../../index'

const Demo = () => {

  const [value, setValue] = useState<string>('Disable')

  const change = (value: string) => {
    setValue(value)
    message.success(value.toString())
  }

  return (
    <>
      <p>
        <Button onClick={() => { setValue(value === 'Enable' ? 'Disable' : 'Enable') }}>切换</Button>
      </p>
      <UdSwitch value={value} checkedChildren={'启用'} checkedValue={'Enable'} unCheckedChildren={'禁用'} uncheckedValue={'Disable'} onChange={change}/>
    </>
  )
}

export default Demo
