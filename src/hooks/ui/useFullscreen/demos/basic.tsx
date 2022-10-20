import React, { useRef } from 'react';
import { Button } from 'antd'
import { useFullscreen } from '../index'

export default () => {
  const ref = useRef(null)
  const [isFullscreen, { setFull, exitFull, toggleFull }] = useFullscreen(ref)
  return (
    <div style={{ background: 'white' }} ref={ref}>
      <div style={{ marginBottom: 16 }}>{isFullscreen ? 'Fullscreen' : 'Not fullscreen'}</div>
      <Button.Group>
        <Button onClick={setFull}>setFull</Button>
        <Button onClick={exitFull}>exitFull</Button>
        <Button onClick={toggleFull}>toggle</Button>
      </Button.Group>
    </div>
  )
}