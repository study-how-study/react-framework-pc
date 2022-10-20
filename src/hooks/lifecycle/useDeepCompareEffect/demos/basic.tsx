import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { useSetState, useDeepCompareEffect } from '../../../index'

const ChildComponent: React.FC<any> = (props) => {

  const [count, setCount] = useState(0)
  const [deepCount, setDeepCount] = useState(0)

  useEffect(() => {
    setCount(count + 1)
  }, [props])

  useDeepCompareEffect(() => {
    setDeepCount(deepCount + 1)
  }, [props])

  return (
    <div style={{ marginTop: '10px' }}>
      <div>useEffect 触发次数：{count}</div>
      <div>useDeepCompareEffect 触发次数：{deepCount}</div>
      <pre>{JSON.stringify(props, null, 4)}</pre>
    </div>
  )
}

const Demo: React.FC = () => {

  const [states, setStates] = useSetState<any>({
    prop1: '1',
    prop2: {
      prop21: 1,
      prop22: '22'
    }
  })

  return (
    <div>
      <div>
        <Button.Group>
          <Button onClick={() => setStates(states)}>设置相同的值</Button>
          <Button onClick={() => setStates({ prop2: { prop21: states.prop2.prop21 + 1 } })}>设置不同的值</Button>
        </Button.Group>
      </div>
      <ChildComponent {...states} />
    </div>
  )
}

export default Demo