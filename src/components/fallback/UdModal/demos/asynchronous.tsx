import React, { Component } from 'react'
import { Button, Switch, message } from 'antd'
import { UdModal, IUdModalContentProps } from '../../../../index'

const Demo = () => {
  return <Button type="primary" onClick={openModal}>打开弹窗</Button>
}

const openModal = () => {
  UdModal.open({
    title: "弹框异步用法",
    content: <AsynchronousComponents />,
    onOk: (value) => {
      return new Promise<void>((resolve, reject) => {
        if (value) {
          setTimeout(() => {
            message.success('成功');
            resolve()
          }, 3000)
        } else {
          setTimeout(() => {
            message.error('失败');
            reject()
          }, 3000)
        }
      })
    }
  })
}

class AsynchronousComponents extends Component<IUdModalContentProps, any> {

  constructor(props: IUdModalContentProps) {
    super(props)
    this.state = {
      checked: false,
    }
    this.props.getHandler!(this.getVal)
  }

  render() {
    return (
      <div>
        <Switch checked={this.state.checked} onChange={this.onChange} checkedChildren="成功" unCheckedChildren="失败" />
        <h3> 点击弹框确定得时候，返回的是一个Promise对象，如果resolve（成功）模态框将关闭，reject（失败）模态框则不关闭 </h3>
      </div>
    )
  }

  protected getVal = () => {
    return this.state.checked
  }

  protected onChange = (value: any) => {
    this.setState({checked: value})
  }
}

export default Demo
