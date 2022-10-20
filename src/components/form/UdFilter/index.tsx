import React, { useState, useRef, useEffect } from 'react'
import { Row, Form, Button, Col } from 'antd'
import { FormInstance } from 'antd/lib/form'
import { Store } from 'antd/lib/form/interface'
import { Icon } from '@ant-design/compatible'
import { IUdFormItem, UdFormItem, formUtils, useSize, colUtils, IColSpan } from '../../..'

/**
 * 检索条件过滤器
 */
const UdFilter: React.FC<IUdFilterProps> = (props) => {

  const [expand, setExpand] = useState(false)

  let containerRef = useRef<HTMLElement>()
  let form = props.form ? props.form : Form.useForm()[0]

  let size = useSize(containerRef)

  function handleFinish(values: Store) {
    if (props.onSearch) {
      let items = formUtils.handleValues(values, props.keepEmptyValueItem)
      props.onSearch(items)
    }
  }

  function handleReset() {
    form.resetFields()
    if (props.onReset) {
      props.onReset(form)
    }
    if (props.searchAfterReset) {
      let values = form.getFieldsValue()
      handleFinish(values)
    }
  }

  useEffect(() => {
    if (props.getForm) {
      props.getForm(form)
    }
  }, [])

  let standardSpan = props.colSpan ? colUtils.calcSpan(size.width, props.colSpan, 8) : 8
  let rowTotal = 1
  let rowSpanCount = 0

  return (
    <div ref={(ref) => containerRef.current = ref!} className="ud-filter">
      <Form form={form} initialValues={props.initialValues} onFinish={handleFinish}>
        <Row className="ud-filter-body" gutter={24}>
          {
            props.items.map((item, index) => {
              let span = standardSpan
              if (item.col) {
                span = colUtils.calcSpan(size.width, item.col, standardSpan)
              }
              if (props.useFold) {
                if (rowSpanCount + span > 24) {
                  rowSpanCount = span
                  rowTotal++
                } else {
                  rowSpanCount += span
                }
              }
              return (
                <Col
                  key={formUtils.getItemKey(item, index)} span={span}
                  style={{ display: !props.useFold || expand || rowTotal <= props.minRowNumber! ? 'block' : 'none' }}
                >
                  <UdFormItem form={form} {...item} />
                </Col>
              )
            })
          }
        </Row>
        <div className="ud-filter-footer">
          <Button type="primary" htmlType="submit" loading={props.loading}>{props.searchBtnText}</Button>
          {props.useResetBtn && <Button type="default" htmlType="reset" disabled={props.loading} onClick={handleReset}>重置</Button>}
          {
            props.useFold && (rowTotal > props.minRowNumber!) && (
              <Button
                type="default" icon={<Icon type={expand ? 'caret-up' : 'caret-down'} />}
                onClick={() => setExpand(!expand)}>
                {expand ? '收起' : '展开'}
              </Button>
            )
          }
        </div>
      </Form>
    </div>
  )
}

UdFilter.defaultProps = {
  searchAfterReset: true,
  colSpan: {
    span: 8,
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 8,
    xxl: 6
  },
  minRowNumber: 2,
  keepEmptyValueItem: false,
  searchBtnText: '搜索',
  useFold: true,
  useResetBtn: true
}

export interface IUdFilterProps {
  /**
   * 表单对象
   * 如果不传，内部会生成一个。
   */
  form?: FormInstance
  /**
   * 获取表单Ref对象
   * 该方法只针对Class组件的时候获取表单的ref。hooks则用上面的方式获取即可
   */
  getForm?: (ref: FormInstance) => void
  /**
   * 表单项集合
   * @type IUdFormItem[]
   */
  items: IUdFormItem[]
  /**
   * 表单初始值
   */
  initialValues?: Store
  /**
   * 点击搜索按钮
   */
  onSearch?: (values: Store) => void
  /**
   * 重置事件
   */
  onReset?: (form?) => void
  /** 
   * 加载状态 
   */
  loading?: boolean
  /**
   * items默认列配置
   * @default { span: 8, xs: 24, sm: 24, md: 12, lg: 12, xl: 8, xxl: 6 }
   */
  colSpan?: IColSpan
  /**
   * 超过多少行隐藏
   * @default 2
   */
  minRowNumber?: number
  /**
   * 重置后是否重新发起搜索
   * @default true
   */
  searchAfterReset?: boolean
  /**
   * 保留值为空的item
   * @default false
   */
  keepEmptyValueItem?: boolean
  /**
   * 使用重置按钮
   * @default true
   */
  useResetBtn?: boolean
  /**
   * 搜索按钮文字
   * @default 搜索
   */
  searchBtnText?: string
  /** 
   * 是否使用折叠功能 
   * @default true
   */
  useFold?: boolean
}

export { UdFilter }