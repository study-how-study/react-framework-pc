import React from 'react'
import { UdDetail } from '../../../index'

const Demo: React.FC = () => {

  const data = {
    name: 'yaoworld',
    role: ['审核人员', '前端开发', '后端开发'],
    time: '2019-12-27 15:57:28',
    id: '5e05bb9b55de437a94f00256',
    content: '{"pageNum":0,"pageSize":10,"reportSettingId":409,"alterFilterVals":{"var_start_date":"20191222","var_end_date":"20191225","var_province":"全部"},"tabNum":"0","order":null,"columnKey":null}'
  }

  return (
    <UdDetail
      items={[
        { title: '姓名', dataIndex: 'name' },
        { title: '角色', dataIndex: 'role', render: (item) => item && item.join('、') },
        { title: '入职时间', dataIndex: 'time' },
        { title: '编号', dataIndex: 'id', render: (item) => <span style={{ color: '#c41d7f' }}>{item}</span> },
        { title: 'ip', dataIndex: 'ip' },
        { title: '请求内容', dataIndex: 'content', colProps: { span: 24 } },
      ]}
      dataSource={data}
    />
  )
}

export default Demo
