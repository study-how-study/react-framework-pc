import React from 'react'
import { withRouter } from 'react-router-dom'
import { Select, Button, message } from 'antd'
import { BaseListPage, IBaseListPageState, IBaseListPageProps } from '../../../../index'
import { http } from '../../../../core'

class Demo extends BaseListPage<IBaseListPageProps, IBaseListPageState> {
  constructor(props: IBaseListPageProps) {
    super(props)
    this.state = {
      title: '基础列表页',
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
        { title: '城市', dataIndex: 'city' },
      ],
      paginationModel:'SEQUENCE_PAGER'
    }
  }


}

// 由于这个地方是Demo 需要用路由对象包一层
export default withRouter(Demo) 
