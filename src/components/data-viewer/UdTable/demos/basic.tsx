import React from 'react'
import { UdTable } from '../../../index'

const Demo = () => {
  return (
    <UdTable
      columns={[
        { title: '姓名', dataIndex: 'username', fixedWidth: '60px' },
        { title: '性别', dataIndex: 'gender', render: (value) => value == 0 ? '女' : '男' },
        { title: '年龄', dataIndex: 'age', style: (text) => { return { color: text > 18 ? 'red' : 'greed' } } },
      ]}
      dataSource={[
        { username: 'huyao', gender: 1, age: 18 },
        { username: '王小龙', gender: 1, age: 20 },
        { username: '郭德旺', gender: 1, age: 38 },
        { username: '萧亚', gender: 0, age: 16 },
      ]}
    />
  )
}

export default Demo
