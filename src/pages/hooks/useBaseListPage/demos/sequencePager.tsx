import React from 'react'
import { Select } from 'antd'
import { http, useBaseListPage } from '../../../../index'

const Demo: React.FC = () => {
  const { render } = useBaseListPage({
    title: '测试页面',
    queryApi: 'http://10.4.100.71:7300/mock/618a264ca659b100215c5a3d/sequence-pager/list',
    conditions: [
      { label: '姓名', name: 'name', },
    ],
    columns: [
      { title: '编号', dataIndex: 'id' },
      { title: '姓名', dataIndex: 'name' },
      { title: '性别', dataIndex: 'gender', render: (text) => text ? '男' : '女' },
      { title: '年龄', dataIndex: 'age' },
      { title: '邮箱', dataIndex: 'email' },
      { title: '城市', dataIndex: 'city' }
    ],
    paginationModel:'SEQUENCE_PAGER'
  })
  return render()
}

export default Demo
