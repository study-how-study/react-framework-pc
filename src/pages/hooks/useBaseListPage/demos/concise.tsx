import React from 'react'
import { useBaseListPage } from '../../../../index'

const Demo: React.FC = () => useBaseListPage({
  title: '测试页面',
  queryApi: 'http://10.4.100.71:7300/mock/5f1e2923354a5600202741f3/uaf/baseListPage/query',
  conditions: [
    { label: '姓名', name: 'name', },
    { label: '城市', name: 'city' }
  ],
  columns: [
    { title: '编号', dataIndex: 'id' },
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '城市', dataIndex: 'city' }
  ]
}).render()

export default Demo
