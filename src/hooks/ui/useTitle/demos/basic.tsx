import React, { useState } from 'react'
import { useTitle, UdForm } from '../../../../index'

const Demo: React.FC = () => {

  const [title, setTitle] = useState(document.title)

  useTitle(title)

  return (
    <UdForm
      header={<p style={{ marginBottom: '15px' }}>注意观察页面的 Title</p>}
      initialValues={{ title }}
      items={[
        { label: '标题', name: 'title' }
      ]}
      onFinish={(values) => {
        setTitle(values.title)
      }}
    />
  )
}

export default Demo
