import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Card } from 'antd'
import { BaseDetailPage, IBaseDetailPageProps, IBaseDetailPageState, http, UdDetail } from '../../../../'

class Demo extends BaseDetailPage<IDetailsProps, IDetailsState> {

  constructor(props: IDetailsProps) {
    super(props)
    this.state = {
      title: '标题',
      queryAction: () => {
        return http.post('http://10.4.100.71:7300/mock/5f1e2923354a5600202741f3/uaf/ud-detail-page')
      },
      dataSource: {},
      useFooterAffix: false
    }
  }

  render() {
    return super.render({
      body: (
        <>
          <Card size="small" title="基本配置">
            <UdDetail dataSource={this.state.dataSource} items={[
              { title: '姓名', dataIndex: 'name' },
              { title: '工号', dataIndex: 'jobNumber' },
              { title: '电话', dataIndex: 'phone' },
              { title: '门店位置', dataIndex: 'dept' },
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

}

interface IDetailsProps extends IBaseDetailPageProps<{
  id: string
}> {

}

interface IDetailsState extends IBaseDetailPageState {

}

export default withRouter(Demo) 
