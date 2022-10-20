import React, { useState } from 'react'
import { Switch } from 'antd'
import { useTitle } from '../../../../index'

const List: React.FC = () => {

  useTitle('列表页', { restoreOnUnmount: true })

  return (
    <p>列表页内容</p>
  )
}

const Demo: React.FC = () => {

  const [useList, setUseList] = useState(false)

  return (
    <div>
      <p>注意观察页面的 Title</p>
      <p>
        <Switch checkedChildren="挂载" unCheckedChildren="卸载" defaultChecked={useList} onChange={(checked) => {
          setUseList(checked)
        }} />
      </p>
      {useList && <List />}
    </div>
  )
}

export default Demo
