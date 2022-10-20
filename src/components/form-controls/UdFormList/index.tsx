import _ from 'lodash'
import React, { useEffect, ReactNode } from 'react'
import { Form, Space, Input, Button, Tooltip } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { FormItemProps } from 'antd/lib/form'
import { ButtonProps } from 'antd/lib/button'
import { SpaceProps } from 'antd/lib/space'

/**
 * 动态可增减嵌套表单控件
 */
const UdFormList: React.FC<IUdFormListProps> = (props) => {

  useEffect(() => {
    props.onChange && _.isFunction(props.onChange) && props.onChange(props.value)
  }, [props.value])

  const itemRender = (item: IUdFormListItem, rowKey: number) => {
    let Control: any
    const propsValue = props.value || []
    if (item.render) {
      if (_.isFunction(item.render)) {
        Control = item.render(propsValue, rowKey)
      } else {
        Control = item.render
      }
    } else {
      Control = <Input />
    }
    const defaultProps: any = {
      placeholder: `请输入${item.label || ''}`,
    }
    return React.cloneElement(Control, defaultProps)
  }

  return (
    <Form.List name={props.id!}>
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map(field => (
              <Space key={field.key} {...props.spaceProps}>
                {
                  props.items.map((item: IUdFormListItem) => {
                    return (
                      <Form.Item
                        {...field}
                        name={[field.name, item.name]}
                        fieldKey={[field.fieldKey, 'first']}
                        rules={item.rules || []}
                        label={item.label || ''}
                      >
                        {itemRender(item, field.name)}
                      </Form.Item>
                    )
                  })
                }
                {
                  !props.readonly &&
                  <Tooltip title="删除">
                    <MinusCircleOutlined
                      style={props.spaceProps?.align == 'start' ? { transform: 'translate(0px, 4px)' } : {}}
                      onClick={() => { remove(field.name) }}
                    />
                  </Tooltip>
                }

              </Space>
            ))}
            {
              !props.readonly &&
              <Form.Item noStyle={true}>
                <Button
                  block={true}
                  type="dashed"
                  onClick={() => { add(_.cloneDeep(props.defaultRowValue)) }}
                  {...props.addButtonProps}
                >
                  <PlusOutlined />{props.addButtonText}
                </Button>
              </Form.Item>
            }
          </div>
        )
      }}
    </Form.List>
  )
}

UdFormList.defaultProps = {
  items: [],
  addButtonText: '添加',
  addButtonProps: {},
  defaultRowValue: {},
  spaceProps: { align: 'start' },
  readonly: false
}

export interface IUdFormListItem extends Partial<FormItemProps> {
  /**
   * 列的字段名
   */
  name: string
  /**
   * 列的控件名
   */
  label?: string
  /**
   * 控件内容，不传默认渲染 Input
   * @default Input
   * @type ReactNode | ((values: any, rowKey: number) => ReactNode)
   */
  render?: ReactNode | ((values: any, rowKey: number) => ReactNode)
}

export interface IUdFormListProps {
  /**
   * 不传，表单会自动注入
   * @ignore
   */
  id?: string
  /**
   * 不传，表单会自动注入
   * @ignore
   */
  value?: string[]
  /**
   * 控件集合配置
   * @default []
   */
  items: IUdFormListItem[]
  /**
   * 控件值发生改变时
   * @param value : 控件值，类型为 数组
   */
  onChange?: (value: any) => void
  /**
   * 添加按钮文本
   * @default 添加
   */
  addButtonText?: ReactNode
  /**
   * 添加按钮属性
   * @type ButtonProps
   * @default {}
   */
  addButtonProps?: ButtonProps
  /**
   * 添加行时，生成的行的默认值
   * @default {}
   */
  defaultRowValue?: any
  /**
   * 每行间隔配置
   * @default { align: 'start' }
   */
  spaceProps?: SpaceProps
  readonly?: boolean
}

export { UdFormList }
