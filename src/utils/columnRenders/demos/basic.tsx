import React from 'react'
import { Select, message } from 'antd'
import { useBaseListPage, IListRes } from '../../..'
import { columnRenders } from '..'
import { AxiosResponse } from 'axios'

const Demo: React.FC = () => {
  const { render, lifecycles } = useBaseListPage({
    title: '测试页面',
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
      { title: '编号', dataIndex: 'id', render: columnRenders.title("/other/columnRenders?id=${id}") },
      { title: '姓名', dataIndex: 'name' },
      { title: '性别', dataIndex: 'gender', render: (text) => text ? '男' : '女' },
      { title: '年龄', dataIndex: 'age' },
      { title: '邮箱', dataIndex: 'email' },
      { title: '城市', dataIndex: 'city' },
      { title: '时间', dataIndex: 'time', render: columnRenders.datetime('YYYY-MM-DD HH:mm:ss') },
      { title: '备注', dataIndex: 'cparagraph', render: columnRenders.maxShowLength(5) },
      {
        title: '状态', dataIndex: 'status', render: columnRenders.enum({
          enable: '启用',
          disable: '禁用'
        })
      },
      {
        title: '状态开关', dataIndex: 'status', render: columnRenders.switch()
      },
      {
        title: '操作',
        dataIndex: 'operate',
        minWidth: '100px',
        render: columnRenders.operate([
          {
            title: '编辑', show: (text: any, model: any) => {
              return model.status === 'enable'
            }, action: (text: any, model: any) => {
              message.success('点击了编辑')
            }
          },
          {
            title: '查看', action: (text: any, record: any) => {
              message.success('点击了查看')
            }
          },
        ])
      }
    ]
  })
  return render()
}

export default Demo

