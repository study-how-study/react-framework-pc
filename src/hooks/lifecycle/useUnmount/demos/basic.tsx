import React, { useState } from 'react'
import { message } from 'antd'
import { useUnmount, UdCheckbox } from '../../../../index'

const User: React.FC = () => {

  useUnmount(() => {
    message.warn('卸载成功')
  })

  return <h3>User Component</h3>
}

const Demo: React.FC = () => {

  const [enableUser, setEnableUser] = useState(true)

  return (
    <div>
      <p>
        <UdCheckbox value={enableUser} onChange={(e: boolean) => setEnableUser(e)}>启用</UdCheckbox>
      </p>
      <p>{enableUser && <User />}</p>
    </div>
  )
}

export default Demo