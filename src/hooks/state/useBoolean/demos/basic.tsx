import React from 'react'
import { Button } from 'antd'
import { useBoolean } from '../../../../index'

const Demo: React.FC = () => {

  const [value, toggle] = useBoolean(false)

  return (
    <>
      <Button.Group style={{ marginBottom: '15px' }}>
        <Button onClick={() => toggle()}>toggle</Button>
        <Button onClick={() => toggle(true)}>set true</Button>
        <Button onClick={() => toggle(false)}>set false</Button>
      </Button.Group>
      <div>{value.toString()}</div>
    </>
  )
}

export default Demo
