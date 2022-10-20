import _ from 'lodash'
import React from 'react'
import { Button, Select } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

/**
 * 简单分页
 * 主要用于配合后端性能优化时使用
 */
const UdSequencePager: React.FC<IUdSequencePagerProps> = (props) => {
  let cfg: IUdSequencePagerProps = _.defaultsDeep({}, props, UdSequencePager.defaultProps)

  function handleChange(direction: 'NEXT' | 'PREVIOUS', dataId: string | number, size?: number) {
    const value = {
      direction, dataId, size: size || cfg.pageSize
    }
    cfg.onChange && cfg.onChange(value)
  }

  return (
    <div className="ud-equence-pager">
      {
        !!cfg.numberOfElements &&
        <div className="current-page">当前页共 {cfg.numberOfElements || 0} 条</div>
      }
      <Button className="pre-btn" onClick={() => { handleChange('PREVIOUS', cfg.firstDataId) }} disabled={!cfg.hasPrevious}><LeftOutlined />上一页</Button>
      <Button onClick={() => { handleChange('NEXT', cfg.lastDataId) }} disabled={!cfg.hasNext} >下一页<RightOutlined /></Button>
      <Select
        className="size-select"
        value={_.toString(cfg.pageSize)}
        onChange={(value) => { handleChange('NEXT', null, _.toNumber(value)) }}
      >
        {(cfg.pageSizeOption as any[]).map((item: any) => {
          return <Select.Option value={item}>{item} 条/页</Select.Option>
        })}
      </Select>
    </div>
  )
}

UdSequencePager.defaultProps = {
  firstDataId: null,
  lastDataId: null,
  pageSize: 10,
  hasNext: false,
  hasPrevious: false,
  numberOfElements: 0,
  pageSizeOption: ['10', '20', '40', '60', '100', '150', '200']
}

interface IUdSequencePagerProps {

  /** 
   * 一页显示多少条
   * @default 10
   */
  pageSize?: number
  /**
   * 当前返回的数据条数
   */
  numberOfElements: number
  /** 
   * 翻页或改变页大小回调
   */
  onChange?: (value: ISequencePageRequestVo) => void
  /** 
   * 可选的每页条数配置
   * @default \['10', '20', '40', '60', '100', '150', '200'\]
   */
  pageSizeOption?: string[] | number[]
  /** 
   * 是否有下一页
   */
  hasNext?: boolean

  /** 
   * 是否有上一页
   */
  hasPrevious?: boolean

  /**
   * 第一条数据的id
   *  */
  firstDataId: number | string | null

  /**
   * 最后一条条数据的id
   **/
  lastDataId: number | string | null
}

export interface ISequencePageRequestVo {
  /**
   * 请求数据的方向， NEXT-下一页 , PREVIOUS-上一页
   **/
  direction: 'NEXT' | 'PREVIOUS',
  /**
   * 用于深度查询开始的id 查询上一页时为返回数据记录第一条数据id， 查询下一页时为返回数据记录最后一条数据id
   **/
  dataId: number | string | null,
  /**
   * 一页多少条
   **/
  size: number
}

export { UdSequencePager }


// TODO: 组件更名为 序列分页     考虑对接BaseListPage    普通分页模式和前端分页模式除外，禁用排序 
