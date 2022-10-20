import React from 'react'
import { BaseListPage } from '..'
import { IBaseListPageState, IBaseListPageProps } from '../typings'
import { Select } from 'antd'
import { withRouter } from 'react-router-dom'
import { http } from '../../../..'

class Demo extends BaseListPage<IDemoProps, IDemoState> {
  constructor(props: IDemoProps) {
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
      rowKey: 'id',
      columns: [
        { title: '编号', dataIndex: 'id' },
        { title: '姓名', dataIndex: 'name' },
        { title: '性别', dataIndex: 'gender', render: (text) => text ? '男' : '女' },
        { title: '年龄', dataIndex: 'age' },
        { title: '邮箱', dataIndex: 'email' },
        { title: '城市', dataIndex: 'city' },
        { title: '头像', dataIndex: 'headPortrait', render: (text) => <div style={{ width: '50px', height: '50px' }}><img src={text} alt="" /></div> },
      ],
      useHeaderAffix: false,
      saveParamsWithUrl: false,
    }
  }

  render() {
    return super.render({
      footer: (
        <div>
          <strong>当前查询参数  通过baseQueryParams属性设置了固定值只会体现在请求的参数上 </strong>
          <pre>
            {JSON.stringify(this.queryParams, null, 4)}
          </pre>
        </div>
      )
    })
  }

  protected baseQueryParams = {
    a: '这是固定参数'
  }

  protected handleDataSource = (data: any) => {
    data.forEach((v: any) => {
      v.newStr = '后去到数据后通过handleDataSource处理后的新字段'
    });

    return data
  }
}

interface IDemoState extends IBaseListPageState {

}

interface IDemoProps extends IBaseListPageProps {

}

// 由于这个地方是Demo 需要用路由对象包一层
export default withRouter(Demo) 
