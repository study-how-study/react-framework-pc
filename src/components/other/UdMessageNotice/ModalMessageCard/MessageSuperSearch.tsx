import { Button, Col, Form, Input, Row, Select } from "antd"
import { useForm } from "antd/lib/form/Form"
import _, { isFunction } from "lodash"
import React, { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useState } from "react"
import { UdAjaxSelect } from "../../../form-controls/UdAjaxSelect"
import { UdDateRangePicker } from "../../../form-controls/UdDateRangePicker"

const MessageSuperSearch: ForwardRefRenderFunction<IMessageSuperSearchApi, IMessageSuperSearchProps> = (props, ref) => {
  const formRef = useForm()[0]
  const [visible, setVisible] = useState<boolean>(false)

  useImperativeHandle(ref, () => {
    return {
      setVisible: (data) => { setVisible(data) },
      getValues: () => {
        return formRef.getFieldsValue()
      }
    }
  })

  const handleSearch = async () => {
    const values = await formRef.validateFields()
    props.onSearch(values)
  }
  const handleReset = () => {
    formRef.resetFields()
    const values = formRef.getFieldsValue()
    props.onSearch(values)
  }

  const sourceSystemFetch = () => {
    if (!props.messageSourceSystem) {
      return Promise.resolve({ code: 200, data: [{ label: '全部', value: 'all' }] })
    }
    if (_.isArray(props.messageSourceSystem)) {
      return Promise.resolve({ code: 200, data: props.messageSourceSystem })
    }
    if (_.isFunction(props.messageSourceSystem)) {
      const fetch = props.messageSourceSystem()
      return new Promise((resolve, reject) => {
        fetch.then(res => {
          resolve({ code: 200, data: res })
        }).catch(() => {
          reject()
        })
      })
    }

  }

  const colSpan = { xl: 12, lg: 12, md: 12, sm: 24, xs: 24 }
  return (
    <div className={visible ? "super-search" : 'super-search super-search-hidden'}>
      <Form form={formRef} labelCol={{ sm: 6, xs: 10 }} wrapperCol={{ sm: 16, xs: 13 }}>
        <Row>
          <Col {...colSpan}>
            <Form.Item name='readed' label='阅读状态' initialValue={'all'}>
              <Select className='status-select' placeholder='选择阅读状态'
              >
                <Select.Option key='all' value='all'>全部</Select.Option>
                <Select.Option key='readed' value='readed'>已读</Select.Option>
                <Select.Option key='unread' value='unread'>未读</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col {...colSpan}>
            <Form.Item label='来源系统' name='projectCode'>
              <UdAjaxSelect
                 getPopupContainer={(target) => {
                  const ele = document.getElementsByClassName('ud-message-card-modal-content')[0]
                  return ele || document.body as any
                }}
                placeholder='选择来源系统'
                query={sourceSystemFetch()}
                mapping={{ title: 'label', value: 'value' }}
                allowClear={true}
              />
            </Form.Item>
          </Col>
          {/* <Col {...colSpan}>
            <Form.Item label='消息内容' name='content'>
              <Input placeholder="输入消息内容" />
            </Form.Item>
          </Col> */}
          <Col {...colSpan}>
            <Form.Item label='创建时间' name='createTime'>
              <UdDateRangePicker timeFill={true} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className='btns'>
        <Button onClick={() => { handleSearch() }} type='primary'>搜索</Button>
        <Button onClick={() => { handleReset() }} style={{ margin: '0 10px' }}>重置</Button>
        <Button onClick={() => {
          setVisible(false)
          props.onVisibleChange(false)
        }}>取消</Button>
      </div>
    </div>
  )
}

interface IMessageSuperSearchProps {
  // onSearch: (values: {[key: string]: any})=>void
  onVisibleChange: (value) => void
  onSearch: (values: { [key: string]: any }) => void
  messageSourceSystem?: any[] | (() => Promise<any[]>)
}

export interface IMessageSuperSearchApi {
  setVisible: (visible: boolean) => void
  getValues: () => { [key: string]: any }
}

export default forwardRef(MessageSuperSearch)