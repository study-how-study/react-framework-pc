import React, { useState } from 'react'
import { Button, message } from 'antd'
import { useBaseDetailPage, UdTable } from '../../../../index'

const Demo: React.FC = () => {

  const [count, setCount] = useState(0)

  const { states, render } = useBaseDetailPage({
    title: '详情页面',
    method: 'POST',
    queryApi: 'http://10.4.100.71:7300/mock/5f1e2923354a5600202741f3/uaf/ud-detail-page'
  })

  const handleClick = () => {
    let newCount = count + 1
    setCount(newCount)
    message.info(newCount)
  }

  return render({
    body: (
      <UdTable
        dataSource={[states.dataSource]}
        columns={[
          { title: '编号', dataIndex: 'id', },
          { title: '状态', dataIndex: 'status', },
          { title: '用户名', dataIndex: 'username', },
          { title: '姓名', dataIndex: 'name', },
          { title: '工号', dataIndex: 'jobNumber', },
          { title: '手机号码', dataIndex: 'phone', },
          { title: '部门', dataIndex: 'dept', },
          { title: '职位', dataIndex: 'post' }
        ]}
        pagination={false}
      />
    ),
    footer: (
      <Button onClick={handleClick}>点我记个数</Button>
    )
  })
}

export default Demo
