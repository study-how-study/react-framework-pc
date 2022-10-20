import _ from 'lodash'
import React, { ReactNode, useState, useEffect } from 'react'
import classNames from 'classnames'
import { ClassValue } from 'classnames/types'
import { Form, Button, Row, Col } from 'antd'
import { FormProps } from 'antd/lib/form'
import { ColProps } from 'antd/lib/col'
import { Store } from 'antd/lib/form/interface'
import { FormLayout, FormInstance } from 'antd/lib/form/Form'
import { Modify, UdFormItem, IUdFormItem, formUtils } from '../../..'

const UdForm: IUdForm = React.forwardRef<FormInstance, IUdFormProps>((props, ref) => {

  let { layout, wrapperCol, labelCol, tailFormItemLayout } = props
  const [form] = props.form ? [props.form] : Form.useForm()
  const [initialValues] = useState<any>(formUtils.handleInitialValues(props.initialValues, props.items))

  useEffect(() => {
    if ((props as any).getHandler) {
      (props as any).getHandler(() => form.validateFields())
    }
  }, [])

  useEffect(() => {
    formUtils.setValues(form, props.items, props.values)
  }, [props.values])

  function handleLayout() {
    layout = layout || 'horizontal'
    labelCol = labelCol || (UdForm.defaultLayouts as any)[layout].labelCol
    wrapperCol = wrapperCol || (UdForm.defaultLayouts as any)[layout].wrapperCol
    tailFormItemLayout = tailFormItemLayout || (UdForm.defaultLayouts as any)[layout].tailFormItemLayout
  }

  function handleFinish(values: Store) {
    if (props.onFinish) {
      let items = formUtils.handleValues(values, props.keepEmptyValueItem, props.valueUseTrim)
      props.onFinish(items)
    }
  }

  function buildBody() {
    if (layout == 'grid') {
      return (
        <Row className="ud-form-body" gutter={16}>
          {
            props.items && props.items.map((item, index) => {
              if (item) {
                return (
                  <Col
                    key={formUtils.getItemKey(item, index)}
                    {...wrapperCol}
                    {...item.col}
                  >
                    <UdFormItem form={form} {...item} labelCol={undefined} />
                  </Col>
                )
              }
            })
          }
          {props.children}
        </Row>
      )
    } else {
      let items = props.items && props.items.map(item => {
        if (item) {
          return <UdFormItem form={form} labelCol={labelCol} wrapperCol={wrapperCol} {...item} />
        }
      })
      if (layout == 'inline') {
        return <>{items}{props.children}</>
      } else {
        return <div className="ud-form-body">{items}{props.children}</div>
      }
    }
  }

  function buildBtns() {
    if (props.btns) {
      let btn = props.btns
      if (_.isString(props.btns)) {
        btn = <Button htmlType="submit" type="primary">{props.btns}</Button>
      } else if (_.isArray(props.btns)) {
        if (_.find(props.btns, (n: any) => {
          return n == null || n.type == null || (n.type.displayName != 'Button' && n.type.displayName != 'UdButton')
        }) == null) {
          btn = <Button.Group>{btn}</Button.Group>
        }
      }
      return (
        <div className="ud-form-btns">
          <Form.Item wrapperCol={tailFormItemLayout}>{btn}</Form.Item>
        </div>
      )
    }
  }

  handleLayout()

  const { items, btns, ...stdProps } = props // 避免把多余的props，不然这些props体现在最终的html结构上。

  return (
    <Form
      {...stdProps}
      ref={ref}
      layout={layout as FormLayout}
      form={form}
      initialValues={initialValues}
      className={classNames('ud-form', props.className)}
      onFinish={handleFinish}
    >
      {props.header && <div className="ud-form-header">{props.header}</div>}
      {buildBody()}
      {buildBtns()}
      {props.footer && <div className="ud-form-footer">{props.footer}</div>}
    </Form>
  )
}) as IUdForm

UdForm.defaultProps = {
  keepEmptyValueItem: false,
  valueUseTrim: true,
  layout: 'horizontal',
  btns: '提交'
}

UdForm.defaultLayouts = {
  horizontal: {
    labelCol: {
      xs: 24,
      sm: 24,
      md: 5,
      lg: 5,
      xl: 3,
      xxl: 3
    },
    wrapperCol: {
      xs: 24,
      sm: 24,
      md: 18,
      lg: 15,
      xl: 12,
      xxl: 12
    },
    tailFormItemLayout: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 24,
        offset: 0,
      },
      md: {
        span: 18,
        offset: 5,
      },
      lg: {
        span: 15,
        offset: 5,
      },
      xl: {
        span: 12,
        offset: 3,
      },
      xxl: {
        span: 12,
        offset: 3,
      }
    }
  },
  grid: {
    wrapperCol: { span: 8 },
    tailFormItemLayout: { span: 24 }
  },
  vertical: {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
    tailFormItemLayout: { span: 24 },
  },
  inline: {}
}

export interface IUdFormLayout {
  labelCol?: ColProps
  wrapperCol?: ColProps
  tailFormItemLayout?: ColProps
}

export interface IUdForm extends React.ForwardRefExoticComponent<IUdFormProps & React.RefAttributes<FormInstance>> {
  defaultLayouts: {
    horizontal: IUdFormLayout
    grid: IUdFormLayout
    vertical: IUdFormLayout
    inline: IUdFormLayout
  }
}

export interface IUdFormProps extends Modify<FormProps, {
  /**
   * 不管传没穿，都会有一个 ud-form
   */
  className?: ClassValue
  /**
   * 布局方式
   * 目前对inline支持不好，正在开发中。
   */
  layout?: UdFormLayout
}> {
  /**
   * 初始值
   * 仅在表单首次渲染前赋值有效
   */
  initialValues?: Store
  /** 
   * 表单项集合
   * @type IUdFormItem[]
   */
  items?: (IUdFormItem | null | false)[]
  /** 
   * 设置表单的值
   * 推荐使用表单实例对象操作
   */
  values?: Store
  /**
   * 保留值为空的item
   * @default false
   */
  keepEmptyValueItem?: boolean
  /**
   * string 类型的value是否去掉前后空格
   * @default true
   */
  valueUseTrim?: boolean
  /**
   * 布局方式，新增grid布局
   */
  layout?: UdFormLayout
  /**
   * 表单项占比
   * 在layout=grid时，此配置的优先级低于单个表单项上的col配置
   */
  wrapperCol?: ColProps
  /**
   * label占比
   * 在layout=grid时无效
   */
  labelCol?: ColProps
  /**
   * 末尾表单项布局设置
   */
  tailFormItemLayout?: ColProps
  /**
   * 表单按钮
   * 如果只传入一个string，则表示一个提交按钮，text为传入值。
   * @default 提交
   * @type string | ReactNode | ReactNode[] | null
   */
  btns?: string | ReactNode | ReactNode[] | null
  /**
   * 头部
   * 插槽属性
   */
  header?: ReactNode
  /**
   * 底部
   * 插槽属性
   */
  footer?: string | ReactNode
}

export type UdFormLayout = 'horizontal' | 'inline' | 'vertical' | 'grid'

export { UdForm }