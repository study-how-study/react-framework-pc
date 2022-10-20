import React from 'react'
import { useMouse } from '../index'

export default () => {
  const mouse = useMouse()
  return <div>Mouse Pos: {JSON.stringify(mouse)}</div>
}