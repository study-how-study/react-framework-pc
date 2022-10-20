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
      queryApi: 'http://10.4.100.71:7300/mock/5f1e2923354a5600202741f3/uaf/baseListPage/query',
      conditions: [
        { label: '姓名', name: 'name', },
        {
          label: '性别', name: 'gender', render:
            <Select>
              <Select.Option value={'true'}>男</Select.Option>
              <Select.Option value={'false'}>女</Select.Option>
            </Select>
        },
        { label: '城市', name: 'city' }
      ],
      columns: [
        { title: '编号', dataIndex: 'id' },
        { title: '姓名', dataIndex: 'name' },
        { title: '性别', dataIndex: 'gender', render: (text) => text ? '男' : '女' },
        { title: '年龄', dataIndex: 'age' },
        { title: '邮箱', dataIndex: 'email' },
        { title: '城市', dataIndex: 'city' },
      ],
      leftBtns: [<Button onClick={this.submit} type="primary">通过</Button>],
      rigthBtns: [<Button onClick={this.add} type="primary">新增</Button>],
    }
  }

  private submit = () => {
    if (this.existSelectedRow()) {
      message.success('选中的 id 为：' + this.state.selectedRowKeys)
    } else {
      return message.warning('请选择需要提交的数据')
    }
  }

  private add = () => {
    message.success('点击新增')
  }

}

// 由于这个地方是Demo 需要用路由对象包一层
export default withRouter(Demo) 
