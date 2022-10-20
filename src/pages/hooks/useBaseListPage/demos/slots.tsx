import React, { useState } from 'react'
import { Alert, Button } from 'antd'
import { useBaseListPage } from '../../../../index'
import Modal from 'antd/lib/modal/Modal'

const Demo = () => {
  const [show, setShow] = useState(false)

  const { states, render } = useBaseListPage({
    title: 'Render 插槽',
    useRowSelection: true,
    queryApi: 'http://10.4.100.71:7300/mock/5f1e2923354a5600202741f3/uaf/baseListPage/query',
    defaultQueryParams: {
      conditions: { name: '默认值' }
    },
    conditionInitialValues: { name: '默认值' },
    conditions: [
      { label: '姓名', name: 'name', },
      { label: '城市', name: 'city' }
    ],
    columns: [
      { title: '编号', dataIndex: 'id' },
      { title: '姓名', dataIndex: 'name' },
      { title: '性别', dataIndex: 'gender', render: (text) => text ? '男' : '女' },
      { title: '年龄', dataIndex: 'age' },
      { title: '邮箱', dataIndex: 'email' },
      { title: '城市', dataIndex: 'city' }
    ],
    leftBtns: [
      <Button onClick={() => { setShow(true) }}>打开</Button>
    ]
  })
  return render({
    header: <Alert type="info" message={`自定义页头下方区域`} style={{ marginBottom: '10px' }} />,
    filterBelow: <Alert type="success" message={`当前勾选了 ${states.selectedRows.length} 条数据。`} style={{ marginBottom: '10px' }} />,
    footer: (
      <p>
        <Modal visible={show} onCancel={() => { setShow(false) }}>
          <p>测试内容</p>
        </Modal>
        <strong>当前查询参数</strong>
        <pre>
          {JSON.stringify(states.queryParams, null, 4)}
        </pre>
      </p>
    )
  })
}

export default Demo
