import React, { useState, useEffect } from 'react'
import { Button, Input, message } from 'antd'
import { UdModal, IUdModalContentProps } from '../../../../index'

const Demo: React.FC = () => {

  function openCustomModal() {
    UdModal.open({
      title: '自定义组件',
      content: <CustomContent />,
      onOk: (value) => {
        message.success('Input的值：' + value)
      }
    })
  }

  return <Button type="primary" onClick={openCustomModal}>打开弹窗</Button>
}

const CustomContent: React.FC<IUdModalContentProps> = (props) => {

  const [value, setValue] = useState('')

  useEffect(() => {
    props.getHandler!(() => value)
  }, [value])

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  return (
    <div>
      <p>内容：</p>
      <Input onChange={onChange} value={value} />
    </div>
  )
}

export default Demo