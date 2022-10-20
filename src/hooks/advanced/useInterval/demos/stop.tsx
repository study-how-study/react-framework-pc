import React, { useState } from 'react'
import { Switch } from 'antd'
import { useInterval } from '../../../../index'

const Demo: React.FC = () => {

  const [count, setCount] = useState(0)
  const [running, setRunning] = useState(true)

  useInterval(() => {
    setCount(count + 1)
  }, running ? 1000 : null)

  return (
    <div>
      <p>count：<strong>{count}</strong></p>
      <Switch checkedChildren="开启" unCheckedChildren="停止" checked={running} onChange={(e) => setRunning(e)}></Switch>
    </div>
  )
}

export default Demo