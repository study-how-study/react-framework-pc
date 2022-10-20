import React from 'react'
import { Button } from 'antd'
import { useSetState } from '../../../../index'

const Demo: React.FC = () => {

  const [state, setState] = useSetState<any>()

  return (
    <>
      <Button.Group style={{ marginBottom: '15px' }}>
        <Button onClick={() => { setState({ count: (state.count || 0) + 1 }) }}>count</Button>
        <Button onClick={() => setState({ success: true })}>success</Button>
        <Button onClick={() => setState({ user: { name: '王力宏' } })}>user name</Button>
        <Button onClick={() => setState({ user: { age: 18 } })}>user age</Button>
        <Button onClick={() => setState({}, false)}>重置</Button>
      </Button.Group>
      <pre>{JSON.stringify(state, null, 4)}</pre>
    </>
  )
}

export default Demo
