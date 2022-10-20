import React from 'react'
import { Button, Divider, message } from 'antd'
import { useContextMenu } from '..'

export default () => {

  const { triggerElement, bindContextMenu } = useContextMenu()

  bindContextMenu([
    { content: '测试右键1', onClick: (e) => message.info(e.content) },
    <Divider key='divider' />,
    { content: '测试右键2', data: '2222', onClick: (e) => message.info(e.data) }
  ])

  return (
    <div>
      <Button ref={triggerElement as any}>可以右键哦</Button>
    </div>
  )
}