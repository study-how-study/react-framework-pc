import React, { useState, useRef } from 'react'
import { Button } from 'antd'
import { useCreation } from '../index'

class Foo {
  constructor() {
    this.data = Math.random()
  }
  data: number
}

const demo: React.FC = () => {
  const foo = useCreation(() => new Foo(), [])
  const [flag, setFlag] = useState({})
  return (
    <>
      <p>{foo.data}</p>
      <Button onClick={() => setFlag({})}>点击</Button>
    </>
  )
}

export default demo
