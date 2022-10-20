import React from 'react'
import { Button } from 'antd'
import { useToggle } from '../index'

export default () => {
  const [state, { toggle }] = useToggle()
  return (
    <div>
      <p>Effects：{`${state}`}</p>
      <Button.Group>
        <Button onClick={() => toggle()}>Toggle</Button>
        <Button onClick={() => toggle(false)}>Toggle False</Button>
        <Button onClick={() => toggle(true)}>Toggle True</Button>
      </Button.Group>
    </div>
  )
}