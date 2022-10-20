import React, { useState } from 'react'
import { Button, Input } from 'antd'
import { useThrottle } from '../index'

const Demo: React.FC = () => {
  const [value, setValue] = useState(0)

  const { run } = useThrottle(
    () => {
      setValue(value + 1)
    },
    2000
  )

  return (
    <div>
      <p style={{ marginTop: 16 }}> Clicked count: {value} </p>
      <Button onClick={run}> Click fast!</Button>
    </div>
  )
}

export default Demo