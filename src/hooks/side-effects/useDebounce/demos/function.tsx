
import React, { useState } from 'react'
import { Button } from 'antd'
import { useDebounce } from '../index'

const Demo: React.FC = () => {

  const [value, setValue] = useState(0)
  const { run, cancel } = useDebounce(
    () => {
      setValue(value + 1)
    },
    500
  )

  return (
    <div>
      <p style={{ marginTop: 16 }}> 点击次数: {value} </p>
      <Button onClick={run}>Click fast!</Button>
    </div>
  )
}

export default Demo
