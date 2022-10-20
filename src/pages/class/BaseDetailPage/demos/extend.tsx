import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Card, Alert } from 'antd'
import { http, UdDetail, BaseDetailPage, IBaseDetailPageProps, IBaseDetailPageState } from '../../../..'

class Demo extends BaseDetailPage<IDetailsProps, IDetailsState> {

  constructor(props: IDetailsProps) {
    super(props)
    this.state = {
      title: '标题',
      queryAction: () => {
        return http.post('http://10.4.100.71:7300/mock/5f1e2923354a5600202741f3/uaf/ud-detail-page/extends')
      },
      dataSource: {},
      useFooterAffix: false
    }
  }

  render() {
    return super.render({
      body: (
        <>
          <Alert message="基础详情页可自定义编写任意内容" type="success" />
          <Card size="small" title="基本配置">
            <UdDetail dataSource={this.state.dataSource} items={[
              { title: '姓名', dataIndex: 'name' },
              {
                title: '昵称', dataIndex: 'nickname', render: (text) => {
                  return '该数据是通过render设置出来的（具体可看代码）'
                }
              },
              { title: '门店位置', dataIndex: 'address', colProps: { span: 24 } },
              { title: '职位', dataIndex: 'job' },
              { title: '备注', dataIndex: 'note', colProps: { span: 24 } },
            ]} />
          </Card>
        </>
      ),
      footer: (
        <Button.Group>
          <Button onClick={() => this.props.history.goBack()} type="primary">返回</Button>
        </Button.Group>
      )
    })
  }

  // 拿到数据后处理
  protected handleDataSource = (res: any) => {
    res.data.setNewValue = '这是通过handleDataSource设置进去的值'
    return res.data
  }
}

interface IDetailsProps extends IBaseDetailPageProps<{
  id: string
}> {

}

interface IDetailsState extends IBaseDetailPageState {

}

export default withRouter(Demo) 
