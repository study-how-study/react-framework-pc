import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { useSize } from '../index'

const Demo: React.FC = () => {

  let divRef = useRef<HTMLElement | null>()
  const { width, height } = useSize(divRef)

  const [boxHeight, setBoxHeight] = useState(100)

  return (
    <>
      <p>宽度变化可通过改变浏览器可视区域的宽度来观察</p>
      <Button.Group>
        <Button onClick={() => { setBoxHeight(boxHeight + 5 > 500 ? 500 : boxHeight + 5) }}>增加容器高度</Button>
        <Button onClick={() => { setBoxHeight(boxHeight - 5 < 30 ? 30 : boxHeight - 5) }}>减少容器高度</Button>
      </Button.Group>
      <div style={{ display: 'flex', marginTop: '15px', height: boxHeight + 'px' }}>
        <div
          ref={(ref) => divRef.current = ref}
          style={{ background: '#42c4fe', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          width: {width}，height: {height}
        </div>
        <div style={{ background: '#4268feab', flex: '1' }}></div>
      </div>
    </>
  )
}

export default Demo
