import React from 'react'
import { AxiosResponse } from 'axios'
import { message } from 'antd'
import { useBaseListPage, IListRes } from '../../../../index'

const Demo: React.FC = () => {
  const { render, lifecycles } = useBaseListPage({
    title: '生命周期',
    subTitle: '请结合代码查看',
    queryApi: 'http://10.4.100.71:7300/mock/5f1e2923354a5600202741f3/uaf/baseListPage/query',
    conditions: [
      { label: '姓名', name: 'name', },
      { label: '城市', name: 'city' }
    ],
    columns: [
      { title: '序号', dataIndex: 'index' },
      { title: '姓名', dataIndex: 'name' },
      { title: '性别', dataIndex: 'gender', render: (text) => text ? '男' : '女' },
      { title: '年龄', dataIndex: 'age' },
      { title: '邮箱', dataIndex: 'email' },
      { title: '城市', dataIndex: 'city' },
      { title: '头像', dataIndex: 'headPortrait', render: (text) => <div style={{ width: '50px', height: '50px' }}><img src={text} alt="" /></div> },
    ]
  })
  lifecycles.queryBefore = (params: any) => {
    if (params.conditions.name == 'huyao') {
      message.warn('条件有敏感信息，无法进行查询。')
      return false
    }
  }
  lifecycles.handleDataSourceAfter = (data: any[], res: AxiosResponse<IListRes<any>>) => {
    return data.map((n, index) => {
      return { index, ...n }
    })
  }
  return render()
}

export default Demo
