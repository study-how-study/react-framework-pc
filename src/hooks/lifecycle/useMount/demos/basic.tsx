import React, { useState } from 'react'
import { message } from 'antd'
import { useMount, UdCheckbox } from '../../../../index'

const User: React.FC = () => {

  useMount(() => {
    message.success('挂载成功')
  })

  return <h3>User Component</h3>
}

const Demo: React.FC = () => {

  const [enableUser, setEnableUser] = useState(false)

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