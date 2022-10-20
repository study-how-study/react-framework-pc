import React from 'react'
import { withRouter } from 'react-router-dom'
import { Select, Button, message } from 'antd'
import { BaseListPage, IBaseListPageState, IBaseListPageProps } from '../../../../index'
import { http, udConfigProvider } from '../../../../core'

const token = 'eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9.eNpUkMFqhDAQht9lzgqJJtF4k6WUHrr00N6EZYxZNxIT0Ui7LPvuTbWF7nX-7_uHmRvorwkqKlghCC2kTAAncwrXSUMFr_Wxfn6CBBbTu1Mwo95RLhmXkpd5Asq7oF2I8K35Ud-j2UDV_LoNJA0sfp2Vfpv9oFU4-G4HVsR_aT1N1igMxru_NO0x6E-8bpSyJq556R7UddGzw3HvK0nGMlZsgfW9cYcLOqft5tA4dBjWGe2HM3uPlCWhpCiYoIwRTjMSocG3x3Vs9fzYeY9PGIKJZyo881zkMpWclCkjVKQo8Zy2lOUZL5noMg33bwAAAP__.Lf3fFZVnyCgn0sWmnYMRae0EW72X8yx2rewpCkw7IH4'

// udConfigProvider.http.requestBefore = (data) => {
//   data.headers.authorization = token
//   return data
// }

class Selectable extends BaseListPage<IBaseListPageProps, IBaseListPageState> {
  constructor(props: IBaseListPageProps) {
    super(props)
    this.state = {
      title: '可以勾选的列表页',
      queryApi: (data)=> {
        return http.post('https://khfoodbar-manage-test.test1919.cn/manage/v1/khfoodbar/foodbarManager/manageList', data)
      },
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
      tableProps: {
        keepSelectedRows: true
      }
    }
  }

  private submit = () => {
    console.log(this.state.selectedRowKeys)
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
export default withRouter(Selectable) 
