import React from 'react'
import { Button, Form } from 'antd'
import { UdForm, UdModal } from '../../../../index'

const Demo: React.FC = () => {

  const modal = UdModal.useStepsModal()
  const [form1] = Form.useForm()

  const clean = () => {
    // useStepsModal 只会清理他内部的状态，而外部的状态则需要用户自己清理
    form1.resetFields()
  }

  return (
    <Button.Group>
      <Button type="primary" onClick={() => modal.setVisible(true)}>打开弹窗</Button>
      {modal.render({
        modalProps: { title: '测试步骤模态框标题', onCancel: clean },
        stepsProps: {},
        steps: [
          {
            title: '登录', content: (
              <UdForm
                items={[
                  { label: '账号', name: 'username', required: true },
                  { label: '密码', name: 'password', required: true },
                ]}
                btns={null}
              />
            ),
            // 组件内部会自动从 UdForm 验证并获取数据，给到 formValues 变量上
            next: (dataset, formValues) => { dataset.current.userInfos = formValues }
          },
          {
            title: '基本信息', content: (
              <div>
                <p>自己处理数据</p>
                <UdForm
                  form={form1}
                  items={[
                    { label: '城市', name: 'city', required: true },
                    { label: '详细地址', name: 'address', required: true },
                  ]}
                  btns={null}
                />
              </div>
            ),
            next: (dataset) => form1.validateFields().then(values => dataset.current.baseInfos = values)
          },
          {
            title: '完成', content: (
              <>
                <h1>完成</h1>
                <pre>{JSON.stringify(modal.dataset.current, null, 2)}</pre>
              </>
            ), next: () => new Promise((resolve, reject) => {
              console.log('模拟调用接口')
              setTimeout(() => resolve(), 2000)
            })
          },
        ]
      })}
    </Button.Group>
  )
}

export default Demo
