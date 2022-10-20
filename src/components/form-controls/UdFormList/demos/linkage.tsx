import React, { useState, ReactNode } from 'react'
import { Input, Select, Form, InputNumber } from 'antd'
import { UdForm, UdFormList } from '../../../../index'

const Demo = () => {

  const [form] = Form.useForm()
  const [values, setValues] = useState('')

  return (
    <>
      <UdForm
        form={form}
        initialValues={{
          user: [{ name: 'web工具人', type: 'level', typeValue: '4' }]
        }}
        items={[
          {
            name: 'user', label: '人员', render: (
              <UdFormList
                defaultRowValue={{ name: '默认姓名' }}
                items={[
                  {
                    name: 'name',
                    label: '姓名',
                  },
                  {
                    name: 'type',
                    render: (values = [], index) => {
                      return <Select style={{ minWidth: '100px' }}
                        onChange={(value) => {
                          const users = values
                          users[index]['type'] = value
                          users[index]['typeValue'] = value === 'level' ? '6' : 18
                          form.setFieldsValue({ user: users })
                        }}>
                        <Select.Option value='level'>级别</Select.Option>
                        <Select.Option value='age'>年龄</Select.Option>
                      </Select>
                    }
                  },
                  {
                    name: 'typeValue',
                    render: (values, index) => {
                      let renderNode: ReactNode = null
                      const type = values[index] ? values[index]['type'] : null
                      switch (type) {
                        case 'level':
                          renderNode = <Select style={{ minWidth: '100px' }}>
                            <Select.Option value='4'>L4</Select.Option>
                            <Select.Option value='5'>L5</Select.Option>
                            <Select.Option value='6'>L6</Select.Option>
                            <Select.Option value='7'>L7</Select.Option>
                            <Select.Option value='8'>L8</Select.Option>
                          </Select>
                          break;
                        case 'age':
                          renderNode = <InputNumber style={{ minWidth: '100px' }} min={10} max={30} />
                          break;
                        default:
                          renderNode = <Input />
                          break;
                      }
                      return renderNode
                    }
                  }
                ]}
              />
            )
          }
        ]}
        onFinish={(values) => {
          setValues(JSON.stringify(values, null, 4))
        }}
      />
      <pre>{values}</pre>
    </>
  )
}

export default Demo
