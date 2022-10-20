import React from 'react'
import { withRouter } from 'react-router-dom'
import { Select, Button, message, Alert } from 'antd'
import { BaseListPage } from '..'
import { IBaseListPageState, IBaseListPageProps } from '../typings'

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
      ],
      useHeaderAffix: false,
      saveParamsWithUrl: false,
      leftBtns: [<Button onClick={this.submitData}>提交选中数据</Button>],
      rigthBtns: [<Button onClick={this.add} type="primary">新增</Button>],
    }
  }

  render() {
    return super.render({
      header: (
        <div style={{ marginBottom: '10px' }}>
          <Alert message="自定义页头下方区域" type="info" />
        </div>
      ),
      filterBelow: (
        <div style={{ marginBottom: '10px' }}>
          <Alert message={'勾选了：' + (this.state.selectedRowKeys && this.state.selectedRowKeys.length)} type="success" />
        </div>
      ),
      buttonBelow: <div style={{lineHeight: '40px'}}>
          <Alert message="自定义列表按钮下方区域" type="error" />
      </div>,
      footer: (
        <div>
          <Alert message="自定义页面底部区域" type="warning" />
        </div>
      )
    })
  }

  private submitData = () => {
    const { selectedRowKeys } = this.state
    if (!selectedRowKeys || selectedRowKeys.length <= 0) {
      return message.warning('请选择需要提交的数据')
    }
    message.success('选中的id为：' + selectedRowKeys)
  }

  private add = () => {
    message.success('点击新增')
  }

  private edit = () => {
    message.success('点击了编辑')
  }

}

interface IDemoState extends IBaseListPageState {

}

interface IDemoProps extends IBaseListPageProps {

}

export default withRouter(Demo) 
