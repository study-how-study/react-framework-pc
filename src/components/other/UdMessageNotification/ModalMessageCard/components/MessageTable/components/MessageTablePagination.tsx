import _ from 'lodash'
import React, { useContext } from 'react'
import { Button, Select } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { ModalMessageCardContext } from '../../..'

/**
 * 简单分页
 * 主要用于配合后端性能优化时使用
 */
const MessageTablePagination: React.FC<IMessageTablePaginationProps> = (props) => {
  const [state, dispatch] = useContext(ModalMessageCardContext);
  const { ModalMessageCard } = state;
  
  const { loading } = ModalMessageCard;
  
  function handlePage(page: number, size?: number) {
    let currentPage: number = props.current
    const isPrev = page < 0
    if (size) {
      currentPage = 1
    } else {
      currentPage += page
    }

    props.onChange && props.onChange(currentPage, size || props.pageSize, isPrev)
  }

  
  function handlePageSizeOption(size: number) {
    props.handlePageSizeOption && props.handlePageSizeOption(size || props.pageSize)
  }

  return (
    <div className="ud-simple-pagination">
      <div className="current-page">第 {props.current} 页</div>
      <Button className="pre-btn" onClick={() => { handlePage(-1) }} disabled={props.current <= 1}><LeftOutlined />上一页</Button>
      <Button onClick={() => { handlePage(1) }} disabled={!props.hasNext} loading={loading} >下一页<RightOutlined /></Button>
      <Select
        className="size-select"
        value={_.toString(props.pageSize)}
        onChange={(value) => { handlePageSizeOption(_.toNumber(value)) }}
      >
        {props.pageSizeOption.map((item, index) => {
          return <Select.Option value={item} key={index}>{item} 条/页</Select.Option>
        })}
      </Select>
    </div>
  )
}

MessageTablePagination.defaultProps = {
  current: 1,
  pageSize: 10,
  hasNext: false,
  pageSizeOption: ['10', '20', '40', '60', '100', '150', '200']
}

interface IMessageTablePaginationProps {
  /** 
   * 当前页
   * @default 1
   */
  current?: number
  /** 
   * 一页显示多少条
   * @default 10
   */
  pageSize?: number
  /** 
   * 翻页或改变页大小回调
   */
  onChange?: (current: number, pageSize: number, isPrev: boolean) => void
  /** 
   * 可选的每页条数配置
   * @default \['10', '20', '40', '60', '100', '150', '200'\]
   */
  pageSizeOption?: string[]
  /** 
   * 是否有下一页
   */
  hasNext?: boolean,
  handlePageSizeOption: (pageSize: number) => void
}

export default MessageTablePagination
