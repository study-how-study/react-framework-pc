import _ from 'lodash'
import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { ClassValue } from 'classnames/types'
import { Row, Col, Card } from 'antd'
import { ColProps } from 'antd/lib/col'

/**
 * 详情展示
 */
const UdDetail: React.FC<IUdDetailProps> = (props) => {

  let { items, dataSource, title, extra, actions, inner } = props

  let nodes = items.map((item, index) => {
    let value = _.get(dataSource, item.dataIndex, null)
    if (_.isFunction(item.show) && item.show(value, dataSource, index) === false) {
      return
    }
    let nullText = item.nullText || props.nullText
    let colProps = item.colProps || props.colProps
    let node
    if (value == null || value == '') {
      node = <div className="item-content-null">{nullText}</div>
    } else {
      if (_.isFunction(item.render)) {
        node = item.render(value, dataSource, index)
      } else {
        node = <div className="item-content-default">{value}</div>
      }
    }
    return (
      <Col key={item.dataIndex} className={classNames('col-' + item.dataIndex, item.className)} {...colProps}>
        {item.title && <div className="item-title">{item.title}：</div>}
        <div className="item-content">{node}</div>
      </Col>
    )
  })

  function build() {
    let row = <Row gutter={props.rowGutter}>{nodes}</Row>
    let content = row
    if (title) {
      content = <Card title={title} extra={extra} actions={actions} bordered={inner !== true} size="small">{row}</Card>
    }
    return content
  }

  return <div className={classNames('ud-detail', props.className)}>{build()}</div>
}

UdDetail.defaultProps = {
  dataSource: {},
  inner: false,
  nullText: '--',
  rowGutter: 15,
  colProps: { xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 8 },
}

export interface IUdDetailProps {
  /** 
   * class
   * 始终会带一个 ud-detail 的 class 
   */
  className?: ClassValue
  /** 
   * 标题 
   */
  title?: ReactNode
  /** 
   * 数据源对象
   * @default {}
   */
  dataSource?: any
  /** 
   * 字段集合
   */
  items: IUdDetailItem<any>[]
  /**
   * 扩展区域
   */
  extra?: ReactNode
  /**
   * 按钮区域
   */
  actions?: ReactNode[]
  /** 
   * 父级是否为详情分组
   * @default false
   */
  inner?: boolean
  /** 
   * 内容为空时显示的内容
   * 优先级低于单独设置的
   * @default --
   */
  nullText?: ReactNode
  /** 
   * 每列间距
   * @default 15
   */
  rowGutter?: number
  /** 
   * Col Props
   * 优先级低于单独设置的
   * @default { xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 8 }
   */
  colProps?: ColProps
}

export interface IUdDetailItem<T = any> {
  /** 
   * class
   * 始终会带一个 col-{dataIndex} 的 class 
   */
  className?: ClassValue
  /** 
   * 标题 
   */
  title?: ReactNode
  /** 
   * 字段名 
   */
  dataIndex: string
  /** 
   * 内容为空时显示的内容 
   */
  nullText?: ReactNode
  /** 
   * 是否显示 
   */
  show?: (text: any, model: T, index: number) => boolean
  /** 
   * render函数
   * @default 普通文本显示
   */
  render?: (text: any, model: T, index: number) => React.ReactNode
  /** 
   * Col Props
   */
  colProps?: ColProps
}

export { UdDetail }
