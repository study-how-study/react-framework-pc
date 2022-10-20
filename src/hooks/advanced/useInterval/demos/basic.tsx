import React, { useState } from 'react'
import { useInterval } from '../../../../index'

const Demo: React.FC = () => {

  const [count, setCount] = useState(0)

  useInterval(() => {
    setCount(count + 1)
  }, 1000)

  return <p>count：<strong>{count}</strong></p>
}

export default Demo