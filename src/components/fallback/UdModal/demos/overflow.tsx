import React from 'react'
import { Button } from 'antd'
import { UdModal } from '../../../../index'

const Demo: React.FC = () => {

  const openModal = () => {
    UdModal.open({
      title: '超多内容',
      scroll: 'auto',
      // centered: false, 在scroll为auto时，固定为true,设置为false无效
      content: <div style={{ width: '200vw', height: '200vh' }}>很多很多内容。</div>
    })
  }

  return (
    <Button.Group>
      <Button type="primary" onClick={openModal}>超多内容</Button>
    </Button.Group>
  )
}

export default Demo
