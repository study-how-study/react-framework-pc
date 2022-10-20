import React, { useRef } from 'react'
import { useScroll } from '../index'

export default () => {
  const ref = useRef(null)
  const scroll = useScroll(ref)

  let nodes = []
  for (let i = 0; i < 20; i++) {
    nodes.push(<div style={{ padding: '20px 5px' }}>滚动获取滚动条位置信息…………滚动获取滚动条位置信息…………</div>)
  }

  return (
    <>
      <p>{JSON.stringify(scroll)}</p>
      <div
        ref={ref}
        style={{ width: '500px', height: '160px', border: 'solid 1px #1890ff', overflow: 'scroll' }}
      >
        {nodes}
      </div>
    </>
  )
}